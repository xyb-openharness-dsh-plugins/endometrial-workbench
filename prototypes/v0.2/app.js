'use strict';
/* 小膜宝 EndoPal · 子宫内膜癌（ENDO）工作台原型 v0.2.0（prototypes/v0.2）。
   页面树唯一权威：research-notes/family-landscape.md §6.1–§6.3（10 一级 / 30 二级）。
   红线（DEV-REQUIREMENTS K1–K6）：
   K1 分子三态（检出/未检出/未检测）+ 分期/分型只并列引用，判定归医生；
   K2 Lynch 家系第三方信息默认 private + 显式授权，不劝检测，尊重不知情权；
   K3 保育零方案推荐/零概率预测，不以活产为唯一成功标准；
   K4 出血日志独立轨道，只记录不判读；
   K5 分型/治疗对照只引用指南原文；
   K6 放疗后私密默认 private，三出口过滤（一图秀 / 摘要 / 导出）。
   一图秀：数值线用 Fritsch–Carlson 单调三次（整段继承 melanoma/THY），分类节点只画点不连线；
   `.chart .line` 的 computed fill 必须是 none。
   AI 协助：aiPromptWithCtx(page) → postMessage `endo:agent-draft` → 外壳 client 填入原生会话草稿；
   无会话时外壳先调起再填，不自动发送。 */

const APP_INFO = {
  version: '0.2.0',
  build: '2026-10-25',
  channel: 'prototype',
  channelLabel: '交互原型 · 未接入 DSH',
  brand: '小膜宝 EndoPal',
  en: 'endometrial'
};
APP_INFO.displayVersion = `v${APP_INFO.version}`;

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let uidSeq = 0;
const uid = (p) => p + (++uidSeq);

/* ---------------- icons & nav ---------------- */
const icons = {
  home: 'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
  badge: 'M12 3l7 4v10l-7 4-7-4V7ZM9 12l2 2 4-4',
  treat: 'M4 20l6-6M10 14 20 4l-1 5-6 6-3-1ZM4 20h5',
  flower: 'M12 9a2.4 2.4 0 1 1 0 5 2.4 2.4 0 0 1 0-5ZM12 9c0-2 1-3.4 2.4-3.4S17 7 17 8.7c0 1.7-2 2.8-5 2.8M12 14c0 2-1 3.4-2.4 3.4S7 16 7 14.3c0-1.7 2-2.8 5-2.8M9.4 10.4C7.8 9.2 6 8.6 5 9.6s-.2 2.8 1.4 4c1.6 1.2 3.6.6 5.6-.6M14.6 13.6c1.6 1.2 3.4 1.8 4.4.8s.2-2.8-1.4-4c-1.6-1.2-3.6-.6-5.6.6',
  family: 'M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM5 21v-3a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v3M6 10a2.5 2.5 0 1 0 0 5M18 10a2.5 2.5 0 1 1 0 5',
  shield: 'M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6ZM9 12l2 2 4-4',
  calendar: 'M4 5h16v16H4ZM8 3v4m8-4v4M4 10h16m-12 4h2m4 0h2m-8 3h2',
  chart: 'M4 3v17h17M7 14l4-5 4 3 5-7',
  heart: 'M12 20.3c-4.6-2.9-7.4-5.6-7.4-9A4.1 4.1 0 0 1 12 8.4a4.1 4.1 0 0 1 7.4 2.9c0 3.4-2.8 6.1-7.4 9Z',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'
};
const icon = (k) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[k] || icons.home}"/></svg>`;

/* 10 一级 / 30 二级（family-landscape §6.2/§6.3） */
const PAGES = [
  ['dash', '看板', 'home'],
  ['stage', '我的分型与分期', 'badge'],
  ['treatment', '治疗与决策', 'treat'],
  ['fertility', '保育治疗', 'flower'],
  ['lynch', 'Lynch 与家系', 'family'],
  ['intimate', '放疗后私密', 'shield'],
  ['followup', '长期随访与健康', 'calendar'],
  ['chart', '病情一图秀', 'chart'],
  ['mind', '情绪与亲密', 'heart'],
  ['docs', '资料与就诊', 'folder']
];
const SUBPAGES = {
  stage: [['bleed', '出血日志'], ['exam', '检查与活检'], ['path', '病理与分级'], ['figo', '分期档案（FIGO 2023）'], ['molecular', '分子三态（MMR·p53·POLE）'], ['compare', '分型与治疗对照']],
  treatment: [['pathway', '治疗路径（折叠卡）'], ['surgery', '手术记录'], ['rt', '放疗记录（EBRT/VBT）'], ['systemic', '系统与内分泌治疗']],
  fertility: [['decision', '保育决策档案'], ['progestin', '孕激素与监测'], ['conceive', '妊娠尝试与产后计划']],
  lynch: [['testing', 'MMR 与胚系检测'], ['family', '家系记录（第三方私密）'], ['comm', '告知与监测计划']],
  intimate: [['symptoms', '私密症状记录'], ['dilator', '扩张与保湿'], ['comm', '沟通与就诊准备']],
  followup: [['calendar', '随访日历'], ['imaging', '影像与阴道细胞学'], ['comorb', '慢病与第二原发癌'], ['nutrition', '体重与营养']],
  mind: [['feelings', '当下感受'], ['body', '身体意象与亲密'], ['fertility', '生育焦虑与家庭沟通']],
  docs: [['library', '资料库与导入'], ['candidates', '整理草稿与核对'], ['prepare', '就诊准备与导出'], ['trials', '试验线索']]
};
const SUBTITLES = {
  dash: '四点位 + 三张特色状态卡：出血待记录、分子待读（未检测≠阴性）、随访节点；保育 / Lynch / 放疗后私密为条件卡。',
  stage: '从出血到分子：出血日志独立轨道，FIGO 2023 分期与分子三态并列引用；分型判定归医生，本台不自算。',
  treatment: '32 号折叠卡：默认概要，展开五块；手术 / 放疗 / 系统与内分泌分列，计划 vs 实际留痕。',
  fertility: '保育是延迟手术、争取生育时间，不是治愈；选择记录 + 活检节奏 + 妊娠尝试，零方案推荐/零概率预测。',
  lynch: '肿瘤 MMR ≠ 胚系结论；家系第三方信息默认 private + 显式授权；不知情也是合法选择。',
  intimate: '放疗后干燥/性交痛/狭窄是医学问题；默认 private，三出口过滤；只记录医生给的频率。',
  followup: '症状 + 妇科检查为主线；影像/细胞学标「有指征 vs 常规」；加心血管、第二原发癌与体重。',
  chart: '体重 / 出血天数 / 同模态影像测量放回同一段时间；分类节点只画点不连线，跨模态不共轴。',
  mind: '患者与照护者各自记录、并列不平均；身体意象与生育焦虑默认 private。',
  docs: '资料库、候选核对、两区导出（private 默认过滤）、试验线索；线索不是推荐。'
};

/* 13 场景直达（INTERACTION-DESIGN v1：S01–S13） */
const SCENES = [
  ['S01', '分型看不懂', 'stage', 'molecular'],
  ['S02', 'Lynch / 子女要不要查', 'lynch', 'testing'],
  ['S03', '我还想要孩子', 'fertility', 'decision'],
  ['S04', '绝经后又出血', 'stage', 'bleed'],
  ['S05', '分型与化疗', 'stage', 'compare'],
  ['S06', '放疗后私密不适', 'intimate', 'symptoms'],
  ['S07', '复诊准备', 'docs', 'prepare'],
  ['S08', '术后随访节奏', 'followup', 'calendar'],
  ['S09', '影像并列', 'followup', 'imaging'],
  ['S10', '营养与体重', 'followup', 'nutrition'],
  ['S11', '心理与家庭', 'mind', 'feelings'],
  ['S12', '试验线索', 'docs', 'trials'],
  ['S13', '文档导入', 'docs', 'library']
];

/* ---------------- 数据层 ---------------- */
const DATA = window.DEMO_DATA;
const CATALOG = DATA.catalog;
const PROFILES = {};
for (const p of DATA.profiles) PROFILES[p.id] = p;
const TODAY = DATA.meta.today;
const profile = () => PROFILES[state.profileId] || DATA.profiles[0];

const state = {
  page: 'dash', sub: {}, profileId: 'demo1',
  range: 'all', zoom: 100,
  sel: { demo1: ['WEIGHT', 'BLEED_DAYS', 'IMG_MM', 'TX_EVENT'], demo2: ['WEIGHT', 'BLEED_DAYS', 'IMG_MM', 'TX_EVENT'] },
  toggles: { treatment: true, keypoints: true },
  pin: null, flipped: new Set(),
  agent: { open: false, w: 35, draft: null, cand: null },
  cfg: { root: '/Users/demo/Documents/EndoPal（演示）', mineru: true, clinical: false }
};

/* ---------------- 通用 UI ---------------- */
let toastTimer = null;
function toast(t, opts = {}) {
  const el = $('#toast');
  el.innerHTML = `${esc(t)}${opts.back ? '<button class="toast-back" data-action="go" data-page="dash">回看板</button>' : ''}`;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3800);
}
function openModal(title, body, foot = '', eyebrow = '小膜宝 · 交互演示') {
  $('#dialog-eyebrow').textContent = eyebrow;
  $('#dialog-title').textContent = title;
  $('#dialog-body').innerHTML = body;
  $('#dialog-foot').innerHTML = foot || '<button data-action="close">关闭</button>';
  const d = $('#dialog');
  if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
}
function closeModal() {
  const d = $('#dialog');
  if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
}
function navigate(page, sub) {
  state.page = page;
  state.sub[page] = sub || (SUBPAGES[page] ? SUBPAGES[page][0][0] : '');
  const hash = `#${page}${SUBPAGES[page] ? `/${state.sub[page]}` : ''}`;
  if (location.hash !== hash) location.hash = hash; else render();
}
function head(title, desc, action = '') {
  return `<div class="page-head"><div><h1>${esc(title)}</h1><p>${esc(desc)}</p></div><div class="actions"><button class="soft" data-action="ai-draft" data-ai="${stateSubKey()}">AI 协助</button>${action}</div></div>`;
}
function stateSubKey() { return `${state.page}${state.page === 'dash' || state.page === 'chart' ? '' : '/' + (state.sub[state.page] || '')}`; }
function pill(text, kind = '') { return `<span class="pill ${kind}">${esc(text)}</span>`; }
function stateLabel(status) { return ({ detected: '检出', not_detected: '未检出', not_tested: '未检测' })[status] || status; }
function caregiverBadge(author) { return author === 'CAREGIVER' ? '<span class="caregiver-badge">照护者代记</span>' : ''; }
function srcNote(t) { return `<p class="small-note">来源：${esc(t)} · 只照抄，不判读</p>`; }

/* 私密三出口：一个函数收敛，一图秀 / 摘要 / 导出各自调用一次（K2/K6）。 */
function privateFilter(p, outlet) {
  const items = [];
  p.intimate.symptoms.forEach((x) => { if (x.visibility === 'private') items.push({ kind: '放疗后私密症状', d: x.d }); });
  if (p.intimate.dilator.status !== '不适用（未放疗）' && p.intimate.dilator.status !== '未开始（医生尚未给出频率）') items.push({ kind: '扩张器记录', d: '—' });
  p.mind.body.forEach((x) => { if (x.visibility === 'private') items.push({ kind: '身体意象', d: x.d }); });
  p.mind.fertilityAnx.forEach((x) => { if (x.visibility === 'private') items.push({ kind: '生育焦虑', d: x.d }); });
  p.lynch.family.rows.forEach((x) => { if (x.thirdParty && x.visibility === 'private') items.push({ kind: '家系第三方信息', d: `代号 ${x.code}` }); });
  const count = items.length;
  const label = outlet === 'chart' ? '一图秀' : outlet === 'summary' ? '摘要' : '两区导出';
  return { count, label, items, note: `${label}已按三出口过滤：${count} 条私密/第三方记录未包含（放疗后私密、身体意象、生育焦虑、家系第三方）。` };
}

