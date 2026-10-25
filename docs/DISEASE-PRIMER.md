# 疾病概要 · 子宫内膜癌

> 本项目实例文件，由 `xyb-workbench-starter` 的 `templates/DISEASE-PRIMER.md` 复制而来。
> 规范：starter `docs/36-DISEASE-PRIMER.md`。四段固定、顺序不变，缺段不合格。

- 项目 / 品牌：小膜宝 EndoPal
- 病种：子宫内膜癌（Endometrial Cancer）
- 最后更新：2026-10-25
- 数据文件：`prototypes/v0.2/primer-data.js`（`window.DISEASE_PRIMER`）
- README 对应段：`## 疾病概要`
- 实现：`prototypes/v0.2/primer.js` + `primer.css`（来自 starter `assets/patterns/`，逻辑未改）
- 探针：`NODE_OPTIONS= node scripts/probe-disease-primer.mjs --port 8132 --url http://127.0.0.1:8132/prototypes/v0.2/index.html` → 9/9

## 0 原件状态（本项目的前提）

| 文件 | 状态 |
|---|---|
| FIGO · Cancer of the corpus uteri: A 2025 update | **已取得**：开放获取全文，`https://pmc.ncbi.nlm.nih.gov/articles/PMC12411821/`（记录于 `research-notes/medical-constraints.md` §1.4 S02） |
| FIGO staging of endometrial cancer: 2023 | **未取得原件**：全文付费，只有摘要与公开综述 |
| NCCN Guidelines for Patients: Uterine Cancer, 2026 | **未取得原件**：只核对到患者版目录与条目名 |
| ESGO-ESTRO-ESP guidelines: update 2025 | **未取得原件**：仅摘要，全文付费 |
| 国家卫生健康委 · 子宫内膜癌诊疗指南（2022年版） | **未取得原件**：官网返回 HTTP 412，正文用转载件核对 |
| 中华医学会妇科肿瘤学分会 · 中国妇科肿瘤临床实践指南 2025——子宫内膜癌 | **未取得原件**：登录墙，只有概述 |
| WHO 2020 形态学分类 | **未取得原件**：据 FIGO 2025 更新转引 |

这一条与 `docs/GUIDELINE-BRIDGE.md` 的取舍一致：**没看到原件，不许假装看到了**。除 FIGO 2025 更新外，所有文件的页码一律写「页码待核」，不引用具体条文，只写「存在、大致讲什么」。

## 1 定义（`definition`）

子宫内膜癌是发生在子宫内膜上皮的恶性肿瘤。2023 年起，期别不只看「长到哪」，还看组织学类型、分级、淋巴血管间隙浸润（LVSI）与分子分型。

- 病理类型按 WHO 2020 形态学分类命名：子宫内膜样癌、浆液性癌、透明细胞癌、癌肉瘤、未分化/去分化癌、混合性癌、中肾样癌、胃肠型黏液癌、神经内分泌癌等。「I 型 / II 型」是历史概念，不是今天病理报告的格式。
- 组织学分级 G1 / G2 / G3 是显微镜下的分级，不是分期：对子宫内膜样癌按实性生长区比例（≤5% / 6–50% / >50%）。
- 分期用 FIGO 2023，期别后可加 m 与分子型，例如 IAmPOLEmut、IICmp53abn；分子分型是肿瘤的体细胞特征，不是遗传检测。
- 本台只抄病理与分子报告的原文，不把「期别后面多了个 m」解释成严重或好转，也不自算期别。

**来源**：FIGO · Cancer of the corpus uteri: A 2025 update · 2025-09 · 原件已取得（开放获取全文，PMC12411821）｜ FIGO · FIGO staging of endometrial cancer: 2023 · 2023-08 · 未取得原件，据二次来源 · 页码待核 ｜ WHO · WHO 2020 形态学分类 · 2020 · 未取得原件，据二次来源 · 页码待核

## 2 医学资料规范和指南情况（`evidence`）

| 机构 | 文件 | 版本 / 年份 | 原件 | 本台的用途 |
|---|---|---|---|---|
| FIGO | Cancer of the corpus uteri: A 2025 update | 2025-09（开放获取全文） | 已取得（PMC 开放全文） | 症状评估、分子分型与分期规则、治疗语境、随访 |
| FIGO | FIGO staging of endometrial cancer: 2023 | 2023-08 | 未取得原件（全文付费，摘要与公开综述核对） | FIGO 2023 期别结构与 m 标签 |
| NCCN | NCCN Guidelines for Patients: Uterine Cancer, 2026（基于 Uterine Neoplasms V2.2026） | 2025-11-14（患者版） | 未取得原件 | 手术范围、辅助治疗选项、随访频率 |
| ESGO / ESTRO / ESP | ESGO-ESTRO-ESP guidelines: update 2025 | 2025-08 | 未取得原件（仅摘要，全文付费） | 与 FIGO 2023 分期的衔接 |
| 国家卫生健康委 | 子宫内膜癌诊疗指南（2022年版） | 2022-04 | 未取得原件（官网 412，正文用转载件核对） | 国内口径；采用 FIGO 2009 分期 |
| 中华医学会妇科肿瘤学分会 | 中国妇科肿瘤临床实践指南 2025——子宫内膜癌 | 2025-09-20 | 未取得原件（登录墙，仅概述） | 国内实践对照 |
| WHO | WHO 2020 形态学分类 | 2020 | 未取得原件（据 FIGO 2025 转引） | 组织学类型命名口径 |

