import { useEffect, useRef, useState } from 'react';
import catalog from '../../curriculum/deep-learning/catalog.json';
const documents = import.meta.glob('../../curriculum/deep-learning/*/README.md', { query: '?raw', import: 'default', eager: true }) as Record<string,string>;
export function CurriculumLibrary(){
 const [query,setQuery]=useState(''); const [level,setLevel]=useState('all');const [selected,setSelected]=useState<string|null>(null);
 const filtered=catalog.chapters.filter(c=>(level==='all'||String(c.level)===level)&&[c.title,c.definition,...catalog.lessons.filter(l=>l.chapter===c.id).map(l=>l.title)].join(' ').toLowerCase().includes(query.toLowerCase()));
 const detail=useRef<HTMLElement|null>(null);
 useEffect(()=>{if(selected)detail.current?.focus();},[selected]);
 const current=catalog.chapters.find(c=>c.id===selected);
 return <section aria-label="Deep learning research library"><p className="eyebrow">ZERO TO ADVANCED · RESEARCH LIBRARY</p><h1>Explore your learning path<span className="dot">.</span></h1><p className="subtitle">19 chapters tracked. Implemented topic lessons are in the beginner course. Specified lessons remain planned; the existing labs stay available.</p>
 <div className="curriculum-tools"><label>Search topics <input type="search" value={query} onChange={e=>{setQuery(e.target.value);setSelected(null);}} placeholder="Try tensors, attention, leakage"/></label><label>Level <select value={level} onChange={e=>{setLevel(e.target.value);setSelected(null);}}><option value="all">All levels</option>{Array.from({length:8},(_,i)=><option key={i} value={i}>Level {i}</option>)}</select></label></div>
 <p role="status">{filtered.length} chapters match</p><div className="curriculum-grid">{filtered.map(c=><article key={c.id} className="chapter-card"><span className="chapter-status">{c.id} · LEVEL {c.level} · {c.status.toUpperCase()}</span><h2>{c.title}</h2><p>{c.definition}</p><ul className="chapter-topics">{catalog.lessons.filter(l=>l.chapter===c.id).map(l=><li key={l.id}>{l.title}</li>)}</ul><button aria-expanded={selected===c.id} onClick={()=>setSelected(selected===c.id?null:c.id)}>Read {c.title} specification</button></article>)}</div>
 {current&&<article ref={detail} tabIndex={-1} className="chapter-detail" aria-label="Chapter specification"><h2>{current.title}</h2><p>Prerequisites: {current.prerequisites.join(', ')||'Start here'}</p><pre>{documents[`../../curriculum/deep-learning/${current.slug}/README.md`]}</pre><h3>Official sources</h3><ul>{current.source_refs.map(id=>{const source=catalog.sources.find(s=>s.id===id)!;return <li key={id}><a href={source.url} target="_blank" rel="noreferrer">{source.name}</a> — {source.reuse}</li>})}</ul></article>}
 </section>;
}