/* ---------------- 序列与一图秀 ---------------- */
function seriesAll(code) {
  const p = profile();
  const m = CATALOG[code];
  if (!m) return [];
  if (m.categorical) return ((p.metrics.qual || {})[code] || []).map((x) => ({ d: x.d, v: x.code, src: '记录', label: x.label }));
  return ((p.metrics.numeric || {})[code] || []).map((x) => ({ d: x.d, v: x.v, src: x.src }));
}
const CW = 980, CH = 432, CX0 = 56, CX1 = 950, CY0 = 96, CY1 = 322, NODE_Y = 356;
function domain() {
  const end = Date.parse(TODAY);
  const months = { '3m': 3, '6m': 6, '12m': 12 }[state.range];
  const start = months ? new Date(new Date(end).setMonth(new Date(end).getMonth() - months)).getTime() : Date.parse(DATA.meta.dataStart);
  const span = end - start;
  const kept = span * state.zoom / 100;
  return [end - kept, end];
}
const inDomain = (d, t0, t1) => { const t = Date.parse(d); return Number.isFinite(t) && t >= t0 && t <= t1; };
const xOf = (t, t0, t1) => CX0 + (t - t0) / Math.max(1, t1 - t0) * (CX1 - CX0);
function smoothPath(coords) { /* 单调三次 Hermite（Fritsch–Carlson）：过点、防过冲、采样间隔不均匀安全（THY 平滑教训，整段继承） */
  if (!coords.length) return '';
  if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;
  const n = coords.length, dx = [], sl = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) {
    dx[i] = coords[i + 1].x - coords[i].x;
    sl[i] = dx[i] === 0 ? 0 : (coords[i + 1].y - coords[i].y) / dx[i];
  }
  m[0] = sl[0]; m[n - 1] = sl[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (sl[i - 1] * sl[i] <= 0) { m[i] = 0; continue; }
    const w1 = 2 * dx[i] + dx[i - 1], w2 = dx[i] + 2 * dx[i - 1];
    m[i] = (w1 + w2) / (w1 / sl[i - 1] + w2 / sl[i]);
  }
  for (let i = 0; i < n - 1; i++) {
    if (sl[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / sl[i], b = m[i + 1] / sl[i], q = a * a + b * b;
    if (q > 9) { const t = 3 / Math.sqrt(q); m[i] = t * a * sl[i]; m[i + 1] = t * b * sl[i]; }
  }
  let d = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C ${(coords[i].x + h).toFixed(1)} ${(coords[i].y + m[i] * h).toFixed(1)}, ${(coords[i + 1].x - h).toFixed(1)} ${(coords[i + 1].y - m[i + 1] * h).toFixed(1)}, ${coords[i + 1].x.toFixed(1)} ${coords[i + 1].y.toFixed(1)}`;
  }
  return d;
}
function seriesFor(code, t0, t1) {
  const m = CATALOG[code];
  const all = seriesAll(code);
  if (!all.length) return { code, m, lo: 0, hi: 1, span: 1, pts: [], all };
  const vals = all.map((p) => p.v);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const span = hi - lo || Math.max(Math.abs(hi) * 0.08, 1);
  return { code, m, lo, hi, span, pts: all.filter((p) => inDomain(p.d, t0, t1)), all };
}
function monthTicks(t0, t1) {
  const out = []; const d = new Date(t0); let cur = new Date(d.getFullYear(), d.getMonth(), 1);
  if (cur.getTime() < t0) cur.setMonth(cur.getMonth() + 1);
  while (cur.getTime() <= t1) {
    const x = xOf(cur.getTime(), t0, t1);
    if (x > CX0 + 6 && x < CX1 - 6) out.push({ x, label: `${String(cur.getFullYear()).slice(2)}-${String(cur.getMonth() + 1).padStart(2, '0')}` });
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }
  const step = out.length > 18 ? 4 : out.length > 8 ? 2 : 1;
  return step === 1 ? out : out.filter((_, i) => i % step === 0);
}
function bandsAll(p) {
  const out = [];
  p.treatment.pathway.forEach((x) => out.push({ label: x.phase.replace(/^[①②③④⑤]\s*/, ''), date: x.d, color: '#8A5B7B' }));
  return out;
}
function chartSVG(t0, t1) {
  const sel = state.sel[state.profileId];
  const numeric = sel.filter((c) => CATALOG[c] && !CATALOG[c].categorical);
  const cats = state.toggles.keypoints ? ['TX_EVENT', 'MOLECULAR_EVENT', 'FOLLOWUP_EVENT'].filter((c) => CATALOG[c]) : [];
  const series = numeric.map((c) => seriesFor(c, t0, t1)).filter((s) => s.pts.length);
  if (!series.length && !cats.length) {
    return `<div class="empty"><h3>这个时间窗里没有所选指标</h3><p>扩大时间范围，或在左侧加选一个指标。</p></div>`;
  }
  const p = profile();
  const bands = state.toggles.treatment ? bandsAll(p).filter((b) => inDomain(b.date, t0, t1)) : [];
  const yOf = (s, v) => CY1 - (v - s.lo) / s.span * (CY1 - CY0);
  const grid = [0, 1, 2, 3, 4].map((i) => { const y = CY0 + i * (CY1 - CY0) / 4; return `<line class="grid" x1="${CX0}" x2="${CX1}" y1="${y}" y2="${y}"/>`; }).join('');
  const ticks = monthTicks(t0, t1).map((m) => `<text class="tick" x="${m.x}" y="${CY1 + 18}" text-anchor="middle">${m.label}</text>`).join('');
  const xAxis = `<line class="axis" x1="${CX0}" x2="${CX1}" y1="${CY1}" y2="${CY1}"/>`;
  const bandEls = bands.map((b) => {
    const x = xOf(Date.parse(b.date), t0, t1);
    return `<line x1="${x}" x2="${x}" y1="${CY0 - 8}" y2="${CY1}" stroke="${b.color}" stroke-width="1.2" stroke-dasharray="3 4" opacity=".55"/>`
      + `<text x="${x + 3}" y="${CY0 - 12}" fill="${b.color}" font-size="9">${esc(b.label)}</text>`;
  }).join('');
  const labelBoxes = [];
  const lineEls = series.map((s) => {
    const pts = s.pts.map((x) => ({ x: xOf(Date.parse(x.d), t0, t1), y: yOf(s, x.v) }));
    const path = smoothPath(pts);
    const dots = pts.map((pt, i) => `<circle class="pt" cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="4.2" fill="${s.m.color}" data-action="pin" data-code="${s.code}" data-date="${esc(s.pts[i].d)}"/>`).join('');
    const last = s.pts[s.pts.length - 1];
    let lx = pts[pts.length - 1].x + 7, ly = pts[pts.length - 1].y - 7;
    /* 末端标签防重叠：同区域已有标签就下移一行（只影响观感，不改数值）。 */
    for (const b of labelBoxes) if (Math.abs(lx - b.x) < 96 && Math.abs(ly - b.y) < 13) ly += 14;
    labelBoxes.push({ x: lx, y: ly });
    const label = `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" fill="${s.m.color}" font-size="10">${esc(s.m.name.split('（')[0])} ${last.v}${esc(s.m.unit)}</text>`;
    return `<path class="line" d="${path}" stroke="${s.m.color}" fill="none"/>${dots}${label}`;
  }).join('');
  const catEls = cats.map((code, idx) => {
    const s = seriesFor(code, t0, t1);
    const y = NODE_Y + idx * 20;
    return s.pts.map((x, i) => {
      const cx = xOf(Date.parse(x.d), t0, t1);
      const ly = y + (i % 2 ? 12 : -7);
      return `<rect x="${(cx - 3.6).toFixed(1)}" y="${y - 3.6}" width="7.2" height="7.2" transform="rotate(45 ${cx.toFixed(1)} ${y})" fill="${s.m.color}" opacity=".9"/>`
        + `<text x="${cx + 7}" y="${ly}" fill="#6B6157" font-size="8.5">${esc(x.label)}</text>`;
    }).join('');
  }).join('');
  const legend = numeric.map((c) => CATALOG[c] && `<span><i style="background:${CATALOG[c].color}"></i>${esc(CATALOG[c].name)} <span class="range">${fmtRange(c)}</span></span>`).join('');
  const catLegend = cats.map((c) => CATALOG[c] ? `<span><i style="background:${CATALOG[c].color};transform:rotate(45deg)"></i>${esc(CATALOG[c].name)}（节点不连线）</span>` : '').join('');
  return `<div class="legend">${legend}${catLegend}</div>
    <div class="chart-wrap"><svg class="chart" viewBox="0 0 ${CW} ${CH}" role="img" aria-label="多指标时间轴：各条线按自身范围缩放，分类节点只画点不连线">
      <text x="${CX0}" y="22" fill="#8A7F71" font-size="10">${esc(profile().name)} · ${new Date(t0).toISOString().slice(0, 10)} → ${new Date(t1).toISOString().slice(0, 10)}</text>
      ${grid}${xAxis}${ticks}${bandEls}${lineEls}${catEls}
      <text x="${CX1}" y="${CH - 6}" text-anchor="end" fill="#A6B0A7" font-size="9">各条线按自身范围缩放，不代表不同指标数值可比；分类节点只画点不连线</text>
      <text x="${CX0}" y="${NODE_Y + 34}" fill="#A6B0A7" font-size="9">节点轨道：治疗 / 分子结果 / 随访（只画点）</text>
    </svg></div>`;
}
function fmtRange(code) {
  const s = seriesAll(code);
  if (!s.length) return '';
  const vals = s.map((x) => x.v);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const m = CATALOG[code];
  return `${lo}–${hi} ${m.unit}`.trim();
}
function metricCard(code) {
  const m = CATALOG[code];
  const all = seriesAll(code);
  if (m.categorical) {
    const last = all[all.length - 1];
    return `<button class="mcard" data-action="flip" data-code="${code}" aria-pressed="${state.flipped.has(code)}" aria-label="${esc(m.name)}：翻面看口径"><span class="mcard-inner"><span class="mface front"><span class="cat"><i style="background:${m.color}"></i>${esc(m.cat)}</span><span class="name">${esc(m.name)}</span><span class="val">${last ? esc(last.label) : '—'}</span><span class="rec">${last ? esc(last.d) : '暂无记录'} · 只画节点</span></span><span class="mface back"><span class="name">${esc(m.name)} · 口径</span><span class="count">${esc(m.note)}</span><span class="foot">节点是记录事实，不是趋势结论。</span></span></span></button>`;
  }
  const last = all[all.length - 1];
  const prev = all[all.length - 2];
  const delta = last && prev ? (last.v - prev.v) : null;
  const vals = all.slice(-8).map((x) => x.v);
  const mn = Math.min(...vals), mx = Math.max(...vals);
  const pts = vals.map((v, i) => ({ x: 4 + i * (92 / Math.max(1, vals.length - 1)), y: 34 - (v - mn) / Math.max(0.0001, mx - mn) * 26 }));
  const spark = pts.length > 1 ? `<svg class="spark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path class="sp-line" d="${smoothPath(pts)}" stroke="${m.color}" fill="none"/><circle class="sp-dot" cx="${pts[pts.length - 1].x}" cy="${pts[pts.length - 1].y}" r="2.6" fill="${m.color}"/></svg>` : '<div class="na small-note">仅 1 个点，不画趋势线。</div>';
  return `<button class="mcard" data-action="flip" data-code="${code}" aria-pressed="${state.flipped.has(code)}" aria-label="${esc(m.name)}：翻面看口径">
    <span class="mcard-inner"><span class="mface front"><span class="cat"><i style="background:${m.color}"></i>${esc(m.cat)}</span><span class="name">${esc(m.name)}</span><span class="val">${last ? last.v : '—'}<small>${esc(m.unit)}</small></span><span class="delta">${delta === null ? '—' : `${delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} <em>${Math.abs(delta).toFixed(m.dec)}</em> ${esc(m.unit)}（与上次）`}</span>${spark}<span class="rec">${last ? esc(last.d) : '暂无记录'} · ${all.length} 个点</span></span>
    <span class="mface back"><span class="name">${esc(m.name)} · 口径</span><span class="count">${esc(m.note)}</span><span class="foot">点开后不改变数据；口径卡请与复诊时带给医生。</span></span></span></button>`;
}

/* ---------------- AI 协助 ---------------- */
const AI_DEMOS = {
  dash: { prompt: '帮我把这半年的出血、治疗和随访排成一段话，复诊时照着说。', cand: { title: '复诊摘要候选（演示）', fields: [['出血', '绝经后出血 3 次（04-28 → 05-18）'], ['治疗', '手术 06-11 · VBT 3 次'], ['随访', '下次节点按医生记录']], src: '看板摘要（演示）' } },
  stage: { prompt: '帮我把病理、分期与分子结果整理成清单，只引用原文。', cand: { title: '分型与分期候选（演示）', fields: [['病理', '内膜样 G2（原文）'], ['分期', 'FIGO 2023 版本链'], ['口径', '判定归医生']], src: '我的分型与分期（演示）' } },
  'stage/bleed': { prompt: '帮我把 3 次出血按时间排好，只写我当时怎么描述。', cand: { title: '出血时间线候选（演示）', fields: [['次数', '3 条'], ['量', '少量→中等→少量'], ['口径', '只记录，不判病因']], src: '出血日志（演示）' } },
  'stage/molecular': { prompt: '帮我把 MMR、p53、POLE 三个结果各解释成一句大白话，并标出哪项没检测。', cand: { title: '术语解释候选（演示）', fields: [['MMR', 'pMMR（未检出缺失）'], ['p53', '野生型表达'], ['POLE', '未检测（≠阴性）']], src: '分子三态（演示）' } },
  'stage/compare': { prompt: '帮我把指南原文按四型分开列，不要写成建议。', cand: { title: '对照表候选（演示）', fields: [['列', '指南原文 / 中国获批 / 医保'], ['口径', '只引用，不合成建议'], ['来源', 'NCCN / ESGO']], src: '分型与治疗对照（演示）' } },
  treatment: { prompt: '帮我把手术、放疗和随访三个阶段整理成一张表，计划 vs 实际分开。', cand: { title: '治疗阶段候选（演示）', fields: [['阶段', '手术 / VBT / 随访'], ['五块', '方案/指标/影像/副作用/支持'], ['口径', '不评疗效']], src: '治疗路径（演示）' } },
  'treatment/pathway': { prompt: '帮我把手术、放疗和随访三个阶段整理成一张表，计划 vs 实际分开。', cand: { title: '治疗阶段候选（演示）', fields: [['阶段', '手术 / VBT / 随访'], ['五块', '方案/指标/影像/副作用/支持'], ['口径', '不评疗效']], src: '治疗路径（演示）' } },
  fertility: { prompt: '帮我把保育这条线的活检、用药和尝试怀孕按时间排好，不要给方案。', cand: { title: '保育时间线候选（演示）', fields: [['活检', '05-06 / 08-05'], ['用药', '孕激素 + LNG-IUD'], ['口径', '零推荐 / 零概率预测']], src: '保育治疗（演示）' } },
  'fertility/decision': { prompt: '帮我把医生告知我的保育风险整理成清单，不添加建议。', cand: { title: '知情记录候选（演示）', fields: [['告知', '非治愈 / 需随访 / 需切除子宫'], ['选择', '本人选择保育'], ['口径', '选择由本人做']], src: '保育决策档案（演示）' } },
  lynch: { prompt: '帮我把肿瘤 MMR 结果和胚系检测状态分开列，不要劝我做检测。', cand: { title: 'Lynch 记录候选（演示）', fields: [['肿瘤', 'PMS2 缺失'], ['胚系', '未提供'], ['口径', '不知情也是合法选择']], src: 'Lynch 与家系（演示）' } },
  'lynch/family': { prompt: '帮我把家系记录整理成代号清单，不要出现姓名。', cand: { title: '家系清单候选（演示）', fields: [['亲属 A', '母亲 · 子宫内膜癌'], ['亲属 B', '妹妹 · 结直肠癌'], ['可见性', 'private + 授权']], src: '家系记录（演示）' } },
  intimate: { prompt: '帮我把想问医生的私密问题整理成清单，不要带具体评分。', cand: { title: '私密问题候选（演示）', fields: [['问题 1', '干燥/性交痛的处理'], ['问题 2', '扩张器什么时候开始'], ['口径', '默认 private']], src: '放疗后私密（演示）' } },
  'intimate/symptoms': { prompt: '帮我把想问医生的私密问题整理成清单，不要带具体评分。', cand: { title: '私密问题候选（演示）', fields: [['问题 1', '干燥/性交痛的处理'], ['问题 2', '扩张器什么时候开始'], ['口径', '默认 private']], src: '私密症状（演示）' } },
  followup: { prompt: '帮我把随访节点和下次该带什么分开列，不要合成一个总复查。', cand: { title: '随访准备候选（演示）', fields: [['节点', '起点 + k×间隔'], ['影像', '标有指征/常规'], ['口径', '不生成总复查']], src: '随访日历（演示）' } },
  'followup/calendar': { prompt: '帮我把随访节点和下次该带什么分开列，不要合成一个总复查。', cand: { title: '随访准备候选（演示）', fields: [['节点', '起点 + k×间隔'], ['影像', '标有指征/常规'], ['口径', '不生成总复查']], src: '随访日历（演示）' } },
  chart: { prompt: '把最近 6 个月的体重、出血天数和内膜厚度变化讲一段，标注哪些是不同指标。', cand: { title: '时段摘要候选（演示）', fields: [['时段', '2026-04-24 → 2026-10-24'], ['体重', '67.0 kg（原文）'], ['口径', '各线自身缩放，不可比']], src: '病情一图秀（演示）' } },
  mind: { prompt: '帮我记一条我自己的感受：复查前一周睡不着。', cand: { title: '感受候选（演示 · 默认私密）', fields: [['内容', '复查前一周睡不着'], ['记录人', '本人'], ['可见性', 'private']], src: '当下感受（演示）' } },
  'mind/feelings': { prompt: '帮我记一条我自己的感受：复查前一周睡不着。', cand: { title: '感受候选（演示 · 默认私密）', fields: [['内容', '复查前一周睡不着'], ['记录人', '本人'], ['可见性', 'private']], src: '当下感受（演示）' } },
  docs: { prompt: '帮我把复诊要问的几条整理成疑问清单。', cand: { title: '疑问清单候选（演示）', fields: [['问题 1', 'POLE 要不要补测'], ['问题 2', '私密不适的处理'], ['来源', '就诊准备']], src: '就诊准备（演示）' } },
  'docs/prepare': { prompt: '帮我把复诊要问的几条整理成疑问清单。', cand: { title: '疑问清单候选（演示）', fields: [['问题 1', 'POLE 要不要补测'], ['问题 2', '私密不适的处理'], ['来源', '就诊准备']], src: '就诊准备（演示）' } }
};
function aiPromptWithCtx(key) {
  const base = AI_DEMOS[key]?.prompt || '请基于我的记录给出整理建议。';
  const p = profile();
  const ctx = [];
  try {
    ctx.push(`档案：${p.name}，${p.age} 岁，${p.diagnosisShort}`);
    ctx.push(`分期/分子：${p.stageLine}`);
    if (key.startsWith('stage/bleed')) ctx.push(`出血：${p.bleeding.rows.length} 条（最近 ${p.bleeding.rows[p.bleeding.rows.length - 1].d}）；只记录不判病因`);
    if (key.startsWith('stage/molecular')) {
      const m = p.molecular.markers.map((x) => `${x.marker}=${stateLabel(x.result)}`).join('；');
      ctx.push(`分子三态：${m}；未检测≠阴性`);
    }
    if (key.startsWith('stage/compare')) ctx.push('对照表只引用指南原文，不合成建议');
    if (key.startsWith('treatment')) ctx.push(`治疗阶段：${p.treatment.pathway.map((x) => `${x.phase} ${x.d}`).join('；')}；折叠卡五块齐全`);
    if (key.startsWith('fertility')) ctx.push(`保育：${p.fertility.applicable ? '在治疗中；零方案推荐/零概率预测' : '不适用'}`);
    if (key.startsWith('lynch')) ctx.push('Lynch：肿瘤 MMR 与胚系分开；家系记录为第三方私密（已按三出口过滤，不带条数与内容）；尊重不知情权');
    if (key.startsWith('intimate')) ctx.push('放疗后私密默认 private，三出口过滤；只记录医生给的频率');
    if (key.startsWith('followup')) ctx.push(`随访节点：${p.followup.nodes.slice(0, 3).join(' / ')}（起点 + k×间隔）；影像标有指征/常规`);
    if (key === 'chart') ctx.push('一图秀：各线按自身范围缩放，不可比；分类节点不连线');
    if (key.startsWith('mind')) ctx.push('感受记录默认 private；患者/照护者并列不平均');
    if (key.startsWith('docs')) ctx.push(`待问 ${p.docs.questions.length} 条；候选 ${p.docs.candidates.length} 条待核对`);
  } catch { /* 上下文取不到就只发提示词本身 */ }
  ctx.push('以上来自本机记录（演示数据），判断由我和治疗团队做。');
  return `${base}\n\n${ctx.join('\n')}`;
}

