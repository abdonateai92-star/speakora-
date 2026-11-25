/* Speakora paywall, phase 1, PER-LEVEL (A1, A2, B1, B2 unlocked one by one).
   OFF by default: nothing happens until Firestore doc paywall_config/main has mode "test" or "on".
   Rollback: set mode to "off" (one field), or remove the <script src="paywall.js"> line.
   Unlocks live in subscriptions/{uid}: levels (array, e.g. ["A1","B1"]) and optional until (map level -> ms). */
(function () {
  "use strict";
  (function(){try{if(document.getElementById("sp-polish"))return;var s=document.createElement("style");s.id="sp-polish";s.textContent=":root{--r-card:18px;--r-btn:14px;--gold-text:#f4d77b;--pl-glow:0 0 0 1px rgba(212,175,55,.10) inset,0 10px 30px rgba(0,0,0,.45)}body.light{--muted:#52607a;--gold-text:#7a5c0e;--pl-glow:0 0 0 1px rgba(168,130,29,.10) inset,0 8px 24px rgba(20,24,33,.08)}.icon-btn{width:36px;height:36px;background:var(--card)}.icon-btn.gold-ring{border-color:var(--border-strong)}.pill{background:var(--card)}.wotd-card,.hero,.card,.goal-strip,.qa-btn{border-radius:var(--r-card)}.wotd-card{background:linear-gradient(135deg,rgba(212,175,55,.10),var(--card));box-shadow:var(--pl-glow)}.hero,.goal-strip,.qa-btn{box-shadow:var(--pl-glow)}body.light .wotd-card,body.light .goal-strip,body.light .qa-btn{background:#fff}body.light .wotd-card{background:linear-gradient(135deg,#fff8e1,#fff)}body.light .wotd-card .en-txt,body.light .wotd-card h3{color:var(--gold-text)}body.light .hero{background:linear-gradient(135deg,#fff6d8,#fff);border:1px solid rgba(168,130,29,.4)}body.light .hero h2{color:#141821}body.light .hero p{color:#475569}body.light .hero-meta,body.light .hero-tag{color:var(--gold-text)}.lvl-btn{border-radius:var(--r-btn)}.lvl-btn.locked{opacity:.78}.qa-btn{min-height:62px}.btn-gold,.btn-outline{border-radius:var(--r-btn);min-height:46px}.chip{border-radius:999px}.chips{padding-inline:2px}.bnav{border-top:1px solid var(--border)}.n-btn{position:relative;font-size:.72rem;font-weight:700}.n-btn .ic{font-size:1.25rem;filter:grayscale(1);opacity:.62;transition:opacity .2s}.n-btn.active .ic{filter:none;opacity:1}.n-btn.active::before{content:\"\";position:absolute;top:-1px;left:24%;right:24%;height:3px;border-radius:0 0 4px 4px;background:var(--gold-grad)}body.light .n-btn.active{color:var(--gold-text)}#open-admin-prof{background:transparent!important;color:var(--gold-text)!important;border:1px solid var(--border-strong)!important;box-shadow:none!important;text-align:right;font-weight:700;min-height:44px}#open-admin-prof:not([style*=\"none\"]){display:block!important}/* paywall / lock screens */.sp-ov{background:radial-gradient(circle at top,#1a2033 0,var(--bg,#090b10) 70%);color:var(--text,#f8fafc)}body.light .sp-ov{background:var(--bg,#f6f4ee)}.sp-box{background:var(--card,#151a26);border:1.5px solid var(--border-strong,rgba(212,175,55,.55));border-radius:24px;box-shadow:var(--pl-glow);padding:26px 22px}.sp-box h2{font-size:1.35rem;color:var(--text,#f8fafc)}.sp-box p{color:var(--muted,#94a3b8)}.sp-price1{color:var(--gold-text);font-weight:800;font-size:1.02rem}.sp-prices{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.sp-pr{background:var(--card-2,#1c2233);border:1px solid var(--border,rgba(212,175,55,.22));border-radius:14px;padding:10px 6px}.sp-pr b{display:block;font-size:1.05rem;color:var(--text,#f8fafc)}.sp-pr span{color:var(--gold-text);font-weight:800;font-size:.9rem}.sp-steps{background:var(--card-2,#1c2233);border:1px solid var(--border,rgba(212,175,55,.22));border-radius:14px;padding:12px 14px;font-size:.92rem;line-height:2;text-align:right;color:var(--text,#f8fafc)}.sp-wallet{text-align:center;font-size:1.3rem;font-weight:800;color:var(--gold-text);direction:ltr;letter-spacing:1px;margin:4px 0}.sp-b{display:block;width:100%;margin:10px 0 0;padding:13px;min-height:48px;border-radius:var(--r-btn,14px);font-size:1rem;font-weight:800;cursor:pointer}.sp-b1{background:var(--gold-grad,linear-gradient(135deg,#f4d77b,#d4af37 52%,#a8821d));color:#090b10;border:0}.sp-b2{background:transparent;color:var(--gold-text);border:1.5px solid var(--border-strong,rgba(212,175,55,.55))}.sp-b3{background:transparent;color:var(--muted,#94a3b8);border:1px solid var(--border,rgba(212,175,55,.22));font-weight:700}.sp-am{background:var(--card,#1e293b);color:var(--gold-text);border:1px solid var(--border-strong,#d4af37);border-radius:999px;padding:7px 12px;font-size:.76rem;font-weight:700;cursor:pointer;white-space:nowrap;box-shadow:var(--pl-glow)}.path-wrap{display:grid!important;grid-template-columns:repeat(4,1fr);gap:8px!important}.path-node-row,.path-node-row.left,.path-node-row.right{padding:0!important;display:block!important}.path-node-row:has(.lesson-node.current){grid-column:1/-1;order:-1}.lesson-node{width:100%!important;max-width:none!important;padding:0!important;border-radius:14px!important;aspect-ratio:1/1;flex-direction:column;justify-content:center!important;gap:0!important;box-shadow:none!important;background:var(--card)}.lesson-node .node-txt,.lesson-node .node-badge{display:none}.node-circle{width:100%!important;height:100%!important;border:0!important;background:transparent!important;border-radius:14px!important;font-size:1.15rem!important;font-weight:900;color:var(--text)}.lesson-node.passed{background:rgba(16,185,129,.14);border-color:rgba(16,185,129,.5)!important}.lesson-node.locked{opacity:1!important;background:var(--card-2);border-style:dashed}.lesson-node.locked .node-circle{filter:grayscale(1);opacity:.45;font-size:.95rem!important}/* current lesson = wide card on top */.path-node-row:has(.lesson-node.current) .lesson-node{aspect-ratio:auto;flex-direction:row;justify-content:space-between!important;padding:14px 16px!important;gap:12px!important;border:1.5px solid var(--gold)!important;background:linear-gradient(135deg,rgba(212,175,55,.16),var(--card))}body.light .path-node-row:has(.lesson-node.current) .lesson-node{background:linear-gradient(135deg,#fff3c9,#fff)}.path-node-row:has(.lesson-node.current) .node-txt,.path-node-row:has(.lesson-node.current) .node-badge{display:block}.path-node-row:has(.lesson-node.current) .node-circle{width:46px!important;height:46px!important;background:var(--gold-grad)!important;color:#090b10!important;border-radius:50%!important;flex-shrink:0}.path-node-row:has(.lesson-node.current) .node-badge{background:var(--gold-grad);color:#090b10;border:0}.path-wrap{counter-reset:n}.path-node-row{counter-increment:n}.lesson-node{position:relative;overflow:hidden}.lesson-node.passed::after{content:counter(n);position:absolute;top:4px;right:7px;font-size:.62rem;font-weight:800;color:var(--muted)}.lesson-node.locked .node-circle{font-size:0!important}.lesson-node.locked::after{content:counter(n);position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.05rem;font-weight:800;color:var(--muted);opacity:.7}.lesson-node.locked::before{content:\"\ud83d\udd12\";position:absolute;top:4px;right:6px;font-size:.6rem;filter:grayscale(1);opacity:.6}.path-node-row:has(.lesson-node.current) .lesson-node::after,.path-node-row:has(.lesson-node.current) .lesson-node::before{display:none}.lesson-node.passed .node-circle{font-size:1.2rem!important;padding-top:6px}.lesson-node.open{background:var(--card)}.lesson-node.open .node-circle{font-size:1.15rem!important}#sp-pro-fab.sp-in{position:static!important;display:flex!important;align-items:center;justify-content:center;width:100%;margin:0 0 12px!important;padding:12px!important;border-radius:var(--r-btn)!important;font-size:.9rem!important;box-shadow:var(--pl-glow)!important}*{font-family:'Cairo',system-ui,-apple-system,'Segoe UI',Tahoma,sans-serif}.sp-i{display:inline-block;width:1em;height:1em;vertical-align:-.17em;background:currentColor;-webkit-mask-position:center;mask-position:center;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain}.sp-i.flame{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3c.5 4 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2 1-3.3 2-4.5.2 2 1 3 2 3 .3-3-1-5.5 1-9z'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3c.5 4 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2 1-3.3 2-4.5.2 2 1 3 2 3 .3-3-1-5.5 1-9z'/%3E%3C/svg%3E\")}.sp-i.bolt{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2L4 14h7l-1 8 9-12h-7z'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2L4 14h7l-1 8 9-12h-7z'/%3E%3C/svg%3E\")}.sp-i.lock{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 8 0v4'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 8 0v4'/%3E%3C/svg%3E\")}.n-btn .ic{font-size:0!important;filter:none!important;opacity:1!important;display:flex;justify-content:center}.n-btn{color:var(--muted)}.n-btn.active{color:var(--gold-light)}body.light .n-btn.active{color:var(--gold-text)}.n-btn[data-sc=\"path\"] .ic::before{content:\"\";display:block;width:24px;height:24px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z'/%3E%3C/svg%3E\") center/contain no-repeat;}.n-btn[data-sc=\"sentences\"] .ic::before{content:\"\";display:block;width:24px;height:24px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.4A8 8 0 1 1 21 12z'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.4A8 8 0 1 1 21 12z'/%3E%3C/svg%3E\") center/contain no-repeat;}.n-btn[data-sc=\"practice\"] .ic::before{content:\"\";display:block;width:24px;height:24px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='3' width='6' height='11' rx='3'/%3E%3Cpath d='M5 11a7 7 0 0 0 14 0M12 18v3'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='3' width='6' height='11' rx='3'/%3E%3Cpath d='M5 11a7 7 0 0 0 14 0M12 18v3'/%3E%3C/svg%3E\") center/contain no-repeat;}.n-btn[data-sc=\"dict\"] .ic::before{content:\"\";display:block;width:24px;height:24px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'/%3E%3C/svg%3E\") center/contain no-repeat;}.n-btn[data-sc=\"profile\"] .ic::before{content:\"\";display:block;width:24px;height:24px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 20V11M12 20V4M19 20v-6'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 20V11M12 20V4M19 20v-6'/%3E%3C/svg%3E\") center/contain no-repeat;}#open-search-btn,#open-admin-hdr,#theme-btn{font-size:0!important;color:var(--text)}.icon-btn.gold-ring{color:var(--gold-text)}#open-search-btn::before{content:\"\";display:block;width:18px;height:18px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M21 21l-4.3-4.3'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M21 21l-4.3-4.3'/%3E%3C/svg%3E\") center/contain no-repeat;}#open-admin-hdr::before{content:\"\";display:block;width:18px;height:18px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z'/%3E%3C/svg%3E\") center/contain no-repeat;}#theme-btn::before{content:\"\";display:block;width:18px;height:18px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cpath d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cpath d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'/%3E%3C/svg%3E\") center/contain no-repeat;}body.light #theme-btn::before{content:\"\";display:block;width:18px;height:18px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z'/%3E%3C/svg%3E\") center/contain no-repeat;}.qa-ico{font-size:0!important;color:var(--gold-text)}#btn-speed-60 .qa-ico::before{content:\"\";display:block;width:20px;height:20px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2L4 14h7l-1 8 9-12h-7z'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2L4 14h7l-1 8 9-12h-7z'/%3E%3C/svg%3E\") center/contain no-repeat;}#btn-retake-placement .qa-ico::before{content:\"\";display:block;width:20px;height:20px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3C/svg%3E\") center/contain no-repeat;}.lesson-node.locked::before{content:\"\"!important;font-size:0!important;width:11px;height:11px;background:currentColor;-webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 8 0v4'/%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 8 0v4'/%3E%3C/svg%3E\") center/contain no-repeat;color:var(--muted);filter:none!important;opacity:.7!important}.sp-i.volume{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M11 5L6 9H2v6h4l5 4z'/%3E%3Cpath d='M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M11 5L6 9H2v6h4l5 4z'/%3E%3Cpath d='M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13'/%3E%3C/svg%3E\")}.sp-i.cap{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 9l10-5 10 5-10 5z'/%3E%3Cpath d='M6 11v5c3 2.5 9 2.5 12 0v-5'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 9l10-5 10 5-10 5z'/%3E%3Cpath d='M6 11v5c3 2.5 9 2.5 12 0v-5'/%3E%3C/svg%3E\")}.sp-i.trophy{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 4h8v6a4 4 0 0 1-8 0z'/%3E%3Cpath d='M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 14v4M8 21h8M10 18h4'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 4h8v6a4 4 0 0 1-8 0z'/%3E%3Cpath d='M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 14v4M8 21h8M10 18h4'/%3E%3C/svg%3E\")}.sp-i.sparkle{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z'/%3E%3Cpath d='M19 16v4M17 18h4'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z'/%3E%3Cpath d='M19 16v4M17 18h4'/%3E%3C/svg%3E\")}.sp-i.headphones{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 15v-3a8 8 0 0 1 16 0v3'/%3E%3Crect x='3' y='14' width='4' height='7' rx='1.5'/%3E%3Crect x='17' y='14' width='4' height='7' rx='1.5'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 15v-3a8 8 0 0 1 16 0v3'/%3E%3Crect x='3' y='14' width='4' height='7' rx='1.5'/%3E%3Crect x='17' y='14' width='4' height='7' rx='1.5'/%3E%3C/svg%3E\")}.sp-i.book{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z'/%3E%3Cpath d='M4 21V5M9 8h6'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z'/%3E%3Cpath d='M4 21V5M9 8h6'/%3E%3C/svg%3E\")}.sp-i.arrowl{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 12H5M11 6l-6 6 6 6'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 12H5M11 6l-6 6 6 6'/%3E%3C/svg%3E\")}.sp-i.briefcase{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='7' width='18' height='13' rx='2'/%3E%3Cpath d='M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='7' width='18' height='13' rx='2'/%3E%3Cpath d='M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18'/%3E%3C/svg%3E\")}.sp-i.save{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 3h11l4 4v14H5z'/%3E%3Cpath d='M8 3v6h7V3M8 21v-7h8v7'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 3h11l4 4v14H5z'/%3E%3Cpath d='M8 3v6h7V3M8 21v-7h8v7'/%3E%3C/svg%3E\")}.sp-i.unlock{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 7.5-2'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 7.5-2'/%3E%3C/svg%3E\")}.sp-i.cloud{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z'/%3E%3C/svg%3E\")}.sp-i.checkc{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M8 12.5l3 3 5-6'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M8 12.5l3 3 5-6'/%3E%3C/svg%3E\")}.sp-i.alert{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l10 18H2z'/%3E%3Cpath d='M12 10v4M12 17.5v.5'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l10 18H2z'/%3E%3Cpath d='M12 10v4M12 17.5v.5'/%3E%3C/svg%3E\")}.sp-i.phone{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='7' y='2' width='10' height='20' rx='2'/%3E%3Cpath d='M11 18h2'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='7' y='2' width='10' height='20' rx='2'/%3E%3Cpath d='M11 18h2'/%3E%3C/svg%3E\")}.sp-i.trash{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 7h16M10 3h4M6 7l1 14h10l1-14M10 11v6M14 11v6'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 7h16M10 3h4M6 7l1 14h10l1-14M10 11v6M14 11v6'/%3E%3C/svg%3E\")}.sp-i.timer{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='13' r='8'/%3E%3Cpath d='M12 9v4l2.5 2M9 2h6'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='13' r='8'/%3E%3Cpath d='M12 9v4l2.5 2M9 2h6'/%3E%3C/svg%3E\")}.sp-i.link{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1'/%3E%3C/svg%3E\")}.sp-i.bulb{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z'/%3E%3C/svg%3E\")}.sp-i.xc{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M9 9l6 6M15 9l-6 6'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M9 9l6 6M15 9l-6 6'/%3E%3C/svg%3E\")}.sp-i.refresh{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 11a8 8 0 0 0-14.5-4M4 4v4h4M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 11a8 8 0 0 0-14.5-4M4 4v4h4M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4'/%3E%3C/svg%3E\")}.sp-i.key{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='8' cy='15' r='4'/%3E%3Cpath d='M11 12l9-9M16 7l3 3M14 9l2 2'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='8' cy='15' r='4'/%3E%3Cpath d='M11 12l9-9M16 7l3 3M14 9l2 2'/%3E%3C/svg%3E\")}.sp-i.mic{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='3' width='6' height='11' rx='3'/%3E%3Cpath d='M5 11a7 7 0 0 0 14 0M12 18v3'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='3' width='6' height='11' rx='3'/%3E%3Cpath d='M5 11a7 7 0 0 0 14 0M12 18v3'/%3E%3C/svg%3E\")}.sp-i.star{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'/%3E%3C/svg%3E\")}.sp-i.target{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3C/svg%3E\")}.sp-i.crown{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z'/%3E%3C/svg%3E\")}.sp-i.chat{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.4A8 8 0 1 1 21 12z'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.4A8 8 0 1 1 21 12z'/%3E%3C/svg%3E\")}.sp-i.chart{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 20V11M12 20V4M19 20v-6'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 20V11M12 20V4M19 20v-6'/%3E%3C/svg%3E\")}.sp-i.rocket{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M12 15l-3-3a15 15 0 0 1 11-9c0 4-3 9-8 12z'/%3E%3Ccircle cx='15' cy='9' r='1'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M12 15l-3-3a15 15 0 0 1 11-9c0 4-3 9-8 12z'/%3E%3Ccircle cx='15' cy='9' r='1'/%3E%3C/svg%3E\")}.sp-i.search{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M21 21l-4.3-4.3'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M21 21l-4.3-4.3'/%3E%3C/svg%3E\")}.sp-i.moon{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z'/%3E%3C/svg%3E\")}.sp-i.sun{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cpath d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cpath d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'/%3E%3C/svg%3E\")}.sp-i.flame{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3c.5 4 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2 1-3.3 2-4.5.2 2 1 3 2 3 .3-3-1-5.5 1-9z'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3c.5 4 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2 1-3.3 2-4.5.2 2 1 3 2 3 .3-3-1-5.5 1-9z'/%3E%3C/svg%3E\")}.sp-i.bolt{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2L4 14h7l-1 8 9-12h-7z'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2L4 14h7l-1 8 9-12h-7z'/%3E%3C/svg%3E\")}.sp-i.lock{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 8 0v4'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 8 0v4'/%3E%3C/svg%3E\")}.sp-i.send{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 2L11 13M22 2l-7 20-4-9-9-4z'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 2L11 13M22 2l-7 20-4-9-9-4z'/%3E%3C/svg%3E\")}.sp-i.power{-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3v8M6.3 6.3a8 8 0 1 0 11.4 0'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3v8M6.3 6.3a8 8 0 1 0 11.4 0'/%3E%3C/svg%3E\")}.sp-i.sp-t{margin-inline-end:.25em}.sp-box>div>.sp-i{color:var(--gold-text)}.sp-b1 .sp-i{color:#090b10}";(document.head||document.documentElement).appendChild(s);}catch(e){}})();
  (function(){try{var n=document.getElementById("path-nodes");if(!n||!window.MutationObserver)return;var fix=function(){var cs=n.querySelectorAll(".lesson-node.current");for(var i=1;i<cs.length;i++){cs[i].classList.remove("current");cs[i].classList.add("open");}};new MutationObserver(fix).observe(n,{childList:true});fix();}catch(e){}})();
  (function(){try{var h=document.head||document.documentElement;if(!document.getElementById("sp-cairo")){var l=document.createElement("link");l.id="sp-cairo";l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap";h.appendChild(l);}
document.querySelectorAll("header .pill").forEach(function(pl){var t=pl.firstChild;if(t&&t.nodeType===3){var k=/🔥/.test(t.textContent)?"flame":/⚡/.test(t.textContent)?"bolt":null;if(k){var i=document.createElement("i");i.className="sp-i "+k;pl.replaceChild(i,t);}}});
var g=document.getElementById("lvl-grid");if(g&&window.MutationObserver){var fx=function(){g.querySelectorAll("strong").forEach(function(s){if(s.textContent.indexOf("🔒")>-1)s.innerHTML=s.innerHTML.replace(/\s*🔒/,' <i class="sp-i lock"></i>');});};new MutationObserver(fx).observe(g,{childList:true});fx();}}catch(e){}})();
  (function(){try{var MAP={"🔊": "volume", "📢": "volume", "🎧": "headphones", "🎯": "target", "⭐": "star", "🌟": "star", "🎤": "mic", "🎙": "mic", "🗣": "chat", "💬": "chat", "🎓": "cap", "🏆": "trophy", "🏅": "trophy", "🎉": "sparkle", "✨": "sparkle", "🚀": "rocket", "⚡": "bolt", "👑": "crown", "📖": "book", "📚": "book", "⬅": "arrowl", "🔥": "flame", "💼": "briefcase", "💾": "save", "🔒": "lock", "🔓": "unlock", "☁": "cloud", "✅": "checkc", "⚠": "alert", "📲": "phone", "📞": "phone", "🗑": "trash", "⏱": "timer", "🔗": "link", "🧠": "bulb", "💡": "bulb", "❌": "xc", "🔄": "refresh", "🔑": "key", "📤": "send", "🔍": "search", "🌙": "moon", "☀": "sun", "📊": "chart", "🖨": "print", "▶": "play", "🥇": "medal1", "🥈": "medal2", "🥉": "medal3", "💪": "refresh", "🐢": "timer"};var keys=Object.keys(MAP);var RE=new RegExp("("+keys.join("|")+")\\uFE0F?","g");
var SKIP=".av-opt,.avatar-row,#prof-avatar,.sp-am,.ic,.icon-btn,.qa-ico,.pill,.badge-ico,#badges,#badge-grid,.b-ico,.badge-tile,.sp-i,[data-noicon]";
var busy=false,sched=false;
function bad(n){var e=n.parentElement;if(!e)return true;var t=e.tagName;if(t==="SCRIPT"||t==="STYLE"||t==="TEXTAREA"||t==="OPTION"||t==="TITLE")return true;return !!(e.closest&&e.closest(SKIP));}
function run(){sched=false;busy=true;try{var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),list=[],n;while((n=w.nextNode())){RE.lastIndex=0;if(RE.test(n.nodeValue)&&!bad(n))list.push(n);}
list.forEach(function(n){var s=n.nodeValue,fr=document.createDocumentFragment(),last=0,m;RE.lastIndex=0;while((m=RE.exec(s))){if(m.index>last)fr.appendChild(document.createTextNode(s.slice(last,m.index)));var i=document.createElement("i");i.className="sp-i "+MAP[m[1]];fr.appendChild(i);last=m.index+m[0].length;}
if(last<s.length)fr.appendChild(document.createTextNode(s.slice(last)));n.parentNode.replaceChild(fr,n);});}catch(e){}busy=false;}
function later(){if(sched||busy)return;sched=true;(window.requestAnimationFrame||setTimeout)(run);}
if(window.MutationObserver)new MutationObserver(later).observe(document.body,{childList:true,subtree:true,characterData:true});run();}catch(e){}})();
  (function(){try{if(document.getElementById("sp-cert"))return;var H=document.head||document.documentElement;
function ic(n,d){var u='url("data:image/svg+xml,'+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>"+d+"</svg>")+'")';return ".sp-i."+n+"{-webkit-mask-image:"+u+";mask-image:"+u+"}";}
var ICONS=ic("print","<path d='M6 9V3h12v6'/><rect x='6' y='14' width='12' height='7'/><path d='M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2'/>")+ic("play","<path d='M7 4l13 8-13 8z' fill='black'/>")+ic("medal1","<circle cx='12' cy='15' r='6'/><path d='M8.5 3l3.5 6 3.5-6'/>")+ic("medal2","<circle cx='12' cy='15' r='6'/><path d='M8.5 3l3.5 6 3.5-6'/>")+ic("medal3","<circle cx='12' cy='15' r='6'/><path d='M8.5 3l3.5 6 3.5-6'/>")+ic("img","<rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><path d='M21 15l-5-5L5 21'/>")+ic("wa","<path d='M21 12a9 9 0 1 1-4-7.5L21 3l-1.5 4A9 9 0 0 1 21 12z'/>")+".sp-i.medal1{color:#d4af37}.sp-i.medal2{color:#94a3b8}.sp-i.medal3{color:#b8733a}";
if(!document.getElementById("sp-amiri")){var l=document.createElement("link");l.id="sp-amiri";l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap";H.appendChild(l);}
var G="#b8902a",CSS=ICONS+
/* quiz options + short lesson grids */
".opt-btn:not(.ok):not(.err):not(.selected){border:1.5px solid var(--border-strong);box-shadow:0 1px 0 var(--border)}.opt-btn:not(.ok):not(.err):active{transform:scale(.985);background:rgba(212,175,55,.14)}"+
".path-wrap:not(:has(>:nth-child(8))){grid-template-columns:repeat(2,1fr)!important}.path-wrap:not(:has(>:nth-child(8))) .lesson-node:not(.current){aspect-ratio:2.4/1!important}"+
"body.light .study-card b[style*=gold-light],body.light #lb-list strong[style*=gold-light]{color:var(--gold-dark)!important}"+
"/* pro lab + lab button on theme */#sp-pro-modal{background:var(--bg)!important;color:var(--text)!important;font-family:Cairo,system-ui,sans-serif!important}#sp-pro-modal .sp-pro-header{border-bottom-color:var(--border)!important}#sp-pro-modal .sp-pro-streak-bar{background:var(--card)!important;border:1px solid var(--border-strong)!important;border-radius:16px!important}#sp-pro-modal .sp-pro-close{background:transparent!important;color:var(--danger)!important;border:1px solid var(--danger)!important;border-radius:12px!important}#sp-pro-modal .sp-pro-tab{background:var(--card)!important;color:var(--muted)!important;border:1px solid var(--border)!important;border-radius:14px!important}#sp-pro-modal .sp-pro-tab.active{background:var(--gold-grad)!important;color:#2b2110!important;border-color:transparent!important}#sp-pro-modal .sp-pro-card{background:var(--card)!important;border:1px solid var(--border)!important;border-radius:18px!important}#sp-pro-modal .sp-pro-en{color:var(--gold-light)!important}body.light #sp-pro-modal .sp-pro-en{color:var(--gold-dark)!important}#sp-pro-modal .sp-pro-ar{color:var(--text)!important}#sp-pro-modal .sp-pro-btn{background:var(--gold-grad)!important;color:#2b2110!important;border-radius:12px!important}#sp-pro-modal .sp-pro-btn.sec{background:var(--bg-soft)!important;color:var(--text)!important;border:1px solid var(--border)!important}#sp-pro-modal .sp-pro-btn.warn{background:rgba(217,146,43,.16)!important;color:#b45309!important;border:1px solid #d9922b!important}body:not(.light) #sp-pro-modal .sp-pro-btn.warn{color:#f6c168!important}#sp-pro-modal .sp-pro-btn.ok{background:var(--success-bg)!important;color:var(--success)!important;border:1px solid var(--success)!important}#sp-pro-modal .sp-pro-choice{background:var(--card)!important;color:var(--text)!important;border:1px solid var(--border-strong)!important;border-radius:14px!important}#sp-pro-modal .sp-badge{background:var(--bg-soft)!important;color:var(--gold-dark)!important;border:1px solid var(--border)}body:not(.light) #sp-pro-modal .sp-badge{color:var(--gold-light)!important}#sp-pro-modal .sp-sponsor-box{background:var(--bg-soft)!important;border-color:var(--border)!important;color:var(--muted)!important}#sp-pro-fab{background:var(--card)!important;color:var(--gold-light)!important;border:1.5px solid var(--gold)!important;box-shadow:none!important}body.light #sp-pro-fab{color:var(--gold-dark)!important}"+
/* certificate */
".cert-modal{align-items:flex-start!important;padding:14px!important}.sp-cw{margin:auto;width:min(100%,370px)}"+
".cert-paper{position:relative!important;width:100%!important;max-width:none!important;aspect-ratio:9/16;padding:0!important;border:0!important;border-radius:6px!important;font-size:14px;background:radial-gradient(circle at 50% 40%,#fffdf6,#f7ecd0)!important;color:#2b2110!important;box-shadow:0 12px 40px rgba(0,0,0,.55)!important;overflow:hidden;text-align:center;font-family:Cairo,system-ui,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}"+
".cert-paper .b1{position:absolute;inset:.7em;border:2.5px solid "+G+"}.cert-paper .b2{position:absolute;inset:1em;border:1px solid "+G+";opacity:.8}.cert-paper .b3{position:absolute;inset:1.15em;border:1px dashed "+G+";opacity:.4}"+
".cert-paper .co{position:absolute;width:3.8em;height:3.8em}.cert-paper .c1{top:.6em;left:.6em}.cert-paper .c2{top:.6em;right:.6em;transform:scaleX(-1)}.cert-paper .c3{bottom:.6em;left:.6em;transform:scaleY(-1)}.cert-paper .c4{bottom:.6em;right:.6em;transform:scale(-1,-1)}"+
".cert-paper .cin{position:absolute;inset:2.6em 1.8em;display:flex;flex-direction:column;align-items:center;justify-content:space-between}"+
".cert-paper .brand{font-weight:900;letter-spacing:.12em;color:"+G+";font-size:.95em}.cert-paper .t2{font-size:.8em;color:#6b5a33;letter-spacing:.08em}"+
".cert-paper .t1{font-family:Amiri,Cairo,serif;font-weight:700;font-size:2.2em;color:#8c6914;line-height:1.2}"+
".cert-paper .pre{font-size:.95em;color:#6b5a33}.cert-paper .name{font-family:Amiri,Cairo,serif;font-weight:700;font-size:2.1em;color:#2b2110;padding:0 1em .1em;border-bottom:1.5px solid "+G+";line-height:1.35;max-width:100%}"+
".cert-paper .bd{font-size:.95em;line-height:1.9;max-width:20em;color:#2b2110}.cert-paper .bd b{color:#8c6914}"+
".cert-paper .ft{width:100%;display:flex;justify-content:space-between;align-items:flex-end;gap:.4em}.cert-paper .sg{width:7em;font-size:.7em;color:#6b5a33}.cert-paper .sg i{display:block;white-space:nowrap;font-style:normal;font-family:Amiri,Cairo,serif;font-size:1.3em;color:#2b2110;border-bottom:1px solid "+G+";padding-bottom:.15em;margin-bottom:.25em;line-height:1.3}"+
".cert-paper .sl svg{width:5em;height:5em;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))}.cert-paper .num{font-size:.62em;color:#6b5a33;letter-spacing:.1em;direction:ltr;margin-top:.3em}"+
".sp-cb{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.sp-cb button{display:flex;align-items:center;justify-content:center;gap:6px;background:rgba(255,255,255,.08);color:#f4d77b;border:1px solid rgba(244,215,123,.5);border-radius:14px;padding:12px 4px;font-weight:800;font-size:.8rem;cursor:pointer;font-family:inherit}.sp-cb button:first-child{background:linear-gradient(135deg,#f4d77b,#d4af37 52%,#a8821d);color:#2b2110;border:0}.sp-cb .cl{grid-column:1/-1;padding:13px}"+
"@media print{@page{size:A4 landscape;margin:0}html,body{background:#fff!important;height:auto!important;min-height:0!important;padding:0!important;margin:0!important}body>*:not(#cert-modal){display:none!important}.cert-modal{position:static!important;display:block!important;background:none!important;padding:0!important;overflow:visible!important}.sp-cw{width:auto!important;margin:0!important}.sp-cb{display:none!important}.cert-paper{position:fixed!important;left:0!important;top:0!important;width:297mm!important;height:209mm!important;aspect-ratio:auto!important;margin:0!important;border-radius:0!important;box-shadow:none!important;font-size:26px!important;visibility:visible!important}.cert-paper *{visibility:visible!important}.cert-paper .cin{inset:2em 3.6em!important}.cert-paper .bd{max-width:34em!important}.cert-paper .sg{width:9em!important}.cert-paper .sl svg{width:4.4em!important;height:4.4em!important}.cert-paper .co{width:3.2em!important;height:3.2em!important}}";
var st=document.createElement("style");st.id="sp-cert";st.textContent=CSS;H.appendChild(st);
var modal=document.getElementById("cert-modal"),paper=modal&&modal.querySelector(".cert-paper");if(!paper)return;
var co='<svg class="co CN" viewBox="0 0 60 60"><g fill="none" stroke="'+G+'" stroke-width="1.6"><path d="M2 58V14C2 7 7 2 14 2h44"/><path d="M10 58V20c0-6 4-10 10-10h38" opacity=".6"/><circle cx="14" cy="14" r="4"/><path d="M22 22c6 0 10-4 10-10M22 22c0 6-4 10-10 10"/></g></svg>';
function rays(){var s="",i,a;for(i=0;i<24;i++){a=i*15*Math.PI/180;s+='<path d="M60 60L'+(60+54*Math.cos(a-.12)).toFixed(1)+" "+(60+54*Math.sin(a-.12)).toFixed(1)+"L"+(60+54*Math.cos(a+.12)).toFixed(1)+" "+(60+54*Math.sin(a+.12)).toFixed(1)+'Z" fill="#c9a22c"/>';}return s;}
function seal(lv){return '<svg viewBox="0 0 120 120"><defs><radialGradient id="spsg" cx="40%" cy="35%"><stop offset="0" stop-color="#fbe9a6"/><stop offset=".6" stop-color="#d4af37"/><stop offset="1" stop-color="#8c6914"/></radialGradient></defs>'+rays()+'<circle cx="60" cy="60" r="38" fill="url(#spsg)" stroke="#8c6914" stroke-width="2"/><circle cx="60" cy="60" r="31" fill="none" stroke="#fff6cf" stroke-width="1.2" stroke-dasharray="2 3"/><text x="60" y="56" text-anchor="middle" font-family="Cairo,sans-serif" font-weight="900" font-size="15" fill="#5b4310">Speakora</text><text x="60" y="73" text-anchor="middle" font-family="Cairo,sans-serif" font-weight="700" font-size="9" fill="#5b4310">LEVEL '+lv+'</text></svg>';}
var wrap=document.createElement("div");wrap.className="sp-cw";paper.parentNode.insertBefore(wrap,paper);wrap.appendChild(paper);
paper.innerHTML='<div class="b1"></div><div class="b2"></div><div class="b3"></div>'+co.replace("CN","c1")+co.replace("CN","c2")+co.replace("CN","c3")+co.replace("CN","c4")+
'<div class="cin"><div><div class="brand">SPEAKORA</div><div class="t2">ENGLISH ACADEMY</div></div><div><div class="t1">شهادة إتمام مستوى</div><div class="t2" style="margin-top:.3em">CERTIFICATE OF COMPLETION</div></div><div class="pre">تشهد منصة Speakora بأن المتعلم</div><div class="name" id="c-name">المتعلم</div><div class="bd" id="c-body"></div><div class="ft"><div class="sg"><i>عبدالرحمن نتعي</i>إشراف</div><div class="sl"><span id="sp-seal"></span><div class="num" id="sp-num"></div></div><div class="sg"><i id="c-date" style="font-family:Cairo,sans-serif;font-size:1em;padding-bottom:.4em"></i>تاريخ الإصدار</div></div></div>';
var bar=document.createElement("div");bar.className="sp-cb no-print";bar.innerHTML='<button id="sp-c-print"><i class="sp-i print"></i>طباعة / PDF</button><button id="sp-c-save"><i class="sp-i img"></i>حفظ صورة</button><button id="sp-c-wa"><i class="sp-i phone"></i>واتساب</button><button class="cl" id="sp-c-close">إغلاق</button>';wrap.appendChild(bar);
try{var gi=document.getElementById("global-search-inp");if(gi)gi.placeholder="ابحث في كل الكلمات والجمل (عربي أو إنجليزي)...";}catch(e){}
var info=null,blobP=null;
function $(i){return document.getElementById(i);}
function hash4(s){var h=0,i;for(i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return ("0000"+(h%10000)).slice(-4);}
function fill(){var b=$("c-body"),t=b.textContent||"",m=t.match(/\(([A-Za-z0-9]+)\s*[—-]\s*([^)]+)\)/),sc=t.match(/(\d+)\s*%/),dt=($("c-date").textContent||"").replace(/^[^:]*:\s*/,"").trim(),nm=($("c-name").textContent||"").trim();
if(!m)return;info={lvl:m[1],lname:m[2].trim(),score:sc?sc[1]:"",date:dt,name:nm};
b.innerHTML='قد أتم بنجاح جميع متطلبات المستوى <b>'+info.lvl+' — '+info.lname+'</b> واجتاز الاختبار الشامل'+(info.score?' بنسبة <b>'+info.score+'%</b>':"");
$("c-date").textContent=dt;var n=$("c-name");n.style.fontSize=nm.length>26?"1.4em":nm.length>18?"1.7em":"";
$("sp-seal").innerHTML=seal(info.lvl);var y=(dt.match(/(\d{4})/)||[])[1]||String(new Date().getFullYear());$("sp-num").textContent="No. SPK-"+info.lvl+"-"+y+"-"+hash4(nm+info.lvl+dt);info.num=$("sp-num").textContent;
blobP=null;info.blob=null;(blobP=png()).then(function(bl){info.blob=bl;}).catch(function(){});}
function wrapT(c,t,mw){var w=t.split(" "),ls=[],cur="",i;for(i=0;i<w.length;i++){var x=cur?cur+" "+w[i]:w[i];if(c.measureText(x).width>mw&&cur){ls.push(cur);cur=w[i];}else cur=x;}if(cur)ls.push(cur);return ls;}
async function png(){var i=info;if(!i)throw 0;try{await Promise.all([document.fonts.load("700 40px Amiri"),document.fonts.load("900 20px Cairo"),document.fonts.load("700 20px Cairo")]);}catch(e){}
var S=1.5,cv=document.createElement("canvas");cv.width=Math.round(1123*S);cv.height=Math.round(794*S);var c=cv.getContext("2d");c.scale(S,S);
var g=c.createRadialGradient(561,320,0,561,320,720);g.addColorStop(0,"#fffdf6");g.addColorStop(1,"#f7ecd0");c.fillStyle=g;c.fillRect(0,0,1123,794);
c.strokeStyle=G;c.lineWidth=3;c.strokeRect(20,20,1083,754);c.globalAlpha=.8;c.lineWidth=1.3;c.strokeRect(28,28,1067,738);c.globalAlpha=.4;c.setLineDash([5,5]);c.strokeRect(34,34,1055,726);c.setLineDash([]);c.globalAlpha=1;
var cp=[new Path2D("M2 58V14C2 7 7 2 14 2h44"),new Path2D("M10 58V20c0-6 4-10 10-10h38"),new Path2D("M22 22c6 0 10-4 10-10M22 22c0 6-4 10-10 10")];
function corner(x,y,sx,sy){c.save();c.translate(x,y);c.scale(sx*1.3,sy*1.3);c.strokeStyle=G;c.lineWidth=1.6;c.stroke(cp[0]);c.globalAlpha=.6;c.stroke(cp[1]);c.globalAlpha=1;c.stroke(cp[2]);c.beginPath();c.arc(14,14,4,0,7);c.stroke();c.restore();}
corner(16,16,1,1);corner(1107,16,-1,1);corner(16,778,1,-1);corner(1107,778,-1,-1);
c.direction="rtl";c.textAlign="center";c.textBaseline="alphabetic";
function T(t,x,y,f,col,ls){c.font=f;c.fillStyle=col;try{c.letterSpacing=ls||"0px";}catch(e){}c.fillText(t,x,y);try{c.letterSpacing="0px";}catch(e){}}
T("SPEAKORA",561,95,"900 24px Cairo,sans-serif",G,"3px");T("ENGLISH ACADEMY",561,122,"700 15px Cairo,sans-serif","#6b5a33","2px");
T("شهادة إتمام مستوى",561,206,"700 62px Amiri,Cairo,serif","#8c6914");T("CERTIFICATE OF COMPLETION",561,243,"700 15px Cairo,sans-serif","#6b5a33","2px");
T("تشهد منصة Speakora بأن المتعلم",561,312,"400 24px Cairo,sans-serif","#6b5a33");
var nf=i.name.length>26?"700 38px Amiri,Cairo,serif":"700 56px Amiri,Cairo,serif";T(i.name,561,386,nf,"#2b2110");c.font=nf;var nw=Math.min(c.measureText(i.name).width+60,900);c.strokeStyle=G;c.lineWidth=1.5;c.beginPath();c.moveTo(561-nw/2,404);c.lineTo(561+nw/2,404);c.stroke();
var txt="قد أتم بنجاح جميع متطلبات المستوى "+i.lvl+" — "+i.lname+" واجتاز الاختبار الشامل"+(i.score?" بنسبة "+i.score+"%":"");c.font="400 26px Cairo,sans-serif";var ls=wrapT(c,txt,820),k;for(k=0;k<ls.length;k++)T(ls[k],561,462+k*46,"400 26px Cairo,sans-serif","#2b2110");
c.save();c.translate(561,646);var r;for(r=0;r<24;r++){var a=r*15*Math.PI/180;c.fillStyle="#c9a22c";c.beginPath();c.moveTo(0,0);c.lineTo(54*Math.cos(a-.12),54*Math.sin(a-.12));c.lineTo(54*Math.cos(a+.12),54*Math.sin(a+.12));c.closePath();c.fill();}
var sg=c.createRadialGradient(-12,-14,0,0,0,38);sg.addColorStop(0,"#fbe9a6");sg.addColorStop(.6,"#d4af37");sg.addColorStop(1,"#8c6914");c.fillStyle=sg;c.strokeStyle="#8c6914";c.lineWidth=2;c.beginPath();c.arc(0,0,38,0,7);c.fill();c.stroke();c.setLineDash([2,3]);c.strokeStyle="#fff6cf";c.lineWidth=1.2;c.beginPath();c.arc(0,0,31,0,7);c.stroke();c.setLineDash([]);c.direction="ltr";c.fillStyle="#5b4310";c.font="900 15px Cairo,sans-serif";c.fillText("Speakora",0,-4);c.font="700 9px Cairo,sans-serif";c.fillText("LEVEL "+i.lvl,0,13);c.restore();c.direction="rtl";
T("إشراف",905,712,"400 17px Cairo,sans-serif","#6b5a33");T("عبدالرحمن نتعي",905,672,"700 30px Amiri,Cairo,serif","#2b2110");T("تاريخ الإصدار",218,712,"400 17px Cairo,sans-serif","#6b5a33");T(i.date,218,672,"400 24px Cairo,sans-serif","#2b2110");
c.strokeStyle=G;c.lineWidth=1;[[800,1010],[113,323]].forEach(function(p){c.beginPath();c.moveTo(p[0],690);c.lineTo(p[1],690);c.stroke();});
c.direction="ltr";T(i.num,561,742,"700 14px Cairo,sans-serif","#6b5a33","2px");
return await new Promise(function(res,rej){cv.toBlob(function(b){b?res(b):rej(0);},"image/png");});}
function fname(){return "Speakora-certificate-"+(info?info.lvl:"")+".png";}
function msg(){var i=info||{};return "🏅 حصلت على شهادة إتمام المستوى "+(i.lvl||"")+" ("+(i.lname||"")+") من منصة Speakora"+(i.score?" بنسبة "+i.score+"%":"")+"! 🎉\nhttps://abdonateai92-star.github.io/speakora-/";}
function toast(t){var e=$("toast");if(!e)return;e.textContent=t;e.style.display="block";setTimeout(function(){e.style.display="none";},2400);}
function save(bl){var u=URL.createObjectURL(bl),a=document.createElement("a");a.href=u;a.download=fname();document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(u);a.remove();},4000);}
$("sp-c-print").onclick=function(){window.print();};
$("sp-c-close").onclick=function(){modal.classList.remove("open");};
$("sp-c-save").onclick=async function(){try{save(info&&info.blob?info.blob:await png());}catch(e){toast("تعذر حفظ الصورة");}};
$("sp-c-wa").onclick=async function(){var wa=function(){window.open("https://wa.me/?text="+encodeURIComponent(msg()),"_blank");};try{var bl=info&&info.blob?info.blob:await png(),f=new File([bl],fname(),{type:"image/png"});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],text:msg()});return;}}catch(e){if(e&&e.name==="AbortError")return;}wa();};
if(window.MutationObserver)new MutationObserver(function(){if(modal.classList.contains("open"))fill();}).observe(modal,{attributes:true,attributeFilter:["class"]});
}catch(e){console.warn("sp cert",e);}})();
  (function(){try{if(document.getElementById("sp-sara"))return;var pr=document.getElementById("sc-practice");if(!pr)return;var tabs=pr.querySelector(".sub-tabs");if(!tabs)return;
var H=document.head||document.documentElement,KEY="spk_sara_v1";
var st=document.createElement("style");st.id="sp-sara";st.textContent=
"#pane-sara .sa-top{display:flex;align-items:center;gap:10px;margin-bottom:10px}#pane-sara .sa-av{width:40px;height:40px;border-radius:50%;border:1.5px solid var(--gold);display:grid;place-items:center;font-weight:900;color:var(--gold-text,var(--gold-light));flex-shrink:0;background:var(--card)}"+
"#pane-sara .sa-top b{display:block;font-size:.92rem}#pane-sara .sa-top small{color:var(--muted);font-size:.72rem}"+
"#pane-sara .sa-bar{height:7px;border-radius:99px;background:var(--bg-soft);overflow:hidden;margin:6px 0 4px;border:1px solid var(--border)}#pane-sara .sa-bar i{display:block;height:100%;background:var(--gold-grad);border-radius:99px}"+
"#pane-sara .sa-meta{display:flex;justify-content:space-between;font-size:.72rem;color:var(--muted);margin-bottom:10px}"+
"#pane-sara .reply-btn{width:100%}#pane-sara .reply-btn.bad{border-color:var(--danger);background:var(--danger-bg)}#pane-sara .reply-btn.weak{border-color:#d9922b;background:rgba(217,146,43,.13)}#pane-sara .reply-btn.good{border-color:var(--success);background:var(--success-bg)}#pane-sara .reply-btn[disabled]{opacity:.9}"+
"#pane-sara .sa-fb{direction:rtl;text-align:right;font-size:.82rem;line-height:1.7;border-radius:12px;padding:9px 12px;margin:-2px 0 2px;border:1px solid var(--danger);background:var(--danger-bg);color:var(--text)}#pane-sara .sa-fb.weak{border-color:#d9922b;background:rgba(217,146,43,.13)}#pane-sara .sa-fb b{direction:ltr;display:inline-block;color:var(--gold-text,var(--gold-light))}body.light #pane-sara .sa-fb b{color:var(--gold-dark)}"+
"#sc-practice .sub-tab{font-size:.74rem!important;padding-inline:8px!important;white-space:nowrap}#pane-sara .sa-ch{scrollbar-width:none}#pane-sara .sa-ch::-webkit-scrollbar{display:none}"+
"#pane-sara .sa-ch{display:flex;gap:6px;overflow-x:auto;margin-bottom:10px;padding-bottom:2px}#pane-sara .sa-ch span{white-space:nowrap;font-size:.72rem;font-weight:800;border:1px solid var(--border);border-radius:99px;padding:5px 11px;color:var(--muted);background:var(--card)}#pane-sara .sa-ch span.on{color:#2b2110;background:var(--gold-grad);border-color:transparent}#pane-sara .sa-ch span.dn{color:var(--success);border-color:var(--success)}"+
"#pane-sara .sa-end{text-align:center}#pane-sara .sa-end h3{margin:8px 0}";H.appendChild(st);
var tab=document.createElement("button");tab.className="sub-tab";tab.setAttribute("data-ptab","sara");tab.textContent="💬 سارة";tab.style.display="none";tabs.appendChild(tab);
var pane=document.createElement("div");pane.id="pane-sara";pane.style.display="none";pr.appendChild(pane);
var others=["roleplay","coach","templates"];
tab.addEventListener("click",function(){tabs.querySelectorAll(".sub-tab").forEach(function(b){b.classList.remove("active");});tab.classList.add("active");others.forEach(function(k){var p=document.getElementById("pane-"+k);if(p)p.style.display="none";});pane.style.display="block";render();});
tabs.querySelectorAll(".sub-tab").forEach(function(b){if(b!==tab)b.addEventListener("click",function(){pane.style.display="none";},true);});
var CH=null,save={},S=null;
function load(){try{save=JSON.parse(localStorage.getItem(KEY)||"{}")||{};}catch(e){save={};}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(save));}catch(e){}}
function flat(c){var a=[];c.chapters.forEach(function(ch,ci){ch.steps.forEach(function(s){a.push({s:s,ci:ci});});});return a;}
function sp(t){try{if(typeof speak==="function")speak(t);}catch(e){}}
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;}
function esc(s){return String(s).replace(/[&<>]/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[m];});}
function open(i){CH=window.SPK_CHATS[i];var p=save[CH.id]||{step:0,mist:0,done:false,xp:false};S=p;save[CH.id]=p;}
function stars(m,n){return m===0?3:m<=n*0.2?2:1;}
function render(){if(!window.SPK_CHATS||!window.SPK_CHATS.length){pane.innerHTML="";return;}if(!CH)open(0);var all=flat(CH),n=all.length,i=Math.min(S.step,n),cur=all[i],ci=cur?cur.ci:CH.chapters.length-1;
pane.innerHTML="";var top=el("div","card");
top.appendChild(el("div","sa-top",'<div class="sa-av">S</div><div style="flex:1"><b>سارة · موظفة الاستقبال</b><small>'+esc(CH.title)+' · '+esc(CH.level)+'</small></div>'));
var chips=el("div","sa-ch");CH.chapters.forEach(function(c,k){var sp2=el("span",k<ci||S.done?"dn":k===ci?"on":"",esc(c.title));chips.appendChild(sp2);});top.appendChild(chips);
var inCh=0,chN=CH.chapters[ci].steps.length,passed=0;for(var k=0;k<i;k++)if(all[k].ci===ci)passed++;inCh=passed;
top.appendChild(el("div","sa-bar",'<i style="width:'+Math.round((S.done?n:i)/n*100)+'%"></i>'));
top.appendChild(el("div","sa-meta","<span>الرد "+(S.done?n:Math.min(i+1,n))+" من "+n+"</span><span>"+esc(CH.chapters[ci].title)+": "+(S.done?chN:Math.min(inCh+1,chN))+"/"+chN+"</span>"));
var chat=el("div","chat-box");
function bub(from,en,ar){var b=el("div","bubble "+from,'<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span>'+esc(en)+'</span><button class="mini-btn" style="width:27px;height:27px;font-size:.74rem">🔊</button></div><div class="bubble-ar">'+esc(ar)+"</div>");b.onclick=function(){b.classList.toggle("show-ar");};b.querySelector("button").onclick=function(e){e.stopPropagation();sp(en);};chat.appendChild(b);}
var from=Math.max(0,i-3);if(from>0){chat.appendChild(el("div","",'<p style="text-align:center;color:var(--muted);font-size:.72rem">... المحادثة السابقة محفوظة</p>'));}
for(var k2=from;k2<i&&k2<n;k2++){var q=all[k2].s,ok=q.opts.filter(function(o){return o.ok;})[0];bub("bot",q.bot,q.botAr);bub("user",ok.en,ok.ar);}
if(cur)bub("bot",cur.s.bot,cur.s.botAr);else bub("bot",CH.end.bot,CH.end.botAr);
top.appendChild(chat);var box=el("div","reply-opts");
if(cur){var tried={};cur.s.opts.forEach(function(o,oi){var b=el("button","reply-btn",esc(o.en)+"<small>"+esc(o.ar)+"</small>");b.onclick=function(){
if(o.ok){sp(o.en);b.classList.add("good");S.step=i+1;if(S.step>=n){S.done=true;var stz=stars(S.mist,n);save[CH.id].stars=Math.max(save[CH.id].best||0,stz);save[CH.id].best=save[CH.id].stars;if(!S.xp){S.xp=true;try{addXp(stz===3?60:40);}catch(e){}}}persist();setTimeout(render,350);return;}
if(!tried[oi]){tried[oi]=1;S.mist++;persist();}b.disabled=true;b.classList.add(o.kind==="weak"?"weak":"bad");var fb=el("div","sa-fb"+(o.kind==="weak"?" weak":""),(o.kind==="weak"?"مفهومة بس ناقصة. ":"فيها غلطة. ")+'الأحسن تقول: <b>'+esc(o.fix)+"</b><br>"+esc(o.hint));b.parentNode.insertBefore(fb,b.nextSibling);sp(o.fix);};box.appendChild(b);});}
else{var stz2=S.best||stars(S.mist,n);box.appendChild(el("div","fb-box ok sa-end",'<div style="font-size:2rem">🎉</div><h3>خلّصت المحادثة!</h3><div style="font-size:1.4rem">'+"⭐".repeat(stz2)+'</div><p style="margin-top:6px;font-size:.8rem">غلطاتك: '+S.mist+' من '+n+' رد</p>'));var rb=el("button","btn-outline","إعادة المحادثة من الأول");rb.style.marginTop="10px";rb.onclick=function(){save[CH.id]={step:0,mist:0,done:false,xp:true,best:S.best};persist();CH=null;render();};box.appendChild(rb);}
top.appendChild(box);pane.appendChild(top);}
load();var sc=document.createElement("script");sc.src="chat-scripts.js";sc.onload=function(){if(window.SPK_CHATS&&window.SPK_CHATS.length){tab.style.display="";if(pane.style.display==="block")render();}};sc.onerror=function(){};document.head.appendChild(sc);
}catch(e){console.warn("sp sara",e);}})();
  (function(){try{var f=document.getElementById("sp-pro-fab"),h=document.querySelector("#sc-path .hero");if(f&&h&&!f.classList.contains("sp-in")){h.parentNode.insertBefore(f,h);f.classList.add("sp-in");}}catch(e){}})();
  var ADMIN = "abdonateai92@gmail.com";
  var TRIAL_MS = 12 * 60 * 60 * 1000;
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

  // Admin buttons live in the profile screen (in the page flow, never floating over content). Buttons from paywall.js and vault.js are added here.
  window.__spAdminMenu = window.__spAdminMenu || (function () {
    var box = null;
    function build() {
      if (box && box.isConnected) return true;
      var host = document.getElementById("sc-profile");
      if (!host) return false;
      box = document.createElement("div");
      box.id = "sp-admin-box";
      box.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px;";
      var anchor = document.getElementById("open-admin-prof");
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(box, anchor.nextSibling); else host.appendChild(box);
      return true;
    }
    return {
      add: function (id, label, fn) {
        if (!build()) return;
        if (box.querySelector('[data-id="' + id + '"]')) return;
        var b = document.createElement("button");
        b.setAttribute("data-id", id); b.textContent = label;
        b.className = "sp-am";
        b.onclick = function () { fn(); };
        box.appendChild(b);
      },
      clear: function () { if (box) { box.remove(); box = null; } }
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
      var h = Math.floor(leftMs / 3600000), m = Math.floor(leftMs / 60000) % 60, s = Math.floor(leftMs / 1000) % 60;
      pillEl.textContent = label + " " + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
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
      window.__spAllowed = null; window.__spTrialLessons = null;
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
      window.__spAllowed = allowed.slice();
      cur = d;
      // schedule re-check at next expiry
      var next = Infinity, until = (base.sub && base.sub.until) || {};
      allowed.forEach(function (l) { var u = Number(until[l]) || 0; if (u > base.now && u < next) next = u; });
      if (d.trial) { window.__spTrialLessons = 10; window.__spTrialLock = function () { showOverlay(function (b) { b.appendChild(el("div", "font-size:2.2rem", "🔒")); b.appendChild(el("h2", "margin:6px 0", "التجربة المجانية: أول ١٠ دروس")); b.appendChild(el("p", "font-size:0.9rem", "باقي دروس A1 للمشتركين. اشترك في المستوى A1 لفتحها كلها.")); payBox(b, user, cfg, "A1"); b.appendChild(btn("↩️ رجوع للدروس", "#7c3aed", function () { if (overlayEl) { overlayEl.remove(); overlayEl = null; } })); }, true); }; showPill(d.leftMs, "⏳ التجربة المجانية (A1، ١٢ ساعة أو ١٠ دروس):"); }
      else if (next < Infinity && next - base.now < 2147000000) timer = setTimeout(function () { evaluate(fbA.currentUser); }, next - base.now + 1000);
      if (!allowed.length) { showNone(user, cfg, !d.trial); return; }
      startWatch(user, cfg, allowed);
    } finally { busy = false; try { window.dispatchEvent(new Event("sp-paywall-done")); } catch (e) {} }
  }

  fbA.onAuthStateChanged(function (user) { busy = false; evaluate(user); });
  window.__spPaywallEvaluate = function () { return evaluate(fbA.currentUser); };
})();
