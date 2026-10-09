import {useEffect,useRef,useState} from 'react';
import {PYTHON_SOURCE,validateValues,type PythonTrace} from '../python/trace';
export function PythonTraceLab(){
 const [values,setValues]=useState(['1','2','3','4','5','6']);const [trace,setTrace]=useState<PythonTrace|null>(null);const [index,setIndex]=useState(0);const [status,setStatus]=useState('Ready. First run downloads Python and NumPy.');const [busy,setBusy]=useState(false);
 const worker=useRef<Worker|null>(null);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const stop=()=>{worker.current?.terminate();worker.current=null;if(timer.current)clearTimeout(timer.current);timer.current=null;};
 useEffect(()=>()=>{worker.current?.terminate();if(timer.current)clearTimeout(timer.current);},[]);
 const run=()=>{
  stop();setTrace(null);setIndex(0);
  try{
   if(values.some(v=>!v.trim()))throw Error('Enter a number in every cell.');
   const matrix=[values.slice(0,3).map(Number),values.slice(3).map(Number)];validateValues(matrix);
   setBusy(true);setStatus('Loading pinned Pyodide 0.27.7 and executing real NumPy…');
   const w=new Worker(`${import.meta.env.BASE_URL}python-worker.js`);worker.current=w;
   w.onmessage=({data})=>{stop();setBusy(false);if(data.error){setStatus(data.error);return;}setTrace(data.trace);setStatus('Executed Python. Step through captured line events.');};
   w.onerror=()=>{stop();setBusy(false);setStatus('Runtime could not load. Check network access and retry.');};
   timer.current=setTimeout(()=>{stop();setBusy(false);setStatus('Stopped after 90 seconds. No result claimed; retry when runtime downloads are available.');},90_000);
   w.postMessage({values:matrix});
  }catch(e){setBusy(false);setStatus(String(e));}
 };
 const frame=trace?.frames[index];
 return <section aria-label="Python execution visualization"><p className="eyebrow">ACTUAL EXECUTED PYTHON · BOUNDED NUMPY EXAMPLE</p><h1>Watch an array come alive<span className="dot">.</span></h1><p className="subtitle">Edit six numeric inputs. Run a fixed Python program, then inspect its captured line events. This prototype does not run arbitrary code or train models.</p>
 <div className="python-grid">{values.map((v,i)=><label key={i}>x[{Math.floor(i/3)}, {i%3}]<input className="python-input" type="number" min={-1e6} max={1e6} value={v} disabled={busy} onChange={e=>setValues(old=>old.map((x,j)=>j===i?e.target.value:x))}/></label>)}</div>
 <div className="python-actions"><button onClick={run} disabled={busy}>Run Python</button><button className="cancel" disabled={!busy} onClick={()=>{stop();setBusy(false);setStatus('Canceled. Worker and runtime discarded.');}}>Cancel execution</button><button disabled={!trace||index===0} onClick={()=>setIndex(i=>i-1)}>Previous line</button><button disabled={!trace||index>=trace.frames.length-1} onClick={()=>setIndex(i=>i+1)}>Next line</button></div><p role="status">{status}</p>
 <div className="python-code" aria-label="Python source">{(trace?.source||PYTHON_SOURCE).split('\n').map((line,i)=><div key={i} className={frame?.line===i+1?'current-line':''}><code>{i+1} · {line}</code></div>)}</div>
 <p className="foundation-copy">{frame?frame.phase==='complete'?'Execution complete. Final state.':`Before line ${frame.line}: state reflects previous completed statements.`:'The trace appears after successful execution.'}</p>
 {frame?.tensor&&<><div className="python-grid">{frame.tensor.values.flat().map((v,i)=><div className="python-cell" key={i}>{v}</div>)}</div><div className="python-metrics"><span>Shape: ({frame.tensor.shape.join(', ')})</span><span>Rank: {frame.tensor.rank}</span><span>dtype: {frame.tensor.dtype}</span><span>Measured payload: {frame.tensor.payload_bytes} bytes</span></div></>}
 <p className="foundation-mini">Payload excludes object overhead and Python/WASM runtime memory. This runtime is network-dependent on first load; offline support has not been implemented.</p><h2>Captured output</h2><pre className="python-code">{frame?.stdout||'No output at this step.'}</pre>
 </section>;
}
