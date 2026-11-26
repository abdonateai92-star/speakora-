/* Speakora admin: announcements. Loaded on demand from admin.js. Admin only.
   Uses the same doc the app already shows: announcements/current {text, id, at} (text max 300). No other fields (published rules forbid them). */
(function () {
  "use strict";
  var ADMIN = "abdonateai92@gmail.com", MAX = 300, HK = "sp_ann_hist";
  function el(tag, css, text) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (text != null) e.textContent = text; return e; }
  var INP = "width:100%;box-sizing:border-box;padding:10px;border-radius:10px;border:1px solid #475569;background:#0f172a;color:#f8fafc;font-size:1rem;";
  function btn(label, bg, fn) { var x = el("button", "padding:9px 12px;border-radius:10px;border:0;background:" + bg + ";color:#fff;font-weight:700;margin:3px;", label); x.onclick = fn; return x; }
  var TEMPLATES = [
    ["🆕 محتوى جديد", "فيه محتوى جديد في سبيكورا! افتح التطبيق وجرّب الدروس الجديدة."],
    ["🎁 عرض", "عرض لفترة محدودة على المستويات. تواصل معنا واتساب لمعرفة التفاصيل."],
    ["🛠️ صيانة", "ممكن يحصل بطء بسيط النهاردة بسبب تحديثات. شكراً لصبركم."],
    ["🔥 تحفيز", "كمّل يومك: درس واحد النهاردة يفرق كتير. الاستمرار هو السر!"]
  ];
  function hist() { try { return JSON.parse(localStorage.getItem(HK) || "[]"); } catch (e) { return []; } }
  function pushHist(t) { try { var h = hist().filter(function (x) { return x !== t; }); h.unshift(t); localStorage.setItem(HK, JSON.stringify(h.slice(0, 8))); } catch (e) {} }

  function open() {
    var fbA, fbD;
    try { fbA = firebase.auth(); fbD = firebase.firestore(); } catch (e) { alert("Firebase غير جاهز"); return; }
    var me = fbA.currentUser;
    if (!me || (me.email || "").toLowerCase() !== ADMIN) return;
    var old = document.getElementById("sp-an-sheet"); if (old) old.remove();
    var wrap = el("div", "position:fixed;inset:0;z-index:2147483100;background:rgba(0,0,0,.7);display:flex;align-items:flex-end;justify-content:center;");
    wrap.id = "sp-an-sheet";
    var box = el("div", "background:#1e293b;color:#f8fafc;width:100%;max-width:520px;max-height:94vh;overflow:auto;border-radius:18px 18px 0 0;padding:16px;direction:rtl;font-family:inherit;");
    wrap.appendChild(box); document.body.appendChild(wrap);
    wrap.addEventListener("click", function (e) { if (e.target === wrap) wrap.remove(); });
    box.appendChild(el("div", "font-weight:800;font-size:1.1rem;", "📢 الإعلانات"));
    var msg = el("div", "font-size:.85rem;margin:6px 0;min-height:1.2em;color:#fde68a;"); box.appendChild(msg);
    function say(t, bad) { msg.style.color = bad ? "#fca5a5" : "#fde68a"; msg.textContent = t; }

    var curBox = el("div", "background:#0f172a;border-radius:12px;padding:10px;margin:6px 0;font-size:.9rem;"); box.appendChild(curBox);
    var curId = null;
    async function loadCur() {
      curBox.textContent = "جاري التحميل..."; curId = null;
      try {
        var d = await fbD.collection("announcements").doc("current").get();
        curBox.innerHTML = "";
        if (!d.exists || !d.data().text) { curBox.textContent = "مفيش إعلان شغال دلوقتي."; return; }
        var a = d.data(); curId = a.id;
        curBox.appendChild(el("div", "font-weight:700;margin-bottom:4px;", "الإعلان الحالي (بدأ " + new Date(a.at).toLocaleString("ar-EG") + ")"));
        curBox.appendChild(el("div", "line-height:1.6;", "📢 " + a.text));
        var r = el("div", "margin-top:6px;");
        r.appendChild(btn("🗑 مسح الإعلان", "#dc2626", clearCur));
        r.appendChild(btn("👁 كام واحد شافه؟", "#2563eb", countSeen));
        curBox.appendChild(r);
      } catch (e) { curBox.textContent = "تعذر القراءة: " + (e && e.message || e); }
    }
    async function clearCur() {
      if (!confirm("مسح الإعلان الحالي؟ الناس اللي لسه ما شافوهوش مش هيشوفوه.")) return;
      try { await fbD.collection("announcements").doc("current").delete(); say("✅ تم المسح"); loadCur(); } catch (e) { say("فشل المسح: " + (e && e.code || "") + " " + (e && e.message || e), true); }
    }
    async function countSeen() {
      if (!curId) return;
      if (!confirm("هيقرا كل حسابات المستخدمين (كل حساب = قراءة واحدة من حد الاستخدام المجاني). كمل؟")) return;
      say("جاري العد...");
      try {
        var s = await fbD.collection("users").get(), seen = 0;
        s.forEach(function (d) { if (d.data().seenAnnId === curId) seen++; });
        say("شافه (ضغط حسناً) " + seen + " من " + s.size + " مستخدم.");
      } catch (e) { say("فشل العد: " + (e && e.message || e), true); }
    }

    box.appendChild(el("div", "font-weight:700;margin-top:12px;", "✍️ إعلان جديد"));
    box.appendChild(el("div", "font-size:.78rem;color:#94a3b8;", "بيحل محل الإعلان الحالي. كل مستخدم بيشوفه مرة لحد ما يضغط حسناً. النص بس، من غير روابط قابلة للضغط."));
    var tpl = el("div", "display:flex;flex-wrap:wrap;margin:6px 0;");
    var ta = el("textarea", INP + "min-height:110px;"); ta.maxLength = MAX; ta.placeholder = "اكتب الرسالة (حتى 300 حرف)";
    TEMPLATES.forEach(function (t) { tpl.appendChild(btn(t[0], "#475569", function () { ta.value = t[1]; upd(); })); });
    box.appendChild(tpl); box.appendChild(ta);
    var cnt = el("div", "font-size:.78rem;color:#94a3b8;text-align:left;");
    box.appendChild(cnt);
    box.appendChild(el("div", "font-size:.8rem;color:#cbd5e1;margin-top:6px;", "معاينة:"));
    var pv = el("div", "background:#11151f;border:1px solid #d4af37;border-radius:14px;padding:12px 14px;font-size:.88rem;line-height:1.6;margin:4px 0;");
    box.appendChild(pv);
    function upd() { cnt.textContent = ta.value.length + " / " + MAX; pv.textContent = ta.value.trim() ? "📢 " + ta.value.trim() : "(فاضي)"; }
    ta.oninput = upd; upd();
    var send = btn("📤 إرسال لكل المستخدمين", "#16a34a", async function () {
      var t = ta.value.trim();
      if (!t) return say("اكتب الرسالة الأول", true);
      if (t.length > MAX) return say("الرسالة أطول من 300 حرف", true);
      if (!confirm("إرسال الإعلان ده لكل المستخدمين؟\n\n" + t)) return;
      send.disabled = true; say("جاري الإرسال...");
      try {
        await fbD.collection("announcements").doc("current").set({ text: t, id: String(Date.now()), at: new Date().toISOString() });
        pushHist(t); ta.value = ""; upd(); say("✅ تم الإرسال"); await loadCur(); renderHist();
      } catch (e) { say("فشل الإرسال: " + (e && e.code || "") + " " + (e && e.message || e), true); }
      send.disabled = false;
    });
    send.style.width = "100%"; box.appendChild(send);
    var hb = el("div", "margin-top:10px;"); box.appendChild(hb);
    function renderHist() {
      hb.innerHTML = ""; var h = hist(); if (!h.length) return;
      hb.appendChild(el("div", "font-weight:700;font-size:.85rem;", "آخر إعلانات اتبعتت من الجهاز ده (اضغط لإعادة الاستخدام)"));
      h.forEach(function (t) { var r = el("div", "background:#0f172a;border-radius:8px;padding:8px;margin:4px 0;font-size:.82rem;cursor:pointer;", t); r.onclick = function () { ta.value = t; upd(); }; hb.appendChild(r); });
    }
    renderHist();
    box.appendChild(btn("إغلاق", "#334155", function () { wrap.remove(); }));
    loadCur();
  }
  window.__spAdminAnnounce = { open: open };
})();
