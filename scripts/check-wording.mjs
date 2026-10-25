#!/usr/bin/env node
/**
 * 医疗与法律表述越界检查（A18 + ENDO K1–K6 红线）。
 *
 * 产品只提供信息，不做诊断、不给处置建议。ENDO 专属高发区（DEV-REQUIREMENTS K1–K6）：
 * K1 分子三态（未检测≠阴性）与分期/分型只并列引用；K2 不劝家属检测、尊重不知情权；
 * K3 保育零方案推荐/零成功率；K4 出血日志只记录不判读；K5 对照表只引用；K6 放疗后私密不设频率。
 * 这条红线放进 `npm run check`：命中即失败，不靠人记。
 *
 * 扫描范围：会被用户读到的实现代码——`dsh/`、`lib/`、`public/`、`src/`、`demo/`、
 * `prototypes/` 下的 .js/.mjs/.cjs/.html/.css。**不扫** docs/：那是讨论稿，另有评审。
 *
 * 两种放行方式：
 * 1. 否定语境：命中词前 12 个字符内出现「不 / 勿 / 禁止 / 别 / 零」，判为免责表述，放行；
 * 2. 显式标注：该行含 `wording-allow` 注释，放行（需在注释里写清为什么）。
 *
 * 用法：node scripts/check-wording.mjs
 * 退出码：0 无命中或没有可扫文件；1 有命中。
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIRS = ['dsh', 'lib', 'public', 'src', 'demo', 'prototypes']
const EXTS = new Set(['.js', '.mjs', '.cjs', '.html', '.css'])

/** 越界表述：不是"提到疾病/材料"，而是"替医生下结论 / 给处置 / 暗示少查 / 归因"。 */
const RULES = [
  /* K1：分子三态不许被写成判定；未检测 ≠ 阴性；分型/分期判定归医生。 */
  { id: 'k1-diagnosis', re: /(是|属于|不是|并非|排除|确认|写成|判为|考虑为)\s*(良性|恶性)(肿瘤|病变)?/g },
  { id: 'k1-molecular-judge', re: /(POLE|p53|MMR).{0,12}(所以|说明|意味着|证明).{0,10}(不用|需要|必须|一定|肯定)/g },
  { id: 'k1-not-tested-equivalence', re: /未检测\s*(就)?(等于|=|是)\s*阴性/g },
  { id: 'k1-stage-judge', re: /(可以|我来|本台|系统)\s*(帮你)?\s*(判定|判定为|直接判)\s*(分期|分型)/g },
  /* K2：Lynch 不劝检测、不替亲属决定；不知情也是合法选择。 */
  { id: 'k2-urge-family', re: /(建议|应该|必须|一定要)\s*(让|叫|劝)?\s*(家属|亲属|子女|女儿|儿子|母亲|妹妹)\s*(去)?\s*(检测|筛查|做基因)/g },
  { id: 'k2-urge-testing', re: /(建议|推荐)\s*(做|进行)\s*(遗传咨询|胚系检测|Lynch\s*检测)/g },
  /* K3：保育零方案推荐、零成功率/活产率。 */
  { id: 'k3-success-rate', re: /(成功率|活产率|妊娠率|保育成功率)/g },
  { id: 'k3-fertility-advice', re: /(建议|推荐|应该|必须)\s*(先|优先)?\s*(做)?\s*保育|(建议|推荐)\s*保留生育/g },
  { id: 'k3-cure-claim', re: /保育(?!.{0,6}(不是|并非|不等于)).{0,8}(治愈|保证|一定成功)/g },
  /* K4：出血只记录，不判病因/性质/严重度。 */
  { id: 'k4-bleed-cause', re: /(出血|绝经后出血).{0,10}(是|说明|提示|意味着).{0,8}(癌|恶性|肿瘤|复发)/g },
  { id: 'k4-bleed-severity', re: /(出血).{0,6}(严重度|危险度)\s*(评分|分级|打分)/g },
  /* K5：对照表只引用指南原文，不合成建议。 */
  { id: 'k5-synth-advice', re: /(根据|按照|结合).{0,10}(指南|对照表).{0,10}(建议|推荐|应该)\s*(用|做|接受|选)/g },
  { id: 'k5-recommend-level', re: /推荐\s*(等级|级别)\s*[:：]?\s*(I|II|III|A|B|C)/g },
  /* K6：放疗后私密不自行设频率、不命令；随访不暗示少查。 */
  { id: 'k6-command-dilator', re: /(必须|一定要|每天|每次)\s*(扩张|用\s*扩张器|使用\s*润滑剂|阴道雌激素)/g },
  { id: 'k6-set-frequency', re: /(扩张器|润滑剂).{0,10}(每周|每天)\s*\d+\s*次/g },
  { id: 'k6-skip-followup', re: /(可以|无需|不必|没必要|不用)\s*(不查|少查|不复查|停查|暂停复查|暂停随访|不随访|省去)/g },
  { id: 'k6-merge-followup', re: /(合并|合成|统一)\s*(成)?\s*(一个|一次)?\s*(总?复查|随访节点)/g },
  /* 家族通用：处置建议 / 停药 / 少就医 / 预后承诺。 */
  { id: 'treatment-advice', re: /建议\s*(进行|做|用|接受|采用|考虑)?\s*(治疗|手术|化疗|放疗|用药|服药|停药|加药|减药|靶向|免疫治疗|保育)/g },
  { id: 'recommend-drug', re: /推荐\s*(进行|使用|服用|用)?\s*(用药|服药|治疗|手术|剂量|药物|方案)/g },
  { id: 'stop-medication', re: /(可以|可|建议|不妨)\s*停\s*(药|用|服)/g },
  { id: 'skip-care', re: /(不用|无需|不必|没必要)\s*(就医|复查|去医院|看医生)/g },
  { id: 'recurrence-claim', re: /(可能|大概率|一定|肯定|不会)\s*(复发|进展|转移)/g },
  { id: 'prognosis-claim', re: /预后\s*(良好|较好|不错|较差|很差)/g },
  { id: 'cure-rate', re: /治愈率|生存期\s*(还有|不足|大概)|生存率/g },
  { id: 'diagnose-claim', re: /(确诊|诊断)\s*为\s*(癌|肿瘤|恶性)/g },
]

