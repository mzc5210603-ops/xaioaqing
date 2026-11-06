/* ============ 石板讲台 — 逻辑 ============ */
"use strict";

const LESSONS = [
  { id:"frac", name:"分数运算", chalk:"c-yellow" },
  { id:"gcd",  name:"约数倍数", chalk:"c-white" },
  { id:"prime",name:"质数判断", chalk:"c-pink" },
  { id:"quad", name:"一元二次", chalk:"c-blue" },
  { id:"pc",   name:"排列组合", chalk:"c-green" },
];

/* ---------- 粉笔槽 ---------- */
const tray = document.getElementById("chalkTray");
const boardBody = document.getElementById("boardBody");
LESSONS.forEach(l => {
  const c = document.createElement("button");
  c.className = "chalk " + l.chalk;
  c.textContent = l.name;
  c.title = l.name;
  c.addEventListener("click", () => writeLesson(l, c));
  tray.appendChild(c);
  l._chalk = c;
});
const eraser = document.createElement("span");
eraser.className = "eraser";
eraser.title = "黑板擦（仅装饰）";
tray.appendChild(eraser);

/* ---------- 控件工厂 ---------- */
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
function field(box, text, input) {
  const f = el("div", "b-field");
  f.append(el("label", "", text), input);
  box.appendChild(f);
}
function bInput(val, ph) {
  const i = el("input", "b-input");
  i.type = "text"; i.value = val;
  if (ph) i.placeholder = ph;
  return i;
}
function bSelect(items, idx) {
  const s = el("select", "b-select");
  items.forEach(([v, l], i) => {
    const o = el("option", "", l);
    o.value = v;
    if (i === idx) o.selected = true;
    s.appendChild(o);
  });
  return s;
}
function bBtn(text) { return el("button", "b-btn", text || "演 算"); }
function bOut(box) {
  const o = el("div", "b-out", "—");
  box.appendChild(o);
  return o;
}

const RENDER = {};

/* ---------- 分数运算 ---------- */
RENDER.frac = box => {
  box.appendChild(el("h2", "b-title", "分数运算"));
  const row = el("div", "b-row");
  const a1 = bInput("1"), a2 = bInput("3");
  const op = bSelect([["+","＋"],["-","−"],["*","×"],["/","÷"]], 0);
  const b1 = bInput("1"), b2 = bInput("6");
  field(row, "分子①", a1);
  field(row, "分母①", a2);
  field(row, "运算", op);
  field(row, "分子②", b1);
  field(row, "分母②", b2);
  box.appendChild(row);
  const go = bBtn();
  box.appendChild(go);
  const out = bOut(box);
  const gcd = (x, y) => y ? gcd(y, x % y) : x;
  function frac(n, d) {
    if (d === 0) return null;
    const sign = (n < 0) ^ (d < 0) ? -1 : 1;
    n = Math.abs(n); d = Math.abs(d);
    const g = gcd(n, d) || 1;
    return { n: sign * n / g, d: d / g };
  }
  function show(f) {
    if (!f) return "分母不能为零";
    if (f.d === 1) return String(f.n);
    return `${f.n}/${f.d}`;
  }
  function calc() {
    const n1 = parseInt(a1.value), d1 = parseInt(a2.value);
    const n2 = parseInt(b1.value), d2 = parseInt(b2.value);
    if ([n1, d1, n2, d2].some(isNaN)) { out.textContent = "四个格子都要填整数"; return; }
    let n, d;
    if (op.value === "+") { n = n1 * d2 + n2 * d1; d = d1 * d2; }
    else if (op.value === "-") { n = n1 * d2 - n2 * d1; d = d1 * d2; }
    else if (op.value === "*") { n = n1 * n2; d = d1 * d2; }
    else { n = n1 * d2; d = d1 * n2; }
    const f = frac(n, d);
    out.innerHTML =
      `（${n1}/${d1}）${{ "+":"＋", "-":"－", "*":"×", "/":"÷" }[op.value]}（${n2}/${d2}）<br>` +
      `<span class="big">${show(f)}</span>` +
      (f && f.d !== 1 ? ` ＝ ${(f.n / f.d).toFixed(6)}（小数）` : "");
  }
  go.addEventListener("click", calc);
  [a1, a2, b1, b2, op].forEach(x => x.addEventListener("input", calc));
  calc();
};

/* ---------- 约数倍数 ---------- */
RENDER.gcd = box => {
  box.appendChild(el("h2", "b-title", "约数与倍数"));
  const row = el("div", "b-row");
  const a = bInput("36");
  const b = bInput("60");
  field(row, "第一个数", a);
  field(row, "第二个数", b);
  box.appendChild(row);
  const out = bOut(box);
  function divisors(n) {
    const r = [];
    for (let i = 1; i * i <= n; i++)
      if (n % i === 0) { r.push(i); if (i !== n / i) r.push(n / i); }
    return r.sort((x, y) => x - y);
  }
  function calc() {
    const x = parseInt(a.value), y = parseInt(b.value);
    if (!(x > 0) || !(y > 0)) { out.textContent = "两个正整数"; return; }
    let m = x, n = y;
    while (n) { [m, n] = [n, m % n]; }
    const g = m, l = x * y / g;
    out.innerHTML =
      `最大公约数 <span class="big">${g}</span> · 最小公倍数 <span class="pink big">${l}</span><br>` +
      `${x} 的约数：${divisors(x).join("、")}<br>` +
      `${y} 的约数：${divisors(y).join("、")}<br>` +
      `公因数：${divisors(g).join("、")}`;
  }
  [a, b].forEach(x => x.addEventListener("input", calc));
  calc();
};

