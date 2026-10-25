/* UI parity：开发版与原型共用同一份渲染代码。
 * 逐字符比对会渲染区（一图秀 + 全部页面函数）与样式表；只允许五处定点替换（数据/AI 五态/宽度/版本/启动）。
 * 另外钉住三件"不得退化"：打印 beforeprint 块在 public、一图秀 .chart 与 computed fill、窄宽六条的存在。 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const proto = readFileSync(join(ROOT, 'prototypes/v0.2/app.js'), 'utf8');
const dev = readFileSync(join(ROOT, 'public/app.js'), 'utf8');

const slice = (text, start, end) => {
  const a = text.indexOf(start); const b = text.indexOf(end, a);
  assert.ok(a >= 0 && b > a, `截取失败：${start} → ${end}`);
  return text.slice(a, b);
};

test('样式表：public/style.css 与原型逐字节一致（新增样式只进 shell.css）', () => {
  assert.equal(readFileSync(join(ROOT, 'public/style.css'), 'utf8'), readFileSync(join(ROOT, 'prototypes/v0.2/style.css'), 'utf8'));
});

test('渲染代码逐字符一致：一图秀（chartSVG）与全部页面函数', () => {
  assert.equal(
    slice(dev, 'function chartSVG', '/* ---------------- AI 协助'),
    slice(proto, 'function chartSVG', '/* ---------------- AI 协助'),
  );
  assert.equal(
    slice(dev, 'function pageDash', '/* ---------------- 导出（三出口之一）'),
    slice(proto, 'function pageDash', '/* ---------------- 导出（三出口之一）'),
  );
});

test('页面树与场景表同源：10 一级 / 30 二级 / 13 场景', () => {
  const block = (text) => slice(text, 'const SUBPAGES = {', 'const SUBTITLES');
  assert.equal(block(dev), block(proto));
  const scenes = (text) => slice(text, 'const SCENES = [', '/* ---------------- 数据层');
  assert.equal(scenes(dev), scenes(proto));
  const pages = proto.match(/const PAGES = \[[\s\S]*?\];/)[0];
  assert.equal((pages.match(/\['/g) || []).length, 10);
  const subsBlock = proto.match(/const SUBPAGES = \{[\s\S]*?\n\};/)[0];
  const subs = [...subsBlock.matchAll(/\['/g)].length;
  assert.equal(subs, 30, `二级页签应为 30，实际 ${subs}`);
  const sceneCount = (proto.match(/const SCENES = \[[\s\S]*?\];/)[0].match(/\['S\d\d'/g) || []).length;
  assert.equal(sceneCount, 13);
});

test('索引页：四件齐全、noindex、内联 favicon、版本首屏、AI 五态控件存在', () => {
  const html = readFileSync(join(ROOT, 'public/index.html'), 'utf8');
  for (const f of ['style.css', 'shell.css', 'demo-data.js', 'app.js']) assert.ok(html.includes(f), `index.html 应引用 ${f}`);
  assert.ok(html.includes('name="robots" content="noindex"'));
  assert.ok(/rel="icon" href="data:image\/svg\+xml/.test(html));
  assert.ok(html.includes('id="agent-toggle"'));
  assert.ok(html.includes('id="agent-splitter"'));
  assert.ok(html.includes('id="agent-pane"'));
  assert.ok(/id="app-version">v\d+\.\d+\.\d+/.test(html));
  assert.ok(/id="ver-chip"[^>]*>v\d+\.\d+\.\d+/.test(html));
});

test('动作集合：开发版覆盖原型全部 data-action（没有漏迁移的交互）', () => {
  const actions = (text) => new Set([...text.matchAll(/data-action="([a-z0-9-]+)"/g)].map((m) => m[1]));
  const p = actions(proto); const d = actions(dev);
  const missing = [...p].filter((x) => !d.has(x));
  assert.deepEqual(missing, []);
});

test('打印块在 public：beforeprint 展开折叠卡、afterprint 恢复（32 号模版）', () => {
  for (const text of [proto, dev]) {
    assert.ok(text.includes('function printExpandFoldouts'), '缺 printExpandFoldouts');
    assert.ok(text.includes("addEventListener('beforeprint'"), '缺 beforeprint 监听');
    assert.ok(text.includes("addEventListener('afterprint'"), '缺 afterprint 监听');
    assert.ok(text.includes('details.phase-fold'), '折叠卡选择器不一致');
  }
});

test('一图秀：.chart class 在、路径用 Fritsch–Carlson、fill 由 CSS 置 none、分类节点不连线', () => {
  const chart = slice(dev, 'function chartSVG', '/* ---------------- AI 协助');
  assert.ok(chart.includes('class="chart"'), 'chartSVG 必须输出 .chart 容器');
  assert.ok(dev.includes('Fritsch–Carlson'), '平滑函数必须标注 Fritsch–Carlson');
  assert.ok(chart.includes('categorical'), '分类序列必须走独立分支');
  const css = readFileSync(join(ROOT, 'public/style.css'), 'utf8');
  assert.ok(/\.chart\s+\.line\s*\{[^}]*fill:\s*none/.test(css), 'CSS 必须把 .chart .line 的 fill 置 none');
});

test('窄宽六条：body.agent-open 代理业务区宽度 + 三个断点（1180/900/600）', () => {
  const css = readFileSync(join(ROOT, 'public/style.css'), 'utf8');
  assert.ok(css.includes('body.agent-open'), '缺 body.agent-open（AI 面板展开态）');
  for (const px of ['1180px', '900px', '600px']) assert.ok(css.includes(px), `缺断点 ${px}`);
});
