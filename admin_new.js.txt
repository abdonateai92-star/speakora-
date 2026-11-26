/* Speakora admin settings screen. Loaded on demand from vault.js. Admin only.
   Writes ONLY these fields of Firestore doc paywall_config/main (merge): mode, prices, wallet, whatsapp,
   trialHours, trialLessons, trialLevels, cutoff (optional). Other fields (testUids...) are never touched. */
(function () {
  "use strict";
  var ADMIN = "abdonateai92@gmail.com", LEVELS = ["A1", "A2", "B1", "B2"], DEF_P = { A1: 500, A2: 750, B1: 1000, B2: 1500 };
  function el(tag, css, text) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (text != null) e.textContent = text; return e; }
  var INP = "width:100%;box-sizing:border-box;padding:10px;border-radius:10px;border:1px solid #475569;background:#0f172a;color:#f8fafc;font-size:1rem;direction:ltr;";
  function field(box, label, input) { var w = el("div", "margin:10px 0;"); w.appendChild(el("div", "font-size:.85rem;color:#cbd5e1;margin-bottom:4px;", label)); w.appendChild(input); box.appendChild(w); return input; }
  function num(v, ph) { var i = el("input", INP); i.type = "number"; i.inputMode = "numeric"; i.min = "0"; i.value = v == null ? "" : v; if (ph) i.placeholder = ph; return i; }
  function txt(v, ph) { var i = el("input", INP); i.type = "text"; i.value = v == null ? "" : v; if (ph) i.placeholder = ph; return i; }

  async function open() {
    var fbA, fbD;
    try { fbA = firebase.auth(); fbD = firebase.firestore(); } catch (e) { alert("Firebase غير جاهز"); return; }
    var u = fbA.currentUser;
    if (!u || (u.email || "").toLowerCase() !== ADMIN) return;
    var old = document.getElementById("sp-set-sheet"); if (old) old.remove();
    var wrap = el("div", "position:fixed;inset:0;z-index:2147482000;background:rgba(0,0,0,.7);display:flex;align-items:flex-end;justify-content:center;");
    wrap.id = "sp-set-sheet";
    var box = el("div", "background:#1e293b;color:#f8fafc;width:100%;max-width:520px;max-height:92vh;overflow:auto;border-radius:18px 18px 0 0;padding:16px;direction:rtl;font-family:inherit;");
    wrap.appendChild(box); document.body.appendChild(wrap);
    wrap.addEventListener("click", function (e) { if (e.target === wrap) wrap.remove(); });
    box.appendChild(el("div", "font-weight:800;font-size:1.1rem;", "⚙️ إعدادات الاشتراك والتجربة"));
    var ub = el("button", "margin:8px 0;padding:10px 12px;border-radius:10px;border:1px solid #d4af37;background:#0f172a;color:#d4af37;width:100%;font-weight:700;", "👥 إدارة المستخدمين (بحث، فتح مستوى، إيقاف)");
    ub.onclick = function () {
      if (window.__spAdminUsers) return window.__spAdminUsers.open();
      var s = document.createElement("script"); s.charset = "utf-8"; s.src = "admin_users.js?v=1";
      s.onload = function () { if (window.__spAdminUsers) window.__spAdminUsers.open(); };
      s.onerror = function () { alert("تعذر تحميل admin_users.js"); };
      document.head.appendChild(s);
    };
    box.appendChild(ub);
    var st = el("div", "font-size:.85rem;margin:6px 0;color:#fde68a;", "جاري التحميل...");
    box.appendChild(st);
    var cfg = {};
    try { var d = await fbD.collection("paywall_config").doc("main").get(); cfg = d.exists ? d.data() : {}; }
    catch (e) { st.textContent = "تعذر قراءة الإعدادات: " + (e && e.message || e); return; }
    st.textContent = "عدّل واضغط حفظ. التغييرات تظهر للمستخدمين في المرة الجاية اللي يفتحوا فيها التطبيق.";

    box.appendChild(el("div", "font-weight:700;margin-top:10px;", "💰 الأسعار (جنيه مصري)"));
    var pr = {};
    LEVELS.forEach(function (l) { var cur = cfg.prices && Number(cfg.prices[l]) || DEF_P[l]; pr[l] = field(box, "سعر المستوى " + l, num(cur)); });
    box.appendChild(el("div", "font-weight:700;margin-top:14px;", "📞 أرقام الدفع والتواصل"));
    var wallet = field(box, "رقم فودافون كاش", txt(cfg.wallet, "01xxxxxxxxx"));
    var wa = field(box, "رقم الواتساب (بكود الدولة، أرقام بس)", txt(cfg.whatsapp, "2010xxxxxxxx"));
    box.appendChild(el("div", "font-weight:700;margin-top:14px;", "⏱️ التجربة المجانية"));
    var th = field(box, "المدة بالساعات (1 إلى 720)", num(Number(cfg.trialHours) > 0 ? cfg.trialHours : 12));
    var tl = field(box, "عدد الدروس المجانية في A1 (1 إلى 200)", num(Number(cfg.trialLessons) >= 1 ? cfg.trialLessons : 10));
    var lvlRow = el("div", "display:flex;gap:12px;margin:8px 0;flex-wrap:wrap;");
    var cur = Array.isArray(cfg.trialLevels) && cfg.trialLevels.length ? cfg.trialLevels : ["A1"], cbs = {};
    LEVELS.forEach(function (l) { var lab = el("label", "display:flex;gap:6px;align-items:center;"); var c = el("input"); c.type = "checkbox"; c.checked = cur.indexOf(l) >= 0; cbs[l] = c; lab.appendChild(c); lab.appendChild(el("span", "", l)); lvlRow.appendChild(lab); });
    box.appendChild(el("div", "font-size:.85rem;color:#cbd5e1;", "المستويات المفتوحة أثناء التجربة"));
    box.appendChild(lvlRow);
    box.appendChild(el("div", "font-size:.78rem;color:#94a3b8;", "ملحوظة: عدد الدروس المجانية بيتطبق على A1 بس."));

    box.appendChild(el("div", "font-weight:700;margin-top:14px;", "🔒 حالة الـ Paywall"));
    var modeSel = el("select", INP);
    [["off", "off: مقفول، الكل مجاني"], ["test", "test: تجربة على حسابات الاختبار بس"], ["on", "on: شغّال على الحسابات الجديدة"]].forEach(function (o) { var op = el("option", "", o[1]); op.value = o[0]; modeSel.appendChild(op); });
    modeSel.value = cfg.mode === "on" || cfg.mode === "test" ? cfg.mode : "off";
    field(box, "الوضع الحالي", modeSel);
    var cutMs = Number(cfg.cutoff) || 0, cutNow = false;
    var cutInfo = el("div", "font-size:.85rem;color:#fde68a;", cutMs ? "بداية التطبيق على الحسابات: " + new Date(cutMs).toLocaleString("ar-EG") + " (الحسابات الأقدم منها مجانية)" : "لا يوجد تاريخ بداية، وضع on مش هيطبق على أي حد قبل ما تحدده.");
    box.appendChild(cutInfo);
    var cutBtn = el("button", "margin:8px 0;padding:8px 12px;border-radius:10px;border:1px solid #d4af37;background:#0f172a;color:#d4af37;", "اضبط تاريخ البداية = دلوقتي");
    cutBtn.onclick = function () { cutNow = true; cutInfo.textContent = "هيتحدد وقت الحفظ: الحسابات اللي تتفتح من بعد الحفظ بس هي اللي عليها الـ paywall."; };
    box.appendChild(cutBtn);

    var msg = el("div", "margin:10px 0;font-size:.9rem;min-height:1.2em;");
    box.appendChild(msg);
    var row = el("div", "display:flex;gap:8px;margin-top:6px;");
    var save = el("button", "flex:1;padding:12px;border-radius:12px;border:0;background:#16a34a;color:#fff;font-weight:700;font-size:1rem;", "💾 حفظ");
    var close = el("button", "padding:12px;border-radius:12px;border:0;background:#334155;color:#fff;", "إغلاق");
    close.onclick = function () { wrap.remove(); };
    row.appendChild(save); row.appendChild(close); box.appendChild(row);

    function fail(t) { msg.style.color = "#fca5a5"; msg.textContent = t; }
    save.onclick = async function () {
      var prices = {}, bad = "";
      LEVELS.forEach(function (l) { var v = Math.round(Number(pr[l].value)); if (!(v >= 1 && v <= 100000)) bad = "سعر " + l + " لازم يكون رقم من 1 إلى 100000"; prices[l] = v; });
      if (bad) return fail(bad);
      var hrs = Number(th.value), les = Math.floor(Number(tl.value));
      if (!(hrs > 0 && hrs <= 720)) return fail("المدة لازم تكون من 1 إلى 720 ساعة");
      if (!(les >= 1 && les <= 200)) return fail("عدد الدروس لازم يكون من 1 إلى 200");
      var levels = LEVELS.filter(function (l) { return cbs[l].checked; });
      if (!levels.length) return fail("اختار مستوى واحد على الأقل للتجربة");
      var w = wallet.value.trim(), n = wa.value.replace(/[^0-9]/g, "");
      if (w && !/^[0-9+ ]{8,16}$/.test(w)) return fail("رقم فودافون كاش غير صحيح");
      var mode = modeSel.value;
      var newCut = cutNow ? Date.now() : cutMs;
      if (mode === "on") {
        if (!newCut) return fail("وضع on محتاج تاريخ بداية. اضغط (اضبط تاريخ البداية = دلوقتي).");
        if (cfg.mode !== "on" && !confirm("متأكد؟ تشغيل on معناه إن أي حساب جديد بعد التاريخ ده هيشوف الـ paywall ويدفع بعد التجربة. موافق؟")) return;
      }
      var data = { mode: mode, prices: prices, wallet: w, whatsapp: n, trialHours: hrs, trialLessons: les, trialLevels: levels };
      if (newCut) data.cutoff = newCut;
      save.disabled = true; msg.style.color = "#fde68a"; msg.textContent = "جاري الحفظ...";
      try { await fbD.collection("paywall_config").doc("main").set(data, { merge: true }); cfg = Object.assign({}, cfg, data); cutMs = newCut; cutNow = false; msg.style.color = "#86efac"; msg.textContent = "✅ تم الحفظ"; }
      catch (e) { fail("فشل الحفظ: " + (e && e.code || "") + " " + (e && e.message || e)); }
      save.disabled = false;
    };
  }
  window.__spAdminSettings = { open: open };
})();
