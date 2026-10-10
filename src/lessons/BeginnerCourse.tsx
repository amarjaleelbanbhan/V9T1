import {LessonLearning} from '../components/LessonLearning';
import {StagePlayer} from '../components/StagePlayer';
import {useLearning,updateLearning} from '../course/useLearning';
import {practiceEvent,dueCards,recalledAfterIndependent} from '../course/learning';
import {courseCalculationPython} from '../python/courseStages';
import {usePythonProgram} from '../python/usePythonProgram';
import {ChapterReview} from './ChapterReview';
import {useEffect,useState} from 'react';
import {beginnerChapters,beginnerLessons} from '../course/catalog';
import type {Lesson,Calculation} from '../course/types';
import {closeAnswer} from '../engine/beginner';
import {diagnose} from '../course/diagnostics';
import {hintLadder,hintEvidenceNote,type HintLevel} from '../course/hints';
import {readProgress,recordPractice,writeProgress,evidenceState,EVIDENCE_LABEL,type Progress} from '../course/progress';
const fmt=(n:number)=>Number(n.toFixed(5)).toString();
function TraceVisual({calc,step,partial=false}:{calc:Calculation;step:number;partial?:boolean}){
 const shown=calc.stages.slice(0,step+1);const numeric=shown.map(s=>typeof s.value==='number'?Math.abs(s.value):0);const scale=Math.max(1,...numeric);
 return <div className="course-visual"><svg viewBox={`0 0 620 ${shown.length*54+30}`} role="img" aria-label="Computed stage values; signed numbers are labeled, bar lengths show magnitude">{shown.map((s,i)=><g key={i} className={i===step?'stage-current':undefined}><text x="12" y={i*54+23} fill="currentColor" fontSize="12">{s.label}</text>{typeof s.value==='number'?<><rect x="260" y={i*54+7} width={Math.max(2,Math.abs(s.value)/scale*255)} height="25" rx="5" fill={s.value<0?'var(--error)':'var(--input)'}/><text x="530" y={i*54+25} fill="currentColor" fontSize="13">{fmt(s.value)}</text></>:<text x="260" y={i*54+25} fill="currentColor" fontSize="10">{String(s.value).slice(0,42)}</text>}</g>)}</svg>
 {!partial&&calc.cells&&<table aria-label="Computation grid"><tbody>{calc.cells.map((row,i)=><tr key={i}>{row.map((v,j)=><td key={j}>{fmt(v)}</td>)}</tr>)}</tbody></table>}
 {!partial&&calc.curve&&<svg viewBox="0 0 620 220" role="img" aria-label="Function graph with labeled endpoints"><path d="M35 15V185H590" stroke="currentColor" fill="none"/>{(()=>{const ys=calc.curve!.map(p=>p[1]);const lo=Math.min(...ys),hi=Math.max(...ys);const xs=calc.curve!.map(p=>p[0]);const x0=Math.min(...xs),x1=Math.max(...xs);return <><polyline points={calc.curve!.map(([x,y])=>`${35+(x-x0)/(x1-x0)*540},${180-(y-lo)/(hi-lo||1)*150}`).join(' ')} fill="none" stroke="var(--gradient)" strokeWidth="3"/><text x="35" y="205" fill="currentColor">x {fmt(x0)} → {fmt(x1)}</text><text x="330" y="205" fill="currentColor">y range {fmt(lo)} → {fmt(hi)}</text></>;})()}</svg>}
 <table className="course-stage-table" aria-label="Exact inspected values"><thead><tr><th>Operation</th><th>Value</th></tr></thead><tbody>{shown.map((s,i)=><tr key={i} className={i===step?'stage-current':undefined}><th>{s.label}</th><td>{typeof s.value==='number'?fmt(s.value):s.value}</td></tr>)}</tbody></table></div>;
}
function LessonWorkspace({lesson,onPractice,onOpen,onSelect,python}:{lesson:Lesson;onSelect:(id:string)=>void;onPractice:(index:number,correct:boolean,hints:number)=>void;onOpen:(id:string)=>void;python:ReturnType<typeof usePythonProgram<Calculation>>}){
 useEffect(()=>()=>python.reset(),[]);
 const [caseIndex,setCaseIndex]=useState(0);const [values,setValues]=useState(lesson.cases[0].values.map(String));const [guess,setGuess]=useState('');const [calc,setCalc]=useState<Calculation|null>(null);const [revealed,setRevealed]=useState(false);const [hint,setHint]=useState(0);const [step,setStep]=useState(0);const [choice,setChoice]=useState<number|null>(null);const [message,setMessage]=useState('');const [custom,setCustom]=useState(false);const [restated,setRestated]=useState('');
 const clear=()=>{setCalc(null);setRevealed(false);setHint(0);setStep(0);setChoice(null);setMessage('');setRestated('');};
 const reset=(i:number)=>{python.reset();setCaseIndex(i);setValues(lesson.cases[i].values.map(String));setGuess('');setCustom(false);clear();};
 const numbers=values.map(v=>v.trim()?Number(v):NaN);
 const safe=numbers.map(v=>Number.isFinite(v)?v:0);
 /** One shared execution of the authored Python program; hints and the reveal both use it. */
 const runCalc=async():Promise<Calculation|null>=>{
  if(calc)return calc;
  setMessage('');
  try{
   if(numbers.some(v=>!Number.isFinite(v)||Math.abs(v)>1e6))throw Error('Use finite inputs within ±1,000,000.');
   const result=await python.run(courseCalculationPython(lesson.model,numbers),lesson.model==='precision');
   if(result===null)return null;
   setCalc(result);return result;
  }catch(e){setCalc(null);setMessage(String(e));return null;}
 };
 const reveal=async()=>{const result=await runCalc();if(!result)return;setRevealed(true);setStep(0);setChoice(null);setMessage('Executed Python. Inspect the visual operations before checking your explanation.');};
 const requestHint=async(level:HintLevel)=>{
  let current=calc;
  if(level>=3){current=await runCalc();if(!current)return;}
  setHint(old=>Math.max(old,level));
  if(level===4&&current){setRevealed(true);setStep(current.stages.length-1);}
 };
 const ladder=hintLadder(lesson,safe,calc);
 const final=!!calc&&revealed&&step===calc.stages.length-1;
 const validPrediction=!!guess.trim()&&Number.isFinite(Number(guess));
 const numeric=!!calc&&validPrediction&&closeAnswer(Number(guess),calc.result);
 const diagnostic=calc&&revealed?diagnose(Number(guess),calc,lesson,safe):null;
 const canSubmit=final&&choice!==null;
 return <article aria-label="Beginner lesson"><p className="eyebrow">{lesson.id} · ORIGINAL GUIDED LESSON</p><h2>{lesson.title}</h2><dl className="vocabulary-grid">{lesson.terms.map(([word,meaning])=><div key={word}><dt>{word}</dt><dd>{meaning}</dd></div>)}</dl><p className="foundation-copy">{lesson.explanation}</p><p className="foundation-note">Why it matters: {lesson.why}</p><p className="formula">{lesson.formula}</p>
 <div className="foundation-choices"><button aria-pressed={caseIndex===0&&!custom} onClick={()=>reset(0)}>Worked case</button><button aria-pressed={caseIndex===1&&!custom} onClick={()=>reset(1)}>Transfer case</button>{lesson.lab&&<button onClick={()=>onOpen(lesson.lab!)}>Open related interactive lab</button>}</div>
 <p>{custom?'Sandbox inputs; no course evidence is earned.':'Course case inputs are shown below. Change an input to enter the sandbox.'} Predict {lesson.target} before revealing the calculation.</p><div className="basics-inputs">{values.map((value,i)=><label key={i}>{lesson.labels[i]||`Input ${i+1}`}<input className="python-input" type="number" step="any" value={value} onChange={e=>{python.reset();setValues(old=>old.map((v,j)=>i===j?e.target.value:v));setCustom(true);setGuess('');clear();}}/></label>)}<label>Your prediction<input className="python-input" type="number" step="any" value={guess} disabled={revealed||python.busy} onChange={e=>setGuess(e.target.value)}/></label></div>
 <section className="hint-ladder foundation-panel" aria-label="Progressive hints"><p className="eyebrow">STUCK? ASK FOR ONE STEP AT A TIME</p>
  <p data-testid="hint-note">{hintEvidenceNote(hint)}</p>
  {ladder.slice(0,hint).map(h=><div key={h.level} className="hint-step"><h4>Hint {h.level}: {h.title}</h4><p className="hint-body">{h.body}</p></div>)}
  <button className="hint-request" disabled={hint>=4||python.busy||(hint===3&&!validPrediction)} onClick={()=>requestHint(Math.min(4,hint+1) as HintLevel)}>{hint>=4?'All hints shown':`Show hint ${hint+1}: ${ladder[hint].title}`}</button>
  {hint===3&&!revealed&&<p className="hint-body">Later operations stay hidden. Enter a finite prediction before revealing the worked solution.</p>}
 </section>
 <div className="python-actions"><button disabled={python.busy||revealed||!guess.trim()||!Number.isFinite(Number(guess))} onClick={reveal}>Reveal calculation</button><button disabled={!python.busy} onClick={()=>{python.cancel();clear();}}>Cancel Python calculation</button>{revealed&&calc&&<><button disabled={step===0} onClick={()=>setStep(s=>s-1)}>Previous operation</button><button disabled={final} onClick={()=>setStep(s=>s+1)}>Next operation</button><button disabled={final} onClick={()=>setStep(calc.stages.length-1)}>Reveal all operations</button></>}</div>
 {calc&&!revealed&&hint>=3&&<><p>Hint preview: operation 1 of {calc.stages.length}. The rest stay hidden.</p><TraceVisual calc={calc} step={0} partial/></>}
 {calc&&revealed&&<><p>Operation {step+1} / {calc.stages.length}. Bars show magnitude; labels retain the sign.</p><StagePlayer step={step} count={calc.stages.length} onStep={setStep} label="Operation playback"/><TraceVisual calc={calc} step={step}/>
  {final&&<section className="foundation-panel"><p data-testid="course-result">Result: {fmt(calc.result)}. {numeric?'Prediction matched.':'Prediction differs.'}</p>
   {diagnostic&&!numeric&&<p className="diagnostic" data-testid="diagnostic">{diagnostic.certain?'':'One possible explanation — '}{diagnostic.observation}</p>}
   {!numeric&&<label className="writing-label">Before retrying, restate the rule in your own words<textarea value={restated} maxLength={2000} onChange={e=>setRestated(e.target.value)}/></label>}
   <h3>{lesson.question}</h3><div className="foundation-choices">{lesson.choices.map((c,i)=><button key={c} aria-pressed={choice===i} onClick={()=>setChoice(i)}>{c}</button>)}</div>
   <button disabled={!canSubmit||custom} onClick={()=>{const correct=numeric&&choice===lesson.correct;onPractice(caseIndex,correct,hint);setMessage((correct?'Practice passed. '+(hint===0?'Recorded as independent success. ':'Recorded as assisted success, because a hint was used. '):'Try again. ')+(lesson.choiceReasons?.[choice!]??lesson.reason));}}>Check practice</button>
   {!numeric&&<button onClick={()=>reset(caseIndex===0?1:0)}>Try the other case with fresh numbers</button>}</section>}</>}
 <details><summary>Inspect executable Python</summary><pre className="python-code"><code>{courseCalculationPython(lesson.model,safe)}</code></pre></details><p role="status">{python.busy?python.status:message||python.status}</p><section className="foundation-panel"><h3>Spot the mistake</h3><p>{lesson.mistake}</p><p>{lesson.debug}</p><h3>Mini-project</h3><p>{lesson.project}</p><p>Work out the steps yourself, then compare with the lesson and related lab. This written project is self-reviewed and does not earn automated mastery credit.</p></section><LessonLearning lesson={lesson} onSelect={onSelect}/><a href={lesson.source} target="_blank" rel="noreferrer">Primary reference</a><p className="foundation-mini">Python executes the numerical answer using your current inputs. Python also calculates every displayed intermediate value, grid and curve, including every hint. Browser code draws the returned data. It does not run PyTorch or TensorFlow, or establish mastery.</p></article>;
}
export function BeginnerCourse({onOpen,initialLesson}:{onOpen:(id:string)=>void;initialLesson?:string}){
 const python=usePythonProgram<Calculation>();const learning=useLearning();
 const [selected,setSelected]=useState(()=>(initialLesson&&beginnerLessons.some(l=>l.id===initialLesson)?initialLesson:undefined)|| (beginnerLessons.some(l=>l.id===learning.state.selected)?learning.state.selected:beginnerLessons[0].id));const [progress,setProgress]=useState<Progress>(()=>{try{return readProgress(localStorage);}catch{return {};}});const [saved,setSaved]=useState(true);const [resetArmed,setResetArmed]=useState(false);const [review,setReview]=useState(false);
 const lesson=beginnerLessons.find(l=>l.id===selected)!;
 useEffect(()=>{updateLearning(old=>({...old,selected}));setProgress(old=>({...old,[selected]:{...(old[selected]||{attempts:0,cases:[]}),visited:old[selected]?.visited??Date.now()}}));},[selected]);
 useEffect(()=>{try{setSaved(writeProgress(localStorage,progress));}catch{setSaved(false);}},[progress]);
 /** Retained understanding = independent success, then a scheduled recall rated afterwards. */
 const recalledAfter=(id:string)=>recalledAfterIndependent(learning.state,id,progress[id]?.independentAt);
 const stateOf=(id:string)=>evidenceState(progress[id],recalledAfter(id));
 const independent=beginnerLessons.filter(l=>progress[l.id]?.independentAt);const assisted=beginnerLessons.filter(l=>progress[l.id]?.passedAt&&!progress[l.id]?.independentAt);const retained=beginnerLessons.filter(l=>stateOf(l.id)==='retained');
 const due=beginnerLessons.filter(l=>dueCards(learning.state,Date.now()).some(id=>id.startsWith(l.id+':')));
 const practice=(index:number,correct:boolean,hints:number)=>{updateLearning(old=>practiceEvent(old,selected,correct,Date.now()));setProgress(old=>{const next=recordPractice(old,selected,index,correct,Date.now(),hints);if(review&&correct&&index===1)next[selected]={...next[selected],reviewedAt:Date.now()};return next;});};
 return <section aria-label="Beginner course"><p className="eyebrow">ABSOLUTE BEGINNER PATH · CHAPTERS 00–07</p><h1>Learn, calculate, explain<span className="dot">.</span></h1><p className="subtitle">Work through vocabulary, a visual calculation, a changed case, and an explanation. All {beginnerLessons.length} core topic lessons in chapters 00–07 are available. Advanced chapters remain planned.</p>
 <section className="foundation-panel" aria-label="Saved course evidence"><p role="status" data-testid="evidence-summary">{independent.length+assisted.length} / {beginnerLessons.length} practice criteria met · {independent.length} passed unaided · {assisted.length} passed with help · {retained.length} recalled later · {due.length} topics with scheduled FSRS recall due. {saved?'Evidence saved on this browser.':'Storage unavailable; evidence survives only this visit.'}</p><p>These four states are deliberately separate. Passing with hints is real progress, but it is not independent performance. Recalled later means the latest due recall after unaided success was self-rated Hard, Good or Easy; Again does not count. These states do not establish lasting mastery. Other browsers and cleared storage do not share this evidence.</p><div className="foundation-choices"><button onClick={()=>setReview(v=>!v)} aria-pressed={review}>{review?'Show all lessons':'Show due reviews'}</button><button onClick={()=>{if(resetArmed){setProgress({});setResetArmed(false);}else setResetArmed(true);}}>{resetArmed?'Confirm clear saved evidence':'Clear saved evidence'}</button></div></section>
 <div className="foundation-choices"><button onClick={()=>onOpen('training-project')}>Open beginner training project</button></div><div className="course-layout"><nav aria-label="Beginner topics">{beginnerChapters.map(ch=><section key={ch.id}><h2>{ch.id} · {ch.title}</h2>{beginnerLessons.filter(l=>l.chapter===ch.id&&(!review||due.some(d=>d.id===l.id))).map(l=><button key={l.id} aria-label={l.title} aria-current={selected===l.id?'page':undefined} onClick={()=>setSelected(l.id)}>{l.title}<small className={'evidence-'+stateOf(l.id)}>{EVIDENCE_LABEL[stateOf(l.id)]}</small></button>)}</section>)}{review&&!due.length&&<p>No reviews are due yet. Rate recall in a lesson to schedule a card, or show all lessons to practice now.</p>}</nav><LessonWorkspace python={python} key={selected} lesson={lesson} onSelect={setSelected} onPractice={practice} onOpen={onOpen}/></div><ChapterReview/></section>;
}

