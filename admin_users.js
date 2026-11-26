/* Speakora admin: user access manager. Loaded on demand from admin.js. Admin only.
   Reads users (where email == X), subscriptions/{uid}, entitlements/{uid}.
   Writes subscriptions/{uid} (levels, until, blocked, trialStart) and entitlements/{uid} (premium) exactly as the published rules allow. */
(function () {
  "use strict";
  var ADMIN = "abdonateai92@gmail.com", LEVELS = ["A1", "A2", "B1", "B2"], DAY = 86400000;
  function el(tag, css, text) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (text != null) e.textContent = text; return e; }
  var INP = "width:100%;box-sizing:border-box;padding:10px;border-radius:10px;border:1px solid #475569;background:#0f172a;color:#f8fafc;font-size:1rem;direction:ltr;";
  function b(label, bg, fn) { var x = el("button", "padding:9px 12px;border-radius:10px;border:0;background:" + bg + ";color:#fff;font-weight:700;margin:3px;", label); x.onclick = fn; return x; }
  function fmt(ms) { return new Date(ms).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" }); }
  function toMs(v) { if (!v) return 0; if (v.toMillis) return v.toMillis(); return Number(v) || 0; }

  function open() {
    var fbA, fbD;
    try { fbA = firebase.auth(); fbD = firebase.firestore(); } catch (e) { alert("Firebase غير جاهز"); return; }
    var me = fbA.currentUser;
    if (!me || (me.email || "").toLowerCase() !== ADMIN) return;
    var old = document.getElementById("sp-usr-sheet"); if (old) old.remove();
    var wrap = el("div", "position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.7);display:flex;align-items:flex-end;justify-content:center;");
    wrap.id = "sp-usr-sheet";
    var box = el("div", "background:#1e293b;color:#f8fafc;width:100%;max-width:520px;max-height:92vh;overflow:auto;border-radius:18px 18px 0 0;padding:16px;direction:rtl;font-family:inherit;");
    wrap.appendChild(box); document.body.appendChild(wrap);
    wrap.addEventListener("click", function (e) { if (e.target === wrap) wrap.remove(); });
    box.appendChild(el("div", "font-weight:800;font-size:1.1rem;", "👥 إدارة المستخدمين"));
    var inp = el("input", INP); inp.type = "email"; inp.placeholder = "اكتب إيميل المستخدم كامل"; inp.style.margin = "10px 0";
    box.appendChild(inp);
    var row = el("div", "display:flex;gap:8px;");
    var go = b("🔍 بحث", "#16a34a", search); go.style.flex = "1";
    row.appendChild(go); row.appendChild(b("إغلاق", "#334155", function () { wrap.remove(); }));
    box.appendChild(row);
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") search(); });
    var msg = el("div", "margin:8px 0;font-size:.88rem;min-height:1.2em;color:#fde68a;");
    var out = el("div", ""); box.appendChild(msg); box.appendChild(out);
    var uid = null, uinfo = null;
    function say(t, bad) { msg.style.color = bad ? "#fca5a5" : "#fde68a"; msg.textContent = t; }

    async function search() {
      var em = inp.value.trim(); out.innerHTML = ""; if (!em) return say("اكتب الإيميل", true);
      say("جاري البحث...");
      try {
        var q = await fbD.collection("users").where("email", "==", em.toLowerCase()).get();
        if (q.empty && em !== em.toLowerCase()) q = await fbD.collection("users").where("email", "==", em).get();
        if (q.empty) return say("مفيش مستخدم بالإيميل ده (لازم يكون سجّل ودخل مرة).", true);
        uid = q.docs[0].id; uinfo = q.docs[0].data();
        render();
      } catch (e) { say("فشل البحث: " + (e && e.code || "") + " " + (e && e.message || e), true); }
    }

    async function render() {
      out.innerHTML = ""; say("جاري تحميل الحالة...");
      var sub = {}, prem = false;
      try {
        var s = await fbD.collection("subscriptions").doc(uid).get(); sub = s.exists ? s.data() : {};
        var en = await fbD.collection("entitlements").doc(uid).get(); prem = !!(en.exists && en.data().premium === true);
      } catch (e) { return say("تعذر قراءة الاشتراك: " + (e && e.message || e), true); }
      say("");
      var now = Date.now(), until = (sub.until && typeof sub.until === "object") ? sub.until : {}, lv = Array.isArray(sub.levels) ? sub.levels : [];
      var card = el("div", "background:#0f172a;border-radius:12px;padding:12px;margin-top:6px;");
      card.appendChild(el("div", "font-weight:800;", (uinfo.name || "بدون اسم") + " " + (uinfo.avatar || "")));
      card.appendChild(el("div", "font-size:.82rem;color:#94a3b8;direction:ltr;text-align:right;", uinfo.email || ""));
      card.appendChild(el("div", "font-size:.85rem;margin-top:4px;", "المستوى: " + (uinfo.currentLevel || "A1") + " | XP: " + (uinfo.xp || 0)));
      var ts = toMs(sub.trialStart);
      card.appendChild(el("div", "font-size:.85rem;color:#cbd5e1;", "بداية التجربة: " + (ts ? fmt(ts) : "لم تبدأ")));
      if (sub.blocked) card.appendChild(el("div", "font-weight:800;color:#fca5a5;margin-top:4px;", "⛔ الوصول موقوف"));
      card.appendChild(el("div", "font-size:.85rem;margin-top:4px;", "⭐ Premium: " + (prem ? "مفعّل" : "لا")));
      out.appendChild(card);

      LEVELS.forEach(function (l) {
        var has = lv.indexOf(l) >= 0, u = Number(until[l]) || 0, active = has && (!u || u > now);
        var r = el("div", "background:#0f172a;border-radius:12px;padding:10px;margin-top:8px;");
        r.appendChild(el("div", "font-weight:700;", l + ": " + (active ? (u ? "مفتوح حتى " + fmt(u) : "مفتوح دائم") : has ? "منتهي (" + fmt(u) + ")" : "مقفول")));
        var rb = el("div", "display:flex;flex-wrap:wrap;");
        rb.appendChild(b("+7 أيام", "#2563eb", function () { grant(l, 7); }));
        rb.appendChild(b("+30 يوم", "#2563eb", function () { grant(l, 30); }));
        rb.appendChild(b("مدة أخرى", "#7c3aed", function () { var n = Number(prompt("كام يوم؟ (1 إلى 3650)")); if (n >= 1 && n <= 3650) grant(l, Math.floor(n)); else if (n) alert("رقم غير صحيح"); }));
        rb.appendChild(b("دائم", "#16a34a", function () { grant(l, 0); }));
        if (has) rb.appendChild(b("سحب", "#dc2626", function () { if (confirm("سحب " + l + " من المستخدم؟")) revoke(l); }));
        r.appendChild(rb); out.appendChild(r);
      });

      var ab = el("div", "margin-top:10px;display:flex;flex-wrap:wrap;");
      ab.appendChild(b(prem ? "إلغاء Premium" : "⭐ تفعيل Premium", "#d97706", function () { setPremium(!prem); }));
      if (sub.blocked) ab.appendChild(b("✅ فك الإيقاف", "#16a34a", unblock));
      else ab.appendChild(b("⛔ إيقاف الوصول", "#dc2626", block));
      out.appendChild(ab);
      out.appendChild(el("div", "font-size:.76rem;color:#94a3b8;margin-top:8px;", "ملحوظة: الإيقاف بيسحب كل المستويات وPremium وينهي التجربة، فالمستخدم يشوف شاشة القفل. بيشتغل على الحسابات اللي عليها الـ paywall (حسب وضع الإعدادات)."));
    }

    async function load() { var s = await fbD.collection("subscriptions").doc(uid).get(); return s.exists ? s.data() : {}; }
    async function save(data, okMsg) {
      try { await fbD.collection("subscriptions").doc(uid).set(data); say("✅ " + okMsg); await render(); say("✅ " + okMsg); }
      catch (e) { say("فشل الحفظ: " + (e && e.code || "") + " " + (e && e.message || e), true); }
    }
    async function grant(l, days) {
      try {
        var d = await load(), lv = Array.isArray(d.levels) ? d.levels.slice() : [], un = Object.assign({}, d.until || {});
        var cur = Number(un[l]) || 0, had = lv.indexOf(l) >= 0, now = Date.now();
        if (lv.indexOf(l) < 0) lv.push(l);
        if (days === 0) delete un[l];
        else if (had && !cur) { /* already permanent: keep */ }
        else un[l] = Math.max(now, cur) + days * DAY;
        delete d.blocked;
        d.levels = lv; d.until = un;
        await save(d, (had && !cur && days) ? l + " مفتوح دائم أصلاً، ما اتغيرش" : "تم فتح " + l + (days ? " لمدة " + days + " يوم" : " بشكل دائم"));
      } catch (e) { say("فشل: " + (e && e.message || e), true); }
    }
    async function revoke(l) {
      try {
        var d = await load(), lv = (Array.isArray(d.levels) ? d.levels : []).filter(function (x) { return x !== l; }), un = Object.assign({}, d.until || {});
        delete un[l]; d.levels = lv; d.until = un;
        await save(d, "تم سحب " + l);
      } catch (e) { say("فشل: " + (e && e.message || e), true); }
    }
    async function setPremium(on) {
      try {
        var ref = fbD.collection("entitlements").doc(uid);
        if (on) await ref.set({ premium: true, updatedAt: new Date().toISOString(), by: "admin" }); else await ref.delete();
        await render(); say("✅ " + (on ? "تم تفعيل Premium" : "تم إلغاء Premium"));
      } catch (e) { say("فشل: " + (e && e.code || "") + " " + (e && e.message || e), true); }
    }
    async function block() {
      if (!confirm("إيقاف وصول " + (uinfo.email || "") + " ؟")) return;
      try {
        await fbD.collection("entitlements").doc(uid).delete();
        var d = await load(); d.levels = []; d.until = {}; d.blocked = true; d.trialStart = firebase.firestore.Timestamp.fromMillis(1000);
        await save(d, "تم إيقاف الوصول");
      } catch (e) { say("فشل: " + (e && e.code || "") + " " + (e && e.message || e), true); }
    }
    async function unblock() {
      try { var d = await load(); delete d.blocked; await save(d, "تم فك الإيقاف. افتح له مستوى من فوق."); }
      catch (e) { say("فشل: " + (e && e.message || e), true); }
    }
  }
  window.__spAdminUsers = { open: open };
})();
