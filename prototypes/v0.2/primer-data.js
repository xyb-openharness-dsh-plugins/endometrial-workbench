/* 小膜宝 EndoPal · 疾病概要数据（36 号）
 * 口径：docs/DISEASE-PRIMER.md；规范：starter docs/36-DISEASE-PRIMER.md。
 * 全部内容属第 ② 层（解释）：只写定义、文件、指南列举过的手段、已发生的变化。
 * 任何「你该怎么办」的判断都不在这里，固定出口是「这一句需要问你的医生」。
 *
 * 原件状态照实写：FIGO 2025 更新为开放获取全文（PMC12411821），其余指南为付费/登录墙/仅摘要，
 * 一律标「未取得原件」；NMPA 批件只有官方媒体与企业公告，NMPA 官网 412，批件号未核实。
 *
 * 链接口径（36 号 §2.5，2026-10-27）：
 *   每条 https 链接都用 primer-backfill 的 verify-links.mjs 真浏览器验过 OK 才写入；
 *   拿不到可验证页的行写 nolink:true + note，不编 URL。
 *   - PMC 正文页对无头浏览器返回 203/空正文，故 FIGO 2025 指向 Europe PMC 全文 XML（同一 PMCID）。
 */
window.DISEASE_PRIMER = {
  brand: '小膜宝 EndoPal',
  name: '子宫内膜癌',
  en: 'Endometrial Cancer',
  updated: '2026-10-27',
  sections: [
    {
      id: 'definition',
      title: '定义',
      intro: '子宫内膜癌是发生在子宫内膜上皮的恶性肿瘤。这个病的特点在分期上：2023 年起，期别不只看「长到哪」，'
        + '还看组织学类型、分级、淋巴血管间隙浸润（LVSI）与分子分型。',
      points: [
        '病理类型按 WHO 2020 形态学分类命名：子宫内膜样癌、浆液性癌、透明细胞癌、癌肉瘤、未分化/去分化癌、混合性癌、中肾样癌、胃肠型黏液癌、神经内分泌癌等。「I 型 / II 型」是历史概念，不是今天病理报告的格式。',
        '组织学分级 G1 / G2 / G3 是显微镜下的分级，不是分期：对子宫内膜样癌按实性生长区比例（≤5% / 6–50% / >50%）。',
        '分期用 FIGO 2023：期别后可加 m 与分子型，例如 IAmPOLEmut、IICmp53abn；分子分型是肿瘤的体细胞特征，不是遗传检测。',
        '本台只抄病理与分子报告的原文，不把「期别后面多了个 m」解释成严重或好转，也不自算期别。'
      ],
      sources: [
        { org: 'FIGO', doc: 'Cancer of the corpus uteri: A 2025 update', version: '2025-09', original: true, url: 'https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12411821/fullTextXML', page: '开放获取全文（PMC12411821）', note: 'PMC 正文页对无头浏览器返回 203，链接指向 Europe PMC 全文' },
        { org: 'FIGO', doc: 'FIGO staging of endometrial cancer: 2023', version: '2023-08', original: false, secondaryUrl: 'https://www.jcancer.org/v16p4400.htm', page: '页码待核', note: '全文付费，摘要与公开综述核对' },
        { org: 'WHO', doc: 'WHO 2020 形态学分类（据 FIGO 2025 更新转引）', version: '2020', original: false, secondaryUrl: 'https://publications.iarc.who.int/Book-And-Report-Series/Who-Classification-Of-Tumours/Female-Genital-Tumours-2020', page: '页码待核' }
      ]
    },
    {
      id: 'evidence',
      title: '医学资料规范和指南情况',
      intro: '这台工作台里出现的每一条「怎么分期、术后要不要辅助治疗、多久随访」，都应能追到下面某一份文件。'
        + '只有 FIGO 2025 更新拿到了开放全文，其余都只到摘要、登录墙或患者版引用——表里照实写。',
      table: {
        head: ['机构', '文件', '版本 / 年份', '原件', '本台的用途'],
        rows: [
          ['FIGO', 'Cancer of the corpus uteri: A 2025 update', '2025-09（开放获取全文）', { text: '已取得（开放获取全文）', url: 'https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12411821/fullTextXML' }, '症状评估、分子分型与分期规则、治疗语境、随访'],
          ['FIGO', 'FIGO staging of endometrial cancer: 2023', '2023-08', { text: '未取得原件，据二次来源（公开综述）', url: 'https://www.jcancer.org/v16p4400.htm' }, 'FIGO 2023 期别结构与 m 标签'],
          ['NCCN', 'NCCN Guidelines for Patients: Uterine Cancer, 2026（基于 Uterine Neoplasms V2.2026）', '2025-11-14（患者版）', { text: '未取得原件，据二次来源（NCCN 患者版页）', url: 'https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients/guidelines-for-patients-details?patientGuidelineId=41' }, '手术范围、辅助治疗选项、随访频率'],
          ['ESGO / ESTRO / ESP', 'ESGO-ESTRO-ESP guidelines: update 2025', '2025-08', { text: '未取得原件，据二次来源（ESGO 指南页）', url: 'https://www.esgo.org/guidelines/search-guidelines/endometrial/' }, '与 FIGO 2023 分期的衔接'],
          ['国家卫生健康委', '子宫内膜癌诊疗指南（2022年版）', '2022-04', { text: '未取得原件', nolink: true, note: '卫健委官网旧链已 404、站内检索不可用；仅省卫健委 PDF 转载可下载，PDF 无法脚本验活' }, '国内口径；采用 FIGO 2009 分期'],
          ['中华医学会妇科肿瘤学分会', '中国妇科肿瘤临床实践指南 2025——子宫内膜癌', '2025-09-20', { text: '未取得原件', nolink: true, note: '登录墙；检索未获公开可读页' }, '国内实践对照'],
          ['WHO', 'WHO 2020 形态学分类', '2020', { text: '未取得原件，据二次来源（IARC 分卷页）', url: 'https://publications.iarc.who.int/Book-And-Report-Series/Who-Classification-Of-Tumours/Female-Genital-Tumours-2020' }, '组织学类型命名口径']
        ]
      },
      points: [
        '同一病种里分期体系有两套：国内 FIGO 2023 与 2022 版国家指南采用的 FIGO 2009 并存。本表两行都列，不做换算。',
        '未取得原件的文件只记「存在」与「大致讲什么」，不引用其具体条文，页码写「页码待核」。',
        '「指南推荐」「中国获批」「医保报销」是三件事：本台把它们分字段显示，不合成一句话。'
      ],
      sources: [
        { org: 'FIGO', doc: 'Cancer of the corpus uteri: A 2025 update', version: '2025-09', original: true, url: 'https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12411821/fullTextXML', page: '开放获取全文（PMC12411821）' },
        { org: 'NCCN', doc: 'NCCN Guidelines for Patients: Uterine Cancer, 2026', version: '2025-11-14', original: false, secondaryUrl: 'https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients/guidelines-for-patients-details?patientGuidelineId=41', page: '页码待核' },
        { org: '国家卫生健康委', doc: '子宫内膜癌诊疗指南（2022年版）', version: '2022-04', original: false, nolink: true, page: '页码待核', note: '官网旧链 404、站内检索不可用；仅省卫健委 PDF 转载' }
      ]
    },
    {
      id: 'landscape',
      title: '目前治疗全景概要',
      intro: '下面按病期与线序列出指南里出现过的手段类别。这是「世界上大致有哪些办法」的地图，不是给你排的先后顺序，'
        + '也不含剂量、疗程与适用条件——那些必须由医生按你的分期、病理与分子结果决定。',
      groups: [
        {
          label: '局限在子宫（以手术为主）',
          points: [
            '手术：全子宫 + 双侧输卵管卵巢切除（TH+BSO）是常见范围；侵犯宫颈间质时可能需根治性子宫切除；局限在子宫的子宫内膜样癌，微创手术是常见路径。',
            '淋巴结评估：前哨淋巴结活检（SLN）与淋巴结清扫两条路径都在指南里；影像/术中判断淋巴结阴性时，SLN 是可接受的做法。',
            '年轻、病变局限、低危者可与医生讨论保留卵巢；不是所有患者都适合。',
            '术后辅助治疗：按分期、组织学、分级、LVSI、切缘决定观察、阴道近距离放疗（VBT）、体外放疗（EBRT）或化疗。'
          ]
        },
        {
          label: '局部晚期 / 晚期 / 复发',
          points: [
            '系统治疗：化疗（常用卡铂 + 紫杉醇）与激素治疗按分期与病理类型列出；MMRd 与免疫检查点抑制剂联合在指南里有条目，p53abn 与化疗语境相关。',
            '放疗：EBRT 与 VBT 可单独或与系统治疗联合使用。',
            '特殊病理类型：浆液性癌、透明细胞癌、癌肉瘤按高风险类型处理，HER2 检测用于晚期/转移性浆液性癌或癌肉瘤。',
            '临床研究：指南把「参加登记良好的临床试验」列为一项正式选项，不是最后手段。'
          ]
        },
        {
          label: '需要单列的情形',
          points: [
            '保育治疗（年轻未育）：前提是 G1 子宫内膜样癌、MRI 判断无肌层浸润；方案包括左炔诺孕酮宫内节育器（LNG-IUD）与口服孕激素。这是延迟手术、争取生育时间，不是治愈。',
            'Lynch 综合征相关：所有子宫内膜癌建议做 MMR IHC 初筛；确认 Lynch 后涉及降风险手术与家系检测的讨论，属遗传咨询与医生判断。'
          ]
        },
        {
          label: '贯穿全程的两件事',
          points: [
            '随访节奏：治疗后前 2–3 年每 3–6 个月、第 4–5 年每 6–12 个月、第 5 年后每年（NCCN 患者版 2026；国内 2022 版表述一致）。无症状患者不做常规影像；阴道细胞学不推荐常规做。',
            '放疗后性健康：阴道干燥、性交痛、阴道狭窄是常见副作用；阴道扩张器、保湿剂、润滑剂、阴道雌激素都有指南/共识语境，具体用法由医生定。本台默认私密、可选填、可跳过。'
          ]
        }
      ],
      points: [
        '以上是文献与指南里列出的手段，按病期与线序排列，不代表任何一项适合你。选哪一个，这一句需要问你的医生。'
      ],
      sources: [
        { org: 'FIGO', doc: 'Cancer of the corpus uteri: A 2025 update', version: '2025-09', original: true, url: 'https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12411821/fullTextXML', page: '开放获取全文（PMC12411821）' },
        { org: 'NCCN', doc: 'NCCN Guidelines for Patients: Uterine Cancer, 2026', version: '2025-11-14', original: false, secondaryUrl: 'https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients/guidelines-for-patients-details?patientGuidelineId=41', page: '页码待核' },
        { org: '国家卫生健康委', doc: '子宫内膜癌诊疗指南（2022年版）', version: '2022-04', original: false, nolink: true, page: '页码待核', note: '官网旧链 404；仅省卫健委 PDF 转载' }
      ]
    },
    {
      id: 'trend',
      title: '发展趋势',
      intro: '这一段只写已经发生的事：哪一版分期生效、哪一天发布、登记平台上多了多少条、监管批件到了哪一步。'
        + '不写预测，不做评价，也不给任何倾向。',
      points: [
        '2023-08：FIGO 发布子宫内膜癌 2023 分期，把分子分型写入期别（如 IAmPOLEmut、IICmp53abn）。',
        '2025-08：ESGO / ESTRO / ESP 发布 2025 更新，纳入 FIGO 2023 分期（本项目仅取得摘要）。',
        '2025-09：FIGO 发布 Cancer of the corpus uteri: A 2025 update（开放获取全文）。',
        '2026-02-06 / 2026-02-07：据新华网与美通社报道，NMPA 批准帕博利珠单抗联合卡铂和紫杉醇用于 dMMR 原发晚期或复发性子宫内膜癌一线、随后单药维持；NMPA 官网送达信息页返回 HTTP 412，批件号未核实。',
        '截至 2026-10-25：本项目采集到子宫内膜癌 2026 年登记 chinadrugtrials（CDE）49 条、ClinicalTrials.gov 62 条；chictr_online / ictrp 六个仓库状态为 FAILED（未查过，不计覆盖），阶段分布本台尚未统计。'
      ],
      sources: [
        { org: 'FIGO', doc: 'FIGO staging of endometrial cancer: 2023', version: '2023-08', original: false, secondaryUrl: 'https://www.jcancer.org/v16p4400.htm', page: '页码待核', note: '全文付费，据公开综述核对' },
        { org: 'ESGO / ESTRO / ESP', doc: 'ESGO-ESTRO-ESP guidelines: update 2025', version: '2025-08', original: false, secondaryUrl: 'https://www.esgo.org/guidelines/search-guidelines/endometrial/', page: '仅摘要，页码待核' },
        { org: '新华网 / 美通社', doc: '帕博利珠单抗在华获批原发晚期或复发性子宫内膜癌适应症', version: '2026-02-06 / 2026-02-07', original: false, nolink: true, page: '页码待核', note: '报道页未取得可验证链接；NMPA 官网 412，批件号未核实' },
        { org: 'chinadrugtrials（CDE）/ ClinicalTrials.gov', doc: '2026 年子宫内膜癌试验登记采集', version: '快照 2026-10-25', original: true, nolink: true, note: '一手登记数据，本项目自采；分散在多个登记库，无单一可点原件' }
      ]
    }
  ]
}
