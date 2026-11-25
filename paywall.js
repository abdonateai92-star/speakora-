/* Speakora paywall, phase 1, PER-LEVEL (A1, A2, B1, B2 unlocked one by one).
   OFF by default: nothing happens until Firestore doc paywall_config/main has mode "test" or "on".
   Rollback: set mode to "off" (one field), or remove the <script src="paywall.js"> line.
   Unlocks live in subscriptions/{uid}: levels (array, e.g. ["A1","B1"]) and optional until (map level -> ms). */
(function () {
  "use strict";
  (function(){try{if(document.getElementById("sp-polish"))return;var s=document.createElement("style");s.id="sp-polish";s.textContent=":root{--r-card:18px;--r-btn:14px;--gold-text:#f4d77b;--pl-glow:0 0 0 1px rgba(212,175,55,.10) inset,0 10px 30px rgba(0,0,0,.45)}body.light{--muted:#52607a;--gold-text:#7a5c0e;--pl-glow:0 0 0 1px rgba(168,130,29,.10) inset,0 8px 24px rgba(20,24,33,.08)}.icon-btn{width:36px;height:36px;background:var(--card)}.icon-btn.gold-ring{border-color:var(--border-strong)}.pill{background:var(--card)}.wotd-card,.hero,.card,.goal-strip,.qa-btn{border-radius:var(--r-card)}.wotd-card{background:linear-gradient(135deg,rgba(212,175,55,.10),var(--card));box-shadow:var(--pl-glow)}.hero,.goal-strip,.qa-btn{box-shadow:var(--pl-glow)}body.light .wotd-card,body.light .goal-strip,body.light .qa-btn{background:#fff}body.light .wotd-card{background:linear-gradient(135deg,#fff8e1,#fff)}body.light .wotd-card .en-txt,body.light .wotd-card h3{color:var(--gold-text)}body.light .hero{background:linear-gradient(135deg,#fff6d8,#fff);border:1px solid rgba(168,130,29,.4)}body.light .hero h2{color:#141821}body.light .hero p{color:#475569}body.light .hero-meta,body.light .hero-tag{color:var(--gold-text)}.lvl-btn{border-radius:var(--r-btn)}.lvl-btn.locked{opacity:.78}.qa-btn{min-height:62px}.btn-gold,.btn-outline{border-radius:var(--r-btn);min-height:46px}.chip{border-radius:999px}.chips{padding-inline:2px}.bnav{border-top:1px solid var(--border)}.n-btn{position:relative;font-size:.72rem;font-weight:700}.n-btn .ic{font-size:1.25rem;filter:grayscale(1);opacity:.62;transition:opacity .2s}.n-btn.active .ic{filter:none;opacity:1}.n-btn.active::before{content:\"\";position:absolute;top:-1px;left:24%;right:24%;height:3px;border-radius:0 0 4px 4px;background:var(--gold-grad)}body.light .n-btn.active{color:var(--gold-text)}#open-admin-prof{background:transparent!important;color:var(--gold-text)!important;border:1px solid var(--border-strong)!important;box-shadow:none!important;text-align:right;font-weight:700;min-height:44px}#open-admin-prof:not([style*=\"none\"]){display:block!important}/* paywall / lock screens */.sp-ov{background:radial-gradient(circle at top,#1a2033 0,var(--bg,#090b10) 70%);color:var(--text,#f8fafc)}body.light .sp-ov{background:var(--bg,#f6f4ee)}.sp-box{background:var(--card,#151a26);border:1.5px solid var(--border-strong,rgba(212,175,55,.55));border-radius:24px;box-shadow:var(--pl-glow);padding:26px 22px}.sp-box h2{font-size:1.35rem;color:var(--text,#f8fafc)}.sp-box p{color:var(--muted,#94a3b8)}.sp-price1{color:var(--gold-text);font-weight:800;font-size:1.02rem}.sp-prices{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.sp-pr{background:var(--card-2,#1c2233);border:1px solid var(--border,rgba(212,175,55,.22));border-radius:14px;padding:10px 6px}.sp-pr b{display:block;font-size:1.05rem;color:var(--text,#f8fafc)}.sp-pr span{color:var(--gold-text);font-weight:800;font-size:.9rem}.sp-steps{background:var(--card-2,#1c2233);border:1px solid var(--border,rgba(212,175,55,.22));border-radius:14px;padding:12px 14px;font-size:.92rem;line-height:2;text-align:right;color:var(--text,#f8fafc)}.sp-wallet{text-align:center;font-size:1.3rem;font-weight:800;color:var(--gold-text);direction:ltr;letter-spacing:1px;margin:4px 0}.sp-b{display:block;width:100%;margin:10px 0 0;padding:13px;min-height:48px;border-radius:var(--r-btn,14px);font-size:1rem;font-weight:800;cursor:pointer}.sp-b1{background:var(--gold-grad,linear-gradient(135deg,#f4d77b,#d4af37 52%,#a8821d));color:#090b10;border:0}.sp-b2{background:transparent;color:var(--gold-text);border:1.5px solid var(--border-strong,rgba(212,175,55,.55))}.sp-b3{background:transparent;color:var(--muted,#94a3b8);border:1px solid var(--border,rgba(212,175,55,.22));font-weight:700}.sp-am{background:var(--card,#1e293b);color:var(--gold-text);border:1px solid var(--border-strong,#d4af37);border-radius:999px;padding:7px 12px;font-size:.76rem;font-weight:700;cursor:pointer;white-space:nowrap;box-shadow:var(--pl-glow)}.path-wrap{display:grid!important;grid-template-columns:repeat(4,1fr);gap:8px!important}.path-node-row,.path-node-row.left,.path-node-row.right{padding:0!important;display:block!important}.path-node-row:has(.lesson-node.current){grid-column:1/-1;order:-1}.lesson-node{width:100%!important;max-width:none!important;padding:0!important;border-radius:14px!important;aspect-ratio:1/1;flex-direction:column;justify-content:center!important;gap:0!important;box-shadow:none!important;background:var(--card)}.lesson-node .node-txt,.lesson-node .node-badge{display:none}.node-circle{width:100%!important;height:100%!important;border:0!important;background:transparent!important;border-radius:14px!important;font-size:1.15rem!important;font-weight:900;color:var(--text)}.lesson-node.passed{background:rgba(16,185,129,.14);border-color:rgba(16,185,129,.5)!important}.lesson-node.locked{opacity:1!important;background:var(--card-2);border-style:dashed}.lesson-node.locked .node-circle{filter:grayscale(1);opacity:.45;font-size:.95rem!important}/* current lesson = wide card on top */.path-node-row:has(.lesson-node.current) .lesson-node{aspect-ratio:auto;flex-direction:row;justify-content:space-between!important;padding:14px 16px!important;gap:12px!important;border:1.5px solid var(--gold)!important;background:linear-gradient(135deg,rgba(212,175,55,.16),var(--card))}body.light .path-node-row:has(.lesson-node.current) .lesson-node{background:linear-gradient(135deg,#fff3c9,#fff)}.path-node-row:has(.lesson-node.current) .node-txt,.path-node-row:has(.lesson-node.current) .node-badge{display:block}.path-node-row:has(.lesson-node.current) .node-circle{width:46px!important;height:46px!important;background:var(--gold-grad)!important;color:#090b10!important;border-radius:50%!important;flex-shrink:0}.path-node-row:has(.lesson-node.current) .node-badge{background:var(--gold-grad);color:#090b10;border:0}.path-wrap{counter-reset:n}.path-node-row{counter-increment:n}.lesson-node{position:relative;overflow:hidden}.lesson-node.passed::after{content:counter(n);position:absolute;top:4px;right:7px;font-size:.62rem;font-weight:800;color:var(--muted)}.lesson-node.locked .node-circle{font-size:0!important}.lesson-node.locked::after{content:counter(n);position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.05rem;font-weight:800;color:var(--muted);opacity:.7}.lesson-node.locked::before{content:\"\ud83d\udd12\";position:absolute;top:4px;right:6px;font-size:.6rem;filter:grayscale(1);opacity:.6}.path-node-row:has(.lesson-node.current) .lesson-node::after,.path-node-row:has(.lesson-node.current) .lesson-node::before{display:none}.lesson-node.passed .node-circle{font-size:1.2rem!important;padding-top:6px}.lesson-node.open{background:var(--card)}.lesson-node.open .node-circle{font-size:1.15rem!important}#sp-pro-fab.sp-in{position:static!important;display:flex!important;align-items:center;justify-content:center;width:100%;margin:0 0 12px!important;padding:12px!important;border-radius:var(--r-btn)!important;font-size:.9rem!important;box-shadow:var(--pl-glow)!important}*{font-family:'Cairo',system-ui,-apple-system,'Segoe UI',Tahoma,sans-serif}.sp-i{display:inline-block;width:1em;height:1em;vertical-align:-.17em;background:currentColor;-webkit-mask-position:center;mask-position:center;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain}.sp-i.flame{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3c.5 4 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2 1-3.3 2-4.5.2 2 1 3 2 3 .3-3-1-5.5 1-9z'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3c.5 4 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2 1-3.3 2-4.5.2 2 1 3 2 3 .3-3-1-5.5 1-9z'/%3E%3C/svg%3E\")}.sp-i.bolt{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2L4 14h7l-1 8 9-12h-7z'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2L4 14h7l-1 8 9-12h-7z'/%3E%3C/svg%3E\")}.sp-i.lock{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 8 0v4'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 8 0v4'/%3E%3C/svg%3E\")}.n-btn .ic{font-size:0!important;filter:none!important;opacity:1!important;display:flex;justify-content:center}.n-btn{color:var(--muted)}.n-btn.active{color:var(--gold-light)}body.light .n-btn.active{color:var(--gold-text)}.n-btn[data-sc=\"path\"] .ic::before{content:\"\";display:block;width:24px;height:24px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z'/%3E%3C/svg%3E\") center/contain no-repeat;}.n-btn[data-sc=\"sentences\"] .ic::before{content:\"\";display:block;width:24px;height:24px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.4A8 8 0 1 1 21 12z'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.4A8 8 0 1 1 21 12z'/%3E%3C/svg%3E\") center/contain no-repeat;}.n-btn[data-sc=\"practice\"] .ic::before{content:\"\";display:block;width:24px;height:24px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='3' width='6' height='11' rx='3'/%3E%3Cpath d='M5 11a7 7 0 0 0 14 0M12 18v3'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='3' width='6' height='11' rx='3'/%3E%3Cpath d='M5 11a7 7 0 0 0 14 0M12 18v3'/%3E%3C/svg%3E\") center/contain no-repeat;}.n-btn[data-sc=\"dict\"] .ic::before{content:\"\";display:block;width:24px;height:24px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'/%3E%3C/svg%3E\") center/contain no-repeat;}.n-btn[data-sc=\"profile\"] .ic::before{content:\"\";display:block;width:24px;height:24px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 20V11M12 20V4M19 20v-6'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 20V11M12 20V4M19 20v-6'/%3E%3C/svg%3E\") center/contain no-repeat;}.icon-btn{font-size:0!important;color:var(--text)}.icon-btn.gold-ring{color:var(--gold-text)}#open-search-btn::before{content:\"\";display:block;width:18px;height:18px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M21 21l-4.3-4.3'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M21 21l-4.3-4.3'/%3E%3C/svg%3E\") center/contain no-repeat;}#open-admin-hdr::before{content:\"\";display:block;width:18px;height:18px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z'/%3E%3C/svg%3E\") center/contain no-repeat;}#theme-btn::before{content:\"\";display:block;width:18px;height:18px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cpath d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cpath d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'/%3E%3C/svg%3E\") center/contain no-repeat;}body.light #theme-btn::before{content:\"\";display:block;width:18px;height:18px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z'/%3E%3C/svg%3E\") center/contain no-repeat;}.qa-ico{font-size:0!important;color:var(--gold-text)}#btn-speed-60 .qa-ico::before{content:\"\";display:block;width:20px;height:20px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2L4 14h7l-1 8 9-12h-7z'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2L4 14h7l-1 8 9-12h-7z'/%3E%3C/svg%3E\") center/contain no-repeat;}#btn-retake-placement .qa-ico::before{content:\"\";display:block;width:20px;height:20px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3C/svg%3E\") center/contain no-repeat;}.lesson-node.locked::before{content:\"\"!important;font-size:0!important;width:11px;height:11px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 8 0v4'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 8 0v4'/%3E%3C/svg%3E\") center/contain no-repeat;color:var(--muted);filter:none!important;opacity:.7!important}";(document.head||document.documentElement).appendChild(s);}catch(e){}})();
  (function(){try{var n=document.getElementById("path-nodes");if(!n||!window.MutationObserver)return;var fix=function(){var cs=n.querySelectorAll(".lesson-node.current");for(var i=1;i<cs.length;i++){cs[i].classList.remove("current");cs[i].classList.add("open");}};new MutationObserver(fix).observe(n,{childList:true});fix();}catch(e){}})();
  (function(){try{var h=document.head||document.documentElement;if(!document.getElementById("sp-cairo")){var l=document.createElement("link");l.id="sp-cairo";l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap";h.appendChild(l);}
document.querySelectorAll("header .pill").forEach(function(pl){var t=pl.firstChild;if(t&&t.nodeType===3){var k=/🔥/.test(t.textContent)?"flame":/⚡/.test(t.textContent)?"bolt":null;if(k){var i=document.createElement("i");i.className="sp-i "+k;pl.replaceChild(i,t);}}});
var g=document.getElementById("lvl-grid");if(g&&window.MutationObserver){var fx=function(){g.querySelectorAll("strong").forEach(function(s){if(s.textContent.indexOf("🔒")>-1)s.innerHTML=s.innerHTML.replace(/\s*🔒/,' <i class="sp-i lock"></i>');});};new MutationObserver(fx).observe(g,{childList:true});fx();}}catch(e){}})();
  (function(){try{var f=document.getElementById("sp-pro-fab"),h=document.querySelector("#sc-path .hero");if(f&&h&&!f.classList.contains("sp-in")){h.parentNode.insertBefore(f,h);f.classList.add("sp-in");}}catch(e){}})();
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

  // One small admin toggle (never over the bottom nav). Buttons from paywall.js and vault.js live in its panel.
  window.__spAdminMenu = window.__spAdminMenu || (function () {
    var fab = null, panel = null;
    function build() {
      if (fab) return;
      fab = document.createElement("button");
      fab.textContent = "⚙️";
      fab.setAttribute("aria-label", "admin");
      fab.style.cssText = "position:fixed;left:8px;bottom:calc(env(safe-area-inset-bottom,0px) + 100px);z-index:2147482000;width:34px;height:34px;border-radius:50%;border:1px solid #d4af37;background:#1e293b;color:#fde68a;font-size:16px;line-height:1;padding:0;cursor:pointer;opacity:0.85;";
      panel = document.createElement("div");
      panel.style.cssText = "position:fixed;left:8px;bottom:calc(env(safe-area-inset-bottom,0px) + 140px);z-index:2147482000;display:none;flex-direction:column;gap:6px;";
      fab.onclick = function () { panel.style.display = panel.style.display === "none" ? "flex" : "none"; };
      document.body.appendChild(panel); document.body.appendChild(fab);
    }
    return {
      add: function (id, label, fn) {
        build();
        if (panel.querySelector('[data-id="' + id + '"]')) return;
        var b = document.createElement("button");
        b.setAttribute("data-id", id); b.textContent = label;
        b.className = "sp-am";
        b.onclick = function () { panel.style.display = "none"; fn(); };
        panel.appendChild(b);
      },
      clear: function () { if (fab) { fab.remove(); panel.remove(); fab = null; panel = null; } }
    };
  })();

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
    var b = el("button", "", label);
    b.className = "sp-b " + (bg === "#16a34a" ? "sp-b1" : bg === "#334155" ? "sp-b3" : "sp-b2");
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
    overlayEl = el("div", "position:fixed;inset:0;z-index:2147483000;overflow-y:auto;direction:rtl;padding:24px 18px;");
    overlayEl.className = "sp-ov";
    var box = el("div", "max-width:440px;margin:30px auto;text-align:center;line-height:1.8;");
    box.className = "sp-box";
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
    if (level) { var pp = el("p", "", priceText(cfg, level)); pp.className = "sp-price1"; b.appendChild(pp); }
    else { var g = el("div", ""); g.className = "sp-prices"; LEVELS.forEach(function (l) { var c = el("div", ""); c.className = "sp-pr"; c.appendChild(el("b", "", l)); c.appendChild(el("span", "", priceOf(cfg, l) + " جنيه")); g.appendChild(c); }); b.appendChild(g); }
    var wallet = String(cfg.wallet || "").trim();
    var steps = el("div", ""); steps.className = "sp-steps";
    steps.appendChild(el("div", "", "1) حوّل " + (level ? priceOf(cfg, level) + " جنيه" : "سعر المستوى") + " بفودافون كاش على الرقم:"));
    var wl = el("div", "", wallet || "الرقم غير مضبوط بعد"); wl.className = "sp-wallet"; steps.appendChild(wl);
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
      b.appendChild(el("p", "", "أرسلنا رابط التفعيل إلى: " + user.email));
      b.appendChild(el("p", "font-size:0.85rem", "افتح الإيميل واضغط على الرابط (شوف مجلد Spam كمان)، ثم ارجع واضغط الزر."));
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
      b.appendChild(el("p", "font-size:0.9rem", "كل مستوى (A1، A2، B1، B2) يتفتح لوحده. اختر المستوى اللي عايزه."));
      payBox(b, user, cfg, "");
    });
  }

  // Some levels unlocked, the one currently open is not.
  function showLevelLock(user, cfg, level, allowed) {
    showOverlay(function (b) {
      b.appendChild(el("div", "font-size:2.2rem", "🔒"));
      b.appendChild(el("h2", "margin:6px 0", "المستوى " + level + " مقفول"));
      b.appendChild(el("p", "font-size:0.9rem", "اشترك في المستوى " + level + " لفتحه."));
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
    adminBtn = true;
    window.__spAdminMenu.add("pw-unlock", "💳 تفعيل مستوى", function () {
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
    });
  }

  async function evaluate(user) {
    if (busy) return; busy = true;
    try {
      clearUi();
      if (!user) { if (adminBtn) { window.__spAdminMenu.clear(); adminBtn = null; } return; }
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
