/**
 * Omar Abdelaal Portfolio — script.js
 * Performance-optimised: animations pause when off-screen.
 */
(function () {
  'use strict';

  /* ══════════════════════════════════════
     1. PARTICLE CANVAS  (hero-only, pauses when off-screen)
  ══════════════════════════════════════ */
  function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = { x: -9999, y: -9999 };
    const PARTICLE_COUNT = 55;   // reduced from 80 → cuts O(N²) line work ~53%
    const MAX_DIST = 130;
    let rafId = null;
    let running = false;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }, { passive: true });
    canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; }, { passive: true });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r  = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.35 + 0.08;
        this.color = Math.random() > 0.5 ? '154,108,46' : '139,94,60';
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 80 && d > 0) {
          this.x += dx / d * 1.5;
          this.y += dy / d * 1.5;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(154,108,46,${0.10 * (1 - d / MAX_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      rafId = requestAnimationFrame(animate);
    }

    function start() { if (!running) { running = true; animate(); } }
    function stop()  { if (running)  { running = false; cancelAnimationFrame(rafId); rafId = null; } }

    // Pause when hero scrolls off-screen — eliminates main-thread work while reading
    const heroSection = document.getElementById('hero');
    if (heroSection && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0.01 });
      io.observe(heroSection);
    } else {
      start(); // fallback
    }
  }

  /* ══════════════════════════════════════
     2. TYPED TEXT EFFECT
  ══════════════════════════════════════ */
  function initTyped() {
    const el = document.getElementById('typed-text');
    if (!el) return;
    const phrases = [
      'intelligent systems.',
      'AI automation.',
      'LLM pipelines.',
      'RAG architectures.',
      'AI agents.',
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false, pause = false;

    function tick() {
      const phrase = phrases[phraseIdx];
      if (!deleting) {
        el.textContent = phrase.slice(0, ++charIdx);
        if (charIdx === phrase.length) {
          pause = true;
          setTimeout(() => { pause = false; deleting = true; tick(); }, 2000);
          return;
        }
      } else {
        el.textContent = phrase.slice(0, --charIdx);
        if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
      }
      if (!pause) setTimeout(tick, deleting ? 40 : 80);
    }
    setTimeout(tick, 800);
  }

  /* ══════════════════════════════════════
     3. SCROLL REVEAL
  ══════════════════════════════════════ */
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ══════════════════════════════════════
     4. COUNTER ANIMATION
  ══════════════════════════════════════ */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const startTime = performance.now();
        function step(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * ease) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
  }

  /* ══════════════════════════════════════
     5. NAVBAR
  ══════════════════════════════════════ */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    function setActive() {
      const y = window.scrollY + 120;
      sections.forEach(s => {
        const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
        if (link) {
          link.classList.toggle('active', y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
        }
      });
    }
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();

    if (toggle && mobileMenu) {
      toggle.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        const spans = toggle.querySelectorAll('span');
        if (open) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
      });
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        });
      });
    }
  }

  /* ══════════════════════════════════════
     6. CARD TILT EFFECT
  ══════════════════════════════════════ */
  function initTilt() {
    document.querySelectorAll('.service-card, .project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  /* ══════════════════════════════════════
     7. CUSTOM CURSOR GLOW
     Uses CSS will-change + stops rAF when mouse leaves the window
  ══════════════════════════════════════ */
  function initCursorGlow() {
    // Skip on touch devices — saves a persistent rAF loop
    if (window.matchMedia('(hover: none)').matches) return;

    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText = `
      position:fixed; pointer-events:none; z-index:9999;
      width:300px; height:300px; border-radius:50%;
      background:radial-gradient(circle, rgba(154,108,46,0.08) 0%, transparent 70%);
      transform:translate(-50%,-50%); will-change:left,top;
      transition:opacity 0.3s ease; opacity:0;
      top:0; left:0;
    `;
    document.body.appendChild(glow);

    let tx = 0, ty = 0, cx = 0, cy = 0;
    let glowRaf = null;
    let active = false;

    function animGlow() {
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      glowRaf = requestAnimationFrame(animGlow);
    }

    document.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      if (!active) { active = true; glow.style.opacity = '1'; animGlow(); }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
      active = false;
      cancelAnimationFrame(glowRaf);
      glowRaf = null;
    });
  }

  /* ══════════════════════════════════════
     8. STAGGER CHILDREN
  ══════════════════════════════════════ */
  function initStagger() {
    document.querySelectorAll('.cert-list, .events-list, .contact-cards, .stack-grid, .services-grid').forEach(parent => {
      parent.querySelectorAll(':scope > *').forEach((child, i) => {
        child.style.transitionDelay = `${i * 80}ms`;
      });
    });
  }

  /* ══════════════════════════════════════
     9. SCROLL PROGRESS BAR
  ══════════════════════════════════════ */
  function initProgressBar() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position:fixed; top:0; left:0; height:2px; z-index:9998;
      background:linear-gradient(90deg, #9a6c2e, #b07d38, #4a7c59);
      width:0%; transition:width 0.1s ease; pointer-events:none;
      will-change:width;
    `;
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) bar.style.width = (window.scrollY / total * 100) + '%';
    }, { passive: true });
  }

  /* ══════════════════════════════════════
     10. ADD REVEAL CLASSES
  ══════════════════════════════════════ */
  function addRevealClasses() {
    const add = (sel, cls, delay) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add(cls);
        el.style.transitionDelay = `${i * delay}ms`;
      });
    };
    add('.service-card',   'reveal',        100);
    add('.project-card',   'reveal',         80);
    add('.stack-category', 'reveal',         80);
    add('.cert-card',      'reveal',         60);
    add('.event-card',     'reveal',         70);
    add('.contact-card',   'reveal',         80);
    add('.detail-card',    'reveal-right',   80);
    add('.section-header', 'reveal',          0);
    add('.about-text',     'reveal-left',     0);
    add('.about-details',  'reveal-right',    0);
    add('.skills-top',     'reveal',          0);
    document.querySelectorAll('.contact-inner > *').forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 80}ms`;
    });
  }

  /* ══════════════════════════════════════
     INIT
  ══════════════════════════════════════ */
  function init() {
    addRevealClasses();
    initScrollReveal();
    initParticles();
    initTyped();
    initCounters();
    initNavbar();
    initTilt();
    initCursorGlow();
    initStagger();
    initProgressBar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
