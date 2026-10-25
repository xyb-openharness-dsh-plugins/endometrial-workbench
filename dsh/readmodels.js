/* 读模型（ENDO · 子宫内膜癌）：把库里的行还原成 **demo-data.js 同一形状**。
 *
 * 契约：`GET /api/endometrial/bootstrap` 的 profiles 数组必须与 prototypes/v0.2/demo-data.js 的
 * 同名档案逐字段一致（test/store.test.mjs 是 deepStrictEqual）。parity 是这一层唯一验收标准。
 *
 * 冻结 32 表里没有 profile_meta / demo_meta 这类通用键值表，也**不允许为演示数据改 schema**。
 * 所以本层分两段读：
 *   1. `workspace.dataset_state` 里的**非事实展示文案**（说明卡、五块折叠卡、固定选项、hero 等）；
 *   2. 32 张表的**事实**（指标、出血、分子三态、分期版本链、病理、手术、治疗线、保育、
 *      Lynch 家系、放疗后私密、观点、材料、疑问、候选）——事实覆盖文案里的同名数组/字段。
 *
 * 展示文案不是第二份数值来源：可核对数值都来自表；改一行表，bootstrap 立刻变。
 * 但**不能凭空补键**：原型里没有 `unit` 的指标，这里也不补；分类点没有 `src` 就不加，
 * 否则 deepStrictEqual 会因为多一个键失败。
 *
 * 五条容易踩的：
 * 1. 排序：metric_point 按 rowid；其余按各自 ord；
 * 2. 双主体感受按记录人分组，**不能**按 ord 混排（患者与照护者的 ord 各自从 0 起）；
 * 3. 分子三态是枚举 ↔ 中文原文的双向映射，必须可逆；未检测≠阴性；
 * 4. 候选挂在合成导入文档（file_name='demo-import'）的 parse_job 下；资料库列表排除它；
 * 5. node:sqlite 返回 null-prototype 行对象，统一 `{...r}` 摊平，否则 deepStrictEqual 会因原型不同失败。
 */

import { AGENT_PANE } from '../lib/layout.js';
import { readDemoState } from './demo.js';

const rows = (db, sql, ...args) => db.prepare(sql).all(...args).map((r) => ({ ...r }));
const first = (db, sql, ...args) => {
  const r = db.prepare(sql).get(...args);
  return r ? { ...r } : null;
};
const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));

const MATERIAL_STATE = { filed: 'ready', discussed: 'partial', open: 'todo' };

