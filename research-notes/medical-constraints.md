# 子宫内膜癌工作台 · 医学约束与诊疗路径（调研素材）

> 版本：2026-10-24  
> 用途：给「子宫内膜癌患者工作台」做字段设计、内容分层和边界判断的事实底稿。  
> 阅读方式：每一节固定三块——**患者视角关键事实 / 字段建议 / 来源**。  
> 硬边界：本文是**调研素材，不是诊疗建议**；产品只能呈现“指南写的是……”“患者可以记录……”，不能生成“你应该……”。所有面向患者的解释句都标 **（解释不是判断）**。

## 0. 先立三条规矩

### 0.1 三类句子必须分开

| 类型 | 例子 | 能否进产品 |
| --- | --- | --- |
| 指南原文/结构 | “FIGO 2023 把 POLEmut 的 I–II 期记为 IAmPOLEmut” | 可以，标出处与版本 |
| 患者事实/体验 | “绝经后任何阴道出血都应按异常处理” | 可以，标“解释不是判断” |
| 处置建议 | “你应该做化疗 / 你应该切除子宫” | **不可以**，只能引导就医与记录 |

判据：能写成“指南这一条写的是……”的可以进；只能写成“你应该……”的一律不进。

### 0.2 证据标记

| 标记 | 含义 | 界面处理 |
| --- | --- | --- |
| A | 指南/法律原文或开放全文，且交叉核对 | 可直接作为字段说明 |
| B | 单一可信来源（学会指南转载、医院患教、单中心研究） | 进调研与内容库，标来源 |
| C | 二手会议报道、医生科普、商业媒体 | 只做背景，不作阈值依据 |
| 待核验 | 官网反爬、登录墙、未取得全文 | 界面不写确定结论，标“待核验” |

### 0.3 字段命名

字段用 `snake_case`；日期统一 `YYYY-MM-DD`；每个事实字段必须能挂 **来源类型 / 来源机构 / 来源日期 / 核验状态**。患者自报与病历导入分开存，不合并成“事实”。

---

## 1. 异常出血与确诊

### 1.1 患者视角关键事实

- **绝经后任何阴道出血都不是“正常现象”**。FIGO 2025 更新明确：绝经后出血（PMB）是最常见症状，任何 PMB 都应触发对子宫内膜癌的紧急评估；评估手段包括经阴道超声（TVS）、宫腔镜和/或内膜活检。[S02]
- 绝经前患者的表现不典型：可能是月经量多、经期延长、经间期出血，也可能是稀发月经/闭经；这些都不等于癌，但“和自己以往不一样”的出血值得检查。[S02][S04]
- **症状出现时，患癌概率并不是固定数字**：有症状女性中，<40 岁约 0.33%，>80 岁约 24%。这个跨度说明“年龄+症状”决定检查紧迫度，而不是单靠一个症状下结论。[S02]
- **TVS 内膜厚度是分诊线索，不是确诊**。5 mm 阈值对子宫内膜癌的敏感度 96.2%、阴性预测值 99.3%，但特异度只有 51.5%——厚度正常仍不能替代症状评估，厚度异常也不等于癌。[S02] 国内 2022 版指南的表述是：绝经后内膜 <5 mm 阴性预测值可达 96%，>5 mm 应行内膜活检。[S05]（正文用转载件 [S05b] 核对）
- **确诊必须取组织**。诊室内膜取样（Pipelle 等）敏感度 90%–100%、特异度 98%–100%，但取样失败/不足率可高到 42%，原因包括组织太少、宫颈狭窄、疼痛难忍。[S02]
- 宫腔镜可直视定位活检，适合局灶病变，能降低盲刮漏诊；国内指南同时提醒尽量降低膨宫压力、缩短操作时间。[S05][S02]
- 国内患教常把“分段诊刮”称为确诊金标准，并配合 B 超、CT/MRI、CA125 做范围评估；这是临床路径的通俗表达，具体选择仍由医生决定。[S13]
- 患者真实体验里，出血可能只是少量血丝或血性分泌物，也可能伴臭味排液；**“量少”不代表可以等**。[S13][S04]
- 中国三甲患教提醒：子宫内膜癌没有像宫颈 HPV 那样的普通人群筛查手段；无症状的一般人群不推荐常规内膜筛查，但肥胖、多囊卵巢综合征、不孕、长期雌激素/他莫昔芬、Lynch 综合征等人群需要个体化监测。[S15]

### 1.2 字段建议

| 字段 | 类型/取值 | 设计说明 | 依据 |
| --- | --- | --- | --- |
| `menopause_status` | enum: pre / peri / post / unknown | 决定“出血”解释路径的第一分叉 | S02 |
| `bleeding_pattern` | enum: postmenopausal_any / heavy_period / prolonged / intermenstrual / spotting / postcoital / none | 不把“绝经前”默认成安全 | S02, S04 |
| `bleeding_start_date` | date | 症状起点，用于计算就诊延迟 | 产品字段 |
| `bleeding_amount` | enum: spotting / light / moderate / heavy / unknown | 与“量少可等”的误区对照 | S13 |
| `bleeding_duration_days` | integer | 记录持续天数 | 产品字段 |
| `clots` | boolean / unknown | 辅助描述，不作诊断 | 产品字段 |
| `discharge` | enum: none / serous / bloody / foul / unknown | 浆液性/血性/臭味排液 | S13 |
| `pelvic_pain` | boolean / unknown | 症状谱之一，不用于排除 | S04 |
| `anemia_symptoms` | boolean / unknown | 头晕、乏力、心悸等 | 产品字段 |
| `tvs_date` | date | 超声日期 | S02 |
| `endometrial_thickness_mm` | decimal / unknown | 必须带单位和测量口径 | S02, S05 |
| `tvs_limitation` | multi: fibroids / adenomyosis / HRT / poor_visualization / none / unknown | 解释厚度为何可能不可靠 | S02 |
| `biopsy_type` | enum: office_pipelle / hysteroscopy_dnc / dnc / other / none | 记录实际路径 | S02, S05 |
| `biopsy_date` | date | 病理起点 | 产品字段 |
| `biopsy_adequacy` | enum: adequate / inadequate / failed / unknown | 失败率可高到 42%，需要复检提醒 | S02 |
| `biopsy_pain_score` | 0–10 / prefer_not_to_say | 患者体验字段，非临床指标 | 产品字段 |
| `path_report_date` | date | 确诊时间 | 产品字段 |
| `referral_path` | enum: gynecology / gynecologic_oncology / other / unknown | 是否转到妇科肿瘤 | 产品字段 |
| `patient_concern` | multi: cancer / delay / fertility / cost / other | 患教内容路由 | 产品字段 |

### 1.3 人话文案（解释不是判断）

- “绝经后哪怕只有一点血丝，也建议尽快看妇科，而不是等到下次体检。”（解释不是判断）
- “超声内膜厚度更像门口的安检机：它能提示要不要进一步取样，但不是最终诊断。”（解释不是判断）
- “诊室取样有时取不到足够组织，需要再做宫腔镜或刮宫；这不等于医生漏诊。”（解释不是判断）

### 1.4 来源

| ID | 机构/作者 | 标题 | 日期 | 类型 | URL | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| S02 | FIGO / Koskas M 等 | Cancer of the corpus uteri: A 2025 update | 2025-09 | 国际指南更新全文（开放） | https://pmc.ncbi.nlm.nih.gov/articles/PMC12411821/ | 非中国指南，资源与人群不同 |
| S04 | NCCN | NCCN Guidelines for Patients: Uterine Cancer, 2026（基于 Uterine Neoplasms V2.2026） | 2025-11-14 | 患者版指南 | https://www.nccn.org/patients/guidelines/content/PDF/uterine-patient.pdf | 患者版，非专业版；美国口径 |
| S05 | 国家卫生健康委办公厅 | 子宫内膜癌诊疗指南（2022年版） | 2022-04 | 国家指南 | https://www.nhc.gov.cn/yzygj/c100068/202204/0c1f7d3aca0545abbeb02030ce255930.shtml | 官网 412 反爬，正文用转载件核对；采用 FIGO 2009 分期 |
| S05b | 人人文库用户转载 | 子宫内膜癌诊疗指南（2022年版） | 2024-08-24 上传 | 转载件 | https://www.renrendoc.com/paper/344026473.html | 非官方发布页，仅用于核对条文 |
| S13 | 科普中国（湖南省第二人民医院 杨欣） | 绝经后阴道出血，别忽视！小心是子宫内膜癌的“无声警报” | 2024-11-08 | 患教 | https://www.kepuchina.cn/article/articleinfo?ar_id=543143&business_type=100&classify=0 | 未给内膜厚度数值 |
| S15 | 北京协和医院 | 告诉你妇科癌症筛查的秘密 | 2016-04-18 | 医院患教 | https://www.pumch.cn/detail/13171.html | 年代较早，筛查观点需与新版指南合并看 |

---

## 2. 病理与分级

### 2.1 患者视角关键事实

- **“I 型/II 型”是历史概念，不是今天的病理报告格式**。Bokhman 1983 年提出：I 型以子宫内膜样癌为代表，多见于围绝经/绝经早期，低级别、早期、激素受体阳性；II 型以浆液性癌为代表，多见于高龄绝经后，高级别、晚期、激素受体阴性。[S02]
- 但两型在临床、病理和激素受体上有大量重叠，病理学界并未把它作为常规分类；目前用的是 **WHO 2020 形态学分类**，包括子宫内膜样癌、浆液性癌、透明细胞癌、癌肉瘤、未分化/去分化癌、混合性癌、中肾样癌、胃肠型黏液癌、神经内分泌癌等。[S02]
- **“G1/G2/G3”是组织学分级，不是分期**。对子宫内膜样癌，按实性生长区比例：G1 ≤5%，G2 6%–50%，G3 >50%；核异型超出分级时应升一级；浆液性、透明细胞、癌肉瘤等按定义就是高级别。[S02][S05]
- 临床常把 G1–G2 叫低级别、G3 叫高级别（FIGO 两分法），但这不是“良性/恶性”的分界。[S05][S02]
- **G1 与子宫内膜不典型增生在病理上可能难以区分**，不同病理医生之间有观察者差异；生育年龄患者的诊断要特别谨慎。[S02]
- 高级别子宫内膜样癌（G3）在预后、临床和分子上都很异质；不做分子分型时，它常被归入“侵袭性组织学类型”处理，以避免治疗不足。[S02]
- 浆液性癌多数为 p53abn，但 **p53 免疫组化异常不等于浆液性癌诊断**；形态学仍是基础。[S03]
- 患者要预期：**分级和分期可能在术后大病理、二次病理会诊或分子结果出来后改变**。复旦肿瘤 547 例队列中，按 FIGO 2023 重分期有 26.9% 发生分期迁移。[S22]

### 2.2 字段建议

