/* HTTP 层单测：health / bootstrap / profile / 静态四件 / 404 / 路径穿越 / 方法不允许。 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { Workbench } from '../dsh/workbench.js';
import { startWorkbenchServer, workspaceProblems } from '../dsh/server.js';
import { version } from '../lib/version.js';

const tmpRoot = mkdtempSync(join(homedir(), '.xyb-endo-test-'));

test('workspace 守卫：主目录 / 桌面 / 下载 / /tmp 一律拒绝', () => {
  assert.ok(workspaceProblems(homedir()).length > 0);
  assert.ok(workspaceProblems(join(homedir(), 'Desktop')).length > 0);
  assert.ok(workspaceProblems('/tmp/foo').length > 0);
  assert.deepEqual(workspaceProblems(join(tmpRoot, 'workspace')), []);
});

test('HTTP：health 带版本与能力；bootstrap 两档案；profile 可取单档案', async () => {
  const workbench = await Workbench.open(join(tmpRoot, 'ws1'));
  const started = await startWorkbenchServer({ port: 0, workbench });
  try {
    const health = await (await fetch(`${started.url}api/endometrial/health`)).json();
    assert.equal(health.ok, true);
    assert.equal(health.version, version);
    assert.ok(health.capabilities.includes('bootstrap'));
    assert.ok(health.capabilities.includes('mineru-settings'));

    const boot = await (await fetch(`${started.url}api/endometrial/bootstrap`)).json();
    assert.equal(boot.profiles.length, 2);
    assert.equal(boot.meta.today, '2026-10-24');
    assert.ok(boot.layout.agentPane);
    assert.equal(boot.profiles[0].id, 'demo1');

    const one = await (await fetch(`${started.url}api/endometrial/profile/demo2`)).json();
    assert.equal(one.profile.id, 'demo2');
    assert.equal((await fetch(`${started.url}api/endometrial/profile/nope`)).status, 404);
  } finally {
    started.server.close();
    workbench.close();
  }
});

test('HTTP：静态五件 + 未知 API JSON 404 + 路径穿越被拦', async () => {
  const workbench = await Workbench.open(join(tmpRoot, 'ws2'));
  const started = await startWorkbenchServer({ port: 0, workbench });
  try {
    for (const f of ['index.html', 'app.js', 'style.css', 'shell.css', 'demo-data.js']) {
      const r = await fetch(`${started.url}api/endometrial/ui/${f}`);
      assert.equal(r.status, 200, `${f} 应 200`);
    }
    assert.equal((await fetch(`${started.url}api/endometrial/nope`)).status, 404);
    const trav = await fetch(`${started.url}api/endometrial/ui/../../package.json`);
    const body = await trav.text();
    /* URL 归一后可能落到 /api/package.json（JSON 404）或 SPA 的 index.html；两种都不许吐包内容 */
    assert.ok(trav.status === 404 || body.includes('<!doctype html>'));
    assert.ok(!body.includes('"name": "@xyb-community'));
  } finally {
    started.server.close();
    workbench.close();
  }
});

test('HTTP：POST 方法不允许时返回 405', async () => {
  const workbench = await Workbench.open(join(tmpRoot, 'ws3'));
  const started = await startWorkbenchServer({ port: 0, workbench });
  try {
    const r = await fetch(`${started.url}api/endometrial/bootstrap`, { method: 'POST' });
    assert.equal(r.status, 405);
  } finally {
    started.server.close();
    workbench.close();
  }
});

test('HTTP：导入失败落库 parse_failed 且候选 0 条（18 号 §9）', async () => {
  const workbench = await Workbench.open(join(tmpRoot, 'ws4'));
  const started = await startWorkbenchServer({ port: 0, workbench });
  try {
    const r = await fetch(`${started.url}api/endometrial/import?name=bad.html&profile=demo1`, {
      method: 'POST', headers: { 'content-type': 'text/html' }, body: '<html></html>',
    });
    assert.ok([400, 502].includes(r.status), `.html 应被拒收，实际 ${r.status}`);
    const row = workbench.db.prepare("SELECT status FROM document WHERE profile_id='demo1' AND file_name='bad.html'").get();
    assert.equal(row?.status, 'parse_failed');
    const jobs = workbench.db.prepare(`SELECT COUNT(*) AS n FROM candidate c JOIN parse_job pj ON pj.id = c.parse_job_id
        JOIN document d ON d.id = pj.document_id WHERE d.file_name='bad.html'`).get();
    assert.equal(jobs.n, 0, '失败不许产候选');
  } finally {
    started.server.close();
    workbench.close();
    rmSync(tmpRoot, { recursive: true, force: true });
  }
});
