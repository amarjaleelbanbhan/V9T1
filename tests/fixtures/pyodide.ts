import type {BrowserContext} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
/** Optional genuine pinned asset mirror; does not replace or simulate Python execution. */
export async function installPyodideMirror(context:BrowserContext){
 const mirror=process.env.NEURALLAB_PYODIDE_ASSETS;
 if(!mirror)return;
 await context.route('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/**',async route=>{
  const filename=path.basename(new URL(route.request().url()).pathname);
  const body=await readFile(path.join(mirror,filename));
  await route.fulfill({status:200,body,contentType:filename.endsWith('.js')?'application/javascript':filename.endsWith('.wasm')?'application/wasm':filename.endsWith('.json')?'application/json':'application/octet-stream',headers:{'access-control-allow-origin':'*'}});
 });
}
