import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
const root=resolve(new URL("..",import.meta.url).pathname);
const output=resolve(root,"dist");
const routes=["/dental-cleaning-cost/","/deep-teeth-cleaning-cost/","/dental-filling-cost/","/root-canal-cost/","/dental-crown-cost/","/dental-implant-cost-calculator/","/all-on-4-dental-implants-cost/","/full-mouth-dental-implants-cost/","/braces-cost/","/invisalign-cost-calculator/","/dental-bridge-cost/","/dentures-cost/","/dental-veneers-cost/","/tooth-extraction-cost/","/wisdom-teeth-removal-cost/"];
for(const route of routes){
 const html=await readFile(resolve(output,route.slice(1),"index.html"),"utf8");
 for(const token of ["calculator-landing","procedure-calculator-first",'id="quote-calculator"',"calculator-principles","sources-disclosure","procedure-cta-band",'href="#quote-calculator"',"Written by","Last updated"]){
   if(!html.includes(token))throw new Error(`${route}: calculator landing token missing: ${token}`);
 }
 const h1=html.indexOf("<h1");
 const calc=html.indexOf("procedure-calculator-first");
 const education=Math.min(...[html.indexOf('class="article-body'),html.indexOf('class="article-body calculator-education')].filter(x=>x>=0));
 if(!(h1>=0&&calc>h1&&(education===Infinity||calc<education)))throw new Error(`${route}: calculator must appear before education content`);
 if(/Evidence checked|Research and written by/.test(html))throw new Error(`${route}: legacy metadata wording reached built HTML`);
}
const cleaning=await readFile(resolve(output,"dental-cleaning-cost/index.html"),"utf8");
for(const token of ["Main benchmark used on this page","The price guide above shows the main published references used on this page.","Sources and update notes"]){
 if(!cleaning.includes(token))throw new Error(`cleaning page: redesign token missing: ${token}`);
}
console.log(`Calculator landing-page gate passed: ${routes.length} calculator routes.`);
