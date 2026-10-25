# 家族结构素材（family-landscape）· ENDO DIFF-MATRIX 全量化与 M2 原型准备

日期：2026-10-24。状态：调研笔记，供 `docs/DIFF-MATRIX.md` §二全量行、§三自查与 M2 原型 PAGES/SUBPAGES 设计引用；**不是签认产物**。

素材边界（先读）：

- **移植样板 = `/Users/qinxiaoqiang/Downloads/cervical-workbench`**（VERSION 0.1.1，同妇科区域）。实测：`prototypes/v0.2/` 四件套（index.html / style.css / demo-data.js / app.js），schema 两次迁移（0001 34 表、0002 1 表），`src/client.js` 482 行 → `scripts/build-client.mjs` 116 行 → `lib/client.js` 488 行，`dsh/` 12 文件，`public/` 四件套。
- **成熟基准 = `/Users/qinxiaoqiang/Downloads/breast-cancer-workbench`**（VERSION 0.12.0）。实测 `prototypes/v0.3/app.js` L33–45：**8 个一级 / 27 个二级**，与 `docs/SPEC.md` §2/§3 一致。
- **ENDO 本仓现状（关键）**：VERSION 0.1.0；`dsh/` 只有 25 行 `index.js`（仅一条 `/api/endometrial-workbench/health`）；`lib/client.js` 是 **42 行占位骨架**；**无 `src/`、无 `schema/`、无 `prototypes/`、无 `demo/`**；`test/` 只有 `pack-contents.test.mjs`；`scripts/` 7 个（check-conformance / check-install / check-workbench-package / fetch-endometrial-trials-2026 / probe-page-view / serve-artifact / verify-tabs-on-artifact）。`docs/22-PHASES-AND-GATES.md` 明确 audit 把 **DIFF-MATRIX 列为家族成员判据**，本仓尚无该文件——本篇是其输入。
- ENDO 已读：`docs/SCENARIOS.md`（S01–S13，当前是骨架行）、`docs/PATIENT-FLOW.md`（三流骨架）、`docs/DEV-REQUIREMENTS-2026-10-25.md`（K1–K6）、`docs/BRIEF.md`、`docs/DEV-PLAN.md`（M0–M7）、`docs/26-CANCER-FEATURE-LINES.md`、`docs/27-TRACKS-AND-METRIC-CARDS.md`、`docs/30-RESPONSIVE-RULES.md`、`docs/32-TREATMENT-PATHWAY-FOLDOUT.md`、`docs/09-WORKBENCH-STATUS.md`、`docs/PARITY.csv`、`research-notes/medical-constraints.md`（77KB，§1–§13）。
- **证据纪律**：ENDO 目前**无用户研究文件**（`research-notes/` 只有 `medical-constraints.md`），SCENARIOS/PATIENT-FLOW 是骨架，BRIEF 是初始化配置；本笔记引用的"患者句子"一律视为**设计假设语料**，不是一手原话，M1 访谈回填后需逐句留痕替换。医学事实以 `medical-constraints.md` 的 S01–S32 来源与"待核验"标记为准，产品不得把"待核验"写成确定结论。
- 格式参照 `/Users/qinxiaoqiang/Downloads/melanoma-workbench/research-notes/family-landscape.md`（七部分）；内容全部按 cervical + breast + ENDO 语境重做。

**本笔记四个硬数字（先给结论）**：

| 项 | 实测/草案 | 说明 |
| --- | --- | --- |
| cervical 导航 | **12 一级 / 38 二级** | `prototypes/v0.2/app.js` L54–72；双超 26 号 8–10 / 24–30 区间，只作 client 链路底本，不作结构基准 |
| breast 导航 | **8 一级 / 27 二级** | `prototypes/v0.3/app.js` L33–45 |
| ENDO 候选 | **10 一级 / 30 二级** | 本笔记 §6.2/§6.3 草案；0 二级线 2 条、单线最大 6 |
| 与 cervical 重名率 | **完全同名 2/10 = 20%；共享核心词 5/10 = 50%；语义归类 7/10 = 70%（压线）** | 同妇科区域，判据比跨科更严；§6.7 有逐条口径 |

---

## 一、cervical 一级/二级导航全集 + L1–L10 映射

实测口径（`prototypes/v0.2/app.js` L54–72 常量）：**12 个一级 / 38 个二级**。app.js 头注写"一级页 12 个：SPEC §4 的 11 个 + 脚手架要求的「资料库」（records）"，但 PAGES 里该页实际命名为**病情整理**（"资料库"是它的第一个二级）。设置不占一级（弹窗）。

| 一级 | 二级页签全集（SUBPAGES） | 职责一句 | 关键组件/口径 |
| --- | --- | --- | --- |
| 看板 dashboard | —（0） | 分期、路径、长期影响与随访放在一起 | 定调条→「现在可以做」→**放疗长期影响状态卡**→随访卡→接下来/最近变化；任务卡跳 go-* |
| 病情整理 records | 资料库 / 整理草稿·核对 / 病情档案 / 指标检测 / 病情汇总（5） | 上传→解析→确认指标→入库；接受之前都只是候选 | DOCS/CANDS 双轨；候选 accept 前不进正式数据；L9 落点 |
| 我的分期 stage | 分期档案 / 病理与分子 / 会诊与二次意见（3） | FIGO 2018 只记录不自算 | `stage_rows` 版本链留旧分期；molecular 四态 ok/na/warn/pending |
| 治疗历程 treatment | 治疗路径 / 手术记录 / 放疗疗程 / 系统治疗（4） | 路径三选一（手术/根治性放化疗/系统治疗） | `pathway_rows` 改过留旧不覆盖；`rt_rows` EBRT 与后装分列、禁"总剂量"合成列 |
| 性与生育 fertility | 生育档案 / 生育保留记录 / 卵巢与月经 / 性健康（私密）（4） | 生育是记录不是承诺 | cervical 独有线；`sexual_rows`/`vagina_rows` `is_private` 默认 1（家族首个默认私密模块） |
| 放疗与长期影响 late | 放疗后事件 / 淋巴水肿 / 阴道与扩张 / 绝经与骨健康（4） | 放疗结束后的问题按时间记 | cervical 独有线；不给分级建议、不推产品 |
| 检查与指标 labs | 肿瘤标志物 / 细胞学与 HPV / 影像随访（3） | SCC-Ag 只对鳞癌有意义 | 口径 E：SCC-Ag 显示由 histology 决定（check 脚本比对）；细胞学只存原文 |
| 病情一图秀 timeline | 数值曲线 / 分类与事件 / 数据口径（3） | SCC-Ag、体重与阴道狭窄放回同一时间轴 | 数值线 + 分类节点不连线；`state.sel` 默认 2 数值 + 1 分类 |
| 营养支持 nutrition | 进食量记录 / 补充剂与医嘱（2） | 记"吃了多少"，不给食谱不给剂量 | 家族骨架 |
| 心理支持 mind | 当下感受 / 身体形象与亲密关系 / 母亲身份与家庭沟通（3） | 默认只属于你 | `viewpoints` 私密；换页即收回私密展开（`state.privateOpen`） |
| 复诊准备 review | 复诊节奏 / 三类随访节点 / 筛查与预防 / 就诊准备（4） | 该带什么该问什么提前写下 | 筛查与预防刻意降为子页防变科普页；导出 Markdown |
| 临床研究 trials | 2026 线索 / 已收藏 / 入组问题（3） | 线索不是推荐 | TRIALS 卡 + topic 筛选 |

合计校验：0+5+3+4+4+4+3+3+2+3+4+3 = **38**。

> **判据提醒**：cervical 的 12 一级 / 38 二级**双超** 26 号的 8–10 / 24–30 区间。它是"移植样板"（client 链路与口径底本），**不是结构基准**；ENDO 不得按 12 条照搬，结构数量以 §六 的 10/30 为准。cervical `docs/SPEC.md` §7 也自认"专属页过多（11 个一级页）→ G1 审时确认是否合并"。

**与 26 号 L1–L10 的映射（cervical 实排）**：

| 26 号线 | cervical 落点 | 备注 |
| --- | --- | --- |
| L1 看板 | 看板（0 二级） | 四点位；长期影响状态卡为特色位 |
| L2 疾病本体 | 我的分期（3 二级） | FIGO 2018 是宫颈癌的"起点" |
| L3 治疗与决策 | 治疗历程（4 二级） | 路径三选一 + 后装是独有字段 |
| L4 指标分析 | 检查与指标（3）+ 病情整理·指标检测 | SCC-Ag 组织学条件显示 |
| L5 安全与症状 | 放疗与长期影响（4 二级） | 独立整线（专属） |
| L6 营养与体重 | 营养支持（2 二级） | 骨架 |
| L7 心理与家庭 | 心理支持（3）+ 性与生育·性健康（私密） | 母亲身份为专属子页 |
| L8 复诊与随访 | 复诊准备（4 二级） | 三类随访节点（细胞学+SCC-Ag+影像） |
| L9 资料与导出 | **病情整理（5 二级，独立一级）** + 就诊准备子页 | 家族脚手架要求 + cervical 特色 |
| L10 试验与线索 | 临床研究（3 二级） | 骨架 |
| 横切层 | 病情一图秀（3）+ 私密默认过滤 + 指南出处 | 一图秀带二级是 cervical 与 breast/GBM 的差别 |

cervical 对 ENDO 最有用的四条结构先例：

1. **私密是数据结构属性而非界面开关**（`is_private` 缺省 1 + 三出口过滤）——ENDO 的 Lynch 家系、放疗后私密、生育焦虑逐条同构，且 ENDO 还要处理"第三方信息"这一层。
2. **不可相加的量分列存**（EBRT/后装，禁"总剂量"合成列）——ENDO 的 EBRT/VBT、肿瘤 MMR/胚系检测、FIGO 解剖期/最终 m 标签都同构。
3. **指标按病理类型条件显示**（SCC-Ag 只对鳞癌）——ENDO 的条件显示改为"保育候选（G1+MRI 无肌层浸润）/ 放疗史 / MMR 缺失 / 绝经状态"驱动。
4. **版本链只增不改**（`stage_rows` 改过留旧）——ENDO 的分期迁移（活检→术后大病理→分子结果，26.9% 发生迁移）比 cervical 更需要这条。

cervical 的 V1–V8 特有场景（`docs/SPEC.md` §5）**全部是确诊后**；没有一条覆盖"确诊前异常出血"。这是 ENDO 必须新增结构位的原因，见 §6.5。

---

## 二、cervical schema 表分组与专属表清单

共 **35 张表**：`0001_initial.sql` 34 张（grep 实数）/ 224 列（`freeze-contract.md` 实测）+ `0002_profile_meta.sql` 1 张。`schema/freeze-contract.md` 记 sha256，`scripts/check-schema.mjs` 拦改旧迁移；加结构只能新增迁移。

按 freeze-contract 的权威分组（四组，34 = 2+3+8+21）：

