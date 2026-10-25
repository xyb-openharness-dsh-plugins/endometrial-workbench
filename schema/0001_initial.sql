-- 0001_initial.sql · ENDO 工作台初始迁移（G3 冻结版 · 2026-10-25）
-- 顺序：档案级 → 指标 → 通用 → ENDO 专属 → 导入件。共 32 表。
-- 四契约 + ENDO 红线：K1 分型/分期只引用（无 risk_grade/success_rate 判定列）；
--   K2 家系成员第三方信息默认 private + 授权位；K3 保育零成功率字段；K4 出血日志无判读列；
--   K5 对照只存引用；K6 放疗后私密默认 private（三出口过滤在应用层）。

-- ═══ 档案级（2）═══
CREATE TABLE workspace (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data_root TEXT,
  schema_version TEXT NOT NULL,
  dataset_state TEXT
);
CREATE TABLE profile (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date TEXT,
  gender TEXT,
  primary_role TEXT CHECK (primary_role IN ('PATIENT','CAREGIVER')),
  cognitive_flag TEXT CHECK (cognitive_flag IN ('stable','changed')),
  created_at TEXT NOT NULL
);

-- ═══ 指标（3）═══
CREATE TABLE metric_def (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  unit TEXT,
  category TEXT NOT NULL,
  color TEXT,
  is_numeric INTEGER NOT NULL DEFAULT 1,
  ctcae_rule TEXT,
  ord INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE metric_point (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profile(id),
  code TEXT NOT NULL REFERENCES metric_def(code),
  measured_at TEXT NOT NULL,
  value_num REAL,
  value_text TEXT,
  source_note TEXT,
  revision INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE lab_result (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  collected_at TEXT NOT NULL,
  panel TEXT,
  ref_range TEXT,
  document_id INTEGER
);

-- ═══ 通用（7）═══
CREATE TABLE adverse_event (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  term TEXT NOT NULL,
  ctcae_grade INTEGER,
  attribution_note TEXT,
  ord INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE symptom_log (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  logged_at TEXT NOT NULL,
  symptom TEXT NOT NULL,
  severity_text TEXT,
  author_role TEXT NOT NULL CHECK (author_role IN ('PATIENT','CAREGIVER')),
  ord INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE nutrition_log (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  logged_at TEXT NOT NULL,
  intake_level TEXT CHECK (intake_level IN ('OK','REDUCED','MINIMAL')),
  weight_kg REAL,
  note TEXT,
  ord INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE question (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('fact','view')),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  asked_on TEXT,
  from_scenario TEXT,
  ord INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE task (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  title TEXT NOT NULL,
  due_on TEXT,
  done INTEGER NOT NULL DEFAULT 0,
  ord INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE document (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','parsed','parse_failed')),
  imported_at TEXT NOT NULL,
  ord INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE saved_trial (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  trial_key TEXT NOT NULL,
  saved_at TEXT NOT NULL
);

-- ═══ ENDO 专属（17）═══
-- K4：出血日志（确诊前独立轨道；无判读列）
CREATE TABLE bleeding_log (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profile(id),
  event_date TEXT NOT NULL,
  menopause_state TEXT,                     -- 绝经 4 年 / 未绝经（患者语言）
  pattern TEXT,                             -- 突然出血/点滴/突破性出血
  volume_text TEXT,
  days INTEGER,
  clots_text TEXT,
  discharge_text TEXT,
  trigger_text TEXT,
  author_role TEXT NOT NULL CHECK (author_role IN ('PATIENT','CAREGIVER')),
  ord INTEGER NOT NULL DEFAULT 0,
  revision INTEGER NOT NULL DEFAULT 1
);
-- K1：分子检测两层（test 级 + marker 级三态）
CREATE TABLE molecular_test (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  test_date TEXT,
  kind TEXT NOT NULL CHECK (kind IN ('MMR_IHC','MSI_PCR','POLE_SEQ','P53_IHC','OTHER')),
  state TEXT NOT NULL CHECK (state IN ('done','pending','not_done')),
  note TEXT,
  report_doc_id INTEGER,
  ord INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE molecular_marker (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  marker TEXT NOT NULL CHECK (marker IN ('MMR','PMS2','MSH2','MSH6','MLH1','POLE','P53')),
  status TEXT NOT NULL CHECK (status IN ('detected','not_detected','not_tested')),
  method TEXT, specimen_date TEXT,
  value_text TEXT,
  report_doc_id INTEGER,
  note TEXT,
  ord INTEGER NOT NULL DEFAULT 0,
  revision INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE molecular_marker_title ( marker TEXT PRIMARY KEY, title TEXT NOT NULL, ord INTEGER NOT NULL DEFAULT 0 );
-- K1：分期版本链（FIGO 2023；只引用，无判定列）
CREATE TABLE stage_record (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  recorded_at TEXT NOT NULL,
  anatomical TEXT,                          -- 解剖期别（报告原文）
  final_label TEXT,                         -- 最终标签（含分子标签，如 IAmPOLEmut；医生记录）
  marker_text TEXT,                         -- 分子标记原文
  change_text TEXT,                         -- 分子改期：无/未知/有（原文）
  basis TEXT,                               -- 依据原文（病理/影像/会诊）
  is_current INTEGER NOT NULL DEFAULT 0,
  multiple_text TEXT,                       -- 多重分类陈述（如实记录）
  ord INTEGER NOT NULL DEFAULT 0,
  revision INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE pathology_record (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  specimen_date TEXT,
  histology TEXT,                           -- 内膜样/浆液性/透明细胞/其他（原文）
  grade_text TEXT,
  myometrial_invasion TEXT,                 -- <1/2 / >=1/2（原文）
  lvsi TEXT,                                -- 无/灶性/有（原文）
  margins TEXT,
  report_doc_id INTEGER,
  revision INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE surgery_record (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  surgery_date TEXT NOT NULL,
  procedure_text TEXT,                      -- 全子宫+双附件±淋巴结
  sln_text TEXT,
  hospital TEXT,
  report_doc_id INTEGER,
  revision INTEGER NOT NULL DEFAULT 1
);
-- 32 号折叠卡数据源：治疗线 + 周期
CREATE TABLE tx_line (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('SURGERY','RT_VAGINAL','CHEMO','IMMUNO','HORMONAL','OBSERVATION','OTHER')),
  start_date TEXT, end_date TEXT,
  regimen_text TEXT,
  change_reason TEXT,                       -- 换线原因原文（不评疗效）
  ord INTEGER NOT NULL DEFAULT 0,
  revision INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE tx_cycle (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  line_id INTEGER REFERENCES tx_line(id),
  cycle_number INTEGER,
  planned_date TEXT, actual_date TEXT,
  status TEXT CHECK (status IN ('planned','done','delayed','skipped')),
  note TEXT,
  ord INTEGER NOT NULL DEFAULT 0
);
-- K3：保育路径（零成功率字段）
CREATE TABLE fertility_path (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  decision_text TEXT,                       -- 选择记录（患者/医生原话）
  regimen_text TEXT,                        -- 孕激素方案原文
  start_date TEXT, status_text TEXT,
  doctor_note TEXT,
  ord INTEGER NOT NULL DEFAULT 0,
  revision INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE fertility_biopsy (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  biopsy_date TEXT NOT NULL,
  result_text TEXT,                         -- 病理原文（不判读）
  interval_note TEXT,                       -- 医生给的间隔原文
  ord INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE pregnancy_attempt (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  record_date TEXT NOT NULL,
  status_text TEXT,                         -- 尝试/妊娠/产后（患者语言）
  note TEXT,
  author_role TEXT NOT NULL CHECK (author_role IN ('PATIENT','CAREGIVER')),
  ord INTEGER NOT NULL DEFAULT 0
);
-- K2：Lynch 与家系（第三方默认 private + 授权位）
CREATE TABLE lynch_record (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  tumor_mmr_note TEXT,                      -- 肿瘤 MMR 状态原文
  germline_state TEXT CHECK (germline_state IN ('not_tested','pending','tested','declined')),
  germline_note TEXT,
  doctor_reply TEXT,                        -- 医生答复原文（遗传咨询）
  ord INTEGER NOT NULL DEFAULT 0,
  revision INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE family_member (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  relation TEXT NOT NULL,                   -- 母亲/妹妹/女儿…
  disclose_state TEXT CHECK (disclose_state IN ('not_told','told','declined_to_know','unknown')),
  testing_state TEXT CHECK (testing_state IN ('not_tested','testing','tested','unknown')),
  note TEXT,
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('shared','private')),
  third_party_consent INTEGER NOT NULL DEFAULT 0,   -- 显式授权位（默认未授权）
  ord INTEGER NOT NULL DEFAULT 0
);
-- K6：放疗后私密（默认 private）
CREATE TABLE rt_priv (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  record_date TEXT NOT NULL,
  symptom_text TEXT,                        -- 狭窄/干燥/性交痛（患者语言）
  care_text TEXT,                           -- 医嘱/处理原文
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('shared','private')),
  ord INTEGER NOT NULL DEFAULT 0
);
-- 双主体（默认 private）
CREATE TABLE viewpoint (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  author_role TEXT NOT NULL CHECK (author_role IN ('PATIENT','CAREGIVER')),
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('shared','private')),
  topic TEXT CHECK (topic IN ('BODY_IMAGE','FERTILITY_ANXIETY','MOOD','FAMILY','DECISION_ACP','OTHER')),
  content TEXT NOT NULL,
  record_date TEXT NOT NULL,
  ord INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE decision_checklist (
  id INTEGER PRIMARY KEY,
  profile_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','discussed','filed')),
  note TEXT,
  ord INTEGER NOT NULL DEFAULT 0
);

-- ═══ 导入件（3，18 号 v2 语义）═══
CREATE TABLE import_file (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES document(id),
  byte_size INTEGER NOT NULL,
  mime TEXT,
  in_use INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE parse_job (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES document(id),
  requested_at TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('running','succeeded','failed')),
  error_code TEXT,
  error_message TEXT
);
CREATE TABLE candidate (
  id INTEGER PRIMARY KEY,
  parse_job_id INTEGER NOT NULL REFERENCES parse_job(id),
  field_name TEXT NOT NULL,
  value_text TEXT,
  value_num REAL,
  unit TEXT,
  confirmed INTEGER NOT NULL DEFAULT 0,
  confirmed_at TEXT,
  target_table TEXT,
  target_id INTEGER
);
