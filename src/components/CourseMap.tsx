import { ArrowUpRight } from 'lucide-react';
import { beginnerChapters, beginnerLessons } from '../course/catalog';
import { evidenceState, EVIDENCE_LABEL, type Progress } from '../course/progress';
import { recalledAfterIndependent, type LearningState } from '../course/learning';

export function CourseMap({progress,learning,onLesson}:{progress:Progress;learning:LearningState;onLesson:(id:string)=>void}){
  return <section className="course-atlas" aria-label="Chapter learning map"><div className="atlas-heading"><div><p className="eyebrow">YOUR FIELD GUIDE · 8 CHAPTERS</p><h2>From a variable to a learning network.</h2></div><span>60 topics · explore in any order</span></div>
    <p className="atlas-key"><span>○ New</span><span>◐ Attempted / with help</span><span>● Unaided / recalled later</span><small>Practice evidence, not a mastery score.</small></p>
    <div className="chapter-map">{beginnerChapters.map((chapter,index)=>{
      const lessons=beginnerLessons.filter(l=>l.chapter===chapter.id);
      const states=lessons.map(l=>evidenceState(progress[l.id],recalledAfterIndependent(learning,l.id,progress[l.id]?.independentAt)));
      const independent=states.filter(s=>s==='independent'||s==='retained').length;
      const assisted=states.filter(s=>s==='assisted').length;
      return <details key={chapter.id} open={index===0} className="chapter-station"><summary><span className="station-number">{String(index).padStart(2,'0')}</span><span className="station-title">{chapter.title}<small>{independent} unaided · {assisted} with help · {lessons.length} topics</small></span><span className="station-track" aria-hidden="true">{states.map((s,i)=><i key={i} className={'evidence-'+s}/>)}</span><span className="station-expand" aria-hidden="true">+</span></summary><div className="station-lessons">{lessons.map((lesson,i)=><button key={lesson.id} onClick={()=>onLesson(lesson.id)} aria-label={`Open ${lesson.title}`}><span className={'evidence-dot evidence-'+states[i]} aria-hidden="true"/><span>{lesson.title}<small>{EVIDENCE_LABEL[states[i]]}</small></span><ArrowUpRight size={16}/></button>)}</div></details>;
    })}</div>
  </section>;
}
