import { useEffect,useMemo,useState } from 'react';
import { ArrowRight, ChevronRight, RotateCcw, TrendingDown, Play, Pause, CircleHelp } from 'lucide-react';
import { descentTrace, evaluateLoss, type LossMode } from '../engine/lossGradient';

const display=(value:number)=>Number(value.toFixed(3)).toString();
type Direction='left'|'right'|'same';
function LossCurve({mode,trace,input,target,bias,cursor}:{mode:LossMode;trace:ReturnType<typeof descentTrace>;input:number;target:number;bias:number;cursor:number}){
  const positions=trace.map(t=>t.weight);
  const xMin=Math.min(-3,...positions)-0.2;
  const xMax=Math.max(3,...positions)+0.2;
  const points=Array.from({length:121},(_,i)=>{const w=xMin+(xMax-xMin)*i/120;return {w,loss:evaluateLoss(mode,w,input,target,bias).loss};});
  const highest=Math.max(0.1,...points.map(p=>p.loss),...trace.map(t=>t.loss))*1.13;
  const px=(w:number)=>50+(w-xMin)/(xMax-xMin)*520;
  const py=(loss:number)=>265-loss/highest*220;
  const path=points.map((p,i)=>(i===0?'M':'L')+px(p.w).toFixed(2)+' '+py(p.loss).toFixed(2)).join(' ');
  const chosen=trace[cursor];
  const trail=trace.slice(0,cursor+1).map((p,i)=>(i===0?'M':'L')+px(p.weight).toFixed(2)+' '+py(p.loss).toFixed(2)).join(' ');
  return <svg viewBox="0 0 620 315" className="loss-curve" role="img" aria-label={'Loss curve and gradient descent path, step '+cursor+', weight '+display(chosen.weight)+' and loss '+display(chosen.loss)}>
    <path d="M50 23V265H575" stroke="#5F947C" strokeWidth="1.5" fill="none"/>
    <path d={'M50 '+py(0)+'H575'} stroke="#476F60" strokeDasharray="4 6"/>
    <text x="14" y="27" fontSize="12" fill="#A8D8BE">Loss</text>
    <text x="275" y="307" fontSize="12" fill="#A8D8BE">Weight (w) →</text>
    <text x="49" y="285" fontSize="11" fill="#A8D8BE">{display(xMin)}</text>
    <text x="533" y="285" fontSize="11" fill="#A8D8BE">{display(xMax)}</text>
    <text x="21" y="269" fontSize="11" fill="#A8D8BE">0</text>
    <path d={path} stroke="#9EE3AC" strokeWidth="4" strokeLinecap="round" fill="none"/>
    {cursor>0&&<path d={trail} fill="none" stroke="#F4C885" strokeWidth="2.5" strokeDasharray="7 5"/>}
    {trace.slice(0,cursor+1).map((p,i)=><circle key={i} cx={px(p.weight)} cy={py(p.loss)} r={i===cursor?8:4} stroke={i===cursor?'#FFF0BD':'#F4C885'} strokeWidth="2" fill={i===cursor?'#F5CF87':'#143B32'}/>)}
    <text x={Math.max(55,Math.min(515,px(chosen.weight)+12))} y={Math.max(18,py(chosen.loss)-14)} fill="#FFE1A0" fontSize="12" fontWeight="bold">Step {cursor}</text>
  </svg>;
}
export function LossGradientLab(){
  const [mode,setMode]=useState<LossMode>('half-squared');
  const [initialWeight,setInitialWeight]=useState(2);
  const [input,setInput]=useState(1);
  const [target,setTarget]=useState(1);
  const [bias,setBias]=useState(0);
  const [rate,setRate]=useState(.2);
  const [updates,setUpdates]=useState(6);
  const [cursor,setCursor]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [answer,setAnswer]=useState<Direction|null>(null);
  const trace=useMemo(()=>descentTrace({mode,input,target,bias,learningRate:rate,initialWeight,updates}),[mode,input,target,bias,rate,initialWeight,updates]);
  const selected=trace[Math.min(cursor,updates)];
  const setStep=(n:number)=>{setPlaying(false);setCursor(Math.max(0,Math.min(updates,n)))};
  const reset=()=>{setPlaying(false);setMode('half-squared');setInitialWeight(2);setInput(1);setTarget(1);setBias(0);setRate(.2);setUpdates(6);setCursor(0);setAnswer(null)};
  const setModeAndReset=(m:LossMode)=>{setPlaying(false);setMode(m);setCursor(0);setAnswer(null)};
  useEffect(()=>{if(!playing)return;if(cursor>=updates){setPlaying(false);return;}const timer=window.setTimeout(()=>setCursor(c=>Math.min(updates,c+1)),800);return()=>window.clearTimeout(timer)},[playing,cursor,updates]);
  const direction:Direction=selected.gradient===0||rate===0?'same':selected.gradient>0?'left':'right';
  const predict=(choice:Direction)=>setAnswer(choice);
  return <div className="foundation-page loss-gradient-lab">
    <div className="heading"><div><div className="crumb"><span>LECTURE 04</span><ChevronRight size={15}/><span>LOSS · DERIVATIVES · OPTIMIZATION</span></div>
      <h1>Follow the loss downhill<span className="dot">.</span></h1><p className="subtitle">Watch the exact loss, gradient and weight update at every step.</p></div><div className="module-chip"><TrendingDown size={15}/> LIVE GRADIENT</div>
    </div>
    <section className="foundation-panel" aria-label="Loss and gradient descent simulator">
      <div className="foundation-panel-heading"><div><p className="eyebrow">EXPERIMENT · TWO QUADRATIC LOSSES</p><h2>Which way should the weight move?</h2></div><TrendingDown size={22}/></div>
      <div className="activation-kind-buttons" role="group" aria-label="Choose loss function">
        <button type="button" aria-pressed={mode==='half-squared'} className={mode==='half-squared'?'picked':''} onClick={()=>setModeAndReset('half-squared')}>½ × (prediction − target)²</button>
        <button type="button" aria-pressed={mode==='weight-squared'} className={mode==='weight-squared'?'picked':''} onClick={()=>setModeAndReset('weight-squared')}>L(w) = w²</button>
      </div>
      <div className="loss-layout">
        <div className="foundation-chart-card">
          <LossCurve mode={mode} trace={trace} input={input} target={target} bias={bias} cursor={cursor}/>
          <div className="loss-stage-row"><div><span>Step</span><strong data-testid="loss-step">{selected.iteration} / {updates}</strong></div><div><span>Weight</span><strong data-testid="loss-weight">{display(selected.weight)}</strong></div><div><span>Loss</span><strong data-testid="loss-value">{display(selected.loss)}</strong></div></div>
          <div className="loss-transport" role="group" aria-label="Optimization timeline controls">
            <button type="button" aria-label="Previous update" disabled={cursor===0} onClick={()=>setStep(cursor-1)}>← Previous</button>
            <button type="button" aria-label={playing?'Pause updates':'Play updates'} aria-pressed={playing} onClick={()=>{if(cursor>=updates)setCursor(0);setPlaying(v=>!v)}}>{playing?<Pause size={16}/>:<Play size={16}/>} {playing?'Pause':'Play'}</button>
            <button type="button" aria-label="Next update" disabled={cursor>=updates} onClick={()=>setStep(cursor+1)}>Next <ArrowRight size={15}/></button>
          </div>
          <label className="foundation-range" htmlFor="loss-timeline"><span>Inspect iteration <strong>{cursor}</strong></span><input id="loss-timeline" type="range" min="0" max={updates} step="1" value={cursor} onChange={e=>setStep(Number(e.target.value))}/></label>
        </div>
        <div className="foundation-parameter-card">
          <div className="foundation-parameter-header"><h3>Experiment controls</h3><button type="button" onClick={reset} aria-label="Reset loss experiment"><RotateCcw size={15}/> Reset</button></div>
          <label className="foundation-range" htmlFor="loss-initial"><span>Starting weight w₀ <strong>{display(initialWeight)}</strong></span><input id="loss-initial" type="range" min="-3" max="3" step=".1" value={initialWeight} onChange={e=>{setInitialWeight(Number(e.target.value));setStep(0)}}/></label>
          {mode==='half-squared'&&<>
            <label className="foundation-range" htmlFor="loss-input"><span>Input x <strong>{display(input)}</strong></span><input id="loss-input" type="range" min="-2" max="2" step=".1" value={input} onChange={e=>{setInput(Number(e.target.value));setStep(0)}}/></label>
            <label className="foundation-range" htmlFor="loss-target"><span>True target y <strong>{display(target)}</strong></span><input id="loss-target" type="range" min="-2" max="2" step=".1" value={target} onChange={e=>{setTarget(Number(e.target.value));setStep(0)}}/></label>
            <label className="foundation-range" htmlFor="loss-bias"><span>Fixed bias b <strong>{display(bias)}</strong></span><input id="loss-bias" type="range" min="-1" max="1" step=".1" value={bias} onChange={e=>{setBias(Number(e.target.value));setStep(0)}}/></label>
          </>}
          <label className="foundation-range" htmlFor="loss-rate"><span>Learning rate η <strong>{display(rate)}</strong></span><input id="loss-rate" type="range" min="0" max="1" step=".05" value={rate} onChange={e=>{setRate(Number(e.target.value));setStep(0)}}/></label>
          <label className="foundation-range" htmlFor="loss-count"><span>Number of updates <strong>{updates}</strong></span><input id="loss-count" type="range" min="1" max="10" step="1" value={updates} onChange={e=>{setUpdates(Number(e.target.value));setStep(0)}}/></label>
        </div>
      </div>
    </section>
    <section className="foundation-panel loss-working" aria-label="Step-by-step gradient calculation">
      <p className="eyebrow">INSPECT · REAL ARITHMETIC</p><h2>At step {cursor}, the math is:</h2>
      <div className="loss-explainer">
        {mode==='half-squared'?<><div><span>Prediction</span><strong data-testid="loss-prediction">ŷ = {display(selected.weight)} × {display(input)} + {display(bias)} = {display(selected.prediction!)}</strong></div>
          <div><span>Error</span><strong>ŷ − y = {display(selected.error!)}</strong></div>
          <div><span>Half squared loss</span><strong>L = ½ × ({display(selected.error!)})² = {display(selected.loss)}</strong></div>
          <div><span>Gradient (chain rule)</span><strong data-testid="loss-gradient">dL/dw = ({display(selected.error!)}) × {display(input)} = {display(selected.gradient)}</strong></div></>:
          <><div><span>Loss</span><strong>L = ({display(selected.weight)})² = {display(selected.loss)}</strong></div><div><span>Gradient</span><strong data-testid="loss-gradient">dL/dw = 2 × {display(selected.weight)} = {display(selected.gradient)}</strong></div></>}
        <div className="loss-update-line"><span>Update rule</span><strong data-testid="loss-next">wₙ₊₁ = {selected.nextWeight===null?'End of experiment':display(selected.weight)+' − '+display(rate)+' × ('+display(selected.gradient)+') = '+display(selected.nextWeight)}</strong></div>
      </div>
      <p className="foundation-mini">A positive gradient moves the weight left when η is positive; a negative gradient moves it right. An excessive learning rate can overshoot or oscillate. This is one-dimensional gradient descent, not neural-network backpropagation.</p>
    </section>
    <section className="foundation-panel foundation-review"><div><p className="eyebrow">PREDICT · BEFORE YOU STEP</p><h2><CircleHelp size={18}/> Which way would the next weight update move?</h2><p className="foundation-copy">Use the sign of the current gradient and the learning rate.</p></div>
      <div className="foundation-review-actions">
        <button type="button" aria-pressed={answer==='left'} className={answer==='left'?'picked':''} onClick={()=>predict('left')}>Weight decreases</button>
        <button type="button" aria-pressed={answer==='right'} className={answer==='right'?'picked':''} onClick={()=>predict('right')}>Weight increases</button>
        <button type="button" aria-pressed={answer==='same'} className={answer==='same'?'picked':''} onClick={()=>predict('same')}>Weight unchanged</button>
        {answer&&<div className="foundation-answer" role="status">{answer===direction?'Correct.':'Try again.'} Gradient: {display(selected.gradient)}, learning rate: {display(rate)}. {direction==='left'?'The update subtracts a positive amount.':direction==='right'?'The update subtracts a negative amount.':'The update has zero magnitude.'}</div>}
      </div>
    </section>
    <p className="footnote">Lecture 04: gradient descent, derivatives and L(w) = w² (slides 8–13); Complete Neuron Story: half squared error (slide 25). The input and target values are illustrative teaching data.</p>
  </div>;
}
