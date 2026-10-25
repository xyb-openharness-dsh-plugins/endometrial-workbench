/* 演示数据播种（ENDO · 子宫内膜癌）。
 *
 * 唯一数据源是 `demo/build-demo-data.mjs` 的 `buildDemoProfiles()`（同一份数据生成
 * prototypes/v0.2/demo-data.js、demo/demo-data.json、demo/demo-data.sqlite）。
 * 本文件只把这份纯数据写进库，不改写任何数值——演示数据一旦在这里多出一条，
 * 原型与开发版就会各说一套（test/store.test.mjs 的 deepStrictEqual parity 就是钉这个）。
 *
 * schema 冻结为 32 表（0001_initial.sql），且**不得为演示数据改结构**。演示档案里
 * 有一部分"展示文案"（hero、说明卡、固定选项、五块折叠卡、分期原文等）在 32 表里
 * 没有对应列；这些非事实字段按档案整份存进 `workspace.dataset_state`（JSON），
 * 读模型从那里取文案，其余事实（指标、出血、分子三态、分期版本链、病理、手术、
 * 治疗线、保育、Lynch 家系、放疗后私密、观点、材料、疑问、候选）仍然逐表读取。
 * 这样既不改 schema，也不会出现第二份数值来源。
 *
 * 两条纪律：
 * 1. 所有 INSERT 写显式列名 + 显式问号数；
 * 2. 幂等（已有 profile 整批跳过）+ 单事务（失败整体回滚）。
 */

import { createHash } from 'node:crypto';
import { buildDemoProfiles } from '../demo/build-demo-data.mjs';

const sha = (text) => createHash('sha256').update(String(text), 'utf8').digest('hex');
const j = (v) => (v === undefined ? null : JSON.stringify(v));

/* ENDO 指标目录（显示字典在原型 app.js 的 CATALOG；这里只落库 code 侧元数据）。 */
const METRIC_DEFS = [
  ['WEIGHT', '体重', 'kg', '体重与营养', '#6A55B8', 1, null, 0],
  ['BLEED_DAYS', '出血持续天数', '天', '出血轨道', '#A8577A', 1, null, 1],
  ['IMG_MM', '内膜厚度（TVS 双层）', 'mm', '同模态影像测量', '#2F6F66', 1, null, 2],
  ['TX_EVENT', '治疗事件节点', null, '分类节点', '#8A5B7B', 0, null, 3],
  ['MOLECULAR_EVENT', '分子结果日期', null, '分类节点', '#B08A5B', 0, null, 4],
  ['FOLLOWUP_EVENT', '随访节点', null, '分类节点', '#55707E', 0, null, 5],
];

/* demo 文本 ↔ 0001 枚举的可逆映射。 */
const MARKER_KEY = { 'MMR（错配修复）': 'MMR', MMR: 'MMR', 'p53': 'P53', P53: 'P53', POLE: 'POLE' };
const MATERIAL_STATUS = { ready: 'filed', partial: 'discussed', todo: 'open' };
const TX_KIND = { '① 手术': 'SURGERY', '② 阴道残端近距离放疗': 'RT_VAGINAL', '③ 随访': 'OBSERVATION', '① 保育评估': 'OBSERVATION', '② 孕激素 + LNG-IUD': 'HORMONAL', '③ 妊娠尝试与产后计划': 'OTHER' };
const CYCLE_STATUS = { 开始: 'done', 继续: 'done', 已完成: 'done', 已预约: 'planned', 进行中: 'done', 已停: 'skipped' };

function roleOf(author) {
  return author === 'CAREGIVER' ? 'CAREGIVER' : 'PATIENT';
}

/**
 * 把 buildDemoProfiles() 的数据写进库。返回写入计数（启动日志与测试用）。
 * @param {object} db 已 migrate 的数据库
 * @param {object} [input] 注入用（默认 buildDemoProfiles()）
 */
