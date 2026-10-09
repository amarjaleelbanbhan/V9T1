/* Worker for authored Python lessons; not an arbitrary-code security sandbox. */
let runtime;
self.onmessage=async({data})=>{
 try{
  if(typeof data.source!=='string'||data.source.length>60000)throw Error('Invalid lesson program.');
  if(!runtime){importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');runtime=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});}
  if(data.numpy)await runtime.loadPackage('numpy');
  runtime.globals.set('lesson_source',data.source);
  const encoded=await runtime.runPythonAsync(`
import io, json, contextlib
namespace = {}
output = io.StringIO()
with contextlib.redirect_stdout(output):
    exec(compile(lesson_source, '<lesson>', 'exec'), namespace)
json.dumps({'output': output.getvalue(), 'result': namespace.get('result')}, allow_nan=False)
`);
  self.postMessage(JSON.parse(encoded));
 }catch(error){self.postMessage({error:String(error)});}
};
