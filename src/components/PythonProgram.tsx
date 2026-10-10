import {useEffect,useState} from 'react';
import {usePythonProgram} from '../python/usePythonProgram';
export function PythonProgram({source,numpy=false}:{source:string;numpy?:boolean}){
 const {run,busy,status,output,reset,cancel}=usePythonProgram<unknown>();const [result,setResult]=useState<unknown>(null);
 useEffect(()=>{reset();setResult(null);},[source]);
 return <section aria-label="Executable Python"><p>Executable Python · current inputs</p><pre className="python-code" tabIndex={0} role="region" aria-label="Python source"><code>{source}</code></pre><div className="python-actions"><button disabled={busy} onClick={async()=>{setResult(null);setResult(await run(source,numpy));}}>Run Python example</button><button disabled={!busy} onClick={()=>{cancel();setResult(null);}}>Cancel Python example</button></div><p role="status">{status}</p>{result!==null&&<pre className="python-code" tabIndex={0} role="region" aria-label="Python output" data-testid="python-program-output">{output||JSON.stringify(result,null,2)}</pre>}</section>;
}