const NEGATION = /[不勿禁别零]$|不构成|不代表|不做|不提供|不作为|不含|不给|不暗示|不出现|不要|不得|不可|不能|不是|并不|并非|零/

function walk(dir) {
  const out = []
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const entry of entries) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) out.push(...walk(full))
    else if (st.isFile() && EXTS.has(extname(entry))) out.push(full)
  }
  return out
}

const files = DIRS.flatMap((d) => walk(join(root, d)))
const hits = []

for (const file of files) {
  const text = readFileSync(file, 'utf8')
  const lines = text.split('\n')
  lines.forEach((line, i) => {
    if (line.includes('wording-allow')) return
    for (const rule of RULES) {
      rule.re.lastIndex = 0
      let m
      while ((m = rule.re.exec(line)) !== null) {
        const before = line.slice(Math.max(0, m.index - 12), m.index)
        if (NEGATION.test(before)) continue
        hits.push({
          file: relative(root, file),
          line: i + 1,
          rule: rule.id,
          text: m[0].trim(),
        })
      }
    }
  })
}

if (!files.length) {
  console.log('= 没有可扫描的实现文件（dsh/ lib/ public/ src/ 为空或不存在），本次跳过')
  process.exit(0)
}

if (hits.length) {
  console.error(`✗ 医疗/法律表述越界 ${hits.length} 处（产品只提供信息，不做诊断与处置/法律建议）：\n`)
  for (const h of hits) console.error(`  ${h.file}:${h.line}  [${h.rule}]  「${h.text}」`)
  console.error('\n改法：改成"记录/整理/带去看医生/问材料窗口"的表述；确属免责语句请写在否定语境里。')
  console.error('依据：docs/SPEC.md §2 产品立场、A18、DEV-REQUIREMENTS M3（零法律建议）。')
  process.exit(1)
}

console.log(`✓ 医疗与法律表述检查通过（${files.length} 个实现文件，0 处越界）`)