/* ---------------- state → 渲染分派 ---------------- */
function subnav(page) {
  const subs = SUBPAGES[page];
  if (!subs) return '';
  const cur = state.sub[page] || subs[0][0];
  return `<div class="subnav" role="tablist" aria-label="二级页签">${subs.map(([k, label]) => `<button role="tab" data-action="sub" data-sub="${k}" aria-selected="${cur === k}">${esc(label)}</button>`).join('')}</div>`;
}
function renderNav() {
  $('#nav').innerHTML = PAGES.map(([k, label, ic]) => `<button class="nav-button" data-action="go" data-page="${k}" aria-current="${state.page === k ? 'page' : 'false'}">${icon(ic)}<span>${esc(label)}</span></button>`).join('');
}
function render() {
  const p = profile();
  $('#profile-name').textContent = `${p.name.replace('（演示）', '')}的资料`;
  $('#profile-meta').textContent = `${p.age} 岁 · ${p.diagnosisShort}`;
  $('#profile-avatar').textContent = p.name.slice(0, 1);
  const subs = SUBPAGES[state.page];
  const sub = state.sub[state.page] || (subs ? subs[0][0] : '');
  $('#breadcrumb').textContent = state.page === 'dash' ? '看板' : (PAGES.find((x) => x[0] === state.page)?.[1] || '') + (subs ? ' · ' + (subs.find((x) => x[0] === sub)?.[1] || '') : '');
  const fn = RENDERERS[`${state.page}/${sub}`] || RENDERERS[`${state.page}/`] || pageDash;
  const nextIdx = subs ? subs.findIndex((x) => x[0] === sub) : -1;
  const next = subs && nextIdx >= 0 && nextIdx < subs.length - 1 ? `<div class="actions" style="margin-top:18px"><button class="soft" data-action="go" data-page="${state.page}" data-sub="${subs[nextIdx + 1][0]}">下一页：${esc(subs[nextIdx + 1][1])} →</button></div>` : '';
  $('#main').innerHTML = `<div class="page-enter">${state.page === 'dash' ? '' : '<div class="back-row"><button class="text-button" data-action="go" data-page="dash">← 回看板</button></div>'}${subnav(state.page)}${fn()}${next}</div>`;
  /* HVT X2：页内导航都带 data-step（不含回看板与顶栏），供探针逐站走查。 */
  $$('#main [data-action="go"]').forEach((b) => {
    if (!b.dataset.step && b.dataset.page && b.dataset.page !== 'dash') b.dataset.step = `${b.dataset.page}-${b.dataset.sub || ''}`;
  });
  renderNav();
  setAgent(state.agent.open);
  document.body.setAttribute('data-booted', '1');
  window.scrollTo(0, 0);
}
function renderAgent() {
  if (!state.agent.open) return;
  const cand = state.agent.cand;
  const candHtml = cand ? `<div class="agent-cand"><b>候选 · 待核对</b><div class="cand-title">${esc(cand.title)}</div><ul>${cand.fields.map(([k, v]) => `<li><span>${esc(k)}</span><b>${esc(v)}</b></li>`).join('')}</ul><small>来源：${esc(cand.src)} · 确认前不进事实层</small><div class="actions"><button class="primary" data-action="cand-ok">确认入库</button><button data-action="cand-fix">逐项修改</button><button data-action="cand-reject">拒收</button></div></div>` : '';
  $('#agent-pane').innerHTML = `<div class="agent-head"><span id="agent-label" class="agent-label">AI 对话 · 演示</span><button id="agent-hide" class="icon-button" data-action="agent-hide" aria-label="收起 AI 对话">×</button></div>
    <div class="agent-body"><div class="notice plain">演示面板：未接入真实 AI，不会发送；真实版本走宿主接口。私密内容默认不进上下文。</div>
    <div class="agent-msg user"><b>本页提示词（已带病情上下文）</b><p>${esc(state.agent.draft ? aiPromptWithCtx(state.agent.draft) : '点页面上的「AI 协助」按钮，会把本页病情上下文一起填入。')}</p></div>
    <div class="agent-msg bot"><b>演示回复（未接通）</b><p>真实版本会基于已核对记录生成候选；本原型只展示候选核对闭环。</p></div>${candHtml}</div>
    <div class="agent-foot"><input placeholder="演示：未接入，输入不可用" disabled aria-label="演示输入框，未接入"></div>`;
}
function setAgent(open) {
  state.agent.open = !!open;
  const pane = $('#agent-pane'); const sp = $('#agent-splitter'); const btn = $('#agent-toggle');
  pane.hidden = !open; sp.hidden = !open;
  btn.setAttribute('aria-expanded', String(!!open));
  btn.textContent = open ? '收起 AI 对话' : 'AI 对话';
  /* 30 号规则 0：量的是业务区宽度。面板打开后业务区只剩 ~65%，用 body 状态触发窄宽布局。 */
  document.body.classList.toggle('agent-open', !!open);
  document.documentElement.style.setProperty('--agent-w', `${state.agent.w}%`);
  if (open) renderAgent();
}
function clampAgentW(w) { return Math.min(45, Math.max(25, w)); }
function agentResize(delta) {
  state.agent.w = clampAgentW(state.agent.w + delta);
  document.documentElement.style.setProperty('--agent-w', `${state.agent.w}%`);
  const sp = $('#agent-splitter');
  if (sp) sp.setAttribute('aria-valuenow', String(Math.round(state.agent.w)));
}

/* =====================================================================
   看板
   ===================================================================== */
function pageDash() {
  const p = profile();
  const bleed = p.bleeding.rows;
  const lastBleed = bleed[bleed.length - 1];
  const pf = privateFilter(p, 'summary');
  const tasks = [
    ['记一次出血', '频率 / 量 / 诱因，只记录', 'stage', 'bleed', '＋'],
    ['看我的分型与分子', 'MMR / p53 / POLE 三态', 'stage', 'molecular', '◈'],
    ['治疗走到哪一步', '折叠卡：默认概要', 'treatment', 'pathway', '▤'],
    ['下次随访节点', '起点 + k×间隔', 'followup', 'calendar', '▦'],
    ['代记一条变化', '照护者代记入口', 'stage', 'bleed', '✎'],
    ['私密记录（只给自己看）', '默认 private', 'intimate', 'symptoms', '◐'],
    ['复诊材料清单', '两区导出 private 过滤', 'docs', 'prepare', '⇩'],
    ['Lynch / 家系', '不劝检测，尊重不知情', 'lynch', 'testing', '◇']
  ];
  const patientTasks = tasks.slice(0, 4).map(taskEntry).join('');
  const careTasks = tasks.slice(4).map(taskEntry).join('');
  const chips = SCENES.map(([id, label]) => `<button class="scene-chip" data-action="scene" data-scene="${id}">${id} ${esc(label)}</button>`).join('');
  const metricCards = p.dashKeys.map(metricCard).join('');
  const condCards = [];
  if (p.fertility.applicable) condCards.push(`<button class="task-entry" data-action="go" data-page="fertility" data-sub="decision"><span class="entry-icon">✿</span><b>保育治疗中</b><span>活检 ${p.fertility.progestin.biopsyInterval} 个月/次 · 只看记录</span><span class="arrow">›</span></button>`);
  if (p.intimate.symptoms.length) condCards.push(`<button class="task-entry" data-action="go" data-page="intimate" data-sub="symptoms"><span class="entry-icon">◐</span><b>放疗后私密记录</b><span>${p.intimate.symptoms.length} 条 · private</span><span class="arrow">›</span></button>`);
  if (!p.meta.lynchScreened || p.lynch.family.rows.length) condCards.push(`<button class="task-entry" data-action="go" data-page="lynch" data-sub="testing"><span class="entry-icon">◇</span><b>Lynch 与家系</b><span>${p.lynch.testing.status}</span><span class="arrow">›</span></button>`);
  return `${head('看板', '把今天能做的一件事放在最前面；出血、分型、治疗与随访都从这里出发。')}
  <div class="stage-strip"><span class="eyebrow">当前阶段</span><b>${esc(p.stageLine)}</b><small>只引用医生与病理原文 · 本台不自算</small></div>
  <div class="duo">
    <div class="duo-col"><span class="duo-tag"><i></i>本人入口 · ${esc(p.name)}</span><div class="task-grid">${patientTasks}</div></div>
    <div class="duo-col care"><span class="duo-tag"><i></i>${esc(p.caregiverLabel)} · 代记入口</span><div class="task-grid">${careTasks}</div></div>
  </div>
  <div class="change-strip">
    <div class="chg"><span>出血日志</span><b>${lastBleed ? `${esc(lastBleed.d)} · ${esc(lastBleed.volume)}` : '暂无记录'}</b><p>${esc(p.bleeding.status)} · 只记录不判病因</p></div>
    <div class="chg"><span>分子结果待读</span><b>${p.molecular.markers.map((m) => `${m.marker.replace(/（.*/, '')} ${stateLabel(m.result)}`).join(' · ')}</b><p>未检测 ≠ 阴性；分型判定归医生</p></div>
    <div class="chg"><span>随访节点</span><b>下一次 ${esc(p.followup.nodes[1] || p.followup.nodes[0])} 前后</b><p>起点 + k×间隔；不生成「下次总复查」</p></div>
    <div class="actions"><button class="soft" data-action="go" data-page="stage" data-sub="bleed">去记录</button></div>
  </div>
  ${condCards.length ? `<div class="task-grid" style="margin-bottom:13px">${condCards.join('')}</div>` : ''}
  <div class="scene-strip"><span class="lab">13 场景直达</span>${chips}</div>
  <div class="notice blue"><b>本页常驻口径：</b>未检测 ≠ 阴性；分型与分期只并列引用，判定归医生；私密记录默认不进一图秀 / 摘要 / 导出；Lynch 尊重不知情权；保育不以活产为唯一成功标准。</div>
  <div class="section-title"><div><h2>最近指标</h2><p>点卡片翻面看口径；数值只照抄记录。</p></div><button class="text-button" data-action="go" data-page="chart">打开一图秀 →</button></div>
  <div class="metric-grid">${metricCards}</div>
  <div class="notice plain" style="margin-top:14px">${esc(pf.note)} 需要带入 AI 时逐条显式勾选。</div>`;
}
function taskEntry(t) {
  return `<button class="task-entry" data-action="go" data-page="${t[2]}" data-sub="${t[3]}"><span class="entry-icon">${t[4]}</span><b>${esc(t[0])}</b><span>${esc(t[1])}</span><span class="arrow">›</span></button>`;
}