| 字段 | 类型/取值 | 设计说明 | 依据 |
| --- | --- | --- | --- |
| `histology_type` | enum: endometrioid / serous / clear_cell / carcinosarcoma / undifferentiated / dedifferentiated / mixed / mesonephric_like / gi_mucinous / neuroendocrine / other / unknown | 采用 WHO 2020 名称，不用“I 型/II 型”做唯一字段 | S02 |
| `histology_subtype_note` | text | 记录混合成分、鳞化等 | S02 |
| `who_2020_classified` | boolean / unknown | 病理报告是否按 WHO 2020 | S02 |
| `figo_grade` | enum: G1 / G2 / G3 / not_applicable / unknown | 仅子宫内膜样癌适用 | S02, S05 |
| `solid_component_percent` | decimal / unknown | G1/G2/G3 的判读依据 | S02 |
| `nuclear_atypia_upgrade` | boolean / unknown | 核异型升一级 | S02, S05 |
| `lvsi` | enum: none / focal / substantial / unknown | ≥5 根血管为 substantial（WHO 2021） | S02 |
| `myometrial_invasion` | enum: none / <50% / ≥50% / unknown | FIGO 2023 I 期的核心 | S02 |
| `cervical_stroma_invasion` | boolean / unknown | II 期 | S02 |
| `adnexal_involvement` | boolean / unknown | IIIA1 | S02 |
| `serosal_involvement` | boolean / unknown | IIIA2 | S02 |
| `vaginal_parametrial_involvement` | boolean / unknown | IIIB1 | S02 |
| `pelvic_peritoneum_involvement` | boolean / unknown | IIIB2 | S02 |
| `lymph_node_status` | enum: negative / micrometastasis / macrometastasis / not_assessed / unknown | 对应 IIIC1i/ii、IIIC2i/ii | S02 |
| `precursor_lesion` | enum: atypical_hyperplasia / EIN / atrophic / none / unknown | 背景内膜 | S02 |
| `er_pr_status` | enum: positive / negative / not_done / unknown | 与治疗选择相关，但不单独决定 | S04 |
| `p53_ihc` | enum: normal / overexpression / null / cytoplasmic / equivocal / not_done | 分子分型的一部分 | S19 |
| `path_review_second_opinion` | enum: not_needed / planned / done / unknown | 高级别/疑难病理 | S02 |
| `path_report_org` | text | 来源机构 | 产品字段 |
| `path_report_date` | date | 报告日期 | 产品字段 |

### 2.3 人话文案（解释不是判断）

- “病理报告里的 G1/G2/G3 是显微镜下的‘长相分级’，不是早中晚；早中晚看的是分期。”（解释不是判断）
- “浆液性、透明细胞这些名字代表不同的肿瘤类型，治疗思路可能不同，但不等于‘更晚期’。”（解释不是判断）
- “如果手术后病理和最初活检不完全一致，并不罕见，医生会以最终大病理和分子结果综合判断。”（解释不是判断）

### 2.4 来源

| ID | 机构/作者 | 标题 | 日期 | 类型 | URL | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| S02 | FIGO / Koskas M 等 | Cancer of the corpus uteri: A 2025 update | 2025-09 | 国际指南更新全文 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12411821/ | 非中国指南 |
| S03 | Sehnal B 等 | New FIGO 2023 Staging System of Endometrial Cancer: An Updated Review | 2025-04 | 综述 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11968139/ | 二手综述 |
| S05 | 国家卫生健康委办公厅 | 子宫内膜癌诊疗指南（2022年版） | 2022-04 | 国家指南 | https://www.nhc.gov.cn/yzygj/c100068/202204/0c1f7d3aca0545abbeb02030ce255930.shtml | 官网 412；用转载件核对 |
| S22 | 复旦大学附属肿瘤医院 / Yu C 等 | Clinical application of FIGO 2023 staging system of endometrial cancer in a Chinese cohort | 2024-07 | 中国单中心回顾队列 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11264810/ | 回顾性，单中心 |

---

## 3. FIGO 2023 分期与分子分型整合（核心）

### 3.1 患者视角关键事实：分期不再只看“长到哪”

FIGO 2023 在解剖范围之外，把 **组织学类型、分级、LVSI、分子分型** 纳入分期。对患者最直接的影响是：同样的“长在子宫里”，可能因为病理类型、LVSI 或分子结果被记为不同亚期。[S01][S02]

ESGO/ESTRO/ESP 2025 更新也把 FIGO 2023 纳入，并覆盖诊断、管理、随访和患者教育；本次仅取到摘要，未取全文。[S21] 中国 2024 版妇科肿瘤临床实践指南也已按新版分期/分子分型更新，全文需登录，未取。[S06]

| 期别 | 亚期与要点（FIGO 2023） |
| --- | --- |
| I | **IA1**：非侵袭性组织学类型，局限在内膜息肉或内膜；**IA2**：非侵袭性类型，肌层浸润 <50%，无/灶性 LVSI；**IA3**：低级别子宫内膜样癌，同时累及子宫和卵巢（需满足 4 条严格标准）；**IB**：非侵袭性类型，肌层浸润 ≥50%，无/灶性 LVSI；**IC**：侵袭性组织学类型（浆液性、G3 子宫内膜样、透明细胞、癌肉瘤、未分化、混合等），无肌层浸润 |
| II | **IIA**：非侵袭性类型侵犯宫颈间质；**IIB**：非侵袭性类型有大量 LVSI；**IIC**：侵袭性组织学类型，任何肌层浸润 |
| III | **IIIA1**：卵巢/输卵管转移（不符合 IA3 标准时）；**IIIA2**：子宫浆膜下/浆膜受累；**IIIB1**：阴道/宫旁转移或直接蔓延；**IIIB2**：盆腔腹膜转移；**IIIC1i/ii**：盆腔淋巴结微转移/宏转移；**IIIC2i/ii**：腹主动脉旁淋巴结微转移/宏转移（可伴盆腔阳性） |
| IV | **IVA**：膀胱/肠黏膜侵犯；**IVB**：盆腔外腹腔腹膜转移；**IVC**：远处转移（肾血管以上淋巴结、肺、肝、脑、骨等） |

补充规则：仅宫颈腺体受累算 I 期，不再算 II 期；腹水细胞学阳性要单独报告，**不改变分期**；IA3 必须满足“肌层浸润 <50%、无大量 LVSI、无其他转移、卵巢肿瘤单侧且局限、包膜未破/未受累”等条件。[S02]

### 3.2 分子分型怎么进分期

四个分子型：**POLEmut（POLE 超突变）/ MMRd（错配修复缺陷）/ p53abn（p53 异常）/ NSMP（无特异分子谱，即 p53wt）**。[S01][S02]

规则（FIGO 2023，公开综述逐条核对）：

1. 做了分子分型，期别后面**必须加 “m”**，再加下标写分子型；没做就不加，不能推断。[S03]
2. **I–II 期**：只有 POLEmut 和 p53abn 会改变期别——
   - POLEmut → **IAmPOLEmut**（无论原来 IA/IB/II，只要局限在子宫/宫颈扩展）；
   - p53abn → **IICmp53abn**；
   - MMRd / NSMP → 期别不变，只加 m，例如 **IA1mMMRd、IBmNSMP、IICmMMRd**。[S03]
3. **III–IV 期**：无论哪种分子型，**期别保留**，只加 m 和下标，例如 **IIIA2mPOLEmut、IIIC1mp53abn、IVCmp53abn**。所以 “IIICmp53abn” 是合法的“III 期 + m + p53abn”，不是把 III 期改成别的期。[S03]
4. 约 3% 的肿瘤同时有两个以上分子特征（multiple classifier，如 MMRd+p53abn、POLEmut+p53abn）；判读时 **POLEmut 的预后优势压过其他特征**，但报告要注明“多重分类”。[S19]
5. 分子结果可能让分期“变早”或“变晚”：复旦肿瘤队列 547 例中 26.9% 发生迁移，63 例变为 IAmPOLEmut，53 例变为 IICmp53abn；IAmPOLEmut 的 3 年 PFS 98.4%、OS 100%。[S22]
6. 中国 CSCO 2024/2025 更新均提出“所有子宫内膜癌建议做分子分型”，并采用 IAmPOLEmut、IICmp53abn 的写法。[S08][S09]
7. 中国 2024 年《子宫内膜癌分子分型临床应用中国专家共识》对检测路径和判读有专门建议；本次仅取到摘要，全文未取。[S11]

### 3.3 四型的判读与检测

| 分子型 | 大致占比 | 生物学/预后语境 | 主要检测 | 患者需要知道的点 |
| --- | --- | --- | --- | --- |
| POLEmut | 约 7.3% | 超突变，预后最好；常为高级别、甚至有明显 LVSI，但预后仍好 | **NGS** 测 POLE 核酸外切酶域致病突变；需满足“外切酶域 + 超高突变负荷（>100 mut/Mb）”等条件；常见 P286R、S297F、V411L、S459F、A456P 等[S32] | “POLE 突变”不是遗传病；VUS（意义未明变异）不能算 POLEmut |
| MMRd | 约 24% | MSI-H/高突变，预后中等；对免疫检查点抑制剂敏感；需排除 Lynch | **IHC** 测 MLH1/PMS2/MSH2/MSH6；或 MSI-PCR/NGS | 肿瘤 MMR 缺失 ≠ 一定是 Lynch；MLH1/PMS2 缺失常为散发性甲基化 |
| p53abn | 约 23.7% | 拷贝数高/浆液样，预后最差 | **p53 IHC**（过表达/完全缺失/胞质等异常模式）；不确定时测 TP53 | p53 异常不等于浆液性癌；也不等于一定晚期 |
| NSMP（p53wt） | 约 45% | 拷贝数低，异质性强，常 ER/PR 阳性，预后中等 | 排除以上三型后归类 | 没有“特异性靶点”不等于“不用治疗” |

占比来自 FIGO 2025 引用的基于人群研究；不同人群会有差异。[S02]

### 3.4 MMR 检测：IHC 与 MSI-PCR 怎么选

| 方法 | 怎么做 | 优点 | 局限/注意 |
| --- | --- | --- | --- |
| **MMR IHC** | 测 MLH1、PMS2、MSH2、MSH6 四个蛋白；常成对丢失（MLH1+PMS2、MSH2+MSH6） | 几乎所有实验室可做、成本低、与分子检测一致率约 94%；是指南最常用的初筛 | 前处理差、染色可疑/异常模式、只丢一个亚基时需 PCR/NGS 复核 |
| **MSI-PCR** | 测微卫星不稳定（MSI-H/MSS） | 可作替代 | 对 MSH6 突变的敏感度较低；不能替代 MLH1 甲基化判断 |
| **MLH1 甲基化** | 对 MLH1/PMS2 缺失者测 MLH1 启动子甲基化 | 区分散发性（多为甲基化）与潜在 Lynch | 甲基化不能完全排除 Lynch；早发或有家族史仍应遗传咨询 |
| **POLE** | NGS | 能识别真正 POLEmut | 只有致病性外切酶域突变算；VUS 不算[S32] |
| **p53** | IHC 为主，必要时 TP53 测序 | 便宜、快 | 需有内对照；不确定模式要测序 |

