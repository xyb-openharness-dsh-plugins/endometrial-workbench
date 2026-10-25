# 变更记录

只增不删；每条写清"改了什么 + 为什么 + 用户可见结果"。版本号与 VERSION、package.json 三处必须一致。

## 0.2.0 — 2026-10-25

- M2 交付：`demo/build-demo-data.mjs` 唯一数据源（两档案 × 6 个月：周慧敏 52 女 / 李思 31 女），生成 `prototypes/v0.2/demo-data.js` 与 `demo/demo-data.json`。
- `prototypes/v0.2/` 四件套上线：10 一级 / 30 二级（共 32 视图 × 2 档案 = 64 页签）；品牌「小膜宝 EndoPal」藕荷 `#8A5B7B` / 行动橙 / 暖灰。
- 继承家族定稿件：一图秀 Fritsch–Carlson + `.chart .line` computed `fill:none`；AI 协助 `endo:agent-draft`；32 号治疗线折叠卡（3 阶段 × 五块，默认收起、打印全展开）；30 号窄宽六条 + `probe:resp`；候选核对闭环；编辑 ≤1/页、表单 ≤6。
- 三条探针移植：`probe:proto`（64 视图截图 + 溢出/error/禁词/必现句/fill）、`probe:resp`（90 视图窄宽）、`check:hvt`（X1–X4）。
- `docs/INTERACTION-DESIGN.md` 填全 v1（13 路径 + CRUD 矩阵 + 表单预算）；README 按 33 号带 6 张实渲截图（含折叠卡收/展各一张）。
- 用户可见结果：可直接双击 `prototypes/v0.2/index.html` 走完 13 条患者路径；所有判断留在医生侧，私密与家系第三方信息默认不进一图秀/摘要/导出。

### M5 · 开发版（同一 0.2.0）

- `dsh/` 11 件：`store`（执行 32 表迁移）、`server`（静态 + 路径穿越拦截）、`routes`（`API_PREFIX='/api/endometrial'`，两条链路共用）、`workbench`（`DB_FILE='xyb-endometrial.sqlite'`）、`index`（宿主接线 + 懒重试）、`demo`（幂等单事务播种）、`readmodels`（与 demo-data.js **deepStrictEqual parity**）、`mineru`/`settings`/`parse`/`endoparse`（MinerU 六部件）。
- `lib/{layout,version,zip,client}.js` + `src/client.js` → `scripts/build-client.mjs`：真客户端链路（小膜宝 EndoPal / 子宫内膜癌；监听 `endo:agent-draft`；customFrame 65/35、25%–45% 可拖）。
- `public/` 四件定点替换：数据改走 `/api/endometrial/bootstrap`（apiBase 定稿契约，双形态回归），AI 五态 + 宽度记忆 + 异步启动；**打印 beforeprint 块**与 Fritsch–Carlson/`fill:none` 原样保留；`style.css` 与原型逐字节一致。
- schema 敞口不新增：32 表原样执行；`family_member`/`rt_priv`/`viewpoint` 默认 `private`，`molecular_marker.status` 三态（检出/未检出/未检测）。
- 检查链：版本 10 处同源、语法 49 文件、冻结 sha256、文案红线 0、列一致 32 表/244 列、单测 37、包结构 37/37、**分期一致性**；无头 64 页签（API 数据源）、HVT X1–X4、窄宽 90 视图、computed fill=none、tgz 占位 0 + 四要素。
- 未做（不计通过）：装机（M6）、真机截图刷新（33 号，M6 后）、真实病例、离线语料。

## 0.1.0 — 2026-10-25

- 由社区脚手架 dsh-wb-cli@1.5.3 (e98fba0+dirty) 初始化，仅有注册骨架与健康接口，无业务功能。

## 0.3.0（2026-10-25）· 临床试验匹配（35 号四段链路）

- 试验线索页重写：**建档（只列已确认入库字段）→ 检索双通道终态（本地快照+在线，FAILED 不计覆盖）→ 分层线索（结构化/文本/宽口径，每条带命中证据链）→ 无法自动匹配（逐条原因，不是「不适用」）**。
- 匹配检查器 `scripts/check-trial-matching.mjs` 进 check 链（三态词/禁判读列/未核实+快照）。
- 匹配结果走 `docs.trialMatch`（dataset_state 同源），登记数据与匹配结果分离。

## 0.3.1（2026-10-25）· 化验与指标趋势 + 慢病生活合并

- followup 线新增「**化验与指标趋势**」页（代谢与心血管监测语境：血压/BMI/血糖/血脂 + 体重/出血天数/内膜厚度趋势图；不解读、不给目标值）。
- 「慢病与第二原发癌」与「体重与营养」合并为「**慢病与生活方式**」（总页签守 30 上限）。
