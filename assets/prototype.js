"use strict";

// Interaction prototype for a specialist wine shop. Everything here is generic:
// no real shop, no real products, no real prices. State lives in memory only.

const $ = (s, r = document) => r.querySelector(s);
const now = () => Date.now();
const money = (n) => "$" + n.toLocaleString("en-US");
const HOLD_MS = 15 * 60 * 1000;

/* ---------- Content ---------- */

const wines = [
  { id: "b1", en: "Burgundy red, grand cru", zh: "勃艮第红 · 特级园", year: 2018, type: "red", fmt: "750 ml", price: 2400, stock: 1, shape: "bgy" },
  { id: "b2", en: "Napa Cabernet, estate", zh: "纳帕赤霞珠 · 酒庄装", year: 2019, type: "red", fmt: "750 ml", price: 1150, stock: 2, shape: "bdx" },
  { id: "b3", en: "Bordeaux blend, left bank", zh: "波尔多混酿 · 左岸", year: 2005, type: "red", fmt: "750 ml", price: 890, stock: 1, shape: "bdx" },
  { id: "b4", en: "Vintage Champagne, brut", zh: "年份香槟 · 干型", year: 2008, type: "sparkling", fmt: "750 ml", price: 620, stock: 1, shape: "bgy", heldByOther: true },
  { id: "b5", en: "White Burgundy, premier cru", zh: "勃艮第白 · 一级园", year: 2020, type: "white", fmt: "750 ml", price: 410, stock: 3, shape: "bgy" },
  { id: "b6", en: "Rioja, gran reserva", zh: "里奥哈 · 特级陈酿", year: 2011, type: "red", fmt: "1500 ml", price: 360, stock: 1, shape: "bdx", large: true },
];
const wine = (id) => wines.find((w) => w.id === id);

const TEXT = {
  en: {
    shop: "Shop", trade: "Wholesale", bag: "Bag", proto: "PROTOTYPE",
    h1: "Fine wine, listed bottle by bottle.",
    lead: "Every bottle shows how many are left, what condition it is in and whether it can be shipped to you.",
    browse: "Browse the list", tradeCta: "Buying for a restaurant or shop?",
    list: "The list", search: "Search by name, region or year", try: "Try", alias: "Matched by its Chinese name.", none: "Nothing matches. Clear the search to see the full list.",
    all: "All", red: "Red", white: "White", sparkling: "Sparkling", large: "Large formats",
    left: "left", heldOther: "Held by another buyer", heldYou: "Held for you", sold: "Sold",
    format: "Format", condition: "Condition", conditionV: "Label clean, fill into the neck, capsule intact", storage: "Storage", storageV: "Temperature-controlled since release",
    where: "Where is it going?", d1: "A state that allows wine shipments", d1s: "Ships with an adult signature on delivery.", d2: "A state that restricts wine shipments", d2s: "Cannot be shipped. You can send an enquiry.", d3: "Outside the country", d3s: "Enquiry only.",
    age: "I am 21 or older, and an adult will sign for the delivery.",
    reserve: "Hold it for 15 minutes and check out", enquire: "Send an enquiry", needAge: "Confirm your age to continue.",
    checkout: "Checkout", s1: "Delivery address", s1s: "Saved address on the account", s2: "Delivery", s2s: "Courier, adult signature required", s3: "Payment", s3s: "Simulated card",
    held: "Held for you", pay: "Pay", paying: "Paying…", ff: "Fast-forward the clock", item: "Bottle", delivery: "Insured delivery", total: "Total",
    expired: "The hold ran out.", expiredS: "The bottle is back on the list for everyone. Nothing was charged.", back: "Back to the list",
    done: "Order placed.", doneS: "One payment was taken. A second press of the button would have been ignored.", t1: "Paid", t2: "Picking", t3: "Out for delivery",
    req: "Request", quote: "Quote", inv: "Invoice", reqS: "You choose bottles and quantities", quoteS: "Trade prices, stock held for you", invS: "Pay on terms",
    tradeH: "Wholesale order", wineC: "Wine", fmtC: "Format", qtyC: "Qty", listC: "List", tradeC: "Trade", lineC: "Line",
    send: "Send request", accept: "Accept quote", change: "Ask for a change", heldTrade: "Stock is held for 7 days while you decide.", invoiced: "Invoice issued. Due in 15 days. The bottles stay held until then.",
    atList: "At list price", tradePricing: "Trade pricing", tax: "Sales tax", taxS: "resale certificate on file", summary: "Summary", again: "Start another request",
  },
  zh: {
    shop: "选酒", trade: "批发", bag: "购物袋", proto: "原型",
    h1: "精品葡萄酒，逐瓶列出。",
    lead: "每一瓶都写明还剩几瓶、品相如何、能不能寄到你所在的地方。",
    browse: "查看酒单", tradeCta: "为餐厅或酒行采购？",
    list: "酒单", search: "按名称、产区或年份搜索", try: "试试", alias: "通过中文名匹配。", none: "没有匹配的酒。清空搜索可查看全部。",
    all: "全部", red: "红", white: "白", sparkling: "起泡", large: "大瓶装",
    left: "瓶", heldOther: "其他买家已锁定", heldYou: "已为你保留", sold: "已售出",
    format: "容量", condition: "品相", conditionV: "酒标完好，液面至瓶颈，封帽完整", storage: "储存", storageV: "出厂后一直恒温保存",
    where: "寄到哪里？", d1: "允许邮寄葡萄酒的州", d1s: "可以寄送，签收人须为成年人。", d2: "限制邮寄葡萄酒的州", d2s: "无法寄送，可以提交咨询。", d3: "国外", d3s: "仅接受咨询。",
    age: "我已满 21 岁，并且会由成年人签收。",
    reserve: "保留 15 分钟并结账", enquire: "提交咨询", needAge: "请先确认年龄。",
    checkout: "结账", s1: "收货地址", s1s: "账户里保存的地址", s2: "配送", s2s: "快递，成年人签收", s3: "付款", s3s: "模拟银行卡",
    held: "已为你保留", pay: "支付", paying: "支付中…", ff: "快进时间", item: "酒款", delivery: "保价配送", total: "合计",
    expired: "保留时间已到。", expiredS: "这瓶酒已重新上架，没有产生任何扣款。", back: "返回酒单",
    done: "下单成功。", doneS: "只扣款一次。重复点击支付按钮会被忽略。", t1: "已付款", t2: "拣货中", t3: "配送中",
    req: "询价", quote: "报价", inv: "发票", reqS: "选择酒款和数量", quoteS: "批发价，库存为你保留", invS: "按账期付款",
    tradeH: "批发订单", wineC: "酒款", fmtC: "容量", qtyC: "数量", listC: "零售价", tradeC: "批发价", lineC: "小计",
    send: "提交询价", accept: "接受报价", change: "要求修改", heldTrade: "在你决定期间，库存保留 7 天。", invoiced: "发票已开出，15 天内付款。酒款保留到付款为止。",
    atList: "按零售价", tradePricing: "批发优惠", tax: "销售税", taxS: "已提供转售证明", summary: "汇总", again: "发起新的询价",
  },
};

