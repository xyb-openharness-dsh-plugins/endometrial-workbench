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