关键结论：**IHC 是首选初筛，MSI-PCR 是替代/补充；MLH1/PMS2 缺失必须接甲基化或遗传咨询。** [S19][S02]

### 3.5 字段建议

| 字段 | 类型/取值 | 设计说明 | 依据 |
| --- | --- | --- | --- |
| `molecular_test_status` | enum: not_ordered / ordered / partial / complete / unknown | 区分“没做”和“做了没出结果” | 产品字段 |
| `molecular_specimen` | enum: biopsy / hysterectomy / both / other / unknown | 活检与术后标本可能不一致 | S02 |
| `molecular_lab` | text | 送检机构 | 产品字段 |
| `mmr_ihc_mlh1` | enum: retained / lost / equivocal / not_tested | 四蛋白逐项记录 | S19 |
| `mmr_ihc_pms2` | 同上 | 同上 | S19 |
| `mmr_ihc_msh2` | 同上 | 同上 | S19 |
| `mmr_ihc_msh6` | 同上 | 同上 | S19 |
| `mlh1_methylation` | enum: methylated / unmethylated / not_done / unknown | MLH1/PMS2 缺失时必填提醒 | S19 |
| `msi_result` | enum: MSI-H / MSS / indeterminate / not_done | 与 IHC 并列，不互相覆盖 | S19 |
| `pole_result` | enum: pathogenic / VUS / negative / not_done / unknown | VUS 不能写成 POLEmut | S19 |
| `pole_variant` | text | 记录位点 | S19 |
| `pole_mutational_burden` | decimal / unknown | 辅助判读 | S19 |
| `p53_ihc_pattern` | enum: normal / overexpression / null / cytoplasmic / equivocal / not_done | 异常模式不止“过表达” | S19 |
| `tp53_variant` | text / unknown | 测序结果 | S19 |
| `integrated_molecular_subtype` | enum: POLEmut / MMRd / p53abn / NSMP / multiple_classifier / unknown | 最终整合型 | S01, S03 |
| `multiple_classifier_detail` | text | 如 MMRd+p53abn | S19 |
| `figo2023_anatomical_stage` | enum: IA1…IVC / unknown | 先记解剖/病理期 | S02 |
| `molecular_marker_in_stage` | enum: none / POLEmut / p53abn / MMRd / NSMP / multiple / unknown | 只有 POLEmut/p53abn 在 I–II 期改期 | S03 |
| `figo2023_final_label` | text（如 IAmPOLEmut、IIIC1mp53abn） | 最终展示标签 | S03 |
| `stage_change_due_to_molecular` | enum: up / down / none / unknown | 患者最容易被“期别变了”吓到 | S22 |
| `molecular_report_date` | date | 结果日期 | 产品字段 |
| `molecular_turnaround_days` | integer / unknown | 患者等待时间 | 产品字段 |
| `molecular_cost` | decimal / unknown | 经济负担 | 产品字段 |
| `molecular_insurance` | enum: covered / partial / self_pay / unknown | 可及性 | 产品字段 |
| `treatment_plan_changed` | enum: yes / no / unknown | 患者自报/医生记录分开 | 产品字段 |

### 3.6 六个常见误区（产品文案必须避开）

1. **“MMRd 就是 Lynch”**：错。所有子宫内膜癌中约 3% 由 Lynch 引起；MMRd 更多是散发性 MLH1 甲基化。[S02][S19]
2. **“POLE 有变异就是 POLEmut”**：错。只有外切酶域致病突变 + 超高突变负荷才算；VUS 不算。[S19]
3. **“p53 异常就是浆液性癌”**：错。p53 异常可见于多种肿瘤，诊断仍靠形态学。[S03]
4. **“分子分型是遗传检测”**：错。分子分型测的是肿瘤体细胞特征；Lynch 需要胚系检测（血液/唾液）。[S04]
5. **“做了分子分型就一定会改分期”**：错。只有 I–II 期的 POLEmut/p53abn 改期；III–IV 期只加 m。[S03]
6. **“IIICmp53abn 是把 III 期改成了 II 期”**：错。III 期保留，m 只是分子标记。[S03]

### 3.7 人话文案（解释不是判断）

- “分子分型是给肿瘤‘贴基因标签’，不是查你本人会不会遗传。”（解释不是判断）
- “同样是 I 期，POLE 突变型可能被记为 IAmPOLEmut；这不是写错，是 2023 年新分期规则。”（解释不是判断）
- “如果分子结果出来后医生说期别变了，先问清楚是‘升级’还是‘降级’，以及依据哪一条。”（解释不是判断）

### 3.8 来源

| ID | 机构/作者 | 标题 | 日期 | 类型 | URL | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| S01 | FIGO / Berek JS 等 | FIGO staging of endometrial cancer: 2023 | 2023-08 | 国际分期原文 | https://doi.org/10.1002/ijgo.14923 | 全文付费，摘要与公开综述核对 |
| S02 | FIGO / Koskas M 等 | Cancer of the corpus uteri: A 2025 update | 2025-09 | 国际指南更新全文 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12411821/ | 非中国指南 |
| S03 | Sehnal B 等 | New FIGO 2023 Staging System of Endometrial Cancer: An Updated Review | 2025-04 | 综述（含分期规则表） | https://pmc.ncbi.nlm.nih.gov/articles/PMC11968139/ | 二手综述 |
| S06 | 中华医学会妇科肿瘤学分会 | 中国妇科肿瘤临床实践指南 2024 版——子宫内膜癌 | 2024-08-31 | 中国学会指南 | https://guide.medlive.cn/guideline/35638 | 登录墙，全文未取 |
| S08 | CSCO 指南会 / 肿瘤瞭望 | 2025 CSCO 子宫内膜癌指南更新要点 | 2025-04-30 | 会议报道 | https://news.qq.com/rain/a/20250430A0742C00 | 二手，非指南原文 |
| S09 | 医脉通（网易号转载） | 2024 年 CSCO 子宫内膜癌诊疗指南更新要点 | 2024-05-02 | 会议报道 | https://www.163.com/dy/article/J170H5GF053438SI.html | 二手，部分证据引自 NCCN/SGO |
| S11 | 中国实用妇科与产科杂志 | 子宫内膜癌分子分型临床应用中国专家共识（2024年版） | 2024（40卷6期） | 中国专家共识 | https://www.sinomed.ac.cn/article.do?ui=2024384970 | 仅摘要，全文未取 |
| S19 | Addante F 等 | Mismatch Repair Deficiency as a Predictive and Prognostic Biomarker in Endometrial Cancer | 2024-01 | 综述 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10816607/ | 二手综述 |
| S21 | ESGO/ESTRO/ESP / Concin N 等 | ESGO-ESTRO-ESP guidelines for the management of patients with endometrial carcinoma: update 2025 | 2025-08 | 国际指南更新（摘要） | https://doi.org/10.1016/S1470-2045(25)00167-6 | 全文付费 |
| S22 | 复旦大学附属肿瘤医院 / Yu C 等 | Clinical application of FIGO 2023 staging system of endometrial cancer in a Chinese cohort | 2024-07 | 中国单中心队列 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11264810/ | 回顾性，单中心 |
| S32 | Zheng W | Molecular Classification of Endometrial Cancer and the 2023 FIGO Staging | 2023-08 | 综述 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10452831/ | 二手综述，病理视角 |

---

## 4. 分子分型与治疗对照（只列指南原文，不合成建议）

> 这一节只做“谁说了什么”的对照。**不把四型翻译成“该用什么药”**；产品里也不允许出现“p53abn 必须化疗”“POLEmut 不用治疗”这类句子。

### 4.1 指南原文对照表

| 分子型 | 指南原文/权威转述 | 中国获批/可及（截至 2026-10-24） | 产品只记录 | 不能写成 |
| --- | --- | --- | --- | --- |
| **POLEmut** | FIGO 2025：分子分型用于个体化治疗的例子包括“POLEmut 肿瘤的降阶治疗（de-escalation of treatment in POLEmut tumors）”。[S02] CSCO 2024：POLEmut 归为 IAmPOLEmut 期。[S09] | 无“POLEmut 专用药”的获批问题；关键是降阶/省略辅助治疗仍属临床决策 | “指南提到 POLEmut 有降阶语境；具体是否降阶由医生按分期/病理决定” | “POLEmut 不用化疗/不用放疗” |
| **MMRd** | FIGO 2025：“MMRd 肿瘤使用免疫检查点抑制剂（immune checkpoint inhibitors in MMRd neoplasms）”。[S02] NCCN 患者版在 III–IV 期系统治疗中列出卡铂+紫杉醇联合 dostarlimab 或 pembrolizumab；其中 durvalumab 明确标注“仅 dMMR”。[S04] CSCO 2024：dMMR/MSI-H 的 pembrolizumab 或多塔利单抗为 1 类证据。[S09] | **帕博利珠单抗**：2026-02 据报道 NMPA 批准“联合卡铂+紫杉醇，用于 dMMR 原发晚期或复发性子宫内膜癌一线，后续单药维持”。[S29] **多塔利单抗**：未检索到 NMPA 批准；2025-09 仍有中国 II 期临床启动报道。[S30] | “dMMR 是免疫治疗的生物标志物之一；指南列了免疫联合方案；中国获批情况按药物分别标注” | “dMMR 必须用免疫”“多塔利单抗已在中国获批” |
| **p53abn** | FIGO 2025：“p53abn 肿瘤使用化疗（chemotherapy in p53abn）”。[S02] NCCN 患者版：浆液性/透明细胞等高风险类型术后按分期选择化疗和/或放疗。[S04] CSCO 2025：p53 突变型复发和死亡风险最高。[S08] | 化疗药物本身有获批；无“p53abn 专属适应症”概念 | “p53abn 在指南中与化疗语境相关；具体方案按分期/病理/体能状态” | “p53abn 预后最差，必须化疗” |
| **NSMP / p53wt** | 没有“NSMP 专属药”的指南条款；治疗按分期、组织学、LVSI 等决定。NCCN 患者版按期别列化疗/放疗/激素/观察选项。[S04] | 无专属获批问题 | “NSMP 表示没有发现 POLE/MMR/p53 的特异改变；治疗按常规风险分层” | “NSMP 不用治疗”“NSMP 等于良性” |

需要区分“指南提到降阶语境”与“已经证明可以安全省略辅助治疗”。国际综述指出，POLEmut 省略辅助治疗仍在研究中（如 POLEmut-BLUE 试验），PORTEC-3 只是提示可考虑降阶；不能把“可考虑”写成“可以不做”。[S20]

### 4.2 三个必须分开的概念

