'use strict';

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    setTimeout(() => { loader.style.display = 'none'; }, 800);
    triggerHeroAnimations();
  }, 1200);
});

function triggerHeroAnimations() {
  document.querySelectorAll('.animate-in').forEach(el => {
    setTimeout(() => { el.classList.add('visible'); },
      parseInt(el.dataset.delay || 0) * 130);
  });
}

/* ── CURSOR ── */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursorDot) { cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px'; }
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) { cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px'; }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .tilt-card, .skill-card, .nav-link').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing?.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing?.classList.remove('hovered'));
});

/* ── CANVAS BACKGROUND ── */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x  = Math.random() * canvas.width;
    this.y  = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = -(Math.random() * 0.4 + 0.15);
    this.r  = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 300 + 200;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset();
  }
  draw() {
    const alpha = this.opacity * (1 - (this.life / this.maxLife) * 0.5);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
    ctx.fill();
  }
}

class Firefly {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.tx = Math.random() * canvas.width;
    this.ty = Math.random() * canvas.height;
    this.speed = Math.random() * 0.4 + 0.1;
    this.r = Math.random() * 3 + 1.5;
    this.pulse = 0;
    this.pulseSpeed = Math.random() * 0.018 + 0.008;
  }
  update() {
    const dx = this.tx - this.x, dy = this.ty - this.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 2) { this.tx = Math.random() * canvas.width; this.ty = Math.random() * canvas.height; }
    this.x += (dx/dist)*this.speed; this.y += (dy/dist)*this.speed;
    this.pulse += this.pulseSpeed;
  }
  draw() {
    const glow = Math.sin(this.pulse)*0.5 + 0.5;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r*4);
    g.addColorStop(0, `rgba(59, 130, 246, ${0.5 * glow})`);
    g.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r*4, 0, Math.PI*2);
    ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r*glow, 0, Math.PI*2);
    ctx.fillStyle = `rgba(96, 165, 250, ${0.7 * glow})`; ctx.fill();
  }
}

