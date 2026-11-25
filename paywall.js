/* Speakora paywall, phase 1, PER-LEVEL (A1, A2, B1, B2 unlocked one by one).
   OFF by default: nothing happens until Firestore doc paywall_config/main has mode "test" or "on".
   Rollback: set mode to "off" (one field), or remove the <script src="paywall.js"> line.
   Unlocks live in subscriptions/{uid}: levels (array, e.g. ["A1","B1"]) and optional until (map level -> ms). */
(function () {
  "use strict";
  var ADMIN = "abdonateai92@gmail.com";
  var TRIAL_MS = 60 * 60 * 1000;
  var LEVELS = ["A1", "A2", "B1", "B2"];

  function activeLevels(sub, now) {
    var out = [];
    var arr = (sub && Array.isArray(sub.levels)) ? sub.levels : [];
    var until = (sub && sub.until && typeof sub.until === "object") ? sub.until : {};
    arr.forEach(function (l) {
      if (LEVELS.indexOf(l) < 0 || out.indexOf(l) >= 0) return;
      var u = Number(until[l]) || 0;
      if (!u || u > now) out.push(l);
    });
    return out;
  }

  // Pure decision function (tested in Node).
  // i: {cfg, user:{uid,email,emailVerified,createdMs}, sub, premium, now}
  // returns {action:"free"|"verify"|"starttrial"|"access", allowed:[levels] (access), trial:bool, leftMs}
  function decide(i) {
    var cfg = i.cfg || {}, u = i.user, mode = cfg.mode || "off";
    if (mode !== "test" && mode !== "on") return { action: "free" };
    if ((u.email || "").toLowerCase() === ADMIN) return { action: "free", admin: true };
    var inTest = (cfg.testUids || []).indexOf(u.uid) >= 0;
    var cutoff = Number(cfg.cutoff) || 0;
    var applies = inTest || (mode === "on" && cutoff > 0 && u.createdMs >= cutoff);
    if (!applies) return { action: "free" };
    if (!u.emailVerified) return { action: "verify" };
    if (i.premium) return { action: "free", premium: true };
    var allowed = activeLevels(i.sub, i.now);
    var ts = i.sub && Number(i.sub.trialStart) || 0;
    if (!ts) return { action: "starttrial", allowed: allowed };
    var left = ts + TRIAL_MS - i.now;
    if (left > 0) {
      var tl = Array.isArray(cfg.trialLevels) && cfg.trialLevels.length ? cfg.trialLevels : ["A1"];
      tl.forEach(function (l) { if (LEVELS.indexOf(l) >= 0 && allowed.indexOf(l) < 0) allowed.push(l); });
      return { action: "access", allowed: allowed, trial: true, leftMs: left };
    }
    return { action: "access", allowed: allowed, trial: false };
  }
  window.__spPaywallDecide = decide;

  var fbA, fbD;
  try { fbA = fbAuth; fbD = fbDb; } catch (e) { return; }
  if (!fbA || !fbD) return;

  var overlayEl = null, pillEl = null, adminBtn = null, timer = null, watch = null, busy = false;
  var cur = null; // current access decision, null = no restriction
  var lastCfg = {}, lastUser = null;

  function el(tag, css, text) {
    var e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (text != null) e.textContent = text;
    return e;
  }
  function btn(label, bg, fn) {
    var b = el("button", "display:block;width:100%;margin:8px 0;padding:13px;border:0;border-radius:12px;font-size:1rem;font-weight:bold;cursor:pointer;color:#fff;background:" + bg, label);
    b.onclick = fn; return b;
  }
  function stopWatch() { if (watch) { clearInterval(watch); watch = null; } }
  function clearUi() {
    if (overlayEl) { overlayEl.remove(); overlayEl = null; }
    if (pillEl) { pillEl.remove(); pillEl = null; }
    if (timer) { clearTimeout(timer); timer = null; }
    stopWatch();
    cur = null;
  }
  function showOverlay(build, noLogout) {
    if (overlayEl) overlayEl.remove();
    overlayEl = el("div", "position:fixed;inset:0;z-index:2147483000;background:#0b1220;color:#f8fafc;overflow-y:auto;direction:rtl;font-family:system-ui,-apple-system,sans-serif;padding:24px 18px;");
    var box = el("div", "max-width:440px;margin:30px auto;background:#111a2e;border:1px solid #d4af37;border-radius:18px;padding:22px;text-align:center;line-height:1.8;");
    build(box);
    if (!noLogout) box.appendChild(btn("تسجيل خروج", "#334155", function () { fbA.signOut().then(function () { clearUi(); }); }));
    overlayEl.appendChild(box);
    document.body.appendChild(overlayEl);
  }
  function waLink(num, email, level) {
    var d = String(num || "").replace(/\D/g, "");
    if (d.charAt(0) === "0") d = "20" + d.slice(1);
    if (!d) return null;
    return "https://wa.me/" + d + "?text=" + encodeURIComponent("تم تحويل اشتراك Speakora" + (level ? " للمستوى " + level : "") + ". إيميل حسابي: " + email);
  }
  var PRICES = { A1: 500, A2: 750, B1: 1000, B2: 1500 };
  function priceOf(cfg, l) { var p = cfg.prices && Number(cfg.prices[l]); return p || PRICES[l]; }
  function priceText(cfg, level) {
    if (level) return "سعر المستوى " + level + ": " + priceOf(cfg, level) + " جنيه مصري (دفعة واحدة)";
    return LEVELS.map(function (l) { return l + " = " + priceOf(cfg, l) + " جنيه"; }).join(" | ");
  }
  function payBox(b, user, cfg, level) {
    b.appendChild(el("p", "color:#fde68a;font-size:1.05rem;font-weight:bold", priceText(cfg, level)));
    var wallet = String(cfg.wallet || "").trim();
    var steps = el("div", "text-align:right;background:#0b1220;border-radius:12px;padding:12px 14px;font-size:0.92rem;color:#e2e8f0");
    steps.appendChild(el("div", "", "1) حوّل " + (level ? priceOf(cfg, level) + " جنيه" : "سعر المستوى") + " بفودافون كاش على الرقم:"));
    steps.appendChild(el("div", "text-align:center;font-size:1.3rem;font-weight:bold;color:#fde68a;direction:ltr;margin:6px 0", wallet || "الرقم غير مضبوط بعد"));
    steps.appendChild(el("div", "", "2) ابعت صورة التحويل وإيميلك" + (level ? " واسم المستوى (" + level + ")" : "") + " على واتساب."));
    steps.appendChild(el("div", "", "3) نفعّل المستوى خلال 24 ساعة من التحويل."));
    b.appendChild(steps);
    var link = waLink(cfg.whatsapp, user.email, level);
    if (link) b.appendChild(btn("💬 ابعت صورة التحويل على واتساب", "#16a34a", function () { window.open(link, "_blank"); }));
    b.appendChild(btn("🔄 تم التفعيل؟ حدّث حالتي", "#2563eb", function () { evaluate(fbA.currentUser); }));
  }

  function showVerify(user) {
    showOverlay(function (b) {
      b.appendChild(el("div", "font-size:2.2rem", "📧"));
      b.appendChild(el("h2", "margin:6px 0", "فعّل بريدك الإلكتروني"));
      b.appendChild(el("p", "color:#cbd5e1", "أرسلنا رابط التفعيل إلى: " + user.email));
      b.appendChild(el("p", "color:#94a3b8;font-size:0.85rem", "افتح الإيميل واضغط على الرابط (شوف مجلد Spam كمان)، ثم ارجع واضغط الزر."));
      var msg = el("p", "color:#fca5a5;font-size:0.85rem;min-height:1.2em", "");
      b.appendChild(btn("✅ فعّلت البريد، تابع", "#16a34a", function () {
        user.reload().then(function () { msg.textContent = ""; evaluate(fbA.currentUser); }).catch(function () { msg.textContent = "تعذر التحقق، حاول مرة أخرى."; });
      }));
      b.appendChild(btn("إعادة إرسال الرابط", "#2563eb", function () {
        user.sendEmailVerification().then(function () { msg.style.color = "#86efac"; msg.textContent = "تم الإرسال."; }).catch(function () { msg.style.color = "#fca5a5"; msg.textContent = "انتظر دقيقة ثم حاول مرة أخرى."; });
      }));
      b.appendChild(msg);
    });
  }

  // Nothing unlocked at all: whole site locked, shows the 4 levels and how to buy.
  function showNone(user, cfg, trialOver) {
    showOverlay(function (b) {
      b.appendChild(el("div", "font-size:2.2rem", "🔒"));
      b.appendChild(el("h2", "margin:6px 0", trialOver ? "انتهت التجربة المجانية" : "اشترك لفتح المستويات"));
      b.appendChild(el("p", "color:#cbd5e1;font-size:0.9rem", "كل مستوى (A1، A2، B1، B2) يتفتح لوحده. اختر المستوى اللي عايزه."));
      payBox(b, user, cfg, "");
    });
  }

  // Some levels unlocked, the one currently open is not.
  function showLevelLock(user, cfg, level, allowed) {
    showOverlay(function (b) {
      b.appendChild(el("div", "font-size:2.2rem", "🔒"));
      b.appendChild(el("h2", "margin:6px 0", "المستوى " + level + " مقفول"));
      b.appendChild(el("p", "color:#cbd5e1;font-size:0.9rem", "اشترك في المستوى " + level + " لفتحه."));
      payBox(b, user, cfg, level);
      if (allowed.length) b.appendChild(btn("↩️ رجوع لمستوى مفتوح (" + allowed[0] + ")", "#7c3aed", function () {
        try { state.currentLevel = allowed[0]; saveState(); renderPath(); } catch (e) {}
        if (overlayEl) { overlayEl.remove(); overlayEl = null; }
      }));
    }, true);
    if (overlayEl) overlayEl.setAttribute("data-lvl", "1");
  }

  function showPill(leftMs, label) {
    if (pillEl) pillEl.remove();
    pillEl = el("div", "position:fixed;bottom:8px;right:8px;z-index:2147482000;background:#111a2e;border:1px solid #d4af37;color:#fde68a;border-radius:20px;padding:5px 12px;font-size:0.78rem;direction:rtl;font-family:system-ui", "");
    document.body.appendChild(pillEl);
    function tick() {
      leftMs -= 1000;
      if (leftMs <= 0) { evaluate(fbA.currentUser); return; }
      var m = Math.floor(leftMs / 60000), s = Math.floor(leftMs / 1000) % 60;
      pillEl.textContent = label + " " + m + ":" + (s < 10 ? "0" : "") + s;
      timer = setTimeout(tick, 1000);
    }
    tick();
  }

  function startWatch(user, cfg, allowed) {
    stopWatch();
    watch = setInterval(function () {
      var lvl; try { lvl = state.currentLevel; } catch (e) { return; }
      var locked = allowed.indexOf(lvl) < 0;
      if (locked && !overlayEl) showLevelLock(user, cfg, lvl, allowed);
      else if (!locked && overlayEl && overlayEl.getAttribute("data-lvl")) { overlayEl.remove(); overlayEl = null; }
    }, 600);
  }

  function showAdminBtn() {
    if (adminBtn) return;
    adminBtn = el("button", "position:fixed;bottom:8px;left:8px;z-index:2147482000;background:#d4af37;color:#111;border:0;border-radius:20px;padding:6px 12px;font-size:0.78rem;font-weight:bold;cursor:pointer", "💳 تفعيل مستوى");
    adminBtn.onclick = function () {
      var email = (prompt("اكتب إيميل المشترك:") || "").trim().toLowerCase();
      if (!email) return;
      var lv = (prompt("اكتب المستويات مفصولة بفاصلة، مثال: A1 أو A1,B1") || "").toUpperCase().split(/[\s,،]+/).filter(Boolean);
      var bad = lv.filter(function (l) { return LEVELS.indexOf(l) < 0; });
      if (!lv.length || bad.length) { alert("مستوى غير صحيح. المسموح: A1 A2 B1 B2"); return; }
      lv = lv.filter(function (l, i) { return lv.indexOf(l) === i; });
      fbD.collection("users").where("email", "==", email).get().then(function (q) {
        if (q.empty) { alert("لا يوجد حساب بهذا الإيميل"); return; }
        if (q.size > 1) { alert("يوجد أكثر من حساب بهذا الإيميل"); return; }
        var uid = q.docs[0].id, ref = fbD.collection("subscriptions").doc(uid);
        return ref.get().then(function (d) {
          var data = d.exists ? d.data() : {};
          var old = Array.isArray(data.levels) ? data.levels : [];
          var merged = old.slice(); lv.forEach(function (l) { if (merged.indexOf(l) < 0) merged.push(l); });
          if (!confirm("تفعيل " + lv.join(" + ") + " نهائياً للحساب " + email + "؟")) return;
          return ref.set({ levels: merged }, { merge: true }).then(function () {
            alert("تم التفعيل: " + lv.join(", "));
          });
        });
      }).catch(function (e) { alert("فشل: " + (e && e.message || e)); });
    };
    document.body.appendChild(adminBtn);
  }

  async function evaluate(user) {
    if (busy) return; busy = true;
    try {
      clearUi();
      if (!user) { if (adminBtn) { adminBtn.remove(); adminBtn = null; } return; }
      var cfg = {};
      try { var c = await fbD.collection("paywall_config").doc("main").get(); cfg = c.exists ? c.data() : {}; }
      catch (e) { console.warn("paywall: config unreadable, staying open", e); return; }
      lastCfg = cfg; lastUser = user;
      var createdMs = Date.parse(user.metadata && user.metadata.creationTime) || 0;
      var base = { cfg: cfg, user: { uid: user.uid, email: user.email, emailVerified: user.emailVerified, createdMs: createdMs }, sub: null, premium: false, now: Date.now() };
      var d = decide(base);
      if (d.admin) { showAdminBtn(); return; }
      if (d.action === "free" && !d.premium) { if (!(cfg.mode === "test" || cfg.mode === "on")) return; }
      if (d.action === "verify") {
        var key = "sp_verif_sent_" + user.uid;
        if (!sessionStorage.getItem(key)) { sessionStorage.setItem(key, "1"); try { await user.sendEmailVerification(); } catch (e) {} }
        showVerify(user); return;
      }
      // not applicable (grandfathered / not in test list) -> d.action "free" and no restriction
      if (d.action === "free") {
        // free either because not applicable or premium; premium needs no check beyond decide, but decide only knows premium after we read it
        var applies = (cfg.testUids || []).indexOf(user.uid) >= 0 || (cfg.mode === "on" && Number(cfg.cutoff) > 0 && createdMs >= Number(cfg.cutoff));
        if (!applies) return;
      }
      try {
        var s = await fbD.collection("subscriptions").doc(user.uid).get();
        base.sub = s.exists ? s.data() : null;
        if (base.sub && base.sub.trialStart && base.sub.trialStart.toMillis) base.sub = Object.assign({}, base.sub, { trialStart: base.sub.trialStart.toMillis() });
        var en = await fbD.collection("entitlements").doc(user.uid).get();
        base.premium = !!(en.exists && en.data().premium === true);
      } catch (e) { console.warn("paywall: subscription unreadable, staying open (check Firestore rules)", e); return; }
      base.now = Date.now();
      d = decide(base);
      if (d.action === "starttrial") {
        try {
          await fbD.collection("subscriptions").doc(user.uid).set({ trialStart: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
          var s2 = await fbD.collection("subscriptions").doc(user.uid).get();
          var ts = s2.data().trialStart;
          base.sub = Object.assign({}, base.sub || {}, { trialStart: ts && ts.toMillis ? ts.toMillis() : Date.now() });
        } catch (e) { console.warn("paywall: cannot start trial (check Firestore rules)", e); return; }
        base.now = Date.now();
        d = decide(base);
      }
      if (d.action === "free") return; // premium
      var allowed = d.allowed || [];
      cur = d;
      // schedule re-check at next expiry
      var next = Infinity, until = (base.sub && base.sub.until) || {};
      allowed.forEach(function (l) { var u = Number(until[l]) || 0; if (u > base.now && u < next) next = u; });
      if (d.trial) { showPill(d.leftMs, "⏳ التجربة المجانية (A1):"); }
      else if (next < Infinity && next - base.now < 2147000000) timer = setTimeout(function () { evaluate(fbA.currentUser); }, next - base.now + 1000);
      if (!allowed.length) { showNone(user, cfg, !d.trial); return; }
      startWatch(user, cfg, allowed);
    } finally { busy = false; try { window.dispatchEvent(new Event("sp-paywall-done")); } catch (e) {} }
  }

  fbA.onAuthStateChanged(function (user) { busy = false; evaluate(user); });
  window.__spPaywallEvaluate = function () { return evaluate(fbA.currentUser); };
})();
