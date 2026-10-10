/** Four distinct evidence states; see docs/missions/LEARNING_MISSIONS.md section 2.
 *  completed = visited/attempts · assisted = passedAt · independent = independentAt
 *  retained   = independentAt plus a later successful scheduled recall (derived in the UI). */
export interface Evidence {visited?:number;attempts:number;cases:number[];passedAt?:number;reviewedAt?:number;hints?:number;independentCases?:number[];independentAt?:number}
export type Progress=Record<string,Evidence>;
const KEY='neurallab.beginner.v1';
const pair=(cases:number[])=>cases.includes(0)&&cases.includes(1);
const indexList=(value:unknown)=>Array.isArray(value)&&value.every(x=>x===0||x===1)&&new Set(value as number[]).size===value.length;
const time=(x:unknown)=>x===undefined||(typeof x==='number'&&Number.isFinite(x)&&x>=0);
export function readProgress(storage:Pick<Storage,'getItem'>):Progress{
 try{
  const parsed=JSON.parse(storage.getItem(KEY)||'{}');
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return {};
  const out:Progress={};
  for(const [id,v] of Object.entries(parsed)){
   const e=v as Evidence;
   if(!e||!Number.isInteger(e.attempts)||e.attempts<0)continue;
   if(!indexList(e.cases)||e.attempts<e.cases.length)continue;
   if(e.passedAt&&!pair(e.cases))continue;
   if(![e.visited,e.passedAt,e.reviewedAt,e.independentAt].every(time))continue;
   if(e.hints!==undefined&&!(Number.isInteger(e.hints)&&e.hints>=0&&e.hints<=4))continue;
   // Independent cases are a subset of passed cases, and independentAt implies both of them.
   if(e.independentCases!==undefined){
    if(!indexList(e.independentCases))continue;
    if(!e.independentCases.every(i=>e.cases.includes(i)))continue;
   }
   if(e.independentAt&&!pair(e.independentCases||[]))continue;
   out[id]=e;
  }
  return out;
 }catch{return {};}
}
export function writeProgress(storage:Pick<Storage,'setItem'>,progress:Progress){try{storage.setItem(KEY,JSON.stringify(progress));return true;}catch{return false;}}
/** `hints` is the highest hint level reached during this attempt (0 = unaided). */
export function recordPractice(progress:Progress,id:string,index:number,correct:boolean,now:number,hints=0):Progress{
 const old=progress[id]||{attempts:0,cases:[]};
 const level=Math.max(0,Math.min(4,Math.round(Number.isFinite(hints)?hints:0)));
 const cases=correct&&!old.cases.includes(index)?[...old.cases,index]:old.cases;
 const oldIndependent=old.independentCases||[];
 const independentCases=correct&&level===0&&!oldIndependent.includes(index)?[...oldIndependent,index]:oldIndependent;
 return {...progress,[id]:{
  ...old,attempts:old.attempts+1,cases,
  hints:Math.max(old.hints??0,level),
  independentCases,
  passedAt:pair(cases)?old.passedAt??now:undefined,
  independentAt:pair(independentCases)?old.independentAt??now:undefined,
 }};
}
export function dueForReview(e:Evidence,now:number){return !!e.passedAt&&now-(e.reviewedAt??e.passedAt)>=86_400_000;}
export type EvidenceState='new'|'visited'|'attempted'|'assisted'|'independent'|'retained';
/** `recalled` is true when a scheduled recall card for this topic was rated after independent success. */
export function evidenceState(e:Evidence|undefined,recalled=false):EvidenceState{
 if(!e)return 'new';
 if(e.independentAt)return recalled?'retained':'independent';
 if(e.passedAt)return 'assisted';
 if(e.attempts)return 'attempted';
 return e.visited?'visited':'new';
}
export const EVIDENCE_LABEL:Record<EvidenceState,string>={
 new:'New',visited:'Visited',attempted:'Attempted',
 assisted:'Passed with help',independent:'Passed unaided',retained:'Recalled later',
};