/* =====================================================================
   线 2 · 我的分型与分期（6 页签）
   ===================================================================== */
function pageBleed() {
  const p = profile();
  const b = p.bleeding;
  const rows = b.rows.map((x) => `<tr><td class="mono"><b>${esc(x.d)}</b><span class="author">${esc(x.source)}</span></td><td>${esc(x.menopause)}</td><td>${esc(x.pattern)}</td><td>${esc(x.volume)}</td><td class="mono">${x.days} 天</td><td>${esc(x.clots)}</td><td>${esc(x.discharge)}</td><td>${esc(x.trigger)}</td><td>${esc(x.author === 'CAREGIVER' ? '照护者' : '本人')}</td></tr>`).join('');
  return `${head('出血日志', '独立数据轨道：绝经状态、模式、量、持续天数、血块、排液、诱因、来源；只记录不判病因。', '<button class="primary" data-action="bleed-add">＋ 记一次出血</button>')}
  <div class="notice">${esc(b.intro)}</div>
  <div class="bleed-sum"><span>共 ${b.rows.length} 条</span><span>${esc(b.status)}</span><span>独立轨道：不与通用事件混表</span></div>
  <div class="table-wrap"><table class="bleed-table"><thead><tr><th>日期 / 来源</th><th>绝经状态</th><th>模式</th><th>量</th><th>持续</th><th>血块</th><th>排液</th><th>诱因</th><th>记录人</th></tr></thead><tbody>${rows}</tbody></table></div><div class="scroll-hint">左右滑动查看表格</div>
  <div class="notice warn" style="margin-top:12px">${esc(b.note)}</div>`;
}
function pageExam() {
  const p = profile();
  return `${head('检查与活检', 'TVS / MRI 的内膜厚度带单位与测量口径；取样方式、是否足够、疼痛自评；记录「厚度正常≠没事」。')}
  <div class="notice plain">${esc(p.exam.note)}</div>
  <div class="card">${p.exam.rows.map((x) => `<div class="row" style="padding:10px 0;border-bottom:1px dashed var(--line)"><div class="card-head"><div><b>${esc(x.d)} · ${esc(x.kind)}</b><p>${esc(x.thickness)}${x.thickness !== '—' ? ' · ' + esc(x.caliber) : ''}${x.limit !== '—' ? ' · 局限：' + esc(x.limit) : ''}</p></div>${pill(x.sufficient === '足够' || x.sufficient === '足够（病理报告注明）' ? '取材足够' : '记录', x.sufficient && x.sufficient.startsWith('足够') ? 'green' : 'grey')}</div><div class="stage-quote">${esc(x.quote)}</div><p class="small-note" style="margin-top:6px">取样：${esc(x.sample)} · 疼痛自评：${esc(x.pain)}</p></div>`).join('')}</div>
  <div class="notice warn" style="margin-top:12px">厚度正常不等于没事；是否需要进一步检查由医生判断。本页不判读影像。</div>`;
}
function pagePath() {
  const p = profile();
  return `${head('病理与分级', 'WHO 2020 类型、FIGO 分级、肌层浸润、LVSI、宫颈间质/附件/浆膜/腹膜/淋巴结；逐项带报告原文与日期。')}
  <div class="notice plain">${esc(p.pathology.note)}</div>
  <div class="card">${p.pathology.rows.map((x) => `<div style="padding:9px 0;border-bottom:1px dashed var(--line)"><div class="card-head"><div><b>${esc(x.item)}</b><p>${esc(x.value)}</p></div>${pill(x.d === '—' ? '未做' : '原文', x.d === '—' ? 'dashed' : 'blue')}</div><div class="stage-quote">${esc(x.quote)}</div><p class="small-note" style="margin-top:4px">报告日期：${esc(x.d)}</p></div>`).join('')}</div>
  <div class="notice blue" style="margin-top:12px">${esc(p.pathology.typeNote)}</div>`;
}
function pageFigo() {
  const p = profile();
  return `${head('分期档案（FIGO 2023）', '解剖期 + 最终标签 + 依据原文 + 日期 + 是否因分子改期；版本链留旧分期，不自算、不判定。')}
  <div class="notice warn"><b>分期是动态的。</b>${esc(p.stage.note)}</div>
  <div class="card">${p.stage.versions.map((x) => `<div class="stage-ver"><div class="sv-d">${esc(x.d)}</div><div class="sv-main"><div class="sv-label">${esc(x.finalLabel)}</div><div class="sv-basis">解剖期：${esc(x.anatomical)}${x.marker !== '—' ? ' · 分子标签：' + esc(x.marker) : ''}<br>依据：${esc(x.basis)}</div><div class="sv-tags">${pill(x.current ? '当前版本' : '历史版本', x.current ? 'green' : 'grey')}${pill('分子改期：' + ({ up: '有（记录为变）', down: '有（记录为变）', none: '无', unknown: '未知' })[x.change], x.change === 'none' ? 'blue' : 'yellow')}</div></div></div>`).join('')}</div>
  <div class="notice plain" style="margin-top:12px">${esc(p.stage.stageNote)} <b>分型与分期的判定归医生</b>；期别后面多出的「m」表示分子标签，不是你多了一个病。</div>
  <div class="actions" style="margin-top:12px"><button class="soft" data-action="go" data-page="stage" data-sub="molecular">看分子三态 →</button></div>`;
}
function pageMolecular() {
  const p = profile();
  const cards = p.molecular.markers.map((m) => `<div class="mol-card ${m.result === 'not_tested' ? 'notested' : ''}"><div class="mol-head"><b>${esc(m.marker)}</b>${pill(stateLabel(m.result), m.result === 'detected' ? 'orange' : m.result === 'not_detected' ? 'green' : 'dashed')}</div><div class="val">${esc(m.value)}</div><p>${esc(m.explain)}</p><div class="mol-meta">${m.d ? `检测日期 ${esc(m.d)} · 方法 ${esc(m.method)} · 标本 ${esc(m.specimen)}` : '没有检测日期与报告原文'} · 未检测 ≠ 阴性</div></div>`).join('');
  return `${head('分子三态（MMR·p53·POLE）', '检出 / 未检出 / 未检测三态并列；未检测不等于阴性；不写具体比例，不做分型判定。')}
  <div class="notice warn"><b>本页最重要的一句：</b>未检测 ≠ 阴性。报告里没有的项目按「未检测」记，不能当作「没有」。</div>
  <div class="mol-grid">${cards}</div>
  <div class="notice" style="margin-top:13px">${esc(p.molecular.note)}</div>
  <div class="card" style="margin-top:12px"><div class="card-head"><div><h2>检测层面状态</h2><p>检查层面的状态与标记层面的结果分开记。</p></div>${pill('只记录', 'blue')}</div><p style="font-size:11.5px">${esc(p.molecular.testsStatus)}</p><p class="small-note" style="margin-top:6px">${esc(p.molecular.multiple)}</p></div>
  <div class="notice blue" style="margin-top:12px"><b>分型判定归医生</b>：POLE 超突变、p53 异常模式、MMR 缺失都只是标签；它们说明什么、要不要改治疗，由治疗团队判断。</div>
  <div class="actions" style="margin-top:12px"><button class="soft" data-action="go" data-page="stage" data-sub="compare">看分型与治疗对照（只引用） →</button></div>`;
}
function pageCompare() {
  const p = profile();
  const c = p.compare;
  return `${head('分型与治疗对照', '四型 × 指南原文 / 中国获批 / 医保可及三列分开；只列「谁说了什么」，不合成「该用什么药」。')}
  <div class="notice warn">${esc(c.note)}</div>
  <div class="table-wrap"><table class="ref-table"><thead><tr>${c.cols.map((x) => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${c.rows.map((r) => `<tr><td><b>${esc(r.ctx)}</b></td><td>${esc(r.guideline)}</td><td>${esc(r.china)}</td><td>${esc(r.insurance)}</td><td>${esc(r.source)}<br><span class="small-note">${esc(r.date)}</span></td></tr>`).join('')}</tbody></table></div><div class="scroll-hint">左右滑动查看表格</div>
  <p class="ref-note">NMPA 未取到官方原文的逐项标「待核验」；本页没有「推荐等级」「应该用」字段。解释不是判断，具体方案请与医生讨论。</p>`;
}

/* =====================================================================
   线 3 · 治疗与决策（4 页签）
   ===================================================================== */
function pagePathway() {
  const p = profile();
  const t = p.treatment;
  const fold = (x) => `<details class="phase-fold">
      <summary>
        <span class="tl-dot"></span>
        <b class="ph-name">${esc(x.phase)}</b>
        <span class="ph-date">${esc(x.d)}</span>
        <span class="ph-brief">${esc(x.text)}</span>
        <span class="ph-hint">展开细节</span>
      </summary>
      <div class="phase-detail">
        ${[['方案', x.detail?.regimen], ['指标和趋势', x.detail?.metrics], ['影像发现', x.detail?.imaging], ['副作用总结', x.detail?.ae], ['心理与营养措施及效果', x.detail?.support]]
          .map(([title, blk]) => blk ? `<section class="pd-block"><h4>${title}</h4>
            <p class="pd-summary">${esc(blk.summary || '')}</p>
            ${(blk.items || []).map(([k, v]) => `<div class="pd-row"><em>${esc(k)}</em><span>${esc(v)}</span></div>`).join('')}
          </section>` : `<section class="pd-block"><h4>${title}</h4><p class="pd-summary">无（本阶段没有这一项记录）</p></section>`).join('')}
      </div>
    </details>`;
  return `${head('治疗路径（32 号折叠卡）', '默认只显「阶段 · 日期 · 一句话概要」；展开固定五块：方案 / 指标和趋势 / 影像发现 / 副作用总结 / 心理与营养措施及效果。')}
  <div class="notice blue"><b>五块齐全：</b>方案 · 指标和趋势 · 影像发现 · 副作用总结 · 心理与营养措施及效果（缺一块算违规；无内容写「无 + 说明」）。默认全部收起，打印时全部展开。</div>
  <div class="fold-line" style="margin-top:12px">${t.pathway.map(fold).join('')}</div>
  <p class="fold-note">${esc(t.note)}</p>
  <div class="section-title"><div><h2>计划 vs 实际</h2><p>日期差只并列，不做依从性评判。</p></div></div>
  <div class="table-wrap"><table><thead><tr><th>项目</th><th>计划（医生原文）</th><th>实际（记录）</th></tr></thead><tbody>${t.planVsActual.map((x) => `<tr><td><b>${esc(x.item)}</b></td><td>${esc(x.plan)}</td><td>${esc(x.actual)}</td></tr>`).join('')}</tbody></table></div><div class="scroll-hint">左右滑动查看表格</div>
  <div class="actions" style="margin-top:12px"><button class="soft" data-action="go" data-page="treatment" data-sub="surgery">看手术记录 →</button></div>`;
}
function pageSurgery() {
  const p = profile();
  const s = p.treatment.surgery;
  return `${head('手术记录', 'TH+BSO / 根治性子宫切除 / 减瘤；微创 vs 开腹；SLN vs 清扫；保留卵巢理由；切净程度与并发症；术式独立字段。')}
  <div class="card"><div class="card-head"><div><h2>${esc(s.title)}</h2><p>${esc(s.d)} · ${esc(s.hospital)}</p></div>${pill(s.stay, 'grey')}</div><div class="stage-quote">${esc(s.quote)}</div><div class="ls-meta" style="display:flex;gap:14px;flex-wrap:wrap;margin-top:9px"><span><em class="small-note">切缘</em><br><b style="font-size:11.5px">${esc(s.margins)}</b></span><span><em class="small-note">住院</em><br><b style="font-size:11.5px">${esc(s.stay)}</b></span></div><p class="small-note" style="margin-top:9px">${esc(s.impact)}</p></div>
  <div class="notice plain" style="margin-top:12px">手术相关的不适与康复节奏由医生安排；本页只记录事实，不给康复处方。</div>`;
}
function pageRt() {
  const p = profile();
  const r = p.treatment.rt;
  return `${head('放疗记录（EBRT/VBT）', '外照射与近距离放疗分列，各自剂量/次数/起止/技术；禁「总剂量」合成列；记录医生原文与机构。')}
  <div class="grid two">
    <div class="card"><div class="card-head"><div><h2>体外照射（EBRT）</h2><p>${r.ebrt.used ? '已做' : '未做'}</p></div>${pill(r.ebrt.used ? '已做' : '未做', r.ebrt.used ? 'green' : 'grey')}</div><p style="font-size:11.5px">${esc(r.ebrt.note)}</p></div>
    <div class="card"><div class="card-head"><div><h2>阴道残端近距离放疗（VBT）</h2><p>${r.vbt.used ? '已做' : '未做'}</p></div>${pill(r.vbt.used ? '已做' : '未做', r.vbt.used ? 'green' : 'grey')}</div>${r.vbt.used ? `<p style="font-size:11.5px;line-height:1.7">技术：${esc(r.vbt.technique)}<br>次数与剂量：${esc(r.vbt.doses)}<br>起止：${esc(r.vbt.start)} → ${esc(r.vbt.end)}<br>机构：${esc(r.vbt.institution)}</p><div class="stage-quote" style="margin-top:8px">${esc(r.vbt.quote)}</div>` : `<p style="font-size:11.5px">${esc(r.vbt.note)}</p>`}</div>
  </div>
  <div class="notice warn" style="margin-top:12px">EBRT 与 VBT 不合成「总剂量」；医生原文未写具体 Gy 的，本台不补、不换算。</div>
  <div class="notice plain" style="margin-top:10px">${esc(r.vbt.note)}</div>`;
}
function pageSystemic() {
  const p = profile();
  const s = p.treatment.systemic;
  if (!s.used) {
    return `${head('系统与内分泌治疗', '化疗 / 免疫 / 孕激素与内分泌；方案、周期、计划 vs 实际与停药原因留痕；不评疗效、不判进展。')}
    <div class="empty"><h3>本档案没有系统或内分泌治疗记录</h3><p>如以后出现，方案、周期、计划 vs 实际与停药原因会逐条记录；不评疗效、不判进展。</p></div>
    <div class="notice" style="margin-top:12px">${esc(s.note)}</div>`;
  }
  const rows = s.cycles.map((c) => `<tr><td class="mono">第 ${c.n} 次</td><td class="mono">${esc(c.d)}</td><td>${pill(esc(c.status), c.status === '开始' ? 'orange' : 'green')}</td><td class="small-note">${esc(c.text)}</td></tr>`).join('');
  return `${head('系统与内分泌治疗', '化疗 / 免疫 / 孕激素与内分泌；方案、周期、计划 vs 实际与停药原因留痕；不评疗效、不判进展。', '<button class="primary" data-action="cycle-add">＋ 登记一次治疗</button>')}
  <div class="notice plain">${esc(s.note)}</div>
  <div class="table-wrap"><table class="cycle-table"><thead><tr><th>周期</th><th>日期</th><th>状态</th><th>医嘱 / 记录原文</th></tr></thead><tbody>${rows}</tbody></table></div><div class="scroll-hint">左右滑动查看表格</div>
  <div class="notice plain" style="margin-top:12px">剂量变更与停药原因只留痕；界面不出现「耐药」「进展」这类结论。</div>`;
}