export function seedDemo(db, input) {
  if (!db || typeof db.prepare !== 'function') throw new TypeError('seedDemo 需要一个已打开的数据库');
  const data = input || buildDemoProfiles();
  const already = db.prepare('SELECT COUNT(*) AS n FROM profile').get().n;
  if (already > 0) return { skipped: true, subjects: 0, metrics: 0, points: 0, trials: 0, candidates: 0 };

  const counts = { skipped: false, subjects: 0, metrics: 0, points: 0, trials: 0, candidates: 0 };
  const today = data.meta?.today ?? new Date().toISOString().slice(0, 10);

  db.exec('BEGIN');
  try {
    const insWorkspace = db.prepare('INSERT OR REPLACE INTO workspace (id, data_root, schema_version, dataset_state) VALUES (?,?,?,?)');
    insWorkspace.run(1, null, '0001', j({
      demoMeta: data.meta,
      /* 指标目录（code→名称/单位/颜色/小数位/是否分类）是展示字典，与 metric_def 同源。 */
      catalog: data.catalog,
      /* 非事实展示文案（32 表无对应列）；事实在下面逐表写入。 */
      copy: Object.fromEntries(data.profiles.map((p) => [p.id, p])),
    }));

    const insProfile = db.prepare(`INSERT INTO profile
      (id, name, birth_date, gender, primary_role, cognitive_flag, created_at) VALUES (?,?,?,?,?,?,?)`);
    const insMetricDef = db.prepare(`INSERT INTO metric_def
      (code, label, unit, category, color, is_numeric, ctcae_rule, ord) VALUES (?,?,?,?,?,?,?,?)`);
    const insPoint = db.prepare(`INSERT INTO metric_point
      (profile_id, code, measured_at, value_num, value_text, source_note, revision) VALUES (?,?,?,?,?,?,?)`);
    const insLab = db.prepare(`INSERT INTO lab_result
      (profile_id, collected_at, panel, ref_range, document_id) VALUES (?,?,?,?,?)`);
    const insNutrition = db.prepare(`INSERT INTO nutrition_log
      (profile_id, logged_at, intake_level, weight_kg, note, ord) VALUES (?,?,?,?,?,?)`);
    const insQuestion = db.prepare(`INSERT INTO question
      (profile_id, kind, content, created_at, asked_on, from_scenario, ord) VALUES (?,?,?,?,?,?,?)`);
    const insDocument = db.prepare(`INSERT INTO document
      (profile_id, file_name, sha256, status, imported_at, ord) VALUES (?,?,?,?,?,?)`);
    const insTrial = db.prepare(`INSERT INTO saved_trial
      (profile_id, trial_key, saved_at) VALUES (?,?,?)`);
    const insBleed = db.prepare(`INSERT INTO bleeding_log
      (profile_id, event_date, menopause_state, pattern, volume_text, days, clots_text, discharge_text, trigger_text, author_role, ord, revision)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
    const insMolTest = db.prepare(`INSERT INTO molecular_test
      (profile_id, test_date, kind, state, note, report_doc_id, ord) VALUES (?,?,?,?,?,?,?)`);
    const insMarker = db.prepare(`INSERT INTO molecular_marker
      (profile_id, marker, status, method, specimen_date, value_text, report_doc_id, note, ord, revision) VALUES (?,?,?,?,?,?,?,?,?,?)`);
    const insMarkerTitle = db.prepare('INSERT OR REPLACE INTO molecular_marker_title (marker, title, ord) VALUES (?,?,?)');
    const insStage = db.prepare(`INSERT INTO stage_record
      (profile_id, recorded_at, anatomical, final_label, marker_text, change_text, basis, is_current, multiple_text, ord, revision)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
    const insPathology = db.prepare(`INSERT INTO pathology_record
      (profile_id, specimen_date, histology, grade_text, myometrial_invasion, lvsi, margins, report_doc_id, revision)
      VALUES (?,?,?,?,?,?,?,?,?)`);
    const insSurgery = db.prepare(`INSERT INTO surgery_record
      (profile_id, surgery_date, procedure_text, sln_text, hospital, report_doc_id, revision)
      VALUES (?,?,?,?,?,?,?)`);
    const insTxLine = db.prepare(`INSERT INTO tx_line
      (profile_id, kind, start_date, end_date, regimen_text, change_reason, ord, revision)
      VALUES (?,?,?,?,?,?,?,?)`);
    const insTxCycle = db.prepare(`INSERT INTO tx_cycle
      (profile_id, line_id, cycle_number, planned_date, actual_date, status, note, ord) VALUES (?,?,?,?,?,?,?,?)`);
    const insFertPath = db.prepare(`INSERT INTO fertility_path
      (profile_id, decision_text, regimen_text, start_date, status_text, doctor_note, ord, revision)
      VALUES (?,?,?,?,?,?,?,?)`);
    const insFertBiopsy = db.prepare(`INSERT INTO fertility_biopsy
      (profile_id, biopsy_date, result_text, interval_note, ord) VALUES (?,?,?,?,?)`);
    const insPregnancy = db.prepare(`INSERT INTO pregnancy_attempt
      (profile_id, record_date, status_text, note, author_role, ord) VALUES (?,?,?,?,?,?)`);
    const insLynch = db.prepare(`INSERT INTO lynch_record
      (profile_id, tumor_mmr_note, germline_state, germline_note, doctor_reply, ord, revision) VALUES (?,?,?,?,?,?,?)`);
    const insFamily = db.prepare(`INSERT INTO family_member
      (profile_id, relation, disclose_state, testing_state, note, visibility, third_party_consent, ord) VALUES (?,?,?,?,?,?,?,?)`);
    const insRtPriv = db.prepare(`INSERT INTO rt_priv
      (profile_id, record_date, symptom_text, care_text, visibility, ord) VALUES (?,?,?,?,?,?)`);
    const insViewpoint = db.prepare(`INSERT INTO viewpoint
      (profile_id, author_role, visibility, topic, content, record_date, ord) VALUES (?,?,?,?,?,?,?)`);
    const insChecklist = db.prepare(`INSERT INTO decision_checklist
      (profile_id, topic, status, note, ord) VALUES (?,?,?,?,?)`);
    const insImportFile = db.prepare('INSERT INTO import_file (document_id, byte_size, mime, in_use) VALUES (?,?,?,1)');
    const insParseJob = db.prepare(`INSERT INTO parse_job
      (document_id, requested_at, state, error_code, error_message) VALUES (?,?,?,?,?)`);
    const insCandidate = db.prepare(`INSERT INTO candidate
      (parse_job_id, field_name, value_text, value_num, unit, confirmed, confirmed_at, target_table, target_id)
      VALUES (?,?,?,?,?,?,?,?,?)`);

    for (const def of METRIC_DEFS) insMetricDef.run(...def);
    counts.metrics = METRIC_DEFS.length;

    for (const p of data.profiles) {
      const key = p.id;
      insProfile.run(key, p.name ?? null, null, p.sex === '女' ? 'F' : null, p.primaryRole ?? 'PATIENT', 'stable', `${today}T00:00:00.000Z`);
      counts.subjects += 1;

      /* ── 指标：数值 + 分类（value_num=code、value_text=label） ── */
      for (const [code, arr] of Object.entries(p.metrics?.numeric || {})) {
        (arr || []).forEach((x) => {
          insPoint.run(key, code, x.d, x.v, null, x.src ?? null, 1);
          counts.points += 1;
        });
      }
      for (const [code, arr] of Object.entries(p.metrics?.qual || {})) {
        (arr || []).forEach((x) => {
          insPoint.run(key, code, x.d, x.code, x.label ?? null, null, 1);
          counts.points += 1;
        });
      }

      /* ── 出血日志（K4 独立轨道，无判读列） ── */
      (p.bleeding?.rows || []).forEach((r, i) => {
        insBleed.run(key, r.d ?? null, r.menopause ?? null, r.pattern ?? null, r.volume ?? null,
          r.days == null ? null : r.days, r.clots ?? null, r.discharge ?? null, r.trigger ?? null,
          roleOf(r.author), i, 1);
      });

      /* ── 分子两层：test 级 done/pending/not_done + marker 级三态（K1） ── */
      (p.molecular?.markers || []).forEach((m, i) => {
        const marker = MARKER_KEY[m.marker] ?? 'MMR';
        const testKind = marker === 'POLE' ? 'POLE_SEQ' : marker === 'P53' ? 'P53_IHC' : 'MMR_IHC';
        const testState = m.result === 'not_tested' ? 'not_done' : 'done';
        insMolTest.run(key, m.d || null, testKind, testState, m.value ?? null, null, i);
        insMarkerTitle.run(marker, m.marker, i);
        insMarker.run(key, marker, m.result ?? 'not_tested', m.method ?? null, m.d || null,
          m.value ?? null, null, m.explain ?? null, i, 1);
      });

      /* ── 分期版本链（K1：只引用，无判定列） ── */
      (p.stage?.versions || []).forEach((v, i) => {
        insStage.run(key, v.d ?? today, v.anatomical ?? null, v.finalLabel ?? null, v.marker ?? null,
          v.change ?? null, v.basis ?? null, v.current ? 1 : 0, p.molecular?.multiple ?? null, i, 1);
      });

      /* ── 病理摘要（逐项原文在 copy；这里落可核对的关键字段） ── */
      const pathRows = p.pathology?.rows || [];
      const pathOf = (needle) => pathRows.find((r) => String(r.item).includes(needle))?.value ?? null;
      if (pathRows.length) {
        insPathology.run(key, pathOf('肌层浸润') ? (pathRows.find((r) => String(r.item).includes('肌层浸润'))?.d ?? today) : today,
          pathOf('组织学类型'), pathOf('FIGO 分级'), pathOf('肌层浸润'), pathOf('LVSI'), null, null, 1);
      }

      /* ── 手术（只记录原文；margins/quote 属展示文案） ── */
      const s = p.treatment?.surgery;
      if (s && s.d && s.d !== '—') {
        insSurgery.run(key, s.d, s.title ?? null, null, s.hospital ?? null, null, 1);
      }

      /* ── 治疗线 + 周期（32 号折叠卡数据源） ── */
      (p.treatment?.pathway || []).forEach((f, i) => {
        const r = insTxLine.run(key, TX_KIND[f.phase] ?? 'OTHER', f.d ?? null, null,
          f.detail?.regimen?.summary ?? null, null, i, 1);
        const lineId = Number(r.lastInsertRowid);
        if (String(f.phase).includes('近距离放疗')) {
          ['2026-07-14', '2026-07-21', '2026-07-28'].forEach((d, k) => {
            insTxCycle.run(key, lineId, k + 1, d, d, 'done', '按计划完成', k);
          });
        }
      });
      (p.treatment?.systemic?.cycles || []).forEach((c, i) => {
        insTxCycle.run(key, null, c.n ?? null, c.d ?? null, c.d ?? null,
          CYCLE_STATUS[c.status] ?? 'done', c.text ?? null, i);
      });

      /* ── 保育路径（K3：零成功率字段） ── */
      if (p.fertility?.applicable) {
        const d = p.fertility.decision || {};
        const pr = p.fertility.progestin || {};
        insFertPath.run(key, d.desire ?? null, pr.regimen ?? null, pr.start ?? null,
          pr.end === '进行中' ? '进行中' : (pr.end ?? null), pr.note ?? null, 0, 1);
        (pr.biopsies || []).forEach((b, i) => {
          insFertBiopsy.run(key, b.d ?? null, b.result ?? null, String(pr.biopsyInterval ?? ''), i);
        });
        const cv = p.fertility.conceive || {};
        if (cv.attemptStart && cv.attemptStart !== '—') {
          insPregnancy.run(key, cv.attemptStart, '尝试怀孕（本人记录）', cv.note ?? null, 'PATIENT', 0);
        }
      }

      /* ── Lynch 与家系（K2：第三方默认 private + 授权位） ── */
      const lynch = p.lynch || {};
      insLynch.run(key, lynch.testing?.status ?? null, 'not_tested',
        lynch.testing?.germline?.[1]?.value ?? null, lynch.testing?.germline?.[0]?.quote ?? null, 0, 1);
      (lynch.family?.rows || []).forEach((m, i) => {
        insFamily.run(key, m.relation ?? null, 'unknown', 'unknown', `${m.code ?? ''}${m.cancer ? ' · ' + m.cancer : ''}`,
          m.visibility ?? 'private', m.consent ? 1 : 0, i);
      });

      /* ── 放疗后私密（K6：默认 private；数值/评分在 copy） ── */
      (p.intimate?.symptoms || []).forEach((r, i) => {
        insRtPriv.run(key, r.d ?? today, r.text ?? null, null, r.visibility ?? 'private', i);
      });

      /* ── 双主体感受与私密观点（默认 private） ── */
      (p.mind?.feelings?.patient || []).forEach((x, i) => {
        insViewpoint.run(key, 'PATIENT', 'private', 'MOOD', x.text ?? '', x.d ?? null, i);
      });
      (p.mind?.feelings?.caregiver || []).forEach((x, i) => {
        insViewpoint.run(key, 'CAREGIVER', 'private', 'MOOD', x.text ?? '', x.d ?? null, i);
      });
      (p.mind?.body || []).forEach((x, i) => {
        insViewpoint.run(key, 'PATIENT', x.visibility ?? 'private', 'BODY_IMAGE', x.text ?? '', x.d ?? null, i);
      });
      (p.mind?.fertilityAnx || []).forEach((x, i) => {
        insViewpoint.run(key, 'PATIENT', x.visibility ?? 'private', 'FERTILITY_ANXIETY', x.text ?? '', x.d ?? null, i);
      });

      /* ── 就诊准备：材料三态 + 疑问清单 + 试验收藏 ── */
      (p.docs?.materials || []).forEach((m, i) => {
        insChecklist.run(key, m.name ?? null, MATERIAL_STATUS[m.state] ?? 'open', m.why ?? null, i);
      });
      (p.docs?.questions || []).forEach((q, i) => {
        insQuestion.run(key, 'view', q.text ?? '', `${today}T00:00:00.000Z`, q.asked ? today : null, q.src ?? null, i);
      });
      /* 资料库：只落文件名与哈希；kind/size/status 属展示文案，读模型从 copy 取。 */
      (p.docs?.documents || []).forEach((d, i) => {
        insDocument.run(key, d.name ?? '未命名资料', sha(`${key}:${d.id}:${d.name}`), 'parsed', today, i);
      });
      (p.docs?.trials || []).forEach((t) => {
        insTrial.run(key, t.id ?? null, today);
        counts.trials += 1;
      });

      /* ── 候选：挂在合成导入文档（demo-import 不进资料库列表） ── */
      const candidates = p.docs?.candidates || [];
      if (candidates.length) {
        const r = insDocument.run(key, 'demo-import', sha(`${key}:demo-import`), 'parsed', today, 9999);
        const documentId = Number(r.lastInsertRowid);
        insImportFile.run(documentId, 0, null);
        const job = insParseJob.run(documentId, `${today}T00:00:00.000Z`, 'succeeded', null, null);
        candidates.forEach((c) => {
          insCandidate.run(Number(job.lastInsertRowid), c.field ?? '', c.value ?? null, null, null, 0, null, null, null);
          counts.candidates += 1;
        });
      }

      /* ── 体重与营养（事实记录；不给食谱/热量处方） ── */
      (p.followup?.nutrition?.rows || []).forEach((r, i) => {
        insNutrition.run(key, r.d ?? null, 'OK', r.weight == null ? null : r.weight, [r.meal, r.symptom].filter(Boolean).join(' · ') || null, i);
      });

      /* ── 化验摘要（只存原文数值） ── */
      const weight = (p.metrics?.numeric?.WEIGHT || []).slice(-1)[0];
      if (weight) insLab.run(key, weight.d ?? today, j({ weight: weight.v ?? null, src: weight.src ?? null }), null, null);
    }

    db.exec('COMMIT');
  } catch (error) {
    try { db.exec('ROLLBACK'); } catch { /* 回滚失败也要把原始错误抛出去 */ }
    throw new Error(`播种演示数据失败（已回滚）：${error.message}`);
  }
  return counts;
}

/** 库的演示档案是否已播种过。 */
export function hasDemoData(db) {
  try {
    return db.prepare('SELECT COUNT(*) AS n FROM profile').get().n > 0;
  } catch {
    return false;
  }
}

/** 读模型用：取出演示副本（meta + 每档案展示文案）。 */
export function readDemoState(db) {
  try {
    const row = db.prepare('SELECT dataset_state FROM workspace WHERE id = 1').get();
    if (!row?.dataset_state) return null;
    return JSON.parse(row.dataset_state);
  } catch {
    return null;
  }
}
