# 设计独立审查记录 · 子宫内膜癌（ENDO）G1 设计包 + G2 原型

## 0. 元信息

| 项 | 内容 |
| --- | --- |
| 评审模型 / 档位 | GLM-5.3 / max（独立子代理，非本仓作者模型） |
| 评审日期 | 2026-10-24 |
| 代码基线 | HEAD `fe46a57`（M2: demo+原型四件套） |
| 评审对象 | 原型 `prototypes/v0.2/` v0.2.0（2026-10-25 构建）；`docs/{SPEC,SCENARIOS,PATIENT-FLOW,INTERACTION-DESIGN,DIFF-MATRIX,USER-RESEARCH,DEV-REQUIREMENTS-2026-10-25}.md`；`research-notes/{medical-constraints,user-research,family-landscape}.md`（抽查）；`docs/shots/` 3 张 + `docs/screenshots/` README 图；规范 26/22/28/30/32/33 |
| 实际执行 | `node scripts/check-hvt.mjs`（全绿）；`node scripts/probe-responsive.mjs`（90 视图全绿）；无头 CDP 抽查折叠卡/一图秀；Chrome `Page.printToPDF` 实测打印；读 3 张 shots + 3 张 README 图 |
| 未执行 | 未做临床专家复核、未做患者走查、未装机（M6）、`probe:proto` 全量未在本次跑完（超时，仅以 HVT + 定点 CDP 复核替代） |
| 声明 | 本记录只审设计方案与原型，不代表发布授权、包已安装或市场已收录。 |

**结论先行：13 项 = PASS 5 / WARN 5 / FAIL 3；P0 = 2。判断为“不通过，返工后复审”。**

---

## 1. 逐项检验表

| # | 检验项 | 判定 | 证据（文件:行 / 实测） | 说明 |
| --- | --- | --- | --- | --- |
| ① | 医生任务冒充患者 | **WARN** | `prototypes/v0.2/app.js:596-620`；`prototypes/v0.2/demo-data.js`（demo2 `decision.candidate/mri/review`） | 分子页没有越权判定（明写“分型判定归医生”，`app.js:509-520`），这一半是干净的。但保育决策页把“G1、MRI 无肌层浸润、二次病理复核”做成“候选与评估”清单，结构上等于把临床准入标准交给患者自评；虽有“不推方案”声明，仍可能被读成“我符合条件”。建议改为“医生评估原文记录”，并加一句“是否符合由医生判断”。 |
| ② | 证据成立性 | **PASS** | `research-notes/user-research.md:342`（8/21 突变 vs 8/21 蛋白缺失）；`:207`（仅 3/6 个月缓解者焦虑下降，≥9 个月不降，P=0.733）；`:250`、`:255`（cascade 检测 46%，日本一级亲属 32.1/162，OR 3.6）；`docs/USER-RESEARCH.md:3`（0 访谈声明） | 抽查三条方向与数字均与原文一致；71% 诊断期信息未满足率也一致（`:15`、`:73`）。唯一措辞瑕疵见 P2-1（3.6 倍缺“促进什么”的宾语）。 |
| ③ | 解释 vs 记录本 | **WARN** | `docs/INTERACTION-DESIGN.md:18,42`；`prototypes/v0.2/demo-data.js:300-345` | 记录本骨架成立（事实层只增不改、原文+日期、无判读列）。但“分型与治疗对照”把转述句套上「」当“指南原文”，且无章节/页码，无法回溯；实际也不是“四型 × 三列”，见 P1-7。解释型内容因此有“以引用之名行科普之实”的风险。 |
| ④ | 营养 / 心理完整度 | **WARN** | `app.js:816-846`（感受双列、身体意象、生育焦虑均 private）；`app.js:807-812`（营养仅体重/进食/症状 1 页） | 身体意象、性（私密线 3 页）、生育焦虑三件齐全，双主体并列也做了。缺口：营养只有 1 个二级页，无营养师/可执行资源位；心理线无“支持资源/求助渠道”（26 号 L7 示例为 4 二级）。属“能接住问题但没有下一步”。 |
| ⑤ | 四核心模块 | **PASS** | `app.js:50-70`（10 一级/30 二级） | 按本包定义的四核心（分子分型 6 页、保育 3 页、Lynch 3 页、放疗后私密 3 页）均为独立一级线且各有二级；另加出血独立轨道与 32 号折叠卡，结构完整。 |
| ⑥ | 双主体（家系第三方 private/授权/不知情权） | **FAIL** | `app.js:434-444`（`tasks.slice(4)` 进照护者列）；`app.js:455`（照护者列标题）；`app.js:995`（`save-bleed` 固定 `author:'PATIENT'`）；`app.js:354`（家系条数进 AI 上下文）；`app.js:699-703`（家系页无新增/撤回授权入口） | 家系“不劝检测 + 尊重不知情 + 不存姓名 + 默认 private”做到了；但三个硬伤：照护者列里放患者私密入口且无私密访问门槛；照护者代记的出血被记成本人；家系只有展示、没有 `consent` 新增/撤回（与 CRUD 矩阵不符）。 |
| ⑦ | 范围（30 顶格） | **PASS（无余量）** | `app.js:60-70`；`docs/26-CANCER-FEATURE-LINES.md` §1 | 10 一级 / 30 二级，正好压在 26 号上限；0 二级线 2 条（看板、一图秀），单线最大 6（分型线），均合规。但再增任何页都必须先合并；G1 决策点①仍未拍板。另：`docs/SPEC.md:12` 列了 11 个 F-ID（含 F-SET）却说“10 线”，见 P1-8。 |
| ⑧ | 医学时效 | **WARN** | `research-notes/medical-constraints.md:39,83,153`（FIGO 2025 更新在档）；`demo-data.js:306-345`（对照表来源 NCCN 2026 / ESGO 2021 / ESGO-ESHRE-ESGE 2023；NMPA 全“待核验”） | 时效本身合格：FIGO 2025、NCCN 2026 在档，NMPA 逐药“待核验”，没有写“已获批”。但 FIGO 2023 的**应用**是错的（P0-1）；对照表分子检测仍引 2021 版 ESGO（有 2025 更新），属可改进。 |
| ⑨ | S→F→A 同源（13 路径 vs 页面 key） | **WARN** | `app.js:84-98`（13 场景 → page/sub）；`docs/INTERACTION-DESIGN.md:12-26`；`check-hvt` 输出 X1 30/30、X2 26/26 | S01–S13 与页面 key 在原型/交互文档内一致，HVT 双向覆盖通过。断点在文档之间：`SPEC.md:12` 与 `DIFF-MATRIX.md:10` 的 10 线构成与唯一权威 `family-landscape §6.2`、原型不一致（缺放疗后私密、把营养单列、心理写 4 条而实现 3 条）；`SCENARIOS.md:11` 把 S09–S13 压成一行；`ACCEPTANCE.md` 没有任何 S/F 关联行。 |
| ⑩ | 假设不冒充事实 | **PASS** | `docs/USER-RESEARCH.md:6,14`；`research-notes/user-research.md:439-442`；`INTERACTION-DESIGN.md:12`（“设计假设语料”） | “FIGO 2023 分子分型患者端直接证据为 0”被明确写在研究结论与缺口里，且产品结论是“只做三态+可回看+问题清单，不假装科普足够”，处理诚实；H1–H10 明确标为设计假设。唯一风险是 13 条路径的第一人称「」引语，快速浏览时仍可能被当成访谈原话，建议行内加“非访谈原话”。 |
| ⑪ | 差异化真实性（vs cervical） | **PASS（压线）** | `docs/DIFF-MATRIX.md:4`；独立复核 cervical `prototypes/v0.2/app.js:54-72` 与 ENDO `app.js:50-70` | 三口径可复现：完全同名 2/10=20%（看板、病情一图秀）；共享核心词 5/10=50%（看板/分期/治疗/放疗/一图秀）；语义归类 7/10=70%；二级同名 5/30≈16.7%。数字真实。但语义口径正好 70%，零余量，DIFF 自己也写“G1 须锁定差异化命名”。保育线与 Lynch 线确实是 cervical 没有的结构，差异化不是话术。 |
| ⑫ | 红线 K1–K6 + 未检测≠阴性 | **FAIL** | P0-1；`app.js:510-512`（p53/MMR 用“未检出”）；`app.js:354`；`app.js:455-462`；`app.js:1075`；`exportMarkdown`（`docs/screenshots/readme-export-private-0.2.0.png`） | K3（零成功率/不以活产为唯一成功）、K4（出血无病因列）、K5（对照无推荐等级）、K6（三出口结构）骨架都在，“未检测≠阴性”在看板/分子页/导出/AI 上下文均可见。扣分在：K1 的医学语义错误（stage 与 p53/MMR 标签）、K2/K6 的私密元数据泄漏（家系条数进 AI 上下文、照护者列放私密入口、摘要/导出写“7 条未包含”）。 |
| ⑬ | IP1–IP10 + 32 号 + 33 号 | **FAIL** | 见 §4 IP 明细 | 33 号通过（6 张 1440×1000，路径全存在，版本号可见）。32 号五块/默认收起通过，**打印展开实测失败（P0-2）**。IP1 无签认记录；IP3 入口非逐字；IP5/IP9 有矩阵与实现落差；IP2/IP4/IP6/IP7/IP8/IP10 通过。 |