| 组 | 表 | 职责一句话 |
| --- | --- | --- |
| 档案级（2） | `subjects` | 患者档案：headline/stage/mindset 三个"一眼看到"标量 + histology（决定 SCC-Ag 显示）+ hpv_status + dash_keys/path（JSON 数组） |
| | `section_titles` | 分节标题表化（profile_key + key → title + ord）——"加一节只加一行"，替代 subjects 上一排 `*_title` 列 |
| 指标（3，通用） | `metrics` | kind: numeric/grade/qual；分类指标 unit 必须 NULL、dec NULL |
| | `metric_points` | v_num 可空 + v_text 保分类原值 + src 来源 |
| | `molecular` | 分子四态 state：ok 已检测 / na 未检测 / warn 需关注 / pending 待出（**未检测≠阴性**）；宫颈词表 = PD-L1 CPS、p16、MMR、HER2（腺癌） |
| 通用（8） | `events` / `rhythm` / `cycles` / `treatment_lines` / `viewpoints` / `trials` / `documents` / `candidate_fields` | 一图秀事件、随访节奏、周期、治疗线容器、看法（恒不是结论，无 `is_conclusion`）、试验收藏、人工归档、解析候选 |
| 宫颈专属（21） | `stage_rows` / `pathology_rows` / `pathway_rows` / `surgery_rows` / `rt_rows` | FIGO（IIIC r/p，TEXT 原样抄）、病理（kind=row/gap）、路径版本链、手术范围、EBRT+后装分列 |
| | `late_effect_rows` / `lymphedema_rows` / `vagina_rows` / `menopause_rows` / `hormone_rows` | 放疗长期影响五件套：肠膀胱事件、淋巴水肿、阴道狭窄与扩张（`is_private` 默认 1）、绝经症状、激素替代医嘱留痕 |
| | `fertility_rows` / `fert_surgery_rows` / `ovary_rows` / `sexual_rows` | 生育档案、生育保留手术（含随访要求原文位）、卵巢功能、性健康（`is_private` 默认 1） |
| | `cytology_rows` / `hpv_rows` / `imaging_rows` / `screening_rows` | 细胞学与 HPV **只存 result_text 原文**（无正常/异常枚举列）、影像、筛查史 |
| | `nutrition_rows` / `supplement_rows` / `demo_meta` | 进食量、补充剂与医嘱、演示元数据（这三张被 freeze-contract 计入"专属 21"，语义上后两张是通用尾段） |
| 迁移件（0002） | `profile_meta` | 档案级零散标量（profile_key, k, v）：加字段 = 加一行，不再 ALTER 补列 |

**cervical 五条独有口径（写死在 0001 头注释，读模型与前端都按此执行）**：

- **A** FIGO 只记录不自算（不设 TNM→FIGO 推导列或触发器，IIIC 细分 TEXT 原样抄）；
- **B** EBRT 与后装分列、禁"总剂量"合成列（剂量学不可相加）；
- **C** 细胞学/HPV 只存原文（无正常/异常枚举列，防界面重判读）；
- **D** 性与生育默认私密（`sexual_rows`/`vagina_rows` 缺省 1，读模型默认过滤，导出层不得包含）；
- **E** SCC-Ag 只属鳞癌（数据层不拦，check 脚本比对 `metrics.key` 与 `histology`）。

**家族四契约**（同段）：看法恒不是结论；四点位 NULL≠0（cervical 不做四点位，留白不建表）；更正只新增版本；事实四层不合并（文档/候选/记录/指标分表）。

对 ENDO 的直接映射：

| cervical 口径 | ENDO 必须换成 |
| --- | --- |
| A FIGO 只记录不自算 | **FIGO 2023 解剖期 + 最终 m 标签只抄原文**；不设"MMR 缺失→自动 IICm"推导列；`stage_rows` 存 `anatomical_stage` / `final_label` / `basis_text` / `change_due_to_molecular`，判定归医生 |
| B EBRT/后装分列 | **EBRT / VBT 分列 + 肿瘤 MMR / 胚系检测分表 + 解剖期 / 分子整合标签分列**；禁"总放疗剂量""总分型"合成列 |
| C 细胞学/HPV 只存原文 | **病理/影像/遗传报告只存原文 + 数值带单位与测量口径**（内膜厚度 mm、Breslow 式数值不进推导）；阴道细胞学记录但标"非常规" |
| D 性与生育私密 | **放疗后私密 + Lynch 家系第三方信息 + 生育焦虑默认 private**；三出口过滤 + 逐条显式授权；家系还要 `third_party` 与 `consent` 两列 |
| E SCC-Ag 条件显示 | **条件显示改"保育候选 / 放疗史 / MMR 缺失 / 绝经状态"驱动**：无放疗史不显示扩张器卡；非保育候选不默认展开保育线；未做分子不显示分型对照表（但可手动进入说明页） |

---

## 三、cervical 客户端链路结构（M5 移植底本）

链路：**`src/client.js`（482 行，手写唯一源）→ `scripts/build-client.mjs`（116 行，零依赖字符串替换）→ `lib/client.js`（488 行，生成物勿手改，`--check` 兜同步）**。ENDO 现在的 `lib/client.js` 正是 `docs/LESSONS.md` §"踩 3 · 占位客户端上线"描述的 **42 行占位骨架**——**这是 M5 第一优先修复项**。

`src/client.js` 九段结构（customFrame 外壳，移植整段保留、只换品牌）：

1. **装载壳**：`window.__ModuleLoader__.load({ id: '__PKG_NAME__', factory(require) })`；无 loader 静默退出。
2. **常量段**：TITLE / PANEL_TITLE / SUBTITLE / DESCRIPTION + 注入的面板参数（BUSINESS_SIDE/WIDTH、CUSTOM_FRAME、AGENT_DEFAULT/MIN/MAX/STEP、NARROW_BELOW、DRAWER_MAX）。
3. **宽度记忆**：clampWidth/snapWidth（对齐 ratioStep 0.02，避免 33.7%）、loadWidth/saveWidth → localStorage。
4. **样式段**：全部内联 style 对象（root/header/brand/ver/hint/pane/splitter/focus/fallback/button/ghost/pad/drawer），cervical 主色 `#18AFA5` 配中性冷灰。
5. **会话判定**：currentSession / ownsSession / ownedSession（官方 dsh-site-selection 同款，含 snapshot 兜底）。
6. **原生草稿桥**：fillDraft 只填入不发送（校验 ownedSession、occurrences/phase 防引用冲突）；pendingDraft 队列存 DRAFT_QUEUE_KEY，Panel 内 500ms 轮询 flushDraft，composer 未就绪留队重试。
7. **onboardingPrompt**：5 行开场白（本机资料整理、不提供诊疗建议、分工声明、"看法不是医生结论"）。
8. **Panel 组件**：`<header>` 顶栏（首个子元素，`--dsh-frame-leading-clearance` 避让 macOS 窗口按钮；品牌+版本 chip+提示+「AI 对话/收起」按钮）→ iframe 业务区（8s broken 兜底可重试）→ `<aside>` 原生会话**始终挂载**只 display 显隐 → splitter（鼠标拖 + 键盘 ←/→/Home/End，25%–45%，`role=separator` + aria-valuenow）→ 窄屏（**容器宽** ResizeObserver <760px，非 window.innerWidth）转覆盖抽屉 → postMessage `cervi:agent-draft`（校验 `event.source===iframe.contentWindow` + 同源，截 8000 字）。
9. **apply/register**：title/panelTitle/icon 🪷/repository/audience/requirements/initialization:'empty'/embedded:true/version/layout{businessSide,businessWidth}/customFrame；`inject: ['desktopWorkbenches','sessions']`。

**14 个构建注入 token（`build-client.mjs` L57–74 替换表的全部键，ENDO 逐项换源头）**：

| token | cervical 现值 | ENDO 应取 | 来源 |
| --- | --- | --- | --- |
| `__PKG_NAME__` | @xyb-community/cervical-workbench | @xyb-community/endometrial-workbench（已定） | package.json name |
| `__REPOSITORY__` | github.com/xyb-openharness-dsh-plugins/cervical-workbench | endometrial 同 owner/repo（强校验 `https://github.com/owner/repo`） | package.json repository |
| `__API_PREFIX__` / `__UI_ENTRY__` | /api/cervical、/api/cervical/ui | /api/endometrial（**需与现有 `/api/endometrial-workbench/health` 统一，见 §七**） | dsh/routes.js |
| `__VERSION__` | 0.1.1 | 按 ENDO 版本簿记（现 0.1.0） | lib/version.js（← VERSION） |
| `__BUSINESS_SIDE__` / `__BUSINESS_WIDTH__` / `__CUSTOM_FRAME__` | left / 0.65 / true | 同值（0.65 的两条理由在 layout.js 注释） | lib/layout.js PANEL |
| `__AGENT_DEFAULT__/MIN/MAX/STEP/NARROW_BELOW/DRAWER_MAX__` | 0.35 / 0.25 / 0.45 / 0.02 / 760 / 420 | 同值（HOST_LIMITS 0.25–0.7，businessWidth 不得取 0.7） | lib/layout.js AGENT_PANE |

**8 处手写品牌点（构建 token 之外，必须逐处改）**：

| # | 项 | cervical 现值 | ENDO 应取 |
| --- | --- | --- | --- |
| 1 | TITLE | 小莲宝 CerviPal | 小膜宝 EndoPal（占位，G1 可改） |
| 2 | PANEL_TITLE | 小莲宝宫颈癌工作台 | 小膜宝子宫内膜癌工作台 |
| 3 | SUBTITLE | 本机数据 · 记录不是诊断 | 同句式（本机数据 · 记录不是诊断） |
| 4 | DESCRIPTION | "……FIGO 分期、治疗与随访记录……" | 出血日志、FIGO 2023 分期与分子分型、保育与 Lynch 家系、放疗后私密记录 |
| 5 | WIDTH_KEY | cervip.pal.cervical.agent-pane.v1 | endop.pal.endometrial.agent-pane.v1 类 |
| 6 | DRAFT_QUEUE_KEY | cervip.pal.cervical.initial-drafts.v1 | endop.pal.endometrial.initial-drafts.v1 类 |
| 7 | 消息类型 | `cervi:agent-draft` | `endo:agent-draft`（业务侧 postMessage 两端同改） |
| 8 | icon + 色板 | 🪷；#18AFA5 / #28605c / #f2f8f7 / #f5faf9 / #e2efec / #158f87 / #7d9490 / #c4e2dd | icon 候选（G1 定）；主色 **藕荷 #8A5B7B**、深 #5E3C53、底 #FBF8FA、边 #E7DCE4、提示行动橙 #B95023、版本字 #8A7A84、splitter 焦点 #C9AFC0 |

另需整段重写、但不属于"品牌变量"的文案：register 的 `audience`/`requirements`/`author`、`onboardingPrompt` 5 行、Fallback 文案、顶栏 hint。cervical 的 `requirements` 是"本机数据整理；不做诊断与处置建议，判断由用户与治疗团队做出"——ENDO 需加三句："分子分型是肿瘤标签，不是遗传检测""未检测不等于阴性""家系与私密记录默认只在本机、默认不共享"。

`scripts/build-client.mjs` 本身**零癌种内容**，可直接复用；它替换完还回扫 `__[A-Z_]+__` 残留（静默 undefined 防线）+ 强校验 canonicalRepository。`lib/layout.js` 的 PANEL / AGENT_PANE / HOST_LIMITS 结构与注释（customFrame 判定依据、0.65 的两条理由）也是移植底本。

---

## 四、breast 基准 L1–L10 做法摘要（小粉宝 0.12.0：8 一级 / 27 二级）

一级全集（`prototypes/v0.3/app.js` L33–37 实测）：**看板 / 病情整理 / 病情一图秀 / 临床 / 营养支持 / 心理支持 / 全程与康复 / 收藏与回顾**。二级合计：5+6+3+4+6+3 = **27**（看板与一图秀各 0）。