/* =====================================================================
   线 4 · 保育治疗（3 页签）
   ===================================================================== */
const NO_LIVE_BIRTH = '没有活产也不后悔，是合理结局；本台不以活产作为唯一成功标准。';
function pageFertDecision() {
  const p = profile();
  const f = p.fertility;
  if (!f.applicable) {
    return `${head('保育决策档案', '生育意愿、孕产史、病理候选、MRI 肌层浸润、二次病理复核；记录医生说过什么；零方案推荐/零概率预测。')}
    <div class="empty"><h3>本档案不进入保育路径</h3><p>${esc(f.reason)}</p></div>
    <div class="notice blue" style="margin-top:12px">${NO_LIVE_BIRTH}</div>
    <div class="notice plain" style="margin-top:10px">保育是延迟手术、争取生育时间，不是治愈；是否保育由本人与医生讨论，本台不推荐方案。</div>`;
  }
  const d = f.decision;
  return `${head('保育决策档案', '生育意愿、孕产史、病理候选、MRI 肌层浸润、二次病理复核；记录医生说过什么；零方案推荐/零概率预测。')}
  <div class="notice blue"><b>保育不是治愈。</b>它是延迟手术、争取生育时间；本页只记录选择与知情内容，不推方案、不预测妊娠机会。</div>
  <div class="grid two" style="margin-top:12px">
    <div class="card"><div class="card-head"><div><h2>候选与评估</h2><p>只照抄病理与影像原文。</p></div>${pill('只记录', 'blue')}</div>
      <div class="kv-list">
        <div class="kv"><span>生育意愿</span><b>${esc(d.desire)}</b></div>
        <div class="kv"><span>年龄 / 孕产史</span><b>${esc(d.age)} 岁 · ${esc(d.parity)}</b></div>
        <div class="kv"><span>病理候选</span><b>${esc(d.candidate)}</b></div>
        <div class="kv"><span>MRI 肌层浸润</span><b>${esc(d.mri)}</b></div>
        <div class="kv"><span>二次病理复核</span><b>${esc(d.review)}</b></div>
        <div class="kv"><span>口径</span><b>零方案推荐 / 零概率预测</b></div>
      </div>
    </div>
    <div class="card"><div class="card-head"><div><h2>医生已告知的内容</h2><p>知情记录，不是建议清单。</p></div>${pill('知情', 'yellow')}</div>
      <div class="told-list">${d.told.map((x) => `<span>${esc(x)}</span>`).join('')}</div>
      <p class="small-note" style="margin-top:10px">${esc(d.note)}</p>
    </div>
  </div>
  <div class="notice" style="margin-top:12px">${NO_LIVE_BIRTH}</div>
  <div class="actions" style="margin-top:12px"><button class="soft" data-action="go" data-page="fertility" data-sub="progestin">看孕激素与监测 →</button></div>`;
}
function pageFertProgestin() {
  const p = profile();
  const f = p.fertility;
  if (!f.applicable) {
    return `${head('孕激素与监测', 'LNG-IUD / 口服甲地孕酮 / 甲羟孕酮 / GnRH-a / 联合；剂量、起止、副作用、肝功能监测；不推方案。')}
    <div class="empty"><h3>本档案没有孕激素治疗记录</h3><p>${esc(f.progestin.note)}</p></div>`;
  }
  const g = f.progestin;
  return `${head('孕激素与监测', 'LNG-IUD / 口服甲地孕酮 / 甲羟孕酮 / GnRH-a / 联合；剂量、起止、副作用、肝功能监测；不推方案。', '<button class="primary" data-action="biopsy-add">＋ 记一次活检结果</button>')}
  <div class="grid two">
    <div class="card"><div class="card-head"><div><h2>方案（医生原文）</h2><p>剂量与疗程照录，不补单位。</p></div>${pill('只记录', 'blue')}</div>
      <div class="kv-list">
        <div class="kv"><span>方案</span><b>${esc(g.regimen)}</b></div>
        <div class="kv"><span>剂量</span><b>${esc(g.dose)}</b></div>
        <div class="kv"><span>起止</span><b>${esc(g.start)} → ${esc(g.end)}</b></div>
        <div class="kv"><span>活检节奏</span><b>每 ${esc(g.biopsyInterval)} 个月一次</b></div>
      </div>
      <p class="small-note" style="margin-top:9px">${esc(g.note)}</p>
    </div>
    <div class="card"><div class="card-head"><div><h2>副作用与肝功能</h2><p>只抄原文，不归因。</p></div></div>
      <p style="font-size:11.5px;line-height:1.7">${esc(g.sideEffects)}</p>
      <div class="stage-quote" style="margin-top:8px">${esc(g.liver)}</div>
    </div>
  </div>
  <div class="section-title"><div><h2>活检结果时间线</h2><p>完全缓解由医生判定；本页只记录病理原文。</p></div></div>
  <div class="card">${g.biopsies.map((x) => `<div class="stage-ver"><div class="sv-d">${esc(x.d)}</div><div class="sv-main"><div class="sv-label">${esc(x.result)}</div><div class="sv-basis">${x.cr ? '医生记录为「未见明确残留肿瘤」；是否算完全缓解由医生判定。' : '病理原文照录；下一步方案由医生决定。'}</div></div></div>`).join('')}</div>`;
}
function pageFertConceive() {
  const p = profile();
  const f = p.fertility;
  if (!f.applicable) {
    return `${head('妊娠尝试与产后计划', '完全缓解日期、开始尝试怀孕、ART 转诊、妊娠/分娩、产后子宫切除讨论；只记时间线与医嘱原文。')}
    <div class="empty"><h3>本档案无妊娠尝试记录</h3><p>${esc(f.conceive.note)}</p></div>
    <div class="notice blue" style="margin-top:12px">${NO_LIVE_BIRTH}</div>`;
  }
  const c = f.conceive;
  return `${head('妊娠尝试与产后计划', '完全缓解日期、开始尝试怀孕、ART 转诊、妊娠/分娩、产后子宫切除讨论；只记时间线与医嘱原文。', '<button class="primary" data-action="conceive-add">＋ 记一次尝试 / 随访</button>')}
  <div class="notice blue"><b>产品立场：</b>${NO_LIVE_BIRTH}</div>
  <div class="card" style="margin-top:12px">
    <div class="kv-list">
      <div class="kv"><span>完全缓解日期（医生记录）</span><b>${esc(c.crDate)}</b></div>
      <div class="kv"><span>开始尝试怀孕</span><b>${esc(c.attemptStart)}</b></div>
      <div class="kv"><span>ART 转诊</span><b>${esc(c.art)}</b></div>
      <div class="kv"><span>妊娠 / 分娩</span><b>${esc(c.pregnancy)} / ${esc(c.delivery)}</b></div>
      <div class="kv"><span>产后计划</span><b>${esc(c.postpartum)}</b></div>
      <div class="kv"><span>口径</span><b>只记时间线，不判「能不能生」</b></div>
    </div>
    <p class="small-note" style="margin-top:9px">${esc(c.note)}</p>
  </div>
  <div class="notice plain" style="margin-top:12px">本页不出现任何妊娠概率数字；是否继续尝试、是否转生殖中心，由本人与医生决定。</div>`;
}

/* =====================================================================
   线 5 · Lynch 与家系（3 页签）
   ===================================================================== */
function pageLynchTesting() {
  const p = profile();
  const t = p.lynch.testing;
  const tbl = (rows) => `<div class="table-wrap"><table><thead><tr><th>项目</th><th>结果 / 状态</th><th>日期</th><th>报告原文</th></tr></thead><tbody>${rows.map((x) => `<tr><td><b>${esc(x.item)}</b></td><td>${esc(x.value)}</td><td class="mono">${esc(x.d)}</td><td class="small-note">${esc(x.quote)}</td></tr>`).join('')}</tbody></table></div><div class="scroll-hint">左右滑动查看表格</div>`;
  return `${head('MMR 与胚系检测', '肿瘤 MMR IHC → MLH1 甲基化 → 遗传咨询 → 胚系（MLH1/MSH2/MSH6/PMS2/EPCAM）；检测状态与肿瘤检测分开；VUS 不写阳性。')}
  <div class="notice blue">${esc(p.lynch.note)}</div>
  <div class="section-title"><div><h2>肿瘤检测（体细胞）</h2><p>这是肿瘤的标签，不是遗传结论。</p></div></div>
  ${tbl(t.tumor)}
  <div class="section-title"><div><h2>胚系检测（血液/唾液）</h2><p>与肿瘤检测分表；未提供不等于阴性。</p></div></div>
  ${tbl(t.germline)}
  <div class="notice warn" style="margin-top:12px"><b>状态：</b>${esc(t.status)}。VUS 不写阳性；未检测≠阴性。</div>
  <div class="notice legal" style="margin-top:10px"><b>尊重不知情权。</b>不知情也是合法选择：本台不劝你检测、不催你告知家人；去不去遗传咨询，由你决定。</div>
  <div class="actions" style="margin-top:12px"><button class="soft" data-action="go" data-page="lynch" data-sub="family">看家系记录（第三方私密） →</button></div>`;
}
function pageLynchFamily() {
  const p = profile();
  const f = p.lynch.family;
  return `${head('家系记录（第三方私密）', '关系 / 癌种 / 确诊年龄 / 是否核实；不录亲属姓名（只用代号）；third_party=1 + consent=1；默认 private。')}
  <div class="notice legal">${esc(f.note)}</div>
  <div class="card" style="margin-top:12px">${f.rows.map((x) => `<div class="private-row"><b>private · ${esc(x.code)} · third_party=1 · consent=${x.consent ? 1 : 0}</b><p>${esc(x.relation)} · ${esc(x.cancer)} · 确诊年龄 ${x.age} 岁 · ${esc(x.verified)}</p></div>`).join('')}</div>
  <div class="notice" style="margin-top:12px">${esc(f.consentNote)} 本页不替亲属建档、不默认共享；导出与摘要都不会包含这些行。</div>
  <div class="notice warn" style="margin-top:10px"><b>第三方 private：</b>家系图里有亲属的信息，工作台默认只存在本机，未经同意不会共享。要不要告诉亲属、由谁告诉，由本人决定。</div>
  <div class="actions" style="margin-top:12px"><button class="soft" data-action="go" data-page="lynch" data-sub="comm">看告知与监测计划 →</button></div>`;
}
function pageLynchComm() {
  const p = profile();
  const c = p.lynch.comm;
  return `${head('告知与监测计划', '「建议告知哪些亲属」清单、已告知状态、遗传咨询机构、肠镜/妇科监测计划；只记录医生原文，不给遗传建议。')}
  <div class="card">
    <div class="kv-list">
      <div class="kv"><span>已告知状态</span><b>${esc(c.notified)}</b></div>
      <div class="kv"><span>已检测亲属数（不记姓名）</span><b>${c.testedCount} 人</b></div>
      <div class="kv"><span>监测计划</span><b>${esc(c.plan)}</b></div>
      <div class="kv"><span>降风险手术讨论</span><b>${esc(c.surgeryDiscussed)}</b></div>
    </div>
  </div>
  <div class="notice legal" style="margin-top:12px">${esc(c.note)} <b>本台不推动亲属检测</b>；家属要不要知道、要不要检测，是家属自己的选择。</div>
  <div class="section-title"><div><h2>我的问题清单</h2><p>只整理，不回答；勾选 = 已问。</p></div></div>
  <div class="card">${c.questions.map((q) => `<div class="q-item"><input type="checkbox" ${q.asked ? 'checked' : ''} data-action="q-asked" data-id="${q.id}" aria-label="已问"><div><b style="font-size:11.5px">${esc(q.text)}</b><p class="small-note">${esc(q.src)}</p></div></div>`).join('')}</div>`;
}

/* =====================================================================
   线 6 · 放疗后私密（3 页签）
   ===================================================================== */