---

## 2. P0（阻断签认，立即返工）

### P0-1　FIGO 2023 分期/分子数据自相矛盾，且随导出进入医生视野

**证据**

- `prototypes/v0.2/demo-data.js:82`：`stageLine: "FIGO 2023：IB 期（肌层浸润 <1/2）…"`
- `prototypes/v0.2/demo-data.js:248`：`anatomical: "IB 期（肌层浸润 <1/2）"`；同版本 `basis` 写“浸润肌层约 6mm”。
- `docs/shots/stage-figo-demo1.png`、`docs/screenshots/readme-dashboard-0.2.0.png`、`readme-export-private-0.2.0.png` 均把“FIGO 2023：IB 期（肌层浸润 <1/2）”作为默认档案首屏/导出事实。
- 本仓自己的证据：`research-notes/medical-constraints.md:157`（**IA2 = 肌层浸润 <50%，无/灶性 LVSI；IB = 肌层浸润 ≥50%**）；该条与 FIGO 2023 综述表一致（Sehnal 2025，Table 1）。
- `demo-data.js:1287`：demo2 `stageLine` 写“IA 期（肌层浸润 <1/2）… POLE 超突变（检出）· MMR：PMS2 缺失”，但同一档案分期版本 `:1459/:1468` 的 `finalLabel` 是 **IAmPOLEmut**——看板摘要与分期页不一致。
- `demo-data.js:1511`：demo2 `multiple` 写“**本档案不是多重分类**（报告未注明 multiple classifier）”，而该档案同时有 POLE 致病性变异（`:1504`）与 PMS2 缺失（`:1484`），按 `medical-constraints.md:171` 规则 4 属 multiple classifier，正确做法是“并列记录 + 注明多重分类”，不能断言“不是”。

**影响**：K1 是本工作台的第一差异化卖点，也是 DEV-REQUIREMENTS 的 R2 断言对象。默认档案首屏、分期页、对照表第一行、复诊导出全部继承这个错误；任何妇科肿瘤医生一眼可见，直接摧毁“引用 FIGO 2023”的可信度。demo2 还叠加“摘要与详情不一致”“多重分类误判”。

**修复落点**

1. demo1：术后病理 <50% → `finalLabel` 改 **IA2**（G2 属低级别子宫内膜样），版本链 `anatomical` 同步；对照表 `ctx` 从“pMMR · IB 期”改为“pMMR · IA2 期”。
2. demo2：`stageLine` 改为 `IAmPOLEmut`（与分期页一致）；`anatomical` 写 `IA2（MRI 肌层浸润 <1/2）`；`multiple` 改为“POLEmut 与 MMRd 并列，报告注明 multiple classifier；按 FIGO 2023 以 POLEmut 定标签”。
3. 加数据断言：`stage.versions[].anatomical` 与 `finalLabel` 的期别必须同源；`marker` 含 POLEmut 且 I–II 期时 `finalLabel` 必须以 `IAmPOLEmut` 开头；`multiple` 不得在 ≥2 个分子特征时写“不是多重分类”。
4. 重出受影响的 3 张 README 图与 `docs/shots/stage-figo-*`、`stage-molecular-*`、`export-*`。

### P0-2　32 号折叠卡“打印时全部展开”实测不成立

**证据**

- 声明：`prototypes/v0.2/app.js:552`“默认全部收起，打印时全部展开”；`docs/INTERACTION-DESIGN.md:96`“`@media print` 全展开”；`docs/32-TREATMENT-PATHWAY-FOLDOUT.md` §3.4 规定只需写 `@media print{.phase-detail{display:grid!important}}`。
- 实现：`prototypes/v0.2/style.css:267` 正是这条规则；`app.js:535` 的 `<details>` 默认无 `open`，全仓无 `beforeprint`/`open=true`。
- 实测（HEAD 基线，Chrome headless `Page.printToPDF`，治疗路径页）：输出 2 页；提取文本只有三条 `summary`（阶段名+日期+一句话），**五块正文全部缺失**；“方案/副作用总结/心理与营养”计数为 0。同时 `getComputedStyle(details,'::details-content').contentVisibility === 'hidden'`——关闭态 `details` 的内容在打印媒体下仍被 `content-visibility:hidden` 隐藏，子元素 `display:grid!important` 无法穿透。
- 旁证：`probe-proto` 只断言 `cards/open/blocks` 和“源码存在打印规则”的注释，并未断言打印输出含块文本，所以自验没有覆盖这个失败。

