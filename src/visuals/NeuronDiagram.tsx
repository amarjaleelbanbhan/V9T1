import type { NeuronTrace } from '../engine/neuron';
import { formatNumber } from '../engine/neuron';
export function NeuronDiagram({inputs,weights,trace,step}:{inputs:number[];weights:number[];trace:NeuronTrace;step:number}) {
  return <svg viewBox="0 0 700 360" className="diagram" role="img" aria-label="Neuron computation graph with input nodes, weighted sum, bias, activation and output">
    <defs><linearGradient id="wire-grad"><stop stopColor="#8BBB92"/><stop offset="1" stopColor="#2A835F"/></linearGradient></defs>
    {inputs.map((input,i)=>{const y=74+i*100;return <g key={i}>
      <path d={`M 117 ${y} Q 245 ${y} 290 174`} stroke={step>=1?(weights[i]<0?'#F6B679':'#8BBB92'):'#31594f'} fill="none" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="94" cy={y} r="30" fill="#12544F" stroke="#8BBB92" strokeWidth="2"/>
      <text x="94" y={y+5} className="svg-main" textAnchor="middle">{formatNumber(input)}</text>
      <text x="198" y={y-15} className="svg-small" textAnchor="middle">w={formatNumber(weights[i])}</text>
      <text x="210" y={y+22} className="svg-em" textAnchor="middle">{step>=1?formatNumber(trace.contributions[i]):'×'}</text>
    </g>})}
    <circle cx="320" cy="174" r="44" fill="#2A835F" stroke="#8BBB92" strokeWidth="2"/>
    <text x="320" y="183" className="svg-sigma" textAnchor="middle">Σ</text>
    <path d="M 365 174 H 460" stroke={step>=3?'#8BBB92':'#31594f'} strokeWidth="4"/>
    <rect x="459" y="135" width="85" height="78" rx="20" fill="#12544F" stroke="#8BBB92" strokeWidth="2"/>
    <text x="501" y="182" className="svg-main" textAnchor="middle">f(z)</text>
    <path d="M 544 174 H 610" stroke={step>=5?'#8BBB92':'#31594f'} strokeWidth="4"/>
    <circle cx="634" cy="174" r="31" fill="#2A835F" stroke="#8BBB92" strokeWidth="2"/>
    <text x="634" y="180" className="svg-main" textAnchor="middle">{step>=5?formatNumber(trace.output):'?'}</text>
    <rect x="269" y="257" width="105" height="48" rx="12" fill="#123A41" stroke="#8BBB92"/>
    <text x="321" y="286" className="svg-main" textAnchor="middle">b = {formatNumber(trace.bias)}</text>
    <path d="M 321 257 V 222" stroke="#8BBB92" strokeWidth="3" strokeDasharray="4 5"/>
    <text x="321" y="55" className="svg-label" textAnchor="middle">{step>=2?`Sum: ${formatNumber(trace.weightedSum)}`:'SUM'}</text>
    <text x="501" y="110" className="svg-label" textAnchor="middle">{step>=3?`z = ${formatNumber(trace.preActivation)}`:'ACTIVATION'}</text>
    <text x="634" y="110" className="svg-label" textAnchor="middle">OUTPUT</text>
  </svg>;
}
