/* Speakora vault (phase 2, PR1). Lesson data served from Firestore behind rules.
   INERT unless Firestore paywall_config/main has vault = "test" (only UIDs in vaultTestUids) or "on" (everyone).
   Rollback: set vault to "off". Docs: lessons/{A1,A2,B1,B2}, content/{grammar,numbers,beginners,stories,jobs}.
   Each doc holds one JSON string in field "data" (Firestore forbids arrays inside arrays). */
(function () {
  "use strict";
  var ADMIN = "abdonateai92@gmail.com";
  var LEVELS = ["A1", "A2", "B1", "B2"];
  var CONTENT = ["grammar", "numbers", "beginners", "stories", "jobs"];
  var fbA, fbD;
  try { fbA = fbAuth; fbD = fbDb; } catch (e) { return; }
  if (!fbA || !fbD) return;

  function el(tag, css, text) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (text != null) e.textContent = text; return e; }
  function say(m) { try { if (typeof toast === "function") toast(m); else alert(m); } catch (e) { alert(m); } }
  function bytes(s) { try { return new TextEncoder().encode(s).length; } catch (e) { return s.length * 2; } }

  // ---------- data <-> globals ----------
  function jobKeys() { return Object.keys(window.SPEAKORA_DATA || {}).filter(function (k) { return k.indexOf("J_") === 0; }); }
  function collect() {
    var D = window.SPEAKORA_DATA || {}, out = { lessons: {}, content: {} };
    LEVELS.forEach(function (l) { out.lessons[l] = JSON.stringify({ words: (D[l] && D[l].words) || [], sentences: (D[l] && D[l].sentences) || [] }); });
    out.content.grammar = JSON.stringify(window.SPEAKORA_GRAMMAR || []);
    out.content.numbers = JSON.stringify(window.SPEAKORA_NUMBERS || []);
    out.content.beginners = JSON.stringify(window.SPEAKORA_BEGINNERS || []);
    out.content.stories = JSON.stringify(window.SPEAKORA_STORIES || []);
    var jobs = {}; jobKeys().forEach(function (k) { jobs[k] = D[k]; });
    jobs.__tracks = window.SPEAKORA_EXTRA_TRACKS || [];
    out.content.jobs = JSON.stringify(jobs);
    return out;
  }
  function dropTracks() {
    try {
      var ids = {}; (window.SPEAKORA_EXTRA_TRACKS || []).forEach(function (t) { ids[t.id] = 1; });
      for (var i = JOB_TRACKS.length - 1; i >= 0; i--) if (ids[JOB_TRACKS[i].id]) JOB_TRACKS.splice(i, 1);
    } catch (e) {}
    window.SPEAKORA_EXTRA_TRACKS = [];
  }
  function wipe() {
    dropTracks();
    var D = window.SPEAKORA_DATA = window.SPEAKORA_DATA || {};
    LEVELS.forEach(function (l) { D[l] = { words: [], sentences: [] }; });
    jobKeys().forEach(function (k) { delete D[k]; });
    window.SPEAKORA_GRAMMAR = []; window.SPEAKORA_NUMBERS = []; window.SPEAKORA_BEGINNERS = []; window.SPEAKORA_STORIES = [];
  }
  function apply(kind, id, json) {
    var v = JSON.parse(json), D = window.SPEAKORA_DATA;
    if (kind === "lessons") {
      if (Array.isArray(v)) D[id] = { words: v, sentences: [] };
      else D[id] = { words: Array.isArray(v.words) ? v.words : [], sentences: Array.isArray(v.sentences) ? v.sentences : [] };
      return;
    }
    if (id === "grammar") window.SPEAKORA_GRAMMAR = v;
    else if (id === "numbers") window.SPEAKORA_NUMBERS = v;
    else if (id === "beginners") window.SPEAKORA_BEGINNERS = v;
    else if (id === "stories") window.SPEAKORA_STORIES = v;
    else if (id === "jobs") Object.keys(v).forEach(function (k) {
      if (k === "__tracks") {
        window.SPEAKORA_EXTRA_TRACKS = Array.isArray(v[k]) ? v[k] : [];
        try { window.SPEAKORA_EXTRA_TRACKS.forEach(function (t) { if (!JOB_TRACKS.some(function (x) { return x.id === t.id; })) JOB_TRACKS.push(t); }); } catch (e) {}
      } else D[k] = v[k];
    });
  }

  // ---------- loader ----------
  var wiped = false, have = {}, running = false, rerun = false, lastUid = null;
  async function load(user) {
    if (running) { rerun = true; return; }
    running = true;
    try {
      if (!user) { if (wiped) { wipe(); have = {}; } lastUid = null; return; }
      var cfg = {};
      try { var c = await fbD.collection("paywall_config").doc("main").get(); cfg = c.exists ? c.data() : {}; }
      catch (e) { return; }
      var mode = cfg.vault || "off";
      var active = mode === "on" || (mode === "test" && (cfg.vaultTestUids || []).indexOf(user.uid) >= 0);
      if (!active) return;
      if (lastUid && lastUid !== user.uid) { wipe(); have = {}; }
      lastUid = user.uid;
      if (!wiped) { wipe(); wiped = true; }
      try { await user.getIdToken(true); } catch (e) {}
      var jobs = [], failed = 0, denied = 0;
      LEVELS.forEach(function (l) { if (!have["lessons/" + l]) jobs.push(["lessons", l]); });
      CONTENT.forEach(function (c) { if (!have["content/" + c]) jobs.push(["content", c]); });
      await Promise.all(jobs.map(function (j) {
        return fbD.collection(j[0]).doc(j[1]).get().then(function (d) {
          if (d.exists && d.data() && typeof d.data().data === "string") { apply(j[0], j[1], d.data().data); have[j[0] + "/" + j[1]] = 1; }
        }).catch(function (e) {
          if (e && e.code === "permission-denied") denied++; else failed++;
        });
      }));
      if (failed) say("تعذر تحميل بعض الدروس. تأكد من الإنترنت وحدّث الصفحة.");
      try { if (typeof renderAll === "function") renderAll(); } catch (e) {}
    } finally {
      running = false;
      if (rerun) { rerun = false; load(fbA.currentUser); }
    }
  }
  var fallback = null;
  window.addEventListener("sp-paywall-done", function () { if (fallback) { clearTimeout(fallback); fallback = null; } load(fbA.currentUser); });
  fbA.onAuthStateChanged(function (user) {
    if (fallback) clearTimeout(fallback);
    if (!user) { load(null); return; }
    // normally paywall.js finishes first and fires sp-paywall-done; if it does not, load anyway
    fallback = setTimeout(function () { fallback = null; load(fbA.currentUser); }, 5000);
  });
  window.__spVaultLoad = function () { return load(fbA.currentUser); };

  // ---------- admin tools ----------
  async function upload() {
    var sets = collect(), sizes = [], problem = null;
    LEVELS.forEach(function (l) { var o = JSON.parse(sets.lessons[l]), n = (o.words || []).length; if (n < 500) problem = "المستوى " + l + " فيه " + n + " كلمة فقط. لازم تكون الدروس القديمة محملة. أوقف الرفع."; if ((o.sentences || []).length < 5) problem = "المستوى " + l + " فيه جمل قليلة (" + (o.sentences || []).length + "). أوقف الرفع."; });
    if ((window.SPEAKORA_EXTRA_TRACKS || []).length < 5) problem = "مسارات المهن غير محملة. أوقف الرفع.";
    Object.keys(sets.lessons).forEach(function (l) { sizes.push(["lessons/" + l, bytes(sets.lessons[l])]); });
    Object.keys(sets.content).forEach(function (c) { sizes.push(["content/" + c, bytes(sets.content[c])]); });
    sizes.forEach(function (s) { if (s[1] > 900000) problem = "الملف " + s[0] + " كبير جداً (" + s[1] + " بايت)."; });
    if (problem) { alert(problem); return; }
    if (!confirm("رفع الدروس إلى Firebase؟ (" + sizes.length + " مستند). ده بيكتب فوق النسخة السابقة.")) return;
    var done = 0;
    try {
      for (var l in sets.lessons) { await fbD.collection("lessons").doc(l).set({ data: sets.lessons[l], updatedAt: Date.now() }); done++; }
      for (var c in sets.content) { await fbD.collection("content").doc(c).set({ data: sets.content[c], updatedAt: Date.now() }); done++; }
      alert("تم رفع " + done + " مستند بنجاح ✅");
    } catch (e) { alert("فشل الرفع بعد " + done + " مستند: " + (e && e.message || e)); }
  }
  async function grandfather() {
    try {
      var users = await fbD.collection("users").get();
      var subs = await fbD.collection("subscriptions").get();
      var paywalled = {}, hasLv = {};
      subs.forEach(function (d) { var v = d.data() || {}; if (v.trialStart) paywalled[d.id] = 1; if (Array.isArray(v.levels) && v.levels.length) hasLv[d.id] = 1; });
      var list = [];
      users.forEach(function (d) {
        var em = String((d.data() || {}).email || "").toLowerCase();
        if (em === ADMIN || paywalled[d.id] || hasLv[d.id]) return;
        list.push({ uid: d.id, email: em });
      });
      if (!list.length) { alert("لا يوجد حسابات قديمة تحتاج تثبيت."); return; }
      var shown = list.slice(0, 40).map(function (x) { return x.email || x.uid; }).join("\n");
      if (!confirm("هيتم فتح كل المستويات للحسابات دي (" + list.length + "):\n\n" + shown + (list.length > 40 ? "\n... و " + (list.length - 40) + " آخرين" : "") + "\n\nلو في إيميل جديد مش تبعك، اضغط إلغاء.")) return;
      var n = 0;
      for (var i = 0; i < list.length; i += 400) {
        var batch = fbD.batch();
        list.slice(i, i + 400).forEach(function (x) { batch.set(fbD.collection("subscriptions").doc(x.uid), { levels: LEVELS.slice(), grandfathered: true }, { merge: true }); n++; });
        await batch.commit();
      }
      alert("تم تثبيت " + n + " حساب ✅");
    } catch (e) { alert("فشل: " + (e && e.message || e)); }
  }
  // Add or update work tracks from a JSON file the admin picks on their device. The file is never stored in the repo.
  // File: {"tracks":[{"id":"J_x","name":"...","icon":"..."}],"data":{"J_x":{"words":[["en","ar","ph","ex"],...]}}}
  var HARD = { J_hotel_driver: 1, J_cashier: 1 };
  function checkTracksFile(o) {
    if (!o || typeof o !== "object" || !o.data || typeof o.data !== "object") return "الملف مش بالشكل المطلوب.";
    var ids = Object.keys(o.data);
    if (!ids.length) return "الملف فاضي.";
    var tracks = Array.isArray(o.tracks) ? o.tracks : [];
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i], t = o.data[id];
      if (!/^J_[a-z0-9_]+$/i.test(id)) return "اسم مسار غير صالح: " + id;
      if (!t || !Array.isArray(t.words) || !t.words.length) return "المسار " + id + " بدون كلمات.";
      for (var j = 0; j < t.words.length; j++) {
        var w = t.words[j];
        if (!Array.isArray(w) || w.length < 2 || typeof w[0] !== "string" || typeof w[1] !== "string") return "كلمة غير صالحة في " + id + " رقم " + (j + 1);
      }
      if (!HARD[id] && !tracks.some(function (x) { return x && x.id === id && typeof x.name === "string" && x.name; })) return "المسار " + id + " ناقص اسم في tracks.";
    }
    return null;
  }
  function mergeJobs(existingJson, o) {
    var cur = {};
    try { cur = existingJson ? JSON.parse(existingJson) : {}; } catch (e) { cur = {}; }
    if (!cur || typeof cur !== "object") cur = {};
    var list = Array.isArray(cur.__tracks) ? cur.__tracks.slice() : [];
    Object.keys(o.data).forEach(function (id) { cur[id] = o.data[id]; });
    (o.tracks || []).forEach(function (t) {
      if (!t || HARD[t.id] || !o.data[t.id]) return;
      var k = list.findIndex(function (x) { return x && x.id === t.id; });
      var item = { id: t.id, name: t.name, icon: t.icon || "💼" };
      if (k >= 0) list[k] = item; else list.push(item);
    });
    cur.__tracks = list;
    return JSON.stringify(cur);
  }
  async function importTracks(text, skipConfirm) {
    var o;
    try { o = JSON.parse(text); } catch (e) { alert("الملف مش JSON صحيح."); return; }
    var bad = checkTracksFile(o);
    if (bad) { alert(bad); return; }
    try {
      var snap = await fbD.collection("content").doc("jobs").get();
      var existing = snap.exists && snap.data() && typeof snap.data().data === "string" ? snap.data().data : "";
      var merged = mergeJobs(existing, o), n = bytes(merged);
      if (n > 900000) { alert("حجم مسارات المهن كبير جداً (" + n + " بايت). أوقف الرفع."); return; }
      var names = Object.keys(o.data).map(function (id) { return id + " (" + o.data[id].words.length + ")"; }).join("\n");
      if (!skipConfirm && !confirm("رفع " + Object.keys(o.data).length + " مسار؟\n\n" + names + "\n\nالمسارات الأخرى الموجودة لا تتغير.")) return;
      await fbD.collection("content").doc("jobs").set({ data: merged, updatedAt: Date.now() });
      delete have["content/jobs"];
      try { await load(fbA.currentUser); } catch (e) {}
      say("تم رفع المسارات ✅");
    } catch (e) { alert("فشل الرفع: " + (e && e.message || e)); }
  }
  function pickTracksFile() {
    var inp = document.createElement("input");
    inp.type = "file"; inp.accept = ".json,application/json";
    inp.onchange = function () {
      var f = inp.files && inp.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () { importTracks(String(r.result || "")); };
      r.readAsText(f);
    };
    inp.click();
  }
  function adminUi(user) {
    var isAdm = user && (user.email || "").toLowerCase() === ADMIN;
    if (!isAdm || !window.__spAdminMenu) return;
    window.__spAdminMenu.add("vault-upload", "☁️ رفع الدروس", upload);
    window.__spAdminMenu.add("vault-tracks", "📥 رفع ملف المسارات", pickTracksFile);
    window.__spAdminMenu.add("vault-gf", "🛡️ تثبيت الحسابات القديمة", grandfather);
  }
  fbA.onAuthStateChanged(adminUi);
  window.__spVault = { collect: collect, wipe: wipe, apply: apply, checkTracksFile: checkTracksFile, mergeJobs: mergeJobs, importTracks: importTracks };
})();
