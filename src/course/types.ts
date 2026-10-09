export interface Case {name:string;values:number[];expected:number}
export interface Lesson {
 id:string;chapter:string;title:string;terms:[string,string][];explanation:string;why:string;formula:string;model:string;labels:string[];cases:[Case,Case];target:string;question:string;choices:string[];correct:number;reason:string;mistake:string;debug:string;project:string;source:string;lab?:string;
}
export interface Stage {label:string;value:number|string}
export interface Calculation {result:number;stages:Stage[];cells?:number[][];curve?:[number,number][]}