const particles = Array.from({length: 70}, () => new Particle());
const fireflies = Array.from({length: 10}, () => new Firefly());
const mouse = { x: -999, y: -999 };
document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const dx = particles[i].x-particles[j].x, dy = particles[i].y-particles[j].y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(59,130,246,${(1-dist/100)*0.06})`;
        ctx.lineWidth = 0.6; ctx.stroke();
      }
    }
    const dx = particles[i].x-mouse.x, dy = particles[i].y-mouse.y;
    const dist = Math.sqrt(dx*dx+dy*dy);
    if (dist < 160) {
      ctx.beginPath();
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = `rgba(59,130,246,${(1-dist/160)*0.25})`;
      ctx.lineWidth = 0.8; ctx.stroke();
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireflies.forEach(f => { f.update(); f.draw(); });
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ── TYPEWRITER ── */
const roles = [
  'Real Estate Sales Expert',
  'مستشار عقاري محترف',
  'خبير مبيعات عقارية',
  'Property Sales Specialist',
  'مبيعات | استثمار | عقارات',
];
let roleIdx = 0, charIdx = 0, isDeleting = false;
const typeEl = document.getElementById('typewriterText');

function typewriter() {
  if (!typeEl) return;
  const current = roles[roleIdx];
  typeEl.textContent = isDeleting ? current.substring(0, charIdx-1) : current.substring(0, charIdx+1);
  isDeleting ? charIdx-- : charIdx++;
  if (!isDeleting && charIdx === current.length) {
    setTimeout(() => { isDeleting = true; typewriter(); }, 2000); return;
  }
  if (isDeleting && charIdx === 0) { isDeleting = false; roleIdx = (roleIdx+1) % roles.length; }
  setTimeout(typewriter, isDeleting ? 45 : 85);
}
setTimeout(typewriter, 1600);

/* ── SCROLL ANIMATIONS ── */
const reveals   = document.querySelectorAll('.reveal');
const skillBars = document.querySelectorAll('.skill-bar');
const statNums  = document.querySelectorAll('.stat-num');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
reveals.forEach(el => observer.observe(el));

const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => { e.target.style.width = e.target.dataset.w + '%'; }, 250);
      skillBarObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(bar => skillBarObserver.observe(bar));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target, target = parseInt(el.dataset.count);
      let current = 0;
      const inc = target / 40;
      const timer = setInterval(() => {
        current += inc;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else el.textContent = Math.floor(current);
      }, 42);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObserver.observe(el));

/* ── NAVBAR ── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backTop')?.classList.toggle('visible', window.scrollY > 400);
  updateActiveNav();
});

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  let current = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

/* ── BACK TO TOP ── */
document.getElementById('backTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 3D TILT CARDS ── */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top  - rect.height/2;
    card.style.transform = `perspective(1000px) rotateX(${(-y/rect.height*10).toFixed(2)}deg) rotateY(${(x/rect.width*10).toFixed(2)}deg) translateZ(6px)`;
    card.style.transition = 'transform 0.05s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    card.style.transition = 'transform 0.6s ease';
  });
});

/* ── ABOUT CARD PARALLAX ── */
const aboutCard = document.getElementById('aboutCard');
if (aboutCard) {
  document.addEventListener('mousemove', (e) => {
    const rect = aboutCard.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    const dx = (e.clientX - (rect.left + rect.width/2)) / window.innerWidth;
    const dy = (e.clientY - (rect.top + rect.height/2)) / window.innerHeight;
    aboutCard.querySelector('.about-card-inner').style.transform =
      `perspective(900px) rotateY(${dx*14}deg) rotateX(${-dy*14}deg)`;
  });
}

/* ── CUBE PARALLAX ── */
const cube = document.getElementById('cube3d');
document.addEventListener('mousemove', (e) => {
  if (!cube) return;
  const xF = (e.clientX/window.innerWidth  - 0.5)*28;
  const yF = (e.clientY/window.innerHeight - 0.5)*28;
  cube.style.transform = `rotateX(${yF}deg) rotateY(${xF}deg)`;
});

/* ── CONTACT FORM ── */
const sendBtn = document.getElementById('sendBtn');
const formMsg = document.getElementById('formMsg');

sendBtn?.addEventListener('click', () => {
  const name  = document.getElementById('fname')?.value.trim();
  const email = document.getElementById('femail')?.value.trim();
  const msg   = document.getElementById('fmessage')?.value.trim();
  if (!name || !email || !msg) { showFormMsg('error', '⚠️ Please fill all fields before sending.'); return; }
  if (!/\S+@\S+\.\S+/.test(email)) { showFormMsg('error', '⚠️ Please enter a valid email address.'); return; }
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<span>Sending…</span>';
  setTimeout(() => {
    sendBtn.disabled = false;
    sendBtn.innerHTML = '<span>Send Message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg>';
    document.getElementById('fname').value = '';
    document.getElementById('femail').value = '';
    document.getElementById('fmessage').value = '';
    showFormMsg('success', '✅ Message sent! Ahmed will get back to you soon.');
  }, 1800);
});

function showFormMsg(type, text) {
  if (!formMsg) return;
  formMsg.className = 'form-msg ' + type;
  formMsg.textContent = text;
  setTimeout(() => { formMsg.className = 'form-msg'; }, 5000);
}

/* ── STAGGERED CHILDREN ── */
const staggerObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-card, .project-card, .service-card, .edu-card, .timeline-card, .contact-card').forEach((child, i) => {
        setTimeout(() => { child.style.opacity = '1'; child.style.transform = 'translateY(0)'; }, i*110);
      });
      staggerObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.section').forEach(section => {
  const cards = section.querySelectorAll('.skill-card, .project-card, .service-card, .edu-card, .timeline-card, .contact-card');
  cards.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(32px)';
    c.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  });
  if (cards.length) staggerObs.observe(section);
});

/* ── HERO SCROLL PARALLAX ── */
const heroPhoto = document.querySelector('.hero-photo');
window.addEventListener('scroll', () => {
  if (!heroPhoto) return;
  if (window.scrollY < window.innerHeight)
    heroPhoto.style.transform = `translateY(${window.scrollY * 0.07}px)`;
});

/* ── TITLE LINE ANIMATION ── */
const titleObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const line = e.target.querySelector('.title-line');
      if (line) { line.style.animation = 'none'; line.offsetWidth; line.style.animation = 'titleLineGrow 0.9s ease forwards'; }
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.section-header').forEach(h => titleObs.observe(h));

const styleTag = document.createElement('style');
styleTag.textContent = `
@keyframes titleLineGrow { from { width: 0; opacity: 0; } to { width: 60px; opacity: 1; } }
@keyframes rippleAnim { to { transform: scale(2.5); opacity: 0; } }
@keyframes heroParticleAnim {
  from { transform: translate(0,0) scale(1); opacity: 1; }
  to   { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}
`;
document.head.appendChild(styleTag);

/* ── RIPPLE ON BUTTONS ── */
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute; border-radius: 50%;
      background: rgba(255,255,255,0.25);
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size/2}px;
      top: ${e.clientY - rect.top - size/2}px;
      transform: scale(0);
      animation: rippleAnim 0.65s ease-out forwards;
      pointer-events: none; z-index: 10;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ── HERO CLICK PARTICLES ── */
document.querySelector('.hero')?.addEventListener('click', (e) => {
  for (let i = 0; i < 10; i++) {
    const el = document.createElement('div');
    const tx = (Math.random() * 120 - 60) + 'px';
    const ty = (-Math.random() * 140 - 20) + 'px';
    el.style.cssText = `
      position: fixed;
      left: ${e.clientX}px; top: ${e.clientY}px;
      width: ${Math.random()*7+3}px; height: ${Math.random()*7+3}px;
      background: ${Math.random() > 0.5 ? 'var(--electric)' : 'var(--gold)'};
      border-radius: 50%; pointer-events: none; z-index: 9000;
      --tx: ${tx}; --ty: ${ty};
      animation: heroParticleAnim 0.9s ease-out forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }
});

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top  - rect.height/2;
    btn.style.transform = `translate(${x*0.18}px, ${y*0.18}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

console.log('%cAhmed Elsayed Portfolio ✨ v2', 'font-size:18px; color:#3b82f6; font-weight:bold;');