| # | 线 | breast 基准做法 | 出处 |
| --- | --- | --- | --- |
| L1 | 看板 | 单页：当前阶段（**用户选**）、一件事、上肢差值提醒、最近变化、安排、问题入口；不做自动判定阶段 | SPEC §2 |
| L2 | 疾病本体 | 病情整理·病情档案：病理转录、标本、指标序列；报告原文可回溯，自动判读不做 | SPEC §2/§3 |
| L3 | 治疗与决策 | 临床·治疗历程（计划 vs 实际、方案与药物）+ 全程与康复"术后恢复三阶段"话题（D15 定名"术后上肢"） | SPEC §2/§3 |
| L4 | 指标分析 | 病情整理·指标检测：分组卡 + CTCAE 分级徽章 + 背面区间 + needsUln（×ULN 型需化验单参考上限） | 26 §3.1、23 号 |
| L5 | 安全与症状 | 全程与康复·上肢与淋巴水肿独立主题；四点位测量与差值（缺健侧不生成差值）；症状强度记录 | SPEC §2/§3 |
| L6 | 营养与体重 | 独立一级 3 二级：当下困扰 / 进食与体重 / 建议与回顾；体重进指标，只做趋势无 CTCAE 界限 | SPEC §2、23 §8 |
| L7 | 心理与家庭 | 独立一级 4 二级：当下感受 / 我的记录 / 支持资源 / 身体与亲密；**主体（患者/照护者）区分**、私密标记、敏感话题入口 | SPEC §2/§3、HVT §4.5 |
| L8 | 复诊与随访 | 全程与康复·近期安排 + 就诊准备 + 长期生活 | SPEC §2 |
| L9 | 资料与导出 | **收藏与回顾独立一级**：问题清单版本、快照、Markdown 导出、源变标"已过时"；病情整理承载导入+草稿核对+解析 | SPEC §2 |
| L10 | 试验与线索 | 临床·试验线索（一期虚构样例仅作界面演示，真实登记库二期） | SPEC §2 |
| 横切 | 一图秀 | 多指标时间轴、治疗条、缩放与时间窗、点详情回源、3D 翻转卡 | SPEC §2 |

**三条可直接借的 breast 立场（SPEC §4.5，HVT 补丁）**：

1. **"LVEF 与骨密度只做与治疗同窗的记录，不做毒性判定"**——ENDO 的 **CA125 / 内膜厚度 / 肝功能（孕激素监测）/ 阴道雌激素**逐字同构：记录数值+日期+机构+方法，页面常显"是否调整治疗由治疗团队决定"。
2. **"内分泌副作用记录体验、不做归因；强度轨道呈现，不画趋势曲线"**——ENDO 的 **孕激素副作用（体重、情绪、出血、肝损）/ 放疗后阴道症状** 同构，且 ENDO 更要防"出血=复发"或"干燥=没治好"的自判。
3. **"生育与性健康是可选话题不是必填表；默认私密，三处过滤"**——ENDO 的保育线（决策）与放疗后私密线（记录）沿用；breast 还有"术式是独立字段不与治疗混写"→ ENDO 的 **TH/BSO、SLN、保留卵巢**独立字段同构。

**breast 不可直接借的**：

1. "当前阶段由用户选"在 ENDO 的出血前段不成立——确诊前没有"阶段"可选，只有"出血模式/时间/量"。
2. breast 的肿瘤标志物线（CEA/CA15-3）在 ENDO 没有对应常规项；CA125 只在初治升高者有随访语境，**不能做常规 CTCAE 式分级**。L4 必须换骨架：病理参数（组织学/分级/LVSI/肌层浸润）+ 分子（MMR/p53/POLE）+ 代谢与体重 + 同模态影像。
3. breast 用 8 条一级承载 27 个二级；ENDO 因新增"保育""Lynch""放疗后私密"三条专属线与出血入口，至少需要 10 条（并把营养并入随访、把心理独立保留）。

判定纪律（26 号）：HCC 曾因"营养一张表、心理完全没有、指标无卡无分级、二级为 0"被判结构性不足。ENDO 走查时逐线过同一张表，尤其 **L4（ENDO 无 SCC-Ag，CA125 非常规）** 与 **L10（试验线索只有二级位）** 是两处容易被判薄的位置。

---

## 五、家族通用件 vs 必须癌种化部位（含 30 号接入）

**通用骨架（换癌种不换结构）**：

| 件 | 出处 | 要点 |
| --- | --- | --- |
| 三层结构 线→页→卡 | 26 §1 | 一级 8–10 / 二级 24–30；二级为 0 的一级 ≤2；单线二级 ≤6；<8/<20 直接判结构性不足 |
| customFrame 外壳 | cervical `src/client.js`、20 号、`lib/layout.js` | businessSide/0.65 + 会话面板 25%–45% 可拖；顶栏 AI 按钮、splitter、宽度记忆、草稿桥、始终挂载、窄屏抽屉——M5 整段移植 |
| 看板四点位 | SPEC 家族段 | 定调条→「现在可以做」→特色状态卡→随访卡→接下来/最近变化 |
| 一图秀 | 16 号 R1–R12 | 三合同（可比性/归一化/事实源）+ 单点不连线、治疗条分层、末点避让、`minmax(0,1fr)` |
| 3D 指标卡翻转 | 16 §2、19 §4 | `data-flipped` 唯一开关、固定高度、reduced-motion 降级 |
| 多轨并列 | 27 号 | **永不加总、永不折算、各自独立归一化、分类只画节点**；判据是"页面不能让用户算出总体几分" |
| 指标分组 + CTCAE | 23 号 | 绝对阈值 vs ×ULN（needsUln）；分类卡不进趋势。**ENDO 只对有限实验室项适用（肝功能、血糖/血脂等），不套 CA125** |
| 私密=数据结构属性 | 26 §4.3、cervical 口径 D | `is_private`/`visibility` 列 + 三出口（一图秀/摘要/导出）各过滤、收敛一个函数；ENDO 加 `third_party` + `consent`（家系） |
| 版本链只增不改 | 0001 头注、SCHEMA-SPEC | 更正=INSERT+翻 is_current；触发器禁改禁删（ENDO：分期迁移、分子更正、保育活检结果、Lynch 检测结果都是版本链） |
| 分节标题表化 | cervical `section_titles` | 教训件：不用 subjects 上的 `*_title` 列 |
| 设置三区 / 两区导出 / 试验线索卡 / MinerU 管线 | SETTINGS-DESIGN、29 号、18 号 | 拒根/桌面根、Token 三态；fact/view 分区；失败不产候选 |
| 指南四刻度 | 25 号 | L1 出处 / L2 适用 / L3 节奏 / L4 分级 / X 禁止层；**L3 节点 = 起点 + k × 间隔，不是"上次复查 + 间隔"**；显示带宽是工作台约定必须标注 |
| 治疗路径折叠卡 | 32 号（ENDO 已有文档） | 原生 `<details>/<summary>` + 五块固定顺序 + 打印全展开；见 §6.5-F |
| 工程件 | `lib/version.js` + build-version、freeze-contract、check-* 族 | VERSION 唯一来源；迁移哈希冻结；无头实测出数字 |

**30 号接入（窄宽自适应）**：

- ENDO 本地已有 `docs/30-RESPONSIVE-RULES.md`（病种无关 starter，GBM v0.1.5 抽象版）与 `docs/RESPONSIVE-RULES.md`（带病种示例版）。**接入点**：①业务区视口 = iframe 宽（AI 面板展开后 `@media` 量到的就是业务区宽，不是窗口宽）；②六条硬规则（"标签+值+说明"纵向堆、grid+`minmax(0,1fr)`、行内标签不做 flex item、允许收缩容器 `min-width:0`、横向滚动配 `.scroll-hint`、短 token `nowrap`）；③断点只有 1180/900/600 三档；④验收 = `npm run probe:resp`（真实 Chrome，多档宽 × 一级页出数字）+ `test/responsive.test.mjs`。
- **ENDO 现状缺口**：`scripts/` 没有 `probe-responsive.mjs`，`test/` 只有 `pack-contents.test.mjs`。M2 必须从参考实现（glioblastoma-workbench，或 melanoma 的移植版）抄入 `scripts/probe-responsive.mjs` 的 SCAN 段，只换 `#main` 与页面 hash，并新建 `test/responsive.test.mjs`。
- ENDO 的高发区：**出血日志时间线**（日期/模式/量/持续天数/诱因多列并排，最易挤成竖排单字）、**分子三态 × 分期三列**（MMR/p53/POLE 三个卡 + 解剖期/最终标签/是否改期）、**保育活检时间线**（3–6 个月节奏 + CR/残留/进展节点）、**Lynch 家系图**（关系图易横向溢出）、**放疗后私密卡**（"症状+程度+时间+是否与医生说"四段，且默认私密）、**32 号折叠卡展开区两列**。这六处必须在 M2 原型阶段就跑窄宽扫描，不能留到 M6。
- 示例词去残留：`docs/RESPONSIVE-RULES.md` 的示例是 GBM 语境（KPS/MRI/激素），落地 ENDO 时换成 FIGO 2023/LVSI/MMR/内膜厚度/扩张器；不要直接把示例文案抄进原型。

**必须癌种化（不许换名复用）**：

