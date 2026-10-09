import trainingSource from './training.py?raw';
import type {TrainingConfig} from '../engine/trainingProject';
export function trainingPython(config:TrainingConfig){return `import json\n${trainingSource}\nconfig = json.loads(${JSON.stringify(JSON.stringify(config))})\nresult = train(config)\nprint("Best validation epoch:", result["bestEpoch"])\nprint("Restored model:", result["best"])`;}
export function evaluationPython(points:{x:number;y:number}[],model:{w:number;b:number}){return `import json\npoints = json.loads(${JSON.stringify(JSON.stringify(points))})\nmodel = json.loads(${JSON.stringify(JSON.stringify(model))})\nresult = sum(0.5*(model["w"]*p["x"]+model["b"]-p["y"])**2 for p in points)/len(points)\nprint(result)`;}