| 概念 | 含义 | 产品字段 |
| --- | --- | --- |
| 指南推荐 | 学会指南写的“可考虑/推荐”，常基于临床试验 | `guideline_recommendation_text` + `guideline_source` |
| 中国获批适应症 | NMPA 批准的药物/人群/线数 | `nmpa_approval_status` + `approved_indication` + `approval_date` |
| 医保/可及性 | 是否报销、医院能否开到、自费多少 | `insurance_status` + `out_of_pocket` + `hospital_access` |

**指南推荐 ≠ 中国获批 ≠ 医保报销。** 三者混在一个字段里，产品就会说出“指南推荐所以你能用”的错误因果。

### 4.3 NMPA 核验记录（必须保留）

- **帕博利珠单抗（可瑞达）**：新华网 2026-02-07 报道，NMPA 批准“联合卡铂和紫杉醇用于 dMMR 的原发晚期或复发性子宫内膜癌成人患者的一线治疗，随后帕博利珠单抗单药维持”。[S29] 美通社同日稿件给出同一适应症。[S29]  
  **核验状态：待核验。** NMPA 官网《2026年02月06日药品批准证明文件送达信息》页面返回 HTTP 412（反爬），未能取得官方原文；目前证据级别为“官方媒体 + 企业公告”，不是 NMPA 数据库原文。
- **多塔利单抗（Jemperli）**：检索未发现 NMPA 批准公告；2025-09-18 新浪财经报道 GSK 在中国启动“原发性晚期或复发性子宫内膜癌”II 期临床。[S30]  
  **核验状态：未获批（推断，待核验）。** 不能在产品里写“已获批”；如要展示，写“截至 2026-10-24 未检索到 NMPA 批准信息，待核验”。

### 4.4 人话文案（解释不是判断）

- “分子分型帮医生判断肿瘤更像哪一类，但‘哪类用哪个药’是医生结合分期、病理、身体情况决定的。”（解释不是判断）
- “指南推荐和在中国能不能开到、能不能报销，是三件事，工作台会分开显示。”（解释不是判断）
- “看到‘dMMR’，可以问医生‘这对我用免疫治疗意味着什么’，而不是自己直接对号入座。”（解释不是判断）

### 4.5 来源

| ID | 机构/作者 | 标题 | 日期 | 类型 | URL | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| S02 | FIGO / Koskas M 等 | Cancer of the corpus uteri: A 2025 update | 2025-09 | 国际指南更新全文 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12411821/ | 非中国指南 |
| S04 | NCCN | NCCN Guidelines for Patients: Uterine Cancer, 2026 | 2025-11-14 | 患者版指南 | https://www.nccn.org/patients/guidelines/content/PDF/uterine-patient.pdf | 患者版，美国口径 |
| S08 | CSCO 指南会 / 肿瘤瞭望 | 2025 CSCO 子宫内膜癌指南更新要点 | 2025-04-30 | 会议报道 | https://news.qq.com/rain/a/20250430A0742C00 | 二手 |
| S09 | 医脉通（网易号转载） | 2024 年 CSCO 子宫内膜癌诊疗指南更新要点 | 2024-05-02 | 会议报道 | https://www.163.com/dy/article/J170H5GF053438SI.html | 二手 |
| S20 | Galant N 等 | Molecular Classification of Endometrial Cancer and Its Impact on Therapy Selection | 2024-05 | 综述 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11172295/ | 二手综述 |
| S29 | 新华网 / 美通社 | 帕博利珠单抗在华获批原发晚期或复发性子宫内膜癌适应症 | 2026-02-07 / 2026-02-06 | 官方媒体 + 企业公告 | http://www.xinhuanet.com/digital/20260207/04c21c0bcc25437dae1ec8d2e429a5f2/c.html；https://www.prnasia.com/story/521636-1.shtml | NMPA 官网 412，待核验 |
| S30 | 新浪财经 | 葛兰素史克 dostarlimab 启动 II 期临床，适应症为原发性晚期或复发性子宫内膜癌 | 2025-09-18 | 财经报道 | https://finance.sina.com.cn/stock/aigc/ywsygs/2025-09-18/doc-infqwutr0787272.shtml | 未检索到 NMPA 批准，推断未获批 |

---

## 5. Lynch 综合征：从肿瘤 MMR 缺失到家系

### 5.1 患者视角关键事实

- **所有子宫内膜癌都建议做 MMR IHC 初筛**，因为约 3% 的子宫内膜癌由 Lynch 综合征引起。[S02]
- Lynch 是**常染色体显性遗传**：携带者每个子女有约 50% 概率遗传；兄弟姐妹同样可能携带。携带者不一定发病，但风险显著升高。[S18][S31]
- Lynch 相关子宫内膜癌的终生风险，不同来源差异很大：FIGO 2025 写 **13%–49%**；中国一篇 2021 年患教科普写 **27%–71%**，并称 40%–60% 以子宫内膜癌为首发肿瘤。[S02][S18] **产品不能只显示一个数字**，必须带来源与年份。
- 肿瘤 MMR 缺失 ≠ Lynch。MLH1/PMS2 缺失最常见的原因是 **MLH1 启动子甲基化（散发性）**；MSH2/MSH6 缺失更提示胚系可能。MLH1 甲基化也不能 100% 排除 Lynch，早发或有家族史仍要遗传咨询。[S19]
- 流程：MMR IHC 异常 →（必要时）MLH1 甲基化/MSI → 遗传咨询 → 胚系检测（血液/唾液，MLH1/MSH2/MSH6/PMS2/EPCAM）→ 家系验证。[S04][S31]
- 对携带者，FIGO 2025 写：完成生育后，**35–40 岁可提供降风险全子宫+双附件切除**；切除前可考虑每年 TVS/宫腔镜/内膜取样监测。[S02]
- 中国患教文章给的监测节奏更早：MLH1/MSH2 突变者从 20–25 岁起每 1–2 年妇科检查；MSH6/PMS2 从 25–30 岁起；生育完成后讨论预防性全子宫双附件切除。[S18] 这与 FIGO 的“35–40 岁手术”不矛盾，但**监测起始年龄与证据等级在不同国家不同**。
- 家系信息是高度敏感信息：家系图会包含父母、子女、兄弟姐妹的患癌信息。中国《个人信息保护法》把“医疗健康”列为敏感个人信息，处理需特定目的、充分必要、严格保护，并取得**单独同意**；《人类遗传资源管理条例》要求伦理审查、知情同意、保护隐私，采集重要遗传家系资源还需批准。[S27][S28]
- 中国 2023 年《Lynch 综合征相关性子宫内膜癌筛查与防治中国专家共识》与 2025 年《林奇综合征相关妇科恶性肿瘤综合管理中国专家共识》分别覆盖筛查防治和妇科肿瘤综合管理；本次均未取到全文，条款待核验。[S10][S12]
- 产品边界：可以帮患者**整理“我的结果”和“建议告知哪些亲属”**；不能替亲属建档、不能未经同意录入亲属姓名/病史、不能把家系图默认共享给其他家庭成员。

### 5.2 字段建议

| 字段 | 类型/取值 | 设计说明 | 依据 |
| --- | --- | --- | --- |
| `mmr_ihc_result` | enum: deficient / proficient / equivocal / not_done | 初筛结果 | S02, S19 |
| `mlh1_methylation` | enum: methylated / unmethylated / not_done / unknown | MLH1/PMS2 缺失时必填 | S19 |
| `germline_test_status` | enum: not_offered / offered / declined / pending / result | 与肿瘤分子检测分开 | S04 |
| `germline_gene` | enum: MLH1 / MSH2 / MSH6 / PMS2 / EPCAM / other / none | 记录基因 | S31 |
| `germline_variant` | text | 位点 | S31 |
| `germline_classification` | enum: pathogenic / likely_pathogenic / VUS / negative / unknown | VUS 不能写成阳性 | S31 |
| `genetic_counseling_date` | date / not_done | 遗传咨询 | S04 |
| `genetic_counselor_org` | text | 机构 | 产品字段 |
| `family_history_structured` | array: relation / cancer_type / age_at_dx / verified | 家系图结构化 | 产品字段 |
| `pedigree_consent` | boolean / unknown | 亲属信息录入的同意 | S27 |
| `relatives_notified` | enum: none / partial / all / unknown | 患者自报 | 产品字段 |
| `relatives_tested_count` | integer / unknown | 不记录亲属姓名 | 产品字段 |
| `surveillance_plan` | multi: gynecology / colonoscopy / other | 监测计划 | S02, S18 |
| `risk_reducing_surgery_discussed` | boolean / unknown | 是否讨论过 | S02 |
| `risk_reducing_surgery_date` | date / not_done | 手术日期 | 产品字段 |
| `privacy_preference` | enum: local_only / share_with_named_family / share_with_clinician | 隐私偏好 | S27 |

### 5.3 人话文案（解释不是判断）

- “肿瘤的 MMR 缺失像一盏提示灯：它提示可能要查 Lynch，但大多数情况并不是 Lynch。”（解释不是判断）
- “如果确认是 Lynch，子女和兄弟姐妹可以考虑遗传咨询和检测；是否检测由他们自己决定。”（解释不是判断）
- “家系图里有亲属的信息，工作台默认只存在本机，未经同意不会共享。”（解释不是判断）

### 5.4 来源

| ID | 机构/作者 | 标题 | 日期 | 类型 | URL | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| S02 | FIGO / Koskas M 等 | Cancer of the corpus uteri: A 2025 update | 2025-09 | 国际指南更新全文 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12411821/ | 非中国指南 |
| S04 | NCCN | NCCN Guidelines for Patients: Uterine Cancer, 2026 | 2025-11-14 | 患者版指南 | https://www.nccn.org/patients/guidelines/content/PDF/uterine-patient.pdf | 患者版 |
| S10 | 中国医师协会妇产科医师分会妇科肿瘤学组 | Lynch 综合征相关性子宫内膜癌筛查与防治中国专家共识（2023年版） | 2023-01-02 | 中国专家共识 | https://www.medsci.cn/guideline/show_article.do?id=db3c31c0029a4391 | 全文需 PDF，未取 |
| S12 | 中华医学会妇科肿瘤学分会等 | 林奇综合征相关妇科恶性肿瘤综合管理中国专家共识（2025年版） | 2025 | 中国专家共识 | https://guide.medlive.cn/guideline/34071 | 登录墙，未取全文 |
| S18 | 赵迎超（华中科技大学同济医学院附属协和医院） | 林奇综合征相关子宫内膜癌——会遗传的子宫内膜癌 | 2021-03-21 | 医生科普/转载 | https://www.haodf.com/neirong/wenzhang/9115672096.html | 风险数字较旧，转载 |
| S19 | Addante F 等 | Mismatch Repair Deficiency as a Predictive and Prognostic Biomarker in Endometrial Cancer | 2024-01 | 综述 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10816607/ | 二手综述 |
| S27 | 全国人大《个人信息保护法》（地方政府网站转载） | 中华人民共和国个人信息保护法 | 2021-08-20 通过 / 2021-11-01 施行 | 法律 | https://www.ahxx.gov.cn/public/285/162065221.html | 非人大官网原文（原站 SSL 失败） |
| S28 | 国务院 | 中华人民共和国人类遗传资源管理条例 | 2019-06-10 公布 / 2019-07-01 施行 | 行政法规 | https://www.gov.cn/zhengce/content/2019-06/10/content_5398829.htm | 官方原文 |
| S31 | MedlinePlus | Lynch syndrome | 2021-04-15 | 政府患教 | https://medlineplus.gov/genetics/condition/lynch-syndrome/ | 未给 50% 数字 |

