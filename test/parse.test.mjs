/* 解析链路单测（18 号六部件之三/四）：
 * endoparse：表格先转竖线、词边界（MMR vs MMRd、LVSI vs LVS）、not 排除、三态、单位 LaTeX、不等式；
 * settings：Token 优先级（文件优先）、掩码、校验、原子写 600、坏文件不抛"未配置"、清除只删 token 键；
 * parse：本地 md 直读不联网、.html 拒收、失败不产候选、重试留历史。 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { migrate } from '../dsh/store.js';
import { extractCandidates, htmlTablesToPipes, normalizeMarkerStatus, guessReportDate } from '../dsh/endoparse.js';
import { ImportService, kindOfFile } from '../dsh/parse.js';
import { mineruSettingsStatus, readMineruToken, saveMineruToken, clearMineruToken, maskToken } from '../dsh/settings.js';

const table = (...rows) => `| 项目 | 结果 | 单位 |\n| --- | --- | --- |\n${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}`;

test('htmlTablesToPipes：colspan 补空 + 表头分隔行；先剥标签会整表压成一行（反例）', () => {
  const html = '<table><tr><td colspan="2">项目</td><td>结果</td></tr><tr><td>MMR</td><td>pMMR</td><td>保留表达</td></tr></table>';
  const pipes = htmlTablesToPipes(html);
  assert.ok(pipes.includes('| 项目 |  | 结果 |'), 'colspan=2 必须补一个空单元格');
  assert.ok(pipes.split('\n')[1].includes('---'), '第二行必须是分隔行');
  /* 反例：先剥标签会把整表压成一行连续文本，任何指标都抽不出来 */
  const stripped = html.replace(/<[^>]+>/g, '');
  assert.equal(extractCandidates(stripped).candidates.length, 0);
});

test('词边界：MMR 不吃 MMRd；LVSI 命中原词，LVS 不是指标', () => {
  const mmrd = extractCandidates(table(['MMRd', 'PMS2 缺失'])).candidates;
  assert.ok(mmrd.some((c) => c.key === 'MMR' && c.status === 'detected'), 'MMRd 必须作为独立别名命中 MMR');
  const lvsi = extractCandidates(table(['LVSI', '未见脉管侵犯'])).candidates;
  assert.ok(lvsi.some((c) => c.key === 'LVSI'), 'LVSI 应命中');
  const lvs = extractCandidates(table(['LVS', '未见'])).candidates;
  assert.equal(lvs.some((c) => c.key === 'LVSI'), false, 'LVS 不得被当成 LVSI');
});

test('not 排除：非子宫内膜样 不算子宫内膜样；POLE-like 不算 POLE', () => {
  const neg = extractCandidates(table(['非子宫内膜样', '浆液性癌'])).candidates;
  assert.equal(neg.some((c) => c.key === 'HISTOLOGY_ENDOMETRIOID'), false);
  const poleLike = extractCandidates(table(['POLE-like 结构', '阴性'])).candidates;
  assert.equal(poleLike.some((c) => c.key === 'POLE'), false);
});

test('三态：未检测 / 未检出 / 检出分开；PMS2 缺失…保留 归为检出', () => {
  assert.equal(normalizeMarkerStatus('未检测（报告里没有）').status, 'not_tested');
  assert.equal(normalizeMarkerStatus('pMMR（四个蛋白均保留表达）').status, 'not_detected');
  assert.equal(normalizeMarkerStatus('PMS2 缺失，MLH1/MSH2/MSH6 保留').status, 'detected');
  const pole = extractCandidates(table(['POLE', '未检测'])).candidates.find((c) => c.key === 'POLE');
  assert.equal(pole.status, 'not_tested');
});

test('单位先剥 LaTeX；不等式原样保留；报告日期不猜今天', () => {
  const cells = extractCandidates(table(['WBC', '$10^9/L$']));
  assert.equal(cells.candidates.length, 0, '单位列被当成结果时不得产出数值候选');
  const wbc = extractCandidates('| 项目 | 结果 | 单位 |\n| --- | --- | --- |\n| WBC | 4.2 | $10^9/L$ |').candidates[0];
  assert.equal(wbc.unit, '10^9/L');
  assert.equal(guessReportDate('病理报告 2026-06-16.pdf'), '2026-06-16');
  assert.equal(guessReportDate('无日期'), null);
});

test('settings：文件优先于环境变量、掩码不泄中段、校验失败不落盘', () => {
  const dir = mkdtempSync(join(homedir(), '.xyb-endo-settings-'));
  const file = join(dir, 'mineru.json');
  const env = { MINERU_TOKEN: 'sk-env-old-000001' };
  const before = mineruSettingsStatus({ file, env });
  assert.equal(before.configured, true);
  assert.equal(before.source, 'env', '文件不存在时 env 兜底');
  const saved = saveMineruToken('sk-file-test-abcdef', { file, env });
  assert.equal(saved.source, 'file', '文件必须优先于 env');
  assert.equal(saved.masked, 'sk-f****ef');
  assert.equal((statSync(file).mode & 0o777).toString(8), '600');
  assert.equal(readMineruToken({ file }), 'sk-file-test-abcdef');
  assert.throws(() => saveMineruToken('sk-bad token', { file, env }), /不能有空格/);
  assert.equal(maskToken('short'), '****');
  writeFileSync(file, '{broken');
  assert.throws(() => readMineruToken({ file }), /不是合法 JSON/);
  writeFileSync(file, JSON.stringify({ token: 'sk-x-123456', other: 1 }));
  const cleared = clearMineruToken({ file, env });
  assert.equal(JSON.parse(readFileSync(file, 'utf8')).other, 1, '清除只删 token 键');
  assert.equal(cleared.source, 'env', '文件清了仍应看到 env 里那把');
  rmSync(dir, { recursive: true, force: true });
});

test('parse：本地 md 直读；.html 拒收；失败不产候选；重试留历史', async () => {
  assert.equal(kindOfFile('a.pdf'), 'cloud');
  assert.equal(kindOfFile('a.md'), 'local');
  assert.equal(kindOfFile('a.html'), 'reject');
  const db = new DatabaseSync(':memory:');
  migrate(db);
  const service = new ImportService(db);
  const md = Buffer.from(table(['MMRd', 'PMS2 缺失']));
  const out = await service.parse(md, { filename: 'report.md', profileKey: 'demo1' });
  assert.ok(out.candidates.length >= 1);
  const rec = service.record({ profileKey: 'demo1', document: out.document, candidates: out.candidates, bytes: md });
  assert.equal(rec.candidates, out.candidates.length);
  assert.equal(db.prepare("SELECT status FROM document WHERE id = ?").get(rec.documentId).status, 'parsed');
  const again = service.record({ profileKey: 'demo1', document: out.document, candidates: out.candidates, bytes: md });
  assert.equal(again.documentId, rec.documentId, '重复导入不新建文档');
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM parse_job').get().n, 2, '重试新增任务记录，旧记录保留');
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM candidate').get().n, out.candidates.length * 2);

  await assert.rejects(() => service.parse(Buffer.from('<html></html>'), { filename: 'x.html' }), /暂不支持解析/);
  const failed = service.fail({ profileKey: 'demo1', document: { name: 'bad.pdf' }, error: { code: 'UNEXPECTED', message: 'x' } });
  assert.equal(db.prepare('SELECT status FROM document WHERE id = ?').get(failed.documentId).status, 'parse_failed');
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM candidate WHERE parse_job_id = (SELECT MAX(id) FROM parse_job)').get().n, 0);
  db.close();
});
