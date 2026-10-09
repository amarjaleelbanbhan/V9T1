import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';
import type { NeuronTrace } from '../engine/neuron';
import { formatNumber } from '../engine/neuron';

const Y = [1.48, 0, -1.48];
type Point=[number,number,number];
function Wire({a,b,color,dim=false}:{a:Point;b:Point;color:string;dim?:boolean}){
  const start=new Vector3(...a),end=new Vector3(...b);
  const direction=end.clone().sub(start);
  const midpoint=start.clone().add(end).multiplyScalar(.5);
  const realQuaternion=useMemo(()=>new Quaternion().setFromUnitVectors(new Vector3(0,1,0), direction.clone().normalize()),[a[0],a[1],a[2],b[0],b[1],b[2]]);
  return <mesh position={midpoint} quaternion={realQuaternion}>
    <cylinderGeometry args={[dim ? .012 : .023,dim ? .012 : .023,direction.length(),9]}/>
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={dim?.06:.7} transparent opacity={dim?.3:.9}/>
  </mesh>;
}
function Ball({position,label,color,radius=.34}:{position:Point;label:string;color:string;radius?:number}){
  return <group position={position}>
    <mesh><sphereGeometry args={[radius,32,24]}/><meshStandardMaterial color={color} metalness={.26} roughness={.25} emissive={color} emissiveIntensity={.18}/></mesh>
    <Html center distanceFactor={10} style={{pointerEvents:'none',userSelect:'none',fontSize:14,fontWeight:750,color:'#eafff6',textShadow:'0 2px 8px #001b18',whiteSpace:'nowrap'}}>{label}</Html>
  </group>;
}
function SceneContent({inputs,weights,trace,step}:{inputs:number[];weights:number[];trace:NeuronTrace;step:number}){
  const green='#8BBB92',mint='#61D5A5',dim='#305E55';
  const source:[number,number,number]=[-.6,0,0];
  return <>
    <ambientLight intensity={1.6}/><pointLight position={[2,3,5]} intensity={48} color="#77dcae"/>
    <pointLight position={[-4,-3,3]} intensity={18} color="#2A835F"/>
    {Y.map((y,i)=>{const color=weights[i]<0?'#F9B77E':mint;const a:Point=[-3.7,y,0];return <group key={i}>
      <Wire a={[-3.35,y,0]} b={[-.98,0,0]} color={step>=1?color:dim} dim={step<1}/>
      <Ball position={a} label={formatNumber(inputs[i])} color={green}/>
      <Html position={[-2.3,y+.35,0]} center distanceFactor={10} style={{pointerEvents:'none',color:step>=1?'#c7f4d5':'#77988d',fontSize:12,whiteSpace:'nowrap'}}>{step>=1?`${formatNumber(weights[i])} × ${formatNumber(inputs[i])} = ${formatNumber(trace.contributions[i])}`:`w${i+1}: ${formatNumber(weights[i])}`}</Html>
    </group>})}
    <Ball position={source} radius={.55} label="Σ" color="#2A835F"/>
    <Html position={[-.6,-.86,0]} center distanceFactor={10} style={{pointerEvents:'none',color:'#d9f9e9',fontSize:13,whiteSpace:'nowrap'}}>{step>=2?`Σ = ${formatNumber(trace.weightedSum)}`:'Weighted sum'}</Html>
    <Wire a={[-.05,0,0]} b={[1.6,0,0]} color={step>=3?mint:dim} dim={step<3}/>
    <Ball position={[1.95,0,0]} label="f(z)" color="#12544F" radius={.43}/>
    <Html position={[1.95,-.83,0]} center distanceFactor={10} style={{pointerEvents:'none',color:'#d9f9e9',fontSize:13,whiteSpace:'nowrap'}}>{step>=3?`z = ${formatNumber(trace.preActivation)}`:'Activation'}</Html>
    <Wire a={[2.4,0,0]} b={[3.3,0,0]} color={step>=5?mint:dim} dim={step<5}/>
    <Ball position={[3.65,0,0]} label={step>=5?formatNumber(trace.output):'?'} color="#8BBB92"/>
    <OrbitControls enablePan={false} minDistance={7} maxDistance={18} maxPolarAngle={Math.PI*.8}/>
  </>;
}
export function NeuronScene(props:{inputs:number[];weights:number[];trace:NeuronTrace;step:number}){
  return <div className="three-wrap" aria-label="Interactive 3D neuron with weights, sum, activation and output">
    <Canvas camera={{position:[0,0,11.5],fov:44}} dpr={[1,1.5]} gl={{antialias:true}}>
      <color attach="background" args={['#092328']}/>
      <SceneContent {...props}/>
    </Canvas>
  </div>;
}