---

## 6. 保育治疗（年轻未育）

### 6.1 患者视角关键事实

- 生育年龄的子宫内膜癌在增加，部分与肥胖相关；这个年龄段诊断要特别谨慎，因为 **G1 子宫内膜样癌与子宫内膜不典型增生在病理上可能难以区分**。[S02]
- 保育治疗的前提是：**G1 子宫内膜样癌、MRI 判断无肌层浸润**；目前证据最充分的就是这一组。G2 的研究很少；FIGO 引用的研究提示 G2/G3 保留子宫风险增加，建议这类保守管理应限时，而不是无限期观察。[S02]
- 方案：**左炔诺孕酮宫内节育器（LNG-IUD，如曼月乐）为首选**；也可口服孕激素（醋酸甲地孕酮 160–320 mg/日，或醋酸甲羟孕酮 200–600 mg/日），可单用或与 IUD 联合；肥胖患者减重可提高反应率、降低复发、提高妊娠机会。[S02][S04]
- NCCN 患者版的随访节奏：每 **3–6 个月**取内膜活检；6 个月仍有癌，可考虑加第二种孕激素；12 个月仍有癌，建议全子宫+双附件切除。[S04]
- 完全缓解后可以停孕激素、开始尝试怀孕，但内膜仍要继续监测；完成生育后，若仍担心持续的内膜癌风险，建议切除子宫。[S02][S04]
- 文献报告的结局（不是个体预测）：完全缓解率 **77%–84%**；缓解后复发 **29.2%–35.4%**；妊娠率 **26.7%–58%**；活产率约 **20.5%**。这些数字来自不同中心，不能拿来承诺“你一定能生”。[S25]
- 保育治疗不是“治愈”：FIGO 2025 明确写到，保守治疗后有致命复发的报道；非标准治疗必须充分告知。[S02]
- 北京协和公开病例：口服大剂量孕激素 3 个周期后出现药物性肝损害，改为 LNG-IUD + 每月 GnRH-a，6 个周期后宫腔镜复查完全缓解；随后通过 IVF 受孕，足月剖宫产龙凤胎。这个案例说明保育路径可能涉及**肝功能监测、方案转换、辅助生殖和多学科管理**，不是“吃药等怀孕”一条直线。[S14]
- 中国 2025 版妇科肿瘤临床实践指南也把保育治疗纳入，但本次只取到概述（登录墙）[S07]；另有《早期子宫内膜癌保留生育功能治疗专家共识》，本次未取得全文，具体条款待核验。

### 6.2 字段建议

| 字段 | 类型/取值 | 设计说明 | 依据 |
| --- | --- | --- | --- |
| `fertility_desire` | enum: yes / no / unsure / prefer_not_to_say | 先问意愿，不替患者假设 | 产品字段 |
| `parity` | integer / unknown | 孕产史 | 产品字段 |
| `infertility_history` | boolean / unknown | 是否已有不孕因素 | S02 |
| `age_at_diagnosis` | integer | 保育讨论的上下文 | 产品字段 |
| `candidate_histology` | enum: G1_endometrioid / G2 / G3 / other / unknown | 保育前提 | S02 |
| `mri_myometrial_invasion` | enum: none / <50% / ≥50% / not_done / unknown | 保育前评估 | S02 |
| `specialist_pathology_review` | boolean / unknown | G1 与不典型增生鉴别 | S02 |
| `progestin_regimen` | multi: LNG_IUD / oral_megestrol / oral_MPA / GnRH_a / combination | 记录实际方案 | S02, S04 |
| `progestin_dose` | text | 剂量 | S02 |
| `progestin_start_date` | date | 起始 | 产品字段 |
| `progestin_side_effects` | multi: liver_injury / weight_gain / mood / bleeding / other | 患者体验 | S14 |
| `liver_function_monitoring` | boolean / unknown | 口服孕激素的安全性监测 | S14 |
| `biopsy_interval_months` | integer（常见 3–6） | 随访节奏 | S04 |
| `biopsy_results` | array: date / result（CR / residual / progression） | 关键时间线 | S04 |
| `complete_response_date` | date / not_achieved | CR 日期 | S04 |
| `conception_attempt_start` | date / not_started | 开始尝试怀孕 | S02 |
| `art_referral` | boolean / unknown | 辅助生殖转诊 | S02, S14 |
| `pregnancy_date` | date / not_pregnant | 妊娠 | S25 |
| `delivery_date` | date / not_delivered | 分娩 | S14 |
| `postpartum_hysterectomy_plan` | enum: planned / done / declined / unknown | 完成生育后切除子宫 | S02 |
| `recurrence_date` | date / none | 复发 | S25 |
| `counseling_note` | text | 是否告知“非治愈/需切除子宫/复发风险” | S02 |

### 6.3 人话文案（解释不是判断）

- “保育治疗是‘先把癌控制住、争取怀孕时间’，不是把癌彻底治好；生完孩子后通常仍建议切除子宫。”（解释不是判断）
- “口服孕激素可能影响肝功能，治疗期间需要抽血监测；这不是每个人都会发生。”（解释不是判断）
- “完全缓解后也可能复发，所以即使怀孕了，产后仍要和医生讨论后续手术。”（解释不是判断）

### 6.4 来源

| ID | 机构/作者 | 标题 | 日期 | 类型 | URL | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| S02 | FIGO / Koskas M 等 | Cancer of the corpus uteri: A 2025 update | 2025-09 | 国际指南更新全文 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12411821/ | 非中国指南 |
| S04 | NCCN | NCCN Guidelines for Patients: Uterine Cancer, 2026 | 2025-11-14 | 患者版指南 | https://www.nccn.org/patients/guidelines/content/PDF/uterine-patient.pdf | 患者版 |
| S07 | 中华医学会妇科肿瘤学分会 | 2025 中国妇科肿瘤临床实践指南——子宫内膜癌 | 2025-09-20 | 中国学会指南 | https://drugs.dxy.cn/pc/clinicalGuidelines/p3hqrGKOFFyjvg1fW5B9rXQ | 登录墙，仅概述；保育共识全文未取 |
| S14 | 北京协和医院 | 协和“医”线故事：龙凤胎呱呱坠地，子宫内膜癌患者在协和重燃生育希望 | 2023-03-02 | 医院病例故事 | https://www.pumch.cn/detail/30262.html | 单例，非疗效证据 |
| S25 | Hsu YT 等 | Long-term outcomes of fertility-sparing treatment in endometrial carcinoma and EIN | 2025-10 | 回顾性队列 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12451189/ | 单中心 40 例，不能外推 |

---

## 7. 手术与辅助治疗

### 7.1 患者视角关键事实

- 大多数子宫内膜癌以手术为主：**全子宫+双侧输卵管卵巢切除（TH+BSO）**；如果癌侵犯宫颈间质，可能需要根治性子宫切除；局限在子宫的子宫内膜样癌，微创手术通常优先。[S04][S02]
- **年轻、病变局限、低危**的患者，可与医生讨论保留卵巢，以避免手术绝经；但不是所有患者都适合。[S04][S02]
- 淋巴结评估方式包括**前哨淋巴结活检（SLN）**和淋巴结清扫；FIGO 2025 写：对影像/术中判断淋巴结阴性的患者，SLN 是可接受的做法；不能做 SLN 时，传统淋巴结清扫仍有指征。[S02]
- 术后是否需要辅助治疗，取决于分期、组织学、分级、LVSI、切缘等：
  - I 期：可能观察，也可能阴道近距离放疗（VBT）/体外放疗（EBRT）；
  - II 期：EBRT 常为首选，可加 VBT；
  - III–IV 期：以全身治疗为主（化疗或激素治疗），可加 EBRT/VBT；
  - 浆液性/透明细胞/癌肉瘤等高风险类型：化疗为主，可加放疗；HER2 检测用于晚期/转移性浆液性癌或癌肉瘤。[S04]
- 化疗常用**卡铂+紫杉醇**；放疗包括 EBRT 和阴道近距离放疗。PORTEC-2 显示阴道近距离放疗与 EBRT 的阴道控制率均 <2%（5 年），且近距离放疗副作用更小、生活质量更好。[S04][S02]
- 免疫治疗进入辅助/一线：FIGO 2025 把 MMRd 与免疫检查点抑制剂关联；CSCO 2024 把 dMMR/MSI-H 的 pembrolizumab 或多塔利单抗列为 1 类证据；NCCN 患者版在 III–IV 期系统治疗中列出化疗联合 dostarlimab 或 pembrolizumab。[S02][S09][S04]
- 患者视角：手术前后最关心“要不要切卵巢”“要不要扫淋巴结”“术后要不要放疗/化疗”“会不会影响性生活”。这些都应该由医生按风险分层回答；工作台只记录方案与时间线。

### 7.2 字段建议

| 字段 | 类型/取值 | 设计说明 | 依据 |
| --- | --- | --- | --- |
| `surgery_date` | date | 手术日期 | 产品字段 |
| `surgery_procedure` | enum: total_hysterectomy / radical_hysterectomy / debulking / other | 术式 | S04 |
| `surgery_approach` | enum: laparoscopic / robotic / open / vaginal / unknown | 微创 vs 开腹 | S04 |
| `bso_performed` | enum: yes / no_ovarian_preserved / unilateral / unknown | 是否切除双附件 | S04 |
| `ovarian_preservation_reason` | text | 年轻/低危等 | S04 |
| `lymph_node_method` | enum: SLN / lymphadenectomy / none / unknown | 淋巴结评估方式 | S02 |
| `sln_mapping` | enum: successful / failed / not_attempted / unknown | SLN 成功率 | S02 |
| `nodes_removed` | integer / unknown | 数量 | 产品字段 |
| `residual_disease` | enum: R0 / R1 / R2 / unknown | 切净程度 | 产品字段 |
| `surgical_complications` | multi: infection / bleeding / lymphocele / ileus / other | 术后体验 | 产品字段 |
| `length_of_stay_days` | integer / unknown | 恢复时间 | 产品字段 |
| `adjuvant_type` | multi: none / VBT / EBRT / chemo / chemo_rt / immunotherapy / hormone / other | 辅助治疗 | S04 |
| `adjuvant_start_date` | date / not_started | 起始 | 产品字段 |
| `adjuvant_end_date` | date / ongoing | 结束 | 产品字段 |
| `chemo_regimen` | text（如 carboplatin+paclitaxel） | 方案 | S04 |
| `chemo_cycles_planned` | integer / unknown | 计划周期 | 产品字段 |
| `rt_dose_fraction` | text | 放疗剂量/次数 | 产品字段 |
| `her2_status` | enum: positive / negative / equivocal / not_done | 浆液性/癌肉瘤 | S04 |
| `mdt_discussion` | boolean / unknown | 多学科讨论 | 产品字段 |
| `clinical_trial` | enum: none / screened / enrolled / unknown | 临床试验 | 产品字段 |