/* ---------- 质数判断 ---------- */
RENDER.prime = box => {
  box.appendChild(el("h2", "b-title", "质数判断"));
  const row = el("div", "b-row");
  const a = bInput("97");
  field(row, "输入一个整数", a);
  box.appendChild(row);
  const out = bOut(box);
  function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  }
  function factor(n) {
    const r = [];
    let m = n;
    for (let p = 2; p * p <= m; p++)
      while (m % p === 0) { r.push(p); m /= p; }
    if (m > 1) r.push(m);
    return r;
  }
  function calc() {
    const n = parseInt(a.value);
    if (isNaN(n)) { out.textContent = "填一个整数"; return; }
    if (isPrime(n)) {
      out.innerHTML = `<span class="big">${n}</span> 是<span class="pink">质数</span>，只能被 1 和它本身整除。`;
    } else if (n >= 2) {
      const f = factor(n);
      const tally = {};
      f.forEach(p => tally[p] = (tally[p] || 0) + 1);
      const s = Object.entries(tally).map(([p, c]) => c > 1 ? `${p}^${c}` : p).join(" × ");
      out.innerHTML =
        `<span class="big">${n}</span> 不是质数（合数）<br>` +
        `分解：${s}<br>约数个数：${f.reduce((acc, p) => acc, 1) ? Object.values(tally).map(c => c + 1).reduce((a, b) => a * b, 1) : ""} 个`;
    } else {
      out.innerHTML = `${n} 既不是质数也不是合数。`;
    }
  }
  a.addEventListener("input", calc);
  calc();
};

/* ---------- 一元二次 ---------- */
RENDER.quad = box => {
  box.appendChild(el("h2", "b-title", "一元二次方程"));
  const row = el("div", "b-row");
  const a = bInput("1"), b = bInput("-3"), c = bInput("2");
  field(row, "系数 a", a);
  field(row, "系数 b", b);
  field(row, "系数 c", c);
  box.appendChild(row);
  const out = bOut(box);
  function calc() {
    const A = parseFloat(a.value), B = parseFloat(b.value), C = parseFloat(c.value);
    if ([A, B, C].some(isNaN) || A === 0) {
      out.textContent = A === 0 ? "a 不能为 0，那就不是二次方程了" : "填齐 a b c";
      return;
    }
    const D = B * B - 4 * A * C;
    const delta = `Δ = b² − 4ac = ${D}`;
    const fx = x => (A * x * x + B * x + C).toFixed(6);
    if (D > 0) {
      const r1 = (-B + Math.sqrt(D)) / (2 * A), r2 = (-B - Math.sqrt(D)) / (2 * A);
      out.innerHTML =
        `${delta} ＞ 0，有两个不相等的实根<br>` +
        `x₁ ＝ <span class="big">${+r1.toFixed(6)}</span>　x₂ ＝ <span class="pink big">${+r2.toFixed(6)}</span><br>` +
        `顶点：(−b/2a, f) ＝ (${(-B / (2 * A)).toFixed(4)}, ${(C - B * B / (4 * A)).toFixed(4)})`;
    } else if (D === 0) {
      const r = -B / (2 * A);
      out.innerHTML =
        `${delta} ＝ 0，有两个相等的实根<br>x₁ ＝ x₂ ＝ <span class="big">${+r.toFixed(6)}</span>`;
    } else {
      const re = -B / (2 * A), im = Math.sqrt(-D) / (2 * A);
      out.innerHTML =
        `${delta} ＜ 0，无实根（共轭复根）<br>` +
        `x ＝ <span class="pink">${+re.toFixed(4)} ± ${+im.toFixed(4)}i</span>`;
    }
  }
  [a, b, c].forEach(x => x.addEventListener("input", calc));
  calc();
};

/* ---------- 排列组合 ---------- */
RENDER.pc = box => {
  box.appendChild(el("h2", "b-title", "排列与组合"));
  const row = el("div", "b-row");
  const n = bInput("10");
  const r = bInput("3");
  field(row, "总数 n", n);
  field(row, "取数 r", r);
  box.appendChild(row);
  const out = bOut(box);
  function fact(k) {
    let s = 1n;
    for (let i = 2n; i <= BigInt(k); i++) s *= i;
    return s;
  }
  function calc() {
    const N = parseInt(n.value), R = parseInt(r.value);
    if (!(N >= 0) || !(R >= 0) || R > N || N > 500) {
      out.textContent = "0 ≤ r ≤ n，n ≤ 500（粉笔写不下更大的数）";
      return;
    }
    const P = fact(N) / fact(N - R);
    const C = P / fact(R);
    const show = v => v > 1e15 ? v.toLocaleString() : v.toString();
    out.innerHTML =
      `排列 P(${N}, ${R}) ＝ n!/(n−r)! ＝ <span class="big">${show(P)}</span><br>` +
      `组合 C(${N}, ${R}) ＝ n!/(r!(n−r)!) ＝ <span class="pink big">${show(C)}</span>`;
  }
  [n, r].forEach(x => x.addEventListener("input", calc));
  calc();
};

/* ---------- 板书 ---------- */
function writeLesson(l, chalk) {
  document.querySelectorAll(".chalk").forEach(x => x.classList.remove("active"));
  chalk.classList.add("active");
  boardBody.innerHTML = "";
  RENDER[l.id](boardBody);
}
writeLesson(LESSONS[0], LESSONS[0]._chalk);