| 部位 | cervical/breast 现值 | ENDO 必须换成 |
| --- | --- | --- |
| 品牌三档色与整套色板 | 青 #18AFA5 全套 / 粉 | **藕荷 #8A5B7B + 家族行动橙 + 暖砂灰分区**；icon 与 WIDTH_KEY/DRAFT_QUEUE_KEY 前缀 |
| 病理参数字典 | FIGO 分期 + 鳞/腺/腺鳞 | **WHO 2020 组织学类型（内膜样/浆液/透明细胞/癌肉瘤/未分化/混合/中肾样/胃肠型黏液/神经内分泌）+ FIGO 分级 G1/G2/G3 + LVSI（none/focal/substantial）+ 肌层浸润（none/<50%/≥50%）+ 宫颈间质/附件/浆膜/腹膜/淋巴结（微/宏）** |
| 分子词表 | PD-L1 CPS/p16/MMR/HER2 四态 | **MMR IHC 四蛋白（MLH1/PMS2/MSH2/MSH6：retained/lost/equivocal/not_tested）+ MSI（MSI-H/MSS/indeterminate/not_done）+ POLE（pathogenic/VUS/negative/not_done）+ p53 IHC 模式（normal/overexpression/null/cytoplasmic/equivocal/not_done）+ 整合型（POLEmut/MMRd/p53abn/NSMP/multiple_classifier/unknown）**；**未检测≠阴性、VUS≠POLEmut、p53 异常≠浆液性癌** |
| 分期字典 | FIGO 2018（含 IIIC r/p） | **FIGO 2023（IA1/IA2/IA3/IB/IC/IIA/IIB/IIC/IIIA1/IIIA2/IIIB1/IIIB2/IIIC1i/ii/IIIC2i/ii/IVA/IVB/IVC）+ m 标记 + IAmPOLEmut/IICmp53abn 写法 + multiple classifier**；只抄不自算 |
| 治疗字典 | 手术/根治性放化疗/系统治疗 + 后装 | **TH+BSO / 根治性子宫切除 / 减瘤；SLN vs 淋巴结清扫；EBRT vs VBT 分列；卡铂+紫杉醇；内分泌（孕激素/芳香化酶抑制剂等按医嘱原文）；免疫（dMMR 语境，NMPA 状态待核验）** |
| 保育字典 | 生育档案/生育保留手术（宫颈锥切等） | **G1 内膜样 + MRI 无肌层浸润前提；LNG-IUD / 口服甲地孕酮 / 甲羟孕酮 / GnRH-a；每 3–6 个月内膜活检；肝功能监测；CR/残留/进展；妊娠尝试/ART；产后子宫切除计划** |
| 遗传字典 | 无（HPV 是筛查史） | **肿瘤 MMR IHC → MLH1 甲基化 → 遗传咨询 → 胚系（MLH1/MSH2/MSH6/PMS2/EPCAM）→ 家系验证；家系成员第三方信息 + 同意** |
| 放疗后私密字典 | 阴道狭窄/扩张（cervical 已有，但合在长期影响线） | **独立线**：阴道干涩/性交痛/狭窄、扩张器（频率/时长/尺寸/疼痛/出血）、保湿剂、润滑剂、阴道雌激素、与医生沟通舒适度；默认 private |
| 出血字典 | 无 | **绝经状态、出血模式（绝经后任何/经量多/经期延长/经间期/点滴/性交后）、量（spotting/light/moderate/heavy）、持续天数、血块、排液（浆液/血性/臭味）、诱因、来源**；只记录不判病因 |
| 随访字典 | 细胞学+SCC-Ag+影像三类 | **症状+妇科检查（含窥器）+ 有指征影像 vs 常规影像 + 阴道细胞学（标"非常规"）+ CA125（仅初治升高者）+ 心血管/代谢/第二原发癌 + 体重**；不合成"下次总复查" |
| 试验关键词 | HPV/放化疗 / 内分泌 | **dostarlimab、pembrolizumab、lenvatinib + pembrolizumab、dMMR/MSI-H、POLEmut 降阶、保育治疗**；NMPA 获批状态逐药标"待核验" |
| 20 张 `*_rows` 专属表 | stage/pathway/rt/late_effect/vagina/fertility/cytology/hpv… | ENDO 专属表（出血、检查/活检、病理、分期、分子检测/标记、保育、Lynch/家系、放疗后私密、随访、慢病、体重、情绪/身体意象……见 §6.8） |
| 五条口径 A–E | FIGO/后装/细胞学/私密/SCC-Ag | A 分期只抄（含 m 标签）；B EBRT/VBT + 肿瘤/胚系分表；C 病理/影像/遗传只存原文；D 私密 + 第三方 + 同意；E 条件显示改"保育候选/放疗史/MMR/绝经" |
| demo 画像 | 鳞癌 IIIC / 乳腺术后上肢 | **四档案**：绝经后出血 + p53abn、年轻未育 G1 保育（LNG-IUD）、Lynch（MSH2 胚系）、放疗后私密（EBRT+VBT）；隐私内容用示意占位，不写真实患者 |
| 随访节奏 | 细胞学+SCC-Ag+影像三类 | **症状/妇科检查主线 + 有指征影像 + 非常规细胞学 + 慢病管理**；按风险分层给密度；不合并成"复查" |
| check-wording 红线词表 | cervical 词族 | ENDO 加 K1–K6 词族（见 §6.4），并扫原型文案与 demo 数据 |
| API 前缀与 routes | /api/cervical | /api/endometrial（与现有 health 路径统一） |

---

## 六、ENDO 结构建议草案（M2 原型候选，待 G1 讨论）

### 6.1 设计输入对齐

**PATIENT-FLOW 三流反推**（`docs/PATIENT-FLOW.md`）：

- 流一（异常出血，自查前形态）：绝经后出血/月经改变 → 出血日志（时间线）+ 就医准备。**这是家族在妇科区域的第二个"确诊前"入口**（MEL 是自查皮损），cervical 完全没有。
- 流二（确诊与分子分型）：病理 + MMR/p53/POLE → 分子档案三态 + 分型/治疗对照（引用）。**FIGO 2023 把分子纳入分期**，所以"分型"与"分期"必须同线、同版本链。
- 流三（保育或术后长期随访）：年轻未育者保育治疗与活检节奏；放疗后私密健康；Lynch 家系沟通 → 保育路径 + 私密记录（三出口过滤）+ 家系记录（第三方 private）+ 复诊摘要。

三条流全部有两条以上线承接，反推原则满足。

**六个 ENDO 特殊语境的落位**：

1. **分期是动态的**（活检、手术大病理、二次会诊、分子结果都可能改期；复旦 547 例中 26.9% 迁移）→ 分期档案必须是版本链，且显示"哪一次、依据什么、变了没有"。
2. **分子分型是肿瘤标签，不是遗传检测**（MMRd ≠ Lynch；POLE VUS ≠ POLEmut；p53 异常 ≠ 浆液性癌）→ 分期/分子线用三态 + 对照引用；Lynch 单独成线，只处理胚系与家系。
3. **保育是延迟手术、争取生育时间，不是治愈**（CR 77–84%、复发 29.2–35.4%、活产约 20.5%，但这些都是文献范围，不是个人预测）→ 保育独立线，零方案推荐/零成功率。
4. **放疗后性健康是医学问题**（狭窄/干燥/性交痛；扩张器 5–10 分钟 × 每周 2–3 次 × 9–12 个月；中国做法不统一）→ 独立私密线，只记录医生给的频率，不自行设定。
5. **Lynch 家系是敏感个人信息**（PIPL 医疗健康属敏感个人信息；家系图含父母/子女/兄弟姐妹）→ 家系独立线，第三方信息默认 private + 显式授权 + 不替亲属建档。
6. **随访不是越勤越好**（不推荐无症状常规影像/阴道细胞学；高强度随访未改善生存；心血管是首位死因）→ 随访线要能记录"有指征 vs 常规"，并把慢病/第二原发癌/体重放进来。

### 6.2 一级 10 条候选线（覆盖 K1–K6 与 S01–S13）

| # | 候选线名 | 接哪句患者原话（设计假设语料，非一手） | L 线 / 红线 | 与 cervical（及 breast）的刻意不同 |
| --- | --- | --- | --- | --- |
| 1 | 看板 | "我现在整体什么情况？下次该查什么？" | L1 | 沿用四点位；特色状态卡 = **出血日志待记录 + 分子结果待读（未检测≠阴性）+ 随访节点（不合成"下次总复查"）**；保育/Lynch/放疗后私密为条件卡；cervical 是放疗长期影响卡，breast 是上肢差值卡 |
| 2 | **我的分型与分期** | "绝经后又出血了，是不是要马上查？""POLE/MMR/p53 是什么意思？""为什么我的期别后面多了个 m？" | L2；K1 K4 K5 | **家族首个"分子分型整合分期"整线**：出血日志 → 检查/活检 → 病理/分级 → 分期档案（FIGO 2023 + m 标签）→ 分子三态 → 分型/治疗对照（只引用）；cervical 是纯解剖 FIGO 2018 + r/p，无分子整合、无出血入口 |
| 3 | 治疗与决策 | "我做过什么、接下来还有什么路？手术要不要切卵巢？" | L3 | **32 号折叠卡**（阶段名+日期+一句概要，展开五块）+ 手术（TH/BSO、SLN、保留卵巢）+ 放疗（EBRT/VBT 分列）+ 系统与内分泌；cervical 是"路径三选一"+ 后装独占，无折叠卡 |
| 4 | **保育治疗** | "我还想要孩子，能不能先不切子宫？" | L3 决策支线；K3 | **家族首个"延迟根治手术"决策线**：保育候选（G1+MRI 无肌层浸润）/ 孕激素方案与监测（LNG-IUD、口服、肝功能）/ 活检节奏（3–6 个月）/ 妊娠尝试与产后切除；cervical 的"性与生育"是记录线（生育档案/保留手术/卵巢/性健康），不承担"要不要保育"的决策结构 |
| 5 | **Lynch 与家系** | "医生说我 MMR 缺失，是不是 Lynch？我女儿要不要查？" | L2 遗传支线；K2 | **家族首个遗传家系整线**：肿瘤 MMR 初筛 → MLH1 甲基化 → 遗传咨询 → 胚系检测 → 家系验证；家系记录（第三方 private + 同意）；告知与监测计划；cervical 完全没有遗传线（HPV 是筛查史，不是家系） |
| 6 | **放疗后私密** | "放疗后又干又痛，是不是我矫情？" | L5；K6 | **只取放疗后的私密段独立成线**：干涩/性交痛/狭窄、扩张器、保湿/润滑、阴道雌激素、与医生沟通；默认 private；cervical 把肠膀胱事件/淋巴水肿/阴道/绝经合在"放疗与长期影响"一条线（4 子页），ENDO 不照抄 |
| 7 | 长期随访与健康 | "该多久查一次？要不要每次做 CT/细胞学？" | L8 + L6 | **症状+妇科检查主线**；影像/细胞学标"有指征 vs 常规"；加**心血管/代谢/第二原发癌/体重**（肥胖相关、首位死因是心血管）；cervical 是"细胞学+SCC-Ag+影像三类节点"合成一页，ENDO 不能合成 |
| 8 | 情绪与亲密 | "我很怕复发，也怕身体不再是自己的" | L7 | **生育焦虑 + 身体意象 + 家系沟通**三件；患者/照护者双主体并列不平均；默认 private；cervical 的专属子页是"母亲身份与家庭沟通"（宫颈癌语境），ENDO 是"还能不能生"与保育决策联动 |
| 9 | 病情一图秀 | "变化发生在哪一步？" | 横切层 | 骨架同构；默认选线 **体重 + 出血量/频次 + 同模态影像测量**，分类节点 = 治疗事件/分子结果日期/随访；**无 SCC-Ag**；单点不连线、跨模态不共轴 |
| 10 | 资料与就诊 | "复诊要带什么？还有没有我能参加的研究？" | L9 + L10 | 对 cervical 拆「病情整理 / 复诊准备 / 临床研究」三条一级：ENDO 合并为一条 4 子页（同 thyroid/GBM/MPM 惯例）；两区导出 private 过滤；MinerU 六部件按 18 号 |

### 6.3 二级 30 个候选页签