### 7.3 人话文案（解释不是判断）

- “手术范围不是越大越好；淋巴结要不要扫、卵巢要不要留，取决于分期和风险。”（解释不是判断）
- “术后放疗分两种：体外照射和阴道近距离放疗，后者主要管阴道残端，副作用相对小。”（解释不是判断）
- “辅助治疗是降低复发风险，不是‘没切干净’的惩罚。”（解释不是判断）

### 7.4 来源

| ID | 机构/作者 | 标题 | 日期 | 类型 | URL | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| S02 | FIGO / Koskas M 等 | Cancer of the corpus uteri: A 2025 update | 2025-09 | 国际指南更新全文 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12411821/ | 非中国指南 |
| S04 | NCCN | NCCN Guidelines for Patients: Uterine Cancer, 2026 | 2025-11-14 | 患者版指南 | https://www.nccn.org/patients/guidelines/content/PDF/uterine-patient.pdf | 患者版 |
| S07 | 中华医学会妇科肿瘤学分会 | 2025 中国妇科肿瘤临床实践指南——子宫内膜癌 | 2025-09-20 | 中国学会指南 | https://drugs.dxy.cn/pc/clinicalGuidelines/p3hqrGKOFFyjvg1fW5B9rXQ | 登录墙，仅概述 |
| S09 | 医脉通（网易号转载） | 2024 年 CSCO 子宫内膜癌诊疗指南更新要点 | 2024-05-02 | 会议报道 | https://www.163.com/dy/article/J170H5GF053438SI.html | 二手 |

---

## 8. 随访节奏

### 8.1 患者视角关键事实

- 随访频率（NCCN 患者版）：治疗后前 **2–3 年每 3–6 个月**一次；第 **4–5 年每 6–12 个月**一次；第 5 年后**每年一次**。[S04]
- 国内 2022 版指南的表述一致：前 2–3 年每 3–6 个月，之后每 6–12 个月；内容包括复发症状、生活方式、肥胖、运动、戒烟、营养、性健康及阴道扩张器/润滑剂宣教。[S05]
- **不推荐无症状患者常规做影像**：FIGO 2025 明确“无症状患者没有常规影像筛查复发的作用”，先问症状、做体格检查，再决定要不要影像。[S02] NCCN 患者版也说“其他检查包括影像，不推荐定期做”。[S04]
- **不推荐常规阴道细胞学**：FIGO 2025 写“文献未显示临床获益，阴道细胞学不推荐”；国内 2022 版也写“术后无症状患者不推荐阴道细胞学检查”。[S02][S05] 这就是“阴道残端细胞学有争议”的落点：不是“绝对不能做”，而是“无症状常规做没有证据支持”。
- 窥器检查有意义：FIGO 2025 写，在阴道复发中约 **30% 是无症状的**，窥器检查能发现这部分，仍可通过放疗或手术挽救。[S02]
- 高危/晚期患者的大多数复发发生在**前 3 年**。[S02]
- **随访不是越勤越好**：FIGO 2025 写“高强度随访未显示改善生存，即使在高危患者中也是如此”。[S02]
- 患者要记录的症状：阴道出血、尿血/便血、食欲下降、体重下降、腹痛/腰背痛/髋部痛、咳嗽、气短、腹部或下肢肿胀；出现这些不要等到下次预约。[S04]
- 随访还是慢病管理窗口：子宫内膜癌幸存者心血管疾病是首位死因；近 90% 至少有一个未诊断/未充分治疗的心血管危险因素；第二原发癌风险约为一般人群 3 倍（皮肤、乳腺、肺、肠最常见）。[S02]

### 8.2 字段建议

| 字段 | 类型/取值 | 设计说明 | 依据 |
| --- | --- | --- | --- |
| `followup_plan_interval` | text（如 3–6 个月） | 计划节奏 | S04, S05 |
| `followup_plan_duration` | text（如 5 年） | 计划总时长 | S04 |
| `next_visit_date` | date | 下次随访 | 产品字段 |
| `visit_type` | enum: in_person / telephone / nurse_led / patient_initiated | 随访形式 | S02 |
| `symptom_check` | multi: bleeding / pain / weight_loss / cough / dyspnea / swelling / bowel / bladder / none | 症状清单 | S04 |
| `speculum_exam_done` | boolean / unknown | 窥器检查 | S02 |
| `pelvic_exam_done` | boolean / unknown | 盆腔检查 | S04 |
| `ca125_value` | decimal / not_done | 初治升高者监测 | S04 |
| `imaging_done` | boolean / unknown | 是否影像 | S02 |
| `imaging_indication` | enum: symptom / suspected_recurrence / routine / unknown | 区分“有指征”与“常规” | S02 |
| `vaginal_cytology_done` | boolean / unknown | 记录，但标注“非常规” | S02, S05 |
| `recurrence_suspicion` | enum: none / suspected / confirmed / unknown | 复发怀疑 | 产品字段 |
| `recurrence_date` | date / none | 复发日期 | 产品字段 |
| `recurrence_site` | text | 部位 | 产品字段 |
| `survivorship_metrics` | object: BP / BMI / glucose / lipids / exercise / smoking / bone / mood | 慢病管理 | S02 |
| `second_cancer_screening` | multi: breast / colon / skin / lung / other | 第二原发癌筛查 | S02 |
| `patient_worry_score` | 0–10 / prefer_not_to_say | 恐惧复发 | 产品字段 |

### 8.3 人话文案（解释不是判断）

- “随访的重点是症状和妇科检查，不是每次都做 CT 或抽血查肿瘤标志物。”（解释不是判断）
- “阴道残端细胞学不是每次随访的必做项；没有症状时常规做，证据并不支持。”（解释不是判断）
- “随访也是管血压、血糖、体重和运动的机会，这些对长期生存同样重要。”（解释不是判断）

### 8.4 来源

| ID | 机构/作者 | 标题 | 日期 | 类型 | URL | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| S02 | FIGO / Koskas M 等 | Cancer of the corpus uteri: A 2025 update | 2025-09 | 国际指南更新全文 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12411821/ | 非中国指南 |
| S04 | NCCN | NCCN Guidelines for Patients: Uterine Cancer, 2026 | 2025-11-14 | 患者版指南 | https://www.nccn.org/patients/guidelines/content/PDF/uterine-patient.pdf | 患者版 |
| S05 | 国家卫生健康委办公厅 | 子宫内膜癌诊疗指南（2022年版） | 2022-04 | 国家指南 | https://www.nhc.gov.cn/yzygj/c100068/202204/0c1f7d3aca0545abbeb02030ce255930.shtml | 官网 412；用转载件核对 |

---

## 9. 放疗后私密健康

### 9.1 患者视角关键事实

- 盆腔放疗后常见的性健康问题：**性欲下降、阴道干燥、性交痛、阴道狭窄/缩短（阴道狭窄）**。[S04]
- 放疗会让阴道变短、变窄、弹性变差；可能影响性生活，也可能让妇科检查变得疼痛。[S04]
- **阴道扩张器**：放疗期间和之后使用，可逐渐撑开、扩张阴道；尺寸可随阴道延长/变宽逐步增加。[S04]
- 国际共识给的细节：扩张器每次 **5–10 分钟，每周 2–3 次，持续 9–12 个月**；应“预防性开始”，不是等粘连形成才用；是否让伴侣参与由患者决定；如同时有成功性生活，可降低扩张频率；放疗后 **2–4 周**可恢复性生活（需个体化）。[S23]
- 中国医生科普给的细节：完成治疗后开始，每周数次，每次留置 5–10 分钟，轻柔推拉/旋转；保湿剂每周 2–3 次，必要时 3–5 次，睡前用；润滑剂选水状/凝胶状，避免染色、增味、加热型及杀精子剂，避免矿物油/凡士林。[S16]
- 另一篇中国医生科普建议“每月”扩张一次，频率明显低于国际共识；这说明本土做法并不统一，产品只记录医生给的频率，不自行设定。[S17]
- **阴道保湿剂**可每天用；如果非激素保湿剂不够，可和医生讨论**阴道雌激素软膏**（尤其症状主要在阴道时）。[S04] FIGO 2025 也写：低/中危患者有严重泌尿生殖症状时，可受益于全身和/或阴道雌激素；阴道雌激素对大多数子宫内膜癌治疗后女性是安全的。[S02]
- 沟通障碍是真实存在的：一项美国妇科肿瘤医生调查中，只有 **59.6%** 常规询问性健康；**70.5%** 认为自己需要补性功能知识；NCCN 患者版也直言“谈性健康可能让人不舒服”。[S24][S04]
- 患者视角：不好意思开口、不知道是否“正常”、怕被说“都治癌了还想这些”、伴侣关系变化、缺乏私人空间。产品需要**默认私密、可选填、可跳过、可只给自己看**。

### 9.2 字段建议

| 字段 | 类型/取值 | 设计说明 | 依据 |
| --- | --- | --- | --- |
| `pelvic_rt_history` | enum: yes / no / unknown | 是否做过盆腔放疗 | S04 |
| `rt_type` | enum: EBRT / VBT / both / unknown | 放疗类型 | S04 |
| `rt_end_date` | date / ongoing | 放疗结束 | 产品字段 |
| `vaginal_dryness` | 0–4 / prefer_not_to_say | 症状程度 | S04 |
| `dyspareunia` | 0–4 / prefer_not_to_say | 性交痛 | S04 |
| `vaginal_stenosis_suspected` | boolean / unknown | 狭窄 | S04 |
| `vaginal_bleeding` | boolean / unknown | 异常出血需就医 | S02 |
| `dilator_use` | enum: not_used / planned / using / stopped | 使用状态 | S04 |
| `dilator_start_date` | date / not_started | 开始时间 | S23 |
| `dilator_frequency_per_week` | integer / unknown | 频率 | S23, S16 |
| `dilator_minutes_per_session` | integer / unknown | 每次时长 | S23, S16 |
| `dilator_size` | text / unknown | 尺寸 | S04 |
| `dilator_pain` | 0–4 / prefer_not_to_say | 使用疼痛 | S23 |
| `dilator_bleeding` | boolean / unknown | 使用出血 | S23 |
| `moisturizer_use` | enum: none / occasional / daily / unknown | 保湿剂 | S04 |
| `lubricant_use` | enum: none / sometimes / always / unknown | 润滑剂 | S04 |
| `vaginal_estrogen` | enum: prescribed / not_prescribed / unsure | 阴道雌激素 | S04, S02 |
| `sexual_activity` | enum: yes / no / prefer_not_to_say | 不强制 | 产品字段 |
| `communication_comfort` | 1–5 / prefer_not_to_say | 与医生谈性的舒适度 | S24 |
| `discussed_with_clinician` | boolean / unknown | 是否已谈 | S24 |
| `referral` | multi: sexual_health_therapist / pelvic_floor_pt / menopause_clinic / none | 转诊 | S04 |
| `private_mode` | boolean | 私密模式 | 产品字段 |

