export interface Evidence {visited?:number;attempts:number;cases:number[];passedAt?:number;reviewedAt?:number}
export type Progress=Record<string,Evidence>;
const KEY='neurallab.beginner.v1';
export function readProgress(storage:Pick<Storage,'getItem'>):Progress{
 try{const parsed=JSON.parse(storage.getItem(KEY)||'{}');if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return {};const out:Progress={};for(const [id,v] of Object.entries(parsed)){const e=v as Evidence;if(e&&Number.isInteger(e.attempts)&&e.attempts>=0&&Array.isArray(e.cases)&&e.cases.every(x=>x===0||x===1)&&[e.visited,e.passedAt,e.reviewedAt].every(x=>x===undefined||(typeof x==='number'&&Number.isFinite(x)&&x>=0)))out[id]=e;}return out;}catch{return {};}
}
export function writeProgress(storage:Pick<Storage,'setItem'>,progress:Progress){try{storage.setItem(KEY,JSON.stringify(progress));return true;}catch{return false;}}
export function recordPractice(progress:Progress,id:string,index:number,correct:boolean,now:number):Progress{
 const old=progress[id]||{attempts:0,cases:[]};const cases=correct&&!old.cases.includes(index)?[...old.cases,index]:old.cases;
 return {...progress,[id]:{...old,attempts:old.attempts+1,cases,passedAt:cases.includes(0)&&cases.includes(1)?old.passedAt??now:undefined}};
}
export function dueForReview(e:Evidence,now:number){return !!e.passedAt&&now-(e.reviewedAt??e.passedAt)>=86_400_000;}