| 一级 | 二级候选 | 职责一句 |
| --- | --- | --- |
| 看板（0） | — | 四点位；特色卡 = 出血待记录 + 分子待读 + 随访节点；条件卡 = 保育/Lynch/放疗后私密；无二级 |
| **我的分型与分期（6）** | 出血日志 | **独立数据轨道**：绝经状态、模式、量、持续天数、血块、排液、诱因、来源；只记录不判病因（K4） |
| | 检查与活检 | TVS 内膜厚度（带单位/测量口径/局限）、取样方式（诊室 Pipelle/宫腔镜/诊刮）、取材是否足够、疼痛自评；记录"厚度正常≠没事" |
| | 病理与分级 | WHO 2020 类型、FIGO 分级、实性成分%、核异型升级、LVSI、肌层浸润、宫颈间质/附件/浆膜/腹膜/淋巴结；逐项带报告原文与日期 |
| | 分期档案（FIGO 2023） | 解剖期 + 最终标签（IAmPOLEmut、IIIC1mp53abn 等）+ 依据原文 + 日期 + 是否因分子改期；版本链留旧分期；不自算、不解释"严重不严重"（K1） |
| | 分子三态（MMR·p53·POLE） | 每个标记三态并列（检出/未检出/未检测）；MMR 四蛋白逐项、MLH1 甲基化、MSI、POLE 致病 vs VUS、p53 模式；**未检测≠阴性、VUS≠POLEmut**（K1） |
| | 分型与治疗对照 | 四型 × 指南原文/中国获批/医保三列分开；只列"谁说了什么"，不合成"该用什么药"（K5） |
| **治疗与决策（4）** | 治疗路径（32 号折叠卡） | 每阶段一张 `<details>`：阶段名+日期+一句概要；展开五块（方案/指标和趋势/影像发现/副作用总结/心理营养措施和效果）；打印全展开 |
| | 手术记录 | TH+BSO / 根治性子宫切除 / 减瘤；微创 vs 开腹；SLN vs 淋巴结清扫；保留卵巢理由；切净程度；术后并发症；术式独立字段不与系统治疗混写 |
| | 放疗记录 | EBRT 与 VBT **分列**（各自剂量/次数/起止/技术）；禁"总剂量"合成列；记录医生原文与机构 |
| | 系统与内分泌治疗 | 卡铂+紫杉醇周期、免疫（dMMR 语境，NMPA 状态待核验）、孕激素/内分泌（按医嘱原文）；计划 vs 实际、停药原因留痕；不评疗效、不判进展 |
| **保育治疗（3）** | 保育决策档案 | 生育意愿、孕产史、年龄、病理候选（G1 内膜样）、MRI 肌层浸润、二次病理复核；记录"医生说过什么方案"与"是否告知非治愈/需切除子宫/复发风险"；**零方案推荐/零成功率**（K3） |
| | 孕激素与监测 | LNG-IUD / 口服甲地孕酮 / 甲羟孕酮 / GnRH-a / 联合；剂量、起止、副作用（肝损/体重/情绪/出血）；肝功能监测；不推方案 |
| | 妊娠尝试与产后计划 | 完全缓解日期、开始尝试怀孕、ART 转诊、妊娠/分娩、产后子宫切除讨论；只记时间线与医嘱原文，不判"能不能生"（K3） |
| **Lynch 与家系（3）** | MMR 与胚系检测 | 肿瘤 MMR IHC → MLH1 甲基化 → 遗传咨询 → 胚系（MLH1/MSH2/MSH6/PMS2/EPCAM）；检测状态（未提供/已提供/拒绝/待出/有结果）与肿瘤检测分开；VUS 不写阳性 |
| | 家系记录（第三方私密） | 关系/癌种/确诊年龄/是否核实；**不录亲属姓名**（或仅代号）；`third_party=1` + `consent` + 默认 private；不替亲属建档、不默认共享（K2） |
| | 告知与监测计划 | "建议告知哪些亲属"清单、已告知状态、遗传咨询机构、肠镜/妇科监测计划、降风险手术是否讨论；只记录医生原文，不给遗传建议（K2） |
| **放疗后私密（3）** | 私密症状记录 | 干涩/性交痛/狭窄/出血/性欲；0–4 自评；时间线；默认 private、可跳过、可只给自己看（K6） |
| | 扩张与保湿 | 扩张器状态/开始日期/频率/每次时长/尺寸/疼痛/出血；保湿剂、润滑剂、阴道雌激素（按医嘱原文）；**不自行设定频率**（中国做法不统一） |
| | 沟通与就诊准备 | 与医生谈性的舒适度、是否已谈、想问的问题、转诊（性健康治疗/盆底康复/更年期门诊）；可导出"只给医生看"的摘要 |
| **长期随访与健康（4）** | 随访日历 | 前 2–3 年每 3–6 个月、第 4–5 年每 6–12 个月、5 年后每年；节点 = 起点 + k×间隔；不生成"下次总复查"、不暗示"可以少查" |
| | 影像与阴道细胞学 | 影像：部位/方法/结论原文/是否有指征（症状/怀疑复发/常规）；细胞学：记录但标"非常规"；**不推荐无症状常规做**，页面写"具体听医生" |
| | 慢病与第二原发癌 | 血压/BMI/血糖/血脂/运动/吸烟/骨健康；第二原发癌筛查（乳腺/结直肠/皮肤/肺）；心血管是首位死因 |
| | 体重与营养 | 份量、食物、症状、体重趋势；体重进指标；不给食谱/热量处方；肥胖与保育反应/复发相关只作解释，不做道德评判 |
| **情绪与亲密（3）** | 当下感受 | 患者/照护者各自记录、并列展示、不平均；复发恐惧、睡眠、焦虑；不承诺"消除恐惧" |
| | 身体意象与亲密 | 疤痕、脱发/体重变化、身体不再属于自己的感受；性与亲密（私密）；可选话题不是必填表 |
| | 生育焦虑与家庭沟通 | "还能不能生"、保育决策后的后悔/担忧、伴侣/父母/子女沟通；与保育线互相跳转，但不替患者做家庭决定 |
| **病情一图秀（0）** | — | 体重/出血量/同模态影像 + 分类节点（治疗/分子结果/随访）；无二级 |
| **资料与就诊（4）** | 资料库与导入 | 原件保留、MinerU 解析、失败不产候选；病理/影像/基因/出院记录分类 |
| | 整理草稿与核对 | 解析候选逐项 accept 前不进正式数据；候选带来源页与置信标记 |
| | 就诊准备与导出 | 两区导出（事实 / 我的看法与担心）+ **private 默认过滤**；问题清单版本与"已过时"标记；导出不含完整本机路径 |
| | 试验线索 | dostarlimab / pembrolizumab / lenvatinib+pembrolizumab / dMMR/MSI-H / POLEmut 降阶 / 保育治疗；线索不是推荐、不判入组资格；NMPA 状态逐药标"待核验" |

合计：一级 **10** / 二级 **30**（0+6+4+3+3+3+4+3+0+4）。单线最大 6（我的分型与分期）≤6；二级为 0 的一级 = 2（看板、一图秀）≤2；一级 10 ∈8–10；二级 30 压 24–30 上限。

### 6.4 K1–K6 与 S01–S13 覆盖矩阵

| 约束 | 落页 | 结构证据（M3 冻结时的断言） |
| --- | --- | --- |
| K1 分子三态 + 分期只并列引用 | 2·分期档案、2·分子三态、2·分型与治疗对照 | `stage_rows` **无**"MMR 缺失→自动改期"推导列/触发器；`molecular_rows` 三态 CHECK；`final_label` 为 TEXT 原文；对照表只有 `guideline_quote` + `source_id`，无 `recommendation` 列 |
| K2 Lynch 家系第三方 private | 5 全部 3 页 | `family_rows.visibility` 默认 `private`；`third_party=1` 行必须 `consent=1` 才可写；导出/摘要/一图秀三出口过滤；**不存亲属姓名**（只存关系+代号） |
| K3 保育零推荐/零成功率 | 4 全部 3 页 | 词表测试扫"成功率/活产率/建议用/首选"；`fertility_rows` 无 `success_rate` 列；只存 `counseling_note`（医生原文）与时间线 |
| K4 出血日志独立轨道 | 2·出血日志 | `bleeding_rows` 与通用 `events` **分表**；无病因/良恶性/严重度列；一图秀只画量/频次，不判读；看板只显示"出血待记录"状态 |
| K5 分型/治疗对照只引用 | 2·分型与治疗对照 | 每条含 `guideline_source` + `guideline_date` + `quote_text`；**无**"推荐等级/应做"字段；界面常显"解释不是判断" |
| K6 放疗后私密默认 private | 6 全部 3 页 | `vaginal_rows`/`dilator_rows`/`sexual_comm_rows` `is_private DEFAULT 1`；三出口单测；导出层不得包含；可"完全跳过不填" |

| 场景（SCENARIOS） | 落页 |
| --- | --- |
| S01 分型看不懂（POLE/MMR/p53） | 2·分子三态 → 2·分型与治疗对照 |
| S02 Lynch 筛查/子女要不要查 | 5·MMR 与胚系检测 → 5·家系记录 → 5·告知与监测计划 |
| S03 我还想要孩子（保育决策） | 4·保育决策档案 → 4·孕激素与监测 → 4·妊娠尝试与产后计划 |
| S04 绝经后又出血 | 2·出血日志（时间线）+ 10·就诊准备与导出 |
| S05 分型与化疗的关系 | 2·分型与治疗对照 + 3·治疗路径（折叠卡） |
| S06 放疗后私密不适（狭窄/干燥） | 6·私密症状记录 → 6·扩张与保湿 → 6·沟通与就诊准备 |
| S07 复诊准备（家族件） | 10·就诊准备与导出 + 7·随访日历（private 过滤） |
| S08 术后随访节奏（影像/阴道残端细胞学） | 7·随访日历 + 7·影像与阴道细胞学 |
| S09 影像并列 | 7·影像与阴道细胞学 + 9·一图秀（同模态才并列） |
| S10 营养与体重 | 7·体重与营养 |
| S11 心理与家庭（身体意象/生育焦虑 private） | 8·当下感受 + 8·身体意象与亲密 + 8·生育焦虑与家庭沟通 |
| S12 试验线索（dostarlimab/仑伐+帕博） | 10·试验线索 |
| S13 文档导入（MinerU） | 10·资料库与导入 + 10·整理草稿与核对 |

二期不占结构：遗传咨询工具化、年轻患者生育力保存（卵子冻存）联动、儿童/青少年、复发后二线治疗深化。

### 6.5 四个"独立位置"的论证 + 出血日志 + 32 号折叠卡

这是本草案最需要 G1 明确签认的部分。四条独立线不是"页多好看"，而是**语义边界**：一旦合并，词表测试和读模型断言就会失效。

**A. 为什么"我的分型与分期"必须是独立一级（分子整合分期）**

1. **FIGO 2023 已经把分子型写进期别标签**：IAmPOLEmut、IICmp53abn、IIIC1mp53abn 是合法期别；分子不是"附加检查"，而是分期的一部分。把分子放到"检查与指标"或"病理与分子"子页，界面会默认把分期与分子拆成两件事，用户永远拼不起来。
2. **K1 的隔离需要**：K1 要求"三态 + 只并列引用 + 无判定列"。独立成线后，线 2 只允许"记录/并列/回原文"；词表测试边界清晰（"该用什么药"只在线 3 出现，且仍只引用）。
3. **S01/S05 是最高频困惑**：POLE/MMR/p53 三个字母 + "为什么期别多了 m" + "分型与化疗什么关系"；这三问必须在同一线内闭环。
4. **分期会迁移**：活检、术后大病理、二次会诊、分子结果都可能改期（26.9% 迁移）。`stage_rows` 需要版本链 + `basis_text` + `change_due_to_molecular`；独立线才能承载"哪一次、依据什么、变了没有"。

**B. 为什么"保育治疗"必须是独立一级**

1. **它不是"生育记录"，而是一个治疗决策**：用孕激素/ LNG-IUD 延迟根治手术，目标是争取生育时间；cervical 的"性与生育"是记录线（生育档案/保留手术/卵巢/性健康），不承担"要不要保育"的决策结构。
2. **它有独立节奏与安全监测**：每 3–6 个月内膜活检、口服孕激素的肝功能监测、方案转换（口服→IUD+GnRH-a）、ART 转诊、产后子宫切除讨论；塞进"治疗与决策"会被"标准治疗"框架吞掉。
3. **K3 要求零方案推荐/零成功率**：独立线可以把"医生说过什么"与"文献报告范围"分开；合并后界面很容易出现"保育成功率"或"首选 LNG-IUD"的推荐句。

**C. 为什么"Lynch 与家系"必须是独立一级**

1. **肿瘤 MMR 缺失 ≠ Lynch**：所有子宫内膜癌建议做 MMR IHC 初筛，但约 3% 由 Lynch 引起；MLH1/PMS2 缺失常见于散发性甲基化。把 Lynch 塞进"分子三态"会让用户把"MMRd"直接读成"遗传病"。
2. **它处理的是胚系与家系，不是肿瘤体细胞**：胚系检测（血液/唾液）、遗传咨询、家系验证、亲属告知，是完全不同的事实层。
3. **第三方信息 + 敏感个人信息**：家系图含父母/子女/兄弟姐妹的患癌信息；PIPL 把医疗健康列为敏感个人信息，需单独同意。独立线才能把 `third_party` / `consent` / `visibility` 做成结构断言，而不是界面开关。
4. **监测节奏不同**：肠镜、妇科监测、降风险全子宫+双附件切除讨论，与肿瘤随访不同频；合并会被"下次复查"吞掉。

