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
  function deniedBanner(show) {
    var old = document.getElementById("sp-vault-denied");
    if (!show) { if (old) old.remove(); return; }
    if (old) return;
    var b = el("div", "position:fixed;top:0;left:0;right:0;z-index:2147482500;direction:rtl;background:#1e293b;border-bottom:2px solid #d4af37;color:#fde68a;padding:12px 14px;font:700 0.84rem/1.7 Cairo,system-ui,sans-serif;text-align:center;", "");
    b.id = "sp-vault-denied";
    b.appendChild(el("div", "", "🔒 مش قادرين نفتح الدروس لحسابك دلوقتي."));
    b.appendChild(el("div", "font-weight:500;font-size:0.78rem;margin-bottom:8px;", "افتح من البريد رابط التفعيل لو لسه، أو اعمل تحديث. لو المشكلة مستمرة كلمنا على واتساب."));
    var r = el("button", "background:#d4af37;color:#090b10;border:0;border-radius:10px;padding:6px 16px;font:inherit;cursor:pointer;", "🔄 حدّث");
    r.onclick = function () { b.remove(); try { load(fbA.currentUser); } catch (e) { location.reload(); } };
    b.appendChild(r);
    document.body.appendChild(b);
  }
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
      deniedBanner(denied > 0 && Object.keys(have).length === 0 && !document.querySelector(".sp-ov"));
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
    window.__spAdminMenu.add("admin-settings", "⚙️ الإعدادات", function () {
      if (window.__spAdminSettings) return window.__spAdminSettings.open();
      var s = document.createElement("script"); s.src = "admin.js?v=1";
      s.onload = function () { if (window.__spAdminSettings) window.__spAdminSettings.open(); };
      s.onerror = function () { alert("تعذر تحميل admin.js"); };
      document.head.appendChild(s);
    });
    window.__spAdminMenu.add("vault-upload", "☁️ رفع الدروس", upload);
    window.__spAdminMenu.add("vault-tracks", "📥 رفع ملف المسارات", pickTracksFile);
    window.__spAdminMenu.add("vault-gf", "🛡️ تثبيت الحسابات القديمة", grandfather);
  }
  fbA.onAuthStateChanged(adminUi);
  // ---------- admin: add content to any section from one place ----------
  // Every upload MERGES into what is already in Firestore. Nothing is deleted. Words/sentences that already exist (same English text) are skipped.
  // Lessons/stories with an id that already exists are replaced in place (so you can fix one); every other item stays.
  var LV = ["A1", "A2", "B1", "B2"];
  var SECTIONS = [
    { key: "stories", label: "📖 القصص", where: "sc-stories" },
    { key: "grammar", label: "📘 القواعد", where: "sc-learn" },
    { key: "numbers", label: "🔢 الأرقام", where: "sc-learn" },
    { key: "beginners", label: "🌱 من الصفر", where: "sc-learn" },
    { key: "jobs", label: "💼 مسارات المهن", where: "sc-jobs" },
    { key: "sentences", label: "💬 الجمل", where: "sc-sentences", lv: 1 },
    { key: "words", label: "🔤 الكلمات", where: "sc-path", lv: 1 }
  ];
  var TEMPLATES = {
    words: { level: "A1", words: [["apple", "تفاحة", "آبل", "I eat an apple every day."]] },
    sentences: { level: "A1", sentences: [["How are you today?", "عامل إيه النهاردة؟", "هاو آر يو تودي", "يومي"]] },
    grammar: { lessons: [{ id: "g_example", title: "Present simple", titleAr: "المضارع البسيط", level: "A1", explain: [["متى نستخدمه؟", "نستخدمه للعادات اليومية."]], examples: [["I work every day.", "أنا بشتغل كل يوم.", "آي ورك إيڤري داي"]], exercises: [["She ___ to work.", "هي ___ للشغل.", ["go", "goes"], 1]] }] },
    numbers: { lessons: [{ id: "n_example", title: "Numbers 1-10", titleAr: "الأرقام من 1 لـ 10", level: "A1", explain: [["الأرقام", "one, two, three..."]], examples: [["One, two, three.", "واحد، اتنين، تلاتة.", "وان، تو، ثري"]], exercises: [["What is 2?", "إيه رقم 2؟", ["one", "two"], 1]] }] },
    beginners: { lessons: [{ id: "b_example", title: "Hello", titleAr: "أهلاً", level: "A1", explain: [["التحية", "Hello يعني أهلاً."]], examples: [["Hello!", "أهلاً!", "هيلو"]], exercises: [["Hello means:", "Hello معناها:", ["أهلاً", "وداعاً"], 0]] }] },
    stories: { stories: [{ id: "s_example", title: "My day", titleAr: "يومي", level: "A1", lines: [["I wake up at six.", "بصحى الساعة ستة.", "آي ويك أب آت سيكس"]] }] },
    jobs: { tracks: [{ id: "J_example", name: "اسم المهنة", icon: "💼" }], data: { J_example: { words: [["tool", "أداة", "تول", "Bring the tool."]] } } }
  };
  function isStr(x) { return typeof x === "string" && x.trim().length > 0; }
  function kk(s) { return String(s || "").trim().toLowerCase(); }
  function arrList(o, key) { return Array.isArray(o) ? o : (o && Array.isArray(o[key]) ? o[key] : null); }
  // returns an error text, or null when the file is fine for this section
  function checkSection(key, o) {
    var list, i, j, x;
    if (key === "words" || key === "sentences") {
      list = arrList(o, key); if (!list || !list.length) return "الملف لازم يحتوي على قائمة \"" + key + "\".";
      for (i = 0; i < list.length; i++) { x = list[i];
        if (!Array.isArray(x) || x.length < 2 || !isStr(x[0]) || !isStr(x[1])) return "عنصر غير صالح رقم " + (i + 1) + " (لازم [إنجليزي، عربي، نطق، مثال]).";
        for (j = 2; j < x.length; j++) if (x[j] != null && typeof x[j] !== "string") return "عنصر رقم " + (i + 1) + ": الحقول لازم تكون نصوص.";
      }
      return null;
    }
    if (key === "grammar" || key === "numbers" || key === "beginners") {
      list = arrList(o, "lessons"); if (!list || !list.length) return "الملف لازم يحتوي على قائمة \"lessons\".";
      for (i = 0; i < list.length; i++) { x = list[i]; var n = "درس رقم " + (i + 1) + ": ";
        if (!x || !/^[A-Za-z0-9_\-]+$/.test(String(x.id || ""))) return n + "id ناقص أو غير صالح.";
        if (!isStr(x.title) || !isStr(x.titleAr) || !isStr(x.level)) return n + "title و titleAr و level مطلوبين.";
        if (!Array.isArray(x.explain) || !x.explain.length || x.explain.some(function (e) { return !Array.isArray(e) || !isStr(e[0]) || !isStr(e[1]); })) return n + "explain لازم يكون [[عنوان، شرح]].";
        if (!Array.isArray(x.examples) || !x.examples.length || x.examples.some(function (e) { return !Array.isArray(e) || !isStr(e[0]) || !isStr(e[1]); })) return n + "examples لازم يكون [[إنجليزي، عربي، نطق]].";
        if (!Array.isArray(x.exercises) || !x.exercises.length || x.exercises.some(function (e) { return !Array.isArray(e) || !isStr(e[0]) || !Array.isArray(e[2]) || e[2].length < 2 || e[2].some(function (p) { return !isStr(p); }) || typeof e[3] !== "number" || e[3] < 0 || e[3] >= e[2].length || e[3] % 1 !== 0; })) return n + "exercises لازم يكون [[سؤال، عربي، [اختيارات]، رقم الصح]].";
      }
      return null;
    }
    if (key === "stories") {
      list = arrList(o, "stories"); if (!list || !list.length) return "الملف لازم يحتوي على قائمة \"stories\".";
      for (i = 0; i < list.length; i++) { x = list[i]; var m = "قصة رقم " + (i + 1) + ": ";
        if (!x || !/^[A-Za-z0-9_\-]+$/.test(String(x.id || ""))) return m + "id ناقص أو غير صالح.";
        if (!isStr(x.title) || !isStr(x.level)) return m + "title و level مطلوبين.";
        if (!Array.isArray(x.lines) || !x.lines.length || x.lines.some(function (e) { return !Array.isArray(e) || !isStr(e[0]) || !isStr(e[1]); })) return m + "lines لازم يكون [[إنجليزي، عربي، نطق]].";
      }
      return null;
    }
    return "قسم غير معروف.";
  }
  // Pure merge. cur = existing parsed data of the doc. Returns { out, added, skipped, replaced }.
  function mergeSection(key, cur, o) {
    var added = 0, skipped = 0, replaced = 0, out, list, seen, i;
    if (key === "words" || key === "sentences") {
      out = (cur && typeof cur === "object" && !Array.isArray(cur)) ? cur : { words: Array.isArray(cur) ? cur : [], sentences: [] };
      if (!Array.isArray(out.words)) out.words = []; if (!Array.isArray(out.sentences)) out.sentences = [];
      var target = out[key]; seen = {};
      target.forEach(function (w) { seen[kk(Array.isArray(w) ? w[0] : w && w.en)] = 1; });
      list = arrList(o, key);
      list.forEach(function (w) {
        var k = kk(w[0]);
        if (seen[k]) { skipped++; return; }
        seen[k] = 1;
        var c = [String(w[0]).trim(), String(w[1]).trim(), String(w[2] || ""), String(w[3] || (key === "sentences" ? "يومي" : ""))];
        target.push(c); added++;
      });
      return { out: out, added: added, skipped: skipped, replaced: 0 };
    }
    if (key === "jobs") {
      var cj = (cur && typeof cur === "object" && !Array.isArray(cur)) ? cur : {};
      var tl = Array.isArray(cj.__tracks) ? cj.__tracks.slice() : [];
      var m = JSON.parse(mergeJobs(JSON.stringify(cj), o));
      Object.keys(o.data).forEach(function (id) { if (cj[id]) replaced++; else added++; });
      return { out: m, added: added, skipped: 0, replaced: replaced };
    }
    out = Array.isArray(cur) ? cur.slice() : [];
    list = arrList(o, key === "stories" ? "stories" : "lessons");
    list.forEach(function (it) {
      var idx = -1; for (i = 0; i < out.length; i++) if (out[i] && out[i].id === it.id) { idx = i; break; }
      if (idx >= 0) { out[idx] = it; replaced++; } else { out.push(it); added++; }
    });
    return { out: out, added: added, skipped: 0, replaced: replaced };
  }
  function secRef(key, lv) { return key === "words" || key === "sentences" ? ["lessons", lv] : ["content", key]; }
  function secLabel(key, lv) { var s = SECTIONS.filter(function (x) { return x.key === key; })[0]; return (s ? s.label.replace(/ \(.*\)$/, "") : key) + (lv ? " " + lv : ""); }
  async function importSection(key, lv, text) {
    var o;
    try { o = JSON.parse(text); } catch (e) { alert("الملف مش JSON صحيح."); return false; }
    if (key === "jobs") { var bj = checkTracksFile(o); if (bj) { alert(bj); return false; } }
    else { var bad = checkSection(key, o); if (bad) { alert(bad); return false; } }
    if ((key === "words" || key === "sentences") && LV.indexOf(lv) < 0) { alert("اختر المستوى الأول (A1, A2, B1, B2)."); return false; }
    var ref = secRef(key, lv), docRef = fbD.collection(ref[0]).doc(ref[1]);
    try {
      var snap = await docRef.get();
      var ex = snap.exists && snap.data() && typeof snap.data().data === "string" ? snap.data().data : "";
      if (!ex) { alert("القسم ده مش موجود على Firebase (" + ref.join("/") + "). ارفع الدروس الأساسية الأول من ☁️ رفع الدروس. لم يتم تغيير أي شيء."); return false; }
      var cur; try { cur = JSON.parse(ex); } catch (e) { alert("المحتوى الحالي على Firebase مش قابل للقراءة. لم يتم تغيير أي شيء."); return false; }
      if ((key === "words" || key === "sentences") && (!cur || (!Array.isArray(cur) && !Array.isArray(cur.words)))) { alert("شكل المحتوى الحالي غير متوقع. لم يتم تغيير أي شيء."); return false; }
      var r = mergeSection(key, cur, o), s = JSON.stringify(r.out), n = bytes(s);
      if (n > 900000) { alert("الحجم بعد الدمج كبير جداً (" + n + " بايت، الحد 900000). لم يتم تغيير أي شيء."); return false; }
      if (!r.added && !r.replaced) { alert("كل العناصر موجودة بالفعل (" + r.skipped + " مكرر). لم يتم تغيير أي شيء."); return false; }
      var msg = "رفع إلى: " + secLabel(key, lv) + "\n\nجديد: " + r.added + (r.replaced ? "\nمستبدل (نفس الـ id): " + r.replaced : "") + (r.skipped ? "\nمكرر وتم تخطيه: " + r.skipped : "") + "\n\nالمحتوى الموجود لا يُحذف.";
      if (!confirm(msg)) return false;
      await fbD.runTransaction(async function (tx) {
        var fresh = await tx.get(docRef);
        var fx = fresh.exists && fresh.data() && typeof fresh.data().data === "string" ? fresh.data().data : "";
        if (!fx) throw new Error("المستند اختفى");
        var rr = mergeSection(key, JSON.parse(fx), o), ss = JSON.stringify(rr.out);
        if (bytes(ss) > 900000) throw new Error("الحجم كبير");
        tx.set(docRef, { data: ss, updatedAt: Date.now() });
      });
      delete have[ref.join("/")];
      try { await load(fbA.currentUser); } catch (e) {}
      say("تم الرفع ✅ " + r.added + " جديد" + (r.skipped ? " • " + r.skipped + " مكرر" : ""));
      return true;
    } catch (e) { alert("فشل الرفع (لم يتغير شيء): " + (e && e.message || e)); return false; }
  }
  function downloadTemplate(key, lv) {
    var t = JSON.parse(JSON.stringify(TEMPLATES[key])); if (t.level && lv) t.level = lv;
    var b = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" }), a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = "template-" + key + (lv ? "-" + lv : "") + ".json";
    document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); URL.revokeObjectURL(a.href); }, 500);
  }
  function pickFor(key, lv) {
    var inp = document.createElement("input"); inp.type = "file"; inp.accept = ".json,application/json";
    inp.onchange = function () {
      var f = inp.files && inp.files[0]; if (!f) return;
      var r = new FileReader(); r.onload = function () { importSection(key, lv, String(r.result || "")); }; r.readAsText(f);
    };
    inp.click();
  }
  function curScreen() { var a = document.querySelector(".screen.active"); return a ? a.id : ""; }
  function openSheet() {
    var old = document.getElementById("sp-up-sheet"); if (old) { old.remove(); return; }
    var here = curScreen(), lvl = "A1";
    try { if (typeof state !== "undefined" && LV.indexOf(state.currentLevel) >= 0) lvl = state.currentLevel; } catch (e) {}
    var wrap = el("div", "position:fixed;inset:0;z-index:2147482000;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;justify-content:center;direction:rtl;font-family:Cairo,system-ui,sans-serif;");
    wrap.id = "sp-up-sheet";
    wrap.onclick = function (e) { if (e.target === wrap) wrap.remove(); };
    var box = el("div", "background:#11151f;border:1px solid #d4af37;border-radius:18px 18px 0 0;width:100%;max-width:520px;max-height:84vh;overflow:auto;padding:14px;color:#f5f5f5;");
    box.appendChild(el("div", "font-weight:800;font-size:1rem;margin-bottom:4px;", "📥 رفع محتوى (للأدمن)"));
    box.appendChild(el("div", "font-size:.76rem;color:#aab;margin-bottom:10px;", "اختر القسم ثم الملف. المحتوى الموجود لا يتحذف، والمكرر بيتخطى."));
    var lvRow = el("div", "display:flex;gap:6px;margin-bottom:10px;align-items:center;");
    lvRow.appendChild(el("span", "font-size:.78rem;color:#aab;", "المستوى للكلمات والجمل:"));
    var btns = LV.map(function (l) {
      var b = el("button", "flex:1;padding:6px 0;border-radius:10px;border:1px solid #d4af37;font:700 .8rem Cairo,system-ui,sans-serif;cursor:pointer;", l);
      b.onclick = function () { lvl = l; paint(); }; return b;
    });
    btns.forEach(function (b) { lvRow.appendChild(b); });
    function paint() { btns.forEach(function (b) { var on = b.textContent === lvl; b.style.background = on ? "#d4af37" : "transparent"; b.style.color = on ? "#090b10" : "#d4af37"; }); }
    paint(); box.appendChild(lvRow);
    var order = SECTIONS.slice().sort(function (a, b) { return (b.where === here) - (a.where === here); });
    order.forEach(function (s) {
      var row = el("div", "display:flex;gap:6px;margin-bottom:8px;align-items:center;" + (s.where === here ? "background:rgba(212,175,55,.12);border-radius:12px;padding:4px;" : ""));
      var up = el("button", "flex:1;text-align:right;padding:10px 12px;border-radius:12px;border:1px solid #2a3140;background:#171c28;color:#f5f5f5;font:700 .86rem Cairo,system-ui,sans-serif;cursor:pointer;", s.label + (s.lv ? " (" + lvl + ")" : ""));
      up.onclick = function () { wrap.remove(); if (s.key === "jobs") pickTracksFile(); else pickFor(s.key, s.lv ? lvl : null); };
      var tp = el("button", "padding:10px;border-radius:12px;border:1px solid #2a3140;background:transparent;color:#d4af37;font:700 .74rem Cairo,system-ui,sans-serif;cursor:pointer;", "⬇️ نموذج");
      tp.onclick = function () { downloadTemplate(s.key, s.lv ? lvl : null); };
      row.appendChild(up); row.appendChild(tp); box.appendChild(row);
    });
    var cl = el("button", "width:100%;margin-top:4px;padding:10px;border-radius:12px;border:0;background:#d4af37;color:#090b10;font:800 .86rem Cairo,system-ui,sans-serif;cursor:pointer;", "إغلاق");
    cl.onclick = function () { wrap.remove(); };
    box.appendChild(cl); wrap.appendChild(box); document.body.appendChild(wrap);
  }
  function floatBtn(user) {
    var old = document.getElementById("sp-up-fab");
    var isAdm = user && (user.email || "").toLowerCase() === ADMIN;
    if (!isAdm) { if (old) old.remove(); var s = document.getElementById("sp-up-sheet"); if (s) s.remove(); return; }
    if (old) return;
    var b = el("button", "position:fixed;left:12px;bottom:92px;z-index:2147481000;width:46px;height:46px;border-radius:50%;border:2px solid #d4af37;background:#11151f;color:#d4af37;font-size:1.3rem;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.5);", "📥");
    b.id = "sp-up-fab"; b.setAttribute("aria-label", "رفع محتوى");
    b.onclick = openSheet; document.body.appendChild(b);
  }
  fbA.onAuthStateChanged(floatBtn);
  window.__spVault = { collect: collect, wipe: wipe, apply: apply, checkTracksFile: checkTracksFile, mergeJobs: mergeJobs, importTracks: importTracks, checkSection: checkSection, mergeSection: mergeSection, importSection: importSection };
})();
