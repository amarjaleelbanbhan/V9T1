import { useState } from 'react';
import { ArrowRight, Check, FlaskConical } from 'lucide-react';
import { useLab } from '../store/lab';
import { computeNeuron, formatNumber } from '../engine/neuron';
import type { NeuronParameters } from '../engine/neuron';

const mission: NeuronParameters={inputs:[1,-1,0.5],weights:[0.8,0.4,1.2],bias:-2,activation:'relu'};
const target=1.5;
export function NeuronMission() {
  const lab=useLab();
  const [previous,setPrevious]=useState<NeuronParameters|null>(null);
  const [prediction,setPrediction]=useState('');
  const [attempt,setAttempt]=useState<{bias:number;sum:number;z:number;output:number}|null>(null);
  const trace=computeNeuron(lab);
  const fixed=lab.activation==='relu'&&lab.inputs.every((v,i)=>v===mission.inputs[i])&&lab.weights.every((v,i)=>v===mission.weights[i]);
  const passed=attempt&&Math.abs(attempt.output-target)<0.000001;
  const load=()=>{
    setPrevious({inputs:[...lab.inputs],weights:[...lab.weights],bias:lab.bias,activation:lab.activation});
    useLab.setState({...mission,inputs:[...mission.inputs],weights:[...mission.weights],step:0,playing:false});
    setPrediction('');setAttempt(null);
  };
  return <section className={'experiment-mission '+(previous?'mission-running':'')} aria-label="Wake a silent neuron mission">
    <div className="mission-mark"><FlaskConical size={24}/><span>01</span></div>
    <div className="mission-brief"><p className="eyebrow">FIELD CHALLENGE · REASON BEFORE REVEAL</p><h2>Wake a silent neuron.</h2><p>Keep the inputs and weights fixed. Find a bias that makes this ReLU output <strong>{target}</strong>.</p>
    {!previous?<button className="mission-action" onClick={load}>Load the challenge <ArrowRight size={16}/></button>:<>
      <div className="mission-task"><span>01 · Read the weighted sum</span><span>02 · Predict a bias</span><span>03 · Test & explain</span></div>
      <div className="mission-entry"><label>Predicted bias<input type="number" min={-3} max={3} step="any" value={prediction} onChange={e=>{setPrediction(e.target.value);setAttempt(null);}}/></label><button className="mission-action" disabled={!fixed||!prediction.trim()||!Number.isFinite(Number(prediction))||Math.abs(Number(prediction))>3} onClick={()=>{
        const bias=Number(prediction),result=computeNeuron({...lab,bias});
        setAttempt({bias,sum:result.weightedSum,z:result.preActivation,output:result.output});
        lab.setBias(bias);lab.setStep(5);
      }}>Test this bias <ArrowRight size={16}/></button><button className="mission-restore" onClick={()=>{useLab.setState({...previous,inputs:[...previous.inputs],weights:[...previous.weights],step:0,playing:false});setPrevious(null);setAttempt(null);}}>Restore my experiment</button></div>
      {!fixed&&<p className="mission-feedback" role="status">This challenge keeps its inputs, weights and activation fixed. Restore the challenge settings to test a bias, or return to your own experiment.</p>}
      {!fixed&&<button onClick={()=>{useLab.setState({...mission,inputs:[...mission.inputs],weights:[...mission.weights],step:0,playing:false});setAttempt(null);}}>Restore challenge settings</button>}
      {attempt&&fixed&&attempt.bias===lab.bias&&<div className={'mission-feedback '+(passed?'mission-passed':'')} role="status">{passed?<><Check size={17}/> Target reached.</>:<>Keep investigating.</>} <span>z = {formatNumber(attempt.sum)} + ({formatNumber(attempt.bias)}) = {formatNumber(attempt.z)}; ReLU(z) = {formatNumber(attempt.output)}. {passed?'The bias shifts the sum into the active region.':'ReLU clips negative sums to zero. What shift would take the weighted sum to 1.5?'}</span></div>}
      <p className="mission-evidence">A sandbox challenge, separate from saved course evidence.{!attempt&&` Current output: ${formatNumber(trace.output)}.`}</p>
    </>}
    </div>
  </section>;
}
