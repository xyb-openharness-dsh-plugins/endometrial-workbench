#!/usr/bin/env node
/**
 * 36 号 §2.5 链接完整性断言（通用版，自动识别活动原型）
 *
 * 判据：
 *   L1 sources 里 original:true → 必须有 https url
 *   L2 sources 里 original:false → 必须有 https secondaryUrl
 *   L3 evidence 表「原件」列 → 必须是 {text,url} 对象且 url 为 https；纯文字违规
 *   L4 nolink:true 放行，但必须有 note
 *   L5 只允许 https://
 *   L6 不得只是域名首页
 *
 * 用法：node scripts/check-primer-links.mjs [--data prototypes/v0.2/primer-data.js]
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const argOf = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : null }
function pickData() {
  const explicit = argOf('--data')
  if (explicit) return isAbsolute(explicit) ? explicit : join(ROOT, explicit)
  const pd = join(ROOT, 'prototypes')
  if (!existsSync(pd)) return null
  const dirs = readdirSync(pd).filter(d => existsSync(join(pd, d, 'primer-data.js')))
  dirs.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  return dirs.length ? join(pd, dirs[dirs.length - 1], 'primer-data.js') : null
}

const DATA = pickData()
if (!DATA) { console.error('✗ 找不到 prototypes/*/primer-data.js'); process.exit(1) }

const sandbox = { window: {} }
try { new Function('window', readFileSync(DATA, 'utf8'))(sandbox.window) } catch (e) { console.error(`✗ primer-data.js 求值失败：${e.message}`); process.exit(1) }
const primer = sandbox.window.DISEASE_PRIMER
if (!primer) { console.error('✗ 没有设置 window.DISEASE_PRIMER'); process.exit(1) }

const isHttps = (u) => typeof u === 'string' && /^https:\/\/[^\s]+$/.test(u)
const isBare = (u) => { try { const p = new URL(u); return (p.pathname === '/' || p.pathname === '') && !p.search && !p.hash } catch { return true } }
const checkUrl = (u) => !isHttps(u) ? '必须是 https:// 链接' : isBare(u) ? '不能只给域名首页' : null

const fails = [], oks = []
let checked = 0
for (const sec of primer.sections || []) {
  for (const [i, s] of (sec.sources || []).entries()) {
    const at = `${sec.id}.sources[${i}]（${s.org || '?'}）`
    checked++
    if (s.nolink) { s.note ? oks.push(`L4 ${at} nolink 有说明`) : fails.push(`L4 ${at} nolink 缺 note`); continue }
    const need = s.original === true ? 'url' : s.original === false ? 'secondaryUrl' : null
    if (!need) continue
    const err = checkUrl(s[need])
    err ? fails.push(`${need === 'url' ? 'L1' : 'L2'} ${at} ${err}`) : oks.push(`L1/L2 ${at} ✓`)
  }
  const head = sec.table?.head || []
  const col = head.findIndex(x => /原件/.test(x))
  if (col >= 0) {
    for (const [i, row] of (sec.table?.rows || []).entries()) {
      const at = `${sec.id}.table[${i}]`
      const cell = row[col]
      checked++
      if (cell && typeof cell === 'object' && !Array.isArray(cell)) {
        if (cell.nolink) { cell.note ? oks.push(`L4 ${at} nolink 有说明`) : fails.push(`L4 ${at} nolink 缺 note`); continue }
        const err = checkUrl(cell.url)
        err ? fails.push(`L3 ${at} 原件列 ${err}`) : oks.push(`L3 ${at} ✓`)
      } else {
        fails.push(`L3 ${at} 原件列是纯文字「${String(cell).slice(0, 24)}」`)
      }
    }
  }
}

/* ---------- 本仓附加：public/ 的 primer 三件套必须存在且与活动原型同源（36 号 §3.2 两个落点） ---------- */
const dir = dirname(DATA)
for (const name of ['primer-data.js', 'primer.js', 'primer.css']) {
  const src = join(dir, name)
  const dst = join(ROOT, 'public', name)
  checked++
  if (!existsSync(dst)) fails.push(`P public/${name} 缺失（public 落点需要 primer 三件套）`)
  else if (readFileSync(dst, 'utf8') !== readFileSync(src, 'utf8')) fails.push(`P public/${name} 与 ${src.slice(ROOT.length + 1)} 不一致`)
  else oks.push(`P public/${name} ✓`)
}
const pubIndex = join(ROOT, 'public', 'index.html')
if (existsSync(pubIndex)) {
  const html = readFileSync(pubIndex, 'utf8')
  for (const ref of ['primer.css', 'primer-data.js', 'primer.js']) {
    checked++
    html.includes(ref) ? oks.push(`P public/index.html 引用 ${ref} ✓`) : fails.push(`P public/index.html 未引用 ${ref}`)
  }
}

for (const o of oks) console.log(`PASS  ${o}`)
for (const f of fails) console.log(`FAIL  ${f}`)
console.log(`\n${fails.length ? '✗' : '✓'} 链接断言：${checked} 项，${oks.length} 通过，${fails.length} 失败`)
process.exit(fails.length ? 1 : 0)