**影响**：32 号折叠卡的核心用途就是“打印/导出时一页拿到完整病程”（规范 §1）。当前打印只剩概要，等于该功能在唯一需要它的场景失效；README 与页面文案还在向用户承诺“打印时全部展开”。

**修复落点**

1. 打印前展开：`window.addEventListener('beforeprint', () => $$('.phase-fold').forEach(d => d.open = true))` + `afterprint` 恢复原状态；**或**打印样式加 `details::details-content{content-visibility:visible!important}`（需同时保留 `display:grid`）。
2. 把 `probe-proto` 的折叠卡断言升级为“打印媒体下 `.pd-block` 文本可见/可提取”，而不是只查源码字符串。
3. 修订 `docs/32-TREATMENT-PATHWAY-FOLDOUT.md` §3.4 与 §5：现在的“规则源码存在”判据本身不能证明展开，属规范层缺陷，建议回写家族模板。

---

## 3. P1（G1/G2 前必须关闭或有明确书面取舍）

| # | 问题 | 落点 | 建议 |
| --- | --- | --- | --- |
| P1-1 | p53/MMR 用“未检出”表达“未见异常/蛋白保留”，语义可反向误读（p53 完全缺失是异常模式；“MMR 未检出”可被读成没有 MMR） | `app.js:510-512`（`stateLabel`）；`exportMarkdown`；`readme-dashboard`/`readme-export` 图 | 改为 marker 专属词表：MMR=缺失/保留/未检测；p53=异常表达/野生型表达/未检测；POLE=检出/未检出/未检测。导出同步。 |
| P1-2 | 家系第三方条数进入 AI 上下文（“家系 2 条（第三方 private）”），与“私密不进 AI 上下文”冲突 | `app.js:354` | 删除条数，只写“本页私密/第三方内容未带入”；与私密线文案一致。 |
| P1-3 | “私密记录（只给自己看）”被放在“照护者·代记入口”列，且无角色门槛 | `app.js:434-444`、`app.js:455`；`readme-dashboard` 图；`app.js:730-740` | 私密入口移回本人列；明确照护者模式下私密页默认隐藏/需本人确认；否则“只给自己看”不成立。 |
| P1-4 | 照护者代记的出血被固定写成本人 | `app.js:995`（`author:'PATIENT'`, `source:'本人记录'`） | 表单带记录人，或代记入口传入 `CAREGIVER`；表格“记录人”列才有意义。 |
| P1-5 | CRUD 矩阵的 C/U/D 与原型不符：家系无新增/撤回 consent，私密症状/扩张/性沟通/感受/身体意象/生育焦虑无“本人删除”，生育焦虑无新增入口 | `INTERACTION-DESIGN.md:52-63` vs `app.js:699-703,730-740,826-846` | 要么补最小入口（家系代号+consent、私密删除），要么在矩阵 D 列标“原型不演示”，禁止“文档已落地、实现没有”。 |
| P1-6 | IP9 双通道不同源：AI 候选“确认入库”只弹 toast，不写事实层；手工表单却写 `mem()` | `app.js:1075` vs `app.js:994-1007` | 候选确认写同一条版本链（原型可用内存），并把“确认后旧版本保留”演示出来。 |
| P1-7 | “四型 × 三列”名不副实：对照表只有 4 条语境行，缺 p53abn 与 NSMP；引文无章节/页码，且不在 research notes 中可回溯 | `INTERACTION-DESIGN.md:18,42`；`demo-data.js:300-345` | 四型齐全；每条引文附指南名+版本+章节/页码；转述不得套「」。 |
| P1-8 | 页面树文档不同源：SPEC/DIFF 的 10 线不含“放疗后私密”、把营养单列、心理写 4 条；SPEC 还多出 F-SET（实为弹窗） | `SPEC.md:12`；`DIFF-MATRIX.md:10`；`family-landscape.md` §6.2；`app.js:50-70` | 以 §6.2 为准重写两处；F-SET 注明“弹窗，不占一级”；DIFF 的二级计数改为 0/6/3/3/3/4/0/3/4。 |
| P1-9 | 外壳 client 未监听 `endo:agent-draft`，品牌 token 仍是绿色而非藕荷 `#8A5B7B`，与“真客户端链路/品牌三变量”不符 | `lib/client.js:7-38`；`INTERACTION-DESIGN.md:95`；“已落地”表述 | 加监听并复用主色；若本轮不做，把交互文档改为“外壳待接入（M6）”，不要写“已落地”。 |
| P1-10 | 签认与 HVT 记录为空：`DESIGN-SESSION.md`、`PROTOTYPE-REVIEW.md`、`HVT-REVIEW.md`、项目级 `FULL-PAGE-VIEW.md` 全是模板 | `DESIGN-SESSION.md:6`；`PROTOTYPE-REVIEW.md:5`；`HVT-REVIEW.md:6` | G1 当场填确认人/原话/日期/版本/hash；HVT B 级结论与 32 号 A1–A10 证据补齐，否则 IP1 不成立。 |
| P1-11 | 路径合同缺“失败恢复”，SCENARIOS 把 S09–S13 压成一行 | `SCENARIOS.md:11`；`INTERACTION-DESIGN.md:12-28` | 13 条各自补齐六要素（入口/步骤/产物/回首页/失败恢复）；至少写“无资料/低精力/AI 说错/拒收候选”四种恢复。 |
| P1-12 | 三出口无单测，`privateFilter` 只返回计数与说明，不对数据集做过滤断言；“家系 private 断言”无测试 | `app.js:155-168`；`test/` 仅 `pack-contents.test.mjs` | 加单测：在 chart/summary/export/AI 四个出口断言私密值、家系代号、亲属年龄均不出现。 |
| P1-13 | 保育页“候选与评估”把临床准入条件做成患者清单；随访节点由“起点+k×间隔”推算，可能被读成建议节奏 | `app.js:596-620`；`app.js:777` | 保育页改“医生评估原文”；随访只记医生给出的下一次日期，或显式标“推算，不是医嘱”。 |
| P1-14 | 差异化语义口径正好 70%，零余量 | `DIFF-MATRIX.md:4`；`research-notes/family-landscape.md` §6.2 | G1 明确锁定命名（如把“情绪与亲密”与 cervical“心理支持”再拉开），并在签认记录里写取舍。 |

