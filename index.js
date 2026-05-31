/* ═══════════════════════════════════════════════════════════
   KIK.JS — KIK Portfolio · Devira Meireditha Luis Cahyani
   Tampilan identik dengan index.js + fungsi KIK sections
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ── Lucide icons ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});

/* ══════════════════════════════════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════════════════════════════════ */
(function initCursor() {
  const dot    = document.getElementById('cursor-dot');
  const ringSm = document.getElementById('cursor-ring-sm');
  const ringMd = document.getElementById('cursor-ring-md');
  const ringLg = document.getElementById('cursor-ring-lg');
  let mx = -100, my = -100;
  let smX = -100, smY = -100, mdX = -100, mdY = -100, lgX = -100, lgY = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateCursor() {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    smX += (mx - smX) * 0.35; smY += (my - smY) * 0.35;
    ringSm.style.left = smX + 'px'; ringSm.style.top = smY + 'px';
    mdX += (mx - mdX) * 0.18; mdY += (my - mdY) * 0.18;
    ringMd.style.left = mdX + 'px'; ringMd.style.top = mdY + 'px';
    lgX += (mx - lgX) * 0.08; lgY += (my - lgY) * 0.08;
    ringLg.style.left = lgX + 'px'; ringLg.style.top = lgY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mousedown', () => {
    ringSm.style.width = '12px'; ringSm.style.height = '12px';
    ringMd.style.width = '28px'; ringMd.style.height = '28px';
  });
  document.addEventListener('mouseup', () => {
    ringSm.style.width = '22px'; ringSm.style.height = '22px';
    ringMd.style.width = '42px'; ringMd.style.height = '42px';
  });
})();

/* ══════════════════════════════════════════════════════════════
   2. INTRO LOADING
══════════════════════════════════════════════════════════════ */
(function initIntro() {
  const fill = document.getElementById('loader-fill');
  const pct  = document.getElementById('loader-pct');
  let done   = false;
  fill.style.width = '0%'; pct.textContent = '0%';
  const duration = 4500, startTime = Date.now();

  function tick() {
    if (done) return;
    const elapsed  = Date.now() - startTime;
    const raw      = Math.min(elapsed / duration, 1);
    const eased    = raw < 0.7 ? raw * 1.2 : 0.84 + (raw - 0.7) * (0.16 / 0.3);
    const progress = Math.min(eased * 100, 100);
    fill.style.width = progress + '%';
    pct.textContent  = Math.floor(progress) + '%';
    if (progress >= 100) {
      fill.style.width = '100%'; pct.textContent = '100%'; done = true;
      setTimeout(startCharIntro, 500); return;
    }
    requestAnimationFrame(tick);
  }
  setTimeout(() => requestAnimationFrame(tick), 300);
})();

