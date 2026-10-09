import {test,expect} from '@playwright/test';
test('tensor lab rank, shape, sample slicing and answer respond to controls',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await page.getByRole('button',{name:/Tensors & Slicing/}).click();
 await expect(page.getByRole('heading',{name:/See the shape of data/})).toBeVisible();
 await expect(page.getByTestId('tensor-rank')).toHaveText('3');
 await expect(page.getByTestId('tensor-shape')).toHaveText('(2, 3, 3)');
 const sample=page.getByRole('slider',{name:/Sample index/});await sample.focus();await sample.press('End');
 await expect(page.getByTestId('tensor-slice-values')).toContainText('10,11,12');
 const stop=page.getByRole('slider',{name:/Row stop/});await stop.focus();await stop.press('Home');
 await expect(page.getByTestId('tensor-slice-shape')).toHaveText('(1, 3)');
 await page.getByRole('group',{name:'Choose tensor rank'}).getByRole('button',{name:'1D · Vector'}).click();
 await expect(page.getByTestId('tensor-rank')).toHaveText('1');
 await expect(page.getByTestId('tensor-shape')).toHaveText('(4,)');
 await page.getByRole('button',{name:'Rank 1',exact:true}).click();
 await expect(page.getByRole('status').filter({hasText:'Correct'})).toContainText('Correct');
 await page.getByRole('button',{name:/Forward Propagation/}).click();
 await expect(page.getByRole('heading',{name:/Follow every signal/})).toBeVisible();
 expect(errors).toEqual([]);
});
test('tensor laboratory fits 390px viewport',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await page.getByRole('button',{name:'Toggle lesson navigation'}).click();
 await page.getByRole('button',{name:/Tensors & Slicing/}).click();
 await expect(page.getByRole('heading',{name:/See the shape of data/})).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow).toBeLessThanOrEqual(1);
});