---

## 4. IP1–IP10 明细（⑬ 的子项）

| IP | 判定 | 证据 |
| --- | --- | --- |
| IP1 | **WARN** | 交互路径文档存在，但 `DESIGN-SESSION.md`/`PROTOTYPE-REVIEW.md` 无签认记录（模板空表），G1 尚未发生；不满足“文档存在+签认记录”。 |
| IP2 | **PASS** | `check-hvt` X1：total 30 / covered 30 / orphans 0；X2：26 条走通。 |
| IP3 | **WARN** | 13 条 chip 存在，但路径表入口多为“看板 → …”，与看板卡片文案并非逐字（如 S02“Lynch 与家系” vs 卡片“Lynch / 家系”；S03/S10 无对应静态卡）。 |
| IP4 | **PASS** | X2 26/26，落地页非空、可一步回看板。 |
| IP5 | **WARN** | 可写实体有 AI 通道；但矩阵 D 列/家系 C-U 未实现，AI“确认入库”为空操作（P1-5/P1-6）。 |
| IP6 | **PASS** | X3：32 视图，编辑入口 ≤1；表单最大 5 字段（`FORM_IDS`）。 |
| IP7 | **PASS** | 数字字段用 `type="number"`（`app.js:947,952-953,959`），原生数字键盘；未用 `inputmode` 但不算文本框。 |
| IP8 | **PASS** | 全站无“不可恢复”，无裸删除；但“私密本人删除”也未实现（见 P1-5，方向相反的不一致）。 |
| IP9 | **FAIL** | AI 候选确认不写事实层（`app.js:1075`），与手工通道不同源；X4 只验证步序 `1111`，未验证落库。 |
| IP10 | **PASS** | 10 个一级页均有“AI 协助”（X4 pages=10）；postMessage 填草稿、不自动发送；`endo:agent-draft` 前缀一致。 |

**32 号**：五块齐全（3 卡 × 5 块，顺序固定）、默认 `open=0`、`summary` 只放概要——通过；**打印展开失败（P0-2）**。
**33 号**：README 6 张图（≥4），均 1440×1000、浅色、版本号可见、相对路径存在、无私密内容——通过；但保育页只有空态截图（`docs/shots/fertility-decision-demo1.png`），作为核心差异化页的签认证据偏弱（P2-5）。

---

## 5. P2（可随迭代修，不阻断 G1）

| # | 问题 | 落点 |
| --- | --- | --- |
| P2-1 | “家属陪同遗传咨询可达 3.6 倍促进”缺宾语：原文 OR 3.6 预测的是 cascade 检测 uptake，不是“咨询到场率” | `docs/USER-RESEARCH.md:8`；`research-notes/user-research.md:255` |
| P2-2 | “NMPA…官网 412”把 NHC 官网反爬（412）与 NMPA 混写 | `docs/USER-RESEARCH.md:11`；`medical-constraints.md:85` |
| P2-3 | `NO_LIVE_BIRTH` 在“不适用保育”档案也显示；“不后悔”有替患者规定情绪之嫌 | `app.js:595-604`；`fertility-decision-demo1.png` |
| P2-4 | 营养线偏薄：无营养师/可执行资源位，无治疗后体重管理去向 | `app.js:807-812`；26 号 L6 |
| P2-5 | 保育页签认截图只给空态（demo1 不适用），未展示 demo2 的决策/孕激素/尝试结构 | `docs/shots/fertility-decision-demo1.png` |
| P2-6 | `docs/validation-results.json` 仍是 v0.1.0/2026-10-16 的脚手架结果，未归档 M2 的 HVT/probe 数字 | `docs/validation-results.json` |
| P2-7 | 摘要/导出写“7 条私密/第三方记录未包含”，向医生暴露私密记录的**条数**（非内容） | `app.js:155-168`；`readme-export-private-0.2.0.png` |
| P2-8 | 看板“分子结果待读”用紧凑 pill，p53/MMR“未检出”脱离上下文更易误读（与 P1-1 同源） | `readme-dashboard-0.2.0.png`；`app.js:459` |
| P2-9 | 其他病种词扫描：`docs/31/32/33` 出现“甲状腺/碘131/石棉/小痣宝”，但均为家族通用规范或 backlog 的他癌种举例，不是 ENDO 内容残留；`prototypes/` 为 0 | 规范文件，保留即可；建议在 31/32/33 顶部注明“示例含他癌种，不是本仓内容” |

---

## 6. 缺口清单（证据层面）

1. **一手证据为 0**：无患者/照护者访谈；三条核心发现均为文献转述。USER-RESEARCH 已如实声明，但“保育长周期”“Lynch 告知负担”要进入文案层仍需 8–12 人访谈验证（报告 §10 已列）。
2. **无临床复核**：FIGO 2023 的 P0 说明演示数据未经妇科肿瘤医生过目；建议 G1 前找 1 名妇科肿瘤 + 1 名遗传咨询做 30 分钟数据走查。
3. **无签认**：DESIGN-SESSION / PROTOTYPE-REVIEW / HVT-REVIEW / FULL-PAGE-VIEW 均为空模板。
4. **无隐私单测**：三出口、家系 private 只有文案与计数，没有泄漏断言。
5. **无真机链路**：client 仍是 health-check 骨架，`endo:agent-draft` 无人监听；M6 前不能声称“真客户端链路已通”。
6. **M2 自验未归档**：`validation-results.json` 过旧；`probe:proto` 全量本次未跑完，建议 CI 化并把 JSON 落盘。

---

## 7. 判断

**不通过（返工后复审）。**

- **方向成立**：三口径差异化经独立复核为 20%/50%/70%（压线但真实）；保育/Lynch/放疗后私密三条线确为 cervical 没有的结构；K3/K4/K5/K6 的“只记录、不判读、不合成、三出口”骨架正确；“分型患者端证据为 0”被诚实处理，没有伪装成科普有效性。
- **不能签认的原因**：两个 P0 都是“用户会直接看到”的错误——默认档案首屏/复诊导出把 FIGO 2023 的 IB 与 <50% 浸润绑在一起；打印时五块正文全部丢失，而页面与规范都在承诺“全部展开”。在这两个修好之前，G1 签认会把错误写进 freeze-contract，G2 的“打印/导出可带走完整病程”也不成立。
- **复审门槛**：P0-1、P0-2 关闭；P1-1、P1-2、P1-3、P1-5、P1-7、P1-8、P1-9 有修复或书面取舍；补 DESIGN-SESSION 与 HVT-REVIEW 签认记录；补三出口单测。满足后可进入 G1 签认与 G2 走查。

