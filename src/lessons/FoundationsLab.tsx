import { useMemo, useState } from 'react';
import { BookOpen, BrainCircuit, ChartNoAxesCombined, ChevronRight, CircleHelp, RotateCcw, Target } from 'lucide-react';
import { CLASSIFICATION_SAMPLES, REGRESSION_SAMPLES, evaluateClassification, evaluateRegression } from '../engine/foundations';

type Family = 'ai' | 'ml' | 'dl';
type Task = 'classification' | 'regression';
const families: {id:Family;title:string;description:string;example:string}[] = [
  {id:'ai',title:'Artificial Intelligence',description:'The broad goal: machines perform tasks requiring intelligent behavior.',example:'A hand-written rule system can also be AI.'},
  {id:'ml',title:'Machine Learning',description:'A part of AI: a model learns patterns from example data.',example:'An email classifier can learn from labelled messages.'},
  {id:'dl',title:'Deep Learning',description:'A part of ML: networks with multiple layers learn useful representations.',example:'A neural network can learn patterns in images.'}
];
const scores=CLASSIFICATION_SAMPLES.map(p=>p.score);
const labels=CLASSIFICATION_SAMPLES.map(p=>p.label);
const xs=REGRESSION_SAMPLES.map(p=>p.x);
const ys=REGRESSION_SAMPLES.map(p=>p.y);
const show=(v:number)=>Number(v.toFixed(3)).toString();

