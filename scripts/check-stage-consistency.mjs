#!/usr/bin/env node
/**
 * 分期/分子数据一致性断言（评审 P0-1 要求，M5 并入 check 链）：
 *  ① stage.versions[].anatomical 与 finalLabel 的期别标签必须同源（不出现 IB/IA2 混写）
 *  ② marker 含 POLEmut 且 I–II 期时，finalLabel 必须以 IAmPOLEmut 开头
 *  ③ 档案含 ≥2 个分子特征（如 POLEmut + MMRd）时，multiple 不得写「不是多重分类」
 * 用法：node scripts/check-stage-consistency.mjs [demo-data.js 路径]
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const file = process.argv[2] || join(root, 'prototypes/v0.2/demo-data.js');
const src = readFileSync(file, 'utf8');
const m = src.match(/(?:window\.DEMO_DATA|const DEMO_DATA) = ([\s\S]*?);\s*(?:if \(typeof module|$)/);
if (!m) { console.error('✗ 找不到 DEMO_DATA'); process.exit(1); }
const DATA = JSON.parse(m[1]);
const errors = [];

for (const p of DATA.profiles || []) {
  const st = p.stage || {};
  for (const v of st.versions || []) {
    const a = String(v.anatomical || ''), f = String(v.finalLabel || '');
    const roman = (t) => (t.match(/\b(IV|III|II|I)(A2?|B|C|C2?)?\b/) || [])[0];
    const ra = roman(a), rf = roman(f);
    if (ra && rf && ra.replace(/期$/, '') !== rf.replace(/期$/, '')) {
      errors.push(`${p.id}: anatomical「${ra}」与 finalLabel「${rf}」期别不同源（${v.d}）`);
    }
  }
  const marker = String((st.versions || []).find((v) => v.current)?.marker || '');
  const finalLabel = String((st.versions || []).find((v) => v.current)?.finalLabel || '');
  if (/POLE/i.test(marker) && /IA2?\b|IB\b|II/.test(finalLabel) && !/^IAmPOLEmut/.test(finalLabel) && /POLE.{0,6}(超突变|mut|检出)/i.test(marker)) {
    errors.push(`${p.id}: POLEmut 在 I–II 期时 finalLabel 必须以 IAmPOLEmut 开头（实际「${finalLabel}」）`);
  }
  const feats = [ /POLE.{0,6}(超突变|mut|检出)/i.test(marker), /PMS2|MMR|pMMR|dMMR/i.test(marker) ? /PMS2|MMR.?d/i.test(marker) : false ].filter(Boolean).length;
  const multiple = String(p.molecular?.multiple || '');
  if (feats >= 2 && /不是多重分类/.test(multiple)) {
    errors.push(`${p.id}: 含 ≥2 分子特征却写「不是多重分类」`);
  }
  // ⑤ 档案级展示字段不得残留旧期别（变异 D：只改 diagnosisShort 曾可逃逸）
  const current = (st.versions || []).find((v) => v.current) || {};
  const curRoman = (String(current.finalLabel || '').match(/\b(IV|III|II|I)(A2?|B|C|C2?)?\b/) || [])[0];
  for (const [field, val] of [['diagnosis', p.diagnosis], ['diagnosisShort', p.diagnosisShort], ['stageLine', p.stageLine]]) {
    const v = String(val || '');
    const r = (v.match(/FIGO\s*(IV|III|II|I)(A2?|B|C|C2?)?/) || [])[1];
    if (r && curRoman && !curRoman.startsWith(r) && !(r === 'I' && curRoman.startsWith('I'))) {
      errors.push(`${p.id}: ${field} 期别「${r}」与当前 finalLabel「${curRoman}」不一致`);
    }
    if (/FIGO\s*IB/.test(v)) errors.push(`${p.id}: ${field} 残留旧期别 FIGO IB`);
  }
  // ④ 单一特征档案不得出现「POLEmut 与 MMRd 并列」类文案
  const singleContext = /pMMR|p53\s*野生/i.test(marker) && /POLE.{0,8}未检测/i.test(marker);
  if (singleContext && /POLEmut\s*与\s*MMRd/.test(multiple)) {
    errors.push(`${p.id}: 单一特征档案却写「POLEmut 与 MMRd 并列」`);
  }
}


if (errors.length) { console.error('✗ 分期一致性断言失败：'); errors.forEach((e) => console.error('  - ' + e)); process.exit(1); }
console.log('✓ 分期一致性断言通过（anatomical/finalLabel 同源、POLEmut 标签、多重分类如实）');