---

### 附：本次复核的可复现命令

```bash
cd /Users/qinxiaoqiang/Downloads/endometrial-workbench
node scripts/check-hvt.mjs          # X1 30/30, X2 26, X3 32 views/5 fields, X4 1111
node scripts/probe-responsive.mjs   # 90 views, overflow/vertical/clipped = 0
# 折叠卡/一图秀（CDP）：3 cards / open 0 / blocks 5,5,5；.chart .line fill=none ×3
# 打印（CDP Page.printToPDF）：2 页，仅 summary 文本，.pd-block 文本缺失
```

---

# §返工复审

## R0. 元信息

| 项 | 内容 |
| --- | --- |
| 复审人 / 模型 | 独立评审员（GLM-5.3 / max），非本仓作者模型 |
| 复审日期 | 2026-10-25 |
| 代码基线 | HEAD `214cd88`（返工提交 `e3a3f0e` + 截图重出 `214cd88`） |
| 复审对象 | 初审 §2/§3 的 P0×2 与 P1 抽查；新问题扫描 |
| 方法 | 逐项读源码 + 实测（node 断言脚本、无头 Chrome CDP、Page.printToPDF、pypdf 文本核验、截图目视、mtime 比对）；不采信提交说明 |
| 声明 | 本复审只追加记录，不删除初审正文；结论不代表发布授权。 |

**结论先行：P0-2 CLOSED；P0-1 仍 OPEN（并新增 1 个 P0 级数据错误）。总体判断：仍需返工，不可签 G2。**

---

## R1. P0 关闭表

### P0-1　FIGO 2023 分期/分子数据自相矛盾 —— **OPEN**

| 子项 | 验证命令 / 证据 | 实测输出 | 判定 |
| --- | --- | --- | --- |
| demo1 三段期别同为 IA2 | `grep -n "stageLine\|anatomical\|finalLabel" prototypes/v0.2/demo-data.js` | `:82` stageLine=IA2 期；`:248` anatomical=IA2；`:249/:258` finalLabel=IA2（`:239/:240` 为术前暂定 IA，合理） | **PASS** |
| 旧串 `IB 期（肌层浸润 <1/2）` 清零 | `grep -rn "IB 期（肌层浸润 <1/2）" . --include='*.js' --include='*.md'` | 产品代码 0 处；**全文 3 处全部在 `docs/DESIGN-REVIEW.md:45-47` 的初审引文里**（历史记录，应保留） | **PASS（附注）** |
| 看板/导出/分期截图重出 | `stat -f "%Sm %N" docs/screenshots/*.png docs/shots/stage-figo-demo1.png` | dashboard / export / stage-figo 均 `Oct 25 10:35`，晚于返工提交 10:33；目视首屏与导出均为 `IA2 期（肌层浸润 <1/2）` | **PASS** |
| demo2 stageLine 与分期页一致 | `demo-data.js:1303` | `FIGO 2023：IAmPOLEmut（肌层浸润 <1/2 + POLE 致病性变异）；MMR：PMS2 缺失（并列记录）`；`:1475/:1484` finalLabel=IAmPOLEmut | **PASS** |
| demo2 `multiple` 如实写 multiple classifier | `demo-data.js:1527` | 仍为「**本档案不是多重分类**（报告未注明 multiple classifier）」；而 `:1504` POLE 致病性变异 + `:1484` PMS2 缺失，按 `medical-constraints.md:171` 规则 4 属 multiple classifier | **OPEN（初审第 3 条未修）** |
| demo1 `multiple` 不伪造 | `demo-data.js:301`；`demo/build-demo-data.mjs:159`；渲染于 `app.js:516` | 被写成「POLEmut 与 MMRd（PMS2 缺失）并列…IAmPOLEmut」，但 demo1 三个 marker 是 pMMR + p53 野生 + POLE **未检测**（`:270-295`）。同页卡片与结论互相矛盾 | **新增 P0** |
| 数据断言可拦住上述错误 | `cat scripts/check-stage-consistency.mjs` | 脚本读的是 `p.stage?.multiple`（`:37`），真实字段是 `p.molecular.multiple` → 恒为空串，**空转通过**；且未校验 `diagnosis/diagnosisShort` | **FAIL** |
| 断言进 check 链 | `grep -n '"check"' package.json`；`grep -rn check-stage-consistency` | `check` = `node --check dsh/index.js && node --check lib/client.js && node scripts/check-workbench-package.mjs .`；全仓仅脚本自身出现，`release:check`/`audit` 也未调用 | **FAIL** |
| 档案级事实同步 | `demo-data.js:80-81`；`demo/build-demo-data.mjs:84-85`；`demo/demo-data.json:79-80`；`index.html:20` | 仍为「**FIGO IB 期**」/「FIGO IB · 放疗后随访」；`app.js:378` 写入 `#profile-meta`、`:1024` 档案切换、`:344` AI 上下文均用 `diagnosisShort` | **OPEN** |

**P0-1 的可见后果（实测）**：治疗路径页 `Page.printToPDF` 提取文本首行含 `周慧敏的资料52 岁 · 子宫内膜样 G2 · FIGO IB · 放疗后随访`，而同一 PDF 正文写 IA2；档案切换弹层与 AI 提示上下文同样带 IB。即「默认档案 + 打印件」仍在把 IB 送进医生视野。

**一句话**：只改了 `stageLine` 与分期版本链，没改档案级 `diagnosis/diagnosisShort`；`multiple` 的修复串被误贴到 demo1、demo2 原样保留；新增的断言脚本字段路径写错且未接入任何 check。P0-1 **不关闭**。

### P0-2　32 号折叠卡打印展开 —— **CLOSED**

| 验证 | 命令 / 实测 | 输出 | 判定 |
| --- | --- | --- | --- |
| 实现存在 | `app.js:1172-1185` | `beforeprint` 时 `folds.forEach(d => d.open = true)`，`afterprint` 按 `prior` 恢复 | **PASS** |
| beforeprint 生效 | CDP 打开 `#treatment/pathway` → `dispatchEvent(new Event('beforeprint'))` | initial `{n:3,open:0}` → during `{n:3,open:3}` → after `{n:3,open:0}`（恢复正确） | **PASS** |
| 打印媒体可见 | `Emulation.setEmulatedMedia({media:'print'})` | 15 个 `.pd-block` 全部非空；`::details-content` `contentVisibility=visible`，`display=block` | **PASS** |
| PDF 含正文 | `Page.printToPDF`（printBackground） | **5 页 / 975,283 字节**（>500KB 门槛）；pypdf + NFKC 文本核验：方案 / 指标和趋势 / 影像发现 / 副作用总结 / 心理与营养措施及效果 五标题各出现 5 次（心理标题 4 次因换行断词），三卡五块齐全 | **PASS** |
| 自验已升级 | `grep -n "beforeprint\|printToPDF" scripts/probe-proto.mjs` | 仅 `:275-279` 查 cards/open/blocks/titles，无打印断言 | **未做（非关闭门槛，记为遗留）** |
| 模版同步 | `docs/32-…md:28,40`；`templates/TREATMENT-PATHWAY.md:21`；`docs/INTERACTION-DESIGN.md:96` | 仍写「`@media print` 规则源码存在/全展开」；未写 `beforeprint` JS。实现对了，规范与判据没跟上 | **未同步** |