function pageIntimateSymptoms() {
  const p = profile();
  const s = p.intimate;
  const pf = privateFilter(p, 'chart');
  return `${head('私密症状记录', '干涩 / 性交痛 / 狭窄 / 出血 / 性欲；0–4 自评；默认 private、可跳过、可只给自己看。', s.symptoms.length ? '<button class="primary" data-action="intimate-add">＋ 记一条（默认 private）</button>' : '')}
  <div class="notice legal"><b>默认仅本人可见。</b>${esc(s.note)}</div>
  ${s.symptoms.length ? s.symptoms.map((x) => `<div class="private-row"><b>private · ${esc(x.d)}</b><p>干涩 ${x.dryness}/4 · 性交痛 ${x.dyspareunia}/4 · 狭窄：${esc(x.stenosis)} · 出血：${esc(x.bleeding)} · 性欲：${esc(x.libido)}<br>${esc(x.text)}</p></div>`).join('') : `<div class="empty" style="margin-top:12px"><h3>本档案没有私密症状记录</h3><p>${esc(s.note)} 可以先空着，需要时再记。</p></div>`}
  <div class="notice" style="margin-top:12px"><b>三出口过滤：</b>一图秀、摘要、导出三处都会过滤私密记录（当前${pf.count} 条）。只记录医生给的频率，不自行设定；是否处理、怎么处理，听放疗/妇科医生。</div>
  <div class="notice warn" style="margin-top:10px">本页不归因、不建议；「是不是我矫情」不是医学问题，干燥/疼痛是医学问题，可以谈。</div>`;
}
function pageIntimateDilator() {
  const p = profile();
  const d = p.intimate.dilator;
  return `${head('扩张与保湿', '扩张器状态/开始日期/频率/每次时长/尺寸/疼痛/出血；保湿剂、润滑剂、阴道雌激素（按医嘱原文）；不自行设定频率。')}
  <div class="card">
    <div class="kv-list">
      <div class="kv"><span>扩张器状态</span><b>${esc(d.status)}</b></div>
      <div class="kv"><span>开始日期</span><b>${esc(d.start)}</b></div>
      <div class="kv"><span>频率（医生给的）</span><b>${esc(d.freq)}</b></div>
      <div class="kv"><span>每次时长 / 尺寸</span><b>${esc(d.minutes)} / ${esc(d.size)}</b></div>
      <div class="kv"><span>疼痛 / 出血</span><b>${esc(d.pain)} / ${esc(d.bleeding)}</b></div>
      <div class="kv"><span>保湿 / 润滑 / 雌激素</span><b>${esc(d.moisturizer)} · ${esc(d.lubricant)} · ${esc(d.estrogen)}</b></div>
    </div>
  </div>
  <div class="notice warn" style="margin-top:12px">${esc(d.note)}</div>
  <div class="notice legal" style="margin-top:10px">本页默认 private；一图秀 / 摘要 / 导出都不会带出具体频率与评分。</div>`;
}
function pageIntimateComm() {
  const p = profile();
  const c = p.intimate.comm;
  return `${head('沟通与就诊准备', '与医生谈性的舒适度、是否已谈、想问的问题、转诊；可导出「只给医生看」的摘要。')}
  <div class="card">
    <div class="kv-list">
      <div class="kv"><span>谈性的舒适度（1–5）</span><b>${c.comfort}/5（本人自评）</b></div>
      <div class="kv"><span>是否已与医生谈</span><b>${esc(c.discussed)}</b></div>
      <div class="kv"><span>转诊</span><b>${esc(c.referral)}</b></div>
      <div class="kv"><span>导出范围</span><b>只给医生看（不含评分）</b></div>
    </div>
    ${c.questions.length ? `<div class="section-title" style="margin:14px 0 6px"><div><h2>想问的问题</h2><p>只整理，不回答。</p></div></div>${c.questions.map((q) => `<div class="q-item"><span style="color:var(--brand-deep)">·</span><div><b style="font-size:11.5px">${esc(q)}</b></div></div>`).join('')}` : ''}
  </div>
  <div class="notice legal" style="margin-top:12px">${esc(c.exportNote)} 只有你显式选择「只给医生看」时，才会生成一份不含评分与私密数值的摘要。</div>`;
}

/* =====================================================================
   线 7 · 长期随访与健康（4 页签）
   ===================================================================== */
function pageFuCalendar() {
  const p = profile();
  const f = p.followup;
  return `${head('随访日历', '前 2–3 年每 3–6 个月、第 4–5 年每 6–12 个月、5 年后每年；节点 = 起点 + k×间隔；不生成「下次总复查」。')}
  <div class="notice blue">${esc(f.intervalNote)}</div>
  <div class="card" style="margin-top:12px"><div class="card-head"><div><h2>节点（起点 ${esc(f.start)} · 每 ${f.interval} 个月）</h2><p>工作台约定，具体以医生预约为准。</p></div>${pill('不合成总复查', 'blue')}</div><div class="chips">${f.nodes.map((d, i) => `<span class="chip" style="cursor:default">第 ${i + 1} 次 · ${esc(d)}</span>`).join('')}</div></div>
  <div class="section-title"><div><h2>已发生的随访</h2><p>症状 + 妇科检查（含窥器）为主线；影像/细胞学标有指征/常规。</p></div></div>
  <div class="table-wrap"><table><thead><tr><th>日期</th><th>症状</th><th>窥器 / 盆腔</th><th>影像</th><th>细胞学</th><th>CA125</th></tr></thead><tbody>${f.visits.map((x) => `<tr><td class="mono"><b>${esc(x.d)}</b></td><td>${esc(x.symptoms)}</td><td>${esc(x.speculum)}<br><span class="small-note">${esc(x.pelvic)}</span></td><td>${esc(x.imaging)}</td><td>${esc(x.cytology)}</td><td>${esc(x.ca125)}</td></tr>`).join('')}</tbody></table></div><div class="scroll-hint">左右滑动查看表格</div>
  <div class="notice plain" style="margin-top:12px">约 30% 阴道复发无症状，窥器能发现；随访不是越勤越好，具体频率听医生。</div>`;
}
function pageFuImaging() {
  const p = profile();
  const f = p.followup;
  return `${head('影像与阴道细胞学', '影像：部位/方法/结论原文/是否有指征（症状/怀疑复发/常规）；细胞学：记录但标「非常规」。')}
  <div class="notice warn">不推荐无症状常规影像/细胞学；页面写「没有症状时常规做，证据并不支持；具体听医生」，不写成「无需检查」。</div>
  <div class="section-title"><div><h2>影像记录</h2><p>只抄结论原文；同一模态才并列。</p></div></div>
  <div class="table-wrap"><table><thead><tr><th>日期</th><th>检查</th><th>是否有指征</th><th>结论原文</th><th>方法</th></tr></thead><tbody>${f.imaging.map((x) => `<tr><td class="mono"><b>${esc(x.d)}</b></td><td>${esc(x.kind)}</td><td>${esc(x.indication)}</td><td class="small-note">${esc(x.quote)}</td><td>${esc(x.method)}</td></tr>`).join('')}</tbody></table></div><div class="scroll-hint">左右滑动查看表格</div>
  <div class="section-title"><div><h2>阴道细胞学</h2><p>记录但标「非常规」。</p></div></div>
  ${f.cytology.length ? `<div class="card">${f.cytology.map((x) => `<div class="kv-list"><div class="kv"><span>${esc(x.d)}</span><b>${esc(x.result)}</b></div><div class="kv"><span>原因 / 口径</span><b>${esc(x.reason)}</b></div></div><p class="small-note" style="margin-top:6px">${esc(x.note)}</p>`).join('')}</div>` : `<div class="empty"><h3>本档案没有细胞学记录</h3><p>没有症状时常规做，证据并不支持；具体听医生。</p></div>`}`;
}
function pageFuComorb() {
  const p = profile();
  const c = p.followup.comorb;
  return `${head('慢病与第二原发癌', '血压/BMI/血糖/血脂/运动/吸烟/骨健康；第二原发癌筛查（乳腺/结直肠/皮肤/肺）；心血管是首位死因。')}
  <div class="card"><div class="kv-list">
    <div class="kv"><span>血压</span><b>${esc(c.bp)}</b></div><div class="kv"><span>BMI</span><b>${esc(c.bmi)}</b></div>
    <div class="kv"><span>血糖</span><b>${esc(c.glucose)}</b></div><div class="kv"><span>血脂</span><b>${esc(c.lipids)}</b></div>
    <div class="kv"><span>运动</span><b>${esc(c.exercise)}</b></div><div class="kv"><span>吸烟</span><b>${esc(c.smoking)}</b></div>
    <div class="kv"><span>骨健康</span><b>${esc(c.bone)}</b></div><div class="kv"><span>第二原发癌</span><b>${esc(c.secondPrimary)}</b></div>
  </div><p class="small-note" style="margin-top:9px">${esc(c.note)}</p></div>
  <div class="notice plain" style="margin-top:12px">本页只记录数值与事实，不给处方、不做风险评分；是否用药、是否加查，听医生。</div>`;
}
function pageFuNutrition() {
  const p = profile();
  const n = p.followup.nutrition;
  return `${head('体重与营养', '份量、食物、症状、体重趋势；体重进指标；不给食谱/热量处方；不做体重道德评判。', '<button class="primary" data-action="weight-add">＋ 记一次体重 / 进食</button>')}
  <div class="card"><div class="card-head"><div><h2>最近体重</h2><p>${esc(n.weight)}</p></div>${pill('进一图秀', 'blue')}</div>
    <div class="table-wrap"><table><thead><tr><th>日期</th><th>进食（自述）</th><th>症状</th><th>体重</th></tr></thead><tbody>${n.rows.map((x) => `<tr><td class="mono">${esc(x.d)}</td><td>${esc(x.meal)}</td><td>${esc(x.symptom)}</td><td class="mono">${x.weight} kg</td></tr>`).join('')}</tbody></table></div><div class="scroll-hint">左右滑动查看表格</div>
    <p class="small-note" style="margin-top:9px">${esc(n.note)}</p></div>`;
}

/* =====================================================================
   线 8 · 情绪与亲密（3 页签）
   ===================================================================== */
function pageMindFeelings() {
  const p = profile();
  const f = p.mind.feelings;
  const col = (arr, cls, tag) => `<div class="fcr-col ${cls}"><div class="fcr-tag">${esc(tag)}</div>${arr.map((x) => `<div class="fcr-item"><div class="fcr-score"><b>${x.v}</b><span>/10</span><div class="fcr-bar"><i style="width:${x.v * 10}%"></i></div><span>${esc(x.d)}</span></div><p>${esc(x.text)}</p></div>`).join('')}</div>`;
  return `${head('当下感受', '患者 / 照护者各自记录、并列展示、不平均；复发恐惧、睡眠、焦虑；不承诺「消除恐惧」。', '<button class="primary" data-action="feeling-add">＋ 记一条感受</button>')}
  <div class="notice blue"><b>复发恐惧不是「想太多」：</b>本页只做自评记录，不诊断焦虑，也不劝你「别想」。</div>
  <div class="fcr-dual" style="margin-top:12px">${col(f.patient, '', '本人自评（PATIENT）')}${col(f.caregiver, 'caregiver', '照护者自评（CAREGIVER）')}</div>
  <p class="small-note" style="margin-top:9px">${esc(f.note)}</p>
  <div class="actions" style="margin-top:12px"><button class="soft" data-action="go" data-page="mind" data-sub="body">看身体意象与亲密 →</button></div>`;
}
function pageMindBody() {
  const p = profile();
  return `${head('身体意象与亲密', '疤痕、体重变化、身体不再属于自己的感受；性与亲密（私密）；可选话题不是必填表。', '<button class="primary" data-action="body-add">＋ 记一条身体感受</button>')}
  <div class="notice">${esc(p.mind.bodyNote)}</div>
  ${p.mind.body.length ? p.mind.body.map((x) => `<div class="private-row"><b>private · ${esc(x.d)}</b><p>${esc(x.text)}</p></div>`).join('') : '<div class="empty" style="margin-top:12px"><h3>本档案没有身体意象记录</h3><p>可以先空着；想记的时候再记。</p></div>'}
  <div class="notice plain" style="margin-top:12px">本页记录默认不进导出、不进 AI 上下文；需要时由你逐条勾选授权。</div>`;
}
function pageMindFertility() {
  const p = profile();
  return `${head('生育焦虑与家庭沟通', '「还能不能生」、保育决策后的后悔/担忧、伴侣/父母/子女沟通；与保育线互相跳转，但不替患者做家庭决定。')}
  ${p.mind.fertilityAnx.length ? p.mind.fertilityAnx.map((x) => `<div class="private-row"><b>private · ${esc(x.d)}</b><p>${esc(x.text)}</p></div>`).join('') : '<div class="empty"><h3>本档案没有生育焦虑记录</h3><p>这不代表没有；只是还没记。</p></div>'}
  <div class="notice blue" style="margin-top:12px">${NO_LIVE_BIRTH}</div>
  <div class="notice plain" style="margin-top:10px">是否继续保育、是否告诉家人、什么时候告诉，都由你决定；本台不替你做家庭决定，也不评价你的选择。</div>
  <div class="actions" style="margin-top:12px"><button class="soft" data-action="go" data-page="fertility" data-sub="conceive">去保育线的妊娠尝试记录 →</button></div>`;
}

/* =====================================================================
   线 9 · 病情一图秀
   ===================================================================== */
function pageChart() {
  const p = profile();
  const [t0, t1] = domain();
  const picks = ['体重与营养', '出血轨道', '同模态影像测量', '分类节点'].map((cat) => {
    const codes = Object.keys(CATALOG).filter((c) => CATALOG[c].cat === cat);
    return `<div class="cat-label">${esc(cat)}</div>${codes.map((c) => `<label class="metric-pick"><input type="checkbox" data-action="sel" data-code="${c}" ${state.sel[state.profileId].includes(c) ? 'checked' : ''}><i style="background:${CATALOG[c].color}"></i><span>${esc(CATALOG[c].name)}</span><small>${CATALOG[c].categorical ? '节点' : fmtRange(c)}</small></label>`).join('')}`;
  }).join('');
  const pin = state.pin ? `<div class="pin"><div><b>${esc(CATALOG[state.pin.code].name)} · ${esc(state.pin.date)}</b><p>${esc((seriesAll(state.pin.code).find((x) => x.d === state.pin.date) || {}).src || '记录')}</p></div><button class="text-button" data-action="unpin">收起</button></div>` : '';
  const pf = privateFilter(p, 'chart');
  return `${head('病情一图秀', '体重 / 出血天数 / 同模态影像测量放回同一段时间；分类节点只画点不连线，跨模态不共轴。')}
  <div class="overview">
    <div class="rail">
      <details class="pick" open><summary>指标 <small>最多 4 个</small></summary>${picks}</details>
      <section><h3>时间窗</h3><div class="chips">${[['3m', '3 个月'], ['6m', '6 个月'], ['12m', '12 个月'], ['all', '全病程']].map(([k, v]) => `<button class="chip" data-action="range" data-range="${k}" aria-pressed="${state.range === k}">${v}</button>`).join('')}</div></section>
      <section><h3>图层</h3><div class="chips"><button class="chip" data-action="toggle" data-key="treatment" aria-pressed="${state.toggles.treatment}">治疗条</button><button class="chip" data-action="toggle" data-key="keypoints" aria-pressed="${state.toggles.keypoints}">节点标签</button></div>
        <div class="zoom"><input type="range" min="35" max="100" value="${state.zoom}" data-action="zoom" aria-label="缩放"><span>${state.zoom}%</span></div></section>
      <p class="small-note" style="margin-top:12px">各条线按自身 min/max 缩放，只表示自身变化；不同指标不可比。</p>
    </div>
    <div class="timeline-main"><div class="chart-panel"><div class="chart-top"><div><h2>${esc(p.name)} · 一图秀</h2><p class="small-note">数值只照抄记录；分类节点不连线。</p></div>${pill('不判读', 'blue')}</div>${chartSVG(t0, t1)}<div class="scroll-hint">左右滑动查看图表</div>${pin}</div>
      <div class="notice plain">血量/频次只来自出血日志，不判病因；内膜厚度只在同一测量方式（TVS 双层）内并列。没有 SCC-Ag，也不做肿瘤标志物趋势。</div>
      <div class="notice legal" style="margin-top:10px">${esc(pf.note)}</div>
    </div>
  </div>`;
}

/* =====================================================================
   线 10 · 资料与就诊（4 页签）
   ===================================================================== */
