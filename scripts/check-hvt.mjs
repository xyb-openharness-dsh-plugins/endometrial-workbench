#!/usr/bin/env node
/**
 * HVT 交互路径一致性 X1–X4（15-HVT-REVIEW §X；基准=docs/INTERACTION-DESIGN.md v1）。
 *
 * X1 页面覆盖：13 场景 landing ∪ 页内 data-page/data-sub 目标 = 10 线 30 页签（孤儿=0）。
 * X2 路径走通：从看板逐 chip → 落地页渲染非空 → 页内 data-step 逐站导航 → 回看板一步；两档案各一遍。
 * X3 编辑入口 ≤1/页：每 (view,sub) 里同时出现的显式编辑动作 ≤1；表单 ≤6 字段。
 * X4 AI 候选闭环：ai-draft → postMessage endo:agent-draft → 候选卡三步（确认/修改/拒收）→ 拒收后候选消失；
 *    10 条一级线都有 AI 协助；解析候选 accept/reject 闭环。
 *
 * 用法：node scripts/check-hvt.mjs；退出码 0/1。依赖本机 Chrome。
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome, stopChrome, sleep } from './cdp.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CDP_PORT = Number(process.env.ENDO_HVT_CDP_PORT || 9360);
const URL_APP = `file://${join(ROOT, 'prototypes', 'v0.2', 'index.html')}`;
const SOURCE = readFileSync(join(ROOT, 'prototypes/v0.2/app.js'), 'utf8');

const SCENES = [...SOURCE.matchAll(/\['(S\d\d)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'/g)]
  .map((m) => ({ id: m[1], landing: `${m[3]}/${m[4]}` }));

const ALL_SUBS = [
  ['stage', 'bleed'], ['stage', 'exam'], ['stage', 'path'], ['stage', 'figo'], ['stage', 'molecular'], ['stage', 'compare'],
  ['treatment', 'pathway'], ['treatment', 'surgery'], ['treatment', 'rt'], ['treatment', 'systemic'],
  ['fertility', 'decision'], ['fertility', 'progestin'], ['fertility', 'conceive'],
  ['lynch', 'testing'], ['lynch', 'family'], ['lynch', 'comm'],
  ['intimate', 'symptoms'], ['intimate', 'dilator'], ['intimate', 'comm'],
  ['followup', 'calendar'], ['followup', 'imaging'], ['followup', 'comorb'], ['followup', 'nutrition'],
  ['mind', 'feelings'], ['mind', 'body'], ['mind', 'fertility'],
  ['docs', 'library'], ['docs', 'candidates'], ['docs', 'prepare'], ['docs', 'trials']
];

const covered = new Set(SCENES.map((s) => s.landing));
for (const m of SOURCE.matchAll(/data-page="([a-z]+)"\s+data-sub="([a-z]+)"/g)) covered.add(`${m[1]}/${m[2]}`);
const orphans = ALL_SUBS.map(([p, s]) => `${p}/${s}`).filter((k) => !covered.has(k));
const out = { X1: { total: ALL_SUBS.length, covered: covered.size, orphans: orphans.length, orphanList: orphans }, X2: { walked: 0, failures: [] }, X3: { views: 0, over: [], maxFields: 0 }, X4: { pages: 0, failures: [], postMessage: null, aiSteps: '', parseCand: '—' } };

const ch = await launchChrome({ port: CDP_PORT, userDataPrefix: '.xyb-endo-hvt-' });
const { cdp } = ch;
try {
  await cdp.send('Page.navigate', { url: URL_APP });
  await sleep(500);
  for (let i = 0; i < 40 && !(await cdp.eval("document.body && document.body.getAttribute('data-booted') === '1'")); i += 1) await sleep(120);

  /* 捕获 postMessage 类型 */
  await cdp.eval("window.__endoMsgs = []; window.addEventListener('message', (e) => { if (e.data && typeof e.data.type === 'string') window.__endoMsgs.push(e.data.type); });");
  out.X3.maxFields = await cdp.eval('Math.max(...Object.values(FORM_IDS).map((a) => a.length))');

  async function goto(page, sub) {
    await cdp.eval(`location.hash = ${JSON.stringify('#' + page + (sub ? '/' + sub : ''))}`);
    await sleep(70);
  }

  /* X1 运行时覆盖：13 场景 landing ∪ 每个页面渲染出的 data-page/data-sub（含「下一页」与页内跳转）。 */
  {
    const seen = new Set(SCENES.map((s) => s.landing));
    const byPage = {};
    for (const [p, s] of ALL_SUBS) (byPage[p] = byPage[p] || []).push(s);
    const allPages = ['dash', 'stage', 'treatment', 'fertility', 'lynch', 'intimate', 'followup', 'chart', 'mind', 'docs'];
    for (const page of allPages) {
      for (const sub of (byPage[page] || [''])) {
        await goto(page, sub);
        const links = JSON.parse(await cdp.eval(`JSON.stringify([...document.querySelectorAll('#main [data-page][data-sub]')].map((b) => b.dataset.page + '/' + b.dataset.sub))`) || '[]');
        links.forEach((k) => seen.add(k));
      }
    }
    out.X1.covered = seen.size;
    out.X1.orphanList = ALL_SUBS.map(([p, s]) => `${p}/${s}`).filter((k) => !seen.has(k));
    out.X1.orphans = out.X1.orphanList.length;
  }

  /* X2：两档案，13 场景逐站 */
  for (const pid of ['demo1', 'demo2']) {
    await cdp.eval(`state.profileId = ${JSON.stringify(pid)}; state.page = 'dash'; render();`);
    await goto('dash', '');
    for (const s of SCENES) {
      const r = await cdp.eval(`(() => {
        const chip = document.querySelector('.scene-chip[data-scene="${s.id}"]');
        if (!chip) return JSON.stringify({ ok: false, why: 'chip 不存在' });
        chip.click();
        return JSON.stringify({ ok: true, page: state.page, sub: state.sub[state.page] || '', len: document.getElementById('main').innerHTML.length });
      })()`);
      const d = JSON.parse(r);
      out.X2.walked += 1;
      if (!d.ok) { out.X2.failures.push(`${pid} ${s.id}: ${d.why}`); continue; }
      const [lp, ls] = s.landing.split('/');
      if (d.page !== lp || (ls && d.sub !== ls)) out.X2.failures.push(`${pid} ${s.id}: 落点 ${d.page}/${d.sub} ≠ ${lp}/${ls}`);
      if (!d.len || d.len < 800) out.X2.failures.push(`${pid} ${s.id}: 落地页内容过短 ${d.len}`);
      for (let guard = 0; guard < 12; guard += 1) {
        const step = await cdp.eval(`(() => {
          const b = document.querySelector('#main [data-step]');
          if (!b) return null;
          const k = b.getAttribute('data-step');
          b.click();
          return k;
        })()`);
        if (!step) break;
        await sleep(50);
      }
      const back = await cdp.eval(`(() => {
        const b = document.querySelector('.back-row [data-action="go"][data-page="dash"]');
        if (b) { b.click(); return state.page === 'dash'; }
        return state.page === 'dash';
      })()`);
      if (!back) out.X2.failures.push(`${pid} ${s.id}: 回看板失败`);
      await goto('dash', '');
    }
  }

  /* X3：每页显式编辑入口 ≤1（页面头部 primary / *-add / data-step 编辑） */
  await cdp.eval("state.profileId = 'demo1';");
  const views = [['dash', ''], ['chart', ''], ...ALL_SUBS];
  for (const [page, sub] of views) {
    await goto(page, sub || '');
    const n = await cdp.eval(`(() => {
      const head = document.querySelector('#main .page-head .actions');
      if (!head) return 0;
      const set = new Set();
      head.querySelectorAll('button.primary').forEach((b) => set.add(b.dataset.action));
      head.querySelectorAll('button[data-action$="-add"]').forEach((b) => set.add(b.dataset.action));
      return set.size;
    })()`);
    out.X3.views += 1;
    if (n > 1) out.X3.over.push(`${page}/${sub || 'main'}: 显式编辑入口 ${n} 个`);
  }

  /* X4a：解析候选闭环 */
  await goto('docs', 'candidates');
  const cand0 = await cdp.eval(`(() => { const b = document.querySelector('#main [data-action="cand-accept"]'); if (!b) return null; b.click(); return b.getAttribute('data-id'); })()`);
  await sleep(45);
  const cand1 = await cdp.eval(`(() => { const b = document.querySelector('#main [data-action="cand-reject2"]'); if (!b) return null; b.click(); return b.getAttribute('data-id'); })()`);
  await sleep(45);
  const states = JSON.parse(await cdp.eval(`JSON.stringify(DEMO_DATA.profiles.find(p => p.id === 'demo1').docs.candidates.map(c => c.state))`));
  if (!cand0 || !cand1 || !states.includes('已入库') || !states.includes('已拒收')) out.X4.parseCand = '闭环失败 ' + JSON.stringify(states); else out.X4.parseCand = 'ok';

  /* X4b：AI 协助 + 候选三步 */
  await goto('dash', '');
  const aiSteps = [];
  aiSteps.push((await cdp.eval(`(() => { const b = document.querySelector('#main [data-action="ai-draft"]'); if (!b) return false; b.click(); return true; })()`)) ? 1 : 0);
  await sleep(80);
  out.X4.postMessage = await cdp.eval(`(window.__endoMsgs || []).find((x) => x.includes('agent-draft')) || null`);
  aiSteps.push((await cdp.eval("!!document.querySelector('.agent-cand') && !!document.querySelector('.agent-cand [data-action=\"cand-ok\"]')")) ? 1 : 0);
  aiSteps.push((await cdp.eval(`(() => { const b = document.querySelector('.agent-cand [data-action="cand-reject"]'); if (!b) return false; b.click(); return true; })()`)) ? 1 : 0);
  await sleep(60);
  aiSteps.push((await cdp.eval("!document.querySelector('.agent-cand')")) ? 1 : 0);
  out.X4.aiSteps = aiSteps.join('');
  if (out.X4.aiSteps !== '1111') out.X4.failures.push(`AI 候选闭环步序 ${out.X4.aiSteps} ≠ 1111`);
  if (out.X4.postMessage !== 'endo:agent-draft') out.X4.failures.push(`postMessage 类型 ${out.X4.postMessage} ≠ endo:agent-draft`);

  /* X4c：10 条一级线都有 AI 协助按钮 */
  await cdp.eval("document.getElementById('agent-toggle').click();");
  await sleep(40);
  for (const page of ['dash', 'stage', 'treatment', 'fertility', 'lynch', 'intimate', 'followup', 'chart', 'mind', 'docs']) {
    await goto(page, '');
    const has = await cdp.eval("!!document.querySelector('#main [data-action=\"ai-draft\"]')");
    if (has) out.X4.pages += 1; else out.X4.failures.push(`${page}: 缺 AI 协助`);
  }
} catch (error) {
  out.fatal = String(error?.stack ?? error);
} finally {
  await stopChrome(ch);
}

const ok = !out.fatal && out.X1.orphans === 0
  && out.X2.failures.length === 0 && out.X2.walked === 26
  && out.X3.over.length === 0 && out.X3.views === 32 && out.X3.maxFields <= 6
  && out.X4.pages === 10 && out.X4.failures.length === 0 && out.X4.parseCand === 'ok'
  && out.X4.aiSteps === '1111' && out.X4.postMessage === 'endo:agent-draft'
  && cdp.errors.length === 0;
console.log(JSON.stringify({
  ok,
  X1: out.X1,
  X2: { walked: out.X2.walked, expected: 26, failures: out.X2.failures },
  X3: { views: out.X3.views, maxFormFields: out.X3.maxFields, over: out.X3.over },
  X4: { pages: out.X4.pages, aiSteps: out.X4.aiSteps, postMessage: out.X4.postMessage, parseCandidate: out.X4.parseCand, failures: out.X4.failures },
  consoleErrors: cdp.errors,
  fatal: out.fatal ?? null
}, null, 2));
process.exit(ok ? 0 : 1);
