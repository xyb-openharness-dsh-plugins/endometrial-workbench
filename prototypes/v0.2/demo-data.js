/* 由 demo/build-demo-data.mjs 生成；勿手改，改数据请改生成器后重新运行。 */
window.DEMO_DATA = {
  "meta": {
    "dataStart": "2026-04-24",
    "today": "2026-10-24",
    "windowStart": "2026-04-24",
    "windowEnd": "2026-10-24",
    "disclaimer": "演示数据（合成）：人物、数值与时间线不指向任何真实患者。",
    "sourceNote": "医学口径引用 FIGO 2023 分期（含分子标签）、国家卫健委《子宫内膜癌诊疗指南（2022 年版）》、NCCN 2026 与 ESGO/ESTRO/ESP 2021 的原文摘录；所有「人话解释」使用通常/可能/在某版指南里等限定词，不合成建议。",
    "trialNote": "试验条目取自 research/endometrial-cancer/trials-2026.jsonl 的真实登记摘录（2026-10 快照）；登记状态，未核实，不构成推荐，也不判入组资格；NMPA 状态逐药标「待核验」。",
    "version": "0.2.0",
    "brand": "小膜宝 EndoPal",
    "disease": "endometrial"
  },
  "catalog": {
    "WEIGHT": {
      "key": "WEIGHT",
      "name": "体重",
      "unit": "kg",
      "cat": "体重与营养",
      "color": "#6A55B8",
      "dec": 1,
      "note": "只记体重事实；变化含义请结合饮食与活动记录给医生看，解读归医生与营养科。"
    },
    "BLEED_DAYS": {
      "key": "BLEED_DAYS",
      "name": "出血持续天数",
      "unit": "天",
      "cat": "出血轨道",
      "color": "#A8577A",
      "dec": 0,
      "note": "来自出血日志，只记「持续几天」；不判病因、不做严重度评分。"
    },
    "IMG_MM": {
      "key": "IMG_MM",
      "name": "内膜厚度（TVS 双层）",
      "unit": "mm",
      "cat": "同模态影像测量",
      "color": "#2F6F66",
      "dec": 1,
      "note": "只有同一测量方式（TVS 双层内膜）才并列；跨模态不共轴，本台不判读。"
    },
    "TX_EVENT": {
      "key": "TX_EVENT",
      "name": "治疗事件节点",
      "unit": "",
      "cat": "分类节点",
      "color": "#8A5B7B",
      "dec": 0,
      "categorical": true,
      "note": "手术 / 放疗 / 保育节点只画点不连线；节点是记录事实，不是趋势结论。"
    },
    "MOLECULAR_EVENT": {
      "key": "MOLECULAR_EVENT",
      "name": "分子结果日期",
      "unit": "",
      "cat": "分类节点",
      "color": "#B08A5B",
      "dec": 0,
      "categorical": true,
      "note": "分子结果日期只画点不连线。"
    },
    "FOLLOWUP_EVENT": {
      "key": "FOLLOWUP_EVENT",
      "name": "随访节点",
      "unit": "",
      "cat": "分类节点",
      "color": "#55707E",
      "dec": 0,
      "categorical": true,
      "note": "随访节点只画点不连线。"
    }
  },
  "profiles": [
    {
      "id": "demo1",
      "name": "周慧敏（演示）",
      "age": 52,
      "sex": "女",
      "diagnosis": "子宫内膜样腺癌 G2 · FIGO IA2 期 · 术后辅助阴道残端近距离放疗后（演示）",
      "diagnosisShort": "子宫内膜样 G2 · FIGO IB · 放疗后随访",
      "stageLine": "FIGO 2023：IA2 期（肌层浸润 <1/2）；分子：pMMR / p53 野生型 / POLE 未检测",
      "primaryRole": "PATIENT",
      "caregiverLabel": "女儿（照护者）",
      "headline": "绝经后又出血，从确诊到放疗结束的 5 个月，都留了原文和日期。",
      "meta": {
        "windowStart": "2026-04-24",
        "windowEnd": "2026-10-24",
        "dataStart": "2026-04-24",
        "menopause": "绝经 4 年（52 岁）",
        "histology": "子宫内膜样腺癌（WHO 2020）",
        "grade": "FIGO G2",
        "fertilityDesire": "无（已完成生育）",
        "lynchScreened": false
      },
      "hero": {
        "bleeding": "绝经后出血 3 次（2026-04-28 → 2026-05-18）",
        "molecular": "pMMR · p53 野生 · POLE 未检测（未检测≠阴性）",
        "pathway": "手术 2026-06-11 → 阴道残端近距离放疗 3 次 → 随访",
        "private": "放疗后私密记录 2 条（默认 private）"
      },
      "bleeding": {
        "intro": "出血日志只记「什么时候、多少、持续几天、有没有血块/排液、当时在做什么」；不判断原因，也不给严重程度评分。",
        "note": "本页没有「病因」「疾病性质」「严重度」列。绝经后出血需要就医评估，这一点由医生当面判断；工作台只帮你把时间线记清楚。",
        "status": "确诊前 3 条；手术后未再记录。",
        "rows": [
          {
            "id": "B1",
            "d": "2026-04-28",
            "menopause": "绝经 4 年",
            "pattern": "突然出血",
            "volume": "少量（护垫）",
            "days": 4,
            "clots": "无",
            "discharge": "无",
            "trigger": "无诱因（不是同房后）",
            "source": "本人记录",
            "author": "PATIENT"
          },
          {
            "id": "B2",
            "d": "2026-05-06",
            "menopause": "绝经 4 年",
            "pattern": "再次出血",
            "volume": "中等（日用卫生巾）",
            "days": 3,
            "clots": "有小血块",
            "discharge": "少量淡粉色排液",
            "trigger": "走路多的一天",
            "source": "本人记录",
            "author": "PATIENT"
          },
          {
            "id": "B3",
            "d": "2026-05-18",
            "menopause": "绝经 4 年",
            "pattern": "第三次出血",
            "volume": "少量（护垫）",
            "days": 5,
            "clots": "无",
            "discharge": "无",
            "trigger": "无诱因",
            "source": "本人记录（就诊前整理）",
            "author": "PATIENT"
          }
        ]
      },
      "exam": {
        "note": "TVS 内膜厚度要带单位、测量口径与局限；「厚度正常」不等于「没事」，取样是否足够也要记。",
        "rows": [
          {
            "d": "2026-04-24",
            "kind": "经阴道超声（TVS）",
            "thickness": "9.4 mm",
            "caliber": "双层内膜，纵切最大径",
            "limit": "子宫后位，宫底显示欠清",
            "sample": "—",
            "sufficient": "—",
            "pain": "—",
            "quote": "「子宫内膜厚约 9.4mm，回声不均，建议进一步评估。」"
          },
          {
            "d": "2026-05-20",
            "kind": "诊室 Pipelle 内膜取样",
            "thickness": "10.2 mm（同日 TVS）",
            "caliber": "双层内膜",
            "limit": "取样组织量偏少",
            "sample": "Pipelle",
            "sufficient": "足够（病理报告注明）",
            "pain": "4/10（本人自述「像痛经」）",
            "quote": "「取内膜组织 3 条，送病理。」"
          },
          {
            "d": "2026-06-11",
            "kind": "手术大病理（全子宫+双附件）",
            "thickness": "—",
            "caliber": "—",
            "limit": "—",
            "sample": "手术标本",
            "sufficient": "足够",
            "pain": "—",
            "quote": "「内膜样腺癌，G2，浸润肌层 <1/2。」"
          }
        ]
      },
      "pathology": {
        "note": "逐项照抄报告原文与日期；分级、分型与分期均由病理与临床团队给出，本页不重算、不解释「严重不严重」。",
        "rows": [
          {
            "item": "组织学类型",
            "value": "子宫内膜样腺癌（WHO 2020）",
            "d": "2026-05-27",
            "quote": "「子宫内膜样腺癌。」"
          },
          {
            "item": "FIGO 分级",
            "value": "G2",
            "d": "2026-05-27",
            "quote": "「FIGO 分级 G2，实性生长区约 20%。」"
          },
          {
            "item": "肌层浸润",
            "value": "<1/2（约 6mm/12mm）",
            "d": "2026-06-16",
            "quote": "「肿瘤浸润肌层约 6mm，未达肌层外 1/2。」"
          },
          {
            "item": "LVSI",
            "value": "未见明确脉管侵犯",
            "d": "2026-06-16",
            "quote": "「未见明确脉管癌栓。」"
          },
          {
            "item": "宫颈间质",
            "value": "未受累",
            "d": "2026-06-16",
            "quote": "「宫颈间质未见肿瘤累及。」"
          },
          {
            "item": "附件 / 浆膜 / 腹膜",
            "value": "均未受累",
            "d": "2026-06-16",
            "quote": "「双附件、浆膜面及腹膜未见肿瘤。」"
          },
          {
            "item": "淋巴结",
            "value": "前哨淋巴结 0/3 见转移",
            "d": "2026-06-16",
            "quote": "「SLN：0/3 枚见转移。」"
          }
        ],
        "typeNote": "组织学类型与分级是肿瘤的「标签」，不是遗传检测；MMR 缺失也不等于 Lynch（见 Lynch 与家系线）。"
      },
      "stage": {
        "note": "FIGO 2023 把分子分型纳入分期标签（如 IAmPOLEmut、IIIC1mp53abn）。本页只记录「哪一次、依据什么、变了没有」，不自算、不判定。",
        "versions": [
          {
            "d": "2026-05-27",
            "anatomical": "IA 期（活检后临床分期，待术后病理）",
            "finalLabel": "IA（暂定，依据活检）",
            "marker": "分子结果未出",
            "change": "unknown",
            "basis": "诊室取样病理 + TVS；医生记录「待术后大病理复核」",
            "current": false
          },
          {
            "d": "2026-06-16",
            "anatomical": "IA2 期（肌层浸润 <1/2）",
            "finalLabel": "IA2 期（解剖期）",
            "marker": "pMMR / p53 野生 / POLE 未检测",
            "change": "none",
            "basis": "术后大病理：内膜样 G2，浸润肌层约 6mm；SLN 0/3；分子结果见分子三态页",
            "current": true
          },
          {
            "d": "2026-07-02",
            "anatomical": "IA2 期（复核不变）",
            "finalLabel": "IA2 期（解剖期，分子未改变期别）",
            "marker": "pMMR / p53 野生 / POLE 未检测",
            "change": "none",
            "basis": "放疗科会诊记录原文：「按 IA2 期，分子未见改变期别的依据。」",
            "current": true
          }
        ],
        "stageNote": "期别是否变化、依据哪一条，以医生记录为准；本页没有 TNM/分子→期别的推导列，也不写「升级/降级」这类吓人的词。"
      },
      "molecular": {
        "note": "三个标记各自独立：MMR 看四个蛋白与 MLH1 甲基化；p53 看蛋白表达模式；POLE 看致病性变异还是 VUS。未检测的项目不能当作「没有」。",
        "markers": [
          {
            "key": "MMR",
            "marker": "MMR（错配修复）",
            "result": "not_detected",
            "value": "pMMR（四个蛋白均保留表达）",
            "method": "免疫组化 IHC",
            "specimen": "手术标本",
            "d": "2026-06-16",
            "explain": "四个蛋白都保留了表达，报告写作 pMMR。它是肿瘤的标签，不是遗传检测结果；MMRd 也不等于 Lynch。"
          },
          {
            "key": "p53",
            "marker": "p53",
            "result": "not_detected",
            "value": "野生型表达模式（散在弱阳性）",
            "method": "免疫组化 IHC",
            "specimen": "手术标本",
            "d": "2026-06-16",
            "explain": "报告写「野生型表达模式」。这是蛋白表达模式，不是基因测序；异常模式也不等于某一种组织学类型。"
          },
          {
            "key": "POLE",
            "marker": "POLE",
            "result": "not_tested",
            "value": "未检测（报告里没有这一项）",
            "method": "—",
            "specimen": "—",
            "d": "",
            "explain": "报告中没有 POLE 检测。未检测不等于阴性，也不等于「没有 POLE 突变」；要不要补测，请问医生。"
          }
        ],
        "multiple": "本档案为单一分子语境：MMR 完整（pMMR）、p53 野生型、POLE 未检测；报告未注明 multiple classifier。POLE 未检测不等于非超突变——未检测就是未检测。",
        "testsStatus": "MMR：已出结果；p53：已出结果；POLE：未提供检测（not_tested）。"
      },
      "compare": {
        "note": "下表只回答「谁说了什么」：指南原文 / 中国获批 / 医保可及三列分开，没有「推荐等级」「应该用」这类列。解释不是判断。",
        "cols": [
          "分子/病理语境",
          "指南原文（摘录）",
          "中国获批（待核验）",
          "医保可及（待核验）",
          "来源与日期"
        ],
        "rows": [
          {
            "ctx": "POLE 未检测",
            "guideline": "「POLE 超突变需经规范化检测确认；未检测不能推断为 POLE 超突变或非超突变。」",
            "china": "检测可及性因机构而异",
            "insurance": "待核验",
            "source": "ESGO/ESTRO/ESP 2021 · 分子分型章节",
            "date": "2021"
          },
          {
            "ctx": "p53abn（p53 突变型）",
            "guideline": "「p53abn 型在 I–II 期亦属高危语境，辅助治疗讨论通常更积极；具体方案由治疗团队结合病理与个体情况决定。」",
            "china": "待核验",
            "insurance": "待核验",
            "source": "ESGO/ESTRO/ESP 2021 · 分子分型章节（2025 版待核验）",
            "date": "2021"
          },
          {
            "ctx": "NSMP（p53 野生型，非 POLE/非 MMRd）",
            "guideline": "「NSMP 为异质性最大的一型；辅助治疗决策依赖分级、肌层浸润、LVSI 等病理因素。」",
            "china": "待核验",
            "insurance": "待核验",
            "source": "ESGO/ESTRO/ESP 2021 · 分子分型章节",
            "date": "2021"
          },
          {
            "ctx": "pMMR · 复发/晚期（仅语境）",
            "guideline": "「在复发或转移性子宫内膜癌中，帕博利珠单抗联合仑伐替尼用于既往治疗后进展的特定人群。」",
            "china": "帕博利珠单抗联合方案：待核验",
            "insurance": "待核验",
            "source": "NCCN 2026 · 系统治疗章节",
            "date": "2026-02"
          },
          {
            "ctx": "保育（仅语境，见保育线）",
            "guideline": "「保留生育功能的治疗需由多学科团队评估，并在充分知情下进行。」",
            "china": "待核验",
            "insurance": "待核验",
            "source": "ESGO/ESHRE/ESGE 2023 保育指南",
            "date": "2023"
          }
        ]
      },
      "treatment": {
        "note": "折叠卡默认只显「阶段 · 日期 · 一句话概要」；打印时全部展开。影像与副作用只抄原文，不判读、不归因；支持的「效果」只放引号内原话。",
        "planVsActual": [
          {
            "item": "手术日期",
            "plan": "医生记录「2026-06-11 行全子宫+双附件切除+前哨淋巴结活检」",
            "actual": "2026-06-11 按计划完成"
          },
          {
            "item": "阴道残端近距离放疗",
            "plan": "医生记录「术后行阴道残端近距离放疗 3 次，每周 1 次」",
            "actual": "2026-07-14 / 07-21 / 07-28 完成 3 次"
          },
          {
            "item": "随访",
            "plan": "医生记录「治疗后 3 个月首次随访，之后按 3–6 个月」",
            "actual": "2026-09-17、2026-10-15 已随访 2 次"
          }
        ],
        "pathway": [
          {
            "d": "2026-06-11",
            "phase": "① 手术",
            "text": "全子宫+双附件切除+前哨淋巴结活检，术后第 5 天出院。",
            "detail": {
              "regimen": {
                "summary": "全子宫+双侧附件切除；前哨淋巴结活检（SLN）；微创（腹腔镜）中转开腹。",
                "items": [
                  [
                    "术式",
                    "腹腔镜全子宫+双附件切除 + 前哨淋巴结活检（中转开腹）"
                  ],
                  [
                    "日期",
                    "2026-06-11"
                  ],
                  [
                    "术后住院",
                    "5 天"
                  ],
                  [
                    "计划 vs 实际",
                    "计划腹腔镜；实际因粘连中转开腹（医生记录原文）"
                  ],
                  [
                    "切净程度",
                    "医生记录「肉眼未见残留」"
                  ]
                ]
              },
              "metrics": {
                "summary": "术后血红蛋白最低 104 g/L；出院前 112 g/L。趋势一句话：术后轻度下降后回升。",
                "items": [
                  [
                    "血红蛋白",
                    "2026-06-12 104 g/L → 2026-06-16 112 g/L（化验单原文）"
                  ],
                  [
                    "疼痛自评",
                    "术后第 1 天 5/10 → 出院 2/10（本人自述）"
                  ],
                  [
                    "口径",
                    "只并列数值；是否贫血、要不要处理由医生判断"
                  ]
                ]
              },
              "imaging": {
                "summary": "术前 TVS：内膜 10.2mm；术后未做常规影像（医生记录「无症状，暂不安排」）。",
                "items": [
                  [
                    "2026-05-20 TVS",
                    "「子宫内膜厚约 10.2mm，回声不均。」"
                  ],
                  [
                    "2026-06-16 术后病理",
                    "「肌层浸润约 6mm，未达外 1/2；SLN 0/3。」"
                  ],
                  [
                    "口径",
                    "影像结论照抄原文，不判读、不推断复发"
                  ]
                ]
              },
              "ae": {
                "summary": "术后恶心 1 级（院方记录）；切口疼痛按医嘱止痛；无发热。",
                "items": [
                  [
                    "恶心",
                    "术后第 1 天，1 级（院方记录原文），按医嘱处理"
                  ],
                  [
                    "切口",
                    "疼痛 3/10（本人自述），按医嘱止痛"
                  ],
                  [
                    "口径",
                    "等级与处理只抄原文；不归因、不评疗效"
                  ]
                ]
              },
              "support": {
                "summary": "支持措施：女儿陪护、术后第 2 天开始床边活动；效果记录只放原话。",
                "items": [
                  [
                    "措施",
                    "女儿陪护；护士指导床边活动"
                  ],
                  [
                    "效果（患者原话）",
                    "「第二天扶着走了一圈，心里踏实一点。」"
                  ],
                  [
                    "口径",
                    "不评疗效，只留原话"
                  ]
                ]
              }
            }
          },
          {
            "d": "2026-07-14",
            "phase": "② 阴道残端近距离放疗",
            "text": "术后辅助阴道残端近距离放疗，共 3 次，每周 1 次。",
            "detail": {
              "regimen": {
                "summary": "阴道残端近距离放疗（VBT）3 次；未做体外照射（EBRT）。",
                "items": [
                  [
                    "方式",
                    "阴道残端近距离放疗（VBT），单独使用"
                  ],
                  [
                    "次数与日期",
                    "2026-07-14 / 07-21 / 07-28，共 3 次"
                  ],
                  [
                    "剂量",
                    "医生记录「按计划剂量，分 3 次」（原文未写具体 Gy，本台不补）"
                  ],
                  [
                    "计划 vs 实际",
                    "3 次均按计划完成"
                  ]
                ]
              },
              "metrics": {
                "summary": "放疗期间血红蛋白稳定；白细胞最低 3.4×10⁹/L。趋势一句话：轻度下降后回升。",
                "items": [
                  [
                    "血红蛋白",
                    "2026-07-14 118 g/L → 2026-08-07 116 g/L"
                  ],
                  [
                    "白细胞",
                    "2026-07-28 3.4×10⁹/L（化验单原文）"
                  ],
                  [
                    "口径",
                    "不同医院参考区间不合并"
                  ]
                ]
              },
              "imaging": {
                "summary": "放疗前定位 CT 与每次治疗前摆位影像；结论原文如下（不判读）。",
                "items": [
                  [
                    "2026-07-10 定位 CT",
                    "「阴道残端位置满意，按计划勾画。」"
                  ],
                  [
                    "每次治疗前",
                    "「摆位影像与计划一致。」"
                  ],
                  [
                    "口径",
                    "影像结论只抄原文；不判断疗效"
                  ]
                ]
              },
              "ae": {
                "summary": "放疗期间阴道黏膜反应 1 级（院方记录）；无腹泻、无尿频。",
                "items": [
                  [
                    "阴道黏膜",
                    "1 级（院方记录原文），按医嘱处理"
                  ],
                  [
                    "肠道/膀胱",
                    "无腹泻、无尿频（本人记录）"
                  ],
                  [
                    "口径",
                    "不归因、不评疗效"
                  ]
                ]
              },
              "support": {
                "summary": "支持措施：放疗前排空膀胱、治疗日穿宽松衣物；效果只放原话。",
                "items": [
                  [
                    "措施",
                    "护士交代放疗前排空膀胱；女儿陪同"
                  ],
                  [
                    "效果（患者原话）",
                    "「第三次做完有点累，但能自己走回家。」"
                  ],
                  [
                    "私密说明",
                    "放疗后私密记录 2 条存在，已按三出口过滤，本卡不带数值"
                  ]
                ]
              }
            }
          },
          {
            "d": "2026-09-17",
            "phase": "③ 随访",
            "text": "治疗后首次随访：症状 + 妇科检查（含窥器），无常规影像与细胞学。",
            "detail": {
              "regimen": {
                "summary": "本阶段没有新的手术或药物方案；维持随访。",
                "items": [
                  [
                    "方案",
                    "无（随访阶段）"
                  ],
                  [
                    "随访节奏",
                    "医生记录「前 2–3 年每 3–6 个月」"
                  ],
                  [
                    "口径",
                    "本台不生成「下次总复查」，只显示节点"
                  ]
                ]
              },
              "metrics": {
                "summary": "体重 66.8 kg（2026-09-17）；血红蛋白 124 g/L。趋势一句话：体重稳定。",
                "items": [
                  [
                    "体重",
                    "2026-08-07 66.5 kg → 2026-09-17 66.8 kg → 2026-10-15 67.0 kg"
                  ],
                  [
                    "血红蛋白",
                    "2026-09-17 124 g/L（化验单原文）"
                  ],
                  [
                    "口径",
                    "只照抄记录"
                  ]
                ]
              },
              "imaging": {
                "summary": "本阶段没有安排影像；医生记录「无症状，暂不安排常规影像」。",
                "items": [
                  [
                    "影像",
                    "无（本阶段无指征记录）"
                  ],
                  [
                    "口径",
                    "没有症状时常规做，证据并不支持；具体听医生；本台不写「不用查」"
                  ]
                ]
              },
              "ae": {
                "summary": "无新的不良反应记录；放疗后阴道干燥/性交痛见「放疗后私密」线（默认 private）。",
                "items": [
                  [
                    "新发不良反应",
                    "无记录"
                  ],
                  [
                    "放疗后私密",
                    "记录存在（2 条），已按三出口过滤，不在本卡展开"
                  ],
                  [
                    "口径",
                    "私密内容不进摘要 / 导出 / 一图秀"
                  ]
                ]
              },
              "support": {
                "summary": "支持措施：随访前整理问题清单；效果只放原话。",
                "items": [
                  [
                    "措施",
                    "随访前在「就诊准备」写了 2 个问题"
                  ],
                  [
                    "效果（患者原话）",
                    "「把想问的写下来，进诊室就不慌了。」"
                  ],
                  [
                    "口径",
                    "只记录，不评疗效"
                  ]
                ]
              }
            }
          }
        ],
        "surgery": {
          "title": "全子宫+双附件切除 + 前哨淋巴结活检",
          "d": "2026-06-11",
          "hospital": "演示医院 · 妇科肿瘤",
          "quote": "「腹腔镜探查见盆腔粘连，中转开腹；行全子宫+双附件切除，前哨淋巴结 3 枚送检。」",
          "margins": "阴道残端切缘未见肿瘤（报告原文）",
          "stay": "住院 5 天",
          "impact": "术后 2 周内以休息为主；走路与家务的恢复节奏按医生 / 康复团队安排，本台不给康复处方。"
        },
        "rt": {
          "ebrt": {
            "used": false,
            "note": "本档案未做体外照射（EBRT）。"
          },
          "vbt": {
            "used": true,
            "technique": "阴道残端近距离放疗（VBT）",
            "doses": "3 次，每周 1 次（医生记录原文；具体 Gy 未写，本台不补）",
            "start": "2026-07-14",
            "end": "2026-07-28",
            "institution": "演示医院 · 放疗科",
            "quote": "「术后阴道残端近距离放疗 3 次，每周 1 次；治疗前排空膀胱。」",
            "note": "EBRT 与 VBT 分列，不合成「总剂量」；医生原文与机构照录。"
          }
        },
        "systemic": {
          "used": false,
          "note": "本档案没有化疗、免疫或内分泌治疗记录；如以后出现，方案、周期、计划 vs 实际与停药原因会逐条记录，不评疗效。",
          "cycles": []
        }
      },
      "fertility": {
        "applicable": false,
        "reason": "本档案 52 岁、已完成生育、无保育意愿；本线保留为空态说明，不生成方案推荐。",
        "decision": {
          "desire": "无保育意愿（本人记录）",
          "age": "52",
          "parity": "已生育 1 女",
          "candidate": "—",
          "mri": "—",
          "review": "—",
          "told": [
            "—"
          ],
          "note": "本档案不进入保育路径；是否保育由本人与医生讨论。"
        },
        "progestin": {
          "regimen": "无",
          "dose": "—",
          "start": "—",
          "end": "—",
          "sideEffects": "—",
          "liver": "—",
          "biopsyInterval": "—",
          "biopsies": [],
          "note": "无孕激素治疗记录。"
        },
        "conceive": {
          "crDate": "—",
          "attemptStart": "—",
          "art": "—",
          "pregnancy": "—",
          "delivery": "—",
          "postpartum": "—",
          "note": "无妊娠尝试记录。"
        }
      },
      "lynch": {
        "note": "肿瘤的 MMR 结果像一盏提示灯：pMMR 时提示灯没有亮，但这不等于把 Lynch 这件事永远关掉。要不要做遗传咨询/胚系检测，是本人的选择；不知情也是合法选择。",
        "testing": {
          "tumor": [
            {
              "item": "肿瘤 MMR IHC",
              "value": "pMMR（四个蛋白均保留）",
              "d": "2026-06-16",
              "quote": "「MLH1、PMS2、MSH2、MSH6 均保留表达。」"
            },
            {
              "item": "MLH1 甲基化",
              "value": "未检测（pMMR 时医生未安排）",
              "d": "—",
              "quote": "—"
            },
            {
              "item": "MSI",
              "value": "未检测",
              "d": "—",
              "quote": "—"
            }
          ],
          "germline": [
            {
              "item": "遗传咨询",
              "value": "未进行（本人暂未决定）",
              "d": "—",
              "quote": "医生记录：「如本人愿意，可转遗传咨询；不着急。」"
            },
            {
              "item": "胚系检测",
              "value": "未提供（not_offered）",
              "d": "—",
              "quote": "—"
            }
          ],
          "status": "肿瘤 pMMR；胚系检测未提供。Lynch 未筛查。"
        },
        "family": {
          "note": "家系记录只存关系、癌种、确诊年龄与是否核实，不存亲属姓名；第三方信息默认 private，写入需要本人同意。不替亲属建档、不默认共享。",
          "rows": [
            {
              "code": "亲属 A",
              "relation": "母亲",
              "cancer": "子宫内膜癌",
              "age": 61,
              "verified": "未核实（本人转述）",
              "thirdParty": true,
              "consent": true,
              "visibility": "private"
            },
            {
              "code": "亲属 B",
              "relation": "姐姐",
              "cancer": "结直肠癌",
              "age": 55,
              "verified": "未核实（本人转述）",
              "thirdParty": true,
              "consent": true,
              "visibility": "private"
            }
          ],
          "consentNote": "以上 2 条均为 third_party=1 + consent=1；默认 private，导出与摘要不含。"
        },
        "comm": {
          "notified": "none（尚未告知任何亲属）",
          "testedCount": 0,
          "plan": "肠镜 / 妇科监测：未制定（未进入遗传路径）",
          "surgeryDiscussed": "未讨论",
          "note": "是否告知家人、什么时候告知、告知多少，由本人决定。工作台不推动亲属检测，也不评价「知情的权利」用不用。",
          "questions": [
            {
              "id": "Q1",
              "text": "pMMR 的情况下，我还需要做 Lynch 相关检测吗？",
              "asked": false,
              "src": "本人整理"
            },
            {
              "id": "Q2",
              "text": "如果以后想做遗传咨询，应该找哪个科？",
              "asked": false,
              "src": "本人整理"
            }
          ]
        }
      },
      "intimate": {
        "note": "放疗后阴道干燥、性交痛、狭窄是医学问题，不是「矫情」。本线默认 private：一图秀、摘要、导出三处都会过滤；可以先记，准备好再给医生看。",
        "symptoms": [
          {
            "id": "V1",
            "d": "2026-08-20",
            "dryness": 2,
            "dyspareunia": 2,
            "stenosis": "未评估",
            "bleeding": "无",
            "libido": "低",
            "text": "「放疗结束后觉得干，同房会痛，不好意思跟医生说。」",
            "visibility": "private"
          },
          {
            "id": "V2",
            "d": "2026-10-15",
            "dryness": 2,
            "dyspareunia": 1,
            "stenosis": "未评估",
            "bleeding": "无",
            "libido": "一般",
            "text": "「用了润滑剂好一些，但还是干。」",
            "visibility": "private"
          }
        ],
        "dilator": {
          "status": "未开始（医生尚未给出频率）",
          "start": "—",
          "freq": "—",
          "minutes": "—",
          "size": "—",
          "pain": "—",
          "bleeding": "—",
          "moisturizer": "保湿剂：本人记录「偶尔用」",
          "lubricant": "润滑剂：本人记录「同房时用」",
          "estrogen": "阴道雌激素：未使用（未与医生讨论）",
          "note": "国际共识常见 5–10 分钟 × 每周 2–3 次 × 9–12 个月；中国做法不统一。本台只记录医生给的频率，不自行设定。具体从哪天开始、用多大，听放疗/妇科医生。"
        },
        "comm": {
          "comfort": 2,
          "discussed": "否（尚未与医生谈）",
          "questions": [
            "放疗后干燥/性交痛，有没有适合我的处理方式？",
            "扩张器要不要用、从什么时候开始？"
          ],
          "referral": "未转诊（可询问性健康治疗 / 盆底康复 / 更年期门诊）",
          "exportNote": "可以只导出「给医生看」的摘要；私密数值默认不出现在两区导出中。"
        }
      },
      "followup": {
        "start": "2026-09-17",
        "interval": 3,
        "intervalNote": "前 2–3 年每 3–6 个月、第 4–5 年每 6–12 个月、5 年后每年（医生记录原文）；工作台显示节点 = 起点 + k×间隔，具体以医生为准。",
        "nodes": [
          "2026-09-16",
          "2026-12-16",
          "2027-03-16",
          "2027-06-16",
          "2027-09-16",
          "2027-12-16"
        ],
        "visits": [
          {
            "d": "2026-09-17",
            "symptoms": "无异常出血、无腹痛",
            "speculum": "阴道残端愈合良好（医生原文）",
            "pelvic": "盆腔检查未及异常",
            "ca125": "未查（医生记录「无症状，暂不查」）",
            "imaging": "无（无指征）",
            "cytology": "未做（非常规）",
            "note": "症状 + 妇科检查为主线"
          },
          {
            "d": "2026-10-15",
            "symptoms": "阴道干燥（私密线另记）",
            "speculum": "阴道残端未见异常（医生原文）",
            "pelvic": "未及异常",
            "ca125": "未查",
            "imaging": "无（无指征）",
            "cytology": "未做（非常规）",
            "note": "私密内容不在本页展开"
          }
        ],
        "imaging": [
          {
            "d": "2026-05-20",
            "kind": "TVS（术前）",
            "indication": "有指征（绝经后出血）",
            "quote": "「子宫内膜厚约 10.2mm，回声不均。」",
            "method": "经阴道超声"
          },
          {
            "d": "2026-07-10",
            "kind": "放疗定位 CT",
            "indication": "有指征（放疗计划）",
            "quote": "「阴道残端位置满意，按计划勾画。」",
            "method": "CT"
          }
        ],
        "cytology": [
          {
            "d": "2026-09-17",
            "result": "未做",
            "reason": "医生记录「无症状，不做常规阴道细胞学」",
            "note": "记录但标「非常规」；不推荐无症状常规做，具体听医生"
          }
        ],
        "comorb": {
          "bp": "128/78 mmHg（2026-10-15）",
          "bmi": "26.1（身高 160cm，体重 67.0kg）",
          "glucose": "5.4 mmol/L",
          "lipids": "LDL 3.1 mmol/L（化验单原文）",
          "exercise": "每周散步 3 次（本人记录）",
          "smoking": "不吸烟",
          "bone": "未做骨密度",
          "secondPrimary": "乳腺/结直肠/皮肤/肺：按医生安排筛查；本台不生成筛查处方",
          "note": "心血管是子宫内膜癌生存者的首位死因；本页只记录血压/BMI/血糖/血脂/运动/吸烟/骨健康，不给处方。"
        },
        "nutrition": {
          "weight": "67.0 kg（2026-10-15）",
          "rows": [
            {
              "d": "2026-08-07",
              "meal": "三餐正常，食欲一般",
              "symptom": "无恶心",
              "weight": 66.5
            },
            {
              "d": "2026-09-17",
              "meal": "三餐正常，加一次水果",
              "symptom": "无",
              "weight": 66.8
            },
            {
              "d": "2026-10-15",
              "meal": "三餐正常",
              "symptom": "无",
              "weight": 67
            }
          ],
          "note": "只记份量、食物、症状与体重；不给食谱、热量处方，也不做体重道德评判。"
        }
      },
      "mind": {
        "note": "复发恐惧、身体意象、生育焦虑都算正常反应；本页只做自评记录，不诊断焦虑，也不承诺「消除恐惧」。",
        "feelings": {
          "patient": [
            {
              "d": "2026-08-20",
              "v": 4,
              "text": "「放疗做完反而更怕复查，怕听到不好的。」"
            },
            {
              "d": "2026-10-15",
              "v": 3,
              "text": "「这周睡得比上个月好一点。」"
            }
          ],
          "caregiver": [
            {
              "d": "2026-09-17",
              "v": 5,
              "text": "「我妈不说，但我知道她怕；我也怕。」"
            }
          ],
          "note": "患者与照护者各自记录、并列展示、不平均；两条线不合并成一个分数。"
        },
        "body": [
          {
            "d": "2026-08-20",
            "text": "「肚子上有疤，洗澡时不太想看。」",
            "visibility": "private"
          },
          {
            "d": "2026-10-15",
            "text": "「慢慢能接受了，但还是觉得身体不是原来的。」",
            "visibility": "private"
          }
        ],
        "fertilityAnx": [
          {
            "d": "2026-09-17",
            "text": "「我这个年纪不考虑生孩子了，但看到别人抱孙子会难受。」",
            "visibility": "private"
          }
        ],
        "bodyNote": "身体意象记录默认 private；可逐条授权给医生看，不自动进入导出或 AI 上下文。"
      },
      "metrics": {
        "numeric": {
          "WEIGHT": [
            {
              "d": "2026-05-12",
              "v": 68.4,
              "src": "术前称重"
            },
            {
              "d": "2026-06-11",
              "v": 67.9,
              "src": "入院称重"
            },
            {
              "d": "2026-07-14",
              "v": 67.2,
              "src": "放疗首日"
            },
            {
              "d": "2026-08-07",
              "v": 66.5,
              "src": "放疗结束"
            },
            {
              "d": "2026-09-17",
              "v": 66.8,
              "src": "随访"
            },
            {
              "d": "2026-10-15",
              "v": 67,
              "src": "随访"
            }
          ],
          "BLEED_DAYS": [
            {
              "d": "2026-04-28",
              "v": 4,
              "src": "出血日志 B1"
            },
            {
              "d": "2026-05-06",
              "v": 3,
              "src": "出血日志 B2"
            },
            {
              "d": "2026-05-18",
              "v": 5,
              "src": "出血日志 B3"
            }
          ],
          "IMG_MM": [
            {
              "d": "2026-04-24",
              "v": 9.4,
              "src": "TVS 双层内膜"
            },
            {
              "d": "2026-05-20",
              "v": 10.2,
              "src": "TVS 双层内膜"
            }
          ]
        },
        "qual": {
          "TX_EVENT": [
            {
              "d": "2026-06-11",
              "code": "S",
              "label": "手术"
            },
            {
              "d": "2026-07-14",
              "code": "R",
              "label": "放疗 1"
            },
            {
              "d": "2026-07-21",
              "code": "R",
              "label": "放疗 2"
            },
            {
              "d": "2026-07-28",
              "code": "R",
              "label": "放疗 3"
            }
          ],
          "MOLECULAR_EVENT": [
            {
              "d": "2026-06-16",
              "code": "M",
              "label": "分子结果"
            }
          ],
          "FOLLOWUP_EVENT": [
            {
              "d": "2026-09-17",
              "code": "F",
              "label": "随访"
            },
            {
              "d": "2026-10-15",
              "code": "F",
              "label": "随访"
            }
          ]
        }
      },
      "events": [
        [
          "2026-06-11",
          "手术"
        ],
        [
          "2026-07-14",
          "放疗开始"
        ],
        [
          "2026-08-07",
          "放疗结束"
        ],
        [
          "2026-09-17",
          "随访"
        ]
      ],
      "docs": {
        "documents": [
          {
            "id": "D1",
            "name": "病理报告 2026-06-16",
            "fileName": "path-2026-06-16.pdf",
            "d": "2026-06-16",
            "kind": "病理",
            "size": "1.2 MB",
            "status": "已核对"
          },
          {
            "id": "D2",
            "name": "手术记录 2026-06-11",
            "fileName": "surgery-2026-06-11.pdf",
            "d": "2026-06-11",
            "kind": "出院记录",
            "size": "0.8 MB",
            "status": "已核对"
          },
          {
            "id": "D3",
            "name": "放疗计划 2026-07-10",
            "fileName": "rt-plan-2026-07-10.pdf",
            "d": "2026-07-10",
            "kind": "放疗",
            "size": "2.1 MB",
            "status": "待核对"
          },
          {
            "id": "D4",
            "name": "化验单 2026-10-15",
            "fileName": "labs-2026-10-15.pdf",
            "d": "2026-10-15",
            "kind": "化验",
            "size": "0.3 MB",
            "status": "已核对"
          }
        ],
        "candidates": [
          {
            "id": "C1",
            "field": "肌层浸润",
            "value": "<1/2（约 6mm）",
            "src": "病理报告 2026-06-16 · 第 1 页",
            "state": "待核对"
          },
          {
            "id": "C2",
            "field": "阴道残端切缘",
            "value": "未见肿瘤",
            "src": "病理报告 2026-06-16 · 第 2 页",
            "state": "待核对"
          },
          {
            "id": "C3",
            "field": "放疗次数",
            "value": "3 次",
            "src": "放疗计划 2026-07-10 · 第 1 页",
            "state": "待核对"
          }
        ],
        "materials": [
          {
            "name": "病理报告",
            "why": "分型与分期的依据",
            "state": "ready"
          },
          {
            "name": "手术记录",
            "why": "术式与切缘",
            "state": "ready"
          },
          {
            "name": "放疗计划/小结",
            "why": "VBT 次数与日期",
            "state": "partial"
          },
          {
            "name": "最近化验单",
            "why": "血常规与生化",
            "state": "ready"
          }
        ],
        "questions": [
          {
            "id": "Q1",
            "text": "POLE 没检测，需要补做吗？",
            "asked": false,
            "src": "本人整理 · 2026-10-15"
          },
          {
            "id": "Q2",
            "text": "放疗后干燥/性交痛，有没有适合我的处理方式？",
            "asked": false,
            "src": "私密线整理（只显示问题，不带数值）"
          },
          {
            "id": "Q3",
            "text": "下次随访要不要做影像或细胞学？",
            "asked": true,
            "src": "本人整理 · 2026-09-17"
          }
        ],
        "trials": [
          {
            "id": "CTR20191858",
            "title": "帕博利珠单抗联合仑伐替尼用于治疗子宫内膜癌的III期研究",
            "phase": "III 期",
            "status": "登记状态，未核实",
            "topic": "系统治疗 · 联合方案",
            "source": "中国药物临床试验登记与信息公示平台",
            "url": "https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml",
            "note": "适用于复发/晚期语境；线索不是推荐，不判入组资格。",
            "nmpa": "待核验"
          },
          {
            "id": "CTR20211275",
            "title": "在根治性手术后使用辅助化疗+帕博利珠单抗/安慰剂治疗子宫内膜癌",
            "phase": "III 期",
            "status": "登记状态，未核实",
            "topic": "术后辅助 · 免疫",
            "source": "中国药物临床试验登记与信息公示平台",
            "url": "https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml",
            "note": "与术后辅助语境相关；是否适合由研究团队按入组标准判断。",
            "nmpa": "待核验"
          },
          {
            "id": "CTR20244095",
            "title": "Trastuzumab Deruxtecan 联合 rilvegostomig 或帕博利珠单抗作为 HER2 表达、错配修复正常（pMMR）子宫内膜癌一线治疗的III期研究",
            "phase": "III 期",
            "status": "登记状态，未核实",
            "topic": "pMMR · HER2",
            "source": "中国药物临床试验登记与信息公示平台",
            "url": "https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml",
            "note": "登记标题写明 pMMR；是否 HER2 表达需病理检测，本台不判断。",
            "nmpa": "待核验"
          },
          {
            "id": "CTR20242153",
            "title": "盐酸安罗替尼胶囊联合 TQB2450 注射液对比化疗治疗非 MSI-H 或非 dMMR 的复发性或转移性子宫内膜癌的III期研究",
            "phase": "III 期",
            "status": "登记状态，未核实",
            "topic": "非 MSI-H · 复发/转移",
            "source": "中国药物临床试验登记与信息公示平台",
            "url": "https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml",
            "note": "标题含 MSI 状态条件；入组资格由研究团队判断。",
            "nmpa": "待核验"
          }
        ]
      },
      "dashKeys": [
        "WEIGHT",
        "BLEED_DAYS",
        "IMG_MM",
        "TX_EVENT"
      ]
    },
    {
      "id": "demo2",
      "name": "李思（演示）",
      "age": 31,
      "sex": "女",
      "diagnosis": "子宫内膜样腺癌 G1 · FIGO IA 期 · POLE 超突变（检出）· 保育治疗中（演示）",
      "diagnosisShort": "子宫内膜样 G1 · FIGO IA · POLE 超突变 · 保育中",
      "stageLine": "FIGO 2023：IAmPOLEmut（肌层浸润 <1/2 + POLE 致病性变异）；MMR：PMS2 缺失（并列记录）",
      "primaryRole": "CAREGIVER",
      "caregiverLabel": "丈夫（主要代记人）",
      "headline": "31 岁，想先保住子宫：保育治疗第 8 个月，活检、孕激素与尝试怀孕都记在这。",
      "meta": {
        "windowStart": "2026-04-24",
        "windowEnd": "2026-10-24",
        "dataStart": "2026-04-24",
        "menopause": "未绝经（31 岁）",
        "histology": "子宫内膜样腺癌（WHO 2020）",
        "grade": "FIGO G1",
        "fertilityDesire": "有（强烈，未育）",
        "lynchScreened": "医生已建议遗传咨询；本人尚未决定"
      },
      "hero": {
        "bleeding": "月经间期出血 2 次（2026-04-26 / 2026-06-02）",
        "molecular": "POLE 超突变（检出）· PMS2 缺失 · p53 野生",
        "pathway": "保育评估 → 孕激素+LNG-IUD → 妊娠尝试（未手术）",
        "family": "母亲/妹妹家系 2 条（private + 授权）"
      },
      "bleeding": {
        "intro": "出血日志只记「什么时候、多少、持续几天、有没有血块/排液、当时在做什么」；不判断原因。",
        "note": "本页没有「病因」「疾病性质」「严重度」列；月经间期出血需要医生评估，工作台只帮你记清楚。",
        "status": "确诊前 2 条；开始孕激素后记录 1 条（突破性出血）。",
        "rows": [
          {
            "id": "B1",
            "d": "2026-04-26",
            "menopause": "未绝经",
            "pattern": "月经间期出血",
            "volume": "少量（护垫）",
            "days": 2,
            "clots": "无",
            "discharge": "无",
            "trigger": "无诱因",
            "source": "本人记录",
            "author": "PATIENT"
          },
          {
            "id": "B2",
            "d": "2026-06-02",
            "menopause": "未绝经",
            "pattern": "月经间期出血",
            "volume": "少量（护垫）",
            "days": 3,
            "clots": "无",
            "discharge": "少量褐色排液",
            "trigger": "开始孕激素后第 2 周",
            "source": "丈夫代记",
            "author": "CAREGIVER"
          },
          {
            "id": "B3",
            "d": "2026-09-08",
            "menopause": "未绝经",
            "pattern": "突破性出血",
            "volume": "点滴",
            "days": 4,
            "clots": "无",
            "discharge": "无",
            "trigger": "放置 LNG-IUD 后",
            "source": "本人记录",
            "author": "PATIENT"
          }
        ]
      },
      "exam": {
        "note": "TVS / MRI 的内膜厚度要带单位与测量口径；「厚度正常」不等于「没事」；取样是否足够也要记。",
        "rows": [
          {
            "d": "2026-04-24",
            "kind": "经阴道超声（TVS）",
            "thickness": "12.0 mm",
            "caliber": "双层内膜，纵切最大径",
            "limit": "未见明显肌层浸润（超声）",
            "sample": "—",
            "sufficient": "—",
            "pain": "—",
            "quote": "「子宫内膜厚约 12.0mm，回声不均，建议宫腔镜。」"
          },
          {
            "d": "2026-05-06",
            "kind": "宫腔镜 + 诊刮",
            "thickness": "—",
            "caliber": "—",
            "limit": "—",
            "sample": "宫腔镜定位活检",
            "sufficient": "足够",
            "pain": "5/10（本人自述）",
            "quote": "「宫腔镜下见内膜增厚，取组织送病理。」"
          },
          {
            "d": "2026-05-20",
            "kind": "盆腔 MRI（保育评估）",
            "thickness": "—",
            "caliber": "—",
            "limit": "肌层浸润评估",
            "sample": "—",
            "sufficient": "—",
            "pain": "—",
            "quote": "「结合带完整，未见明确肌层浸润。」"
          },
          {
            "d": "2026-08-05",
            "kind": "宫腔镜 + 内膜活检（随访）",
            "thickness": "6.0 mm（同日 TVS）",
            "caliber": "双层内膜",
            "limit": "—",
            "sample": "宫腔镜定位活检",
            "sufficient": "足够",
            "pain": "3/10",
            "quote": "「子宫内膜薄，未见明确残留肿瘤。」"
          }
        ]
      },
      "pathology": {
        "note": "逐项照抄报告原文与日期；分级、分型与分期由病理与临床团队给出，本页不重算。",
        "rows": [
          {
            "item": "组织学类型",
            "value": "子宫内膜样腺癌（WHO 2020）",
            "d": "2026-05-08",
            "quote": "「子宫内膜样腺癌，高分化。」"
          },
          {
            "item": "FIGO 分级",
            "value": "G1",
            "d": "2026-05-08",
            "quote": "「FIGO 分级 G1，实性生长区 <5%。」"
          },
          {
            "item": "肌层浸润",
            "value": "未见明确肌层浸润（MRI + 病理）",
            "d": "2026-05-20",
            "quote": "「结合带完整，未见明确肌层浸润。」"
          },
          {
            "item": "LVSI",
            "value": "未见",
            "d": "2026-05-08",
            "quote": "「未见脉管侵犯。」"
          },
          {
            "item": "宫颈间质 / 附件",
            "value": "未受累",
            "d": "2026-05-20",
            "quote": "「宫颈间质及双附件未见异常。」"
          },
          {
            "item": "淋巴结",
            "value": "未做（保育路径，未手术）",
            "d": "—",
            "quote": "—"
          }
        ],
        "typeNote": "组织学类型与分级是肿瘤标签；POLE 超突变是分子标签；两者都不是遗传检测结论。"
      },
      "stage": {
        "note": "FIGO 2023 把分子分型纳入分期标签。本页只记录「哪一次、依据什么、变了没有」，不自算、不判定；期别后面多出的「m」表示分子标签。",
        "versions": [
          {
            "d": "2026-05-08",
            "anatomical": "IA 期（活检后临床分期，保育评估中）",
            "finalLabel": "IA（暂定，依据活检 + MRI）",
            "marker": "分子结果未出",
            "change": "unknown",
            "basis": "宫腔镜活检病理 + 盆腔 MRI；医生记录「拟按保育路径评估」",
            "current": false
          },
          {
            "d": "2026-06-10",
            "anatomical": "IA 期（肌层浸润 <1/2，MRI）",
            "finalLabel": "IAmPOLEmut（医生记录，分子标签并列）",
            "marker": "POLE 超突变（检出）· PMS2 缺失 · p53 野生",
            "change": "none",
            "basis": "分子病理报告原文 + 医生记录「按 FIGO 2023 并列分子标签」",
            "current": true
          },
          {
            "d": "2026-08-12",
            "anatomical": "IA 期（保育随访中，未手术）",
            "finalLabel": "IAmPOLEmut（维持）",
            "marker": "POLE 超突变（检出）",
            "change": "none",
            "basis": "随访活检未见明确残留肿瘤；医生记录「期别未变」",
            "current": true
          }
        ],
        "stageNote": "期别是否变化、依据哪一条，以医生记录为准；本页不写「升级/降级」。"
      },
      "molecular": {
        "note": "三个标记各自独立。POLE 检出的是「致病性变异」，不是 VUS；PMS2 缺失是蛋白表达层面的结果，不等于 Lynch 的胚系结论。",
        "markers": [
          {
            "key": "MMR",
            "marker": "MMR（错配修复）",
            "result": "detected",
            "value": "PMS2 缺失，MLH1/MSH2/MSH6 保留",
            "method": "免疫组化 IHC",
            "specimen": "宫腔镜活检标本",
            "d": "2026-05-08",
            "explain": "报告写「PMS2 表达缺失，余三个蛋白保留」。这是肿瘤蛋白表达结果，不等于 Lynch 的诊断；医生已建议遗传咨询。"
          },
          {
            "key": "p53",
            "marker": "p53",
            "result": "not_detected",
            "value": "野生型表达模式",
            "method": "免疫组化 IHC",
            "specimen": "宫腔镜活检标本",
            "d": "2026-05-08",
            "explain": "报告写「野生型表达模式」；这是蛋白表达模式，不是基因测序。"
          },
          {
            "key": "POLE",
            "marker": "POLE",
            "result": "detected",
            "value": "POLE 超突变（致病性变异，检出）",
            "method": "肿瘤组织测序",
            "specimen": "宫腔镜活检标本",
            "d": "2026-06-10",
            "explain": "报告写「POLE 核酸外切酶域致病性变异，超突变表型」。文献语境：这类分子特征在部分研究中与较好预后相关；这是文献语境引用，不代替医生对你个人的判断。"
          }
        ],
        "multiple": "POLEmut 与 MMRd（PMS2 缺失）并列：报告注明 multiple classifier；按 FIGO 2023 以 POLEmut 定最终标签（IAmPOLEmut）。两条特征并列记录，不合并、不择一丢弃，也不写「哪个更严重」。",
        "testsStatus": "MMR：已出结果；p53：已出结果；POLE：已出结果（致病性变异）。"
      },
      "compare": {
        "note": "下表只回答「谁说了什么」：指南原文 / 中国获批 / 医保可及三列分开，没有「推荐等级」「应该用」这类列。",
        "cols": [
          "分子/病理语境",
          "指南原文（摘录）",
          "中国获批（待核验）",
          "医保可及（待核验）",
          "来源与日期"
        ],
        "rows": [
          {
            "ctx": "POLEmut · IA 期（保育语境）",
            "guideline": "「POLE 超突变与较好的预后相关；是否减少辅助治疗需在临床试验或个体化讨论中决定。」",
            "china": "待核验",
            "insurance": "待核验",
            "source": "ESGO/ESTRO/ESP 2021 · 分子分型章节",
            "date": "2021"
          },
          {
            "ctx": "保育（G1 · IA · 无肌层浸润）",
            "guideline": "「保留生育功能的治疗应限于 G1、MRI 未见肌层浸润者，并在多学科团队随访下进行。」",
            "china": "待核验",
            "insurance": "待核验",
            "source": "ESGO/ESHRE/ESGE 2023 保育指南",
            "date": "2023"
          },
          {
            "ctx": "MMR 缺失语境",
            "guideline": "「MMR 缺失提示可能需要 Lynch 评估；多数 MLH1/PMS2 缺失为散发性甲基化。」",
            "china": "待核验",
            "insurance": "待核验",
            "source": "NCCN 2026 · 遗传评估章节",
            "date": "2026-02"
          },
          {
            "ctx": "保育后完成生育",
            "guideline": "「完成生育后通常讨论全子宫+双附件切除的时机；具体由本人与团队决定。」",
            "china": "待核验",
            "insurance": "待核验",
            "source": "ESGO/ESHRE/ESGE 2023 保育指南",
            "date": "2023"
          }
        ]
      },
      "treatment": {
        "note": "折叠卡默认只显概要；打印全部展开。保育路径不是「治愈」，是延迟手术、争取生育时间；本页零方案推荐、零概率预测。",
        "planVsActual": [
          {
            "item": "保育方案",
            "plan": "医生记录「口服甲地孕酮 + 放置 LNG-IUD，每 3 个月内膜活检」",
            "actual": "2026-02-10 开始；活检 2026-05-06、2026-08-05 完成"
          },
          {
            "item": "肝功能监测",
            "plan": "医生记录「口服孕激素期间每月查肝功能」",
            "actual": "2026-03 至 2026-10 每月 1 次（共 8 次）"
          },
          {
            "item": "妊娠尝试",
            "plan": "医生记录「完全缓解后可开始尝试怀孕，必要时转生殖中心」",
            "actual": "2026-09-01 开始尝试（本人记录）"
          }
        ],
        "pathway": [
          {
            "d": "2026-02-10",
            "phase": "① 保育评估",
            "text": "G1、MRI 未见肌层浸润；本人强烈保育意愿，进入多学科评估。",
            "detail": {
              "regimen": {
                "summary": "本阶段没有手术或药物；完成保育候选评估与知情记录。",
                "items": [
                  [
                    "候选病理",
                    "子宫内膜样 G1（病理原文）"
                  ],
                  [
                    "MRI 肌层浸润",
                    "未见明确肌层浸润（报告原文）"
                  ],
                  [
                    "二次病理复核",
                    "已复核，维持 G1"
                  ],
                  [
                    "知情记录",
                    "医生记录已告知「非治愈、需密切随访、复发风险、将来可能需切除子宫」"
                  ],
                  [
                    "口径",
                    "零方案推荐、零概率预测；选择由本人做"
                  ]
                ]
              },
              "metrics": {
                "summary": "体重 58.2 kg；肝功能 ALT 18 U/L。趋势一句话：基线正常。",
                "items": [
                  [
                    "体重",
                    "2026-02-10 58.2 kg"
                  ],
                  [
                    "ALT / AST",
                    "18 / 20 U/L（化验单原文）"
                  ],
                  [
                    "口径",
                    "只照抄数值"
                  ]
                ]
              },
              "imaging": {
                "summary": "盆腔 MRI：结合带完整，未见明确肌层浸润（原文，不判读）。",
                "items": [
                  [
                    "2026-05-20 MRI",
                    "「结合带完整，未见明确肌层浸润。」"
                  ],
                  [
                    "口径",
                    "影像原文；是否适合保育由团队判断"
                  ]
                ]
              },
              "ae": {
                "summary": "无不良反应记录；本阶段未开始用药。",
                "items": [
                  [
                    "不良反应",
                    "无（本阶段未用药）"
                  ],
                  [
                    "口径",
                    "不归因、不评疗效"
                  ]
                ]
              },
              "support": {
                "summary": "支持措施：与丈夫一起参加一次门诊沟通；效果只放原话。",
                "items": [
                  [
                    "措施",
                    "丈夫陪同门诊；把想问的写成清单"
                  ],
                  [
                    "效果（患者原话）",
                    "「知道不是马上切子宫，心里先松了一点。」"
                  ],
                  [
                    "口径",
                    "只留原话，不评疗效"
                  ]
                ]
              }
            }
          },
          {
            "d": "2026-02-10",
            "phase": "② 孕激素 + LNG-IUD",
            "text": "口服甲地孕酮 + 宫内节育器，每 3 个月活检；肝功能每月监测。",
            "detail": {
              "regimen": {
                "summary": "口服甲地孕酮 + LNG-IUD；剂量与疗程按医嘱原文。",
                "items": [
                  [
                    "方案",
                    "口服甲地孕酮 + 左炔诺孕酮宫内节育器（LNG-IUD）"
                  ],
                  [
                    "开始日期",
                    "2026-02-10"
                  ],
                  [
                    "剂量",
                    "医生记录「按说明书剂量口服」（原文未写 mg，本台不补）"
                  ],
                  [
                    "活检节奏",
                    "每 3 个月一次（医生记录）"
                  ],
                  [
                    "计划 vs 实际",
                    "2026-05-06、2026-08-05 两次活检按计划完成"
                  ]
                ]
              },
              "metrics": {
                "summary": "ALT 18 → 26 U/L；体重 58.2 → 59.4 kg。趋势一句话：轻度上升，仍在参考区间内。",
                "items": [
                  [
                    "ALT",
                    "2026-02-10 18 → 2026-08-05 26 U/L（化验单原文）"
                  ],
                  [
                    "体重",
                    "2026-02-10 58.2 → 2026-10-15 59.4 kg"
                  ],
                  [
                    "口径",
                    "是否与药物相关由医生判断，本台不归因"
                  ]
                ]
              },
              "imaging": {
                "summary": "随访活检与 TVS：2026-08-05 未见明确残留肿瘤（原文，不判读）。",
                "items": [
                  [
                    "2026-05-06 活检",
                    "「子宫内膜样腺癌，G1，局灶残留。」"
                  ],
                  [
                    "2026-08-05 活检",
                    "「子宫内膜薄，未见明确残留肿瘤。」"
                  ],
                  [
                    "口径",
                    "病理原文；完全缓解由医生判定"
                  ]
                ]
              },
              "ae": {
                "summary": "记录到的副作用：突破性出血（2026-09-08，点滴 4 天）；体重轻度增加；情绪波动。",
                "items": [
                  [
                    "出血",
                    "突破性出血，点滴 4 天（本人记录）"
                  ],
                  [
                    "体重",
                    "增加约 1.2 kg（称重记录）"
                  ],
                  [
                    "情绪",
                    "「有时候会烦躁」（本人原话）"
                  ],
                  [
                    "口径",
                    "等级与处理只抄原文；不评疗效"
                  ]
                ]
              },
              "support": {
                "summary": "支持措施：丈夫代记服药与复查；效果只放原话。",
                "items": [
                  [
                    "措施",
                    "丈夫设提醒、代记服药与复查日期"
                  ],
                  [
                    "效果（患者原话）",
                    "「有人帮我记，我就不容易漏。」"
                  ],
                  [
                    "口径",
                    "只留原话"
                  ]
                ]
              }
            }
          },
          {
            "d": "2026-09-01",
            "phase": "③ 妊娠尝试与产后计划",
            "text": "医生记录完全缓解后开始尝试怀孕；未手术，继续随访。",
            "detail": {
              "regimen": {
                "summary": "本阶段没有新的药物方案；继续孕激素维持与 3 个月活检。",
                "items": [
                  [
                    "方案",
                    "继续孕激素 + LNG-IUD（医生记录）"
                  ],
                  [
                    "妊娠尝试开始",
                    "2026-09-01（本人记录）"
                  ],
                  [
                    "ART 转诊",
                    "尚未转诊（医生记录「尝试 6 个月未孕可转生殖中心」）"
                  ],
                  [
                    "产后计划",
                    "医生记录「完成生育后讨论全子宫+双附件切除时机」"
                  ],
                  [
                    "口径",
                    "只记时间线与医嘱原文，不判「能不能生」"
                  ]
                ]
              },
              "metrics": {
                "summary": "体重 59.4 kg；ALT 24 U/L。趋势一句话：稳定。",
                "items": [
                  [
                    "体重",
                    "2026-09-01 59.0 → 2026-10-15 59.4 kg"
                  ],
                  [
                    "ALT",
                    "2026-10-15 24 U/L"
                  ],
                  [
                    "口径",
                    "只照抄"
                  ]
                ]
              },
              "imaging": {
                "summary": "本阶段未安排影像；下一次随访活检计划 2026-11 上旬（医生记录）。",
                "items": [
                  [
                    "影像",
                    "无（本阶段无指征记录）"
                  ],
                  [
                    "下次活检",
                    "2026-11 上旬（计划，以预约为准）"
                  ],
                  [
                    "口径",
                    "不生成「下次总复查」"
                  ]
                ]
              },
              "ae": {
                "summary": "无新的不良反应；孕激素相关记录见上一阶段。",
                "items": [
                  [
                    "新发不良反应",
                    "无记录"
                  ],
                  [
                    "口径",
                    "不归因"
                  ]
                ]
              },
              "support": {
                "summary": "支持措施：和丈夫一起记录尝试怀孕的日期与心情；效果只放原话。",
                "items": [
                  [
                    "措施",
                    "两人共同记录尝试日期与心情"
                  ],
                  [
                    "效果（患者原话）",
                    "「不管结果怎样，我不想以后后悔没试过。」"
                  ],
                  [
                    "产品立场",
                    "没有活产也不后悔，是合理结局；本台不以活产作为唯一成功标准"
                  ]
                ]
              }
            }
          }
        ],
        "surgery": {
          "title": "尚无手术记录（保育路径）",
          "d": "—",
          "hospital": "—",
          "quote": "医生记录：「本人选择保育治疗，暂不手术；完成生育后再讨论。」",
          "margins": "—",
          "stay": "—",
          "impact": "保育是延迟手术、争取生育时间，不是治愈；随访活检节奏按医生安排。"
        },
        "rt": {
          "ebrt": {
            "used": false,
            "note": "本档案未做体外照射（EBRT）。"
          },
          "vbt": {
            "used": false,
            "note": "本档案未做阴道残端近距离放疗（VBT）。"
          }
        },
        "systemic": {
          "used": true,
          "note": "孕激素属于内分泌治疗，记录在「孕激素与监测」；本页不评疗效、不判进展。",
          "cycles": [
            {
              "n": 1,
              "d": "2026-02-10",
              "status": "开始",
              "text": "口服甲地孕酮 + LNG-IUD"
            },
            {
              "n": 2,
              "d": "2026-05-06",
              "status": "继续",
              "text": "活检后继续原方案（医生记录）"
            },
            {
              "n": 3,
              "d": "2026-08-05",
              "status": "继续",
              "text": "活检后继续原方案（医生记录）"
            }
          ]
        }
      },
      "fertility": {
        "applicable": true,
        "reason": "",
        "decision": {
          "desire": "有，强烈（未育；本人与丈夫共同记录）",
          "age": "31",
          "parity": "未育（G0P0）",
          "candidate": "子宫内膜样 G1（病理原文）",
          "mri": "未见明确肌层浸润（MRI 原文）",
          "review": "二次病理复核维持 G1",
          "told": [
            "非治愈",
            "需密切随访与反复活检",
            "复发风险",
            "将来可能需切除子宫",
            "妊娠不保证"
          ],
          "note": "本页零方案推荐、零概率预测；医生说过什么照录，选择由本人做。"
        },
        "progestin": {
          "regimen": "口服甲地孕酮 + LNG-IUD",
          "dose": "按说明书剂量口服（医生原文未写 mg）",
          "start": "2026-02-10",
          "end": "进行中",
          "sideEffects": "突破性出血（2026-09-08，点滴 4 天）；体重 +1.2 kg；情绪波动（本人原话）",
          "liver": "每月查肝功能：ALT 18 → 26 U/L（参考区间内，化验单原文）",
          "biopsyInterval": 3,
          "biopsies": [
            {
              "d": "2026-05-06",
              "result": "局灶残留（病理原文）",
              "cr": false
            },
            {
              "d": "2026-08-05",
              "result": "未见明确残留肿瘤（病理原文）",
              "cr": true
            }
          ],
          "note": "不推方案；剂量、疗程与是否换方案由医生决定。"
        },
        "conceive": {
          "crDate": "2026-08-05（医生记录「未见明确残留肿瘤」）",
          "attemptStart": "2026-09-01",
          "art": "尚未转诊（医生记录「尝试 6 个月未孕可转生殖中心」）",
          "pregnancy": "未记录",
          "delivery": "未记录",
          "postpartum": "医生记录「完成生育后讨论全子宫+双附件切除时机」",
          "note": "只记时间线与医嘱原文，不判「能不能生」；没有活产也不后悔，是合理结局。"
        }
      },
      "lynch": {
        "note": "肿瘤 PMS2 缺失像一盏提示灯：提示可能需要 Lynch 评估，但多数情况并不是 Lynch。医生已建议遗传咨询；去不去、什么时候去、告不告诉家人，都是本人的选择——不知情也是合法选择，本台不劝检测。",
        "testing": {
          "tumor": [
            {
              "item": "肿瘤 MMR IHC",
              "value": "PMS2 缺失，余保留",
              "d": "2026-05-08",
              "quote": "「PMS2 表达缺失，MLH1、MSH2、MSH6 保留。」"
            },
            {
              "item": "MLH1 甲基化",
              "value": "未检测（MLH1 保留，医生未安排）",
              "d": "—",
              "quote": "—"
            },
            {
              "item": "MSI",
              "value": "未检测",
              "d": "—",
              "quote": "—"
            }
          ],
          "germline": [
            {
              "item": "遗传咨询",
              "value": "医生已建议，本人尚未决定（2026-08-12 门诊记录）",
              "d": "2026-08-12",
              "quote": "「建议遗传咨询，进一步评估 Lynch 可能；尊重本人节奏。」"
            },
            {
              "item": "胚系检测",
              "value": "未提供（not_offered）",
              "d": "—",
              "quote": "—"
            }
          ],
          "status": "肿瘤 PMS2 缺失；遗传咨询已建议、未进行；胚系检测未提供。"
        },
        "family": {
          "note": "家系记录只存关系、癌种、确诊年龄与是否核实，不存亲属姓名；第三方信息默认 private，写入需要本人同意（consent=1）。不替亲属建档、不默认共享。",
          "rows": [
            {
              "code": "亲属 A",
              "relation": "母亲",
              "cancer": "子宫内膜癌",
              "age": 54,
              "verified": "未核实（本人转述）",
              "thirdParty": true,
              "consent": true,
              "visibility": "private"
            },
            {
              "code": "亲属 B",
              "relation": "妹妹",
              "cancer": "结直肠癌",
              "age": 36,
              "verified": "未核实（本人转述）",
              "thirdParty": true,
              "consent": true,
              "visibility": "private"
            }
          ],
          "consentNote": "以上 2 条均为 third_party=1 + consent=1；默认 private，导出与摘要不含；不存姓名，只存代号。"
        },
        "comm": {
          "notified": "partial（已告诉母亲；妹妹尚未告知）",
          "testedCount": 0,
          "plan": "肠镜 / 妇科监测：尚未制定（未进入遗传路径）",
          "surgeryDiscussed": "未讨论",
          "note": "是否告诉家人、什么时候告诉、告知多少，由本人决定。本台不推动亲属检测；家属要不要知道、要不要检测，是家属自己的选择。",
          "questions": [
            {
              "id": "Q1",
              "text": "PMS2 缺失但 MLH1 保留，遗传咨询会问什么？",
              "asked": false,
              "src": "本人整理"
            },
            {
              "id": "Q2",
              "text": "如果我不想知道结果，还能继续保育随访吗？",
              "asked": false,
              "src": "本人整理（尊重不知情权）"
            }
          ]
        }
      },
      "intimate": {
        "note": "本档案未接受盆腔放疗，本线保留空态；如果以后出现私密不适，可在这里记录，默认 private。",
        "symptoms": [],
        "dilator": {
          "status": "不适用（未放疗）",
          "start": "—",
          "freq": "—",
          "minutes": "—",
          "size": "—",
          "pain": "—",
          "bleeding": "—",
          "moisturizer": "—",
          "lubricant": "—",
          "estrogen": "—",
          "note": "未接受放疗，不产生扩张器频率建议；也不自行设定。"
        },
        "comm": {
          "comfort": 3,
          "discussed": "否",
          "questions": [],
          "referral": "—",
          "exportNote": "本档案无私密数值；如以后记录，仍按三出口过滤。"
        }
      },
      "followup": {
        "start": "2026-08-05",
        "interval": 3,
        "intervalNote": "保育随访：每 3 个月内膜活检 + 妇科检查（医生记录）；完成生育后按术后随访节奏。节点 = 起点 + k×间隔，具体以医生为准。",
        "nodes": [
          "2026-08-04",
          "2026-11-04",
          "2027-02-04",
          "2027-05-04",
          "2027-08-04",
          "2027-11-04"
        ],
        "visits": [
          {
            "d": "2026-05-06",
            "symptoms": "月经间期出血",
            "speculum": "未做（保育路径）",
            "pelvic": "子宫活动度好",
            "ca125": "未查",
            "imaging": "MRI（2026-05-20）",
            "cytology": "未做",
            "note": "保育随访"
          },
          {
            "d": "2026-08-05",
            "symptoms": "突破性出血（少量）",
            "speculum": "未做（保育路径）",
            "pelvic": "子宫大小正常",
            "ca125": "未查",
            "imaging": "TVS 6.0mm",
            "cytology": "未做",
            "note": "保育随访"
          }
        ],
        "imaging": [
          {
            "d": "2026-05-20",
            "kind": "盆腔 MRI",
            "indication": "有指征（保育评估）",
            "quote": "「结合带完整，未见明确肌层浸润。」",
            "method": "MRI"
          },
          {
            "d": "2026-08-05",
            "kind": "TVS",
            "indication": "有指征（保育随访）",
            "quote": "「子宫内膜厚约 6.0mm，未见明确异常。」",
            "method": "经阴道超声"
          }
        ],
        "cytology": [],
        "comorb": {
          "bp": "112/70 mmHg（2026-10-15）",
          "bmi": "22.7（身高 162cm，体重 59.4kg）",
          "glucose": "4.9 mmol/L",
          "lipids": "LDL 2.4 mmol/L",
          "exercise": "每周瑜伽 2 次（本人记录）",
          "smoking": "不吸烟",
          "bone": "未做骨密度",
          "secondPrimary": "按医生安排；本台不生成筛查处方",
          "note": "本页只记录血压/BMI/血糖/血脂/运动/吸烟/骨健康；不给处方。"
        },
        "nutrition": {
          "weight": "59.4 kg（2026-10-15）",
          "rows": [
            {
              "d": "2026-05-06",
              "meal": "三餐正常",
              "symptom": "无",
              "weight": 58.6
            },
            {
              "d": "2026-08-05",
              "meal": "三餐正常，爱吃甜食",
              "symptom": "偶有腹胀",
              "weight": 59.1
            },
            {
              "d": "2026-10-15",
              "meal": "三餐正常",
              "symptom": "无",
              "weight": 59.4
            }
          ],
          "note": "只记份量、食物、症状与体重；肥胖与保育反应的相关性只作解释，不做道德评判。"
        }
      },
      "mind": {
        "note": "生育焦虑、身体意象、家系沟通都算正常反应；本页只做自评记录，不诊断焦虑，也不承诺「消除恐惧」。",
        "feelings": {
          "patient": [
            {
              "d": "2026-06-10",
              "v": 6,
              "text": "「看到 POLE 那三个字，第一反应是害怕，后来医生解释才慢慢懂。」"
            },
            {
              "d": "2026-09-01",
              "v": 4,
              "text": "「开始尝试怀孕，既期待又怕失败。」"
            }
          ],
          "caregiver": [
            {
              "d": "2026-06-10",
              "v": 5,
              "text": "「她不说，我知道她怕不能生；我也怕。」"
            },
            {
              "d": "2026-09-01",
              "v": 4,
              "text": "「我能做的是把每次复查记好。」"
            }
          ],
          "note": "患者与照护者各自记录、并列展示、不平均；本档案以丈夫代记为主，但感受仍分开存。"
        },
        "body": [
          {
            "d": "2026-06-10",
            "text": "「放环后总觉得身体里有东西，不太自在。」",
            "visibility": "private"
          }
        ],
        "fertilityAnx": [
          {
            "d": "2026-09-01",
            "text": "「如果最后没有孩子，我会不会后悔？我希望无论结果怎样都不后悔。」",
            "visibility": "private"
          },
          {
            "d": "2026-10-15",
            "text": "「不想让家里老人一直问，但又不想骗他们。」",
            "visibility": "private"
          }
        ],
        "bodyNote": "身体意象与生育焦虑默认 private；可逐条授权给医生看，不自动进入导出或 AI 上下文。"
      },
      "metrics": {
        "numeric": {
          "WEIGHT": [
            {
              "d": "2026-02-10",
              "v": 58.2,
              "src": "保育开始"
            },
            {
              "d": "2026-05-06",
              "v": 58.6,
              "src": "活检"
            },
            {
              "d": "2026-08-05",
              "v": 59.1,
              "src": "活检"
            },
            {
              "d": "2026-09-01",
              "v": 59,
              "src": "开始尝试"
            },
            {
              "d": "2026-10-15",
              "v": 59.4,
              "src": "随访"
            }
          ],
          "BLEED_DAYS": [
            {
              "d": "2026-04-26",
              "v": 2,
              "src": "出血日志 B1"
            },
            {
              "d": "2026-06-02",
              "v": 3,
              "src": "出血日志 B2"
            },
            {
              "d": "2026-09-08",
              "v": 4,
              "src": "出血日志 B3"
            }
          ],
          "IMG_MM": [
            {
              "d": "2026-04-24",
              "v": 12,
              "src": "TVS 双层内膜"
            },
            {
              "d": "2026-08-05",
              "v": 6,
              "src": "TVS 双层内膜"
            }
          ]
        },
        "qual": {
          "TX_EVENT": [
            {
              "d": "2026-02-10",
              "code": "P",
              "label": "保育开始"
            },
            {
              "d": "2026-05-06",
              "code": "B",
              "label": "活检 1"
            },
            {
              "d": "2026-08-05",
              "code": "B",
              "label": "活检 2"
            }
          ],
          "MOLECULAR_EVENT": [
            {
              "d": "2026-05-08",
              "code": "M",
              "label": "MMR/p53"
            },
            {
              "d": "2026-06-10",
              "code": "M",
              "label": "POLE"
            }
          ],
          "FOLLOWUP_EVENT": [
            {
              "d": "2026-09-01",
              "code": "F",
              "label": "尝试怀孕"
            },
            {
              "d": "2026-10-15",
              "code": "F",
              "label": "随访"
            }
          ]
        }
      },
      "events": [
        [
          "2026-05-06",
          "活检 1"
        ],
        [
          "2026-06-10",
          "POLE 结果"
        ],
        [
          "2026-08-05",
          "活检 2"
        ],
        [
          "2026-09-01",
          "开始尝试怀孕"
        ]
      ],
      "docs": {
        "documents": [
          {
            "id": "D1",
            "name": "宫腔镜病理 2026-05-08",
            "fileName": "path-2026-05-08.pdf",
            "d": "2026-05-08",
            "kind": "病理",
            "size": "0.9 MB",
            "status": "已核对"
          },
          {
            "id": "D2",
            "name": "分子病理 2026-06-10",
            "fileName": "mol-2026-06-10.pdf",
            "d": "2026-06-10",
            "kind": "基因/分子",
            "size": "1.4 MB",
            "status": "已核对"
          },
          {
            "id": "D3",
            "name": "盆腔 MRI 2026-05-20",
            "fileName": "mri-2026-05-20.pdf",
            "d": "2026-05-20",
            "kind": "影像",
            "size": "3.2 MB",
            "status": "待核对"
          },
          {
            "id": "D4",
            "name": "门诊记录 2026-08-12",
            "fileName": "visit-2026-08-12.pdf",
            "d": "2026-08-12",
            "kind": "门诊记录",
            "size": "0.4 MB",
            "status": "已核对"
          }
        ],
        "candidates": [
          {
            "id": "C1",
            "field": "POLE 变异",
            "value": "致病性变异（超突变）",
            "src": "分子病理 2026-06-10 · 第 1 页",
            "state": "待核对"
          },
          {
            "id": "C2",
            "field": "PMS2",
            "value": "表达缺失",
            "src": "宫腔镜病理 2026-05-08 · 第 2 页",
            "state": "待核对"
          },
          {
            "id": "C3",
            "field": "MRI 肌层浸润",
            "value": "未见明确肌层浸润",
            "src": "盆腔 MRI 2026-05-20 · 第 1 页",
            "state": "待核对"
          }
        ],
        "materials": [
          {
            "name": "宫腔镜病理",
            "why": "保育候选依据",
            "state": "ready"
          },
          {
            "name": "分子病理",
            "why": "POLE / MMR 原文",
            "state": "ready"
          },
          {
            "name": "盆腔 MRI",
            "why": "肌层浸润评估",
            "state": "ready"
          },
          {
            "name": "肝功能化验单",
            "why": "孕激素监测",
            "state": "partial"
          }
        ],
        "questions": [
          {
            "id": "Q1",
            "text": "POLE 超突变对保育方案有什么影响？",
            "asked": false,
            "src": "本人整理 · 2026-06-10"
          },
          {
            "id": "Q2",
            "text": "PMS2 缺失，遗传咨询要准备什么？",
            "asked": false,
            "src": "本人整理 · 2026-08-12"
          },
          {
            "id": "Q3",
            "text": "尝试怀孕多久没成功要转生殖中心？",
            "asked": true,
            "src": "本人整理 · 2026-09-01"
          }
        ],
        "trials": [
          {
            "id": "CTR20191858",
            "title": "帕博利珠单抗联合仑伐替尼用于治疗子宫内膜癌的III期研究",
            "phase": "III 期",
            "status": "登记状态，未核实",
            "topic": "系统治疗 · 联合方案",
            "source": "中国药物临床试验登记与信息公示平台",
            "url": "https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml",
            "note": "适用于复发/晚期语境；线索不是推荐，不判入组资格。",
            "nmpa": "待核验"
          },
          {
            "id": "CTR20211275",
            "title": "在根治性手术后使用辅助化疗+帕博利珠单抗/安慰剂治疗子宫内膜癌",
            "phase": "III 期",
            "status": "登记状态，未核实",
            "topic": "术后辅助 · 免疫",
            "source": "中国药物临床试验登记与信息公示平台",
            "url": "https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml",
            "note": "与术后辅助语境相关；是否适合由研究团队按入组标准判断。",
            "nmpa": "待核验"
          },
          {
            "id": "CTR20244095",
            "title": "Trastuzumab Deruxtecan 联合 rilvegostomig 或帕博利珠单抗作为 HER2 表达、错配修复正常（pMMR）子宫内膜癌一线治疗的III期研究",
            "phase": "III 期",
            "status": "登记状态，未核实",
            "topic": "pMMR · HER2",
            "source": "中国药物临床试验登记与信息公示平台",
            "url": "https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml",
            "note": "登记标题写明 pMMR；是否 HER2 表达需病理检测，本台不判断。",
            "nmpa": "待核验"
          },
          {
            "id": "CTR20242153",
            "title": "盐酸安罗替尼胶囊联合 TQB2450 注射液对比化疗治疗非 MSI-H 或非 dMMR 的复发性或转移性子宫内膜癌的III期研究",
            "phase": "III 期",
            "status": "登记状态，未核实",
            "topic": "非 MSI-H · 复发/转移",
            "source": "中国药物临床试验登记与信息公示平台",
            "url": "https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml",
            "note": "标题含 MSI 状态条件；入组资格由研究团队判断。",
            "nmpa": "待核验"
          }
        ]
      },
      "dashKeys": [
        "WEIGHT",
        "BLEED_DAYS",
        "IMG_MM",
        "TX_EVENT"
      ]
    }
  ],
  "trials": [
    {
      "id": "CTR20191858",
      "title": "帕博利珠单抗联合仑伐替尼用于治疗子宫内膜癌的III期研究",
      "phase": "III 期",
      "status": "登记状态，未核实",
      "topic": "系统治疗 · 联合方案",
      "source": "中国药物临床试验登记与信息公示平台",
      "url": "https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml",
      "note": "适用于复发/晚期语境；线索不是推荐，不判入组资格。",
      "nmpa": "待核验"
    },
    {
      "id": "CTR20211275",
      "title": "在根治性手术后使用辅助化疗+帕博利珠单抗/安慰剂治疗子宫内膜癌",
      "phase": "III 期",
      "status": "登记状态，未核实",
      "topic": "术后辅助 · 免疫",
      "source": "中国药物临床试验登记与信息公示平台",
      "url": "https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml",
      "note": "与术后辅助语境相关；是否适合由研究团队按入组标准判断。",
      "nmpa": "待核验"
    },
    {
      "id": "CTR20244095",
      "title": "Trastuzumab Deruxtecan 联合 rilvegostomig 或帕博利珠单抗作为 HER2 表达、错配修复正常（pMMR）子宫内膜癌一线治疗的III期研究",
      "phase": "III 期",
      "status": "登记状态，未核实",
      "topic": "pMMR · HER2",
      "source": "中国药物临床试验登记与信息公示平台",
      "url": "https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml",
      "note": "登记标题写明 pMMR；是否 HER2 表达需病理检测，本台不判断。",
      "nmpa": "待核验"
    },
    {
      "id": "CTR20242153",
      "title": "盐酸安罗替尼胶囊联合 TQB2450 注射液对比化疗治疗非 MSI-H 或非 dMMR 的复发性或转移性子宫内膜癌的III期研究",
      "phase": "III 期",
      "status": "登记状态，未核实",
      "topic": "非 MSI-H · 复发/转移",
      "source": "中国药物临床试验登记与信息公示平台",
      "url": "https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml",
      "note": "标题含 MSI 状态条件；入组资格由研究团队判断。",
      "nmpa": "待核验"
    }
  ]
};
