import {test,expect} from '@playwright/test';
import {installPyodideMirror} from './fixtures/pyodide';
test('real Python shows ordered assignment, fixed product and transfer-based completion',async({page})=>{
 test.setTimeout(120_000);await installPyodideMirror(page.context());await page.goto('/');await page.getByRole('button',{name:/Python Variables & Data Flow/}).click();
 await expect(page.getByTestId('variable-x')).toHaveText('Not assigned');await expect(page.getByRole('button',{name:'Run my prediction'})).toBeDisabled();
 await page.getByRole('spinbutton',{name:'Predict the stored product'}).fill('6');await page.getByRole('button',{name:'Run my prediction'}).click();
 await expect(page.getByRole('status').filter({hasText:'Executed Python.'})).toBeVisible({timeout:95_000});
 await page.getByRole('button',{name:'Next instruction'}).click();await expect(page.getByTestId('variable-x')).toHaveText('2');await expect(page.getByTestId('variable-product')).toHaveText('Not assigned');
 await page.getByRole('button',{name:'Next instruction'}).click();await page.getByRole('button',{name:'Next instruction'}).click();await expect(page.getByTestId('variable-product')).toHaveText('6');await expect(page.getByTestId('variable-x')).toHaveText('2');
 await page.getByRole('button',{name:'Next instruction'}).click();await expect(page.getByTestId('variable-product')).toHaveText('6');await expect(page.getByTestId('variable-x')).toHaveText('3');
 await page.getByRole('button',{name:'Next instruction'}).click();await page.getByRole('button',{name:'Next instruction'}).click();
 await page.getByRole('button',{name:'It recalculates whenever x changes'}).click();await expect(page.getByRole('status').filter({hasText:'Try again.'})).toBeVisible();
 await page.getByRole('button',{name:'Assignment stored the earlier result'}).click();await expect(page.getByRole('region',{name:'Practice evidence'})).toContainText('Negative input prediction: still needed');
 await page.getByRole('spinbutton',{name:'Starting x'}).fill('-2');await page.getByRole('spinbutton',{name:'Multiplication factor'}).fill('4');await expect(page.getByTestId('variable-product')).toHaveText('Not assigned');
 await page.getByRole('spinbutton',{name:'Predict the stored product'}).fill('-8');await page.getByRole('button',{name:'Run my prediction'}).click();await expect(page.getByRole('status').filter({hasText:'Executed Python.'})).toBeVisible({timeout:95_000});
 for(let i=0;i<6;i++)await page.getByRole('button',{name:'Next instruction'}).click();await expect(page.getByTestId('variable-product')).toHaveText('-8');await expect(page.getByTestId('variable-x')).toHaveText('-1');
 await page.getByRole('button',{name:'Assignment stored the earlier result'}).click();await expect(page.getByRole('region',{name:'Practice evidence'})).toContainText('Practice criteria met for this lesson');
});
test('wrong prediction is explained and does not pass evidence',async({page})=>{
 test.setTimeout(110_000);await installPyodideMirror(page.context());await page.goto('/');await page.getByRole('button',{name:/Python Variables & Data Flow/}).click();await page.getByRole('spinbutton',{name:'Predict the stored product'}).fill('7');await page.getByRole('button',{name:'Run my prediction'}).click();await expect(page.getByRole('status').filter({hasText:'Executed Python.'})).toBeVisible({timeout:95_000});await expect(page.getByRole('status').filter({hasText:'Compare your prediction'})).toContainText('Stored product: 6');await expect(page.getByRole('region',{name:'Practice evidence'})).toContainText('Positive input prediction: still needed');
});
test('invalid inputs, cancellation, keyboard and mobile layout',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.getByRole('button',{name:'Toggle lesson navigation'}).click();await page.getByRole('button',{name:/Python Variables & Data Flow/}).click();
 await page.getByRole('spinbutton',{name:'Starting x'}).fill('1000001');await page.getByRole('spinbutton',{name:'Predict the stored product'}).fill('0');await page.getByRole('button',{name:'Run my prediction'}).click();await expect(page.getByRole('status').filter({hasText:'Enter two finite numbers'})).toBeVisible();
 await page.getByRole('spinbutton',{name:'Starting x'}).fill('2');await page.getByRole('spinbutton',{name:'Predict the stored product'}).fill('6');
 let release!:()=>void;const held=new Promise<void>(resolve=>{release=resolve;});
 await page.context().route('https://cdn.jsdelivr.net/pyodide/**',async route=>{await held;await route.abort();});await page.getByRole('button',{name:'Run my prediction'}).focus();await page.keyboard.press('Enter');await page.getByRole('button',{name:'Cancel execution'}).click();release();await expect(page.getByRole('status').filter({hasText:'Canceled.'})).toBeVisible();await expect(page.getByTestId('variable-product')).toHaveText('Not assigned');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('worker rejects unknown example before fetching Python',async({page})=>{await page.goto('/');const result=await page.evaluate(()=>new Promise(resolve=>{const w=new Worker('/python-worker.js');w.onmessage=e=>{resolve(e.data);w.terminate();};w.postMessage({example:'arbitrary-code',values:[1,2]});}));expect(result).toEqual({error:'Error: Unknown example'});});
