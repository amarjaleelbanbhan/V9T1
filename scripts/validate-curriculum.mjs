import fs from 'node:fs';
import assert from 'node:assert/strict';
const base='curriculum/deep-learning/';const c=JSON.parse(fs.readFileSync(base+'catalog.json','utf8'));
const all=[...c.chapters,...c.lessons,...c.sources,...c.assessments,...c.visualizations];const ids=new Set(all.map(x=>x.id));assert.equal(ids.size,all.length,'IDs must be unique');
for(const chapter of c.chapters){assert(fs.existsSync(base+chapter.slug+'/README.md'));for(const id of [...chapter.prerequisites,...chapter.source_refs,...chapter.lesson_ids])assert(ids.has(id),id);}
for(const lesson of c.lessons){assert(ids.has(lesson.chapter));if(lesson.document)assert(fs.existsSync(base+lesson.document));if(lesson.parent_id)assert(ids.has(lesson.parent_id));for(const id of [...lesson.prerequisites,...lesson.source_refs])assert(ids.has(id),id);}
for(const a of c.assessments){assert(ids.has(a.chapter_id));assert(ids.has(a.lesson_id));assert(a.prompt && a.solution);}
for(const v of c.visualizations){assert(ids.has(v.chapter_id));for(const id of v.lesson_ids)assert(ids.has(id));}
const visited=new Set();const pending=new Set();const nodes=new Map([...c.chapters,...c.lessons].map(n=>[n.id,n]));
function walk(id){if(visited.has(id))return;assert(!pending.has(id),'Prerequisite cycle: '+id);pending.add(id);for(const p of nodes.get(id).prerequisites)walk(p);pending.delete(id);visited.add(id);}
for(const id of nodes.keys())walk(id);
console.log(`Validated ${c.chapters.length} chapters, ${c.lessons.length} lessons, ${c.sources.length} sources; references and prerequisite graph valid.`);