### 9.3 人话文案（解释不是判断）

- “放疗后阴道变窄、变干、性生活疼，是常见副作用，不是‘不正经’或‘矫情’。”（解释不是判断）
- “扩张器不是‘撑一撑就好’，需要按医生给的频率坚持一段时间；具体从哪天开始、用多大，听放疗/妇科医生。”（解释不是判断）
- “如果不想和医生说，可以先在工作台里私密记录；准备好后再带着记录去问。”（解释不是判断）

### 9.4 来源

| ID | 机构/作者 | 标题 | 日期 | 类型 | URL | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| S02 | FIGO / Koskas M 等 | Cancer of the corpus uteri: A 2025 update | 2025-09 | 国际指南更新全文 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12411821/ | 非中国指南 |
| S04 | NCCN | NCCN Guidelines for Patients: Uterine Cancer, 2026 | 2025-11-14 | 患者版指南 | https://www.nccn.org/patients/guidelines/content/PDF/uterine-patient.pdf | 患者版 |
| S16 | 孔为民（首都医科大学附属北京妇产医院） | 放射治疗后如何改善阴道健康状况 | 2016-01-01 | 医生科普 | https://www.haodf.com/zhuanjiaguandian/kongweimin_4054383919.htm | 非子宫内膜癌专属，年代较早 |
| S17 | 陈忠杰（天津医科大学肿瘤医院放疗科） | 宫颈癌放疗后需要定期使用阴道扩张器 | 2017-05-02 | 医生科普 | https://www.haodf.com/zhuanjiaguandian/chenzhongjiedr_5206840232.htm | 宫颈癌，频率与共识不一致 |
| S23 | Matos SRL 等 | Consensus for vaginal stenosis prevention in patients submitted to pelvic radiotherapy | 2019-08 | 国际共识 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6688793/ | 巴西版本，非中国指南 |
| S24 | Mehta N 等 | Physician perspectives on discussions around the sexual health and function of gynecologic cancer patients | 2025-06 | 横断面调查 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12163149/ | 美国，10.2% 应答率 |

---

## 10. 特殊人群

### 10.1 患者视角关键事实

**年轻患者（生育年龄）**

- 最核心的焦虑不是“能不能活”，而是“还能不能生”。NCCN 患者版把“生育力保留”放在诊断检查阶段就要问的选项里；FIGO 2025 把保育治疗限定在 G1、MRI 无肌层浸润的人群。[S04][S02]
- 年轻患者还可能面对：手术是否保留卵巢、是否要做遗传检测（Lynch）、治疗后怀孕的时间与方式、产后是否切除子宫。[S04][S02][S14]
- 生育年龄的子宫内膜癌在增加，部分与肥胖相关；减重可改善保育治疗的反应和妊娠机会。[S02]

**老年/合并症患者**

- II 型（浆液性等）更常见于高龄绝经后女性；常合并肥胖、高血压、糖尿病等。[S02]
- 治疗决策不只是“肿瘤分期”，还包括麻醉/手术风险评估、心肺功能、用药、衰弱、家庭支持、治疗目标。[S04][S02]
- NCCN 患者版在诊断阶段就列出“长期健康问题（肥胖、糖尿病、高血压）的照护”和“心理痛苦评估”。[S04]

**Lynch 综合征患者**

- 除了本次子宫内膜癌，还要面对结直肠癌、卵巢癌及其他 Lynch 相关癌的风险；需要肠镜等监测、降风险手术讨论、家系检测。[S02][S18]
- 年轻 Lynch 患者的卵巢切除时机要特别考虑，因为同时存在卵巢癌风险。[S02]
- 家系信息的隐私与“是否告知亲属”是长期心理负担，不是一次谈话能解决。[S27][S28]

**患者组织与支持资源**

- ECANA（Endometrial Cancer Action Network for African-American Women）提供就医准备、临床试验导航、病友故事与支持社区；属于患者资源，不是临床指南。[S26]

### 10.2 字段建议

| 字段 | 类型/取值 | 设计说明 | 依据 |
| --- | --- | --- | --- |
| `age_at_diagnosis` | integer | 特殊人群分流的起点 | 产品字段 |
| `menopausal_status` | enum: pre / peri / post / unknown | 与年龄一起看 | S02 |
| `fertility_desire` | enum: yes / no / unsure / prefer_not_to_say | 年轻患者必问 | S04 |
| `pregnancy_postpartum_status` | enum: not_pregnant / pregnant / postpartum / unknown | 治疗与妊娠冲突 | 产品字段 |
| `comorbidity_list` | multi: obesity / diabetes / hypertension / CVD / CKD / other | 合并症 | S04 |
| `frailty_score` | enum: fit / vulnerable / frail / unknown | 老年评估 | 产品字段 |
| `asa_score` | 1–4 / unknown | 麻醉风险 | 产品字段 |
| `polypharmacy` | boolean / unknown | 多药共用 | 产品字段 |
| `social_support` | enum: strong / limited / none / unknown | 照护资源 | 产品字段 |
| `goals_of_care_note` | text | 治疗目标（患者自述） | 产品字段 |
| `genetic_status` | enum: lynch / other_hereditary / negative / unknown | 遗传状态 | S02 |
| `family_history_flag` | boolean / unknown | 家系风险 | S18 |
| `distress_score` | 0–10 / prefer_not_to_say | 心理痛苦 | S04 |
| `financial_toxicity` | enum: none / mild / moderate / severe / prefer_not_to_say | 经济负担 | 产品字段 |
| `special_population_tag` | multi: young / older / lynch / comorbidity / none | 只用于内容路由，不用于医学决策 | 产品字段 |

### 10.3 人话文案（解释不是判断）

- “年轻不是保育的充分条件，肿瘤类型、肌层浸润和病理复核同样关键。”（解释不是判断）
- “年纪大、合并症多，不等于不能治疗；医生会把手术风险、化疗耐受和你的治疗目标一起考虑。”（解释不是判断）
- “Lynch 不是‘命中注定’，而是需要更早、更规律监测的一种遗传风险。”（解释不是判断）

### 10.4 来源

| ID | 机构/作者 | 标题 | 日期 | 类型 | URL | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| S02 | FIGO / Koskas M 等 | Cancer of the corpus uteri: A 2025 update | 2025-09 | 国际指南更新全文 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12411821/ | 非中国指南 |
| S04 | NCCN | NCCN Guidelines for Patients: Uterine Cancer, 2026 | 2025-11-14 | 患者版指南 | https://www.nccn.org/patients/guidelines/content/PDF/uterine-patient.pdf | 患者版 |
| S14 | 北京协和医院 | 协和“医”线故事：龙凤胎呱呱坠地，子宫内膜癌患者在协和重燃生育希望 | 2023-03-02 | 医院病例故事 | https://www.pumch.cn/detail/30262.html | 单例 |
| S18 | 赵迎超 | 林奇综合征相关子宫内膜癌——会遗传的子宫内膜癌 | 2021-03-21 | 医生科普 | https://www.haodf.com/neirong/wenzhang/9115672096.html | 风险数字较旧 |
| S26 | ECANA | Endometrial Cancer Action Network for African-American Women | 未标日期 | 患者组织 | https://ecanawomen.org/ | 美国非裔女性，非临床指南 |
| S27 | 全国人大《个人信息保护法》（转载） | 中华人民共和国个人信息保护法 | 2021-08-20 通过 / 2021-11-01 施行 | 法律 | https://www.ahxx.gov.cn/public/285/162065221.html | 非人大官网原文 |
| S28 | 国务院 | 中华人民共和国人类遗传资源管理条例 | 2019-06-10 公布 / 2019-07-01 施行 | 行政法规 | https://www.gov.cn/zhengce/content/2019-06/10/content_5398829.htm | 官方原文 |

---

## 11. 跨主题字段与红线

### 11.1 主数据与证据链

每个主题的事实字段都应能回溯到四元组：

| 字段 | 说明 |
| --- | --- |
| `source_type` | patient_report / medical_record / pathology / imaging / genetic_report / guideline / patient_education |
| `source_org` | 医院/实验室/指南机构 |
| `source_date` | 报告或指南发布日期 |
| `verification_status` | verified / single_source / secondary / unverified / pending |

**患者自报**与**病历导入**不要合成一个“事实”字段；冲突时保留两条，标 `conflict=true`，让医生/患者自己核对。

### 11.2 禁止进入产品的句子

- “你应该做/不做化疗、放疗、手术。”
- “POLEmut 不用治疗。”
- “p53abn 预后最差，必须化疗。”
- “dMMR 一定能用免疫治疗。”
- “多塔利单抗已在中国获批。”（截至 2026-10-24，未取得 NMPA 官方原文）
- “内膜厚度正常就没事。”
- “随访每年做 CT 才安心。”
- “阴道细胞学必须每次做。”
- “保育治疗能治好子宫内膜癌。”
- “Lynch 一定会得癌。”

### 11.3 待核验清单（截至 2026-10-24）

| 项 | 状态 | 说明 |
| --- | --- | --- |
| NMPA 帕博利珠单抗子宫内膜癌适应症官方原文 | 待核验 | 官网送达信息页 HTTP 412；仅有新华网/美通社 |
| NMPA 多塔利单抗中国获批状态 | 待核验（推断未获批） | 未检索到批准公告；2025-09 仍有中国 II 期临床启动 |
| 中国 2024/2025 妇科肿瘤临床实践指南子宫内膜癌分册全文 | 待核验 | 医脉通/丁香园登录墙，仅取到题录与概述 |
| 中国 Lynch 相关子宫内膜癌共识 2023/2025 全文 | 待核验 | 仅题录/摘要 |
| 中国分子分型共识 2024 全文 | 待核验 | 仅摘要 |
| 中国保育治疗专家共识全文 | 待核验 | 未取得 |
| 中国放疗后阴道狭窄防治指南/共识 | 缺口 | 未检索到国家级共识；现有为国际共识与医生科普 |
| 中国患者分子检测可及性/医保/自付费用 | 缺口 | 无全国数据；只有零散报道 |
| 中国子宫内膜癌患者性健康/沟通障碍的本土研究 | 缺口 | 现有为美国调查 |
| 中国 Lynch 家系 cascade 检测覆盖率 | 缺口 | 无数据 |

