import {test,expect} from '@playwright/test';
import {installPyodideMirror} from './fixtures/pyodide';
import fs from 'node:fs';
const lessons=JSON.parse(fs.readFileSync('src/course/training.json','utf8')).filter((l:any)=>l.chapter==='CH-06');

test('all chapter 06 choices explain the selected option after real Python execution',async({page})=>{
 test.setTimeout(240_000);
 await installPyodideMirror(page.context());
 await page.goto('/');
 await page.getByRole('button',{name:'Start beginner course',exact:true}).click();
 for(const lesson of lessons){
  await page.getByRole('navigation',{name:'Beginner topics'}).getByRole('button',{name:lesson.title,exact:true}).click();
  await page.getByRole('spinbutton',{name:'Your prediction',exact:true}).fill(String(lesson.cases[0].expected));
  await page.getByRole('button',{name:'Reveal calculation',exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:'Executed Python. Inspect'})).toBeVisible({timeout:95_000});
  await page.getByRole('button',{name:'Reveal all operations',exact:true}).click();
  for(const index of [1-lesson.correct,lesson.correct]){
   await page.getByRole('button',{name:lesson.choices[index],exact:true}).click();
   await page.getByRole('button',{name:'Check practice',exact:true}).click();
   const status=page.getByRole('status').filter({hasText:lesson.choiceReasons[index]});
   await expect(status).toBeVisible();
   await expect(status).toContainText(index===lesson.correct?'Practice passed.':'Try again.');
  }
 }
});

test('chapter 06 authored hints and diagnostic packs appear against executed Python traces',async({page})=>{
 test.setTimeout(180_000);
 await installPyodideMirror(page.context());
 await page.goto('/');
 await page.getByRole('button',{name:'Start beginner course',exact:true}).click();
 for(const [id,guess,phrase] of [['dl-06-002','6','sum of dy/du and du/dx'],['dl-06-007','2','factor multiplied by the path depth']]){
  const lesson=lessons.find((l:any)=>l.id===id);
  await page.getByRole('navigation',{name:'Beginner topics'}).getByRole('button',{name:lesson.title,exact:true}).click();
  await page.getByRole('button',{name:/Show hint 1/}).click();
  await expect(page.locator('.hint-step')).toHaveCount(1);
  await page.getByRole('button',{name:/Show hint 2/}).click();
  await expect(page.locator('.hint-step').nth(1)).toContainText(id==='dl-06-002'?'chain rule':'shared factor');
  await page.getByRole('spinbutton',{name:'Your prediction',exact:true}).fill(guess);
  await page.getByRole('button',{name:'Reveal calculation',exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:'Executed Python. Inspect'})).toBeVisible({timeout:95_000});
  await page.getByRole('button',{name:'Reveal all operations',exact:true}).click();
  await expect(page.getByTestId('diagnostic')).toContainText(phrase);
  await expect(page.getByTestId('diagnostic')).toContainText('One possible explanation');
 }
});
