import { test, expect } from '@playwright/test';

test('live neuron computation, controls, and 2D diagram', async ({page})=>{
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/Inside a Neuron/})).toBeVisible();
  const output=page.getByTestId('output');
  await expect(output).toHaveText('0.957');
  await page.getByRole('combobox',{name:'Activation function'}).selectOption('relu');
  await expect(output).toHaveText('3.1');
  const slider=page.getByRole('slider',{name:/Input x1/});
  await slider.focus();await slider.press('ArrowRight');
  await expect(output).toHaveText('3.18');
  await page.getByRole('button',{name:'2D'}).click();
  await expect(page.getByRole('img',{name:/Neuron computation graph/})).toBeVisible();
  await page.getByRole('button',{name:'Go to Multiply weights'}).click();
  await expect(page.getByRole('heading',{name:'Multiply weights'})).toBeVisible();
  await page.getByRole('tab',{name:'Code'}).click();
  await expect(page.getByText('Executable JavaScript equivalent')).toBeVisible();
  await page.getByRole('tab',{name:'Challenge'}).click();
  await page.getByRole('button',{name:'Output increases'}).click();
  await page.getByRole('button',{name:'Test prediction'}).click();
  await expect(page.getByRole('status')).toContainText('Correct');
  await expect(output).toHaveText('4.23');
  await page.getByRole('button',{name:'Reset parameters'}).click();
  await expect(output).toHaveText('0.957');
  expect(errors).toEqual([]);
});
test('small viewport supports lessons and controls without horizontal overflow', async ({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/Inside a Neuron/})).toBeVisible();
  await page.getByRole('button',{name:'Toggle lesson navigation'}).click();
  await expect(page.getByRole('navigation',{name:'Course lessons'})).toBeVisible();
  await page.getByRole('button',{name:'Toggle lesson navigation'}).click();
  await expect(page.getByRole('slider',{name:/Weight w1/})).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('prediction challenge respects negative input and ReLU zero region',async({page})=>{
 await page.goto('/');
 const input=page.getByRole('slider',{name:/Input x1/});
 await input.focus();await input.press('Home');
 await page.getByRole('tab',{name:'Challenge'}).click();
 await page.getByRole('button',{name:'Output decreases'}).click();
 await page.getByRole('button',{name:'Test prediction'}).click();
 await expect(page.getByRole('status')).toContainText('Correct');
 await page.getByRole('button',{name:'Reset parameters'}).click();
 await page.getByRole('combobox',{name:'Activation function'}).selectOption('relu');
 await input.focus();await input.press('Home');
 await page.getByRole('tab',{name:'Challenge'}).click();
 await page.getByRole('button',{name:'Output unchanged'}).click();
 await page.getByRole('button',{name:'Test prediction'}).click();
 await expect(page.getByRole('status')).toContainText('Correct');
});