/* ---------- State ---------- */

const fresh = () => ({
  flow: "shop", screen: "home", lang: "en", device: "desktop",
  filter: "all", q: "", bottle: "b1", dest: "d1", age: false,
  holdEnds: 0, expired: false, paying: false, dupe: false, sold: {},
  trade: { step: 0, qty: { b4: 6, b3: 3, b5: 12 } },
  role: "owner", picked: {}, refund: "none",
  audit: [["Trade price changed on a quote", "Advisor"], ["Lot reserved, then sold", "System"]],
});
let state = fresh();
const t = (k) => TEXT[state.lang][k] ?? TEXT.en[k] ?? k;
const nameOf = (w) => `${w[state.lang]} ${w.year}`;
const holding = () => state.holdEnds > now() && !state.expired;

/* ---------- Small building blocks ---------- */

const bottle = (w, width, height) => `<svg class="bt ${w.type}" width="${width}" height="${height}" aria-hidden="true"><use href="#${w.shape}"/></svg>`;
const nav = (current) => `
  <div class="s-nav">
    <div class="s-brand">WINE SHOP<small>${t("proto")}</small></div>
    <div class="s-links">
      <button data-act="flow:shop" ${current === "shop" ? 'aria-current="true"' : ""}>${t("shop")}</button>
      <button class="wide" data-act="flow:trade" ${current === "trade" ? 'aria-current="true"' : ""}>${t("trade")}</button>
      <button data-act="lang:${state.lang === "en" ? "zh" : "en"}">${state.lang === "en" ? "中文" : "EN"}</button>
      <button data-act="go:${holding() ? "checkout" : "list"}">${t("bag")} ${holding() ? 1 : 0}</button>
    </div>
  </div>`;

function stockState(w) {
  if (state.sold[w.id]) return { label: t("sold"), cls: "", off: true };
  if (w.heldByOther) return { label: `${t("heldOther")} · 09:12`, cls: "warn", off: true };
  if (holding() && state.bottle === w.id) return { label: t("heldYou"), cls: "accent", off: false };
  return { label: state.lang === "zh" ? `剩 ${w.stock} ${t("left")}` : `${w.stock} ${t("left")}`, cls: w.stock === 1 ? "accent" : "ok", off: false };
}