---

## R2. P1 抽查（本轮指定 3 项）

| 项 | 证据 | 判定 |
| --- | --- | --- |
| AI 家系分支零条数 | `app.js:354`：「家系记录为第三方私密（已按三出口过滤，**不带条数与内容**）」 | **PASS** |
| 对照表含 p53abn / NSMP | `demo-data.js:331` p53abn、`:339` NSMP（demo1 共 6 行，四型覆盖成立）；demo2 `:1541-1565` 仍只有 4 行（POLEmut/保育/MMR/保育后），无 p53abn、NSMP | **PASS（demo1）/ 部分（demo2）** |
| SPEC/DIFF 页面树含「放疗后私密」独立 | `SPEC.md` F-RAIPRIV；`DIFF-MATRIX.md` 二、「放疗后私密（独立，私密段）」 | **PASS** |
| 附：页面计数仍不同源 | `DIFF-MATRIX.md` 仍写 营养与生活（3）/ 心理与身体意象（4）/ 随访（3），实际 `app.js:66-67` 为 随访 4 / 心理 3 / 营养并入随访；`SPEC.md` 仍列 11 个 F-ID（含 F-SET）后又写「10 线」 | **P1-8 未闭合** |

---

## R3. 新增问题（本轮实测发现）

| # | 级别 | 问题 | 落点 / 证据 |
| --- | --- | --- | --- |
| N-1 | **P0** | demo1 被伪造成 multiple classifier：数据声称 POLEmut + MMRd 并列，同页 marker 却是 pMMR + POLE 未检测。这是返工引入的新医学语义错误，且直接在分子页可见 | `demo-data.js:301`；`demo/build-demo-data.mjs:159`；渲染 `app.js:516` |
| N-2 | **P0** | 分期断言空转：读 `p.stage?.multiple`（不存在），真实字段在 `p.molecular.multiple`；且不在 `npm run check` / `release:check` / `audit` 任一链路。「加了断言」不成立 | `scripts/check-stage-consistency.mjs:37`；`package.json:23` |
| N-3 | **P0 残留** | `diagnosis/diagnosisShort` 仍写 FIGO IB（4 个数据/模板落点 + 静态 HTML），随打印头、档案切换、AI 上下文外泄；本次新 PDF 实测命中 | `demo-data.js:80-81`；`demo/build-demo-data.mjs:84-85`；`demo/demo-data.json:79-80`；`index.html:20`；`app.js:344,378,1024` |
| N-4 | P1 | README 分子截图已过期：`readme-molecular-0.2.0.png` mtime 09:51，早于数据改动 10:33；图里 demo1 仍显示「本档案不是多重分类」，与当前 demo1 数据（已变成 multiple classifier）相反，README 与原型不同源 | `docs/screenshots/readme-molecular-0.2.0.png`（09:51）vs `demo-data.js:301` |
| N-5 | P1 | 32 号模版与验收判据未随实现修正：`docs/32` §3.4/§5 与 `templates/TREATMENT-PATHWAY.md:21` 仍以「CSS 源码存在」为通过条件；这正是初审认定不能证明展开的旧判据。提交说明「32 号模版修正」在文件中无对应改动 | `docs/32-TREATMENT-PATHWAY-FOLDOUT.md:28,40`；`templates/TREATMENT-PATHWAY.md:21` |
| N-6 | P1 | `probe:proto` 仍未断言打印输出（只查 cards/open/blocks），P0-2 类回归无法被自验发现 | `scripts/probe-proto.mjs:275-279` |
| N-7 | P1 残留 | 重截后的看板仍把「私密记录（只给自己看）」放在「女儿（照护者）· 代记入口」列（P1-3 未修）；「MMR 未检出 · p53 未检出」（P1-1 未修）；导出 `privateFilter` 仍输出「N 条私密/第三方记录未包含」计数（P2-7 未修） | `app.js:434-462`；`docs/screenshots/readme-dashboard-0.2.0.png`；`app.js:164` |
| N-8 | P2 | demo2 解剖期仍为「IA 期（肌层浸润 <1/2，MRI）」，未按初审要求写 IA2；FIGO 2023 无裸 IA 亚期，断言脚本的正则把 IA 与 IA 视为同源，无法提示 | `demo-data.js:1474`；`scripts/check-stage-consistency.mjs` roman 比较 |

---

## R4. 其它实测（无回归）

| 命令 | 输出 |
| --- | --- |
| `npm run check` | `staticPass: true`，`errors: []`（2 条既有 warning）；**注意：不含分期一致性断言**（见 N-2） |
| `npm run check:hvt` | `ok:true`；X1 30/30、X2 26/26、X3 32 views / max 5 fields、X4 pages 10 / 1111 / `endo:agent-draft`；consoleErrors 0 |
| README 图片路径 | 6/6 存在（dashboard / molecular / one-chart / fold-closed / fold-open / export） |
| `npm run demo:build` | 生成成功且 `git status` 干净；说明 `build-demo-data.mjs` 与产物一致——但两者**同源同错**（N-1/N-3 均在该源里） |

---

## R5. 总体判断

**仍需返工，不可签 G2。**

- **P0-2 已关闭**：beforeprint → 3 卡全开 → PDF 975KB/5 页、五块文本可提取 → afterprint 恢复；这次是实测通过，不是源码声明。
- **P0-1 未关闭**，且比初审更糟一层：
  1. demo2 `multiple` 的原错误原样保留；
  2. 本该给 demo2 的 multiple-classifier 文案被贴到 demo1，造成「pMMR + POLE 未检测」的档案自称 POLEmut+MMRd 的新伪造；
  3. `diagnosisShort` 的 FIGO IB 仍在 4 个落点，并已随打印件/档案切换/AI 上下文外泄；
  4. 新增断言因字段路径写错而空转，且未接入 `npm run check`——这次「自验通过」不构成证据。