function pageDocsLibrary() {
  const p = profile();
  const d = p.docs;
  return `${head('资料库与导入', '原件保留、MinerU 解析、失败不产候选；病理/影像/基因/出院记录分类。', '<button class="primary" data-action="doc-add">＋ 导入一份资料</button>')}
  <div class="notice">导入 → 解析 → 候选 → 核对 → 入库（MinerU 六部件按 18 号）；解析失败不生成候选，原件保留。</div>
  <div class="table-wrap" style="margin-top:12px"><table><thead><tr><th>文件</th><th>类型</th><th>大小</th><th>日期</th><th>状态</th></tr></thead><tbody>${d.documents.map((x) => `<tr><td><b>${esc(x.name)}</b></td><td>${esc(x.kind)}</td><td class="mono">${esc(x.size)}</td><td class="mono">${esc(x.d)}</td><td>${pill(x.status, x.status === '已核对' ? 'green' : 'yellow')}</td></tr>`).join('')}</tbody></table></div><div class="scroll-hint">左右滑动查看表格</div>
  <div class="actions" style="margin-top:12px"><button class="soft" data-action="go" data-page="docs" data-sub="candidates">去整理草稿与核对 →</button></div>`;
}
function pageDocsCandidates() {
  const p = profile();
  const d = p.docs;
  return `${head('整理草稿与核对', '解析候选逐项 accept 前不进正式数据；候选带来源页与置信标记。')}
  <div class="notice warn"><b>候选不是事实。</b>确认前只在草稿区；确认后进入事实层，拒收不产生副作用。删除不存在——更正 = 登记新版本。</div>
  <div class="card" style="margin-top:12px">${d.candidates.map((c) => `<div class="q-item"><div style="min-width:0;flex:1"><b style="font-size:11.5px">${esc(c.field)} · ${esc(c.value)}</b><p class="small-note">${esc(c.src)}</p></div><div class="actions">${pill(c.state, c.state === '待核对' ? 'yellow' : c.state === '已入库' ? 'green' : 'grey')}${c.state === '待核对' ? `<button class="text-button" data-action="cand-accept" data-id="${c.id}">确认入库</button><button class="text-button" data-action="cand-reject2" data-id="${c.id}">拒收</button>` : ''}</div></div>`).join('')}</div>
  <div class="notice plain" style="margin-top:12px">每条候选都带来源（文件 + 日期 + 页码位）；本页不展示完整本机路径。</div>
  <div class="actions" style="margin-top:12px"><button class="soft" data-action="go" data-page="docs" data-sub="prepare">去就诊准备与导出 →</button></div>`;
}
function pageDocsPrepare() {
  const p = profile();
  const d = p.docs;
  const mat = d.materials.map((m) => `<div class="mat-row ${m.state === 'ready' ? 'done' : ''}"><input type="checkbox" ${m.state === 'ready' ? 'checked' : ''} aria-label="${esc(m.name)}"><div class="mat-main"><b>${esc(m.name)}</b><p>${esc(m.why)} · ${m.state === 'ready' ? '已备齐' : m.state === 'partial' ? '部分' : '未备齐'}</p></div></div>`).join('');
  return `${head('就诊准备与导出', '两区导出（事实 / 我的看法与担心）+ private 默认过滤；问题清单版本与已过时标记。', '<button class="primary" data-action="q-add">＋ 添加疑问</button>')}
  <div class="grid two">
    <div class="card"><div class="card-head"><div><h2>复诊材料清单</h2><p>只整理复诊与报销材料。</p></div></div><div class="mat-list">${mat}</div></div>
    <div class="card"><div class="card-head"><div><h2>疑问清单</h2><p>只整理不回答；勾选 = 已问。</p></div></div>${d.questions.map((q) => `<div class="q-item"><input type="checkbox" ${q.asked ? 'checked' : ''} data-action="q-asked" data-id="${q.id}" aria-label="已问"><div><b style="font-size:11.5px">${esc(q.text)}</b><p class="small-note">${esc(q.src)}</p></div></div>`).join('')}</div>
  </div>
  <div class="section-title"><div><h2>两区导出预览</h2><p>事实区 / 我的看法与担心；private 默认过滤。</p></div><div class="actions"><button class="soft" data-action="export">预览导出</button></div></div>
  <pre class="export-pre">${esc(exportMarkdown(p))}</pre>
  <div class="actions" style="margin-top:12px"><button class="soft" data-action="go" data-page="docs" data-sub="trials">看试验线索 →</button></div>`;
}
function pageDocsTrials() {
  const p = profile();
  return `${head('试验线索', 'dostarlimab / 帕博利珠单抗 / 仑伐+帕博 / dMMR/MSI-H / POLEmut 降阶 / 保育治疗；线索不是推荐，不判入组资格。')}
  <div class="notice warn"><b>登记状态，未核实。</b>${esc(DATA.meta.trialNote)}</div>
  ${p.docs.trials.map((t) => `<div class="trial-card"><div class="card-head"><div><h2>${esc(t.title)}</h2><p>${esc(t.id)} · ${esc(t.phase)} · ${esc(t.topic)} · ${esc(t.source)}</p></div>${pill(t.status, 'yellow')}</div><p class="small-note">${esc(t.note)}</p><p class="small-note" style="margin-top:4px">NMPA 状态：${esc(t.nmpa)} · 是否适合参加由研究团队按入组标准判断。</p></div>`).join('')}
  <div class="notice plain">没有可核实的研究库时不提供检索入口；本页条目来自 2026-10 登记快照，仅作线索。</div>`;
}

/* ---------------- 导出（三出口之一） ---------------- */
function exportMarkdown(p) {
  const pf = privateFilter(p, 'export');
  const mol = p.molecular.markers.map((m) => `${m.marker.replace(/（.*/, '')}=${stateLabel(m.result)}`).join('；');
  return `# ${p.name} · 复诊摘要（演示导出）

## 事实区（记录与原文）
- 阶段：${p.stageLine}
- 出血：${p.bleeding.rows.length} 条（${p.bleeding.rows[0].d} → ${p.bleeding.rows[p.bleeding.rows.length - 1].d}）
- 病理：${p.pathology.rows[0].value} · ${p.pathology.rows[1].value}
- 分期（最近版本）：${p.stage.versions.filter((x) => x.current)[0].finalLabel}
- 分子：${mol}（未检测≠阴性）
- 治疗阶段：${p.treatment.pathway.map((x) => `${x.phase} ${x.d}`).join('；')}
- 随访节点：${p.followup.nodes.slice(0, 3).join(' / ')}（起点 + k×间隔）

## 我的看法与担心
- 感受记录：${p.mind.feelings.patient.length} 条（本人）· ${p.mind.feelings.caregiver.length} 条（照护者，不平均）
- 待问问题：${p.docs.questions.length} 条

## 三出口过滤说明
- ${pf.note}
- 家系第三方信息（third_party=1）默认 private，未经授权不进入导出；不存亲属姓名。

口径：只导出记录与原文；不含完整本机路径；判断由我与治疗团队做。`;
}

/* ---------------- 表单（≤6 字段；每页 ≤1 个显式编辑入口） ---------------- */
function openForm(title, fields, saveAction, eyebrow = '小膜宝 · 记录') {
  const body = `<div class="form-grid">${fields.map((f) => `<div class="${f.wide ? 'wide' : ''}"><label class="form-label" for="f-${f.id}">${esc(f.label)}</label>${f.type === 'select' ? `<select id="f-${f.id}">${f.options.map((o) => `<option>${esc(o)}</option>`).join('')}</select>` : f.type === 'textarea' ? `<textarea id="f-${f.id}" placeholder="${esc(f.placeholder || '')}">${esc(f.value || '')}</textarea>` : `<input id="f-${f.id}" type="${f.type || 'text'}" value="${esc(f.value || '')}" placeholder="${esc(f.placeholder || '')}">`}</div>`).join('')}</div><p class="small-note" style="margin-top:9px">表单 ${fields.length} 字段（≤6）；保存 = 新增一条记录，旧记录保留。</p>`;
  openModal(title, body, `<button class="primary" data-action="${saveAction}">保存</button><button data-action="close">取消</button>`, eyebrow);
}
const FORMS = {
  'bleed-add': () => openForm('记一次出血（只记录，不判病因）', [
    { id: 'd', label: '日期', type: 'date', value: TODAY },
    { id: 'pattern', label: '模式', placeholder: '如：绝经后出血 / 月经间期出血' },
    { id: 'volume', label: '量（自述）', type: 'select', options: ['点滴', '少量（护垫）', '中等（日用卫生巾）', '较多（夜用）'] },
    { id: 'days', label: '持续天数', type: 'number', value: '1' },
    { id: 'trigger', label: '诱因 / 当时在做什么', placeholder: '如：无诱因 / 同房后 / 走路多' }
  ], 'save-bleed'),
  'intimate-add': () => openForm('记一条私密症状（默认 private）', [
    { id: 'd', label: '日期', type: 'date', value: TODAY },
    { id: 'dryness', label: '干涩（0–4）', type: 'number', value: '2' },
    { id: 'dyspareunia', label: '性交痛（0–4）', type: 'number', value: '2' },
    { id: 'text', label: '当时的描述（原话）', type: 'textarea', wide: true }
  ], 'save-intimate'),
  'feeling-add': () => openForm('记一条感受（默认 private）', [
    { id: 'who', label: '记录人', type: 'select', options: ['本人', '照护者'] },
    { id: 'd', label: '日期', type: 'date', value: TODAY },
    { id: 'v', label: '自评（0–10）', type: 'number', value: '4' },
    { id: 'text', label: '感受（原话）', type: 'textarea', wide: true }
  ], 'save-feeling'),
  'body-add': () => openForm('记一条身体感受（默认 private）', [
    { id: 'd', label: '日期', type: 'date', value: TODAY },
    { id: 'text', label: '感受（原话）', type: 'textarea', wide: true }
  ], 'save-body'),
  'weight-add': () => openForm('记一次体重 / 进食', [
    { id: 'd', label: '日期', type: 'date', value: TODAY },
    { id: 'weight', label: '体重（kg）', type: 'number', placeholder: '如：67.0' },
    { id: 'meal', label: '吃了什么 / 份量（自述）', type: 'textarea', wide: true }
  ], 'save-weight'),
  'cycle-add': () => openForm('登记一次治疗（演示）', [
    { id: 'd', label: '日期', type: 'date', value: TODAY },
    { id: 'status', label: '状态', type: 'select', options: ['继续', '开始', '暂停', '停药'] },
    { id: 'text', label: '医嘱 / 原因原话', type: 'textarea', wide: true, placeholder: '只记录，不评疗效' }
  ], 'save-cycle'),
  'biopsy-add': () => openForm('记一次活检结果', [
    { id: 'd', label: '日期', type: 'date', value: TODAY },
    { id: 'result', label: '病理原文', type: 'textarea', wide: true }
  ], 'save-biopsy'),
  'conceive-add': () => openForm('记一次尝试 / 随访', [
    { id: 'd', label: '日期', type: 'date', value: TODAY },
    { id: 'text', label: '记录（原话）', type: 'textarea', wide: true, placeholder: '如：本月开始尝试；未测' }
  ], 'save-conceive'),
  'doc-add': () => openForm('导入一份资料（演示）', [
    { id: 'name', label: '文件名（模拟）', placeholder: '如：病理报告 2026-10.pdf' },
    { id: 'kind', label: '类型', type: 'select', options: ['病理', '影像', '基因/分子', '出院记录', '化验'] },
    { id: 'note', label: '备注', placeholder: '演示不读取真实文件' }
  ], 'save-doc'),
  'q-add': () => openForm('添加疑问（1 字段）', [
    { id: 'text', label: '想问什么（原话）', type: 'textarea', wide: true }
  ], 'save-q')
};
const SAVE = {
  'save-bleed'(v) {
    mem().bleeding.rows.push({ id: uid('B'), d: v.d || TODAY, menopause: mem().meta.menopause, pattern: v.pattern || '未填写', volume: v.volume || '少量（护垫）', days: Number(v.days) || 1, clots: '未填写', discharge: '未填写', trigger: v.trigger || '未填写', source: '本人记录', author: 'PATIENT' });
    toast('已记 1 条出血（只记录，不判病因）', { back: true }); closeModal(); render();
  },
  'save-intimate'(v) { mem().intimate.symptoms.push({ id: uid('V'), d: v.d || TODAY, dryness: Number(v.dryness) || 0, dyspareunia: Number(v.dyspareunia) || 0, stenosis: '未评估', bleeding: '未填写', libido: '未填写', text: v.text || '', visibility: 'private' }); toast('已记 1 条私密症状（private；三出口过滤）'); closeModal(); render(); },
  'save-feeling'(v) { const p = mem(); const rec = { d: v.d || TODAY, v: Number(v.v) || 0, text: v.text || '' }; if (v.who === '照护者') p.mind.feelings.caregiver.push(rec); else p.mind.feelings.patient.push(rec); toast('已记 1 条感受（默认 private；不平均）'); closeModal(); render(); },
  'save-body'(v) { mem().mind.body.push({ d: v.d || TODAY, text: v.text || '', visibility: 'private' }); toast('已记 1 条身体感受（private）'); closeModal(); render(); },
  'save-weight'(v) { const p = mem(); const w = Number(v.weight) || 0; p.followup.nutrition.rows.push({ d: v.d || TODAY, meal: v.meal || '未填写', symptom: '未填写', weight: w }); if (w) p.metrics.numeric.WEIGHT.push({ d: v.d || TODAY, v: w, src: '本人记录' }); toast('已记 1 条体重 / 进食（进一图秀）'); closeModal(); render(); },
  'save-cycle'(v) { const s = mem().treatment.systemic; s.used = true; s.cycles = s.cycles || []; s.cycles.push({ n: s.cycles.length + 1, d: v.d || TODAY, status: v.status || '继续', text: v.text || '' }); toast('已登记 1 次治疗（只记录）'); closeModal(); render(); },
  'save-biopsy'(v) { const g = mem().fertility.progestin; g.biopsies = g.biopsies || []; g.biopsies.push({ d: v.d || TODAY, result: v.result || '未填写', cr: false }); toast('已记 1 次活检（病理原文；完全缓解由医生判定）'); closeModal(); render(); },
  'save-conceive'(v) { const c = mem().fertility.conceive; c.attemptStart = c.attemptStart === '—' ? (v.d || TODAY) : c.attemptStart; toast('已记 1 条尝试 / 随访（不判能不能生）'); closeModal(); render(); },
  'save-doc'(v) { mem().docs.documents.push({ id: uid('d'), name: v.name || '未命名文件', fileName: v.name || '', kind: v.kind || '病理', size: '演示', d: TODAY, status: '待核对' }); toast('已加入解析队列（演示：失败不产候选）'); closeModal(); render(); },
  'save-q'(v) { mem().docs.questions.push({ id: uid('q'), text: v.text || '未填写', asked: false, src: '就诊准备 · 手工新增' }); toast('已加入疑问清单（只整理不回答）'); closeModal(); render(); }
};
function readForm(ids) { const o = {}; ids.forEach((id) => { const el = $(`#f-${id}`); if (el) o[id] = el.value; }); return o; }
const FORM_IDS = {
  'save-bleed': ['d', 'pattern', 'volume', 'days', 'trigger'],
  'save-intimate': ['d', 'dryness', 'dyspareunia', 'text'],
  'save-feeling': ['who', 'd', 'v', 'text'],
  'save-body': ['d', 'text'],
  'save-weight': ['d', 'weight', 'meal'],
  'save-cycle': ['d', 'status', 'text'],
  'save-biopsy': ['d', 'result'],
  'save-conceive': ['d', 'text'],
  'save-doc': ['name', 'kind', 'note'],
  'save-q': ['text']
};