**D. 为什么"放疗后私密"必须是独立一级**

1. **K6 的隔离需要**：放疗后阴道狭窄/干燥/性交痛默认 private，三出口过滤；cervical 把阴道与扩张放在"放疗与长期影响"里，和肠膀胱事件/淋巴水肿/绝经并列，私密边界容易被"长期影响"稀释。
2. **它是一条纵向练习日志，不是事件列表**：扩张器频率/时长/尺寸/疼痛/出血、保湿剂、润滑剂、阴道雌激素、与医生沟通舒适度；这些是"做了没有、怎么做的"，不是"发生了什么事"。
3. **沟通障碍是核心问题**：只有 59.6% 的妇科肿瘤医生常规询问性健康；患者不好意思开口。独立线 + 默认私密 + "可以先记、准备好再给医生看"是产品立场，不是附加功能。
4. **中国做法不统一**：国际共识每周 2–3 次 × 9–12 个月，中国科普有"每月一次"；产品只记录医生给的频率，不自行设定。独立线才能把"医嘱原文"与"实际执行"分开。

**E. 出血日志：独立数据轨道，二级页，不强行独立一级**

- **为什么必须独立轨道**：K4 明确"出血日志独立轨道（频率/量/诱因，只记录不判读）"。`bleeding_rows` 与通用 `events` 分表；出血不是"症状事件"的一条，而是有模式/量/持续天数/血块/排液/诱因的结构化时间线；一图秀只画量/频次，分类节点不连线。
- **为什么放在线 2 而不是独立一级**：一级只有 10 条，且出血属于 L2"疾病本体"的起点（从症状到诊断）。独立成线会挤掉心理线或一图秀。**替代方案**（若 G1 坚持独立成线）：把"病情一图秀"降为看板二级（看板 1 二级），一级仍 10、二级 29；或把"情绪与亲密"并入"长期随访与健康"（不推荐，语义变差）。见 §6.9 张力 2。
- **确诊前形态**：第一条记录可以早于确诊数月；看板在确诊前只显示出血卡 + "什么时候该看妇科"的红线卡；确诊后才出现分子/分期/治疗卡（条件显示）。

**F. 治疗线用 32 号折叠卡（`docs/32-TREATMENT-PATHWAY-FOLDOUT.md`）**

- **硬结构五块，缺一块不算落地**：①方案（药名/剂量/周期/起止/计划 vs 实际）；②指标和趋势（阶段内关键指标，值+日期+参考语境，趋势一句话）；③影像发现（阶段内影像结论**原文**，不判读）；④副作用总结（AE/irAE 摘要，等级原文+处理原文，不归因）；⑤心理/营养措施和效果（支持措施 + **效果记录，患者原话，不评疗效**）。
- **实现契约**：原生 `<details>/<summary>`（零 JS、键盘可用、默认全部收起）；summary = `● 阶段名 · 日期 · 一句话概要 · 展开细节 ▸`；展开区 `grid repeat(2,minmax(0,1fr))`，≤900px 单列；**打印规则必须写** `@media print{.phase-detail{display:grid!important} summary::after,.ph-hint{display:none} .phase-fold{break-inside:avoid}}`；折叠卡下方保留"计划 vs 实际"表与口径说明。
- **数据形状**：`pathway: [{ d, phase, text, detail: { regimen, metrics, imaging, ae, support } }]`；demo 构建器唯一源，readmodels 还原同形状（parity）；私密内容进 support 时只写"记录存在+已过滤"，不带数值（三出口）。
- **验收进 check 链**：卡数=阶段数；默认 `[open]`=0；每卡展开 `section.pd-block`=5 且顺序固定；`@media print` 源码存在；四档宽度无溢出、summary 不竖排单字；影像/副作用无判读词；效果只含原话。

### 6.6 五处结构细则（分子/分期、保育、Lynch、放疗后私密、随访）

**分子三态 + 分期版本链（K1）**：

- **两层三态，不能一个枚举打天下**：`molecular_tests.status ∈ {not_ordered, ordered, partial, complete, unknown}`（检查层面）；`molecular_rows.result ∈ {detected, not_detected, not_tested}`（整合型层面）；但**标记级**需要更细：MMR 四蛋白 `retained/lost/equivocal/not_tested`、MSI `MSI-H/MSS/indeterminate/not_done`、POLE `pathogenic/VUS/negative/not_done`、p53 `normal/overexpression/null/cytoplasmic/equivocal/not_done`。**"未检测"不得渲染为"阴性"**（读模型 + UI 双层断言）。
- **分期档案**：`stage_rows` 一行一个版本：`anatomical_stage`（IA1…IVC）、`final_label`（IAmPOLEmut 等 TEXT）、`molecular_marker_in_stage`、`change_due_to_molecular ∈ {up, down, none, unknown}`、`basis_text`、`report_date`、`is_current`。**无 TNM/分子→期别推导列或触发器**。
- **多重分类**：`multiple_classifier=1` + `detail_text`（如 MMRd+p53abn）；POLEmut 预后优势压过其他特征，但报告要注明"多重分类"；界面不写"哪个更严重"。
- **对照表**：四型 × 三列（指南原文 / 中国获批 / 医保可及）分开；`guideline_source` + `guideline_date` + `quote_text`；**无 recommendation 列**；NMPA 未取到官方原文的逐药标"待核验"。

**保育线（K3）**：

- **前提字段**：`candidate_histology`（G1 内膜样/G2/G3/其他/未知）、`mri_myometrial_invasion`（none/<50%/≥50%/未做/未知）、`specialist_pathology_review`（G1 与不典型增生鉴别）。
- **方案记录**：`progestin_regimen`（LNG-IUD/口服甲地孕酮/甲羟孕酮/GnRH-a/联合）、剂量、起止；`liver_function_monitoring`；副作用（肝损/体重/情绪/出血）。
- **随访**：`biopsy_interval_months`（常见 3–6）、`biopsy_results`（日期 + CR/残留/进展）；`complete_response_date`；`conception_attempt_start`；`art_referral`；`pregnancy_date`/`delivery_date`；`postpartum_hysterectomy_plan`。
- **禁则**：不出现"成功率/活产率/建议用/首选"；文献范围（CR 77–84%、复发 29.2–35.4%、妊娠 26.7–58%、活产 20.5%）**不进产品**，或只作为"文献报告范围 + 来源 + 不是你的概率"，但 K3 要求零成功率，默认不做。

**Lynch 家系（K2）**：

- **检测链分表**：肿瘤 `mmr_ihc_result` / `mlh1_methylation` / `msi_result`；胚系 `germline_test_status`（未提供/已提供/拒绝/待出/有结果）/ `germline_gene` / `germline_variant` / `germline_classification`（pathogenic/likely_pathogenic/VUS/negative/unknown）；**VUS 不能写阳性**。
- **家系记录**：`family_rows` 存关系/癌种/确诊年龄/是否核实/代号；`third_party=1`；`consent=1` 才可写；`visibility` 默认 `private`；**不存亲属姓名**；不替亲属建档。
- **告知与监测**：`relatives_notified`（none/partial/all/unknown）、`relatives_tested_count`（不记姓名）、`surveillance_plan`（妇科/肠镜/其他）、`risk_reducing_surgery_discussed`；只记录医生原文，不给遗传建议。
- **文案**："肿瘤的 MMR 缺失像一盏提示灯：它提示可能要查 Lynch，但大多数情况并不是 Lynch。""家系图里有亲属的信息，工作台默认只存在本机，未经同意不会共享。"

**放疗后私密（K6）**：

- **字段**：`pelvic_rt_history` / `rt_type`（EBRT/VBT/both）/ `rt_end_date`；`vaginal_dryness` 0–4、`dyspareunia` 0–4、`vaginal_stenosis_suspected`、`vaginal_bleeding`；`dilator_use`（未用/计划/在用/停用）/ 开始日期 / 每周频率 / 每次分钟 / 尺寸 / 疼痛 / 出血；`moisturizer_use` / `lubricant_use` / `vaginal_estrogen`；`sexual_activity` / `communication_comfort` 1–5 / `discussed_with_clinician` / `referral`（性健康治疗/盆底康复/更年期门诊）；`private_mode`。
- **默认私密 + 三出口**：`vaginal_rows`/`dilator_rows`/`sexual_comm_rows` `is_private DEFAULT 1`；一图秀/摘要/导出各过滤一遍，收敛一个函数；可"完全跳过不填"。
- **不自行设定频率**：国际共识 5–10 分钟 × 每周 2–3 次 × 9–12 个月；中国科普有"每月一次"；产品只记录医生给的频率，页面常显"具体从哪天开始、用多大，听放疗/妇科医生"。

**随访线（L8 + L6）**：

- **主线是症状 + 妇科检查（含窥器）**：约 30% 阴道复发无症状，窥器能发现；随访频率前 2–3 年每 3–6 个月、第 4–5 年每 6–12 个月、5 年后每年。
- **影像/细胞学标"有指征 vs 常规"**：不推荐无症状常规影像；不推荐常规阴道细胞学；页面写"没有症状时常规做，证据并不支持；具体听医生"，**不能写成"不用查"**。
- **慢病与第二原发癌**：心血管是首位死因，近 90% 至少一个未诊断/未充分治疗的心血管危险因素；第二原发癌风险约一般人群 3 倍（皮肤/乳腺/肺/肠最常见）；体重/BMI/血糖/血脂/运动/吸烟/骨健康。
- **节点算法**：`next = start + k × interval`，不是"上次复查 + 间隔"；显示带宽标注"工作台约定，具体以医生为准"；不生成"下次总复查"、不暗示"可以少查"。

### 6.7 差异化判据自查与重名率实测（妇科同区，判据更严）

**数量自查**：

- 一级 **10**（∈8–10）/ 二级 **30**（压 24–30 上限）；二级为 0 的一级 = 2（看板、一图秀）≤2；单线二级最大 6（我的分型与分期）≤6。
- 若 G1 要加任一二级，必须同时砍一个（建议候选：把「检查与活检」并回「病理与分级」；把「体重与营养」并回「慢病与第二原发癌」；把「生育焦虑与家庭沟通」并回「身体意象与亲密」）。每并一处降 1；30 顶格时任何新增都要先砍。

**与 cervical 12 条一级并排（实测，三种口径）**：

cervical：看板 / 病情整理 / 我的分期 / 治疗历程 / 性与生育 / 放疗与长期影响 / 检查与指标 / 病情一图秀 / 营养支持 / 心理支持 / 复诊准备 / 临床研究。

| 口径 | 命中 | 数量 | 率 | 结论 |
| --- | --- | --- | --- | --- |
| **完全同名** | 看板、病情一图秀 | 2/10 | **20%** | ✅ 远低于 70% |
| **共享核心词（字面）** | 再加：我的分型与分期↔我的分期（分期）、治疗与决策↔治疗历程（治疗）、放疗后私密↔放疗与长期影响（放疗） | 5/10 | **50%** | ✅ 同妇科区域可接受的上限 |
| **语义归类（更严）** | 再加：情绪与亲密↔心理支持（情绪≈心理）、资料与就诊↔病情整理+复诊准备（资料/就诊） | 7/10 | **70%** | ⚠️ 正好压线；不得再把名字改回家族通用名 |

**与 breast 8 条一级并排**：完全同名 = 看板、病情一图秀，**2/8 = 25%**；语义归类再加"治疗与决策↔临床"、"长期随访与健康↔全程与康复" = 4/8 = 50%。