- **下一步最小返工清单**（按顺序）：
  1. 把 `multiple` 文案从 demo1 移回 demo2，并按 multiple classifier 改写；demo1 恢复为「非多重分类（POLE 未检测）」；
  2. 改 `diagnosis`/`diagnosisShort`（demo-data 源 + build 源 + json + index.html 静态兜底）为 IA2 / IAmPOLEmut；
  3. 修断言：读 `p.molecular.multiple`，补 `diagnosisShort` 与 `stageLine` 期别同源检查，并加入 `npm run check`；
  4. 重出 `readme-molecular-0.2.0.png`（以及任何受 `diagnosisShort` 影响的截图）；
  5. 回写 `docs/32` §3.4/§5 与 `templates/TREATMENT-PATHWAY.md`：判据改为「打印媒体下 `.pd-block` 文本可提取」，并把 `probe:proto` 升级为 `Page.printToPDF` 文本断言。
- 关闭以上 5 项后，可再次提交返工复审；在此之前 G2 走查会带着「打印件写 IB、分子页自称多重分类」两处医生一眼可见的错误。

---

# §复审2（第三次复审 · P0-1 关闭验证）

## S0. 元信息

| 项 | 内容 |
| --- | --- |
| 复审人 / 模型 | 独立评审员（GLM-5.3 / max），非本仓作者模型 |
| 复审日期 | 2026-10-25 |
| 代码基线 | HEAD `1d896ac`（返工 `a4a1089` / `cd4b0b8` / `1d896ac`） |
| 复审范围 | 仅 P0-1 逐子项关闭验证 + 断言有效性（含变异测试）+ 截图目视 + 五处期别一致性；不重审 P0-2 与 P1 全量 |
| 方法 | 源码读取 + 实测（断言脚本 4 组变异对照、全仓 grep、截图裁切目视、mtime/commit 追溯）；不采信提交说明 |
| 声明 | 只追加记录，不删改前两轮正文；结论不代表发布授权 |

**结论先行：P0-1 的医学数据与断言部分 CLOSED；产物层仍 OPEN（静态兜底 1 处 + canonical 看板截图 3 张 + 诊断字段无守卫）。总体判断：仍需返工（一次性小收口），G2 暂不可签。**

---

## S1. P0-1 逐子项关闭表

| # | 子项 | 命令 / 证据 | 实测输出 | 判定 |
| --- | --- | --- | --- | --- |
| 1 | demo1 三段期别全为 IA2 | `node -e` 解析 `DEMO_DATA` 输出 `stage.versions` | `2026-05-27 IA（暂定，依据活检）` → `2026-06-16 IA2 期（解剖期）` → `2026-07-02 IA2（解剖期，分子未改变期别）`；anatomical 同步 `IA2 期（肌层浸润 <1/2）` | **CLOSED** |
| 2 | 三个指定文件 `FIGO IB` 清零 | `grep -c "FIGO IB"` | `demo-data.js` 0 / `build-demo-data.mjs` 0 / `app.js` 0 | **CLOSED** |
| 3 | `IB 期` 全仓残留 | `grep -rn "FIGO IB\|IB 期" .`（排除 `.git` 与本文件历史引文） | 唯一命中 `prototypes/v0.2/index.html:20`：`<span id="profile-meta">52 岁 · 子宫内膜样 G2 · FIGO IB</span>`；其余全部位于本文件前两轮正文（历史引文，应留） | **OPEN（残留 1 处静态兜底）** |
| 4 | 档案级 `diagnosis/diagnosisShort` 同步 | 同一 dump | demo1：`diagnosis`=「子宫内膜样腺癌 G2 · FIGO IA2 期 · …」、`diagnosisShort`=「子宫内膜样 G2 · FIGO IA2 · 放疗后随访」；demo2：`stageLine`=「FIGO 2023：IAmPOLEmut（肌层浸润 <1/2 + POLE 致病性变异）…」 | **CLOSED（数据层）** |
| 5 | 看板/导出/分期截图目视 | 裁切 `crop((260,180,1100,250))` 目视 + `git log --oneline -- <file>` | `readme-dashboard-0.2.0.png`(13:10) 与 `readme-export-private-0.2.0.png`(13:09) 均为 `IA2 期（肌层浸润 <1/2）`；`stage-figo-demo1.png` 三段 IA/IA2；`stage-figo-demo2.png` 为 `IAmPOLEmut`；**但 `docs/shots/dash-main-demo1.png`、`dash-agent-demo1.png` 仍渲染「FIGO 2023：IB 期（肌层浸润 <1/2）」，`dash-main-demo2.png` 仍渲染旧串「IA 期…POLE 超突变（检出）· MMR：PMS2 缺失」** | **OPEN（3 张 canonical 图未覆盖重出）** |
| 6 | demo2 `stageLine` 与分期页一致 | dump `stage.versions` | `2026-06-10 finalLabel=IAmPOLEmut（医生记录，分子标签并列）`、`2026-08-12 IAmPOLEmut（维持）`，与 stageLine 同标签 | **CLOSED** |
| 7 | demo2 `multiple` 如实写 multiple classifier | `demo-data.js:1519`；`build-demo-data.mjs:551` | 「POLEmut 与 MMRd（PMS2 缺失）并列：报告注明 multiple classifier；按 FIGO 2023 以 POLEmut 定最终标签（IAmPOLEmut）…」；marker=`POLE 超突变（检出）· PMS2 缺失 · p53 野生` | **CLOSED** |
| 8 | demo1 `multiple` 不伪造 | `demo-data.js:301`；`build-demo-data.mjs:159` | 「本档案为单一分子语境：MMR 完整（pMMR）、p53 野生型、POLE 未检测；报告未注明 multiple classifier。POLE 未检测不等于非超突变…」；与 marker `pMMR / p53 野生 / POLE 未检测` 一致 | **CLOSED** |
| 9 | 断言读对字段 + 单特征反例 | `cat scripts/check-stage-consistency.mjs` | `:37` 读 `p.molecular?.multiple`（不再读不存在的 `p.stage?.multiple`）；`:41-45` 单一特征反例（pMMR/p53 野生 + POLE 未检测 却写「POLEmut 与 MMRd 并列」即失败）；`:33` POLEmut→IAmPOLEmut 规则 | **CLOSED** |
| 10 | 断言非空转（变异测试） | 复制后改 3 处，分别跑脚本取真实 exit code | A（demo2 文案贴回 demo1）→ `exit=1`「demo1: 单一特征档案却写「POLEmut 与 MMRd 并列」」；B（demo2 改回「不是多重分类」）→ `exit=1`「demo2: 含 ≥2 分子特征却写「不是多重分类」」；C（demo1 finalLabel `IA2`→`IA`）→ `exit=1`「anatomical「IA2」与 finalLabel「IA」期别不同源（2026-06-16）」 | **CLOSED（三条规则均真实触发）** |
| 11 | 断言进 `check` 链 | `package.json:23`；`npm run check` | 链尾 `&& node scripts/check-stage-consistency.mjs`；实跑输出 `staticPass: true` / `errors: []` + `✓ 分期一致性断言通过（…）` | **CLOSED** |
| 12 | 断言覆盖 `diagnosisShort/stageLine` | 变异 D：仅把 demo1 `diagnosisShort` 改回「FIGO IB」 | 脚本仍 `exit=0` 输出✓ → 上一轮实际外泄路径（header / 打印头 / AI 上下文）依旧无守卫（上一轮 R4 清单第 3 条只落实了字段路径与入链，未落实此项） | **OPEN（守卫缺口）** |

