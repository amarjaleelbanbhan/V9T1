import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { CanvasTexture, Quaternion, Vector3 } from 'three';
import type { NeuronTrace } from '../engine/neuron';
import { formatNumber } from '../engine/neuron';

type Point=[number,number,number];
const Y=[1.48,0,-1.48];

/** Native Three.js sprite labels: no DOM portals, so 2D/3D switching is safe. */
function Label({text,position,width=1.4}:{text:string;position:Point;width?:number}) {
  const texture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;
    const context=canvas.getContext('2d');
    if(context){
      context.clearRect(0,0,512,128);
      context.font='bold 46px system-ui, sans-serif';
      context.textAlign='center';context.textBaseline='middle';
      context.fillStyle='#E8FFF0';context.shadowColor='#001A14';context.shadowBlur=10;
      context.fillText(text,256,64,495);
    }
    return new CanvasTexture(canvas);
  },[text]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <sprite position={position} scale={[width,width/4,1]}>
    <spriteMaterial map={texture} transparent depthTest={false}/>
  </sprite>;
}
function Wire({a,b,color,dim=false}:{a:Point;b:Point;color:string;dim?:boolean}) {
  const start=new Vector3(...a),end=new Vector3(...b);
  const direction=end.clone().sub(start);
  const midpoint=start.clone().add(end).multiplyScalar(.5);
  const q=useMemo(()=>new Quaternion().setFromUnitVectors(new Vector3(0,1,0),new Vector3(...b).sub(new Vector3(...a)).normalize()),[a[0],a[1],a[2],b[0],b[1],b[2]]);
  return <mesh position={midpoint} quaternion={q}>
    <cylinderGeometry args={[dim ? .012 : .023,dim ? .012 : .023,direction.length(),9]}/>
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={dim?.06:.7} transparent opacity={dim?.3:.9}/>
  </mesh>;
}
function Ball({position,label,color,radius=.34}:{position:Point;label:string;color:string;radius?:number}) {
  return <group position={position}>
    <mesh><sphereGeometry args={[radius,32,24]}/><meshStandardMaterial color={color} metalness={.26} roughness={.25} emissive={color} emissiveIntensity={.18}/></mesh>
    <Label text={label} position={[0,0,radius+.03]} width={radius*2.15}/>
  </group>;
}
function Content({inputs,weights,trace,step}:{inputs:number[];weights:number[];trace:NeuronTrace;step:number}){
  const green='#638BFF',mint='#61D5A5',dim='#305E55';
  return <>
    <ambientLight intensity={1.6}/><pointLight position={[2,3,5]} intensity={48} color="#77dcae"/>
    <pointLight position={[-4,-3,3]} intensity={18} color="#A78BFA"/>
    {Y.map((y,i)=>{
      const color=weights[i]<0?'#F9B77E':mint;
      return <group key={i}>
        <Wire a={[-3.35,y,0]} b={[-.98,0,0]} color={step>=1?color:dim} dim={step<1}/>
        <Ball position={[-3.7,y,0]} label={formatNumber(inputs[i])} color={green}/>
        <Label position={[-2.3,y+.37,.2]} width={2} text={step>=1?`${formatNumber(inputs[i])} × ${formatNumber(weights[i])} = ${formatNumber(trace.contributions[i])}`:`w${i+1}: ${formatNumber(weights[i])}`}/>
      </group>;
    })}
    <Ball position={[-.6,0,0]} radius={.55} label="Σ" color="#A78BFA"/>
    <Label position={[-.6,-.9,0]} width={1.9} text={step>=2?`Σ = ${formatNumber(trace.weightedSum)}`:'Weighted sum'}/>
    <Wire a={[-.05,0,0]} b={[1.6,0,0]} color={step>=3?mint:dim} dim={step<3}/>
    <Ball position={[1.95,0,0]} label="f(z)" color="#37D6C4" radius={.43}/>
    <Label position={[1.95,-.83,0]} width={1.9} text={step>=3?`z = ${formatNumber(trace.preActivation)}`:'Activation'}/>
    <Wire a={[2.4,0,0]} b={[3.3,0,0]} color={step>=5?mint:dim} dim={step<5}/>
    <Ball position={[3.65,0,0]} label={step>=5?formatNumber(trace.output):'?'} color="#638BFF"/>
    <OrbitControls enablePan={false} minDistance={7} maxDistance={18} maxPolarAngle={Math.PI*.8}/>
  </>;
}
export function NeuronScene(props:{inputs:number[];weights:number[];trace:NeuronTrace;step:number}) {
  return <div className="three-wrap" aria-label="Interactive 3D neuron with weights, sum, activation and output">
    <Canvas camera={{position:[0,0,11.5],fov:44}} dpr={[1,1.5]} gl={{antialias:true}}>
      <color attach="background" args={['#092328']}/>
      <Content {...props}/>
    </Canvas>
  </div>;
}

