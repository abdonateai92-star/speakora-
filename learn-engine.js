// ===== Learn section: grammar, numbers, absolute beginners =====
(function () {
  var COLS = [
    { key: "grammar", arr: "SPEAKORA_GRAMMAR", done: "grammarDone", label: "📘 قواعد", ico: "📘" },
    { key: "numbers", arr: "SPEAKORA_NUMBERS", done: "numbersDone", label: "🔢 أرقام", ico: "🔢" },
    { key: "beginner", arr: "SPEAKORA_BEGINNERS", done: "beginnerDone", label: "🌱 من الصفر", ico: "🌱" }
  ];
  var curCol = 0, sel = null;
  function mk(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function stopSpeech() { try { window.speechSynthesis.cancel(); } catch (e) {} }
  function goHome() {
    stopSpeech();
    document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
    document.getElementById("sc-path").classList.add("active");
  }
  function setup() {
    var st = document.getElementById("sc-stories"), ob = document.getElementById("open-stories-btn");
    if (!st || !ob || document.getElementById("sc-learn")) return;
    var sec = mk("section", "screen"); sec.id = "sc-learn";
    sec.innerHTML = '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;"><strong style="font-size:1rem;">📘 دروس القواعد والأرقام</strong><button class="mini-btn" id="learn-back" style="width:auto; padding:0 12px; border-radius:11px; font-size:0.78rem;">رجوع</button></div><div id="learn-tabs" style="display:flex; gap:6px; margin-bottom:12px;"></div><div id="learn-body"></div>';
    st.parentNode.insertBefore(sec, st);
    var btn = mk("button", "btn-gold", "📘 قواعد وأرقام ومن الصفر"); btn.id = "open-learn-btn"; btn.style.marginBottom = "12px";
    ob.parentNode.insertBefore(btn, ob.nextSibling);
    btn.onclick = function () {
      document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
      sec.classList.add("active"); sel = null; render(); window.scrollTo(0, 0);
    };
    document.getElementById("learn-back").onclick = goHome;
  }
  function render() {
    var box = document.getElementById("learn-body"), tabs = document.getElementById("learn-tabs");
    if (!box || !tabs) return;
    var col = COLS[curCol];
    if (typeof state === "undefined") return;
    if (!state[col.done]) state[col.done] = {};
    var doneMap = state[col.done];
    var list = window[col.arr] || [];
    tabs.innerHTML = ""; box.innerHTML = "";
    COLS.forEach(function (c, i) {
      var b = mk("button", i === curCol ? "btn-gold" : "btn-outline", c.label);
      b.style.cssText = "flex:1; padding:8px 4px; font-size:0.8rem;";
      b.onclick = function () { stopSpeech(); curCol = i; sel = null; render(); };
      tabs.appendChild(b);
    });
    if (!sel) {
      tabs.style.display = "flex";
      if (!list.length) { box.appendChild(mk("div", "card", "لا توجد دروس بعد.")); return; }
      var nDone = list.filter(function (g) { return doneMap[g.id]; }).length;
      var prog = mk("div", "card", "تقدمك: " + nDone + " من " + list.length + " درس"); prog.style.textAlign = "center"; box.appendChild(prog);
      list.forEach(function (g, i) {
        var b = mk("button", "card");
        b.style.cssText = "width:100%; text-align:right; cursor:pointer; color:inherit; font:inherit;";
        var t = mk("strong", "", col.ico + " " + (i + 1) + ". " + g.titleAr);
        var s = mk("div", "", g.title + " • " + g.level + (doneMap[g.id] ? " • ✓ تم" : ""));
        s.style.cssText = "font-size:0.78rem; color:var(--muted); margin-top:4px;";
        b.appendChild(t); b.appendChild(s);
        b.onclick = function () { sel = g.id; render(); window.scrollTo(0, 0); };
        box.appendChild(b);
      });
      return;
    }
    var g = list.filter(function (x) { return x.id === sel; })[0];
    if (!g) { sel = null; return render(); }
    tabs.style.display = "none";
    var head = mk("div", "card");
    head.appendChild(mk("strong", "", col.ico + " " + g.titleAr + " (" + g.title + ")"));
    var back = mk("button", "mini-btn", "كل الدروس");
    back.style.cssText = "width:auto; padding:0 10px; border-radius:11px; font-size:0.74rem; float:left;";
    back.onclick = function () { stopSpeech(); sel = null; render(); window.scrollTo(0, 0); };
    head.appendChild(back); box.appendChild(head);
    g.explain.forEach(function (x) {
      var c = mk("div", "card");
      c.appendChild(mk("strong", "", x[0]));
      var p = mk("div", "", x[1]); p.style.cssText = "margin-top:6px; line-height:1.8; white-space:pre-line;";
      c.appendChild(p); box.appendChild(c);
    });
    var et = mk("div", "", "✏️ أمثلة"); et.style.cssText = "font-weight:800; margin:16px 0 8px;"; box.appendChild(et);
    g.examples.forEach(function (l) {
      var d = mk("div", "card"), row = mk("div", "en-row"), acts = mk("div", "mini-actions");
      var p1 = mk("button", "mini-btn", "🔊"); p1.onclick = function () { speak(l[0]); };
      var p2 = mk("button", "mini-btn", "🐢"); p2.onclick = function () { speak(l[0], 0.62); };
      acts.appendChild(p1); acts.appendChild(p2);
      row.appendChild(mk("div", "en-txt", l[0])); row.appendChild(acts);
      d.appendChild(row); d.appendChild(mk("div", "ar-txt", l[1])); d.appendChild(mk("div", "ph-tag", l[2]));
      box.appendChild(d);
      if (typeof storyMic === "function") storyMic(l[0], acts, d);
    });
    var qt = mk("div", "", "🎯 تمارين"); qt.style.cssText = "font-weight:800; margin:16px 0 8px;"; box.appendChild(qt);
    var result = mk("div", "card"); result.style.cssText = "text-align:center; display:none;";
    var total = g.exercises.length, answers = {}, correct = 0, answered = 0;
    g.exercises.forEach(function (q, qi) {
      var card = mk("div", "card"), t = mk("div");
      t.style.marginBottom = "8px";
      var q1 = mk("strong", "", q[0]); q1.style.cssText = "direction:ltr; display:block;";
      t.appendChild(q1);
      var q2 = mk("div", "", q[1]); q2.style.cssText = "font-size:0.78rem; color:var(--muted);"; t.appendChild(q2);
      card.appendChild(t);
      var btns = [];
      q[2].forEach(function (opt, oi) {
        var b = mk("button", "btn-outline", opt); b.style.cssText = "margin-top:6px; width:100%;"; btns.push(b);
        b.onclick = function () {
          if (answers[qi] !== undefined) return;
          answers[qi] = oi; answered++;
          if (oi === q[3]) { correct++; b.style.borderColor = "var(--success)"; playTone(true); }
          else { b.style.borderColor = "#ef4444"; btns[q[3]].style.borderColor = "var(--success)"; playTone(false); }
          if (answered < total) return;
          result.style.display = "block"; result.innerHTML = "";
          if (correct >= Math.ceil(total * 2 / 3)) {
            var first = !doneMap[g.id];
            doneMap[g.id] = { score: correct, date: new Date().toLocaleDateString("ar-EG") };
            result.appendChild(mk("strong", "", "أحسنت! " + correct + " من " + total + " ✓" + (first ? " ⚡ +20 XP" : "")));
            if (first) addXp(20); else saveState();
          } else {
            result.appendChild(mk("strong", "", correct + " من " + total + " - راجع الشرح وجرب تاني"));
            var r = mk("button", "btn-gold", "إعادة المحاولة ↻"); r.style.marginTop = "8px"; r.onclick = function () { render(); window.scrollTo(0, 0); };
            result.appendChild(r);
          }
        };
        card.appendChild(b);
      });
      box.appendChild(card);
    });
    box.appendChild(result);
  }
  window.SPEAKORA_LEARN_RENDER = render;
  setup();
})();