**二级重名（30 个候选 vs cervical 38 个）**：

- 完全同名：`分期档案`、`治疗路径`、`手术记录`、`整理草稿/核对`、`当下感受`（5/30 = **16.7%**）。
- 共享核心词：`病理与分级↔病理与分子`、`放疗记录↔放疗疗程`、`系统与内分泌治疗↔系统治疗`、`私密症状记录↔性健康（私密）`、`影像与阴道细胞学↔影像随访`、`资料库与导入↔资料库`、`就诊准备与导出↔就诊准备`、`试验线索↔2026 线索`（8 个）→ 13/30 = **43.3%**。仍低于 70%，但同妇科区域建议把 `治疗路径` 保留（32 号折叠卡的锚点）、`分期档案` 保留（FIGO 2023 的锚点），其余能改则改（如 `放疗记录` → `放疗疗程（EBRT/VBT）`、`系统与内分泌治疗` → `药物与内分泌`）。

**差异化判据（≥3 条刻意不同，实际 8 条）**：

1. **时间起点**：ENDO 有确诊前出血日志（cervical 的 V1–V8 全部确诊后）。
2. **疾病本体**：ENDO 是分子分型整合分期（FIGO 2023 m 标签、IAmPOLEmut/IICmp53abn、多重分类、26.9% 迁移）；cervical 是纯解剖 FIGO 2018 + r/p。
3. **保育**：ENDO 的保育是独立决策线（延迟手术、活检节奏、孕激素、肝功能、妊娠、产后切除）；cervical 的性与生育是记录线。
4. **遗传**：ENDO 有 Lynch 家系独立线（肿瘤 MMR ≠ 胚系；第三方 private）；cervical 无遗传线。
5. **放疗后**：ENDO 只取私密段独立（狭窄/干燥/性交痛/扩张器），放疗后其他事件并入治疗/随访；cervical 把肠膀胱/淋巴水肿/阴道/绝经合为一条线。
6. **随访**：ENDO 明确"有指征 vs 常规"、不推荐无症状常规影像/细胞学、加心血管/第二原发癌/体重；cervical 是三类节点合成一页。
7. **指标**：ENDO 无 SCC-Ag；CA125 只在初治升高者有语境，不做常规分级；L4 由病理参数 + 分子 + 代谢/体重 + 同模态影像拼成。
8. **治疗页形态**：ENDO 用 32 号折叠卡（五块 + 打印全展开）；cervical 是平坦的时间线/路径页。

**S01–S13 全部有落页**（见 §6.4）；**K1–K6 全部有结构断言**（见 §6.4）。每条线的患者句子来自 SCENARIOS/PATIENT-FLOW/BRIEF——**目前是设计假设语料，M1 访谈后必须替换并留痕**（ENDO 明确 0 一手引语）。

### 6.8 schema 草案（M2 建库输入，不是冻结）

量级：cervical 35 张；ENDO 因新增保育、Lynch、放疗后私密、出血、慢病，预计 **38–42 张**。下表按线给表，不冻结。

| 线 | 建议表 | 关键口径 |
| --- | --- | --- |
| 档案级 | `subjects` / `section_titles` / `profile_meta` | subjects 存 histology/grade/stage 摘要/menopause_status/fertility_desire/dash_keys/path；分节标题表化；零散标量走 profile_meta |
| 2 出血与确诊 | `bleeding_rows` / `exam_rows` / `biopsy_rows` / `pathology_rows` | 出血：模式/量/持续天数/血块/排液/诱因/绝经状态，无病因列；检查：TVS 厚度 mm + 测量口径 + 局限；活检：方式/是否足够/疼痛；病理：WHO 2020 + 分级 + LVSI + 肌层浸润 + 部位受累，全部原文 |
| 2 分期与分子 | `stage_rows` / `molecular_tests` / `molecular_rows` | stage 版本链：anatomical_stage + final_label + basis_text + change_due_to_molecular + is_current；分子：test 级 status + marker 级 result/method/specimen + 整合型 + multiple_classifier；三态 CHECK；无推导列 |
| 2 对照 | `guideline_quotes`（或 `reference_rows`） | 四型 × 指南原文/中国获批/医保三列；只存 quote + source + date；无 recommendation 列 |
| 3 治疗 | `pathway_rows` / `surgery_rows` / `rt_rows` / `systemic_rows` / `hormone_rows` | pathway 存 32 号五块 detail JSON（或分表）；surgery：TH/BSO、SLN、保留卵巢、切净、并发症；rt：EBRT/VBT 分列；systemic：方案/周期/计划 vs 实际/停药原因；hormone：医嘱原文 |
| 4 保育 | `fertility_rows` / `progestin_rows` / `pregnancy_rows` | 保育候选/意愿/告知；孕激素方案/剂量/副作用/肝功能；活检结果时间线/CR/妊娠/ART/产后切除；无成功率列 |
| 5 Lynch | `lynch_test_rows` / `family_rows` / `family_comm_rows` | 肿瘤检测与胚系检测分表；family_rows 存关系/癌种/年龄/核实/代号 + third_party + consent + visibility（默认 private）；不存姓名 |
| 6 放疗后私密 | `vaginal_rows` / `dilator_rows` / `sexual_comm_rows` | 症状 0–4；扩张器频率/时长/尺寸/疼痛/出血；保湿/润滑/阴道雌激素；沟通舒适度；is_private 默认 1 |
| 7 随访与长期 | `followup_rows` / `visit_rows` / `imaging_rows` / `survivorship_rows` / `nutrition_rows` | 随访计划/节点；每次就诊：症状清单/窥器/盆腔检查/CA125（如适用）/影像是否有指征/细胞学（标非常规）；慢病：BP/BMI/血糖/血脂/运动/吸烟/骨/第二原发癌；营养：份量/食物/症状/体重 |
| 8 情绪与亲密 | `viewpoints`（通用）/ `body_image_rows` / `fertility_anxiety_rows` / `sexual_rows` | 双主体 author_role；私密标记；身体意象/生育焦虑/性健康；三出口过滤 |
| 9 一图秀 | `events` / `metric_points`（通用） | 体重 + 出血量/频次 + 同模态影像；分类节点只画点；无 SCC-Ag；跨模态不共轴 |
| 10 资料与就诊 | `documents` / `candidate_fields` / `exports` / `questions` / `trials` | 事实四层不合并；两区导出；private 默认过滤；线索不是推荐；NMPA 状态字段 |
| 通用平移 | `metrics` / `metric_points` / `events` / `rhythm` / `cycles` / `treatment_lines` / `viewpoints` / `trials` / `documents` / `candidate_fields` / `demo_meta` + `profile_meta` | 机制照 cervical；词表/字段换 ENDO |

**ENDO 无常规血清肿瘤标志物**（这点必须写进 DIFF-MATRIX）：CA125 只在初治升高者有随访语境，**不做 CTCAE 式分级、不做趋势预测**；L4 指标分析线由四源拼成：病理参数（组织学/分级/LVSI/肌层浸润）、分子（MMR/p53/POLE）、代谢与体重（BMI/血糖/血脂/血压）、同模态影像测量。一图秀默认选线相应改为"体重 + 出血量/频次 + 同模态影像"，而不是"肿瘤标志物"。

### 6.9 已知张力（G1 决策点，写明不沉默）

1. **30 个二级顶格**：任何新增都要先砍；最脆的是「检查与活检」「体重与营养」「生育焦虑与家庭沟通」。
2. **出血日志：二级 vs 独立一级**：本草案放线 2（确诊前入口 + 疾病本体同属 L2），理由是 10 条一级上限。若 G1 要求独立成线，唯一较干净的置换是**把「病情一图秀」降为看板二级**（看板 1 二级；一级仍 10、二级 29；0 二级线变 1 条），或把「情绪与亲密」并入「长期随访与健康」（不推荐，语义变差且 L7 失独立）。必须在 G1 二选一，不能一边说"独立轨道"一边没有独立页。
3. **心理线独立 vs 合并**：本草案保留独立「情绪与亲密」，因为生育焦虑/身体意象/家系沟通是 ENDO 的高频且高敏感内容；若 M1 访谈显示心理需求低，可降为「长期随访与健康」的 2 个二级（一级变 9），但必须保留 private 与双主体断言。
4. **分子三态 vs cervical 四态**：cervical `molecular.state` 是 ok/na/warn/pending 四值。K1 要求"三态（未检测≠阴性）"，但 ENDO 的标记级需要四蛋白/五模式。本草案建议**两层**：`molecular_tests.status`（not_ordered/ordered/partial/complete/unknown）+ `molecular_rows.result`（detected/not_detected/not_tested）+ 标记级专用枚举。G3 冻结前必须定稿，不能一边四态一边三态。
5. **"期别变了"的呈现**：`stage_rows` 必须有版本链与 `change_due_to_molecular`，但界面不能写"升级/降级"吓人；文案建议"医生说期别变了，先问清楚依据哪一条、是解剖期还是分子标记"。G1 确认用词。
6. **Lynch private 默认值 vs 家族 `visibility` 默认 shared**：26 §4.3 的通用做法是 `visibility` 默认 `shared`（不破坏既有数据），写入口显式选择；但 K2 明确"家系成员第三方信息默认 private + 显式授权"，K6 明确"放疗后私密默认 private"。本草案建议**这两组表默认 private**，与家族通用默认不同；G1/G3 必须签认这个例外，并写进 freeze-contract。
7. **保育零成功率 vs 文献数字**：medical-constraints 有 CR 77–84%、复发 29.2–35.4%、妊娠 26.7–58%、活产 20.5%；K3 要求零成功率。本草案默认**不显示任何成功率**；若未来要显示，必须"文献报告范围 + 来源 + 年份 + 不是你的概率"，且不能出现在保育决策页首屏。
8. **随访措辞边界**："不推荐无症状常规影像/细胞学"极易被读成"不用查"。文案必须写"没有症状时常规做，证据并不支持；具体听医生"，不能写"可以少查/不用查"。
9. **试验线索的 NMPA 状态**：帕博利珠单抗 2026-02 报道获批（联合卡铂+紫杉醇，dMMR 一线），但未取到 NMPA 官方原文；多塔利单抗未检索到批准。界面逐药标"待核验"，不能写"已在中国获批"。
10. **30 号探针缺失**：ENDO 有 `docs/30-RESPONSIVE-RULES.md`，但 `scripts/probe-responsive.mjs` 与 `test/responsive.test.mjs` 都没有；M2 必须补，否则 30 号只是文档。
11. **32 号折叠卡的私密块**：support 块可能含心理/私密内容；三出口过滤后只写"记录存在+已过滤"，不带数值；打印时也不能绕过过滤。
12. **品牌与色板**：「小膜宝 EndoPal」与藕荷 #8A5B7B 是 DEV-REQUIREMENTS 占位默认；icon 未定。家族已有青/粉/紫莲/绿等多套，G1 从"内膜/藕荷/沉静"意象定三档色，避免与既有工作台撞色。

### 6.10 30 号与 32 号在 ENDO 的验收落点

| 项 | M2 原型阶段 | M6 装机阶段 |
| --- | --- | --- |
| 30 号 | 跑 `probe:resp`（1180/900/600 三档 × 10 个一级页）；六处高发区逐一过：出血时间线、分子三态 × 分期三列、保育活检时间线、Lynch 家系图、放疗后私密卡、32 号折叠卡展开区 | 真机窗口 + AI 面板展开后再跑一遍；窄屏抽屉打开时业务区宽度不回弹 |
| 32 号 | 卡数=阶段数；默认 `[open]`=0；每卡 5 块顺序固定；`@media print` 源码存在；四档宽度无溢出；summary 不竖排单字；影像/副作用无判读词；效果只含原话 | 打印/导出实测；私密块过滤；readmodels 与 demo 同形状（parity） |
| 私密三出口 | 单测：一图秀/摘要/导出各过滤一次；`includePrivate=true` 才返回；家系 `third_party` + `consent` 断言 | 真机导出文件检查；不含亲属姓名/完整本机路径 |