/* ---------- Shop screens ---------- */

const shop = {
  home: () => `${nav("shop")}
    <section class="hero">
      <div>
        <span class="eyebrow">${state.lang === "zh" ? "专业葡萄酒零售" : "Specialist wine retail"}</span>
        <h1 class="h-xl" style="margin-top:14px">${t("h1")}</h1>
        <p class="lead" style="margin-top:18px">${t("lead")}</p>
        <div class="actions"><button class="btn" data-act="go:list">${t("browse")}</button><button class="btn secondary" data-act="flow:trade">${t("tradeCta")}</button></div>
      </div>
      <div class="ph">${bottle(wine("b1"), 110, 366)}</div>
    </section>
    <section class="tiles">${["b1", "b2", "b5"].map((id) => { const w = wine(id); const s = stockState(w); return `
      <button class="tile" data-act="open:${id}"><div class="ph">${bottle(w, 46, 152)}</div><div class="h-md">${nameOf(w)}</div>
      <div class="meta"><span class="price">${money(w.price)}</span><span class="chip ${s.cls}">${s.label}</span></div></button>`; }).join("")}
    </section>`,

  list: () => `${nav("shop")}
    <section class="pad">
      <div class="list-head"><h1 class="h-lg">${t("list")}</h1>
        <div class="filters">${["all", "red", "white", "sparkling", "large"].map((f) => `<button data-act="filter:${f}" aria-pressed="${state.filter === f}">${t(f)}</button>`).join("")}</div></div>
      <div class="search"><input id="q" type="search" value="${state.q}" placeholder="${t("search")}" aria-label="${t("search")}">
        <div class="sugg"><span class="hint">${t("try")}:</span><button data-act="q:香槟">香槟</button><button data-act="q:Napa">Napa</button><button data-act="q:2005">2005</button></div></div>
      <div id="rows">${rows()}</div>
    </section>`,

  bottle: () => { const w = wine(state.bottle); const s = stockState(w); const ship = state.dest === "d1"; return `${nav("shop")}
    <section class="pad"><div class="bottle">
      <div class="ph">${bottle(w, 150, 500)}</div>
      <div>
        <span class="eyebrow">${t(w.type)} · ${w.fmt}</span>
        <h1 class="h-lg" style="margin-top:10px">${nameOf(w)}</h1>
        <div style="display:flex;gap:12px;align-items:center;margin-top:14px"><span class="price" style="font-size:26px">${money(w.price)}</span><span class="chip ${s.cls}">${s.label}</span></div>
        <dl class="facts"><div><dt>${t("format")}</dt><dd>${w.fmt}</dd></div><div><dt>${t("condition")}</dt><dd>${t("conditionV")}</dd></div><div><dt>${t("storage")}</dt><dd>${t("storageV")}</dd></div></dl>
        <div class="box"><h4>${t("where")}</h4>
          ${["d1", "d2", "d3"].map((d) => `<button class="opt" role="radio" aria-checked="${state.dest === d}" data-act="dest:${d}"><i></i><span>${t(d)}<small>${t(d + "s")}</small></span></button>`).join("")}
          ${ship ? `<button class="check" role="checkbox" aria-checked="${state.age}" data-act="age"><i>${state.age ? "✓" : ""}</i><span>${t("age")}</span></button>
            <button class="btn block" data-act="reserve" ${state.age ? "" : "disabled"}>${t("reserve")}</button>${state.age ? "" : `<div class="hint" style="margin-top:8px">${t("needAge")}</div>`}`
          : `<div class="msg">${t(state.dest + "s")}</div><button class="btn secondary block" style="margin-top:12px" data-act="enquire">${t("enquire")}</button>`}
        </div>
      </div></div></section>`; },

  checkout: () => { const w = wine(state.bottle); if (state.expired) return `${nav("shop")}
    <section class="center"><span class="chip danger">00:00</span><h1 class="h-lg" style="margin-top:16px">${t("expired")}</h1><p class="lead" style="margin:12px auto 26px">${t("expiredS")}</p><button class="btn" data-act="go:list">${t("back")}</button></section>`;
    return `${nav("shop")}
    <section class="pad"><h1 class="h-lg" style="margin-bottom:20px">${t("checkout")}</h1><div class="checkout">
      <ol class="steps">${[1, 2, 3].map((n) => `<li><span class="n">${n}</span><div><b>${t("s" + n)}</b><small>${t("s" + n + "s")}</small></div></li>`).join("")}</ol>
      <div class="summary">
        <div class="clock"><span class="eyebrow">${t("held")}</span><b id="clock">${clockText()}</b></div>
        <div class="meter"><i id="meter" style="width:${meterPct()}%"></i></div>
        <div class="sum"><div><span>${nameOf(w)}</span><span>${money(w.price)}</span></div><div><span>${t("delivery")}</span><span>${money(45)}</span></div><div class="total"><span>${t("total")}</span><span>${money(w.price + 45)}</span></div></div>
        <button class="btn accent block" style="margin-top:16px" data-act="pay">${state.paying ? t("paying") : `${t("pay")} ${money(w.price + 45)}`}</button>
        ${state.dupe ? `<div class="msg ok">${state.lang === "zh" ? "第二次点击已忽略：同一次结账只扣款一次。" : "Second press ignored: same checkout attempt, one charge."}</div>` : ""}
        <button class="linkbtn" style="margin-top:14px" data-act="ff">${t("ff")}</button>
      </div></div></section>`; },

  done: () => { const w = wine(state.bottle); return `${nav("shop")}
    <section class="center"><span class="chip ok">${state.lang === "zh" ? "扣款 1 次" : "1 charge"}</span><h1 class="h-lg" style="margin-top:16px">${t("done")}</h1>
      <p class="lead" style="margin:12px auto 0">${nameOf(w)} · ${money(w.price + 45)}</p><p class="hint" style="margin-top:8px">${t("doneS")}</p>
      <div class="track"><span class="chip ok">${t("t1")}</span><span class="chip">${t("t2")}</span><span class="chip">${t("t3")}</span></div>
      <button class="btn" data-act="go:list">${t("back")}</button></section>`; },
};