/* ---------------- 弹窗：档案 / 设置 / 关于 / 帮助 ---------------- */
function openProfiles() {
  const rows = DATA.profiles.map((p) => `<button class="profile-row ${p.id === state.profileId ? 'on' : ''}" data-action="use-profile" data-id="${p.id}"><div><b>${esc(p.name)}</b><p>${p.age} 岁 · ${esc(p.diagnosisShort)} · ${esc(p.stageLine)}</p></div><span class="profile-caret">${p.id === state.profileId ? '当前' : '切换'}</span></button>`).join('');
  openModal('切换演示档案', rows, '<button data-action="close">关闭</button>', '小膜宝 · 档案');
}
function openSettings(tab = 'ws') {
  const c = state.cfg;
  openModal('设置（演示）', `<div class="cfg-tabs"><button aria-selected="${tab === 'ws'}">工作区</button><button aria-selected="${tab === 'doc'}">文档解析</button></div>
    <div class="cfg-block" style="margin-top:12px"><b style="font-size:12px">资料目录</b><div class="path-row"><code>${esc(c.root)}</code><button class="soft" data-action="pick-root">更换</button></div><p class="small-note" style="margin-top:5px">不能选主目录、根目录或桌面根；原型只存内存。</p></div>
    <div class="cfg-block" style="margin-top:10px"><b style="font-size:12px">文档解析</b><p class="small-note" style="margin-top:4px">MinerU：${c.mineru ? '已启用（演示）' : '未启用'} · 失败不产候选 · 原件保留</p><p class="small-note">临床数据包：${c.clinical ? '已启用' : '未启用'}（本原型不接真实数据）</p></div>`,
    '<button data-action="close">关闭</button>', '小膜宝 · 设置');
}
function openAbout() {
  openModal('关于小膜宝', `<p style="font-size:12px">${APP_INFO.brand} · 子宫内膜癌（ENDO）工作台交互原型</p><p class="small-note" style="margin-top:7px">版本 ${APP_INFO.displayVersion} · 构建 ${APP_INFO.build} · 渠道 ${esc(APP_INFO.channelLabel)}</p><p class="small-note" style="margin-top:7px">演示数据（合成），不指向任何真实患者；不构成诊疗建议。判读归妇科肿瘤治疗团队。</p>`, '<button data-action="close">关闭</button>', '小膜宝 · 关于');
}
function openHelp() {
  openModal('原型操作说明', `<div class="flag-list"><div><b>导航：</b>左侧 10 条一级线，页内二级页签；看板 13 枚场景 chip 可直达。</div><div><b>AI 协助：</b>每页右上「AI 协助」把提示词 + 本页病情上下文填入会话草稿（endo:agent-draft），不自动发送。</div><div><b>记录：</b>每页显式编辑入口 ≤1；表单 ≤6 字段；删除不存在，更正 = 新增版本。</div><div><b>私密：</b>private 默认不进一图秀 / 摘要 / 导出 / AI 上下文。</div><div><b>治疗线：</b>折叠卡默认收起，展开五块；打印时全部展开。</div></div>`, '<button data-action="close">关闭</button>', '小膜宝 · 帮助');
}
function openExport() {
  openModal('导出预览（两区）', `<pre class="export-pre">${esc(exportMarkdown(profile()))}</pre>`, '<button class="primary" data-action="close">关闭</button>', '小膜宝 · 导出');
}

/* ---------------- ACTIONS ---------------- */
const ACTIONS = {
  go(el) { navigate(el.dataset.page, el.dataset.sub || ''); },
  sub(el) { navigate(state.page, el.dataset.sub); },
  scene(el) { const s = SCENES.find((x) => x[0] === el.dataset.scene); if (s) navigate(s[2], s[3]); },
  range(el) { state.range = el.dataset.range; render(); },
  toggle(el) { state.toggles[el.dataset.key] = !state.toggles[el.dataset.key]; render(); },
  zoom(el) { state.zoom = Number(el.value); render(); },
  sel(el) {
    const arr = state.sel[state.profileId]; const c = el.dataset.code;
    if (el.checked) { if (arr.length >= 4) { el.checked = false; toast('最多同时看 4 个指标；先取消一个再加。'); return; } arr.push(c); }
    else { if (arr.length === 1) { el.checked = true; toast('至少留一个指标。'); return; } state.sel[state.profileId] = arr.filter((x) => x !== c); }
    render();
  },
  pin(el) { state.pin = { code: el.dataset.code, date: el.dataset.date }; render(); },
  unpin() { state.pin = null; render(); },
  flip(el) { const c = el.dataset.code; if (state.flipped.has(c)) state.flipped.delete(c); else state.flipped.add(c); el.setAttribute('aria-pressed', String(state.flipped.has(c))); },
  'agent-toggle'() { setAgent(!state.agent.open); },
  'agent-hide'() { setAgent(false); toast('已收起面板（会话保留，草稿不丢）'); },
  'ai-draft'(el) {
    const key = el.dataset.ai || stateSubKey();
    const prompt = aiPromptWithCtx(key);
    state.agent.draft = key;
    state.agent.cand = AI_DEMOS[key]?.cand || AI_DEMOS[state.page]?.cand || null;
    if (!state.agent.open) setAgent(true); else renderAgent();
    const input = $('.agent-foot input'); if (input) input.value = prompt;
    /* 真机（customFrame）：外壳 client 监听 endo:agent-draft，自动填入 DSH 原生会话草稿；
       无会话时外壳 ensureSession 调起再填——都不自动发送（家族契约：不代替患者发言）。 */
    try { parent.postMessage({ type: 'endo:agent-draft', prompt }, location.protocol === 'file:' ? '*' : location.origin); } catch { /* file:// 老内核退化 */ }
    toast('已把提示词与本页病情信息填入 AI 会话输入框（待你发送，不会自动发出）');
  },
  'cand-ok'() { toast('演示：核对通过后进入事实层（原型仅示意）', { back: true }); },
  'cand-fix'() { toast('演示：进入逐项修改（每项都可以改）'); },
  'cand-reject'() { state.agent.cand = null; renderAgent(); toast('已拒收这条候选（无副作用）'); },
  'cand-accept'(el) { const c = mem().docs.candidates.find((x) => x.id === el.dataset.id); if (c) c.state = '已入库'; toast('已确认入库（演示仅内存）'); render(); },
  'cand-reject2'(el) { const c = mem().docs.candidates.find((x) => x.id === el.dataset.id); if (c) c.state = '已拒收'; toast('已拒收（无副作用）'); render(); },
  'q-asked'(el) { const q = mem().docs.questions.find((x) => x.id === el.dataset.id); if (q) { q.asked = el.checked; toast(q.asked ? '已标记「已问」' : '恢复为待问'); } },
  profiles() { openProfiles(); },
  'use-profile'(el) { state.profileId = el.dataset.id; state.pin = null; state.flipped = new Set(); closeModal(); render(); },
  settings(el) { openSettings(el && el.dataset.tab); },
  'open-store'() { openSettings('ws'); },
  about() { openAbout(); },
  help() { openHelp(); },
  export() { openExport(); },
  close() { closeModal(); },
  src(el) { openModal('来源', `<p style="font-size:12.5px">${esc(el.dataset.src)}</p><p class="small-note">原型不打开真实文件；接入后这里会跳到该页并高亮。</p>`, '<button data-action="close">关闭</button>', '原文出处'); },
  'font-toggle'() { document.body.classList.toggle('large'); $('#font-toggle').setAttribute('aria-pressed', String(document.body.classList.contains('large'))); },
  'pick-root'() { const bad = prompt('输入资料目录的绝对路径（演示：输入 /Users/demo 会被拒绝）', state.cfg.root); if (bad === null) return; if (['/', '/Users/demo', '/Users/demo/Desktop'].includes(bad.trim())) { toast('已拒绝：不能选主目录、根目录或桌面根'); return; } state.cfg.root = bad.trim(); toast('资料目录已更新（原型仅内存）'); openSettings('ws'); },
  'bleed-add'() { FORMS['bleed-add'](); },
  'intimate-add'() { FORMS['intimate-add'](); },
  'feeling-add'() { FORMS['feeling-add'](); },
  'body-add'() { FORMS['body-add'](); },
  'weight-add'() { FORMS['weight-add'](); },
  'cycle-add'() { FORMS['cycle-add'](); },
  'biopsy-add'() { FORMS['biopsy-add'](); },
  'conceive-add'() { FORMS['conceive-add'](); },
  'doc-add'() { FORMS['doc-add'](); },
  'q-add'() { FORMS['q-add'](); }
};
Object.keys(FORM_IDS).forEach((k) => { ACTIONS[k] = () => SAVE[k](readForm(FORM_IDS[k])); });

/* ---------------- 渲染分派 ---------------- */
const RENDERERS = {
  'dash/': pageDash,
  'stage/bleed': pageBleed, 'stage/exam': pageExam, 'stage/path': pagePath, 'stage/figo': pageFigo, 'stage/molecular': pageMolecular, 'stage/compare': pageCompare,
  'treatment/pathway': pagePathway, 'treatment/surgery': pageSurgery, 'treatment/rt': pageRt, 'treatment/systemic': pageSystemic,
  'fertility/decision': pageFertDecision, 'fertility/progestin': pageFertProgestin, 'fertility/conceive': pageFertConceive,
  'lynch/testing': pageLynchTesting, 'lynch/family': pageLynchFamily, 'lynch/comm': pageLynchComm,
  'intimate/symptoms': pageIntimateSymptoms, 'intimate/dilator': pageIntimateDilator, 'intimate/comm': pageIntimateComm,
  'followup/calendar': pageFuCalendar, 'followup/imaging': pageFuImaging, 'followup/comorb': pageFuComorb, 'followup/nutrition': pageFuNutrition,
  'chart/': pageChart,
  'mind/feelings': pageMindFeelings, 'mind/body': pageMindBody, 'mind/fertility': pageMindFertility,
  'docs/library': pageDocsLibrary, 'docs/candidates': pageDocsCandidates, 'docs/prepare': pageDocsPrepare, 'docs/trials': pageDocsTrials
};
function mem() { return profile(); }

/* ---------------- events ---------------- */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const fn = ACTIONS[el.dataset.action];
  if (!fn) return;
  e.preventDefault();
  fn(el);
});
document.addEventListener('change', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const fn = ACTIONS[el.dataset.action];
  if (fn && ['sel', 'q-asked', 'zoom'].includes(el.dataset.action)) { e.preventDefault(); fn(el); }
});
document.addEventListener('input', (e) => {
  const el = e.target.closest('[data-action="zoom"]');
  if (!el) return;
  state.zoom = Number(el.value);
  const span = el.parentElement.querySelector('span'); if (span) span.textContent = `${state.zoom}%`;
  const [t0, t1] = domain();
  const wrap = $('.chart-wrap');
  if (wrap) wrap.outerHTML = chartSVG(t0, t1).replace(/^[\s\S]*?<div class="chart-wrap">/, '<div class="chart-wrap">');
});
$('#profile-btn').addEventListener('click', () => openProfiles());
$('#font-toggle').addEventListener('click', () => ACTIONS['font-toggle']());
$('#agent-splitter').addEventListener('keydown', (e) => {
  if (e.key === 'Home') { e.preventDefault(); state.agent.w = 45; document.documentElement.style.setProperty('--agent-w', '45%'); $('#agent-splitter').setAttribute('aria-valuenow', '45'); }
  else if (e.key === 'End') { e.preventDefault(); state.agent.w = 25; document.documentElement.style.setProperty('--agent-w', '25%'); $('#agent-splitter').setAttribute('aria-valuenow', '25'); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); agentResize(2); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); agentResize(-2); }
});
let dragging = false;
$('#agent-splitter').addEventListener('pointerdown', () => { dragging = true; });
window.addEventListener('pointerup', () => { dragging = false; });
window.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const pct = clampAgentW(100 - (e.clientX / window.innerWidth) * 100);
  state.agent.w = pct;
  document.documentElement.style.setProperty('--agent-w', `${pct}%`);
  $('#agent-splitter').setAttribute('aria-valuenow', String(Math.round(pct)));
});
$('#dialog').addEventListener('click', (e) => { if (e.target === $('#dialog')) closeModal(); });

function applyHash() {
  const raw = (location.hash || '#dash').slice(1);
  const [page, sub] = raw.split('/');
  if (!PAGES.some((x) => x[0] === page)) { state.page = 'dash'; state.sub = {}; return; }
  state.page = page;
  state.sub[page] = sub || (SUBPAGES[page] ? SUBPAGES[page][0][0] : '');
}
/* 打印展开：@media print 的 CSS 无法让 <details> 收起内容进入 printToPDF（content-visibility 仍 hidden）——
   必须在 beforeprint 时把折叠卡设为 open，打印后恢复原状态（评审 P0-2，32 号模版修正）。 */
(function printExpandFoldouts() {
  let prior = null;
  window.addEventListener('beforeprint', () => {
    const folds = [...document.querySelectorAll('details.phase-fold')];
    prior = folds.map((d) => d.open);
    folds.forEach((d) => { d.open = true; });
  });
  window.addEventListener('afterprint', () => {
    if (!prior) return;
    document.querySelectorAll('details.phase-fold').forEach((d, i) => { d.open = Boolean(prior[i]); });
    prior = null;
  });
})();
window.addEventListener('hashchange', () => { applyHash(); render(); });

applyHash();
render();
