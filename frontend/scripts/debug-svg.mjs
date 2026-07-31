import { readFile } from "fs/promises";
const svg = await readFile("public/debug.svg", "utf8");
// Find percentage heights that resvg might not handle
const pctHeights = [...svg.matchAll(/height="(\d+)%"|height:"(\d+)%"/g)];
console.log("Percentage heights:", pctHeights.map(m => m[0]));
const allAttrs = [...svg.matchAll(/(width|height)="([^"]+)"/g)];
const nonNum = allAttrs.filter(m => isNaN(m[2]) && !m[2].includes("px"));
console.log("Non-numeric attrs (sample):", nonNum.slice(0, 15).map(m => `${m[1]}="${m[2]}"`));
