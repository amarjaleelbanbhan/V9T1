/* Executes two fixed trusted examples. Worker isolation is not a general Python sandbox. */
self.onmessage=async ({data})=>{
 try {
  const values=data.values;
  const example=data.example??'array';
  const bounded=n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=1e6;
  if(example==='array'){
   if(!Array.isArray(values)||values.length!==2||values.some(row=>!Array.isArray(row)||row.length!==3||row.some(n=>!bounded(n))))throw Error('Invalid matrix');
  }else if(example==='variables'){
   if(!Array.isArray(values)||values.length!==2||values.some(n=>!bounded(n)))throw Error('Invalid scalar inputs');
  }else if(['loops','functions','objects'].includes(example)){
   if(!Array.isArray(values)||values.length!==3||values.some(n=>!bounded(n)))throw Error('Invalid sequence');
  }else throw Error('Unknown example');
  const programs={
   loops:[`numbers = ${JSON.stringify(values)}`,'total = 0','for value in numbers:','    if value > 0:','        total = total + value','print(total)'].join('\n'),
   functions:[`numbers = ${JSON.stringify(values)}`,'def double(value):','    result = value * 2','    return result','outputs = []','for value in numbers:','    outputs.append(double(value))','total = sum(outputs)','print(total)'].join('\n'),
   objects:['class Counter:','    def __init__(self):','        self.total = 0','    def add(self, value):','        self.total = self.total + value',`numbers = ${JSON.stringify(values)}`,'counter = Counter()','for value in numbers:','    counter.add(value)','total = counter.total','print(total)'].join('\n')
  };
  const source=programs[example] || (example==='array'
   ? 'import numpy as np\nx = np.array(values, dtype=np.float32)\nprint(x.shape)\nprint(x.dtype)\nprint(x.nbytes)'
   : [`x = ${JSON.stringify(values[0])}`,`factor = ${JSON.stringify(values[1])}`,'product = x * factor','x = x + 1','print(product)','print(x)'].join('\n'));
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
  const py=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});
  if(example==='array')await py.loadPackage('numpy');
  py.globals.set('values_json',JSON.stringify(values));
  py.globals.set('trusted_source',source);
  const result=await py.runPythonAsync(`
import json, sys, io
values = json.loads(values_json)
source = trusted_source
frames = []
namespace = {'values': values}
output = io.StringIO()
def tensor_snapshot():
    x = namespace.get('x')
    return None if not hasattr(x, 'shape') else {'shape': list(x.shape), 'rank': x.ndim, 'dtype': str(x.dtype), 'values': x.tolist(), 'payload_bytes': x.nbytes}
def scalar_snapshot():
    return {name: {'value': value, 'type': type(value).__name__} for name, value in namespace.items() if name in ('x', 'factor', 'product') and type(value) in (int, float)}
def safe_values(scope):
    result = {}
    for name, value in scope.items():
        if name.startswith('_') or name == 'values':
            continue
        if type(value) in (int, float):
            result[name] = value
        elif type(value) is list and all(type(v) in (int, float) for v in value):
            result[name] = list(value)
        elif name in ('self', 'counter') and hasattr(value, 'total'):
            result[name] = {'total': value.total}
    return result
def capture(line, phase, frame=None):
    frames.append({'line': line, 'phase': phase, 'tensor': tensor_snapshot(), 'variables': scalar_snapshot(), 'stdout': output.getvalue(), 'scope': frame.f_code.co_name if frame else '<module>', 'globals': safe_values(namespace), 'locals': safe_values(frame.f_locals) if frame else safe_values(namespace)})
def trace(frame, event, arg):
    if frame.f_code.co_filename == '<neurallab>' and event == 'line':
        capture(frame.f_lineno, 'before-line', frame)
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
capture(len(source.splitlines()), 'complete')
json.dumps({'version': 1, 'mode': 'executed-python', 'source': source, 'frames': frames})
`);
  self.postMessage({trace:JSON.parse(result)});
 }catch(error){self.postMessage({error:String(error)});}
};
