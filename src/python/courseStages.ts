import {coursePython} from './programs.ts';
const stages:Record<string,string>={
program:`step('Read x',a)\nstep('Multiply by factor',a*b)\nstep('Add offset',result)`,
'positive-sum':`for value in p:\n    step('Include positive item' if value>0 else 'Skip nonpositive item',value)`,
memory:`step('Elements',a*b)\nstep('Bytes per element',c)\nstep('Payload bytes; overhead excluded',result)\ncells=[[c]*min(8,int(b)) for _ in range(min(8,int(a)))]`,
clean:`step('Raw rows',f'{a}, missing, {b}, {b}')\nstep('Drop missing and exact duplicate',f'{a}, {b}')\nstep('Mean of cleaned rows',result)`,
line:`step('Slope × input',a*b)\nstep('Intercept',c)\ncurve=[[i/2-5,b*(i/2-5)+c] for i in range(21)]`,
mean:`step('Sum',sum(p))\nstep('Count',len(p))`,
variance:`average=sum(p)/len(p)\nstep('Mean',average)\nfor i,value in enumerate(p):\n    step(f'Squared deviation {i+1}',(value-average)**2)`,
probability:`step('Successful outcomes',a)\nstep('Equally likely outcomes',b)`,
dot:`step('First paired product',a*b)\nstep('Second paired product',c*d)\ncells=[[a,c],[b,d]]`,
chain:`step('u = scale × x',a*b)\nstep('dy/du = 2u',2*a*b)\nstep('du/dx',b)\ncurve=[[i/4,(b*i/4)**2] for i in range(21)]`,
'fit-line':`step('Target difference',d-c)\nstep('Input difference',b-a)\nstep('Learned slope',result)`,
groups:`step('Inputs',', '.join(map(str,p)))\nstep('Two groups separated at zero',', '.join('negative' if v<0 else 'nonnegative' for v in p))`,
split:`step('Training: fit parameters',a)\nstep('Validation: choose settings',b)\nstep('Test: final evaluation',c)\ncells=[[a,b,c]]`,
leakage:`step('Training-only mean',(a+b)/2)\nstep('Wrong mean including test',(a+b+c)/3)\nstep('Test transformed with training mean',result)`,
threshold:`step('Score',a)\nstep('Threshold',b)\nstep('Predicted class',result)`,
f1:`step('TP',a)\nstep('FP',b)\nstep('FN',c)\nstep('Precision',a/(a+b) if a+b else 'undefined')\nstep('Recall',a/(a+c) if a+c else 'undefined')\ncells=[[a,b],[c,0]]`,
gap:`step('Training loss',a)\nstep('Validation loss',b)\nstep('Generalization gap on these samples',result)`,
history:`step('1958','Perceptron: a trainable linear threshold unit')\nstep('1986','Backpropagation popularized for multilayer networks')\nstep('2012','AlexNet demonstrated large-scale vision success')`,
perceptron:`inputs=[(0,0),(0,1),(1,0),(1,1)]\ntargets=[0,1,1,0]\noutputs=[int(a*x+b*y+c>=0) for x,y in inputs]\ncells=[[x,y,output,target] for (x,y),output,target in zip(inputs,outputs,targets)]\nfor (x,y),output,target in zip(inputs,outputs,targets):\n    step(f'({x},{y}) → predicted / XOR',f'{output} / {target}')`,
dense:`step('Input 1 contribution',a*b)\nstep('Input 2 contribution',c*d)\nstep('Bias',p[4])`,
activations:`step('Sigmoid',1/(1+math.exp(-a)) if a>=0 else math.exp(a)/(1+math.exp(a)))\nstep('Tanh',math.tanh(a))\nstep('ReLU',max(0,a))\nstep('Leaky ReLU',result)`,
softmax:`maximum=max(a,b)\ne1,e2=math.exp(a-maximum),math.exp(b-maximum)\nstep('Subtract maximum from both logits',f'{a-maximum}, {b-maximum}')\nstep('Exponentials',f'{e1}, {e2}')\nstep('Normalizer',e1+e2)\ncells=[[result,1-result]]`,
he:`step('Fan-in',a)\nstep('He variance',2/a)`,
broadcast:`cells=[[a+c,b+c],[a+d,b+d]]\nstep('Matrix shape','(2, 2)')\nstep('Column shape','(2, 1), expands across columns')\nfor i,row in enumerate(cells):\n    step(f'Output row {i}',', '.join(map(str,row)))`,
slice:`selected=[10,20,30,40][int(a):int(b)]\nstep('Original','10, 20, 30, 40')\nstep('Selected; stop excluded',', '.join(map(str,selected)) or 'empty')\ncells=[selected]`,
view:`step('Before','1, 2, 3')\nstep('Write through alias',f'index {int(a)} = {b}')\nstep('Original after write',', '.join(map(str,original)))\ncells=[original]`,
precision:`step('Requested number',a)\nstep('Format bits',b)\nstep('Rounded represented number',result)\nstep('Rounding error',result-a)`,
device:`step('CPU tensor device','CPU' if a==0 else 'GPU')\nstep('Other tensor device','CPU' if b==0 else 'GPU')\nstep('Operation allowed without device transfer',result)`,
autograd:`step('u = x × x',a*a)\nstep('dy/du',b)\nstep('du/dx',2*a)\nstep('Gradient paths add; y = scale × x²',result)`,
'dense-shape':`step('X shape',f'({int(a)}, {int(b)})')\nstep('W shape',f'({int(b)}, {int(c)})')\nstep('Y shape',f'({int(a)}, {int(c)})')\ncells=[[0]*min(8,int(c)) for _ in range(min(8,int(a)))]`,
matmul:`cells=[[a+3*b,2*a+4*b],[c+3*d,2*c+4*d]]\nstep('First row dot first column',cells[0][0])\nstep('First row dot second column',cells[0][1])\nstep('Second row dot first column',cells[1][0])`,
compose:`step('Hidden preactivation',a*b+c)\nstep('Hidden ReLU',max(0,a*b+c))\nstep('Output affine transformation',result)`,
dropout:`step('Input activation',a)\nstep('Keep probability',1-b)\nstep('Fixed teaching mask',c)\nstep('Training output; inference returns input',result)`,
mse:`step('Signed errors',', '.join(map(str,p)))\nstep('MAE',sum(abs(v) for v in p)/len(p))\nstep('Squared errors',', '.join(str(v*v) for v in p))`,
bce:`step('Positive probability',a)\nstep('Target label',b)\nstep('Target-class probability',a if b else 1-a)`,
'logit-loss':`step('max(logit, 0)',max(a,0))\nstep('logit × target',a*b)\nstep('Stable correction log(1 + exp(-abs(logit)))',math.log1p(math.exp(-abs(a))))`,
gd:`step('Loss before: w²',a*a)\nstep('Derivative: 2w',2*a)\nstep('Learning rate',b)\nstep('Loss after',result*result)`,
optimizers:`w,g,lr,beta,velocity=p\nstep('SGD next weight',w-lr*g)\nstep('Momentum velocity: beta × old + gradient',beta*velocity+g)\nstep('First-step Adam corrected m',g)\nstep('First-step Adam corrected v',g*g)\nstep('First-step Adam next weight',w-lr*g/(abs(g)+1e-8))`,
schedule:`step('Initial rate',a)\nstep('Decay factor',b)\nstep('Epoch',c)`,
batches:`step('Examples',a)\nstep('Batch size',b)\nstep('Updates per epoch; retain partial batch',math.ceil(a/b))\nstep('Epochs',c)\ncells=[[min(b,a-i*b) for i in range(min(16,math.ceil(a/b)))]]`,
derivative:`step('y = x²',a*a)\nstep('dy/dx',result)`,
'finite-difference':`step('f(x + h)',(a+b)**2)\nstep('f(x - h)',(a-b)**2)\nstep('2h',2*b)\nstep('Analytical derivative',2*a)`,
depth:`gradient=1\nfor i in range(int(b)):\n    gradient *= a\n    step(f'Gradient after factor {i+1}',gradient)`,
'weight-decay':`step('Weight',a)\nstep('Penalty gradient λw',c*a)\nstep('Data gradient',d)\nstep('Next weight with L2 gradient',result)`,
batchnorm:`average=(a+b)/2\nvariance=((a-average)**2+(b-average)**2)/2\nstep('Batch mean',average)\nstep('Biased batch variance',variance)\nstep('First normalized value',(a-average)/math.sqrt(variance+d))\nstep('Gamma',c)\nstep('Beta is zero in this case',result)`,
'early-stop':`for i,value in enumerate(p):\n    step(f'Epoch {i+1} validation loss',value)\nstep('Best epoch to restore',result)`,
checkpoint:`step('Saved weight',a)\nstep('Current changed weight',b)\nstep('Input used for restored prediction',c)\nstep('Prediction using restored weight',result)`
};
for(const model of ['hidden-delta','weight-gradient'])stages[model]=`x,w1,b1,w2,b2,y=p\nz=x*w1+b1\nh=max(0,z)\nprediction=h*w2+b2\ndelta=prediction-y\nhidden_delta=delta*w2*int(z>0)\nstep('Hidden preactivation',z)\nstep('Hidden ReLU',h)\nstep('Prediction',prediction)\nstep('Output delta for half squared error',delta)\nstep('Hidden delta',hidden_delta)\nstep('First weight gradient = hidden delta × input',hidden_delta*x)`;
const guards:Record<string,string>={memory:'all(v==int(v) and 1<=v<=64 for v in p[:2]) and p[2] in (1,2,4,8)',probability:'p[1]>0 and 0<=p[0]<=p[1]','fit-line':'p[0]!=p[1]',split:'all(v>=0 and v==int(v) for v in p)',f1:'all(v>=0 for v in p) and 2*p[0]+p[1]+p[2]>0',activations:'0<=p[1]<=1',he:'p[0]>0',slice:'all(v==int(v) for v in p[:2]) and 0<=p[0]<=p[1]<=4',view:'p[0]==int(p[0]) and 0<=p[0]<=2',precision:'p[1] in (16,32,64) and (p[1]!=16 or abs(p[0])<=65504)',device:'all(v in (0,1) for v in p[:2])','dense-shape':'all(v==int(v) and 1<=v<=64 for v in p)',dropout:'0<=p[1]<1 and p[2] in (0,1)',bce:'0<p[0]<1 and p[1] in (0,1)','logit-loss':'p[1] in (0,1)',gd:'0<=p[1]<=2',optimizers:'p[2]>=0 and 0<=p[3]<1',schedule:'p[0]>=0 and 0<=p[1]<=1 and p[2]>=0 and p[2]==int(p[2])',batches:'all(v==int(v) and 1<=v<=10000 for v in p)','finite-difference':'0<p[1]<=1',depth:'abs(p[0])<=5 and p[1]==int(p[1]) and 1<=p[1]<=20','weight-decay':'0<=p[1]<=1 and p[2]>=0',batchnorm:'p[3]>=0 and ((p[0]-p[1])/2)**2+p[3]>0'};
export function courseCalculationPython(model:string,values:readonly number[]){
 if(!stages[model])throw Error('Missing Python stages: '+model);
 const program=coursePython(model,values);const split=program.indexOf('\n',program.indexOf('p = '));
 const checks=`\nif not p or not all(type(v) in (int,float) and math.isfinite(v) and abs(v)<=1000000 for v in p):\n    raise ValueError('Use finite inputs within ±1,000,000.')\nif not (${guards[model]||'True'}):\n    raise ValueError('Invalid inputs for ${model}; inspect the lesson bounds.')\n`;
 return program.slice(0,split)+checks+program.slice(split+1).replace('\nprint(result)','')+`\nstages = []\ncells = None\ncurve = None\na,b,c,d = (p+[0,0,0,0])[:4]\ndef step(label,value):\n    stages.append({"label":label,"value":value})\n${stages[model]}\nif not math.isfinite(result):\n    raise ValueError('Calculation overflow.')\nstep('Result',result)\nresult = {"result":result,"stages":stages,"cells":cells,"curve":curve}\nprint(result["result"])`;
}
