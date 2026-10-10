import type {Calculation,Stage} from '../course/types';
function halfRound(x:number){if(x===0)return x;const sign=Math.sign(x),v=Math.abs(x);if(v>65504)throw Error('Value exceeds finite float16 range.');const exp=Math.floor(Math.log2(v));const unit=2**Math.max(-24,exp-10);const q=v/unit;const low=Math.floor(q),fraction=q-low;const rounded=fraction>.5?low+1:fraction<.5?low:low%2===0?low:low+1;return sign*rounded*unit;}
const sum=(v:number[])=>v.reduce((a,b)=>a+b,0);const mean=(v:number[])=>sum(v)/v.length;
export function calculate(model:string,p:readonly number[]):Calculation{
 if(!p.length||p.some(v=>!Number.isFinite(v)||Math.abs(v)>1e6))throw Error('Use finite inputs within ±1,000,000.');
 const [a,b,c,d]=p;let result:number;const stages:Stage[]=[];let cells:number[][]|undefined;let curve:[number,number][]|undefined;
 const step=(label:string,value:number|string)=>stages.push({label,value});
 switch(model){
 case 'program':step('Read x',a);step('Multiply by factor',a*b);result=a*b+c;step('Add offset',result);break;
 case 'positive-sum':for(const v of p)step(v>0?'Include positive item':'Skip nonpositive item',v);result=sum(p.filter(v=>v>0));break;
 case 'memory':if(![a,b].every(v=>Number.isInteger(v)&&v>0&&v<=64)||![1,2,4,8].includes(c))throw Error('Use dimensions 1–64 and 1, 2, 4 or 8 bytes per element.');step('Elements',a*b);step('Bytes per element',c);result=a*b*c;step('Payload bytes; overhead excluded',result);cells=Array.from({length:Math.min(8,a)},()=>Array.from({length:Math.min(8,b)},()=>c));break;
 case 'clean':step('Raw rows',`${a}, missing, ${b}, ${b}`);step('Drop missing and exact duplicate',`${a}, ${b}`);result=a===b?a:(a+b)/2;step('Mean of cleaned rows',result);break;
 case 'line':step('Slope × input',a*b);step('Intercept',c);result=a*b+c;curve=Array.from({length:21},(_,i)=>{const x=i/2-5;return [x,b*x+c];});break;
 case 'mean':step('Sum',sum([...p]));step('Count',p.length);result=mean([...p]);break;
 case 'variance':{const m=mean([...p]);step('Mean',m);const sq=p.map(v=>(v-m)**2);sq.forEach((v,i)=>step(`Squared deviation ${i+1}`,v));result=mean(sq);break;}
 case 'probability':if(b<=0||a<0||a>b)throw Error('Successes must be between zero and a positive total.');step('Successful outcomes',a);step('Equally likely outcomes',b);result=a/b;break;
 case 'dot':step('First paired product',a*b);step('Second paired product',c*d);result=a*b+c*d;cells=[[a,c],[b,d]];break;
 case 'chain':step('u = scale × x',a*b);step('dy/du = 2u',2*a*b);step('du/dx',b);result=2*a*b*b;curve=Array.from({length:21},(_,i)=>[i/4,(b*i/4)**2]);break;
 case 'fit-line':if(a===b)throw Error('Distinct input coordinates are needed.');step('Target difference',d-c);step('Input difference',b-a);result=(d-c)/(b-a);step('Learned slope',result);break;
 case 'groups':step('Inputs',p.join(', '));step('Two groups separated at zero',p.map(v=>v<0?'negative':'nonnegative').join(', '));result=new Set(p.map(v=>v<0?'negative':'nonnegative')).size;break;
 case 'split':if(p.some(v=>v<0||!Number.isInteger(v)))throw Error('Split sizes are nonnegative integer counts.');step('Training: fit parameters',a);step('Validation: choose settings',b);step('Test: final evaluation',c);result=a+b+c;cells=[[a,b,c]];break;
 case 'leakage':step('Training-only mean',(a+b)/2);step('Wrong mean including test',(a+b+c)/3);result=c-(a+b)/2;step('Test transformed with training mean',result);break;
 case 'threshold':step('Score',a);step('Threshold',b);result=Number(a>=b);step('Predicted class',result);break;
 case 'f1':if(p.some(v=>v<0)||2*a+b+c===0)throw Error('Nonnegative counts with nonzero F1 denominator required.');step('TP',a);step('FP',b);step('FN',c);step('Precision',a+b?a/(a+b):'undefined');step('Recall',a+c?a/(a+c):'undefined');result=2*a/(2*a+b+c);cells=[[a,b],[c,0]];break;
 case 'gap':step('Training loss',a);step('Validation loss',b);result=b-a;step('Generalization gap on these samples',result);break;
 case 'history':step('1958', 'Perceptron: a trainable linear threshold unit');step('1986','Backpropagation popularized for multilayer networks');step('2012','AlexNet demonstrated large-scale vision success');result=a;break;

 case 'perceptron':{const inputs=[[0,0],[0,1],[1,0],[1,1]],targets=[0,1,1,0];const outputs=inputs.map(([x,y])=>Number(a*x+b*y+c>=0));cells=inputs.map((v,i)=>[...v,outputs[i],targets[i]]);outputs.forEach((v,i)=>step(`(${inputs[i]}) → predicted / XOR`,`${v} / ${targets[i]}`));result=outputs.filter((v,i)=>v===targets[i]).length;break;}
 case 'dense':step('Input 1 contribution',a*b);step('Input 2 contribution',c*d);step('Bias',p[4]);result=a*b+c*d+p[4];break;
 case 'activations':if(b<0||b>1)throw Error('Use a negative slope between zero and one.');step('Sigmoid',a>=0?1/(1+Math.exp(-a)):Math.exp(a)/(1+Math.exp(a)));step('Tanh',Math.tanh(a));step('ReLU',Math.max(0,a));result=a>=0?a:b*a;step('Leaky ReLU',result);break;
 case 'softmax':{const m=Math.max(a,b),e1=Math.exp(a-m),e2=Math.exp(b-m);step('Subtract maximum from both logits',`${a-m}, ${b-m}`);step('Exponentials',`${e1}, ${e2}`);step('Normalizer',e1+e2);result=e1/(e1+e2);cells=[[result,1-result]];break;}
 case 'he':if(a<=0)throw Error('Fan-in must be positive.');step('Fan-in',a);step('He variance',2/a);result=Math.sqrt(2/a);break;
 case 'broadcast':cells=[[a+c,b+c],[a+d,b+d]];step('Matrix shape','(2, 2)');step('Column shape','(2, 1), expands across columns');cells.forEach((r,i)=>step(`Output row ${i}`,r.join(', ')));result=b+d;break;
 case 'slice':{const v=[10,20,30,40];if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||b>4||a>b)throw Error('Use integer slice bounds 0 ≤ start ≤ stop ≤ 4.');const chosen=v.slice(a,b);step('Original',v.join(', '));step('Selected; stop excluded',chosen.join(', ')||'empty');result=sum(chosen);cells=[chosen];break;}
 case 'view':{if(!Number.isInteger(a)||a<0||a>2)throw Error('Use an index from 0 to 2.');const original=[1,2,3];const alias=original;alias[a]=b;step('Before','1, 2, 3');step('Write through alias',`index ${a} = ${b}`);step('Original after write',original.join(', '));cells=[original];result=sum(original);break;}
 case 'precision':if(![16,32,64].includes(b))throw Error('Choose 16, 32 or 64 bits.');step('Requested number',a);step('Format bits',b);result=b===16?halfRound(a):b===32?Math.fround(a):a;step('Rounded represented number',result);step('Rounding error',result-a);break;
 case 'device':if(![a,b].every(v=>v===0||v===1))throw Error('Use zero for CPU or one for GPU.');step('CPU tensor device',a===0?'CPU':'GPU');step('Other tensor device',b===0?'CPU':'GPU');result=Number(a===b);step('Operation allowed without device transfer',result);break;
 case 'autograd':step('u = x × x',a*a);step('dy/du',b);step('du/dx',2*a);result=2*a*b;step('Gradient paths add; y = scale × x²',result);break;
 case 'dense-shape':if(p.some(v=>v<1||!Number.isInteger(v)||v>64))throw Error('Use integer dimensions from 1 to 64.');step('X shape',`(${a}, ${b})`);step('W shape',`(${b}, ${c})`);step('Y shape',`(${a}, ${c})`);result=a*c;cells=Array.from({length:Math.min(a,8)},()=>Array(Math.min(c,8)).fill(0));break;
 case 'matmul':{const A=[[a,b],[c,d]],B=[[1,2],[3,4]];cells=A.map(r=>B[0].map((_,j)=>sum(r.map((v,k)=>v*B[k][j]))));step('First row dot first column',cells[0][0]);step('First row dot second column',cells[0][1]);step('Second row dot first column',cells[1][0]);result=cells[1][1];break;}
 case 'compose':{const hidden=Math.max(0,a*b+c);step('Hidden preactivation',a*b+c);step('Hidden ReLU',hidden);result=hidden*d+p[4];step('Output affine transformation',result);break;}
 case 'dropout':if(b<0||b>=1||![0,1].includes(c))throw Error('Drop probability must be [0,1), mask zero or one.');step('Input activation',a);step('Keep probability',1-b);step('Fixed teaching mask',c);result=a*c/(1-b);step('Training output; inference returns input',result);break;

 case 'mse':{const errors=[...p];step('Signed errors',errors.join(', '));step('MAE',mean(errors.map(Math.abs)));step('Squared errors',errors.map(x=>x*x).join(', '));result=mean(errors.map(x=>x*x));break;}
 case 'bce':if(a<=0||a>=1||![0,1].includes(b))throw Error('Use probability strictly between zero and one and binary label.');step('Positive probability',a);step('Target label',b);step('Target-class probability',b?a:1-a);result=-(b*Math.log(a)+(1-b)*Math.log1p(-a));break;
 case 'logit-loss':if(![0,1].includes(b))throw Error('Use a binary label zero or one.');step('max(logit, 0)',Math.max(a,0));step('logit × target',a*b);step('Stable correction log(1 + exp(-abs(logit)))',Math.log1p(Math.exp(-Math.abs(a))));result=Math.max(a,0)-a*b+Math.log1p(Math.exp(-Math.abs(a)));break;
 case 'gd':if(b<0||b>2)throw Error('Use a learning rate from zero to two.');step('Loss before: w²',a*a);step('Derivative: 2w',2*a);step('Learning rate',b);result=a-b*2*a;step('Loss after',result*result);break;
 case 'optimizers':{const [w,g,lr,beta,v]=p;if(lr<0||beta<0||beta>=1)throw Error('Use nonnegative rate and momentum coefficient in [0,1).');const velocity=beta*v+g;step('SGD next weight',w-lr*g);step('Momentum velocity: beta × old + gradient',velocity);step('First-step Adam corrected m',g);step('First-step Adam corrected v',g*g);step('First-step Adam next weight',w-lr*g/(Math.abs(g)+1e-8));result=w-lr*velocity;break;}
 case 'schedule':if(a<0||b<0||b>1||c<0||!Number.isInteger(c))throw Error('Use nonnegative initial rate, decay in [0,1], integer epoch.');step('Initial rate',a);step('Decay factor',b);step('Epoch',c);result=a*b**c;break;
 case 'batches':if(p.some(v=>!Number.isInteger(v)||v<1||v>10000))throw Error('Use positive counts at most 10000.');step('Examples',a);step('Batch size',b);step('Updates per epoch; retain partial batch',Math.ceil(a/b));step('Epochs',c);result=Math.ceil(a/b)*c;cells=[Array.from({length:Math.min(16,Math.ceil(a/b))},(_,i)=>Math.min(b,a-i*b))];break;
 case 'derivative':step('y = x²',a*a);result=2*a;step('dy/dx',result);break;
 case 'hidden-delta':case 'weight-gradient':{const [x,w1,b1,w2,b2,y]=p;const z=x*w1+b1,h=Math.max(0,z),pred=h*w2+b2,delta=pred-y,dh=delta*w2*(z>0?1:0);step('Hidden preactivation',z);step('Hidden ReLU',h);step('Prediction',pred);step('Output delta for half squared error',delta);step('Hidden delta',dh);result=model==='hidden-delta'?dh:dh*x;step('First weight gradient = hidden delta × input',dh*x);break;}
 case 'finite-difference':if(b<=0||b>1)throw Error('Use a positive step size at most one.');step('f(x + h)',(a+b)**2);step('f(x - h)',(a-b)**2);step('2h',2*b);result=((a+b)**2-(a-b)**2)/(2*b);step('Analytical derivative',2*a);break;
 case 'depth':if(!Number.isInteger(b)||b<1||b>20||Math.abs(a)>5)throw Error('Use factor magnitude at most five and depth 1–20.');{let g=1;for(let i=0;i<b;i++){g*=a;step(`Gradient after factor ${i+1}`,g);}result=g;break;}
 case 'weight-decay':if(b<0||b>1||c<0)throw Error('Use rate [0,1] and nonnegative decay.');step('Weight',a);step('Penalty gradient λw',c*a);step('Data gradient',d);result=a-b*(d+c*a);step('Next weight with L2 gradient',result);break;
 case 'batchnorm':{if(d<0)throw Error('Epsilon must be nonnegative.');const m=(a+b)/2,v=((a-m)**2+(b-m)**2)/2;if(v+d===0)throw Error('Variance plus epsilon must be positive.');step('Batch mean',m);step('Biased batch variance',v);step('First normalized value',(a-m)/Math.sqrt(v+d));step('Gamma',c);result=c*(a-m)/Math.sqrt(v+d);step('Beta is zero in this case',result);break;}
 case 'early-stop':{let best=Infinity,index=-1;for(let i=0;i<p.length;i++){if(p[i]<best){best=p[i];index=i;}step(`Epoch ${i+1} validation loss`,p[i]);}result=index+1;step('Best epoch to restore',result);break;}
 case 'checkpoint':step('Saved weight',a);step('Current changed weight',b);step('Input used for restored prediction',c);result=a*c;step('Prediction using restored weight',result);break;
 default:throw Error('Unknown calculation model: '+model);
 }
 if(!Number.isFinite(result))throw Error('Calculation overflow.');step('Result',result);return {result,stages,cells,curve};
}
export function closeAnswer(guess:number,result:number){return Number.isFinite(guess)&&Math.abs(guess-result)<=1e-5*Math.max(1,Math.abs(result));}
