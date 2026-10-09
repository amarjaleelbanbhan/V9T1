/* Fixed trusted NumPy program only. A Worker is not an arbitrary-code security sandbox. */
self.onmessage=async ({data})=>{
 try {
  const values=data.values;
  if(!Array.isArray(values)||values.length!==2||values.some(row=>!Array.isArray(row)||row.length!==3||row.some(n=>typeof n!=='number'||!Number.isFinite(n)||Math.abs(n)>1e6)))throw Error('Invalid matrix');
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
  const py=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});
  await py.loadPackage('numpy');
  py.globals.set('values_json',JSON.stringify(values));
  const result=await py.runPythonAsync(`
import json, sys, io
values = json.loads(values_json)
source = 'import numpy as np\\nx = np.array(values, dtype=np.float32)\\nprint(x.shape)\\nprint(x.dtype)\\nprint(x.nbytes)'
frames = []
namespace = {'values': values}
output = io.StringIO()
def snapshot():
    x = namespace.get('x')
    return None if x is None else {'shape': list(x.shape), 'rank': x.ndim, 'dtype': str(x.dtype), 'values': x.tolist(), 'payload_bytes': x.nbytes}
def trace(frame, event, arg):
    if frame.f_code.co_filename == '<neurallab>' and event == 'line':
        frames.append({'line': frame.f_lineno, 'phase': 'before-line', 'tensor': snapshot(), 'stdout': output.getvalue()})
    return trace
old_stdout = sys.stdout
old_trace = sys.gettrace()
try:
    sys.stdout = output
    sys.settrace(trace)
    exec(compile(source, '<neurallab>', 'exec'), namespace)
finally:
    sys.settrace(old_trace)
    sys.stdout = old_stdout
frames.append({'line': 5, 'phase': 'complete', 'tensor': snapshot(), 'stdout': output.getvalue()})
json.dumps({'version': 1, 'mode': 'executed-python', 'source': source, 'frames': frames})
`);
  self.postMessage({trace:JSON.parse(result)});
 }catch(error){self.postMessage({error:String(error)});}
};
