import { activate, type Activation, formatNumber } from '../engine/neuron';
export function ActivationPlot({kind,z}:{kind:Activation;z:number}){
  const xmin=-5,xmax=5;
  const ymin=kind==='tanh'?-1.25:kind==='relu'||kind==='linear'?-5:0;
  const ymax=kind==='relu'?5.25:kind==='linear'?5:1.25;
  const px=(x:number)=>22+(x-xmin)/(xmax-xmin)*256;
  const py=(y:number)=>142-(y-ymin)/(ymax-ymin)*125;
  const path=Array.from({length:151},(_,i)=>{const x=xmin+i/15;return `${i===0?'M':'L'}${px(x).toFixed(2)},${py(activate(x,kind)).toFixed(2)}`}).join(' ');
  const x=Math.max(xmin,Math.min(xmax,z));const y=activate(x,kind);
  return <svg viewBox="0 0 300 173" className="activation-plot" role="img" aria-label={`${kind} activation function graph. Current input ${formatNumber(z)}, output ${formatNumber(activate(z,kind))}`}>
    <path d={`M 22 ${py(0)} H 278 M ${px(0)} 17 V 147`} stroke="#52736D" strokeWidth="1"/>
    <path d={path} fill="none" stroke="#8BBB92" strokeWidth="3.5" strokeLinecap="round"/>
    {z>=xmin&&z<=xmax&&<><path d={`M ${px(x)} ${py(y)} V ${py(0)}`} stroke="#DAF7BA" strokeDasharray="3 4"/><circle cx={px(x)} cy={py(y)} r="6" fill="#DAF7BA" stroke="#092328" strokeWidth="2"/></>}
    <text x="22" y="163" fill="#93BCB0" fontSize="12">-5</text><text x="147" y="163" fill="#93BCB0" fontSize="12">0</text><text x="267" y="163" fill="#93BCB0" fontSize="12">5</text>
  </svg>
}
