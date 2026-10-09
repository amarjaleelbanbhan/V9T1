import {useEffect,useRef,useState} from 'react';
export function usePythonProgram<T>(){
 const worker=useRef<Worker|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),resolve=useRef<((value:T|null)=>void)|null>(null);
 const [busy,setBusy]=useState(false),[status,setStatus]=useState('Ready. First run downloads Python.'),[output,setOutput]=useState('');
 const stop=()=>{worker.current?.terminate();worker.current=null;if(timer.current)clearTimeout(timer.current);timer.current=null;resolve.current?.(null);resolve.current=null;};
 useEffect(()=>()=>stop(),[]);
 const cancel=()=>{stop();setBusy(false);setOutput('');setStatus('Canceled. No result retained.');};
 const reset=()=>{if(resolve.current)stop();setBusy(false);setOutput('');setStatus('Inputs changed. Run Python again.');};
 const run=(source:string,numpy=false):Promise<T|null>=>{if(resolve.current)stop();setOutput('');setBusy(true);setStatus('Loading Python and executing your current inputs…');return new Promise(done=>{
  resolve.current=done;const w=worker.current||new Worker(`${import.meta.env.BASE_URL}python-program-worker.js`);worker.current=w;
  const finish=(message:string,result:T|null,stdout='')=>{if(worker.current!==w)return;const complete=resolve.current;resolve.current=null;if(timer.current)clearTimeout(timer.current);timer.current=null;setBusy(false);setStatus(message);setOutput(stdout);if(result===null){w.terminate();worker.current=null;}complete?.(result);};
  w.onmessage=({data})=>finish(data.error||'Executed Python.',data.error?null:data.result,data.output||'');
  w.onerror=()=>finish('Python runtime could not load. Check your connection and retry.',null);
  timer.current=setTimeout(()=>finish('Python stopped after 90 seconds. Retry when downloads are available.',null),90000);
  w.postMessage({source,numpy});
 });};
 return {busy,status,output,run,cancel,reset};
}