/** 没有演示文案时（真实用户库）给一个空壳，保证页面能渲染。形状必须与 demo 档案一致。 */
function emptyProfile(id, row) {
  return {
    id, name: row?.name ?? '（未命名）', age: null, sex: row?.gender ?? '',
    diagnosis: '', diagnosisShort: '', stageLine: '', primaryRole: row?.primary_role ?? 'PATIENT',
    caregiverLabel: '', headline: '',
    meta: { windowStart: '', windowEnd: '', dataStart: '', menopause: '', histology: '', grade: '', fertilityDesire: '', lynchScreened: false },
    hero: {},
    bleeding: { intro: '', note: '', status: '', rows: [] },
    exam: { note: '', rows: [] },
    pathology: { note: '', rows: [], typeNote: '' },
    stage: { note: '', versions: [], stageNote: '' },
    molecular: { note: '', markers: [], multiple: '', testsStatus: '' },
    compare: { note: '', cols: [], rows: [] },
    treatment: {
      note: '', planVsActual: [], pathway: [],
      surgery: null,
      rt: { ebrt: { used: false, note: '' }, vbt: { used: false, note: '' } },
      systemic: { used: false, note: '', cycles: [] },
    },
    fertility: {
      applicable: false, reason: '',
      decision: { desire: '', age: '', parity: '', candidate: '', mri: '', review: '', told: [], note: '' },
      progestin: { regimen: '', dose: '', start: '', end: '', sideEffects: '', liver: '', biopsyInterval: null, biopsies: [], note: '' },
      conceive: { crDate: '', attemptStart: '', art: '', pregnancy: '', delivery: '', postpartum: '', note: '' },
    },
    lynch: {
      note: '',
      testing: { tumor: [], germline: [], status: '' },
      family: { note: '', rows: [], consentNote: '' },
      comm: { notified: '', testedCount: 0, plan: '', surgeryDiscussed: '', note: '', questions: [] },
    },
    intimate: {
      note: '', symptoms: [],
      dilator: { status: '', start: '', freq: '', minutes: '', size: '', pain: '', bleeding: '', moisturizer: '', lubricant: '', estrogen: '', note: '' },
      comm: { comfort: null, discussed: '', questions: [], referral: '', exportNote: '' },
    },
    followup: {
      start: '', interval: null, intervalNote: '', nodes: [], visits: [], imaging: [], cytology: [],
      comorb: { bp: '', bmi: '', glucose: '', lipids: '', exercise: '', smoking: '', bone: '', secondPrimary: '', note: '' },
      nutrition: { weight: '', rows: [], note: '' },
    },
    mind: {
      note: '',
      feelings: { patient: [], caregiver: [], note: '' },
      body: [], fertilityAnx: [], bodyNote: '',
    },
    metrics: { numeric: {}, qual: {} },
    events: [],
    docs: { documents: [], candidates: [], materials: [], questions: [], trials: [] },
    dashKeys: [],
  };
}

