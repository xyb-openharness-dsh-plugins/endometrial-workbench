/* markdown → 候选（ENDO 词表）。18 号 v2 六部件之三。
 *
 * 本层只抄写，不判读：组织学类型、肌层浸润、LVSI、MMR/p53/POLE 状态都按报告原文搬运；
 * 「哪种分型该用什么治疗」「POLE 超突变是不是预后更好」不在本层，也不在界面出现。
 *
 * 词边界坑（ENDO 实测 / 评审点名）：
 * - `MMR` 不能吃掉 `MMRd`、`dMMR`、`pMMR`：它们是**状态**，不是"MMR + 一个多余的字母"。
 *   前后断言 `(?<![A-Za-z0-9-])…(?![A-Za-z0-9-])` 让裸 MMR 不匹配 MMRd；MMRd 作为独立别名收录。
 * - `LVSI` 不能被 `LVS` 命中，也不能把 `LVS` 当成 `LVSI`：`LVS` 在本词表里**不是**指标；
 *   两边都靠词边界与 `not` 排除。
 * - `子宫内膜样` 不能从 `非子宫内膜样` 里抽出来（中文没有 \b，必须用 `not` 排除）；
 *   同理 `浆液性` / `透明细胞` 的否定式。
 * - `POLE` 不匹配 `POLE-like`；`p53` 不匹配 `p53-like`。
 *
 * 其余四条沿用家族契约（18 号 §7/§8）：
 * 1. 先 htmlTablesToPipes() 再按位置对齐（先剥标签会把整表压成一行，静默串位）；
 * 2. 单位先剥 LaTeX 外壳（`$10^9/L$`），认不出只剥壳不推断；
 * 3. 不等式 `<0.5` 原样保留、value_num 留空；
 * 4. 指标数与数值数不一致整行放弃，不做模糊匹配。
 */

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function decodeEntities(text) {
  return String(text)
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

/** HTML 表格 → 竖线表（colspan 补空、首行表头 + 分隔行，四个细节缺一不可）。 */
export function htmlTablesToPipes(md) {
  if (!/<table/i.test(md)) return md;
  return md.replace(/<table[\s\S]*?<\/table>/gi, (block) => {
    const out = [];
    for (const row of block.match(/<tr[\s\S]*?<\/tr>/gi) || []) {
      const cells = [];
      for (const m of row.matchAll(/<t([dh])([^>]*)>([\s\S]*?)<\/t\1>/gi)) {
        const attrs = m[2] || '';
        const text = decodeEntities(m[3].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
        cells.push(text);
        const span = Number((attrs.match(/colspan\s*=\s*["']?(\d+)["']?/i) || [])[1] || 1);
        for (let k = 1; k < span; k += 1) cells.push('');
      }
      if (cells.length) out.push(`| ${cells.map((c) => c.replace(/\|/g, '/')).join(' | ')} |`);
    }
    if (out.length) out.splice(1, 0, `| ${out[0].split('|').filter((x) => x.trim()).map(() => '---').join(' | ')} |`);
    return out.join('\n');
  });
}

/** 剥 LaTeX 外壳（只剥壳，不推断内容）。 */
export function stripLatex(text) {
  return String(text ?? '')
    .replace(/\$\$([\s\S]*?)\$\$/g, '$1')
    .replace(/\$([^$]*)\$/g, '$1')
    .replace(/\\\(([\s\S]*?)\\\)/g, '$1')
    .replace(/\\\[([\s\S]*?)\\\]/g, '$1')
    .replace(/\\(?:text|mathrm|mbox)\{([^{}]*)\}/g, '$1')
    .replace(/\\mu\s*/g, 'μ')
    .replace(/[{}]/g, '');
}

function cells(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}
const isTableLine = (line) => line.trim().startsWith('|') && line.trim().endsWith('|');
const isSeparator = (line) => /^\|[\s:|-]+\|$/.test(line.trim());

/**
 * ENDO 指标字典。
 * kind='numeric'（默认）走数值搬运；kind='text' 保留状态原文（检出/未检出/未检测）。
 * `not` 是排除正则：凡命中 not 的单元格不算这条（中文没有 \b，词边界挡不住复合词）。
 */
export const LAB_DICT = [
  {
    key: 'MMR', name: 'MMR（错配修复）', aliases: ['MMR', 'pMMR', 'dMMR', 'MMRd', 'MMR-D', '错配修复'],
    not: /MMR\s*[-–—]\s*(?:like|LC|assay)\b/i, unit: '', kind: 'text',
  },
  {
    key: 'POLE', name: 'POLE', aliases: ['POLE', 'POLEmut', 'POLE 超突变', 'POLE超突变', 'POLE 核酸外切酶域'],
    not: /POLE\s*[-–—]\s*like/i, unit: '', kind: 'text',
  },
  {
    key: 'P53', name: 'p53', aliases: ['p53', 'TP53', 'p53abn'],
    not: /p53\s*[-–—]\s*like/i, unit: '', kind: 'text',
  },
  {
    key: 'HISTOLOGY_ENDOMETRIOID', name: '组织学类型（子宫内膜样）', aliases: ['子宫内膜样', '内膜样'],
    not: /非\s*(?:子宫)?内膜样|不是\s*(?:子宫)?内膜样/, unit: '', kind: 'text',
  },
  {
    key: 'HISTOLOGY_SEROUS', name: '组织学类型（浆液性）', aliases: ['浆液性', '子宫浆液性'],
    not: /非\s*浆液性/, unit: '', kind: 'text',
  },
  {
    key: 'HISTOLOGY_CLEAR', name: '组织学类型（透明细胞）', aliases: ['透明细胞'],
    not: /非\s*透明细胞/, unit: '', kind: 'text',
  },
  {
    key: 'MYO', name: '肌层浸润', aliases: ['肌层浸润', '浸润肌层', '肌层侵犯'],
    not: /未见\s*肌层浸润|无\s*肌层浸润/, unit: '', kind: 'text',
  },
  {
    key: 'LVSI', name: 'LVSI（脉管侵犯）', aliases: ['LVSI', '脉管侵犯', '脉管癌栓', '淋巴血管间隙浸润'],
    not: /LVSI\s*[-–—]\s*like|\bLVS\b(?!I)/i, unit: '', kind: 'text',
  },
  {
    key: 'CA125', name: 'CA125', aliases: ['CA125', 'CA-125', '糖类抗原125'],
    unit: 'U/mL', kind: 'numeric',
  },
  {
    key: 'HE4', name: 'HE4', aliases: ['HE4', '人附睾蛋白4'],
    unit: 'pmol/L', kind: 'numeric',
  },
  {
    key: 'HGB', name: '血红蛋白', aliases: ['HGB', 'Hb', '血红蛋白'],
    unit: 'g/L', kind: 'numeric',
  },
  {
    key: 'WBC', name: '白细胞', aliases: ['WBC', '白细胞'],
    unit: '10⁹/L', kind: 'numeric',
  },
  {
    key: 'PLT', name: '血小板', aliases: ['PLT', '血小板'],
    unit: '10⁹/L', kind: 'numeric',
  },
  {
    key: 'ALT', name: 'ALT（丙氨酸氨基转移酶）', aliases: ['ALT', '丙氨酸氨基转移酶', '谷丙转氨酶'],
    unit: 'U/L', kind: 'numeric',
  },
  {
    key: 'AST', name: 'AST（天门冬氨酸氨基转移酶）', aliases: ['AST', '天门冬氨酸氨基转移酶', '谷草转氨酶'],
    unit: 'U/L', kind: 'numeric',
  },
];

/** 词边界匹配：ASCII 别名前后不得是字母/数字/连字符（MMR vs MMRd、LVSI vs LVS 全靠这个）。 */
function aliasHit(text, alias) {
  const re = new RegExp(`(?<![A-Za-z0-9-])${escapeRe(alias)}(?![A-Za-z0-9-])`, 'i');
  return re.test(text);
}

/** 在原文里找字典项；命中 not 的一律不算。 */
function lookup(text) {
  return LAB_DICT.find((d) => !(d.not && d.not.test(text)) && d.aliases.some((a) => aliasHit(text, a))) || null;
}

const NUM_RE = /^(?:[<>≤≥]\s*)?-?\d+(?:\.\d+)?$/;
function valueOf(cell) {
  const t = stripLatex(String(cell)).replace(/\s/g, '');
  if (!t) return null;
  if (/^[<>≤≥]/.test(t)) {
    const m = t.match(/^([<>≤≥])(-?\d+(?:\.\d+)?)$/);
    return m ? { raw: `${m[1]}${m[2]}`, num: null } : null;
  }
  if (!NUM_RE.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? { raw: t, num: n } : null;
}

const UNIT_RE = /^(10\^?9\/L|×10\^?9\/L|10⁹\/L|×10⁹\/L|g\/L|mg\/L|mmol\/L|μmol\/L|umol\/L|U\/mL|U\/L|mIU\/mL|mIU\/L|IU\/mL|IU\/L|ng\/mL|ng\/dL|ng\/L|pg\/mL|pmol\/L|kg|mm|cm|%|fL|pg)$/i;

export function normalizeUnit(cell) {
  return stripLatex(String(cell ?? '')).replace(/\s/g, '');
}

/**
 * 状态原文归一（只归一到三种可抄写的状态，不推断）。
 * 判定顺序很重要：先"未检测"，再"阴性/野生型/pMMR"，再"缺失/突变/阳性"，
 * 最后才是"保留"——因为 `PMS2 缺失，MLH1/MSH2/MSH6 保留` 这类句子同时出现两个词。
 */
export function normalizeMarkerStatus(text) {
  const t = stripLatex(String(text ?? ''));
  if (!t) return null;
  if (/未检测|未做|未送检|not\s*tested/i.test(t)) return { status: 'not_tested', value: t };
  if (/未检出|阴性|not\s*detected|negative|野生型|野生|pMMR/i.test(t)) return { status: 'not_detected', value: t };
  if (/缺失|dMMR|MMRd|阳性|突变|超突变|检出|异常|detected|positive|abn/i.test(t)) return { status: 'detected', value: t };
  if (/保留/.test(t)) return { status: 'not_detected', value: t };
  return null;
}

/** 组织学/肌层/LVSI 这类"原文搬运"字段：原文本身就是值，不归一成三态。 */
const FREE_TEXT = new Set(['HISTOLOGY_ENDOMETRIOID', 'HISTOLOGY_SEROUS', 'HISTOLOGY_CLEAR', 'MYO', 'LVSI']);

/**
 * 从 markdown 抽候选。
 * @returns {{candidates: Array, skipped: Array}} candidates 每项 {name,key,value,num,unit,line,kind,status?}
 */
export function extractCandidates(markdown) {
  const md = htmlTablesToPipes(String(markdown ?? ''));
  const candidates = [];
  const skipped = [];
  const seen = new Set();

  const push = (hit, val, unitCell, line, status) => {
    const dedupe = `${hit.key}:${val}`;
    if (seen.has(dedupe)) return;
    seen.add(dedupe);
    candidates.push({
      key: hit.key,
      name: hit.name,
      kind: hit.kind ?? 'numeric',
      value: val,
      unit: unitCell || hit.unit || '',
      line,
      ...(status ? { status } : {}),
    });
  };

  const lines = md.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    if (!isTableLine(lines[i])) { i += 1; continue; }
    const start = i;
    while (i < lines.length && isTableLine(lines[i])) i += 1;
    const blockLines = lines.slice(start, i).filter((l) => !isSeparator(l));
    if (blockLines.length < 2) continue;

    const header = cells(blockLines[0]);
    let idxName = header.findIndex((h) => /项目|指标|名称|检验|item|test/i.test(h));
    let idxVal = header.findIndex((h) => /结果|数值|value|result/i.test(h));
    let idxUnit = header.findIndex((h) => /单位|unit/i.test(h));
    if (idxName === -1 && idxVal === -1 && header.length >= 2) { idxName = 0; idxVal = 1; }
    if (idxName === -1 || idxVal === -1) continue;

    for (const line of blockLines.slice(1)) {
      const row = cells(line);
      const name = stripLatex(row[idxName] ?? '');
      const hit = lookup(name);
      if (!hit) continue;
      const unitCell = idxUnit >= 0 ? normalizeUnit(row[idxUnit]) : '';

      if (hit.kind === 'text') {
        const raw = stripLatex(row[idxVal] ?? '').trim();
        if (!raw) { skipped.push({ name, cell: raw, reason: '结果为空' }); continue; }
        if (FREE_TEXT.has(hit.key)) { push(hit, raw, '', start + 1); continue; }
        const status = normalizeMarkerStatus(raw);
        if (!status) { skipped.push({ name, cell: raw, reason: '状态原文不是检出/未检出/未检测' }); continue; }
        push(hit, status.value, '', start + 1, status.status);
        continue;
      }

      const val = valueOf(row[idxVal] ?? '');
      if (!val) { skipped.push({ name, cell: row[idxVal] ?? '', reason: '不是单一数值（参考范围/文字）' }); continue; }
      if (unitCell && !UNIT_RE.test(unitCell)) { skipped.push({ name, cell: unitCell, reason: '单位不认识' }); continue; }
      push(hit, val.num === null ? val.raw : val.num, unitCell, start + 1);
    }
  }

  /* 纯文本行（没有表格的病理小结）：只认状态/原文类字段，且必须避开 not 排除。 */
  for (const [n, line] of lines.entries()) {
    if (isTableLine(line)) continue;
    for (const hit of LAB_DICT) {
      if (hit.kind !== 'text') continue;
      if (!hit.aliases.some((a) => aliasHit(line, a))) continue;
      if (hit.not && hit.not.test(line)) continue;
      if (FREE_TEXT.has(hit.key)) { push(hit, stripLatex(line).trim(), '', n + 1); continue; }
      const status = normalizeMarkerStatus(line);
      if (!status) continue;
      push(hit, status.value, '', n + 1, status.status);
    }
  }

  return { candidates, skipped };
}

/** 报告日期：文件名或正文里的 YYYY-MM-DD / YYYY年M月D日。取不到就是 null（不猜今天）。 */
export function guessReportDate(text, fallback = null) {
  const m = String(text ?? '').match(/(20\d{2})[-/年.](\d{1,2})[-/月.](\d{1,2})/);
  if (!m) return fallback;
  const [_, y, mo, d] = m;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