- 一台一表，不合并；未取得原件的必须标出来。
- 两套分期体系（FIGO 2023 与 2022 版国家指南采用的 FIGO 2009）并存时两行并列，本表不做换算。

**来源**：见上表逐行。

## 3 目前治疗全景概要（`landscape`）

按病期 / 线序分组，只列指南列举过的手段类别，不排序、不比优劣、不含剂量与疗程。

### 3.1 局限在子宫（以手术为主）

- 手术：全子宫 + 双侧输卵管卵巢切除（TH+BSO）是常见范围；侵犯宫颈间质时可能需根治性子宫切除；局限在子宫的子宫内膜样癌，微创手术是常见路径。术式取舍属医生判断。
- 淋巴结评估：前哨淋巴结活检（SLN）与淋巴结清扫两条路径都在指南里；影像/术中判断淋巴结阴性时，SLN 是可接受的做法。
- 年轻、病变局限、低危者可与医生讨论保留卵巢；不是所有患者都适合。
- 术后辅助治疗：按分期、组织学、分级、LVSI、切缘决定观察、阴道近距离放疗（VBT）、体外放疗（EBRT）或化疗。

### 3.2 局部晚期 / 晚期 / 复发

- 系统治疗：化疗（常用卡铂 + 紫杉醇）与激素治疗按分期与病理类型列出；MMRd 与免疫检查点抑制剂联合在指南里有条目，p53abn 与化疗语境相关。
- 放疗：EBRT 与 VBT 可单独或与系统治疗联合使用。
- 特殊病理类型：浆液性癌、透明细胞癌、癌肉瘤按高风险类型处理；HER2 检测用于晚期/转移性浆液性癌或癌肉瘤。
- 临床研究：指南把「参加登记良好的临床试验」列为一项正式选项，不是最后手段。

### 3.3 需要单列的情形

- 保育治疗（年轻未育）：前提是 G1 子宫内膜样癌、MRI 判断无肌层浸润；方案包括左炔诺孕酮宫内节育器（LNG-IUD）与口服孕激素。这是延迟手术、争取生育时间，不是治愈。
- Lynch 综合征相关：所有子宫内膜癌建议做 MMR IHC 初筛；确认 Lynch 后涉及降风险手术与家系检测的讨论，属遗传咨询与医生判断。

### 3.4 贯穿全程的两件事

- 随访节奏：治疗后前 2–3 年每 3–6 个月、第 4–5 年每 6–12 个月、第 5 年后每年（NCCN 患者版 2026；国内 2022 版表述一致）。无症状患者不做常规影像；阴道细胞学不推荐常规做。
- 放疗后性健康：阴道干燥、性交痛、阴道狭窄是常见副作用；阴道扩张器、保湿剂、润滑剂、阴道雌激素都有指南/共识语境，具体用法由医生定。本台默认私密、可选填、可跳过。

**固定出口（原话照抄）**：

> 以上是文献与指南里列出的手段，按病期与线序排列，不代表任何一项适合你。选哪一个，这一句需要问你的医生。

**来源**：FIGO · Cancer of the corpus uteri: A 2025 update · 2025-09 · 原件已取得（PMC12411821）｜ NCCN · NCCN Guidelines for Patients: Uterine Cancer, 2026 · 2025-11-14 · 未取得原件 · 页码待核 ｜ 国家卫生健康委 · 子宫内膜癌诊疗指南（2022年版）· 2022-04 · 未取得原件 · 页码待核

## 4 发展趋势（`trend`）

只写已发生的事实，每条带日期或版本号。

