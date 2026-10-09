import type {Calculation,Stage} from '../course/types';
const sum=(v:number[])=>v.reduce((a,b)=>a+b,0);const mean=(v:number[])=>sum(v)/v.length;
export function calculate(model:string,p:readonly number[]):Calculation{
 if(!p.length||p.some(v=>!Number.isFinite(v)||Math.abs(v)>1e6))throw Error('Use finite inputs within ±1,000,000.');
 const [a,b,c,d]=p;let result:number;let stages:Stage[]=[];let cells:number[][]|undefined;let curve:[number,number][]|undefined;
 const step=(label:string,value:number|string)=>stages.push({label,value});
 switch(model){
 case 'program':step('Read x',a);step('Multiply by factor',a*b);result=a*b+c;step('Add offset',result);break;
 case 'positive-sum':for(const v of p)step(v>0?'Include positive item':'Skip nonpositive item',v);result=sum(p.filter(v=>v>0));break;
 case 'memory':step('Elements',a*b);step('Bytes per element',c);result=a*b*c;step('Payload bytes; overhead excluded',result);cells=Array.from({length:Math.min(8,a)},()=>Array.from({length:Math.min(8,b)},()=>c));break;
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
 default:throw Error('Unknown calculation model: '+model);
 }
 if(!Number.isFinite(result))throw Error('Calculation overflow.');step('Result',result);return {result,stages,cells,curve};
}
export function closeAnswer(guess:number,result:number){return Number.isFinite(guess)&&Math.abs(guess-result)<=1e-5*Math.max(1,Math.abs(result));}
