import {PythonProgram} from './components/PythonProgram';
import {neuronPython} from './python/programs';
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { BrainCircuit, BookOpen, Check, ChevronRight, Eye, Play, Pause, RotateCcw, SkipForward, SlidersHorizontal, ZoomIn } from 'lucide-react';
import { computeNeuron, formatNumber, activationNames } from './engine/neuron';
import { TIMELINE, LAST_STEP } from './engine/timeline';
import { useLab } from './store/lab';
const NeuronScene=lazy(()=>import('./visuals/NeuronScene').then(m=>({default:m.NeuronScene})));
const LearningDashboard=lazy(()=>import('./lessons/LearningDashboard').then(m=>({default:m.LearningDashboard})));
const PythonWorkshop=lazy(()=>import('./lessons/PythonWorkshop').then(m=>({default:m.PythonWorkshop})));
const MathWorkshop=lazy(()=>import('./lessons/MathWorkshop').then(m=>({default:m.MathWorkshop})));
import { NeuronDiagram } from './visuals/NeuronDiagram';
import { ActivationPlot } from './visuals/ActivationPlot';
import { ParameterSlider } from './components/ParameterSlider';
import { WorkspaceNavigation } from './components/WorkspaceNavigation';
import { NeuronMission } from './components/NeuronMission';
import { useWorkspace, type ActiveLesson } from './store/workspace';
const FoundationsLab=lazy(()=>import('./lessons/FoundationsLab').then(m=>({default:m.FoundationsLab})));
const ActivationExplorer=lazy(()=>import('./lessons/ActivationExplorer').then(m=>({default:m.ActivationExplorer})));
const ForwardLab=lazy(()=>import('./lessons/ForwardLab').then(m=>({default:m.ForwardLab})));
const TensorLab=lazy(()=>import('./lessons/TensorLab').then(m=>({default:m.TensorLab})));
const PerceptronLab=lazy(()=>import('./lessons/PerceptronLab').then(m=>({default:m.PerceptronLab})));
const LossGradientLab=lazy(()=>import('./lessons/LossGradientLab').then(m=>({default:m.LossGradientLab})));
const BackpropLab=lazy(()=>import('./lessons/BackpropLab').then(m=>({default:m.BackpropLab})));
const GradientDepthLab=lazy(()=>import('./lessons/GradientDepthLab').then(m=>({default:m.GradientDepthLab})));

const TrainingProject = lazy(()=>import('./lessons/TrainingProject').then(m=>({default:m.TrainingProject})));
const BeginnerCourse = lazy(()=>import('./lessons/BeginnerCourse').then(m=>({default:m.BeginnerCourse})));
const CurriculumLibrary = lazy(()=>import('./lessons/CurriculumLibrary').then(m=>({default:m.CurriculumLibrary}))); 
const PythonFlowLab=lazy(()=>import('./lessons/PythonFlowLab').then(m=>({default:m.PythonFlowLab})));
const PythonBasicsLab=lazy(()=>import('./lessons/PythonBasicsLab').then(m=>({default:m.PythonBasicsLab})));
const PythonTraceLab=lazy(()=>import('./lessons/PythonTraceLab').then(m=>({default:m.PythonTraceLab})));