---

## 七、移植注意（cervical 0.1.1 → ENDO）

**先看差距（实测）**：

| 层 | cervical 0.1.1 | ENDO 0.1.0 现状 | 移植动作 |
| --- | --- | --- | --- |
| 客户端 | `src/client.js` 482 行 + `build-client.mjs` 116 行 + `lib/client.js` 488 行 + `lib/layout.js` | `lib/client.js` 42 行占位；无 `src/`；无 `lib/layout.js`、`lib/version.js` | M5 第一优先：整段搬 customFrame 外壳，换 14 token + 8 品牌点 |
| 数据层 | `dsh/` 12 文件（demo/export/import/index/layout/mineru/readmodels/routes/server/settings/store/workbench） | `dsh/` 只有 25 行 `index.js`（health） | 11 件全平移；API 前缀 `/api/cervical` → `/api/endometrial`；现有 health 路径统一 |
| schema | 0001 34 表 + 0002 1 表 + freeze-contract + check-schema | 无 `schema/` | 从零建，但**机制照抄**：迁移冻结 sha256、只增不改、check-schema 拦旧文件 |
| 原型 | `prototypes/v0.2/` 四件套 + `public/` 四件套 | 无 `prototypes/`、无 `public/` | M2 建 `prototypes/v0.2/`；PAGES/SUBPAGES 常量按 §6.3；`public/` 与原型逐字符 parity |
| 工程 | 11 个 scripts（build-client/version、check-demo-columns/install/pack/schema/syntax/version/wording/workbench-package、dev-server） | 7 个 scripts（conformance/install/workbench-package/fetch-trials/probe-page-view/serve-artifact/verify-tabs） | 补 check-schema / check-wording / check-syntax / check-version / check-demo-columns / build-client / build-version / dev-server；现有 3 个 check 并入 check 链 |
| 测试 | 家族测试件（含 responsive 参考在 GBM） | 只有 `test/pack-contents.test.mjs` | 新建 `test/responsive.test.mjs` + 私密三出口单测 + 32 号折叠卡断言 |
| 版本 | VERSION 0.1.1 + lib/version.js + build-version | VERSION 0.1.0；无 lib/version.js | VERSION 唯一来源；build-version 生成 lib/version.js；check-version 四处一致 |
| 文档 | SPEC/SCHEMA/DIFF-MATRIX 等 | 67 个 md，但 DIFF-MATRIX/SCHEMA/交互设计仍缺 | 本篇 → DIFF-MATRIX；M1 回填 SPEC/USER-RESEARCH/INTERACTION-DESIGN |

**直接复用（文件级，改 ID/品牌后原样搬）**：

| 层 | 文件 | 说明 |
| --- | --- | --- |
| 客户端 | `src/client.js` + `scripts/build-client.mjs` + `lib/layout.js` | customFrame 外壳全结构（顶栏/会话/宽度/草稿桥/抽屉/broken 兜底）零癌种内容；只换 §三的 14 token 源头 + 8 处手写品牌 |
| | `lib/version.js` + `scripts/build-version.mjs`、`lib/zip.js` | 版本唯一来源、导出打包 |
| 数据层 | `dsh/` 12 文件：server/routes/store/import/export/readmodels/settings/mineru/layout/index/workbench/demo | 零依赖 http + 127.0.0.1 + 前缀改写；导入-解析-候选管线、候选 accept、导出模板、设置三区全保留。**ENDO 现状只有 index.js，11 件全要平移**（ENDO 已有 fetch-endometrial-trials-2026.mjs，可并进 import/trials） |
| | `schema/freeze-contract.md` 机制 + 0001/0002 结构 | 迁移冻结与"只增不改"执行器；表内容全换。**ENDO 无 schema/，从零建但机制照抄** |
| 工程 | `scripts/check-{schema,syntax,version,wording,pack,workbench-package,install,demo-columns}.mjs`、`dev-server.mjs` | 家族检查器；wording 红线按 K1–K6 扩；check-demo-columns 对 ENDO 新列重配；ENDO 现有 3 个 check 脚本可保留但需并入 check 链 |
| 原型 | `prototypes/v0.2/` 骨架段 + `public/` 四件套 | PAGES/SUBPAGES/SUBTITLES 常量结构、`state` 模型（view/sub/sel/range/zoom/pin/flipped/privateOpen）、hash 路由 + go-* 动作表、esc/fmtDate/delta、pageHead/subnav、3D 翻面 flipCard、sidebar/breadcrumb/index.html 壳（skip-link 与 `#main` 焦点管理）、一图秀 SVG 段 |
| 样式 | `style.css` 令牌骨架 | 五组令牌结构保留，色值整组换藕荷系 |
| 窄宽 | GBM/MEL 的 `scripts/probe-responsive.mjs` + `test/responsive.test.mjs` | ENDO 仓没有 30 号实现，从参考实现抄 SCAN 段与测试，只换 `#main`/hash 与示例词 |
| 折叠卡 | MEL v0.3.1 `pageTreatPathway()` + `.phase-fold` 段（32 号） | 原生 details/summary + 五块 + 打印规则；ENDO 直接按 32 号文档落地 |

**必须换掉（不许换名复用）**：

1. **20 张 cervical 专属表** → ENDO 专属表（出血、检查/活检、病理、分期、分子检测/标记、保育、孕激素、妊娠、Lynch/家系、放疗后私密、随访、慢病、体重、身体意象、生育焦虑……按 §6.8 逐页配表）。通用 14 张平移：`subjects`/`section_titles`/`metrics`/`metric_points`/`events`/`rhythm`/`cycles`/`treatment_lines`/`viewpoints`/`trials`/`documents`/`candidate_fields`/`demo_meta` + `profile_meta`。注意：cervical 的 `molecular` 表是"一个 profile 一组四态"，ENDO 需要 **test 级 + marker 级 + 整合型** 三层，不能直接换词表。
2. **cervical 五条口径 A–E → ENDO 重写**：A FIGO 2018 只抄 → **FIGO 2023 解剖期 + m 标签只抄，无推导**；B EBRT/后装分列 → **EBRT/VBT 分列 + 肿瘤/胚系分表 + 解剖期/整合标签分列**；C 细胞学原文 → **病理/影像/遗传只存原文 + 数值带单位/方法**；D 性与生育私密 → **放疗后私密 + Lynch 第三方 + 生育焦虑默认 private + `third_party`/`consent`**；E SCC-Ag 条件显示 → **保育候选/放疗史/MMR/绝经驱动显示**。
3. **demo 画像与指标字典**：鳞癌 IIIC → **四档案**（绝经后出血 + p53abn；年轻未育 G1 保育；Lynch MSH2；放疗后私密 EBRT+VBT）；SCC-Ag/细胞学/HPV → **病理参数（组织学/分级/LVSI/肌层浸润）+ MMR/p53/POLE 三态 + 体重/BMI/血糖/血脂 + 同模态影像测量**；演示律照家族（化验 2–4 周一点、影像不加密；ENDO 特例：**出血日志至少一条要跨数月**，体现"症状远早于确诊"；保育时间线至少 3 次活检）。
4. **文案全量**：SUBTITLES 10 条、看板任务卡与 go-* 跳转、页脚免责句、onboardingPrompt 5 行、Fallback/顶栏 hint——全部按 ENDO 立场重写。新增词族：**"未检测≠阴性""VUS≠POLEmut""p53 异常≠浆液性癌""MMRd≠Lynch""分子分型不是遗传检测""期别多了 m 不是写错""保育不是治愈""扩张器频率听医生的""两条随访线不同频是正常的""不推荐常规做≠不用查"**。
5. **品牌与身份**：TITLE/PANEL_TITLE、icon、藕荷全套色板、WIDTH_KEY/DRAFT_QUEUE_KEY 前缀、`endo:agent-draft` 消息类型（业务侧 postMessage 两端同改）、package.json name/repository（name 已定 endometrial-workbench）、cordis.patch.yml（`dshHomePath('endometrial-workbench')`）、API 前缀 `/api/endometrial`。
6. **30 号落地**：补 `scripts/probe-responsive.mjs` + `test/responsive.test.mjs`；`#main`/hash 换 ENDO；示例词去 GBM 化（KPS/MRI/激素 → FIGO 2023/LVSI/MMR/内膜厚度/扩张器）；验收写进 M2 与 M6 两处。
7. **32 号落地**：治疗路径页按 32 号五块 + 打印规则；demo 与 readmodels 同形状；check 链加折叠卡断言；私密 support 块只写"记录存在+已过滤"。
8. **Lynch 家系的隐私结构**：不能照抄 cervical 的 `is_private` 单列；需要 `visibility`（shared/private）+ `third_party` + `consent` 三列，且 `family_rows` 不存亲属姓名；导出/摘要/一图秀三出口各过滤一遍；这是 ENDO 与 cervical 在数据层最大的不同。

**迁移顺序（照 DEV-PLAN M0–M7）**：

1. **M1**：本篇 → `docs/DIFF-MATRIX.md` 全量行；SPEC/USER-RESEARCH/INTERACTION-DESIGN 回填；G1 签认 10/30 与四条独立线。
2. **M2**：`prototypes/v0.2/` 四件套 + `public/` 四件套 + 32 号折叠卡 + 30 号窄宽扫描；独立评审（G2）。
3. **M3**：schema 从零建（0001 + 0002 或更多迁移）+ freeze-contract + check-schema；G3 冻结。
4. **M4**：2026 试验库（dostarlimab/pembrolizumab/lenvatinib+dostarlimab/POLEmut 降阶/保育），NMPA 状态字段。
5. **M5**：七步移植（dsh 11 件 + client 链路 + MinerU + apiBase + check 链 + HVT）；私密三出口单测。
6. **M6**：装机（先新建会话）+ 真机截图 + 30 号复跑。
7. **M7**：发布 + BACKLOG 回填 + 回流。

**移植验收（最小集）**：

- `npm run check` + `npm test` + `npm run audit` 全绿；VERSION 四处一致；`lib/client.js` 由 `src/client.js` 构建且 `--check` 通过；customFrame/businessWidth 0.65/会话 25%–45%/红绿灯避让/会话常挂载/草稿桥全部实测。
- `check-schema` 拦旧迁移；`check-wording` 扫 K1–K6 红线词；`check-demo-columns` 对新列全绿；`probe:resp` 三档 × 10 页无溢出；`test/responsive.test.mjs` 通过。
- 私密三出口：一图秀/摘要/导出各过滤一次；家系 `third_party` + `consent` 断言；导出不含亲属姓名与完整本机路径。
- 32 号：卡数=阶段数、默认 0 展开、每卡 5 块、打印规则、四档宽度、影像/副作用无判读词、效果只含原话。

**最后一句**：ENDO 与 cervical 同属妇科，但**不是"宫颈癌换几个词"**。cervical 的核心是"FIGO 2018 + 放疗长期影响"；ENDO 的核心是"FIGO 2023 分子整合分期 + 保育决策 + Lynch 家系 + 放疗后私密 + 出血前段"。移植时把 cervical 当**外壳与工程底本**，把 breast 当**产品立场与卡片底本**，结构必须按 §6.3 重新长。
