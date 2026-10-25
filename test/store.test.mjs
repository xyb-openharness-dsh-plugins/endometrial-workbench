/* 数据层单测：迁移幂等 / 播种幂等 / readmodels parity / schema 冻结 32 表 / 事实可回读 / K 契约。 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { migrate } from '../dsh/store.js';
import { seedDemo, hasDemoData } from '../dsh/demo.js';
import { bootstrap, getProfile } from '../dsh/readmodels.js';
import { buildDemoProfiles } from '../demo/build-demo-data.mjs';

const fresh = () => {
  const db = new DatabaseSync(':memory:');
  migrate(db);
  seedDemo(db);
  return db;
};

test('迁移：32 张业务表 + 迁移台账；重复 migrate 幂等', () => {
  const db = new DatabaseSync(':memory:');
  const first = migrate(db);
  assert.equal(first.executed.length, 1);
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name <> 'schema_migrations'").all();
  assert.equal(tables.length, 32, `业务表应为 32，实际 ${tables.length}`);
  const second = migrate(db);
  assert.deepEqual(second.executed, []);
  db.close();
});

test('播种：幂等（第二次整批跳过）且单事务', () => {
  const db = fresh();
  assert.equal(hasDemoData(db), true);
  const before = db.prepare('SELECT COUNT(*) AS n FROM metric_point').get().n;
  const again = seedDemo(db);
  assert.equal(again.skipped, true);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM metric_point').get().n, before);
  db.close();
});

test('parity：bootstrap 两档案与 demo-data.js 逐字段一致（deepStrictEqual）', () => {
  const db = fresh();
  const got = bootstrap(db, { version: 'test', build: 'test' });
  const want = buildDemoProfiles();
  assert.deepEqual(got.meta, want.meta);
  assert.equal(got.profiles.length, want.profiles.length);
  got.profiles.forEach((p, i) => assert.deepEqual(p, want.profiles[i], `profile ${p.id} parity 不一致`));
  db.close();
});

test('事实可回读：改一行 metric_point，bootstrap 立即反映（不是返回静态 JSON）', () => {
  const db = fresh();
  db.prepare("UPDATE metric_point SET value_num = 99 WHERE profile_id='demo1' AND code='WEIGHT' AND measured_at='2026-10-15'").run();
  const p = getProfile(db, 'demo1');
  const last = p.metrics.numeric.WEIGHT.at(-1);
  assert.equal(last.v, 99);
  db.close();
});

test('K1/K3/K5 结构：无判定列；分子三态齐全；未检测与未检出分开', () => {
  const db = fresh();
  const cols = (t) => db.prepare(`PRAGMA table_info(${t})`).all().map((c) => c.name);
  for (const forbidden of ['diagnosis', 'benign', 'malignant', 'risk_grade', 'success_rate', 'recommend']) {
    assert.equal(cols('stage_record').includes(forbidden), false, `stage_record 不应有 ${forbidden}`);
    assert.equal(cols('fertility_path').includes(forbidden), false, `fertility_path 不应有 ${forbidden}`);
  }
  const p1 = getProfile(db, 'demo1');
  const pole = p1.molecular.markers.find((m) => m.key === 'POLE');
  assert.equal(pole.result, 'not_tested');
  const mmr1 = p1.molecular.markers.find((m) => m.key === 'MMR');
  assert.equal(mmr1.result, 'not_detected');
  const mmr2 = getProfile(db, 'demo2').molecular.markers.find((m) => m.key === 'MMR');
  assert.equal(mmr2.result, 'detected');
  db.close();
});

test('K2/K6：家系第三方默认 private + 授权位；放疗后私密默认 private', () => {
  const db = fresh();
  const family = db.prepare('SELECT visibility, third_party_consent FROM family_member').all();
  assert.ok(family.length >= 4);
  for (const row of family) {
    assert.equal(row.visibility, 'private');
    assert.equal(Number(row.third_party_consent), 1);
  }
  const priv = db.prepare('SELECT visibility FROM rt_priv').all();
  assert.ok(priv.length >= 2);
  for (const row of priv) assert.equal(row.visibility, 'private');
  /* 三出口过滤只认 private 行：函数在前端，同一份数据在这里只验证默认值 */
  const p = getProfile(db, 'demo1');
  assert.ok(p.intimate.symptoms.every((x) => x.visibility === 'private'));
  assert.ok(p.lynch.family.rows.every((x) => x.thirdParty === true && x.consent === true && x.visibility === 'private'));
  db.close();
});

test('K4：出血日志无病因/性质/严重度列；独立轨道按 ord 排序', () => {
  const db = fresh();
  const cols = db.prepare('PRAGMA table_info(bleeding_log)').all().map((c) => c.name);
  for (const forbidden of ['cause', 'nature', 'severity', 'grade', 'diagnosis']) assert.equal(cols.includes(forbidden), false);
  const p = getProfile(db, 'demo1');
  assert.deepEqual(p.bleeding.rows.map((r) => r.d), ['2026-04-28', '2026-05-06', '2026-05-18']);
  db.close();
});
