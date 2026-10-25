# 变更记录

只增不删；每条写清"改了什么 + 为什么 + 用户可见结果"。版本号与 VERSION、package.json 三处必须一致。

## 0.2.0 — 2026-10-25

- M2 交付：`demo/build-demo-data.mjs` 唯一数据源（两档案 × 6 个月：周慧敏 52 女 / 李思 31 女），生成 `prototypes/v0.2/demo-data.js` 与 `demo/demo-data.json`。
- `prototypes/v0.2/` 四件套上线：10 一级 / 30 二级（共 32 视图 × 2 档案 = 64 页签）；品牌「小膜宝 EndoPal」藕荷 `#8A5B7B` / 行动橙 / 暖灰。
- 继承家族定稿件：一图秀 Fritsch–Carlson + `.chart .line` computed `fill:none`；AI 协助 `endo:agent-draft`；32 号治疗线折叠卡（3 阶段 × 五块，默认收起、打印全展开）；30 号窄宽六条 + `probe:resp`；候选核对闭环；编辑 ≤1/页、表单 ≤6。
- 三条探针移植：`probe:proto`（64 视图截图 + 溢出/error/禁词/必现句/fill）、`probe:resp`（90 视图窄宽）、`check:hvt`（X1–X4）。
- `docs/INTERACTION-DESIGN.md` 填全 v1（13 路径 + CRUD 矩阵 + 表单预算）；README 按 33 号带 6 张实渲截图（含折叠卡收/展各一张）。
- 用户可见结果：可直接双击 `prototypes/v0.2/index.html` 走完 13 条患者路径；所有判断留在医生侧，私密与家系第三方信息默认不进一图秀/摘要/导出。

## 0.1.0 — 2026-10-25

- 由社区脚手架 dsh-wb-cli@1.5.3 (e98fba0+dirty) 初始化，仅有注册骨架与健康接口，无业务功能。
