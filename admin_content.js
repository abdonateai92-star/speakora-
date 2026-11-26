/* Speakora admin: content editor. Loaded on demand from admin.js. Admin only.
   Edits Firestore docs lessons/{A1..B2} and content/{grammar,numbers,beginners,stories,jobs}. Each doc = {data: "<json string>", updatedAt}.
   Nothing is written until the admin presses save. Before saving: size check, shape check, conflict check (updatedAt), local backup. */
(function () {
  "use strict";
  var ADMIN = "abdonateai92@gmail.com", LEVELS = ["A1", "A2", "B1", "B2"], PAGE = 25, MAXB = 900000;
  function el(tag, css, text) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (text != null) e.textContent = text; return e; }
  var INP = "width:100%;box-sizing:border-box;padding:8px;border-radius:8px;border:1px solid #475569;background:#0f172a;color:#f8fafc;font-size:.95rem;margin:2px 0;";
  function btn(label, bg, fn) { var x = el("button", "padding:8px 11px;border-radius:9px;border:0;background:" + bg + ";color:#fff;font-weight:700;margin:2px;font-size:.88rem;", label); x.onclick = fn; return x; }
  function bytes(s) { try { return new TextEncoder().encode(s).length; } catch (e) { return s.length * 2; } }
  function short(item) {
    var parts = [];
    if (Array.isArray(item)) parts = item.filter(function (x) { return typeof x === "string" || typeof x === "number"; });
    else if (item && typeof item === "object") parts = Object.keys(item).map(function (k) { return item[k]; }).filter(function (x) { return typeof x === "string" || typeof x === "number"; });
    else parts = [item];
    return parts.slice(0, 3).join(" | ").slice(0, 80) || "(فاضي)";
  }
  var WORD_LABELS = ["الإنجليزي", "العربي", "النطق", "مثال"];

  function open() {
    var fbA, fbD;
    try { fbA = firebase.auth(); fbD = firebase.firestore(); } catch (e) { alert("Firebase غير جاهز"); return; }
    var me = fbA.currentUser;
    if (!me || (me.email || "").toLowerCase() !== ADMIN) return;
    var old = document.getElementById("sp-ct-sheet"); if (old) old.remove();
    var wrap = el("div", "position:fixed;inset:0;z-index:2147483100;background:rgba(0,0,0,.7);display:flex;align-items:flex-end;justify-content:center;");
    wrap.id = "sp-ct-sheet";
    var box = el("div", "background:#1e293b;color:#f8fafc;width:100%;max-width:560px;height:94vh;overflow:auto;border-radius:18px 18px 0 0;padding:14px;direction:rtl;font-family:inherit;");
    wrap.appendChild(box); document.body.appendChild(wrap);
    box.appendChild(el("div", "font-weight:800;font-size:1.1rem;", "📝 محرر المحتوى"));

    // ----- views -----
    var VIEWS = [];
    LEVELS.forEach(function (l) {
      VIEWS.push({ label: "كلمات " + l, coll: "lessons", id: l, key: "words", words: true });
      VIEWS.push({ label: "جمل " + l, coll: "lessons", id: l, key: "sentences" });
    });
    [["grammar", "القواعد"], ["numbers", "الأرقام"], ["beginners", "المبتدئين"], ["stories", "القصص"]].forEach(function (c) { VIEWS.push({ label: c[1], coll: "content", id: c[0], key: null }); });
    VIEWS.push({ label: "أسماء مسارات المهن", coll: "content", id: "jobs", key: "__tracks", tracks: true });

    var sel = el("select", INP);
    var o0 = el("option", "", "اختار القسم..."); o0.value = ""; sel.appendChild(o0);
    VIEWS.forEach(function (v, i) { var o = el("option", "", v.label); o.value = String(i); sel.appendChild(o); });
    var jobSel = el("select", INP + "display:none;"); // filled once jobs doc loads
    box.appendChild(sel); box.appendChild(jobSel);
    var topRow = el("div", "display:flex;flex-wrap:wrap;margin:4px 0;");
    box.appendChild(topRow);
    var msg = el("div", "font-size:.85rem;margin:6px 0;min-height:1.2em;color:#fde68a;");
    box.appendChild(msg);
    var listBox = el("div", ""); box.appendChild(listBox);
    var closeB = btn("إغلاق", "#334155", function () { if (dirty && !confirm("في تغييرات ما اتحفظتش. تقفل؟")) return; wrap.remove(); });
    closeB.style.marginTop = "10px"; box.appendChild(closeB);

    var cur = null, obj = null, updatedAt = 0, dirty = false, filter = "", page = 0, openIdx = -1, exists = false;
    function say(t, bad) { msg.style.color = bad ? "#fca5a5" : "#fde68a"; msg.textContent = t; }
    function ref() { return fbD.collection(cur.coll).doc(cur.id); }
    function getList() {
      if (!obj) return [];
      if (cur.jobKey) return (obj[cur.jobKey] && Array.isArray(obj[cur.jobKey].words)) ? obj[cur.jobKey].words : [];
      if (cur.key === null) return Array.isArray(obj) ? obj : [];
      return Array.isArray(obj[cur.key]) ? obj[cur.key] : [];
    }
    function setList(l) {
      if (cur.jobKey) obj[cur.jobKey].words = l; else if (cur.key === null) obj = l; else obj[cur.key] = l;
    }
    sel.onchange = function () {
      if (dirty && !confirm("في تغييرات ما اتحفظتش. تسيبها؟")) { sel.value = String(VIEWS.indexOf(cur.base || cur)); return; }
      if (sel.value === "") return;
      var v = VIEWS[Number(sel.value)]; cur = Object.assign({}, v); cur.base = v; jobSel.style.display = "none";
      loadDoc();
    };
    jobSel.onchange = function () { if (!jobSel.value) return; cur.jobKey = jobSel.value; cur.key = "words"; cur.words = true; filter = ""; page = 0; openIdx = -1; render(); };

    // Job tracks: separate entry in the select
    (function addJobsView() {
      var o = el("option", "", "كلمات مسار مهنة..."); o.value = "jobs"; sel.appendChild(o);
      var prev = sel.onchange;
      sel.onchange = function () {
        if (sel.value !== "jobs") return prev();
        if (dirty && !confirm("في تغييرات ما اتحفظتش. تسيبها؟")) return;
        cur = { label: "مسار مهنة", coll: "content", id: "jobs", key: "words", words: true, jobMode: true }; cur.base = cur; loadDoc();
      };
    })();

    async function loadDoc() {
      listBox.innerHTML = ""; topRow.innerHTML = ""; dirty = false; filter = ""; page = 0; openIdx = -1; obj = null;
      say("جاري التحميل...");
      try {
        var d = await ref().get(); exists = d.exists;
        if (!exists) { say("المستند ده مش موجود في Firebase (ارفع الدروس الأول).", true); return; }
        var raw = d.data() && d.data().data; updatedAt = Number(d.data().updatedAt) || 0;
        if (typeof raw !== "string") { say("شكل المستند غير متوقع.", true); return; }
        obj = JSON.parse(raw);
      } catch (e) { say("فشل التحميل: " + (e && e.code || "") + " " + (e && e.message || e), true); return; }
      if (cur.jobMode) {
        var ks = Object.keys(obj).filter(function (k) { return k.indexOf("J_") === 0; });
        var names = {}; (Array.isArray(obj.__tracks) ? obj.__tracks : []).forEach(function (t) { if (t && t.id) names[t.id] = t.name; });
        jobSel.innerHTML = ""; var p = el("option", "", "اختار المسار..."); p.value = ""; jobSel.appendChild(p);
        ks.forEach(function (k) { var o = el("option", "", (names[k] || k) + " (" + ((obj[k] && obj[k].words) || []).length + ")"); o.value = k; jobSel.appendChild(o); });
        jobSel.style.display = ""; say("اختار المسار."); return;
      }
      say(""); render();
    }

    function backupLocal() {
      try { localStorage.setItem("sp_bk_" + cur.coll + "_" + cur.id, JSON.stringify({ at: Date.now(), raw: cur.raw })); } catch (e) {}
    }
    function validate() {
      var l = getList();
      if (cur.words) for (var i = 0; i < l.length; i++) { var w = l[i]; if (!Array.isArray(w) || w.length < 2 || typeof w[0] !== "string" || typeof w[1] !== "string" || !w[0].trim() || !w[1].trim()) return "كلمة رقم " + (i + 1) + " ناقصة (الإنجليزي والعربي مطلوبين)."; }
      if (cur.tracks) for (var j = 0; j < l.length; j++) { var t = l[j]; if (!t || typeof t.name !== "string" || !t.name.trim()) return "مسار رقم " + (j + 1) + " بدون اسم."; }
      return null;
    }
    async function save() {
      var bad = validate(); if (bad) return say(bad, true);
      var json = JSON.stringify(obj), n = bytes(json);
      if (n > MAXB) return say("الحجم كبير (" + n + " بايت). المسموح 900000.", true);
      if (!confirm("حفظ التغييرات في Firebase؟ ده بيظهر للمستخدمين.")) return;
      say("جاري الحفظ...");
      try {
        var d = await ref().get();
        var curRaw = d.exists && d.data() ? d.data().data : null, curAt = d.exists && d.data() ? Number(d.data().updatedAt) || 0 : 0;
        if (curAt !== updatedAt) return say("المستند اتغير من مكان تاني من وقت ما فتحته. اقفل وافتحه تاني.", true);
        cur.raw = curRaw; backupLocal();
        var now = Date.now();
        await ref().set({ data: json, updatedAt: now });
        updatedAt = now; dirty = false; cur.raw = json;
        say("✅ تم الحفظ. حدّث الصفحة عشان تشوف التغيير.");
        render();
      } catch (e) { say("فشل الحفظ: " + (e && e.code || "") + " " + (e && e.message || e), true); }
    }
    function download() {
      var blob = new Blob([JSON.stringify(obj, null, 1)], { type: "application/json" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "backup_" + cur.coll + "_" + cur.id + ".json"; document.body.appendChild(a); a.click(); a.remove();
    }
    function restore() {
      var s; try { s = JSON.parse(localStorage.getItem("sp_bk_" + cur.coll + "_" + cur.id) || "null"); } catch (e) { s = null; }
      if (!s || typeof s.raw !== "string") return say("مفيش نسخة احتياطية على الجهاز ده.", true);
      if (!confirm("استرجاع النسخة اللي قبل آخر حفظ (" + new Date(s.at).toLocaleString("ar-EG") + ")؟ هتتحمل هنا وبعدين تضغط حفظ.")) return;
      try { obj = JSON.parse(s.raw); dirty = true; filter = ""; page = 0; openIdx = -1; render(); say("اتحملت النسخة. اضغط حفظ لو عايز تثبتها."); } catch (e) { say("النسخة تالفة.", true); }
    }

    function cellEditor(parent, label, val, onSet) {
      var w = el("div", "margin:4px 0;"); w.appendChild(el("div", "font-size:.76rem;color:#94a3b8;", label));
      var prim = typeof val === "string" || typeof val === "number" || val == null;
      var inp;
      if (prim) {
        var long = typeof val === "string" && (val.length > 60 || val.indexOf("\n") >= 0);
        inp = el(long ? "textarea" : "input", INP + (long ? "min-height:90px;" : "")); inp.value = val == null ? "" : String(val);
        var isNum = typeof val === "number";
        inp.oninput = function () { onSet(isNum && inp.value.trim() !== "" && !isNaN(Number(inp.value)) ? Number(inp.value) : inp.value); dirty = true; };
      } else {
        inp = el("textarea", INP + "min-height:90px;direction:ltr;font-family:monospace;font-size:.8rem;"); inp.value = JSON.stringify(val, null, 1);
        inp.oninput = function () { try { onSet(JSON.parse(inp.value)); inp.style.borderColor = "#475569"; dirty = true; } catch (e) { inp.style.borderColor = "#dc2626"; } };
      }
      w.appendChild(inp); parent.appendChild(w);
    }
    function itemEditor(parent, i) {
      var l = getList(), it = l[i], p = el("div", "background:#0b1220;border-radius:10px;padding:8px;margin:4px 0 8px;");
      if (Array.isArray(it)) it.forEach(function (c, k) { cellEditor(p, cur.words ? (WORD_LABELS[k] || "حقل " + (k + 1)) : "حقل " + (k + 1), c, function (v) { it[k] = v; }); });
      else if (it && typeof it === "object") Object.keys(it).forEach(function (k) { cellEditor(p, k, it[k], function (v) { it[k] = v; }); });
      else cellEditor(p, "النص", it, function (v) { l[i] = v; });
      parent.appendChild(p);
    }
    function blankLike(l) {
      var s = l.length ? l[l.length - 1] : (cur.words ? ["", "", "", ""] : ""); 
      if (Array.isArray(s)) return s.map(function (x) { return typeof x === "number" ? 0 : (typeof x === "string" ? "" : JSON.parse(JSON.stringify(x))); });
      if (s && typeof s === "object") { var o = {}; Object.keys(s).forEach(function (k) { o[k] = typeof s[k] === "number" ? 0 : (typeof s[k] === "string" ? "" : JSON.parse(JSON.stringify(s[k]))); }); return o; }
      return "";
    }

    function render() {
      listBox.innerHTML = ""; topRow.innerHTML = "";
      if (!cur.raw) cur.raw = JSON.stringify(obj);
      var l = getList();
      topRow.appendChild(btn("💾 حفظ" + (dirty ? " *" : ""), "#16a34a", save));
      topRow.appendChild(btn("⬇️ نسخة احتياطية", "#2563eb", download));
      topRow.appendChild(btn("↩️ استرجاع آخر نسخة", "#7c3aed", restore));
      var q = el("input", INP); q.placeholder = "بحث (" + l.length + " عنصر)"; q.value = filter;
      q.onchange = function () { filter = q.value.trim().toLowerCase(); page = 0; openIdx = -1; render(); };
      listBox.appendChild(q);
      var idx = []; l.forEach(function (it, i) { if (!filter || JSON.stringify(it).toLowerCase().indexOf(filter) >= 0) idx.push(i); });
      var pages = Math.max(1, Math.ceil(idx.length / PAGE)); if (page >= pages) page = pages - 1;
      idx.slice(page * PAGE, page * PAGE + PAGE).forEach(function (i) {
        var row = el("div", "background:#0f172a;border-radius:10px;padding:8px;margin:5px 0;");
        var head = el("div", "display:flex;align-items:center;gap:6px;");
        var t = el("div", "flex:1;font-size:.9rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;", (i + 1) + ". " + short(l[i]));
        t.onclick = function () { openIdx = openIdx === i ? -1 : i; render(); };
        head.appendChild(t);
        head.appendChild(btn("▲", "#475569", function () { if (i > 0 && !filter) { var x = l[i]; l[i] = l[i - 1]; l[i - 1] = x; dirty = true; if (openIdx === i) openIdx = i - 1; render(); } }));
        head.appendChild(btn("▼", "#475569", function () { if (i < l.length - 1 && !filter) { var x = l[i]; l[i] = l[i + 1]; l[i + 1] = x; dirty = true; if (openIdx === i) openIdx = i + 1; render(); } }));
        head.appendChild(btn("🗑", "#dc2626", function () {
          if (!confirm("مسح العنصر رقم " + (i + 1) + "؟\n" + short(l[i]))) return;
          var removed = l.splice(i, 1)[0];
          if (cur.tracks && removed && removed.id && obj[removed.id] && confirm("امسح كلمات المسار " + removed.id + " كمان؟")) delete obj[removed.id];
          dirty = true; openIdx = -1; render();
        }));
        row.appendChild(head);
        if (openIdx === i) itemEditor(row, i);
        listBox.appendChild(row);
      });
      var nav = el("div", "display:flex;justify-content:space-between;align-items:center;margin:6px 0;");
      nav.appendChild(btn("◀ السابق", "#334155", function () { if (page > 0) { page--; openIdx = -1; render(); } }));
      nav.appendChild(el("span", "font-size:.85rem;", (page + 1) + " / " + pages));
      nav.appendChild(btn("التالي ▶", "#334155", function () { if (page < pages - 1) { page++; openIdx = -1; render(); } }));
      listBox.appendChild(nav);
      listBox.appendChild(btn("➕ إضافة عنصر جديد في الآخر", "#d97706", function () { l.push(blankLike(l)); dirty = true; filter = ""; page = Math.floor((l.length - 1) / PAGE); openIdx = l.length - 1; render(); }));
      if (filter) listBox.appendChild(el("div", "font-size:.74rem;color:#94a3b8;", "الترتيب بالأسهم بيشتغل من غير بحث بس."));
    }
  }
  window.__spAdminContent = { open: open };
})();