/* ══════════════════════════════════════════════════════════════
   3. CHARACTER INTRO ANIMATION
══════════════════════════════════════════════════════════════ */
function startCharIntro() {
  const wrap   = document.getElementById('char-intro-wrap');
  const char   = document.getElementById('char-intro');
  const canvas = document.getElementById('rope-canvas-intro');
  wrap.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width = 6; canvas.height = window.innerHeight + 400;
  let charY = -300, ropeLen = 0;
  const midY = window.innerHeight * 0.38;
  let phase = 'down';

  function drawRope(len) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (len <= 0) return;
    const grad = ctx.createLinearGradient(0, 0, 0, len);
    grad.addColorStop(0, 'rgba(212,175,122,1)');
    grad.addColorStop(0.6, 'rgba(212,175,122,0.6)');
    grad.addColorStop(1, 'rgba(212,175,122,0.1)');
    ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(3, 0);
    const t = Date.now() / 800;
    for (let y = 0; y <= len; y += 3) {
      ctx.lineTo(3 + Math.sin(y * 0.04 + t) * 1.2, y);
    }
    ctx.stroke();
  }

  function frame() {
    if (phase === 'down') {
      const speed = 10 + (midY - Math.max(charY, -300)) * 0.04;
      ropeLen = Math.min(ropeLen + speed, midY + 160);
      charY   = Math.min(charY + speed, midY);
      char.style.top = charY + 'px'; drawRope(ropeLen);
      if (charY >= midY) { phase = 'pause'; setTimeout(() => { phase = 'fall'; startPagePull(); }, 700); }
    } else if (phase === 'fall') {
      const speed = 14 + (charY - midY) * 0.06;
      charY += speed; ropeLen += speed;
      char.style.top = charY + 'px'; drawRope(ropeLen);
      if (charY > window.innerHeight + 320) { wrap.style.display = 'none'; return; }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ══════════════════════════════════════════════════════════════
   4. PAGE PULL TRANSITION
══════════════════════════════════════════════════════════════ */
function startPagePull() {
  const sheet = document.getElementById('page-pull-sheet');
  const intro = document.getElementById('intro-screen');
  gsap.set(sheet, { y: '-100%', opacity: 1 });
  gsap.to(sheet, {
    y: '0%', duration: 0.9, ease: 'power3.inOut',
    onComplete: () => {
      intro.style.display = 'none';
      document.getElementById('char-intro-wrap').style.display = 'none';
      document.getElementById('main-site').classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
      initMainSite();
      gsap.to(sheet, { y: '100%', duration: 1.0, ease: 'power3.out', delay: 0.05 });
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   5. MAIN SITE INIT
══════════════════════════════════════════════════════════════ */
function initMainSite() {
  initLampRope();
  initLampToggle();
  initSidebar();
  initNicknameCycle();
  initHomeParticles();
  initHomePixelCanvas();
  initHomeNightCanvas();
  initScrollReveal();
  initMemoriesTimeline();
  initModals();
  initDaySky();
  initKIKSections();
  setTimeout(initGSAPAnimations, 200);
}

/* ══════════════════════════════════════════════════════════════
   6. LAMP ROPE
══════════════════════════════════════════════════════════════ */
function initLampRope() {
  const canvas    = document.getElementById('lamp-rope-canvas');
  const lampWrap  = document.getElementById('lamp-wrap');
  const container = canvas ? canvas.parentElement : null;
  if (!canvas || !container) return;
  const ctx = canvas.getContext('2d');
  function reposition() {
    canvas.width = 10; canvas.height = 110;
    const rect = lampWrap.getBoundingClientRect();
    container.style.left = (rect.left + rect.width / 2 - 5) + 'px';
  }
  reposition(); window.addEventListener('resize', reposition);
  function draw() {
    ctx.clearRect(0, 0, 10, 110);
    const grad = ctx.createLinearGradient(0, 0, 0, 110);
    grad.addColorStop(0, 'rgba(212,175,122,1)');
    grad.addColorStop(0.6, 'rgba(212,175,122,0.7)');
    grad.addColorStop(1, 'rgba(212,175,122,0.2)');
    ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(5, 0);
    const t = Date.now() / 1000;
    for (let y = 0; y <= 110; y += 3) {
      ctx.lineTo(5 + Math.sin(y * 0.12 + t * 0.8) * 1.2, y);
    }
    ctx.stroke(); requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════════════════════
   7. LAMP TOGGLE
══════════════════════════════════════════════════════════════ */
function initLampToggle() {
  const lampWrap = document.getElementById('lamp-wrap');
  const lampBody = document.getElementById('lamp-body');
  const html     = document.documentElement;
  let isDark = false, animating = false;

  lampWrap.addEventListener('click', () => {
    if (animating) return; animating = true;
    startLampCharAnimation(() => {
      isDark = !isDark;
      html.setAttribute('data-theme', isDark ? 'dark' : 'light');
      if (isDark) { showNightSky(); hideDaySky(); }
      else        { showDaySky();  hideNightSky(); }
      animating = false;
    });
    gsap.to(lampBody, { rotation: 22, duration: 0.2, ease: 'power3.out',
      onComplete: () => gsap.to(lampBody, { rotation: 0, duration: 2.0, ease: 'elastic.out(1,0.3)' }) });
  });
}

function startLampCharAnimation(onModeChange) {
  const wrap   = document.getElementById('char-lamp-wrap');
  const char   = document.getElementById('char-lamp');
  const canvas = document.getElementById('rope-canvas-lamp');
  wrap.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width = 4; canvas.height = window.innerHeight;
  let charY = -260, ropeLen = 0;
  const targetY = window.innerHeight * 0.3;
  let phase = 'down', pullProgress = 0, modeChanged = false;

  function drawRope(len) {
    ctx.clearRect(0, 0, 4, canvas.height);
    const grad = ctx.createLinearGradient(0, 0, 0, len);
    grad.addColorStop(0, 'rgba(212,175,122,0.9)');
    grad.addColorStop(1, 'rgba(212,175,122,0.3)');
    ctx.strokeStyle = grad; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(2, 0); ctx.lineTo(2, len); ctx.stroke();
  }

  function frame() {
    if (phase === 'down') {
      ropeLen = Math.min(ropeLen + 16, targetY + 130);
      charY   = Math.min(charY + 16, targetY);
      char.style.top = charY + 'px'; drawRope(ropeLen);
      if (charY >= targetY) { phase = 'pause'; setTimeout(() => { phase = 'pull'; }, 400); }
    } else if (phase === 'pull') {
      pullProgress += 0.03;
      const sway = Math.sin(pullProgress * Math.PI * 5) * 10 * (1 - pullProgress);
      char.style.transform = `translateX(-50%) rotate(${sway}deg)`;
      if (!modeChanged && pullProgress > 0.4) { modeChanged = true; onModeChange(); }
      if (pullProgress >= 1) { phase = 'up'; }
    } else if (phase === 'up') {
      charY -= 20; ropeLen -= 20;
      char.style.top = charY + 'px'; drawRope(Math.max(ropeLen, 0));
      if (charY < -300) { wrap.style.display = 'none'; return; }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ══════════════════════════════════════════════════════════════
   8. NIGHT / DAY SKY
══════════════════════════════════════════════════════════════ */
function showNightSky() {
  const sky = document.getElementById('night-sky');
  sky.classList.remove('hidden');
  gsap.fromTo(sky, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' });
  initStars(); initNightParticles();
}
function hideNightSky() {
  const sky = document.getElementById('night-sky');
  gsap.to(sky, { opacity: 0, duration: 0.8, onComplete: () => sky.classList.add('hidden') });
}
function showDaySky() {
  const sky = document.getElementById('day-sky');
  sky.classList.remove('hidden');
  gsap.fromTo(sky, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out' });
}
function hideDaySky() {
  const sky = document.getElementById('day-sky');
  gsap.to(sky, { opacity: 0, duration: 0.8, onComplete: () => sky.classList.add('hidden') });
}
function initDaySky() { showDaySky(); }

function initStars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.7,
    r: Math.random() * 1.8 + 0.3, alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.005, phase: Math.random() * Math.PI * 2
  }));
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000;
    stars.forEach(s => {
      const a = 0.4 + 0.6 * Math.abs(Math.sin(t * s.speed * 10 + s.phase));
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,220,${a})`;
      ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(255,255,200,0.8)'; ctx.fill();
    });
    if (!document.getElementById('night-sky').classList.contains('hidden')) requestAnimationFrame(draw);
  }
  draw();
}

function initNightParticles() {
  const container = document.getElementById('night-particles');
  container.innerHTML = '';
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;border-radius:50%;background:rgba(255,220,180,${0.3+Math.random()*0.5});left:${Math.random()*100}%;top:${Math.random()*80}%;box-shadow:0 0 6px rgba(255,200,100,0.6);animation:nightFloat ${4+Math.random()*6}s ease-in-out infinite;animation-delay:${-Math.random()*6}s;`;
    container.appendChild(p);
  }
  if (!document.getElementById('nightFloatStyle')) {
    const style = document.createElement('style');
    style.id = 'nightFloatStyle';
    style.textContent = `@keyframes nightFloat{0%,100%{transform:translateY(0) scale(1);opacity:0.6;}50%{transform:translateY(-20px) scale(1.2);opacity:1;}}`;
    document.head.appendChild(style);
  }
}

/* ══════════════════════════════════════════════════════════════
   9. SIDEBAR
══════════════════════════════════════════════════════════════ */
function initSidebar() {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const close   = document.getElementById('sidebar-close');
  function open() { sidebar.classList.add('open'); overlay.classList.add('active'); }
  function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }
  toggle.addEventListener('click', open);
  close.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);
  // Close sidebar on nav link click
  document.querySelectorAll('.sidebar-item[href]').forEach(a => a.addEventListener('click', closeSidebar));
}

/* ══════════════════════════════════════════════════════════════
   10. NICKNAME CYCLE
══════════════════════════════════════════════════════════════ */
function initNicknameCycle() {
  const names = ['Devira','Depira','Devi','Depi','Dev','Dep','De','Vira','Vir','Vi','Luis','Luwis','Deplupiss','Lupis Legit','Lupis','Pis','Imut','Mut'];
  const el = document.getElementById('home-nickname');
  if (!el) return;
  let idx = 0;
  function next() {
    el.classList.add('fade-out');
    setTimeout(() => {
      idx = (idx + 1) % names.length;
      el.textContent = names[idx];
      el.classList.remove('fade-out'); el.classList.add('fade-in');
      setTimeout(() => el.classList.remove('fade-in'), 400);
    }, 400);
  }
  setInterval(next, 2200);
}

/* ══════════════════════════════════════════════════════════════
   11. HOME PARTICLES
══════════════════════════════════════════════════════════════ */
function initHomeParticles() {
  const container = document.getElementById('home-particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    const size = 2 + Math.random() * 4;
    p.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(242,196,206,${0.3+Math.random()*0.4});left:${Math.random()*100}%;top:${Math.random()*100}%;box-shadow:0 0 ${size*3}px rgba(242,196,206,0.5);animation:homeParticle ${5+Math.random()*8}s ease-in-out infinite;animation-delay:${-Math.random()*8}s;`;
    container.appendChild(p);
  }
  if (!document.getElementById('homeParticleStyle')) {
    const style = document.createElement('style');
    style.id = 'homeParticleStyle';
    style.textContent = `@keyframes homeParticle{0%,100%{transform:translateY(0) translateX(0) scale(1);opacity:0.5;}33%{transform:translateY(-30px) translateX(15px) scale(1.3);opacity:0.9;}66%{transform:translateY(-15px) translateX(-10px) scale(0.8);opacity:0.6;}}`;
    document.head.appendChild(style);
  }
}

/* ══════════════════════════════════════════════════════════════
   11b. HOME PIXEL CANVAS
══════════════════════════════════════════════════════════════ */
function initHomePixelCanvas() {
  const canvas = document.getElementById('home-pixel-canvas');
  if (!canvas) return;
  function resize() { canvas.width = canvas.offsetWidth || window.innerWidth; canvas.height = canvas.offsetHeight || window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  const ctx = canvas.getContext('2d');
  const pixels = Array.from({ length: 120 }, () => ({
    x: Math.random(), y: Math.random(),
    size: Math.floor(Math.random() * 3) + 1,
    phase: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() * 1.5,
    color: Math.random() > 0.5 ? 'rgba(255,220,180,' : 'rgba(200,220,255,',
  }));
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000;
    pixels.forEach(p => {
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(t * p.speed + p.phase));
      ctx.fillStyle = p.color + alpha + ')';
      ctx.shadowBlur = p.size * 4; ctx.shadowColor = p.color + '0.9)';
      ctx.fillRect(p.x * canvas.width, p.y * canvas.height, p.size, p.size);
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════════════════════
   11c. HOME NIGHT CANVAS
══════════════════════════════════════════════════════════════ */
function initHomeNightCanvas() {
  const canvas = document.getElementById('home-night-canvas');
  if (!canvas) return;
  function resize() {
    const parent = canvas.parentElement;
    canvas.width  = parent ? parent.offsetWidth : window.innerWidth;
    canvas.height = Math.round((parent ? parent.offsetWidth : window.innerWidth) * 0.6);
  }
  resize(); window.addEventListener('resize', resize);
  const ctx = canvas.getContext('2d');
  const pixels = Array.from({ length: 80 }, () => ({
    x: 0.05 + Math.random() * 0.9, y: Math.random() * 0.88,
    size: Math.floor(Math.random() * 2) + 1, phase: Math.random() * Math.PI * 2,
    speed: 0.6 + Math.random() * 1.4, swayAmp: 0.6 + Math.random() * 1.8,
    swayFreq: 0.25 + Math.random() * 0.6, warm: Math.random() > 0.5,
  }));
  const drifters = Array.from({ length: 60 }, () => ({
    x: Math.random(), y: Math.random() * 0.88, r: Math.random() * 1.4 + 0.3,
    phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.9,
    dx: (Math.random() - 0.5) * 0.00012, dy: (Math.random() - 0.5) * 0.00006,
    warm: Math.random() > 0.4,
  }));

  function drawMoon(w, h) {
    const mx = w * 0.14, my = h * 0.21, r = Math.max(28, Math.min(w, h) * 0.065);
    ctx.save();
    const grd = ctx.createRadialGradient(mx, my, r * 0.4, mx, my, r * 3.2);
    grd.addColorStop(0, 'rgba(255,240,120,0.35)'); grd.addColorStop(0.5, 'rgba(245,208,96,0.15)'); grd.addColorStop(1, 'rgba(245,208,96,0)');
    ctx.beginPath(); ctx.arc(mx, my, r * 3.2, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
    ctx.beginPath(); ctx.arc(mx, my, r, 0, Math.PI * 2);
    const moonGrd = ctx.createRadialGradient(mx - r*0.3, my - r*0.3, r*0.1, mx, my, r);
    moonGrd.addColorStop(0, '#fffde0'); moonGrd.addColorStop(0.4, '#f5d060'); moonGrd.addColorStop(1, '#d4a020');
    ctx.fillStyle = moonGrd; ctx.shadowBlur = r * 1.2; ctx.shadowColor = 'rgba(255,230,80,0.85)'; ctx.fill(); ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(mx + r * 0.50, my - r * 0.04, r * 0.82, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,1)'; ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000, w = canvas.width, h = canvas.height;
    drifters.forEach(s => {
      s.x += s.dx; s.y += s.dy;
      if (s.x < 0) s.x = 1; if (s.x > 1) s.x = 0;
      if (s.y < 0) s.y = 0.88; if (s.y > 0.88) s.y = 0;
      const a = 0.2 + 0.8 * Math.abs(Math.sin(t * s.speed * 1.8 + s.phase));
      ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.warm ? `rgba(255,230,180,${a})` : `rgba(200,220,255,${a})`;
      ctx.shadowBlur = s.r * 5; ctx.shadowColor = s.warm ? `rgba(255,220,150,${a})` : `rgba(180,210,255,${a})`; ctx.fill(); ctx.shadowBlur = 0;
    });
    pixels.forEach(p => {
      const a = 0.15 + 0.85 * Math.abs(Math.sin(t * p.speed * 2.2 + p.phase));
      const sway = Math.sin(t * p.swayFreq + p.phase) * p.swayAmp;
      ctx.shadowBlur = p.size * (4 + 3 * Math.abs(Math.sin(t * p.speed + p.phase)));
      ctx.shadowColor = p.warm ? `rgba(255,220,150,${a})` : `rgba(180,210,255,${a})`;
      ctx.fillStyle = p.warm ? `rgba(255,240,190,${a})` : `rgba(215,230,255,${a})`;
      ctx.fillRect(p.x * w + sway, p.y * h, p.size, p.size); ctx.shadowBlur = 0;
    });
    drawMoon(w, h);
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════════════════════
   12. SCROLL REVEAL
══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseFloat(getComputedStyle(e.target).getPropertyValue('--delay') || '0') * 1000;
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   13. MEMORIES TIMELINE
══════════════════════════════════════════════════════════════ */
function initMemoriesTimeline() {
  const container = document.getElementById('memories-timeline');
  if (!container) return;
  const photos = [
    '1.jpg','2.jpg','8.jpg','9.jpg','11.jpg','20.jpg','49.jpg','116.jpg',
    '130.jpg','132.jpg','138.jpg','140.jpg','145.jpg','146.jpg','152.jpg',
    '157.jpg','158.jpg','161.jpg','163.jpg','167.jpg','3me.jpg','3aku.jpg',
    '4aku.jpg','10me.jpg','16me.jpg'
  ];
  photos.forEach(src => {
    const item = document.createElement('div');
    item.className = 'memory-item';
    item.innerHTML = `<img src="${src}" alt="" loading="lazy" onerror="this.parentElement.style.display='none'"/>`;
    container.appendChild(item);
  });
}

/* ══════════════════════════════════════════════════════════════
   14. MODALS
══════════════════════════════════════════════════════════════ */
function initModals() {
  const btnMem  = document.getElementById('btn-memories');
  const btnFind = document.getElementById('btn-findme');
  const memModal  = document.getElementById('memories-modal');
  const findModal = document.getElementById('findme-modal');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebar-overlay');

  function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }

  btnMem?.addEventListener('click', () => { closeSidebar(); memModal.classList.remove('hidden'); });
  document.getElementById('memories-close')?.addEventListener('click', () => memModal.classList.add('hidden'));
  memModal?.querySelector('.modal-backdrop')?.addEventListener('click', () => memModal.classList.add('hidden'));

  btnFind?.addEventListener('click', () => { closeSidebar(); findModal.classList.remove('hidden'); });
  document.getElementById('findme-close')?.addEventListener('click', () => findModal.classList.add('hidden'));
  findModal?.querySelector('.modal-backdrop')?.addEventListener('click', () => findModal.classList.add('hidden'));
}

/* ══════════════════════════════════════════════════════════════
   15. SMOOTH SCROLL
══════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════════════════════════
   16. GSAP SCROLL ANIMATIONS
══════════════════════════════════════════════════════════════ */
function initGSAPAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.to('.home-bg-real-img', {
    yPercent: 15, ease: 'none',
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50, skewY: 2 },
      { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });
}

/* ══════════════════════════════════════════════════════════════
   17. KIK SECTIONS — Progress Bars, Circles, Counters, Roadmap
══════════════════════════════════════════════════════════════ */
function initKIKSections() {
  // SVG gradient defs
  const svgDefs = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svgDefs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svgDefs.innerHTML = `<defs>
    <linearGradient id="evalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f2c4ce"/><stop offset="100%" stop-color="#d4607a"/>
    </linearGradient>
    <linearGradient id="progGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f2c4ce"/><stop offset="100%" stop-color="#e8a0b0"/>
    </linearGradient>
  </defs>`;
  document.body.prepend(svgDefs);

  // Progress bars (evaluasi + progres)
  const pbObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const w = e.target.dataset.w;
      if (w) {
        setTimeout(() => { e.target.style.width = w + '%'; }, 200);
      }
      // eval-bar uses ::after pseudo with CSS var
      if (e.target.classList.contains('eval-bar')) {
        e.target.style.setProperty('--w', e.target.dataset.w + '%');
        setTimeout(() => e.target.classList.add('animated'), 200);
      }
      pbObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.pb-fill').forEach(el => pbObs.observe(el));

  // eval-bar: trigger animated class
  const evalObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('animated'), 200);
      evalObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.eval-bar').forEach(el => evalObs.observe(el));

  // Circular progress (progres section)
  const circObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const pct  = parseFloat(e.target.dataset.pct);
      const circ = 2 * Math.PI * 32; // r=32
      const dash = (pct / 100) * circ;
      setTimeout(() => { e.target.style.strokeDasharray = `${dash} ${circ - dash}`; }, 200);
      circObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.pcr-fill').forEach(el => circObs.observe(el));

  // Evaluasi summary circle
  const escCircle = document.getElementById('esc-circle');
  const escPct    = document.getElementById('esc-pct');
  if (escCircle) {
    const escObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const avg  = 48; // (45+70+40+35+50)/5
        const circ = 2 * Math.PI * 50; // r=50
        const dash = (avg / 100) * circ;
        setTimeout(() => { escCircle.style.strokeDasharray = `${dash} ${circ - dash}`; }, 300);
        animCounter(escPct, avg, 1400);
        escObs.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    escObs.observe(escCircle);
  }

  // Counter animation for pc-num
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target = parseInt(e.target.dataset.target, 10);
      animCounter(e.target, target, 1200);
      counterObs.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.pc-num[data-target]').forEach(el => counterObs.observe(el));
}

function animCounter(el, target, dur) {
  if (!el) return;
  const step = 16, inc = target / (dur / step);
  let cur = 0;
  const t = setInterval(() => {
    cur += inc;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = Math.floor(cur) + (el.dataset.suffix || '');
  }, step);
}

/* ══════════════════════════════════════════════════════════════
   18. TOAST & TUGAS BUTTONS
══════════════════════════════════════════════════════════════ */
function showToast(msg) {
  const t = document.getElementById('kik-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

const tugasInfo = {
  1: 'Study Kasus: Analisis kasus usaha dan menemukan solusi permasalahan.',
  2: 'SWOT & BMC: Analisis SWOT dan Business Model Canvas ide usaha.',
  3: 'Portofolio: Kumpulan karya dan perjalanan pembelajaran KIK.',
};

window.showDetail = function(n) { showToast('📋 ' + tugasInfo[n]); };
window.showUpload = function(n) { showToast('📤 Fitur upload tugas ' + n + ' akan segera tersedia!'); };