1. 2023-08：FIGO 发布子宫内膜癌 2023 分期，把分子分型写入期别（如 IAmPOLEmut、IICmp53abn）。
2. 2025-08：ESGO / ESTRO / ESP 发布 2025 更新，纳入 FIGO 2023 分期（本项目仅取得摘要）。
3. 2025-09：FIGO 发布 Cancer of the corpus uteri: A 2025 update（开放获取全文）。
4. 2026-02-06 / 2026-02-07：据新华网与美通社报道，NMPA 批准帕博利珠单抗联合卡铂和紫杉醇用于 dMMR 原发晚期或复发性子宫内膜癌一线、随后单药维持；NMPA 官网送达信息页返回 HTTP 412，批件号未核实。
5. 截至 2026-10-25：本项目采集到子宫内膜癌 2026 年登记 chinadrugtrials（CDE）49 条、ClinicalTrials.gov 62 条；chictr_online / ictrp 六个仓库状态为 FAILED（未查过，不计覆盖），阶段分布本台尚未统计。

**未写**：WHO 分类体系更新（第 5 版）与指南结构变化两类，本项目没有核实到对应版本/章节，整类不写；不拿印象补。

**来源**：FIGO · FIGO staging of endometrial cancer: 2023 · 2023-08 · 未取得原件 · 页码待核 ｜ ESGO / ESTRO / ESP · ESGO-ESTRO-ESP guidelines: update 2025 · 2025-08 · 未取得原件（仅摘要）· 页码待核 ｜ 新华网 / 美通社 · 帕博利珠单抗在华获批原发晚期或复发性子宫内膜癌适应症 · 2026-02-06 / 2026-02-07 · 未取得原件 · 页码待核（NMPA 官网 412，批件号未核实）｜ chinadrugtrials（CDE）/ ClinicalTrials.gov · 2026 年子宫内膜癌试验登记采集 · 快照 2026-10-25 · 一手登记数据，本项目自采

## 5 落地清单

- [x] `prototypes/v0.2/primer.css`（starter 原样复制）
- [x] `prototypes/v0.2/primer.js`（starter 原样复制，逻辑未改）
- [x] `prototypes/v0.2/primer-data.js`（四段数据）
- [x] `index.html` 三处引用：`primer.css`、`primer-data.js`、`primer.js`
- [x] 顶栏「?」由模块自动插入 `.top-actions`（未手写按钮）
- [x] `index.html` 末尾加滚动恢复 shim（见 §7 第 2 条）
- [x] README 的 `## 疾病概要` 四段正文（位置：项目简介之后、`## 关键功能` 之前）
- [x] `NODE_OPTIONS= node scripts/probe-disease-primer.mjs --port 8132 --url …/prototypes/v0.2/index.html` → 9/9 PASS
- [x] `node /Users/qinxiaoqiang/Downloads/xyb-workbench-starter/scripts/check-conformance.mjs .` → primer/* 四条 ok

## 6 验收（P1–P8）

| 编号 | 判据 | 结果 |
|---|---|---|
| P1 | 顶栏有可点「?」，aria-label 说明四段 | ✅ text="?" label="疾病概要：定义、医学资料与指南情况、治疗全景、发展趋势" |
| P2 | 整页面板，四段顺序 定义 → 指南 → 治疗全景 → 趋势 | ✅ definition › evidence › landscape › trend |
| P3 | 面板宽高 ≥ 视口 90% | ✅ 1249×829 / 视口 1280×860 |
| P4 | 打开压一条 history，`history.back()` 收起 | ✅ history.length=3；返回后 open=false |
| P5 | 「返回」「关闭」两个独立入口 | ✅ back=true close=true same=false |
| P6 | 关闭后焦点回触发按钮、滚动位置不变 | ✅ focusOnTrigger=true scrollY=226→226 |
| P7 | Esc 只退一层 | ✅ open=false，URL 仍在 /prototypes/v0.2/index.html |
| P8 | 四段齐全、每段有来源、趋势段无禁止词 | ✅ |

## 7 本项目教训

- **两套分期不能换算**：国内 2022 版国家指南还在用 FIGO 2009，而 FIGO 2023 已把分子分型写进期别。初稿想写「国内指南也采用 FIGO 2023」，查了转载件才发现不是，改成两行并列、注明「不做换算」——说错版本比不提更糟。
- **P6 不是 primer 的问题**：本页 `app.js` 在 `hashchange` 里重渲染 `#main`，`render()` 末尾有 `scrollTo(0, 0)`，而且这次重渲染比 primer 的 `applyClose()` 还原滚动更晚，所以关掉概要后页面会回顶。调试时先用日志确认「打开时 226 正常、按 Esc 后立刻变 0」，再确认是 `hashchange → render()` 干的；最后在 `index.html` 末尾用 `MutationObserver` 监听 `#main` 重渲染、补回点击「?」时的滚动位置。**没有改探针，也没有改 primer.js / app.js 的逻辑**。
- **一句「通常优先」也是判断**：治疗全景初稿写「微创手术通常优先」，这是替医生排序，改成「微创手术是常见路径」。同一段里 NMPA 批件只写到「据新华网与美通社报道」，批件号留「未核实」，没有为了好看补一个编号。
