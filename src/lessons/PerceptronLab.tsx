import { useMemo, useState } from 'react';
import { ChevronRight, Waypoints, RotateCcw, CircleHelp } from 'lucide-react';
import { BINARY_INPUTS, GATE_PRESETS, logicTable, type LogicGate } from '../engine/perceptron';
const fmt=(v:number)=>Number(v.toFixed(2)).toString();
export function PerceptronLab(){
 const [gate,setGate]=useState<LogicGate>('and');
 const [weights,setWeights]=useState<number[]>([...GATE_PRESETS.and.weights]);
 const [bias,setBias]=useState(-1.5);
 const [selection,setSelection]=useState(1);
 const [answer,setAnswer]=useState<'yes'|'no'|null>(null);
 const table=useMemo(()=>logicTable(weights,bias,gate),[weights,bias,gate]);
 const chosen=table[selection];
 const correct=table.filter(t=>t.correct).length;
 const chooseGate=(next:LogicGate)=>{setGate(next);setWeights([...GATE_PRESETS[next].weights]);setBias(GATE_PRESETS[next].bias);setSelection(1);setAnswer(null)};
 const reset=()=>chooseGate(gate);
 return <div className="foundation-page perceptron-lab">
  <div className="heading"><div><div className="crumb"><span>COMPLETE NEURON STORY</span><ChevronRight size={15}/><span>PERCEPTRON · SLIDES 14–17</span></div>
   <h1>One neuron, a decision<span className="dot">.</span></h1><p className="subtitle">Train your intuition about a binary step perceptron with AND and OR gates.</p></div><div className="module-chip"><Waypoints size={15}/> LOGIC LAB</div></div>
  <section className="foundation-panel">
   <div className="foundation-panel-heading"><div><p className="eyebrow">EXPERIMENT · BINARY CLASSIFICATION</p><h2>Change weights and watch the truth table react.</h2></div><Waypoints size={22}/></div>
   <div className="activation-kind-buttons" role="group" aria-label="Logic gate preset">
    <button type="button" className={gate==='and'?'picked':''} aria-pressed={gate==='and'} onClick={()=>chooseGate('and')}>AND gate</button>
    <button type="button" className={gate==='or'?'picked':''} aria-pressed={gate==='or'} onClick={()=>chooseGate('or')}>OR gate</button>
   </div>
   <div className="perceptron-grid">
    <div className="foundation-chart-card">
     <svg viewBox="0 0 430 285" role="img" className="perceptron-plot" aria-label={gate.toUpperCase()+' perceptron output for four binary input combinations'}>
      <path d="M88 39V240H348" stroke="#749F86" strokeWidth="2" fill="none"/>
      <text x="15" y="47" fill="#B9E3CB" fontSize="12">x₂ = 1</text>
      <text x="16" y="221" fill="#B9E3CB" fontSize="12">x₂ = 0</text>
      <text x="81" y="263" fill="#B9E3CB" fontSize="12">x₁ = 0</text>
      <text x="311" y="263" fill="#B9E3CB" fontSize="12">x₁ = 1</text>
      {table.map((row,i)=>{
        const x=105+215*row.inputs[0],y=218-164*row.inputs[1],selected=i===selection;
        return <g key={i}><circle cx={x} cy={y} r={selected?28:24} fill={row.output?'#A78BFA':'#18443B'} stroke={selected?'#F5E4A2':row.correct?'#638BFF':'#F0A66A'} strokeWidth={selected?4:2}/>
          <text x={x} y={y+5} textAnchor="middle" fill="#F2FFF3" fontWeight="800" fontSize="17">{row.output}</text>
          <text x={x} y={y-39} fill="#B5D8C2" fontSize="12" textAnchor="middle">{'('+row.inputs.join(', ')+')'}</text>
        </g>;
      })}
      <text x="220" y="282" fill="#A6CEB8" fontSize="11" textAnchor="middle">Green output 1 · Dark output 0 · Amber outline = incorrect</text>
     </svg>
     <div className="perceptron-pairs" role="group" aria-label="Choose binary input example">
       {BINARY_INPUTS.map((pair,i)=><button key={i} type="button" aria-pressed={selection===i} className={selection===i?'picked':''} onClick={()=>setSelection(i)}>{pair[0]}, {pair[1]}</button>)}
     </div>
     <div className="tensor-metrics">
       <div><span>Weighted sum z</span><strong data-testid="perceptron-z">{fmt(chosen.z)}</strong></div>
       <div><span>Predicted class</span><strong data-testid="perceptron-output">{chosen.output}</strong></div>
       <div><span>Gate matches</span><strong data-testid="perceptron-matches">{correct} / 4</strong></div>
     </div>
    </div>
    <div className="foundation-parameter-card">
      <div className="foundation-parameter-header"><h3>Decision rule</h3><button type="button" onClick={reset}><RotateCcw size={15}/> Reset</button></div>
      {[0,1].map(i=><label key={i} className="foundation-range" htmlFor={'perceptron-weight-'+i}><span>Weight w{i+1}<strong>{fmt(weights[i])}</strong></span><input id={'perceptron-weight-'+i} type="range" min="-2" max="2" step=".1" value={weights[i]} onChange={e=>setWeights(old=>old.map((w,j)=>i===j?Number(e.target.value):w))}/></label>)}
      <label className="foundation-range" htmlFor="perceptron-bias"><span>Bias b<strong>{fmt(bias)}</strong></span><input id="perceptron-bias" type="range" min="-2" max="2" step=".1" value={bias} onChange={e=>setBias(Number(e.target.value))}/></label>
      <p className="forward-equation" data-testid="perceptron-equation">z = {chosen.inputs[0]} × {fmt(weights[0])} + {chosen.inputs[1]} × {fmt(weights[1])} + ({fmt(bias)}) = <strong>{fmt(chosen.z)}</strong></p>
      <p className="foundation-note">Step activation: output is 1 when z ≥ 0; otherwise it is 0. The weights and bias here are manually specified, not learned by training.</p>
    </div>
   </div>
  </section>
  <section className="foundation-panel">
   <div className="foundation-panel-heading"><div><p className="eyebrow">OBSERVE · ALL FOUR COMBINATIONS</p><h2>Live truth table</h2></div></div>
   <div className="perceptron-table"><table><thead><tr><th>x₁</th><th>x₂</th><th>Target ({gate.toUpperCase()})</th><th>z</th><th>Prediction</th><th>Result</th></tr></thead>
    <tbody>{table.map((row,i)=><tr key={i} className={selection===i?'selected':''}><td>{row.inputs[0]}</td><td>{row.inputs[1]}</td><td>{row.target}</td><td>{fmt(row.z)}</td><td>{row.output}</td><td>{row.correct?'✓ Correct':'✕ Different'}</td></tr>)}</tbody></table></div>
  </section>
  <section className="foundation-panel foundation-review"><div><p className="eyebrow">CHALLENGE · LINEAR SEPARABILITY</p><h2><CircleHelp size={19}/> Can one step perceptron solve XOR exactly?</h2></div><div className="foundation-review-actions">
   <button type="button" aria-pressed={answer==='yes'} className={answer==='yes'?'picked':''} onClick={()=>setAnswer('yes')}>Yes</button>
   <button type="button" aria-pressed={answer==='no'} className={answer==='no'?'picked':''} onClick={()=>setAnswer('no')}>No</button>
   {answer&&<div role="status" className="foundation-answer">{answer==='no'?'Correct. XOR is not linearly separable; a single step perceptron cannot model all four XOR outputs.':'Not quite. XOR needs a nonlinear boundary, which one step perceptron cannot create in 2D.'}</div>}
  </div></section>
  <p className="footnote">Matches the source lecture’s step activation, perceptron, AND/OR truth tables and logic gates. The XOR question extends the single-neuron limitations topic.</p>
 </div>;
}

