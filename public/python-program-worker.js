/* Browser worker isolation only; not a server security sandbox. */
let runtime;
self.onmessage=async({data})=>{
 try{
  if(typeof data.source!=='string'||data.source.length>60000)throw Error('Invalid lesson program.');
  if(!runtime){importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');runtime=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});}
  if(data.numpy)await runtime.loadPackage('numpy');
  if(data.editable&&data.source.length>20000)throw Error('Editable source is limited to 20,000 characters.');
  runtime.globals.set('editable_program',!!data.editable);
  self.postMessage({ready:true});
  runtime.globals.set('lesson_source',data.source);
  const encoded=await runtime.runPythonAsync(`
import io, json, contextlib, ast
if editable_program:
    tree = ast.parse(lesson_source)
    forbidden = {'exec', 'eval', 'compile', 'open', '__import__', 'globals', 'locals', 'getattr', 'setattr', 'delattr', 'input', 'breakpoint'}
    for node in ast.walk(tree):
        if isinstance(node, ast.Import) and any(alias.name not in {'math', 'numpy'} for alias in node.names):
            raise ValueError('Only math and numpy imports are supported.')
        if isinstance(node, ast.ImportFrom) and node.module not in {'math', 'numpy'}:
            raise ValueError('Only math and numpy imports are supported.')
        if isinstance(node, ast.Name) and (node.id in forbidden or node.id.startswith('__')):
            raise ValueError('This operation is not supported in the learning editor.')
        if isinstance(node, ast.Attribute) and node.attr.startswith('__'):
            raise ValueError('Private attribute access is not supported.')
class BoundedOutput(io.StringIO):
    def write(self, text):
        if self.tell() + len(text) > 20000:
            raise ValueError('Output exceeded the 20,000 character limit.')
        return super().write(text)
namespace = {}
output = BoundedOutput()
with contextlib.redirect_stdout(output):
    exec(compile(lesson_source, '<lesson>', 'exec'), namespace)
encoded = json.dumps({'output': output.getvalue(), 'result': namespace.get('result')}, allow_nan=False)
if len(encoded) > 1000000:
    raise ValueError('Result exceeded the 1 MB limit.')
encoded
`);
  self.postMessage(JSON.parse(encoded));
 }catch(error){self.postMessage({error:String(error)});}
};