function rows() {
  const q = state.q.trim().toLowerCase();
  const match = (w) => (state.filter === "all" || (state.filter === "large" ? w.large : w.type === state.filter)) && (!q || `${w.en} ${w.year} ${w.fmt}`.toLowerCase().includes(q) || w.zh.includes(q));
  const found = wines.filter(match);
  const viaAlias = q && found.length && found.every((w) => w.zh.includes(q) && !w.en.toLowerCase().includes(q));
  if (!found.length) return `<p class="hint" style="padding:22px 8px">${t("none")}</p>`;
  return `${viaAlias ? `<p class="hint" style="margin-bottom:10px">${t("alias")}</p>` : ""}<div class="rows">${found.map((w) => { const s = stockState(w); return `
    <button class="row" data-act="open:${w.id}" ${s.off ? "disabled" : ""}><div class="ph">${bottle(w, 20, 66)}</div>
      <div><div class="name">${nameOf(w)}</div><div class="sub">${t(w.type)} · ${w.fmt}</div></div>
      <div class="price">${money(w.price)}</div><div class="state"><span class="chip ${s.cls}">${s.label}</span></div></button>`; }).join("")}</div>`;
}

const left = () => Math.max(0, state.holdEnds - now());
const clockText = () => { const s = Math.ceil(left() / 1000); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
const meterPct = () => Math.round((left() / HOLD_MS) * 100);

/* ---------- Wholesale ---------- */

const tradePrice = (w) => Math.round((w.price * 0.9) / 5) * 5;
function trade() {
  const step = state.trade.step; const ids = Object.keys(state.trade.qty);
  const sumList = ids.reduce((a, id) => a + wine(id).price * state.trade.qty[id], 0);
  const sumTrade = ids.reduce((a, id) => a + tradePrice(wine(id)) * state.trade.qty[id], 0);
  const bottles = ids.reduce((a, id) => a + state.trade.qty[id], 0);
  const stepper = `<ol class="stepper">${["req", "quote", "inv"].map((k, i) => `<li class="${i < step ? "done" : i === step ? "now" : ""}"><b>${t(k)}</b>${t(k + "S")}</li>`).join("")}</ol>`;
  const body = ids.map((id) => { const w = wine(id); const n = state.trade.qty[id]; return `<tr><td><b>${nameOf(w)}</b></td><td>${w.fmt}</td>
    <td class="r">${step === 0 ? `<span class="qty"><button data-act="qty:-${id}" aria-label="less">−</button>${n}<button data-act="qty:+${id}" aria-label="more">+</button></span>` : n}</td>
    <td class="r">${money(w.price)}</td>${step > 0 ? `<td class="r">${money(tradePrice(w))}</td><td class="r">${money(tradePrice(w) * n)}</td>` : ""}</tr>`; }).join("");
  const side = step === 0
    ? `<div class="summary"><span class="eyebrow">${t("summary")}</span><div class="sum" style="margin-top:8px"><div><span>${bottles} × ${t("atList")}</span><span>${money(sumList)}</span></div></div><button class="btn block" style="margin-top:14px" data-act="send" ${bottles ? "" : "disabled"}>${t("send")}</button></div>`
    : `<div class="summary"><span class="eyebrow">${t("summary")}</span><div class="sum" style="margin-top:8px"><div><span>${bottles} × ${t("atList")}</span><span>${money(sumList)}</span></div><div><span>${t("tradePricing")}</span><span>−${money(sumList - sumTrade)}</span></div><div><span>${t("tax")} · <span class="hint">${t("taxS")}</span></span><span>$0</span></div><div class="total"><span>${t("total")}</span><span>${money(sumTrade)}</span></div></div>
        ${step === 1 ? `<div class="msg">${t("heldTrade")}</div><button class="btn block" style="margin-top:14px" data-act="accept">${t("accept")}</button><button class="btn secondary block" style="margin-top:8px" data-act="change">${t("change")}</button>`
          : `<div class="msg ok">${t("invoiced")}</div><button class="btn secondary block" style="margin-top:14px" data-act="change">${t("again")}</button>`}</div>`;
  return `${nav("trade")}<section class="pad"><span class="eyebrow">${t("trade")}</span><h1 class="h-lg" style="margin-top:8px">${t("tradeH")}</h1>${stepper}
    <div class="trade"><table><thead><tr><th>${t("wineC")}</th><th>${t("fmtC")}</th><th class="r">${t("qtyC")}</th><th class="r">${t("listC")}</th>${step > 0 ? `<th class="r">${t("tradeC")}</th><th class="r">${t("lineC")}</th>` : ""}</tr></thead><tbody>${body}</tbody></table>${side}</div></section>`;
}

/* ---------- Staff workspace ---------- */

const ROLES = { owner: "Owner", advisor: "Advisor", warehouse: "Warehouse", support: "Support" };
const AREAS = [["Overview", ["owner"]], ["Orders", ["owner", "support"]], ["Stock and lots", ["owner", "warehouse"]], ["Clients and allocations", ["owner", "advisor"]], ["Wholesale quotes", ["owner", "advisor"]], ["Picks and shipments", ["owner", "warehouse"]], ["Claims and tickets", ["owner", "support"]], ["Audit trail", ["owner"]]];
// The area each role lands on.
const HOME = { owner: "Overview", advisor: "Clients and allocations", warehouse: "Picks and shipments", support: "Claims and tickets" };
const PICKS = [["p1", "Burgundy red, grand cru 2018", "Rack A · 1 bottle"], ["p2", "White Burgundy, premier cru 2020", "Rack C · 3 bottles"], ["p3", "Rioja, gran reserva 2011", "Rack F · 1 magnum"]];

function staff() {
  const r = state.role; const open = PICKS.filter((p) => !state.picked[p[0]]);
  const panels = {
    owner: `<div class="cards"><div class="card"><span>Open orders</span><b>12</b></div><div class="card"><span>Awaiting pick</span><b>${open.length}</b></div><div class="card"><span>Bottles on hold</span><b>2</b></div><div class="card"><span>Quotes awaiting reply</span><b>4</b></div></div>
      <div class="cols"><div class="panel"><h4>Needs a decision</h4>
        ${state.refund === "drafted" ? `<div class="item"><div>Refund drafted by Support<small>Cork failure reported · ${money(620)}</small></div><button class="mini go" data-act="approve">Approve</button></div>` : ""}
        ${state.refund === "approved" ? `<div class="item"><div>Refund approved<small>${money(620)} returned to the buyer</small></div><span class="chip ok">Done</span></div>` : ""}
        <div class="item"><div>Three clients asked for the last two magnums<small>The advisor recommends by purchase history</small></div><span class="chip">Allocation</span></div></div>
        <div class="panel"><h4>Audit trail</h4>${state.audit.slice(0, 5).map((a) => `<div class="item"><div>${a[0]}<small>${a[1]}</small></div></div>`).join("")}</div></div>`,
    advisor: `<div class="cols"><div class="panel"><h4>Clients</h4>
        <div class="item"><div>Restaurant account<small>Asked for 21 bottles · quote not sent yet</small></div><button class="mini go" data-act="say:Quote sent. The stock is now held for this client.">Send quote</button></div>
        <div class="item"><div>Private collector<small>Nominated for a magnum</small></div><span class="chip">Waiting on owner</span></div></div>
        <div class="panel"><h4>What this role cannot do</h4><div class="item"><div>Approve refunds, change stock, read the audit trail<small>Those sit with the owner and the warehouse.</small></div></div></div></div>`,
    warehouse: `<div class="cols"><div class="panel"><h4>Pick list</h4>${open.length ? open.map((p) => `<div class="item"><div>${p[1]}<small>${p[2]}</small></div><button class="mini go" data-act="pick:${p[0]}">Mark picked</button></div>`).join("") : `<div class="item"><div>Nothing left to pick.</div></div>`}</div>
        <div class="panel"><h4>Packed today</h4>${PICKS.filter((p) => state.picked[p[0]]).map((p) => `<div class="item"><div>${p[1]}<small>Adult signature label printed</small></div><span class="chip ok">Packed</span></div>`).join("") || `<div class="item"><div class="hint">Picked bottles appear here.</div></div>`}</div></div>`,
    support: `<div class="cols"><div class="panel"><h4>Claims</h4><div class="item"><div>Cork failure reported on a delivered bottle<small>Vintage Champagne, brut 2008 · ${money(620)}</small></div>
        ${state.refund === "none" ? `<button class="mini go" data-act="draft">Draft refund</button>` : `<span class="chip ${state.refund === "approved" ? "ok" : "warn"}">${state.refund === "approved" ? "Refunded" : "Waiting on owner"}</span>`}</div></div>
        <div class="panel"><h4>What this role cannot do</h4><div class="item"><div>Send money back on its own<small>Support drafts the refund. The owner approves it.</small></div></div></div></div>`,
  };
  return `<div class="desk"><aside class="side"><div class="s-brand">WINE SHOP</div><div class="who"><b>${ROLES[r]}</b>Signed in</div>
      <ul>${AREAS.map(([name, who]) => `<li class="${who.includes(r) ? (name === HOME[r] ? "on" : "") : "off"}">${name}</li>`).join("")}</ul></aside>
    <div class="work"><div class="work-head"><div><span class="eyebrow">Staff workspace</span><h1 class="h-lg" style="margin-top:6px">${ROLES[r]}</h1></div>
      <div class="seg">${Object.keys(ROLES).map((k) => `<button data-act="role:${k}" aria-pressed="${r === k}">${ROLES[k]}</button>`).join("")}</div></div>${panels[r]}</div></div>`;
}

/* ---------- Design system ---------- */

const system = () => `<section class="pad"><h1 class="h-lg" style="margin-bottom:26px">Design system and structure</h1><div class="sys">
  <h3>Colour</h3>
  ${[["#ffffff", "Paper", "Surfaces"], ["#f6f5f1", "Tint", "Panels, hover"], ["#1d1d1b", "Ink", "Text, primary action"], ["#6b6a65", "Muted", "Secondary text"], ["#6a1e2d", "Accent", "The one thing to notice"], ["#2f6b4f", "Positive", "Paid, in stock"]].map((c) => `<div class="sw"><i style="background:${c[0]}"></i><b>${c[1]}</b><span>${c[0]} · ${c[2]}</span></div>`).join("")}
  <h3>Type and components</h3>
  <div class="spec"><div class="line"><span>Display</span><span class="h-lg">Listed bottle by bottle</span></div><div class="line"><span>Heading</span><span class="h-md">Burgundy red, grand cru 2018</span></div><div class="line"><span>Body</span><span>System sans at 15 px. Chinese falls back to PingFang and Noto Sans.</span></div><div class="line"><span>Label</span><span class="eyebrow">Small capitals for labels</span></div><div class="line"><span>Figures</span><span class="price" style="font-size:20px">$2,400 · 14:59 · 750 ml</span></div></div>
  <div class="comp"><span class="btn">Primary</span><span class="btn accent">Pay</span><span class="btn secondary">Secondary</span><span class="chip accent">1 left</span><span class="chip ok">Paid</span><span class="chip warn">Held by another buyer</span><span class="chip danger">00:00</span></div>
  <h3>Two flows that have to be exact</h3>
  <div class="fl"><b>The last bottle</b><ol><li>Several people start checkout for the same bottle at once.</li><li class="key">Each attempt tries to reserve it.<small>The reservation and the stock count change together, or not at all.</small></li><li>One buyer gets a 15-minute hold. The others see that it is held.</li><li>An unpaid hold expires, and the bottle is listed again.</li></ol></div>
  <div class="fl"><b>The payment</b><ol><li>The buyer presses Pay, the page stalls, and they press it again.</li><li class="key">Both presses carry the same key for this checkout attempt.<small>The second one finds the first and returns its result.</small></li><li>One charge is recorded, and one order is created from it.</li></ol></div>
  <h3>Data model, by area</h3>
  <div class="areas">${[["Identity and access", "Accounts, sessions, roles"], ["Catalog", "Wines, formats, collections"], ["Inventory", "Lots, reservations, allocations"], ["Checkout", "Bags, quotes, payment attempts"], ["Orders and payments", "Orders, refunds, receipts"], ["Wholesale", "Requests, trade quotes, invoices"], ["Fulfilment and service", "Shipments, claims, tickets"], ["Operations", "Jobs, alerts, audit events"]].map((a) => `<div><b>${a[0]}</b><span>${a[1]}</span></div>`).join("")}</div>
</div></section>`;

/* ---------- Notes shown beside each screen ---------- */

const NOTES = {
  "shop:home": ["Home", ["One sentence carries the offer. No carousel, no promotion strip.", "Stock shows on the very first tiles, because most bottles exist once.", "The language switch sits in the main navigation, not in a footer."], ["Open a bottle from the tiles", "Switch to 中文 and back", "Switch the frame to Phone"]],
  "shop:list": ["The list", ["A merchant's list instead of a grid of cards: name, format, price, stock in one scan.", "A held bottle stays visible but cannot be opened, with the time left on the hold.", "Search understands Chinese names for wines listed in English, and says so when it matched that way."], ["Press 香槟 to search by a Chinese name", "Filter to Sparkling: the only bottle is held", "Open any available row"]],
  "shop:bottle": ["Bottle page", ["The shipping rule is decided here, before checkout, so nothing fails late.", "A destination that cannot receive wine turns the purchase into an enquiry.", "The primary button stays disabled until the age confirmation is ticked, and says why."], ["Choose each destination and watch the box change", "Tick the age confirmation", "Hold the bottle to start the 15-minute clock"]],
  "shop:checkout": ["Checkout", ["The hold is a visible clock, so the buyer knows the bottle is theirs and for how long.", "Pressing Pay twice produces one charge, and the screen says so.", "When the clock runs out the bottle goes back on the list and nothing is charged."], ["Press Pay twice quickly", "Or fast-forward the clock to see the hold expire"]],
  "shop:done": ["Confirmation", ["The confirmation repeats the one fact that matters after a double press: one charge.", "Back on the list, the bottle now shows as sold."], ["Go back to the list and find the sold bottle"]],
  "trade:0": ["Wholesale · request", ["Restaurants and shops do not use a bag. They ask for a price.", "Quantities are edited in place; the summary follows."], ["Change a quantity", "Send the request"]],
  "trade:1": ["Wholesale · quote", ["List and trade prices sit side by side, so the quote explains itself.", "The quote holds stock while the buyer decides, and says for how long.", "Sales tax is zero because a resale certificate is on file, and the line says why."], ["Accept the quote", "Or ask for a change to go back"]],
  "trade:2": ["Wholesale · invoice", ["Accepting turns the quote into an invoice on terms. The stepper shows where the order is.", "Stock stays held until the invoice is paid."], ["Start another request"]],
  "staff:owner": ["Staff · owner", ["All four roles share one frame. Areas a role cannot use are struck out, not hidden, so the boundaries are visible in this prototype.", "Anything that needs a person is separated from the tables.", "Every change is written to the audit trail with the role that made it."], ["Switch to Support and draft a refund", "Come back here to approve it", "Watch the audit trail grow"]],
  "staff:advisor": ["Staff · advisor", ["The advisor works with clients, quotes and allocations, and nothing else.", "Sending a quote is what places the hold on stock."], ["Send the quote"]],
  "staff:warehouse": ["Staff · warehouse", ["A pick list with one action per line.", "Picked bottles move to Packed, and the owner's count drops."], ["Mark a bottle picked", "Check the count on the Owner view"]],
  "staff:support": ["Staff · support", ["Support can draft a refund but cannot send money. The owner approves.", "The claim shows its state to both roles."], ["Draft the refund", "Switch to Owner to approve it"]],
  "system:system": ["Design system", ["One neutral type family, one accent colour, drawn placeholders instead of photographs.", "Colour is kept for state: stock, holds, payment, errors.", "The data model is shown by area only."], ["Scroll the page"]],
};

/* ---------- Rendering ---------- */

const FLOWS = { shop: [["home", "Home"], ["list", "List"], ["bottle", "Bottle"], ["checkout", "Checkout"], ["done", "Confirmation"]], trade: [["0", "Request"], ["1", "Quote"], ["2", "Invoice"]], staff: Object.entries(ROLES), system: [] };
const viewKey = () => (state.flow === "shop" ? `shop:${state.screen}` : state.flow === "trade" ? `trade:${state.trade.step}` : state.flow === "staff" ? `staff:${state.role}` : "system:system");

function render() {
  const key = viewKey(); const note = NOTES[key];
  $("#screen").innerHTML = state.flow === "shop" ? shop[state.screen]() : state.flow === "trade" ? trade() : state.flow === "staff" ? staff() : system();
  $("#device").className = `device ${state.device}`;
  $("#frame-name").textContent = `${{ shop: "Shop", trade: "Wholesale", staff: "Staff", system: "System" }[state.flow]} / ${note[0]}`;
  $("#frame-size").textContent = state.device === "phone" ? "Phone · 390" : "Desktop · 1280";
  $("#notes").innerHTML = `<div class="where">${$("#frame-name").textContent}</div><h2>${note[0]}</h2><h3>Design decisions</h3><ul>${note[1].map((n) => `<li>${n}</li>`).join("")}</ul><h3>Try it</h3><ul class="try">${note[2].map((n) => `<li>${n}</li>`).join("")}</ul>`;
  const current = key.split(":")[1];
  $("#flow").innerHTML = FLOWS[state.flow].map(([id, label], i) => `${i ? '<span class="arrow">→</span>' : ""}<button data-act="${state.flow === "shop" ? "go" : state.flow === "trade" ? "tstep" : "role"}:${id}" aria-current="${id === current}">${label}</button>`).join("") || "<span>Reference page: colour, type, components, flows and data model areas.</span>";
  document.querySelectorAll("[data-flow]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.flow === state.flow));
  document.querySelectorAll("[data-device]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.device === state.device));
  fit();
}

function fit() { const s = $("#screen"); s.style.setProperty("--z", state.device === "phone" ? 1 : Math.min(1, $("#device").clientWidth / 1280)); }
let toastTimer;
function toast(msg) { const el = $("#toast"); el.textContent = msg; el.classList.add("on"); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("on"), 3200); }
const log = (what, who) => state.audit.unshift([what, who]);

/* ---------- Actions ---------- */

const actions = {
  flow: (f) => { state.flow = f; if (f === "shop" && !shop[state.screen]) state.screen = "home"; },
  go: (s) => { state.flow = "shop"; if (s === "checkout" && !holding() && !state.expired) s = "bottle"; if (s === "done" && !state.sold[state.bottle]) s = "checkout"; if (s === "list") state.expired = false; state.screen = s; },
  open: (id) => { state.bottle = id; state.screen = "bottle"; state.dupe = false; },
  filter: (f) => { state.filter = f; },
  q: (v) => { state.q = v; state.filter = "all"; },
  dest: (d) => { state.dest = d; },
  age: () => { state.age = !state.age; },
  reserve: () => { state.holdEnds = now() + HOLD_MS; state.expired = false; state.paying = false; state.dupe = false; state.screen = "checkout"; },
  enquire: () => toast(state.lang === "zh" ? "咨询已提交（原型演示）。" : "Enquiry sent. (Prototype: nothing is sent anywhere.)"),
  ff: () => { state.holdEnds = now() + 4000; toast(state.lang === "zh" ? "时间已快进，还剩几秒。" : "Clock moved forward. A few seconds are left."); },
  pay: () => { if (state.paying) { state.dupe = true; return; } state.paying = true; setTimeout(() => { if (state.screen !== "checkout" || state.expired) return; state.paying = false; state.sold[state.bottle] = true; state.holdEnds = 0; state.screen = "done"; render(); }, 1800); },
  lang: (l) => { state.lang = l; },
  device: (d) => { state.device = d; },
  restart: () => { const keep = { lang: state.lang, device: state.device }; state = Object.assign(fresh(), keep); },
  qty: (v) => { const id = v.slice(1); state.trade.qty[id] = Math.max(0, state.trade.qty[id] + (v[0] === "+" ? 1 : -1)); },
  send: () => { state.trade.step = 1; },
  accept: () => { state.trade.step = 2; log("Quote accepted, invoice issued", "Client"); },
  change: () => { state.trade.step = 0; },
  // The step chips only go backwards; moving forward takes the real action on the screen.
  tstep: (n) => { state.trade.step = Math.min(+n, state.trade.step); },
  role: (r) => { state.flow = "staff"; state.role = r; },
  pick: (id) => { state.picked[id] = true; log("Bottle picked and packed", "Warehouse"); },
  draft: () => { state.refund = "drafted"; log("Refund drafted", "Support"); toast("Sent to the owner for approval. Switch to Owner to approve it."); },
  approve: () => { state.refund = "approved"; log("Refund approved", "Owner"); },
  say: (m) => { log("Quote sent, stock held", "Advisor"); toast(m); },
};

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]"); if (!el || el.disabled) return;
  const [name, ...rest] = el.dataset.act.split(":"); const arg = rest.join(":");
  actions[name]?.(arg); render();
});
document.addEventListener("input", (e) => { if (e.target.id !== "q") return; state.q = e.target.value; $("#rows").innerHTML = rows(); });
window.addEventListener("resize", fit);

// The hold clock. When it reaches zero the bottle is released.
setInterval(() => {
  if (state.flow !== "shop" || state.screen !== "checkout" || state.expired) return;
  if (left() <= 0) { state.expired = true; state.paying = false; state.holdEnds = 0; render(); return; }
  const c = $("#clock"); if (c) c.textContent = clockText();
  const m = $("#meter"); if (m) m.style.width = meterPct() + "%";
}, 500);

render();