---

## S2. 残留与新问题

| # | 级别 | 问题 | 落点 / 证据 |
| --- | --- | --- | --- |
| N-9 | **P1** | 64 张 canonical 页签截图里 3 张看板图未随数据重出：`dash-main-demo1.png`、`dash-agent-demo1.png` 仍显示 IB，`dash-main-demo2.png` 仍显示旧 `stageLine`。本轮返工把新图另存为 `fix3-dash-.png`/`final-dash-.png`/`rework-dash-.png`，未覆盖 canonical 文件名，故「重截看板」在交付集里不成立；提交 `1d896ac` 的「最终残留=0」与事实不符 | `git log --oneline -1 -- docs/shots/dash-main-demo1.png docs/shots/dash-agent-demo1.png docs/shots/dash-main-demo2.png` → 均停在 `fe46a57`（返工前）；`README.md:71` 以 `docs/shots/` 64 图作为自验证据 |
| N-10 | **P1** | 静态 HTML 兜底仍写 `FIGO IB`：首屏 JS（`app.js:378` 覆写 `#profile-meta`）执行前侧栏会闪现旧期别，源码级 grep 亦非零，直接推翻「清零」结论 | `prototypes/v0.2/index.html:20` |
| N-11 | **P1** | 断言不含 `diagnosisShort`/`stageLine` 与当前 `finalLabel` 的同源校验（变异 D 通过）。上一轮正是这两处带 IB 逃逸到打印件与 AI 上下文；修了字段路径却仍留同一逃逸口 | `scripts/check-stage-consistency.mjs`（全文 50 行，仅 4 条规则） |
| N-12 | P2（N-8 残留） | demo2 当前解剖期写作裸「IA 期（肌层浸润 <1/2，MRI）」，而项目自有字典（`research-notes/medical-constraints.md:157`）规定「非侵袭性类型 + 肌层浸润 <50% = IA2」；demo1 同条件写 IA2 → 同页两档案口径不一致。断言用罗马数字比较（`IA` vs `IA`）无法发现 | `prototypes/v0.2/demo-data.js:1466`；`docs/shots/stage-figo-demo2.png` 目视 |
| N-13 | P2（N-4 残留） | `readme-molecular-0.2.0.png` 仍为 09:51 旧图，文案「本档案不是多重分类（报告未注明 multiple classifier）」；当前数据为「本档案为单一分子语境…未注明 multiple classifier」。语义仍成立（demo1 确为单一特征），仅文案漂移，不构成医学矛盾 | `docs/screenshots/readme-molecular-0.2.0.png`；`demo-data.js:301` |

---

## S3. 五处期别一致性抽查

| 落点 | demo1 | demo2 | 判定 |
| --- | --- | --- | --- |
| `diagnosisShort`（侧栏 / 档案切换 / AI 上下文） | `子宫内膜样 G2 · FIGO IA2 · 放疗后随访` | `子宫内膜样 G1 · FIGO IA · POLE 超突变 · 保育中` | demo1 一致；demo2 用解剖期 IA（见 N-12） |
| `diagnosis`（打印头） | `…FIGO IA2 期…` | `…FIGO IA 期 · POLE 超突变（检出）…` | demo1 一致；demo2 同上 |
| 对照表 `ctx` | 无期别断言（`POLE 未检测` / `pMMR · 复发/晚期` 等） | `POLEmut · IA 期（保育语境）` | 不再出现 IB 或「pMMR · IB 期」 |
| `stageLine`（看板「当前阶段」） | `IA2 期（肌层浸润 <1/2）` | `IAmPOLEmut（肌层浸润 <1/2 + POLE 致病性变异）` | 一致（但 demo2 看板图为旧图，见 N-9） |
| README | 无期别事实句（只写「FIGO 2023 版本链引用」） | 同左 | 不构成矛盾 |

---

## S4. 总体判断

**仍需返工；G2 暂不可签（但已是一次小收口，不是重做）。**

- **P0-1 的实质已修好**：demo1 全部期别事实（`diagnosis`/`diagnosisShort`/`stageLine`/版本链/导出预览）统一为 IA2；demo2 恢复为 `IAmPOLEmut` 且 `multiple` 如实并列；demo1 `multiple` 回到单一分子语境；断言脚本读对 `molecular.multiple`、含单特征反例、三条规则经变异测试全部真实触发、并已挂进 `npm run check`。上一轮的两个新增 P0（demo1 伪造 multiple、断言空转）均已消失。
- **卡在产物层与守卫层（3 项）**：① `index.html:20` 仍是 IB（首屏 JS 前可闪现，且「残留=0」不成立）；② `docs/shots/` 3 张 canonical 看板图仍是返工前的 IB / 旧 stageLine（交付证据与数据相反）；③ 断言仍未覆盖 `diagnosisShort/stageLine`——上一轮实际逃逸口原样保留，变异 D 可复现通过。
- **最小收口清单（预计一次提交即可签）**：
  1. `prototypes/v0.2/index.html:20` → `FIGO IA2`；
  2. 用现有渲染覆盖重出 `docs/shots/dash-main-demo1.png`、`dash-agent-demo1.png`、`dash-main-demo2.png`（`fix3-dash-.png` 已是正确 IA2 版本，可直接覆盖）；
  3. 断言补两条：`diagnosisShort`/`stageLine` 与当前 `finalLabel` 同源（POLEmut ⇒ 含 `IAmPOLEmut`；解剖期罗马数字一致），以及字典级「肌层浸润 <1/2 ⇒ IA2，不得写 IA/IB」；
  4. （P2，可同批）demo2 解剖期 `IA` → `IA2`；`readme-molecular-0.2.0.png` 文案同步。
- 以上 4 项完成后可直接签 G2，无需再走完整三轮复审；未完成前，G2 走查的截图证据仍会把 IB 送到医生视野。
