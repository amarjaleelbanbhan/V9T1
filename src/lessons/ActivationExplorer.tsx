import { useMemo, useState } from 'react';
import { ChevronRight, FunctionSquare, RotateCcw, Activity, CircleHelp } from 'lucide-react';
import { SCALAR_ACTIVATIONS, scalarActivation, scalarDerivative, stableSoftmax, type ScalarActivation } from '../engine/activationLab';

const fmt=(v:number)=>Number(v.toFixed(3)).toString();
const names: Record<ScalarActivation,string>={sigmoid:'Sigmoid',tanh:'Tanh',relu:'ReLU','leaky-relu':'Leaky ReLU'};
const notes:Record<ScalarActivation,string>={
  sigmoid:'Compresses every input to a value between 0 and 1; very large positive or negative inputs saturate.',
  tanh:'Centers output around zero; its range is -1 to 1 and its gradient becomes small at extremes.',
  relu:'Passes positive values through and sets negative values to zero. The derivative is zero for negative inputs.',
  'leaky-relu':'Keeps a small negative slope instead of fully discarding negative values.'
};
const palettes:{kind:ScalarActivation;color:string}[]=[
  {kind:'sigmoid',color:'#638BFF'},{kind:'tanh',color:'#4CD2C4'},
  {kind:'relu',color:'#EAC87F'},{kind:'leaky-relu',color:'#C3A3EF'}
];
function ScalarGraph({kind,z}:{kind:ScalarActivation;z:number}){
  const xmin=-5,xmax=5,ymin=-1.5,ymax=5.5;
  const px=(x:number)=>44+(x-xmin)/(xmax-xmin)*472;
  const py=(y:number)=>254-(y-ymin)/(ymax-ymin)*224;
  const plot=(k:ScalarActivation)=>Array.from({length:201},(_,i)=>{
    const x=xmin+i/20;return (i===0?'M':'L')+px(x).toFixed(2)+' '+py(scalarActivation(x,k)).toFixed(2);
  }).join(' ');
  return <svg className="activation-lab-plot" viewBox="0 0 550 300" role="img" aria-label={names[kind]+' activation highlighted alongside other activation functions, current input '+fmt(z)}>
    <path d={'M44 '+py(0)+'H516 M'+px(0)+' 24V254'} stroke="#547C6D" fill="none" strokeWidth="1.5"/>
    <text x="18" y="34" fontSize="11" fill="#B2D7C1">5</text>
    <text x="11" y="255" fontSize="11" fill="#B2D7C1">-1</text>
    <text x="38" y="280" fontSize="11" fill="#B2D7C1">-5</text>
    <text x="278" y="280" fontSize="11" fill="#B2D7C1">0</text>
    <text x="499" y="280" fontSize="11" fill="#B2D7C1">+5</text>
    {palettes.filter(p=>p.kind!==kind).map(p=><path key={p.kind} d={plot(p.kind)} fill="none" stroke={p.color} strokeWidth="2" opacity=".34"/>)}
    {palettes.filter(p=>p.kind===kind).map(p=><path key={p.kind} d={plot(p.kind)} fill="none" stroke={p.color} strokeWidth="4" strokeLinecap="round"/>)}
    {z>=xmin&&z<=xmax&&<><line x1={px(z)} y1={py(scalarActivation(z,kind))} x2={px(z)} y2={py(0)} stroke="#F5E5AE" strokeDasharray="4 4"/><circle cx={px(z)} cy={py(scalarActivation(z,kind))} r="7" fill="#F5E5AE" stroke="#092328" strokeWidth="2"/></>}
  </svg>;
}
export function ActivationExplorer(){
  const [kind,setKind]=useState<ScalarActivation|'softmax'>('relu');
  const [z,setZ]=useState(-2);
  const [logits,setLogits]=useState([-1,.5,2]);
  const [answer,setAnswer]=useState<'relu'|'leaky'|null>(null);
  const probabilities=useMemo(()=>stableSoftmax(logits),[logits]);
  const output=kind==='softmax'?null:scalarActivation(z,kind);
  const derivative=kind==='softmax'?null:scalarDerivative(z,kind);
  const reset=()=>{setZ(-2);setLogits([-1,.5,2]);setAnswer(null)};
  return <div className="foundation-page activation-lab">
    <div className="heading"><div><div className="crumb"><span>MODULE 04</span><ChevronRight size={15}/><span>WEEK 4 · ACTIVATION FUNCTIONS</span></div>
      <h1>Shape the signal<span className="dot">.</span></h1><p className="subtitle">Change an input and see the transformation and its local slope.</p></div>
      <div className="module-chip"><Activity size={14}/> LIVE FUNCTIONS</div></div>
    <section className="foundation-panel">
      <div className="foundation-panel-heading"><div><p className="eyebrow">COMPARE · SCALAR OR VECTOR</p><h2>Different functions. Different behavior.</h2></div><FunctionSquare size={22}/></div>
      <div className="activation-kind-buttons" role="group" aria-label="Choose activation function">
        {([...SCALAR_ACTIVATIONS,'softmax'] as const).map(item=><button key={item} type="button" aria-pressed={kind===item} className={kind===item?'picked':''} onClick={()=>setKind(item)}>{item==='softmax'?'Softmax':names[item]}</button>)}
      </div>
      <div className="activation-layout">
        <div className="foundation-chart-card">
          {kind!=='softmax'?<>
            <div className="foundation-legend">{palettes.map(p=><span key={p.kind} style={{opacity:kind===p.kind?1:.52}}><i style={{background:p.color}}/>{names[p.kind]}</span>)}</div>
            <ScalarGraph kind={kind} z={z}/>
            <p className="foundation-mini">All curves share one coordinate system. The selected function is highlighted. ReLU is flat below zero; Leaky ReLU is not.</p>
          </>:<>
            <div className="activation-softmax-visual" role="img" aria-label={'Three Softmax probabilities summing to '+fmt(probabilities.reduce((a,b)=>a+b,0))}>
              {probabilities.map((p,i)=><div className="softmax-row" key={i}><span>Class {i+1}</span><div className="softmax-bar-track"><div className="softmax-bar-fill" style={{width:(p*100)+'%'}}/></div><strong>{(p*100).toFixed(1)}%</strong></div>)}
            </div>
            <p className="foundation-mini">Softmax takes a vector of scores and turns it into nonnegative class probabilities that sum to 1. It is not applied to each score independently.</p>
          </>}
        </div>
        <div className="foundation-parameter-card">
          <div className="foundation-parameter-header"><h3>Live parameters</h3><button type="button" onClick={reset}><RotateCcw size={15}/> Reset</button></div>
          {kind!=='softmax'?<>
            <label className="foundation-range" htmlFor="activation-z"><span>Input z <strong>{fmt(z)}</strong></span><input id="activation-z" type="range" min="-5" max="5" step="0.1" value={z} onChange={e=>setZ(Number(e.target.value))}/></label>
            <div className="foundation-metric"><span>Activation output <small>f(z)</small></span><strong data-testid="activation-output">{fmt(output!)}</strong></div>
            <div className="foundation-metric"><span>Local slope <small>f′(z)</small></span><strong data-testid="activation-gradient">{derivative===null?'Undefined':fmt(derivative)}</strong></div>
            <p className="foundation-note">{notes[kind]}</p>
          </>:<>
            {logits.map((value,i)=><label key={i} className="foundation-range" htmlFor={'logit-'+i}><span>Logit {i+1}<strong>{fmt(value)}</strong></span><input id={'logit-'+i} type="range" min="-5" max="5" step="0.1" value={value} onChange={e=>setLogits(prev=>prev.map((n,j)=>i===j?Number(e.target.value):n))}/></label>)}
            <div className="foundation-metric"><span>Sum of probabilities</span><strong data-testid="softmax-sum">{probabilities.reduce((a,b)=>a+b,0).toFixed(3)}</strong></div>
            <p className="foundation-note">Increasing one class score changes every class probability. Scores are relative, not independent.</p>
          </>}
        </div>
      </div>
    </section>
    <section className="foundation-panel foundation-review">
      <div><p className="eyebrow">CHECK UNDERSTANDING</p><h2><CircleHelp size={19}/> At z = −2, which function has a nonzero output?</h2><p className="foundation-copy">Compare ReLU and Leaky ReLU when the input is negative.</p></div>
      <div className="foundation-review-actions"><button type="button" aria-pressed={answer==='relu'} className={answer==='relu'?'picked':''} onClick={()=>setAnswer('relu')}>ReLU</button><button type="button" aria-pressed={answer==='leaky'} className={answer==='leaky'?'picked':''} onClick={()=>setAnswer('leaky')}>Leaky ReLU</button>
      {answer&&<div role="status" className="foundation-answer">{answer==='leaky'?'Correct. Leaky ReLU(-2) = -0.2 when the negative slope is 0.1.':'ReLU(-2) = 0. Leaky ReLU keeps a small negative slope, giving -0.2.'}</div>}</div>
    </section>
    <p className="footnote" id="how-it-works">Syllabus: Sigmoid, Tanh, ReLU, Leaky ReLU and Softmax (Week 4). The Softmax demonstration calculates actual probabilities, not trained-model predictions.</p>
  </div>;
}