function FamilyMap({selected}:{selected:Family}){
  return <svg viewBox="0 0 570 305" role="img" aria-label="Nested concept map: Deep Learning is inside Machine Learning, and Machine Learning is inside Artificial Intelligence" className="foundation-family-map">
    <rect x="8" y="8" width="554" height="286" rx="25" fill="#103D39" stroke={selected==='ai'?'#BDF6BC':'#2D6558'} strokeWidth={selected==='ai'?3:1.5}/>
    <text x="28" y="37" className="foundation-map-title">ARTIFICIAL INTELLIGENCE</text>
    <text x="28" y="56" className="foundation-map-subtitle">Algorithms, search, rules and learning</text>
    <rect x="55" y="80" width="462" height="200" rx="23" fill="#14564A" stroke={selected==='ml'?'#BDF6BC':'#4B9375'} strokeWidth={selected==='ml'?3:1.5}/>
    <text x="76" y="108" className="foundation-map-title">MACHINE LEARNING</text>
    <text x="76" y="128" className="foundation-map-subtitle">Learn patterns from examples</text>
    <rect x="110" y="150" width="356" height="113" rx="21" fill="#2A835F" stroke={selected==='dl'?'#E1F8B7':'#7FCAA4'} strokeWidth={selected==='dl'?3:1.5}/>
    <circle cx="201" cy="211" r="13" fill="#8BBB92"/><circle cx="280" cy="194" r="13" fill="#BCE6B2"/><circle cx="280" cy="230" r="13" fill="#BCE6B2"/><circle cx="366" cy="211" r="13" fill="#D5F5BE"/>
    <g stroke="#C9EDB3" strokeWidth="3" opacity=".75"><path d="M214 211L267 194M214 211L267 230M293 194L353 211M293 230L353 211"/></g>
    <text x="288" y="174" textAnchor="middle" fontSize="11" fill="#F1FFF0" fontWeight="bold">DEEP LEARNING</text>
    <text x="288" y="251" textAnchor="middle" fontSize="10" fill="#E2F7DC">Multiple neural layers</text>
  </svg>;
}
function ClassificationChart({threshold}:{threshold:number}){
  const assessment=evaluateClassification(scores,labels,threshold);
  const plotX=(value:number)=>42+456*value;
  return <svg className="foundation-data-chart" viewBox="0 0 540 210" role="img" aria-label={'Six labelled points and the threshold at '+show(threshold)+'; '+assessment.correct+' out of six predicted correctly'}>
    <path d="M42 30V171H498" fill="none" stroke="#6A9D86" strokeWidth="1.5"/>
    <g stroke="#23594A" strokeWidth="1"><path d="M42 80H498M42 153H498"/></g>
    <text x="7" y="80" className="foundation-axis-label">1</text><text x="7" y="153" className="foundation-axis-label">0</text>
    <text x="25" y="194" className="foundation-axis-label">0</text><text x="480" y="194" className="foundation-axis-label">1</text>
    <text x="246" y="204" className="foundation-axis-label">Sensor score →</text>
    <path d={'M'+plotX(threshold)+' 26V171'} stroke="#F0C87F" strokeWidth="2" strokeDasharray="5 4"/>
    <text x={Math.min(plotX(threshold)+7,450)} y="19" fill="#F7DCAA" fontSize="11">threshold {show(threshold)}</text>
    {CLASSIFICATION_SAMPLES.map((p,i)=><g key={i}>
      <circle cx={plotX(p.score)} cy={p.label?80:153} r="11" fill={assessment.predictions[i]===p.label?'#8BBB92':'#F0A66A'} stroke="#F4FFF3" strokeWidth="1.5"/>
      <text x={plotX(p.score)} y={(p.label?80:153)+4} textAnchor="middle" fontSize="10" fill="#082923" fontWeight="bold">{p.label}</text>
      <text x={plotX(p.score)} y={(p.label?80:153)+28} textAnchor="middle" fill="#C7E7D3" fontSize="10">{p.score}</text>
    </g>)}
  </svg>;
}
function RegressionChart({slope,intercept}:{slope:number;intercept:number}){
  const plotX=(v:number)=>45+105*v;
  const plotY=(v:number)=>176-(v/9)*154;
  return <svg className="foundation-data-chart" viewBox="0 0 540 210" role="img" aria-label={'Five regression targets and a predicted line with slope '+show(slope)+' and intercept '+show(intercept)}>
    <path d="M45 18V176H496" fill="none" stroke="#6A9D86" strokeWidth="1.5"/>
    <text x="9" y="29" className="foundation-axis-label">9</text><text x="20" y="179" className="foundation-axis-label">0</text><text x="475" y="195" className="foundation-axis-label">4</text>
    <path d={'M'+plotX(0)+' '+plotY(intercept)+'L'+plotX(4)+' '+plotY(4*slope+intercept)} stroke="#C7E9A0" strokeWidth="3" fill="none"/>
    {REGRESSION_SAMPLES.map((p,i)=><g key={i}>
      <line x1={plotX(p.x)} y1={plotY(p.y)} x2={plotX(p.x)} y2={plotY(slope*p.x+intercept)} stroke="#F0C87F" strokeWidth="2" strokeDasharray="3 3"/>
      <circle cx={plotX(p.x)} cy={plotY(p.y)} r="7" fill="#8BBB92" stroke="#F4FFF3" strokeWidth="1.5"/>
      <text x={plotX(p.x)+10} y={plotY(p.y)-7} fontSize="10" fill="#C6E4D2">{p.y}</text>
    </g>)}
    <text x="240" y="201" className="foundation-axis-label">Input x →</text>
  </svg>;
}
export function FoundationsLab(){
  const [family,setFamily]=useState<Family>('dl');
  const [task,setTask]=useState<Task>('classification');
  const [threshold,setThreshold]=useState(0.5);
  const [slope,setSlope]=useState(0.8);
  const [intercept,setIntercept]=useState(0.6);
  const [answer,setAnswer]=useState<'classification'|'regression'|null>(null);
  const classification=useMemo(()=>evaluateClassification(scores,labels,threshold),[threshold]);
  const regression=useMemo(()=>evaluateRegression(xs,ys,slope,intercept),[slope,intercept]);
  const familyInfo=families.find(f=>f.id===family)!;
  const reset=()=>{setThreshold(.5);setSlope(.8);setIntercept(.6);setAnswer(null)};
  return <div className="foundation-page">
    <div className="heading"><div><div className="crumb"><span>MODULE 01</span><ChevronRight size={15}/> <span>WEEK 1 · FOUNDATIONS</span></div>
      <h1>Build intuition before networks<span className="dot">.</span></h1><p className="subtitle">Explore what AI, ML and Deep Learning mean. Then test two prediction tasks.</p></div>
      <div className="module-chip"><BookOpen size={14}/> GUIDED EXPLORATION</div></div>
    <section className="foundation-panel" aria-label="AI, ML, and deep learning hierarchy">
      <div className="foundation-panel-heading"><div><p className="eyebrow">DISCOVER · A NESTED FAMILY</p><h2>AI contains ML. ML contains Deep Learning.</h2></div><BrainCircuit size={22}/></div>
      <div className="foundation-family-layout">
        <FamilyMap selected={family}/>
        <div className="foundation-family-detail">
          <div className="foundation-choices" role="group" aria-label="Explore a concept family">
            {families.map(f=><button key={f.id} type="button" aria-pressed={family===f.id} className={family===f.id?'picked':''} onClick={()=>setFamily(f.id)}>{f.id.toUpperCase()}</button>)}
          </div>
          <p className="eyebrow">SELECTED CONCEPT</p><h3>{familyInfo.title}</h3>
          <p className="foundation-copy">{familyInfo.description}</p>
          <p className="foundation-note">{familyInfo.example}</p>
          <p className="foundation-mini">Why Deep Learning? Multiple layers can learn useful features directly from data, which can help on complex tasks such as image and speech recognition. It is not always the best solution.</p>
        </div>
      </div>
    </section>
    <section className="foundation-panel foundation-experiment" aria-label="Classification and regression interactive experiments">
      <div className="foundation-panel-heading"><div><p className="eyebrow">INTERACT · REVISIT MACHINE LEARNING</p><h2>What should a model predict?</h2><p className="foundation-copy">Choose a task. Move a control to see how predictions and errors change.</p></div><ChartNoAxesCombined size={22}/></div>
      <div className="foundation-choices foundation-task-switch" role="group" aria-label="Prediction task">
        <button type="button" className={task==='classification'?'picked':''} aria-pressed={task==='classification'} onClick={()=>setTask('classification')}>Classification · category</button>
        <button type="button" className={task==='regression'?'picked':''} aria-pressed={task==='regression'} onClick={()=>setTask('regression')}>Regression · number</button>
      </div>
      <div className="foundation-experiment-layout">
        <div className="foundation-chart-card">
          <div className="foundation-legend"><span><i/> Target class / value</span><span><i className="warning"/> Incorrect prediction / error</span></div>
          {task==='classification'?<ClassificationChart threshold={threshold}/>:<RegressionChart slope={slope} intercept={intercept}/>}
          <p className="foundation-mini">{task==='classification'?'A simple rule predicts class 1 when the score is at or above the threshold. Orange points are errors.':'Green circles are the target values. The line shows predictions; dashed amber gaps are errors.'}</p>
        </div>
        <div className="foundation-parameter-card">
          <div className="foundation-parameter-header"><h3>{task==='classification'?'Decision threshold':'Prediction line'}</h3><button type="button" onClick={reset} aria-label="Reset foundation experiment"><RotateCcw size={15}/> Reset</button></div>
          {task==='classification'?<>
            <label className="foundation-range" htmlFor="foundation-threshold"><span>Decision threshold <strong>{show(threshold)}</strong></span><input id="foundation-threshold" type="range" min="0.1" max="0.9" step="0.05" value={threshold} onChange={e=>setThreshold(Number(e.target.value))}/></label>
            <div className="foundation-metric"><span>Accuracy <small>Correct predictions ÷ total</small></span><strong data-testid="classification-accuracy">{Math.round(classification.accuracy*100)}%</strong></div>
            <p className="foundation-detail-line" data-testid="classification-correct">{classification.correct} / {classification.total} correct · False positives {classification.fp} · False negatives {classification.fn}</p>
          </>:<>
            <label className="foundation-range" htmlFor="foundation-slope"><span>Slope (m) <strong>{show(slope)}</strong></span><input id="foundation-slope" type="range" min="0" max="1.6" step="0.1" value={slope} onChange={e=>setSlope(Number(e.target.value))}/></label>
            <label className="foundation-range" htmlFor="foundation-intercept"><span>Intercept (b) <strong>{show(intercept)}</strong></span><input id="foundation-intercept" type="range" min="0" max="2" step="0.1" value={intercept} onChange={e=>setIntercept(Number(e.target.value))}/></label>
            <div className="foundation-metric"><span>Mean Absolute Error <small>Average |prediction − target|</small></span><strong data-testid="regression-mae">{show(regression.mae)}</strong></div>
            <div className="foundation-metric"><span>Mean Squared Error <small>Average squared error</small></span><strong data-testid="regression-mse">{show(regression.mse)}</strong></div>
            <p className="foundation-detail-line">ŷ = m × x + b · Try slope = 1 and intercept = 1.</p>
          </>}
          <p className="foundation-mini">Teaching simulation: these are fixed sample values, not a model training or running TensorFlow.</p>
        </div>
      </div>
    </section>
    <section className="foundation-panel foundation-review" aria-label="Concept check">
      <div><p className="eyebrow">CHALLENGE · CHECK YOUR UNDERSTANDING</p><h2><CircleHelp size={19}/> Which task predicts a continuous number?</h2><p className="foundation-copy">A house price is a number, not a category. Choose an answer.</p></div>
      <div className="foundation-review-actions">
        <button type="button" className={answer==='classification'?'picked':''} aria-pressed={answer==='classification'} onClick={()=>setAnswer('classification')}>Classification</button>
        <button type="button" className={answer==='regression'?'picked':''} aria-pressed={answer==='regression'} onClick={()=>setAnswer('regression')}>Regression</button>
        {answer&&<div role="status" className="foundation-answer"><Target size={16}/>{answer==='regression'?'Correct. Regression predicts continuous values; classification predicts classes.':'Not quite. Classification selects categories. A numerical house price is regression.'}</div>}
      </div>
    </section>
    <p className="footnote"><BrainCircuit size={15}/> Based on Week 1 of the Sukkur IBA Deep Learning course outline. Specific examples and metric choices are additional teaching illustrations; the provided outline does not prescribe this dataset.</p>
  </div>;
}