type View='3d'|'2d';
type InspectorTab='math'|'code'|'challenge';
function canUseWebGL(){try{const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'));}catch{return false;}}
const fmt=formatNumber;
function Equation({values,weights,bias,z}:{values:readonly number[];weights:readonly number[];bias:number;z:number}){
  return <div className="equation-lines"><p><span className="math-tag">WEIGHTED SUM</span></p><p className="formula">z = Σ(xᵢ × wᵢ) + b</p>
  <p className="formula-detail">= {values.map((v,i)=>`(${fmt(v)} × ${fmt(weights[i])})`).join(' + ')} + ({fmt(bias)})</p>
  <p className="formula-result">z = <strong>{fmt(z)}</strong></p></div>;
}
function Challenge({output,inputs,weights,bias,activation,setWeight}:{output:number;inputs:number[];weights:number[];bias:number;activation:typeof activationNames[number];setWeight:(i:number,n:number)=>void}){
  const [prediction,setPrediction]=useState<'increase'|'decrease'|'same'|null>(null);
  const [result,setResult]=useState<{correct:boolean;previous:number;next:number;direction:string}|null>(null);
  const next=Math.min(3,weights[0]+0.5);
  const isSame=next===weights[0];
  const projected=useMemo(()=>computeNeuron({inputs,weights:weights.map((w,i)=>i===0?next:w),bias,activation}).output,[inputs,weights,bias,activation,next]);
  const direction=fmt(projected)===fmt(output)?'same':projected>output?'increase':'decrease';
  return <div className="challenge"><p className="eyebrow">PREDICT · THEN EXPERIMENT</p><h3>What happens if weight 1 increases by up to 0.5?</h3>
    <p className="hint">The result depends on input 1 and the selected activation. A negative input may reverse the effect; ReLU may keep output at zero.</p>
    <div className="choice-row"><button className={prediction==='increase'?'selected':''} onClick={()=>{setPrediction('increase');setResult(null)}}>Output increases</button><button className={prediction==='decrease'?'selected':''} onClick={()=>{setPrediction('decrease');setResult(null)}}>Output decreases</button><button className={prediction==='same'?'selected':''} onClick={()=>{setPrediction('same');setResult(null)}}>Output unchanged</button></div>
    <button className="action" disabled={!prediction||isSame} onClick={()=>{setResult({correct:prediction===direction,previous:output,next:projected,direction});setWeight(0,next)}}>Test prediction <ChevronRight size={16}/></button>
    {isSame&&<p className="hint">Move weight 1 below its maximum to try this experiment.</p>}
    {result&&<div className="feedback" role="status">{result.correct?<><Check size={16}/> Correct.</>:<>Try again.</>} At displayed precision, the output {result.direction==='same'?'stays unchanged':result.direction==='increase'?'increases':'decreases'}. <small>Before: {fmt(result.previous)} · After: {fmt(result.next)}. Current input and activation determine the behavior.</small></div>}
  </div>;
}

export default function App(){
  const {inputs,weights,bias,activation,step,playing,speed,setInput,setWeight,setBias,setActivation,setStep,setSpeed,play,pause,advance,reset}=useLab();
  const trace=useMemo(()=>computeNeuron({inputs,weights,bias,activation}),[inputs,weights,bias,activation]);
  const [supported]=useState(canUseWebGL);
  const [view,setView]=useState<View>('2d');
  const [tab,setTab]=useState<InspectorTab>('math');
  const [activeLesson,setActiveLesson]=useWorkspace();
  const [beginnerStart,setBeginnerStart]=useState<string|undefined>(undefined);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const closeSidebar=useCallback(()=>setSidebarOpen(false),[]);
  const navigate=(id:ActiveLesson,topic?:string)=>{setBeginnerStart(topic);setActiveLesson(id);pause();};
  useEffect(()=>{if(!playing)return;const handle=window.setInterval(()=>{const {step:s,advance:a,pause:p}=useLab.getState();if(s>=LAST_STEP)p();else a();},Math.max(250,1250/speed));return()=>window.clearInterval(handle);},[playing,speed]);
  useEffect(()=>{const mq=window.matchMedia('(prefers-reduced-motion: reduce)');const stop=()=>{if(mq.matches)pause();};if(playing)stop();mq.addEventListener('change',stop);return()=>mq.removeEventListener('change',stop);},[playing,pause]);
  useEffect(()=>{pause();const main=document.getElementById('lab');main?.focus({preventScroll:true});main?.scrollIntoView({block:'start',behavior:'instant'});},[activeLesson,pause]);
  useEffect(()=>{const stop=()=>{if(document.hidden)pause();};document.addEventListener('visibilitychange',stop);return()=>document.removeEventListener('visibilitychange',stop);},[pause]);
  const resetAll=()=>{reset();setTab('math');};
  return <div className="app-shell">
    <a className="skip-link" href="#lab" onClick={e=>{e.preventDefault();document.getElementById('lab')?.focus();document.getElementById('lab')?.scrollIntoView({block:'start'});}}>Skip to learning workspace</a><header className="top-bar"><a className="brand" href="#/lab/neuron" onClick={e=>{e.preventDefault();navigate('neuron');}}><BrainCircuit size={28} strokeWidth={2.4}/><span>Neural<span>Lab</span></span></a>
      <nav className="global-nav" aria-label="Main navigation"><a className={activeLesson!=='library'&&activeLesson!=='dashboard'?'active':''} aria-current={activeLesson!=='library'&&activeLesson!=='dashboard'?'page':undefined} href="#/lab/neuron" onClick={e=>{e.preventDefault();navigate('neuron');}}>Learn</a><a className={activeLesson==='library'?'active':''} aria-current={activeLesson==='library'?'page':undefined} href="#/lab/library" onClick={e=>{e.preventDefault();navigate('library');}}>Curriculum</a></nav>
      <button className={'dashboard-link '+(activeLesson==='dashboard'?'current':'')} aria-current={activeLesson==='dashboard'?'page':undefined} onClick={()=>navigate('dashboard')}>My learning</button><span className="header-label">AN EXPERIMENT IN UNDERSTANDING <span className="status-dot"/></span>
      <button className="mobile-toggle" onClick={()=>setSidebarOpen(v=>!v)} aria-expanded={sidebarOpen} aria-controls="course-navigation" aria-label="Toggle lesson navigation"><BookOpen size={20}/></button>
    </header>
    <div className="app-grid" id="top">
      <WorkspaceNavigation active={activeLesson} open={sidebarOpen} close={closeSidebar} navigate={navigate}/>
      <main id="lab" className="workspace" tabIndex={-1}><Suspense fallback={<p role="status">Loading learning workspace…</p>}> {activeLesson==='dashboard'?<LearningDashboard onLesson={id=>{setBeginnerStart(id);setActiveLesson('beginner');}}/>:activeLesson==='python-workshop'?<PythonWorkshop/>:activeLesson==='math-workshop'?<MathWorkshop/>:activeLesson==='training-project'?<TrainingProject/>:activeLesson==='beginner'?<BeginnerCourse key={beginnerStart} initialLesson={beginnerStart} onOpen={id=>setActiveLesson(id as ActiveLesson)}/>:activeLesson==='python-flow'?<PythonFlowLab/>:activeLesson==='python-basics'?<PythonBasicsLab/>:activeLesson==='library'?<CurriculumLibrary/>:activeLesson==='python'?<PythonTraceLab/>:activeLesson==='intro'?<FoundationsLab/>:activeLesson==='activation'?<ActivationExplorer/>:activeLesson==='propagation'?<ForwardLab/>:activeLesson==='tensor'?<TensorLab/>:activeLesson==='perceptron'?<PerceptronLab/>:activeLesson==='loss'?<LossGradientLab/>:activeLesson==='backprop'?<BackpropLab/>:activeLesson==='gradient-depth'?<GradientDepthLab/>:<>
        <div className="heading"><div><div className="crumb"><span>MODULE 02</span><ChevronRight size={15}/> <span>ARTIFICIAL NEURONS</span></div><h1>Inside a Neuron<span className="dot">.</span></h1><p className="subtitle">Move the numbers. Follow the signals. Understand the result.</p></div><div className="module-chip"><span className="status-dot"/> LIVE SIMULATION</div></div>
        <NeuronMission/>
        <div className="workbench">
          <section className="scene-card" aria-label="Neuron visualization"><div className="scene-bar"><div className="scene-label"><Eye size={17}/> LIVE COMPUTATION <span className="badge-muted">STEP {step+1} / 6</span></div><div className="view-switch" role="group" aria-label="Visualization mode"><button className={view==='2d'?'on':''} onClick={()=>setView('2d')} aria-pressed={view==='2d'}>2D</button><button className={view==='3d'?'on':''} onClick={()=>setView('3d')} disabled={!supported} aria-pressed={view==='3d'}>3D</button></div></div>
            <div className="canvas-area">{view==='3d'&&supported?<NeuronScene inputs={inputs} weights={weights} trace={trace} step={step}/>:<NeuronDiagram inputs={inputs} weights={weights} trace={trace} step={step}/>}<div className="scene-hint"><ZoomIn size={14}/>{view==='3d'?'Drag to rotate · Scroll to zoom · Right drag to pan':'2D mathematical flow'}</div></div>
            <div className="playback"><div className="play-top"><div><span className="eyebrow">COMPUTATION TIMELINE</span><h3>{TIMELINE[step].label}</h3><p>{TIMELINE[step].explanation}</p></div><div className="transport"><button onClick={resetAll} title="Reset simulation" aria-label="Reset simulation"><RotateCcw size={18}/></button><button className="play-button" onClick={playing?pause:play} aria-label={playing?'Pause':'Play'} aria-pressed={playing}>{playing?<Pause size={19} fill="currentColor"/>:<Play size={19} fill="currentColor"/>}</button><button aria-label="Previous step" disabled={step===0} onClick={()=>{pause();setStep(step-1);}}>←</button><button onClick={advance} disabled={step>=LAST_STEP} title="Next calculation step" aria-label="Next step"><SkipForward size={19}/></button></div></div>
              <div className="timeline" role="group" aria-label="Calculation stages">{TIMELINE.map((item,index)=><button title={item.label} aria-label={`Go to ${item.label}`} aria-current={step===index?'step':undefined} key={item.short} className={index<=step?'past':''} onClick={()=>setStep(index)}><span/>{item.short}</button>)}</div>
              <div className="speed"><label htmlFor="speed-select">Playback speed</label><select id="speed-select" value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></div></div>
          </section>
          <aside className="controls"><div className="control-heading"><div><p className="eyebrow">EXPERIMENT</p><h2>Parameters</h2></div><SlidersHorizontal size={18}/></div>
            <div className="control-content"><h3>Inputs</h3>{inputs.map((value,i)=><ParameterSlider key={i} label={`Input x${i+1}`} value={value} onChange={v=>setInput(i,v)} color="var(--input)"/>)}
            <div className="control-divider"/><h3>Weights</h3>{weights.map((value,i)=><ParameterSlider key={i} label={`Weight w${i+1}`} value={value} onChange={v=>setWeight(i,v)} color="var(--weight)"/>)}
            <div className="control-divider"/><h3>Bias</h3><ParameterSlider label="Bias b" value={bias} onChange={setBias} color="var(--gradient)"/>
            <div className="control-divider"/><label className="activation-select" htmlFor="activation">Activation function</label><select id="activation" value={activation} onChange={e=>setActivation(e.target.value as typeof activation)}>{activationNames.map(a=><option key={a} value={a}>{a==='relu'?'ReLU':a.charAt(0).toUpperCase()+a.slice(1)}</option>)}</select>
            <button className="reset-params" onClick={resetAll}><RotateCcw size={15}/> Reset parameters</button></div>
          </aside>
        </div>
        <div className="results-row"><section className="result-card result-output"><p className="eyebrow">FINAL OUTPUT · a = f(z)</p><strong data-testid="output">{fmt(trace.output)}</strong><div className="result-foot"><span>Activation: {activation}</span><span className="live-indicator">● Recalculated live</span></div></section>
          <section className="result-card plot-card"><div className="result-title"><div><p className="eyebrow">ACTIVATION CURVE</p><h3>{activation==='relu'?'ReLU':activation.charAt(0).toUpperCase()+activation.slice(1)}</h3></div><span className="badge-muted">z = {fmt(trace.preActivation)}</span></div><ActivationPlot kind={activation} z={trace.preActivation}/></section>
          <section className="result-card trace-card"><div className="tab-row" role="tablist" aria-label="Computation inspector"><button role="tab" aria-selected={tab==='math'} className={tab==='math'?'selected':''} onClick={()=>setTab('math')}>Math</button><button role="tab" aria-selected={tab==='code'} className={tab==='code'?'selected':''} onClick={()=>setTab('code')}>Code</button><button role="tab" aria-selected={tab==='challenge'} className={tab==='challenge'?'selected':''} onClick={()=>setTab('challenge')}>Challenge</button></div>
            <div className="tab-content">{tab==='math'?<><Equation values={inputs} weights={weights} bias={bias} z={trace.preActivation}/><p className="output-formula">a = {activation}(z) = <strong>{fmt(trace.output)}</strong></p></>:tab==='code'?<PythonProgram source={neuronPython(inputs,weights,bias,activation)}/>:<Challenge output={trace.output} inputs={inputs} weights={weights} bias={bias} activation={activation} setWeight={setWeight}/>}</div></section></div>
      </>}
      </Suspense></main>
    </div>
  </div>;
}

