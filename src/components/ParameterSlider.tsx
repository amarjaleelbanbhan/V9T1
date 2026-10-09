import { formatNumber } from '../engine/neuron';

type Props = { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; color?: string };
export function ParameterSlider({ label, value, onChange, min=-3, max=3, color='var(--mint)' }: Props) {
  return <label className="parameter">
    <span className="parameter-head"><span>{label}</span><strong>{formatNumber(value)}</strong></span>
    <input type="range" min={min} max={max} step="0.1" value={value} style={{accentColor:color}} onChange={e=>onChange(Number(e.target.value))}/>
    <span className="parameter-ends"><small>{min}</small><small>{max}</small></span>
  </label>;
}
