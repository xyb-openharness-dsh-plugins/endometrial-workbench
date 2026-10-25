#!/usr/bin/env node
/**
 * README 精选截图（33 号）：1440 宽、浅色、真实渲染、演示数据、私密内容不入图。
 * 产出 docs/screenshots/readme-<feature>-0.2.0.png（≥4，含折叠卡收/展各一张）。
 * 用法：node scripts/shots-readme.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome, sleep, stopChrome } from './cdp.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs', 'screenshots');
mkdirSync(OUT, { recursive: true });
const VERSION = '0.2.0';
const URL_APP = `file://${join(ROOT, 'prototypes', 'v0.2', 'index.html')}`;
const CDP_PORT = Number(process.env.ENDO_SHOTS_CDP_PORT || 9370);

const ch = await launchChrome({ port: CDP_PORT, userDataPrefix: '.xyb-endo-shots-' });
const { cdp } = ch;
const shots = [];

async function goto(page, sub) {
  await cdp.eval(`location.hash = ${JSON.stringify('#' + page + (sub ? '/' + sub : ''))}`);
  await sleep(120);
  await cdp.eval('window.scrollTo(0,0)');
  await sleep(100);
}
async function shot(name) {
  const r = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(join(OUT, name), Buffer.from(r.data, 'base64'));
  shots.push(name);
}

try {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: URL_APP });
  await sleep(600);
  for (let i = 0; i < 50 && !(await cdp.eval("document.body.getAttribute('data-booted') === '1'")); i += 1) await sleep(120);

  await goto('dash', '');
  await shot(`readme-dashboard-${VERSION}.png`);

  await goto('stage', 'molecular');
  await shot(`readme-molecular-${VERSION}.png`);

  await goto('chart', '');
  await shot(`readme-one-chart-${VERSION}.png`);

  /* 治疗线折叠卡：收（默认 0 个 open） */
  await goto('treatment', 'pathway');
  const openCount = await cdp.eval("document.querySelectorAll('#main .phase-fold[open]').length");
  if (openCount !== 0) throw new Error(`折叠卡默认应为收起，实际 open=${openCount}`);
  await shot(`readme-treatment-fold-closed-${VERSION}.png`);

  /* 治疗线折叠卡：展（第一张展开，五块可见） */
  await cdp.eval("document.querySelector('#main .phase-fold summary').click()");
  await sleep(150);
  const blocks = await cdp.eval("document.querySelectorAll('#main .phase-fold[open] .phase-detail section.pd-block').length");
  if (blocks !== 5) throw new Error(`展开态五块应为 5，实际 ${blocks}`);
  await shot(`readme-treatment-fold-open-${VERSION}.png`);

  /* 关键红线页：两区导出 + private 过滤说明（不含私密数值） */
  await goto('docs', 'prepare');
  await shot(`readme-export-private-${VERSION}.png`);

  const bytes = await cdp.eval("document.documentElement.scrollWidth");
  console.log(JSON.stringify({ ok: true, version: VERSION, width: 1440, bytesScrollWidth: bytes, shots, count: shots.length }, null, 2));
} catch (error) {
  console.log(JSON.stringify({ ok: false, error: String(error?.stack ?? error) }, null, 2));
  process.exitCode = 1;
} finally {
  await stopChrome(ch);
}