/** 读一个档案，还原成 demo-data.js 的档案对象形状。 */
function readProfile(db, key, demo) {
  const found = first(db, 'SELECT * FROM profile WHERE id = ?', key);
  if (!found) return null;
  const base = clone(demo?.copy?.[key]) || emptyProfile(key, found);

  /* ── 档案标量（表为准） ── */
  base.id = found.id;
  base.name = found.name ?? base.name;
  base.primaryRole = found.primary_role ?? base.primaryRole;

  /* ── 指标：表为准 ── */
  const numeric = {};
  const qual = {};
  for (const d of rows(db, 'SELECT code, is_numeric FROM metric_def ORDER BY ord')) {
    if (Number(d.is_numeric) === 0) qual[d.code] = [];
    else numeric[d.code] = [];
  }
  for (const m of rows(db, `SELECT p.code, p.measured_at, p.value_num, p.value_text, p.source_note
      FROM metric_point p WHERE p.profile_id = ? ORDER BY p.rowid`, key)) {
    const def = first(db, 'SELECT is_numeric FROM metric_def WHERE code = ?', m.code);
    if (Number(def?.is_numeric ?? 1) === 0) {
      qual[m.code]?.push({ d: m.measured_at, code: m.value_num, label: m.value_text });
    } else {
      numeric[m.code]?.push({ d: m.measured_at, v: m.value_num, src: m.source_note ?? null });
    }
  }
  base.metrics = { numeric, qual };

  /* ── 出血日志（K4：无判读列） ── */
  const bleeding = rows(db, `SELECT event_date, menopause_state, pattern, volume_text, days, clots_text, discharge_text, trigger_text, author_role
      FROM bleeding_log WHERE profile_id = ? ORDER BY ord, rowid`, key)
    .map((r, i) => ({
      ...(base.bleeding?.rows?.[i] || { id: `B${i + 1}` }),
      d: r.event_date,
      menopause: r.menopause_state,
      pattern: r.pattern,
      volume: r.volume_text,
      days: r.days,
      clots: r.clots_text,
      discharge: r.discharge_text,
      trigger: r.trigger_text,
      author: r.author_role,
    }));
  if (bleeding.length || Array.isArray(base.bleeding?.rows)) base.bleeding.rows = bleeding;

  /* ── 分期版本链（K1：只引用原文；无推导列） ── */
  const versions = rows(db, `SELECT recorded_at, anatomical, final_label, marker_text, change_text, basis, is_current
      FROM stage_record WHERE profile_id = ? ORDER BY ord, rowid`, key)
    .map((r) => ({
      d: r.recorded_at ?? null,
      anatomical: r.anatomical,
      finalLabel: r.final_label,
      marker: r.marker_text,
      change: r.change_text,
      basis: r.basis,
      current: Number(r.is_current) === 1,
    }));
  if (versions.length || Array.isArray(base.stage?.versions)) base.stage.versions = versions;

  /* ── 分子三态（K1：未检测≠阴性） ── */
  const titles = new Map(rows(db, 'SELECT marker, title FROM molecular_marker_title').map((r) => [r.marker, r.title]));
  const molecular = rows(db, 'SELECT marker, status, method, specimen_date, value_text, note FROM molecular_marker WHERE profile_id = ? ORDER BY ord, rowid', key)
    .map((r, i) => ({
      ...(base.molecular?.markers?.[i] || { key: r.marker }),
      marker: titles.get(r.marker) ?? r.marker,
      result: r.status,
      value: r.value_text,
      d: r.specimen_date ?? '',
      method: r.method,
      explain: r.note,
    }));
  if (molecular.length || Array.isArray(base.molecular?.markers)) base.molecular.markers = molecular;

  /* ── 手术（只覆盖表里有的字段；quote/margins/stay/impact 属展示文案，保留原值） ── */
  const surgery = first(db, 'SELECT surgery_date, procedure_text, hospital FROM surgery_record WHERE profile_id = ? ORDER BY revision DESC, rowid DESC', key);
  if (surgery && base.treatment) {
    base.treatment.surgery = {
      ...(base.treatment.surgery || {}),
      d: surgery.surgery_date,
      title: surgery.procedure_text,
      hospital: surgery.hospital,
    };
  }

  /* ── Lynch 家系（K2：第三方默认 private + 显式授权） ── */
  const family = rows(db, `SELECT relation, visibility, third_party_consent FROM family_member
      WHERE profile_id = ? ORDER BY ord, rowid`, key)
    .map((r, i) => ({
      ...(base.lynch?.family?.rows?.[i] || { code: `亲属 ${String.fromCharCode(65 + i)}` }),
      relation: r.relation,
      thirdParty: true,
      consent: Number(r.third_party_consent) === 1,
      visibility: r.visibility,
    }));
  if (family.length || Array.isArray(base.lynch?.family?.rows)) base.lynch.family.rows = family;

  /* ── 放疗后私密（K6：默认 private；评分在文案，不补键） ── */
  const privateRows = rows(db, 'SELECT record_date, symptom_text, visibility FROM rt_priv WHERE profile_id = ? ORDER BY ord, rowid', key)
    .map((r, i) => ({
      ...(base.intimate?.symptoms?.[i] || { id: `V${i + 1}` }),
      d: r.record_date,
      text: r.symptom_text,
      visibility: r.visibility,
    }));
  if (privateRows.length || Array.isArray(base.intimate?.symptoms)) base.intimate.symptoms = privateRows;

  /* ── 双主体感受（按记录人分组，不混排；分数在文案里，不补键） ── */
  const views = rows(db, 'SELECT topic, author_role, content, record_date, visibility FROM viewpoint WHERE profile_id = ? ORDER BY ord, rowid', key);
  const moodOf = (role) => views.filter((v) => v.topic === 'MOOD' && v.author_role === role)
    .map((v, i) => ({ ...(base.mind?.feelings?.[role === 'CAREGIVER' ? 'caregiver' : 'patient']?.[i] || {}), d: v.record_date, text: v.content }));
  if (views.some((v) => v.topic === 'MOOD') && base.mind?.feelings) {
    base.mind.feelings.patient = moodOf('PATIENT');
    base.mind.feelings.caregiver = moodOf('CAREGIVER');
  }
  const viewOf = (topic) => views.filter((v) => v.topic === topic)
    .map((v) => ({ d: v.record_date, text: v.content, visibility: v.visibility }));
  if (views.length && base.mind) {
    base.mind.body = viewOf('BODY_IMAGE');
    base.mind.fertilityAnx = viewOf('FERTILITY_ANXIETY');
  }

  /* ── 材料三态 / 疑问清单 ── */
  const materials = rows(db, 'SELECT topic, status, note, ord FROM decision_checklist WHERE profile_id = ? ORDER BY ord, rowid', key)
    .map((r, i) => ({ ...(base.docs?.materials?.[i] || { id: `m${i + 1}` }), name: r.topic, why: r.note ?? '', state: MATERIAL_STATE[r.status] ?? 'todo' }));
  if (materials.length || Array.isArray(base.docs?.materials)) base.docs.materials = materials;
  const questions = rows(db, "SELECT id, content, asked_on, from_scenario FROM question WHERE profile_id = ? AND kind = 'view' ORDER BY ord, rowid", key)
    .map((r, i) => ({ ...(base.docs?.questions?.[i] || { id: `q${i + 1}` }), text: r.content, asked: Boolean(r.asked_on), src: r.from_scenario ?? '' }));
  if (questions.length || Array.isArray(base.docs?.questions)) base.docs.questions = questions;

  /* ── 候选：确认后把状态回写（其余仍是演示文案；候选不是事实） ── */
  const candidates = rows(db, `SELECT c.field_name, c.value_text, c.confirmed
      FROM candidate c JOIN parse_job pj ON pj.id = c.parse_job_id
      JOIN document d ON d.id = pj.document_id
      WHERE d.profile_id = ? AND d.file_name = 'demo-import' ORDER BY c.rowid`, key);
  if (candidates.length) {
    base.docs.candidates = candidates.map((c, i) => ({
      ...(base.docs?.candidates?.[i] || {}),
      field: c.field_name,
      value: c.value_text,
      state: Number(c.confirmed) === 1 ? '已入库' : (base.docs?.candidates?.[i]?.state ?? '待核对'),
    }));
  }

  /* ── 资料库：演示行保持文案；真实导入（同名不存在）追加 ── */
  const dbDocs = rows(db, "SELECT id, file_name, status FROM document WHERE profile_id = ? AND file_name <> 'demo-import' ORDER BY ord, rowid", key);
  if (Array.isArray(base.docs?.documents)) {
    const known = new Set(base.docs.documents.map((d) => d.name));
    for (const d of dbDocs) {
      if (known.has(d.file_name)) continue;
      base.docs.documents.push({
        id: `d${d.id}`,
        name: d.file_name,
        kind: /\.(jpe?g|png)$/i.test(d.file_name) ? '图片' : 'pdf',
        size: '',
        status: d.status === 'parsed' ? '已核对' : d.status === 'parse_failed' ? '解析失败' : '待核对',
      });
    }
  }

  return base;
}

export function listSubjects(db) {
  return rows(db, 'SELECT id, name FROM profile ORDER BY rowid');
}

export function getProfile(db, key) {
  return readProfile(db, key, readDemoState(db));
}

/** `/api/endometrial/bootstrap` payload：与 demo-data.js 同形（meta + profiles），version/build 注入。 */
export function bootstrap(db, { version, build } = {}) {
  const demo = readDemoState(db);
  const meta = { ...(demo?.demoMeta || {}) };
  const profiles = listSubjects(db).map((s) => readProfile(db, s.id, demo));
  return {
    version: version ?? null,
    build: build ?? null,
    meta,
    catalog: { ...(demo?.catalog || {}) },
    profiles,
    /* 宿主未提供原生会话时这里会是 available:false；开发版自带挂载位演示，所以默认 true。 */
    agent: { available: true, mode: 'dev-mount' },
    layout: { agentPane: AGENT_PANE },
  };
}
