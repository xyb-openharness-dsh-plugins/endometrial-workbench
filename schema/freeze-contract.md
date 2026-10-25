# Schema 冻结合同（G3）· 2026-10-25 · ENDO

| 项 | 值 |
| --- | --- |
| 文件 | `schema/0001_initial.sql` |
| sha256 | `147947717f0443ebfa60c250a6bf63398c5e1e2aa1e3be1076cd3c10d7dfc1ce` |
| 表数 | 32（档案 2 + 指标 3 + 通用 7 + ENDO 专属 17 + 导入 3） |
| 冻结日 | 2026-10-25（G1+G2 签认后；G3 签认人 samqin123） |
| 验证 | 内存 32 表全建；**K 判定列断言 PASS**（无 risk_grade/success_rate/benign/malignant/recommend）；family_member.viewpoint.rt_priv 的 visibility 默认 **private**；third_party_consent 默认 **0** |

## 内容边界（ENDO 专属 17 表）
bleeding_log（出血日志，确诊前，无判读）/ molecular_test（test 级 done/pending/not_done）+ molecular_marker(+title)（marker 级三态）/ **stage_record（FIGO 2023 版本链：anatomical/final_label/marker/change/basis/multiple_text，只引用无判定）** / pathology_record / surgery_record / **tx_line + tx_cycle（32 号折叠卡数据源）** / **fertility_path + fertility_biopsy + pregnancy_attempt（保育，零成功率字段）** / **lynch_record + family_member（第三方 private + 授权位）** / **rt_priv（放疗后私密，默认 private）** / viewpoint（默认 private）/ decision_checklist。

## 冻结规则
同家族：sha256 实算一致；只增不改（000N）；分节补列走 ALTER；解冻需用户确认。
