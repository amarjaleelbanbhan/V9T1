import{test,expect}from'@playwright/test';
test('perceptron AND/OR truth table and live bias updates',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await page.getByRole('button',{name:/Perceptron & Logic Gates/}).click();
 await expect(page.getByRole('heading',{name:/One neuron, a decision/})).toBeVisible();
 await expect(page.getByTestId('perceptron-output')).toHaveText('0');
 await expect(page.getByTestId('perceptron-matches')).toHaveText('4 / 4');
 await page.getByRole('button',{name:'OR gate'}).click();
 await expect(page.getByTestId('perceptron-output')).toHaveText('1');
 await expect(page.getByTestId('perceptron-matches')).toHaveText('4 / 4');
 const slider=page.getByRole('slider',{name:/Bias b/});await slider.focus();await slider.press('End');
 await expect(page.getByTestId('perceptron-matches')).toHaveText('3 / 4');
 await page.getByRole('button',{name:'No',exact:true}).click();
 await expect(page.getByRole('status').filter({hasText:'Correct'})).toContainText('Correct');
 await page.getByRole('button',{name:'Reset'}).click();
 await expect(page.getByTestId('perceptron-matches')).toHaveText('4 / 4');
 expect(errors).toEqual([]);
});
test('perceptron truth table remains usable on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await page.getByRole('button',{name:'Toggle lesson navigation'}).click();
 await page.getByRole('button',{name:/Perceptron & Logic Gates/}).click();
 await expect(page.getByRole('heading',{name:/One neuron, a decision/})).toBeVisible();
 await expect(page.getByRole('slider',{name:/Weight w1/})).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow).toBeLessThanOrEqual(1);
});

