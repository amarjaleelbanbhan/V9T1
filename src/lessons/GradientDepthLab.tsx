import {PythonProgram} from '../components/PythonProgram';
import {depthPython} from '../python/programs';
import {useMemo,useState} from 'react';
import {ChevronRight,Activity,RotateCcw} from 'lucide-react';
import {gradientChain} from '../engine/gradientDepth';
import type {Activation} from '../engine/neuron';
const fmt=(v:number)=>Math.abs(v)<.000001&&v!==0?v.toExponential(2):Number(v.toPrecision(5)).toString();
export function GradientDepthLab(){
 const [depth,setDepth]=useState(12);
 const [kind,setKind]=useState<Activation>('sigmoid');
 const [weight,setWeight]=useState(1);
 const [input,setInput]=useState(1);
 const [bias,setBias]=useState(0);
 const [selected,setSelected]=useState(0);
 const trace=useMemo(()=>gradientChain(depth,kind,weight,input,bias),[depth,kind,weight,input,bias]);
 const row=trace.steps[Math.min(selected,trace.steps.length-1)];
 const maxAbs=Math.max(.000001,...trace.steps.map(t=>Math.abs(t.gradient)));
 const reset=()=>{setDepth(12);setKind('sigmoid');setWeight(1);setInput(1);setBias(0);setSelected(0)};
 const label=Math.abs(trace.totalGradient)<.001?'Very small':Math.abs(trace.totalGradient)>10?'Large / amplified':'Moderate';
 const insight=kind==='relu'&&trace.steps.some(s=>s.slope===0)?'At least one ReLU has a zero derivative, so gradients for earlier inputs become zero.':
  kind==='linear'?'With a linear activation, each local factor equals the weight. The entire chain is weight raised to depth.':
  'Gradient size depends on both activation derivatives and weights. Saturating Sigmoid/Tanh can shrink derivatives across layers.';
 return <div className="foundation-page depth-lab">
  <div className="heading"><div><div className="crumb"><span>LECTURE 05</span><ChevronRight size={15}/><span>VANISHING & EXPLODING GRADIENTS</span></div><h1>See gradients fade<span className="dot">.</span></h1><p className="subtitle">Increase the network depth and watch the chain rule multiply actual derivatives. The chart is calculated, never decorative.</p></div><div className="module-chip"><Activity size={14}/> CHAIN EXPERIMENT</div></div>
  <section className="foundation-panel">
   <div className="foundation-panel-heading"><div><p className="eyebrow">REPEATED SCALAR LAYERS</p><h2>Does the gradient reach the beginning?</h2></div></div>
   <div className="depth-grid">
    <div className="foundation-chart-card">
     <svg viewBox="0 0 660 280" width="100%" role="img" aria-label="Computed magnitude of derivative through each increasing layer of the chain">
      <line x1="56" y1="25" x2="56" y2="228" stroke="#669987"/><line x1="56" y1="228" x2="625" y2="228" stroke="#669987"/>
      <line x1="56" y1="126" x2="625" y2="126" stroke="#477463" strokeDasharray="4 5"/>
      <text x="12" y="18" fontSize="11" fill="#BBDAC5">|∂hᵢ/∂h₀|</text><text x="618" y="255" textAnchor="end" fontSize="11" fill="#BBDAC5">Layer depth →</text>
      {trace.steps.map((step,i)=>{
       const barW=Math.max(4,540/depth-5),x=64+i*540/depth;
       // Visual height is logarithmic (log10) so very small values stay inspectable.
       const magnitude=Math.abs(step.gradient);
       const normalized=Math.log10(1+magnitude)/Math.log10(1+maxAbs);
       const height=magnitude===0?0:Math.max(2,184*normalized);
       const chosen=i===Math.min(selected,depth-1);
       return <g key={step.layer}><rect x={x} y={228-height} width={barW} height={height} rx="3" fill={chosen?'#F6D28C':'#638BFF'} opacity={chosen?1:.8}/>
        <rect x={x} y="26" width={barW} height="202" fill="transparent" style={{cursor:'pointer'}} role="button" tabIndex={0} aria-label={'Inspect layer '+step.layer} onClick={()=>setSelected(i)} onKeyDown={e=>{if(e.key==='Enter'){setSelected(i)}}}/></g>;
      })}
      <text x="330" y="19" fontSize="11" fill="#D6EAD8" textAnchor="middle">Log-scaled bars · inspect a layer for exact numbers</text>
     </svg>
     <div className="depth-result" data-testid="depth-gradient"><span>Final derivative magnitude</span><strong>{fmt(Math.abs(trace.totalGradient))}</strong><span>{label}</span></div>
     <div className="depth-inspector" data-testid="depth-local-step"><strong>Layer {row.layer}</strong><p>z = {fmt(row.input)} × {fmt(weight)} + {fmt(bias)} = {fmt(row.z)}</p><p>Activation output = {fmt(row.output)}</p><p>Local factor = {fmt(weight)} × {fmt(row.slope)} = {fmt(row.localFactor)}</p><p>Accumulated derivative = {fmt(row.gradient)}</p></div>
    </div>
    <div className="foundation-parameter-card">
     <div className="foundation-parameter-header"><h3>Shape the chain</h3><button type="button" onClick={reset}><RotateCcw size={15}/> Reset</button></div>
     <p className="eyebrow">ACTIVATION FUNCTION</p>
     <div className="depth-modes">{(['sigmoid','tanh','relu','linear'] as const).map(value=><button key={value} type="button" aria-pressed={kind===value} className={kind===value?'picked':''} onClick={()=>setKind(value)}>{value}</button>)}</div>
     {([{name:'Depth',value:depth,set:setDepth,min:1,max:32,step:1},{name:'Weight',value:weight,set:setWeight,min:-2,max:2,step:.1},{name:'Starting input',value:input,set:setInput,min:-3,max:3,step:.1},{name:'Bias',value:bias,set:setBias,min:-2,max:2,step:.1}] as const).map(c=><label className="foundation-range" key={c.name}><span>{c.name} <strong>{fmt(c.value)}</strong></span><input aria-label={c.name} type="range" min={c.min} max={c.max} step={c.step} value={c.value} onChange={e=>{c.set(Number(e.target.value));setSelected(0)}}/></label>)}
     <div className="depth-insight"><strong>What this means</strong><p>{insight}</p></div>
    </div>
   </div>
  </section>
  <section className="foundation-panel"><p className="eyebrow">THE CHAIN RULE</p><h2>Every layer multiplies the derivative</h2><p className="foundation-copy">For a scalar chain, hᵢ = activation(w × hᵢ₋₁ + b). The derivative of the final output with respect to the initial input is the product of all local factors: Π(w × activation′(zᵢ)). More layers do not automatically mean smaller gradients: the factors determine the outcome.</p></section>
  <p className="footnote">This is a deterministic scalar chain illustrating activation derivatives, not gradients of an entire trainable ANN or measured real-world training behavior. ReLU uses the zero subgradient at z = 0. The vertical bar scale is log-transformed for legibility.</p>
 <PythonProgram source={depthPython(depth,kind,weight,input,bias)}/></div>;
}