### 11.4 建议的产品分层

| 层 | 内容 | 例子 |
| --- | --- | --- |
| L1 事实层 | 患者自己的报告、日期、数值、来源 | 内膜厚度、病理分级、分子结果、手术日期 |
| L2 解释层 | 指南/患教的白话解释，标“解释不是判断” | “G1/G2/G3 是分级不是分期” |
| L3 路径层 | 记录“医生说过什么方案”，不生成方案 | “医生建议 VBT，2026-11 开始” |
| L4 提醒层 | 随访日期、复查、症状红旗、未填项 | “距下次随访 2 周”“出现出血请就医” |
| X 禁止层 | 诊断、处方、治疗建议、预后承诺 | “你应该化疗”“你已治愈” |

---

## 12. 来源总表（33 条，含 S05b 转载核对件）

> 说明：S05b 为 S05 的转载核对件，计入来源总数；同一机构不同文档分别编号。标注“待核验/全文未取”的条目，界面不得写成确定结论。

| ID | 机构/作者 | 标题 | 日期 | 类型 | URL | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| S01 | FIGO / Berek JS 等 | FIGO staging of endometrial cancer: 2023 | 2023-08 | 国际分期原文 | https://doi.org/10.1002/ijgo.14923 | 全文付费，摘要与公开综述核对 |
| S02 | FIGO / Koskas M 等 | Cancer of the corpus uteri: A 2025 update | 2025-09 | 国际指南更新全文 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12411821/ | 非中国指南 |
| S03 | Sehnal B 等 | New FIGO 2023 Staging System of Endometrial Cancer: An Updated Review | 2025-04 | 综述 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11968139/ | 二手综述 |
| S04 | NCCN | NCCN Guidelines for Patients: Uterine Cancer, 2026 | 2025-11-14 | 患者版指南 | https://www.nccn.org/patients/guidelines/content/PDF/uterine-patient.pdf | 患者版，美国口径 |
| S05 | 国家卫生健康委办公厅 | 子宫内膜癌诊疗指南（2022年版） | 2022-04 | 国家指南 | https://www.nhc.gov.cn/yzygj/c100068/202204/0c1f7d3aca0545abbeb02030ce255930.shtml | 官网 412；2009 分期 |
| S05b | 人人文库用户转载 | 子宫内膜癌诊疗指南（2022年版） | 2024-08-24 上传 | 转载件 | https://www.renrendoc.com/paper/344026473.html | 非官方页，仅核对条文 |
| S06 | 中华医学会妇科肿瘤学分会 | 中国妇科肿瘤临床实践指南 2024 版——子宫内膜癌 | 2024-08-31 | 中国学会指南 | https://guide.medlive.cn/guideline/35638；https://www.sohu.com/a/805316350_121124545 | 登录墙，全文未取 |
| S07 | 中华医学会妇科肿瘤学分会 | 2025 中国妇科肿瘤临床实践指南——子宫内膜癌 | 2025-09-20 | 中国学会指南 | https://drugs.dxy.cn/pc/clinicalGuidelines/p3hqrGKOFFyjvg1fW5B9rXQ | 登录墙，仅概述 |
| S08 | CSCO 指南会 / 肿瘤瞭望 | 2025 CSCO 子宫内膜癌指南更新要点 | 2025-04-30 | 会议报道 | https://news.qq.com/rain/a/20250430A0742C00 | 二手 |
| S09 | 医脉通（网易号转载） | 2024 年 CSCO 子宫内膜癌诊疗指南更新要点 | 2024-05-02 | 会议报道 | https://www.163.com/dy/article/J170H5GF053438SI.html | 二手 |
| S10 | 中国医师协会妇产科医师分会妇科肿瘤学组 | Lynch 综合征相关性子宫内膜癌筛查与防治中国专家共识（2023年版） | 2023-01-02 | 中国专家共识 | https://www.medsci.cn/guideline/show_article.do?id=db3c31c0029a4391 | 全文需 PDF，未取 |
| S11 | 中国实用妇科与产科杂志 | 子宫内膜癌分子分型临床应用中国专家共识（2024年版） | 2024（40卷6期） | 中国专家共识 | https://www.sinomed.ac.cn/article.do?ui=2024384970 | 仅摘要 |
| S12 | 中华医学会妇科肿瘤学分会等 | 林奇综合征相关妇科恶性肿瘤综合管理中国专家共识（2025年版） | 2025 | 中国专家共识 | https://guide.medlive.cn/guideline/34071 | 登录墙，未取 |
| S13 | 科普中国（湖南省第二人民医院 杨欣） | 绝经后阴道出血，别忽视！小心是子宫内膜癌的“无声警报” | 2024-11-08 | 患教 | https://www.kepuchina.cn/article/articleinfo?ar_id=543143&business_type=100&classify=0 | 未给厚度数值 |
| S14 | 北京协和医院 | 协和“医”线故事：龙凤胎呱呱坠地，子宫内膜癌患者在协和重燃生育希望 | 2023-03-02 | 医院病例故事 | https://www.pumch.cn/detail/30262.html | 单例 |
| S15 | 北京协和医院 | 告诉你妇科癌症筛查的秘密 | 2016-04-18 | 医院患教 | https://www.pumch.cn/detail/13171.html | 年代较早 |
| S16 | 孔为民（北京妇产医院） | 放射治疗后如何改善阴道健康状况 | 2016-01-01 | 医生科普 | https://www.haodf.com/zhuanjiaguandian/kongweimin_4054383919.htm | 非 EC 专属，年代较早 |
| S17 | 陈忠杰（天津医科大学肿瘤医院） | 宫颈癌放疗后需要定期使用阴道扩张器 | 2017-05-02 | 医生科普 | https://www.haodf.com/zhuanjiaguandian/chenzhongjiedr_5206840232.htm | 宫颈癌，频率与共识不一致 |
| S18 | 赵迎超（华中科技大学同济医学院附属协和医院） | 林奇综合征相关子宫内膜癌——会遗传的子宫内膜癌 | 2021-03-21 | 医生科普/转载 | https://www.haodf.com/neirong/wenzhang/9115672096.html | 风险数字较旧，转载 |
| S19 | Addante F 等 | Mismatch Repair Deficiency as a Predictive and Prognostic Biomarker in Endometrial Cancer | 2024-01 | 综述 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10816607/ | 二手综述 |
| S20 | Galant N 等 | Molecular Classification of Endometrial Cancer and Its Impact on Therapy Selection | 2024-05 | 综述 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11172295/ | 二手综述 |
| S21 | ESGO/ESTRO/ESP / Concin N 等 | ESGO-ESTRO-ESP guidelines for the management of patients with endometrial carcinoma: update 2025 | 2025-08 | 国际指南更新（摘要） | https://doi.org/10.1016/S1470-2045(25)00167-6 | 全文付费 |
| S22 | 复旦大学附属肿瘤医院 / Yu C 等 | Clinical application of FIGO 2023 staging system of endometrial cancer in a Chinese cohort | 2024-07 | 中国单中心队列 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11264810/ | 回顾性，单中心 |
| S23 | Matos SRL 等 | Consensus for vaginal stenosis prevention in patients submitted to pelvic radiotherapy | 2019-08 | 国际共识 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6688793/ | 巴西版本，非中国指南 |
| S24 | Mehta N 等 | Physician perspectives on discussions around the sexual health and function of gynecologic cancer patients | 2025-06 | 横断面调查 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12163149/ | 美国，10.2% 应答 |
| S25 | Hsu YT 等 | Long-term outcomes of fertility-sparing treatment in endometrial carcinoma and EIN | 2025-10 | 回顾性队列 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12451189/ | 单中心 40 例 |
| S26 | ECANA | Endometrial Cancer Action Network for African-American Women | 未标日期 | 患者组织 | https://ecanawomen.org/ | 美国非裔女性，非临床指南 |
| S27 | 全国人大《个人信息保护法》（地方政府网站转载） | 中华人民共和国个人信息保护法 | 2021-08-20 通过 / 2021-11-01 施行 | 法律 | https://www.ahxx.gov.cn/public/285/162065221.html | 非人大官网原文 |
| S28 | 国务院 | 中华人民共和国人类遗传资源管理条例 | 2019-06-10 公布 / 2019-07-01 施行 | 行政法规 | https://www.gov.cn/zhengce/content/2019-06/10/content_5398829.htm | 官方原文 |
| S29 | 新华网 / 美通社 | 帕博利珠单抗在华获批原发晚期或复发性子宫内膜癌适应症 | 2026-02-07 / 2026-02-06 | 官方媒体 + 企业公告 | http://www.xinhuanet.com/digital/20260207/04c21c0bcc25437dae1ec8d2e429a5f2/c.html；https://www.prnasia.com/story/521636-1.shtml | NMPA 官网 412，待核验 |
| S30 | 新浪财经 | 葛兰素史克 dostarlimab 启动 II 期临床，适应症为原发性晚期或复发性子宫内膜癌 | 2025-09-18 | 财经报道 | https://finance.sina.com.cn/stock/aigc/ywsygs/2025-09-18/doc-infqwutr0787272.shtml | 未检索到 NMPA 批准，推断未获批 |
| S31 | MedlinePlus | Lynch syndrome | 2021-04-15 | 政府患教 | https://medlineplus.gov/genetics/condition/lynch-syndrome/ | 未给 50% 数字 |
| S32 | Zheng W | Molecular Classification of Endometrial Cancer and the 2023 FIGO Staging: Exploring the Challenges and Opportunities for Pathologists | 2023-08 | 综述 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10452831/ | 二手综述，病理视角 |

---

## 13. 一页纸结论（给产品）

1. **分期是动态的**：活检、手术大病理、分子结果都可能改变期别；产品要显示“哪一次、依据什么、变了没有”，不能只显示最终标签。
2. **分子分型是肿瘤标签，不是遗传检测**；MMRd ≠ Lynch，POLE VUS ≠ POLEmut，p53 异常 ≠ 浆液性癌。
3. **指南推荐、中国获批、医保报销是三件事**；NMPA 未取到官方原文的，界面必须写“待核验”。
4. **随访的重点是症状+妇科检查**，不是常规影像/阴道细胞学；高强度随访不改善生存。
5. **放疗后性健康是医学问题**，不是“隐私羞耻”；扩张器、保湿剂、润滑剂、阴道雌激素都有指南/共识语境，但具体用法由医生定。
6. **保育治疗是延迟手术、争取生育时间**，不是治愈；完全缓解后仍可能复发，产后通常仍建议切除子宫。
7. **Lynch 家系信息是敏感个人信息**；产品只能帮患者整理自己的结果和“建议告知谁”，不能替亲属建档或默认共享。
8. **所有患者解释句都要标“解释不是判断”**；产品不做诊断、不做处方、不做预后承诺。
