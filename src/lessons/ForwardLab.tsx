import {StagePlayer} from '../components/StagePlayer';
import {lazy,Suspense} from 'react';
const NetworkScene=lazy(()=>import('../visuals/NetworkScene').then(m=>({default:m.NetworkScene})));
import {PythonProgram} from '../components/PythonProgram';
import {forwardPython} from '../python/programs';
import { useMemo, useState } from 'react';
import { ChevronRight, RotateCcw, Layers3, GitBranch, CircleHelp } from 'lucide-react';
import { denseForward, DEFAULT_FORWARD_INPUT, DEFAULT_FORWARD_LAYERS, type DenseLayer } from '../engine/forward';

type Edge={layer:number;neuron:number;source:number};
const steps=['Inputs','Hidden sums','Hidden activations','Output sum','Final prediction'] as const;
const fmt=(v:number)=>Number(v.toFixed(3)).toString();
const positions=[
 [{x:74,y:110},{x:74,y:262}],
 [{x:300,y:110},{x:300,y:262}],
 [{x:531,y:186}]
];
const initialEdge:Edge={layer:0,neuron:0,source:0};
function NetworkDiagram({trace,layers,step,edge,onSelect}:{trace:ReturnType<typeof denseForward>;layers:DenseLayer[];step:number;edge:Edge;onSelect:(v:Edge)=>void}){
  const segments: {layer:number;neuron:number;source:number;start:{x:number;y:number};end:{x:number;y:number};weight:number;contribution:number}[]=[];
  for(let l=0;l<layers.length;l++){
    for(let n=0;n<layers[l].weights.length;n++){
      for(let s=0;s<layers[l].weights[n].length;s++){
        segments.push({layer:l,neuron:n,source:s,start:positions[l][s],end:positions[l+1][n],weight:layers[l].weights[n][s],contribution:trace.layers[l].neurons[n].contributions[s]});
      }
    }
  }
  return <svg viewBox="0 0 610 372" className="forward-network" role="img" aria-label="Interactive forward propagation computational graph, two input nodes, two hidden neurons and one output neuron">
    <defs><marker id="forward-arrow" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto"><path d="M0 0L5 2.5L0 5" fill="#9CCBB4"/></marker></defs>
    {['INPUTS','HIDDEN · ReLU','OUTPUT · SIGMOID'].map((name,i)=><text key={name} x={positions[i][0].x} y="29" className="forward-heading" textAnchor="middle">{name}</text>)}
    {segments.map(s=>{
      const active=s.layer===0?step>=1:step>=3;
      const chosen=edge.layer===s.layer&&edge.neuron===s.neuron&&edge.source===s.source;
      const x1=s.start.x+24,y1=s.start.y,x2=s.end.x-24,y2=s.end.y;
      const midX=(x1+x2)/2,midY=(y1+y2)/2;
      return <g key={s.layer+'-'+s.neuron+'-'+s.source} role="button" tabIndex={0} aria-label={'Connection '+(s.layer===0?'Input '+(s.source+1)+' to Hidden '+(s.neuron+1):'Hidden '+(s.source+1)+' to Output 1')} onClick={()=>onSelect({layer:s.layer,neuron:s.neuron,source:s.source})} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect({layer:s.layer,neuron:s.neuron,source:s.source})}}} style={{cursor:'pointer'}}>
        <path d={'M'+x1+' '+y1+'L'+x2+' '+y2} stroke="transparent" strokeWidth="23" fill="none"/>
        <path d={'M'+x1+' '+y1+'L'+x2+' '+y2} stroke={chosen?'#F7E0A1':s.weight>=0?'#638BFF':'#F0A66A'} strokeWidth={chosen?5:3} opacity={active?1:.28} markerEnd="url(#forward-arrow)" fill="none"/>
        <rect pointerEvents="none" x={midX-25} y={midY-12} width="50" height="24" rx="7" fill={chosen?'#3A5743':'#102F2B'} stroke={chosen?'#F7E0A1':'#3A6857'}/>
        <text pointerEvents="none" x={midX} y={midY+4} fontSize="11" fill="#EFFEF1" textAnchor="middle">{fmt(s.weight)}</text>
      </g>;
    })}
    {positions.map((nodes,i)=>nodes.map((pos,j)=>{
      const value=i===0?trace.input[j]:trace.layers[i-1].neurons[j].output;
      const isReady=i===0||i===1&&step>=2||i===2&&step>=4;
      return <g key={i+'-'+j}>
        <circle cx={pos.x} cy={pos.y} r="25" fill={isReady?'#A78BFA':'#16483D'} stroke={isReady?'#A9E6B2':'#4B8370'} strokeWidth="2"/>
        <text x={pos.x} y={pos.y+4} fontSize="12" fontWeight="bold" textAnchor="middle" fill="#F1FFF3">{isReady?fmt(value):'?'}</text>
        <text x={pos.x} y={pos.y+48} fontSize="12" fill="#A8D4BE" textAnchor="middle">{i===0?'x'+(j+1):i===1?'h'+(j+1):'ŷ'}</text>
      </g>;
    }))}
    <text x="305" y="339" textAnchor="middle" fill="#9FC7B3" fontSize="12">Select any connection to inspect its exact multiplication and edit its weight.</text>
  </svg>;
}
export function ForwardLab(){
 const [view3d,setView3d]=useState(false);
  const [inputs,setInputs]=useState<number[]>([...DEFAULT_FORWARD_INPUT]);
  const [layers,setLayers]=useState<DenseLayer[]>(()=>DEFAULT_FORWARD_LAYERS.map(l=>({weights:l.weights.map(r=>[...r]),biases:[...l.biases],activation:l.activation})));
  const [selected,setSelected]=useState<Edge>(initialEdge);
  const [step,setStep]=useState(4);
  const [answer,setAnswer]=useState<'forward'|'backward'|null>(null);
  const [tab,setTab]=useState<'math'|'code'>('math');
  const trace=useMemo(()=>denseForward(inputs,layers),[inputs,layers]);
  const selectedNeuron=trace.layers[selected.layer].neurons[selected.neuron];
  const selectedWeight=layers[selected.layer].weights[selected.neuron][selected.source];
  const selectedContribution=selectedNeuron.contributions[selected.source];
  const setWeight=(v:number)=>setLayers(old=>old.map((l,i)=>i===selected.layer?({...l,weights:l.weights.map((r,j)=>j===selected.neuron?r.map((w,k)=>k===selected.source?v:w):r)}):l));
  const setBias=(layer:number,index:number,v:number)=>setLayers(old=>old.map((l,i)=>i===layer?({...l,biases:l.biases.map((b,j)=>j===index?v:b)}):l));
  const reset=()=>{setInputs([...DEFAULT_FORWARD_INPUT]);setLayers(DEFAULT_FORWARD_LAYERS.map(l=>({weights:l.weights.map(r=>[...r]),biases:[...l.biases],activation:l.activation})));setSelected(initialEdge);setStep(4);setAnswer(null)};
  const inspect=step===0?null:step<=2?trace.layers[0]:trace.layers[1];
  return <div className="foundation-page forward-lab">
    <div className="heading"><div><div className="crumb"><span>MODULE 03</span><ChevronRight size={15}/><span>LECTURE 03–04 · FORWARD PROPAGATION</span></div>
      <h1>Follow every signal<span className="dot">.</span></h1><p className="subtitle">A real two-layer dense network, calculated from your current weights—not a looping animation.</p></div><div className="module-chip"><Layers3 size={14}/> LIVE FORWARD PASS</div></div>
    <section className="foundation-panel" aria-label="Interactive dense network">
      <div className="foundation-panel-heading"><div><p className="eyebrow">INPUT → HIDDEN → OUTPUT</p><h2>What happens between layers?</h2></div><GitBranch size={21}/></div>
      <div className="forward-grid">
        <div className="foundation-chart-card">
          <button aria-pressed={view3d} onClick={()=>setView3d(v=>!v)}>{view3d?"Use 2D network":"Explore 3D network"}</button>{view3d?<Suspense fallback={<p>Loading network…</p>}><NetworkScene trace={trace} selected={selected} step={step} onSelect={setSelected}/></Suspense>:<NetworkDiagram trace={trace} layers={layers} step={step} edge={selected} onSelect={setSelected}/>}
          <div className="forward-edge-list" role="group" aria-label="Select a weighted connection">
            {layers.flatMap((layer,l)=>layer.weights.flatMap((row,n)=>row.map((_weight,s)=>{
              const label=l===0?'Input '+(s+1)+' to Hidden '+(n+1):'Hidden '+(s+1)+' to Output 1';
              const active=selected.layer===l&&selected.neuron===n&&selected.source===s;
              return <button type="button" key={l+'-'+n+'-'+s} aria-pressed={active} className={active?'picked':''} onClick={()=>setSelected({layer:l,neuron:n,source:s})} aria-label={'Inspect '+label}>{label}</button>;
            })))}
          </div>
          <StagePlayer step={step} count={steps.length} onStep={setStep} label="Forward playback"/><div className="forward-stages" role="group" aria-label="Forward computation stages">{steps.map((label,i)=><button key={label} type="button" className={step===i?'picked':''} aria-pressed={step===i} onClick={()=>setStep(i)}>{i+1}. {label}</button>)}</div>
        </div>
        <div className="foundation-parameter-card">
          <div className="foundation-parameter-header"><h3>Change the network</h3><button type="button" onClick={reset} aria-label="Reset forward pass"><RotateCcw size={15}/> Reset</button></div>
          <p className="eyebrow">INPUT SIGNALS</p>
          {inputs.map((x,i)=><label className="foundation-range" key={i} htmlFor={'forward-input-'+i}><span>Input x{i+1}<strong>{fmt(x)}</strong></span><input id={'forward-input-'+i} type="range" min="-3" max="3" step=".1" value={x} onChange={e=>setInputs(old=>old.map((v,j)=>i===j?Number(e.target.value):v))}/></label>)}
          <div className="control-divider"/>
          <p className="eyebrow">SELECTED CONNECTION</p><p className="forward-selected" data-testid="selected-edge">{selected.layer===0?'Input '+(selected.source+1)+' → Hidden '+(selected.neuron+1):'Hidden '+(selected.source+1)+' → Output'}</p>
          <label className="foundation-range" htmlFor="forward-weight"><span>Connection weight <strong>{fmt(selectedWeight)}</strong></span><input id="forward-weight" type="range" min="-2" max="2" step=".1" value={selectedWeight} onChange={e=>setWeight(Number(e.target.value))}/></label>
          <p className="forward-equation" data-testid="edge-calculation">{fmt(selectedNeuron.inputs[selected.source])} × {fmt(selectedWeight)} = <strong>{fmt(selectedContribution)}</strong></p>
          <div className="control-divider"/>
          <p className="eyebrow">NEURON BIASES</p>
          {layers.map((l,i)=>l.biases.map((b,j)=><label key={i+'-'+j} className="foundation-range" htmlFor={'forward-bias-'+i+'-'+j}><span>{i===0?'Hidden '+(j+1):'Output'} bias<strong>{fmt(b)}</strong></span><input id={'forward-bias-'+i+'-'+j} type="range" min="-2" max="2" step=".1" value={b} onChange={e=>setBias(i,j,Number(e.target.value))}/></label>))}
        </div>
      </div>
    </section>
    <div className="forward-results">
      <section className="foundation-panel"><p className="eyebrow">FINAL PREDICTION</p><strong data-testid="forward-output" className="forward-output">{fmt(trace.output[0])}</strong><p className="foundation-mini">Sigmoid of the final weighted sum. A fixed-weight forward pass is not training.</p></section>
      <section className="foundation-panel"><div className="forward-tabs" role="tablist" aria-label="Forward inspector"><button role="tab" aria-selected={tab==='math'} className={tab==='math'?'picked':''} onClick={()=>setTab('math')}>Math</button><button role="tab" aria-selected={tab==='code'} className={tab==='code'?'picked':''} onClick={()=>setTab('code')}>Code</button></div>
        {tab==='math'?<div className="forward-math" data-testid="forward-inspector"><strong>{steps[step]}</strong>{inspect?inspect.neurons.map((n,i)=><p key={i}>{step<=2?'Hidden '+(i+1):'Output'}: z = {n.contributions.map(fmt).join(' + ')} + ({fmt(n.bias)}) = <strong>{fmt(n.z)}</strong> → {n.activation}(z) = <strong>{fmt(n.output)}</strong></p>):<p>Current input vector: [{inputs.map(fmt).join(', ')}]</p>}</div>:<PythonProgram source={forwardPython(inputs,layers)}/>}
      </section>
    </div>
    <section className="foundation-panel foundation-review"><div><p className="eyebrow">CONCEPT CHECK</p><h2><CircleHelp size={18}/> Which direction does the input information move?</h2></div><div className="foundation-review-actions">
      <button type="button" aria-pressed={answer==='forward'} className={answer==='forward'?'picked':''} onClick={()=>setAnswer('forward')}>Input → hidden → output</button>
      <button type="button" aria-pressed={answer==='backward'} className={answer==='backward'?'picked':''} onClick={()=>setAnswer('backward')}>Output → hidden → input</button>
      {answer&&<div role="status" className="foundation-answer">{answer==='forward'?'Correct. The forward pass applies each layer in sequence. Backpropagation computes gradients in the reverse direction.':'That is the backward direction, used to propagate gradients during training. Predictions use the forward direction.'}</div>}
    </div></section>
    <p className="footnote">Aligned to your lecture outlines on artificial neurons, layers and numerical forward passes. This is a small 2 → 2 → 1 learning example, not an actual trained MNIST model.</p>
  </div>;
}

