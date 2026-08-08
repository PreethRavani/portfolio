(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  (function initNoise() {
    const canvas = document.getElementById('noise-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      const imageData = ctx.createImageData(w, h);
      const buffer = imageData.data;
      for (let i = 0; i < buffer.length; i += 4) {
        const shade = Math.random() * 255;
        buffer[i] = buffer[i + 1] = buffer[i + 2] = shade;
        buffer[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    }

    if (!prefersReducedMotion) {
      let frame = 0;
      function loop() {
        if (frame % 4 === 0) draw();
        frame++;
        requestAnimationFrame(loop);
      }
      loop();
    }
  })();

  (function initSilkscreenClock() {
  const clock = document.getElementById('silkscreenClock');
  const dateBox = document.getElementById('silkscreenDate');
  if (!clock) return;

  const hoursEl = clock.querySelector('.hours');
  const minutesEl = clock.querySelector('.minutes');
  const secondsEl = clock.querySelector('.seconds');
  const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  function updateTick() {
    const time = new Date();
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');

    if (hoursEl && hoursEl.textContent !== h) hoursEl.textContent = h;
    if (minutesEl && minutesEl.textContent !== m) minutesEl.textContent = m;
    if (secondsEl && secondsEl.textContent !== s) secondsEl.textContent = s;

    if (dateBox) {
      const day = DAYS[time.getDay()];
      const dd = String(time.getDate()).padStart(2, '0');
      const mm = String(time.getMonth() + 1).padStart(2, '0');
      const yyyy = time.getFullYear();
      
      const combinedDate = `${day} ${dd}.${mm}.${yyyy}`;
      if (dateBox.textContent !== combinedDate) {
        dateBox.textContent = combinedDate;
      }
    }
  }

  updateTick();
  setInterval(updateTick, 1000);
})();

  (function initCursor() {
    if (isTouch) return;
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;

    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

    function raf() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(raf);
    }
    raf();

    const interactive = 'a, button, .magnetic, input, textarea, .skill-chip, .project-card, .cert-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactive)) cursor.classList.add('is-active');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactive)) cursor.classList.remove('is-active');
    });
  })();

  (function initMagnetic() {
    if (isTouch || prefersReducedMotion) return;
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.4}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
    });
  })();

  (function initScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    const sections = ['hero', 'about', 'education', 'skills', 'projects', 'certifications', 'achievements', 'social', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const railDots = Array.from(document.querySelectorAll('.rail-dot'));

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (bar) bar.style.width = pct + '%';

      let activeIndex = 0;
      sections.forEach((sec, i) => {
        if (sec.getBoundingClientRect().top <= window.innerHeight * 0.4) activeIndex = i;
      });
      railDots.forEach((dot, i) => dot.classList.toggle('is-active', i === activeIndex));
    }
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    railDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const target = document.getElementById(dot.dataset.target);
        if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });
  })();

  (function initMenu() {
    const btn = document.getElementById('menuBtn');
    const overlay = document.getElementById('menuOverlay');
    if (!btn || !overlay) return;

    function toggle(open) {
      overlay.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    }
    btn.addEventListener('click', () => toggle(!overlay.classList.contains('is-open')));
    overlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
  })();

  (function initHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    requestAnimationFrame(() => {
      setTimeout(() => hero.classList.add('is-loaded'), 100);
    });
  })();

  (function initHeroParallax() {
    if (isTouch || prefersReducedMotion) return;
    const hero = document.querySelector('.hero');
    const visual = document.getElementById('heroVisual');
    const glow = document.getElementById('heroGlow');
    const grid = document.querySelector('.hero-grid');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (visual) visual.style.transform = `translateY(-50%) translate(${px * -20}px, ${py * -20}px)`;
      if (glow) glow.style.transform = `translate(${px * 40}px, ${py * 40}px)`;
      if (grid) grid.style.transform = `translate(${px * -10}px, ${py * -10}px)`;
    });
  })();

  (function initWordSplit() {
    document.querySelectorAll('.reveal-words').forEach((el) => {
      const text = el.textContent.trim();
      const words = text.split(/\s+/);
      el.innerHTML = words
        .map((w) => `<span class="word-outer" style="display:inline-block;overflow:hidden;vertical-align:top;"><span class="word-inner">${w}&nbsp;</span></span>`)
        .join('');
      el.querySelectorAll('.word-inner').forEach((w, i) => {
        w.style.transitionDelay = `${i * 0.03}s`;
      });
    });
  })();

  (function initReveals() {
    const targets = document.querySelectorAll(
      '.reveal-line, .reveal-fade, .reveal-words, .reveal-up, .section-head, .about-grid, .stat-grid, .skills-groups, .project-card, .cert-card, .achieve-card, .social-grid, .contact-grid'
    );
    if (!('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    targets.forEach((t) => io.observe(t));
  })();

  (function initTimeline() {
      const timeline = document.getElementById('timeline');
      const svg = document.getElementById('timelineTrail');
      const pathBase = document.getElementById('timelinePathBase');
      const pathFill = document.getElementById('timelinePathFill');
      const clipRect = document.getElementById('timelineClipRect');
      const items = Array.from(document.querySelectorAll('.timeline-item'));
      if (!timeline || !svg || !items.length) return;

      const CURVE_OVERSHOOT = 0.18;
      const SCROLL_DELAY = 1.0;

      let pathLength = 0;
      let revealed = 0; 

      function buildPath() {
        const timelineRect = timeline.getBoundingClientRect();
        const svgHeight = timeline.offsetHeight;
        svg.setAttribute('viewBox', `0 0 ${timeline.offsetWidth} ${svgHeight}`);
        svg.setAttribute('width', timeline.offsetWidth);
        svg.setAttribute('height', svgHeight);
        const points = [];
    
        const headNode = document.querySelector('.education .heading-node');
        if (headNode) {
          const hnr = headNode.getBoundingClientRect();
          points.push({ 
            x: hnr.left - timelineRect.left + (hnr.width / 2), 
            y: hnr.top - timelineRect.top + (hnr.height / 2) 
          });
        }

        items.forEach((item) => {
          const node = item.querySelector('.timeline-node');
          if (!node) return;
          const nr = node.getBoundingClientRect();
          points.push({
            x: nr.left - timelineRect.left + nr.width / 2,
            y: nr.top - timelineRect.top + nr.height / 2,
          });
        });
        if (points.length < 2) return;

        const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const dy = p1.y - p0.y;

      const currentItem = items[i]; 
      const alignSide = currentItem ? currentItem.dataset.align : 'left';
      
      const waveDirection = (alignSide === 'left') ? 1 : -1;
      const curveIntensity = 220; 

      const c1x = p0.x + (waveDirection * curveIntensity);
      const c2x = p1.x + (waveDirection * curveIntensity);
      const midY = p0.y + dy * 0.5;
      d += ` C ${c1x} ${midY}, ${c2x} ${midY}, ${p1.x} ${p1.y}`;

      tempPath.setAttribute('d', d);
      const lengthSoFar = tempPath.getTotalLength();
      
      if (items[i]) {
         items[i].dataset.revealAt = lengthSoFar;
      }
    }


        pathBase.setAttribute('d', d);
        pathFill.setAttribute('d', d);
        pathLength = pathFill.getTotalLength();

        items.forEach((item) => {
          const at = parseFloat(item.dataset.revealAt || '0');
          item.dataset.revealFraction = pathLength > 0 ? at / pathLength : 0;
        });

        clipRect.setAttribute('x', 0);
        clipRect.setAttribute('y', 0);
        clipRect.setAttribute('width', timeline.offsetWidth);
        clipRect.setAttribute('height', 0);
      }

      function updateReveal() {
        if (!pathLength) return;
        
        const track = document.querySelector('.timeline-scroll-track');
        if (!track) return;
        const trackRect = track.getBoundingClientRect();
        const timelineRect = timeline.getBoundingClientRect();

        const totalScrollableDistance = trackRect.height - window.innerHeight;
        const scrolledDistance = -trackRect.top;
        const pct = Math.min(Math.max(scrolledDistance / totalScrollableDistance, 0), 1);

        const currentTrailHeight = pct * timelineRect.height;
        clipRect.setAttribute('height', currentTrailHeight);

            items.forEach((item) => {
      const node = item.querySelector('.timeline-node');
      if (!node) return;
      
      const nodeTopInTimeline = node.getBoundingClientRect().top - timelineRect.top + (node.offsetHeight / 2);
      
      if (pct === 0) {
        item.classList.remove('is-visible');
      } else if (currentTrailHeight >= (nodeTopInTimeline - 40)) {
        item.classList.add('is-visible');
      } else {
        item.classList.remove('is-visible');
      }
    });

      }

      function refresh() {
        buildPath();
        updateReveal();
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        items.forEach((i) => i.classList.add('is-visible'));
      }

      window.addEventListener('load', refresh);
      document.addEventListener('scroll', updateReveal, { passive: true });
      window.addEventListener('resize', refresh);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(refresh);
      }
      refresh();
      setTimeout(refresh, 400);
    })();

  (function initCounters() {
    const counters = document.querySelectorAll('.stat-number, .achieve-number');
    if (!counters.length) return;

    function animateCounter(el) {
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      if (prefersReducedMotion) {
        el.textContent = target + suffix;
      } else {
        requestAnimationFrame(tick);
      }
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      }),
      { threshold: 0.5 }
    );
    counters.forEach((c) => io.observe(c));
  })();

  (function initSkillDots() {
    const cards = document.querySelectorAll('.skill-card');
    const group = document.querySelector('.skills-groups');
    if (!cards.length || !group) return;

    const TOTAL_DOTS = 9;

    cards.forEach((card) => {
      const percent = parseInt(card.dataset.percent, 10) || 0;
      const targetIndex = Math.min(TOTAL_DOTS, Math.max(1, Math.round((percent / 100) * TOTAL_DOTS)));
      card.dataset.targetIndex = targetIndex;

      const dotsWrap = card.querySelector('.skill-dots');
      if (!dotsWrap) return;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < TOTAL_DOTS; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        frag.appendChild(dot);
      }
      dotsWrap.appendChild(frag);
    });

    function setCardState(card, filledCount) {
      const target = parseInt(card.dataset.targetIndex, 10);
      const dots = card.querySelectorAll('.dot');
      dots.forEach((dot, i) => {
        const idx = i + 1;
        dot.classList.remove('is-filled', 'is-marker');
        if (idx < filledCount) dot.classList.add('is-filled');
        else if (idx === filledCount && filledCount > 0) dot.classList.add('is-marker');
      });
      if (filledCount >= target) {
        dots.forEach((dot, i) => {
          const idx = i + 1;
          dot.classList.remove('is-filled', 'is-marker');
          if (idx < target) dot.classList.add('is-filled');
          else if (idx === target) dot.classList.add('is-marker');
        });
      }
    }

    let hasRun = false;
    function runLoader() {
      if (hasRun) return;
      hasRun = true;

      if (prefersReducedMotion) {
        cards.forEach((card) => setCardState(card, parseInt(card.dataset.targetIndex, 10)));
        return;
      }

      const duration = 1100;
      const start = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        cards.forEach((card) => {
          const target = parseInt(card.dataset.targetIndex, 10);
          const current = Math.round(eased * target);
          setCardState(card, current);
        });
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) {
      runLoader();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) runLoader(); }),
      { threshold: 0.3 }
    );
    io.observe(group);
  })();

  (function initProjectsTrack() {
    const wrap = document.querySelector('.projects-track-wrap');
    const track = document.getElementById('projectsTrack');
    const prevBtn = document.getElementById('projPrev');
    const nextBtn = document.getElementById('projNext');
    if (!wrap || !track) return;

    function cardStep() {
      const card = track.querySelector('.project-card');
      return card ? card.getBoundingClientRect().width + 28 : 400;
    }

    nextBtn && nextBtn.addEventListener('click', () => {
      wrap.scrollBy({ left: cardStep(), behavior: 'smooth' });
    });
    prevBtn && prevBtn.addEventListener('click', () => {
      wrap.scrollBy({ left: -cardStep(), behavior: 'smooth' });
    });

    wrap.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        wrap.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });

    let isDown = false, startX = 0, scrollStart = 0;
    wrap.addEventListener('mousedown', (e) => {
      isDown = true; startX = e.pageX; scrollStart = wrap.scrollLeft;
    });
    window.addEventListener('mouseup', () => { isDown = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      wrap.scrollLeft = scrollStart - (e.pageX - startX);
    });

    if (!isTouch && !prefersReducedMotion) {
      track.querySelectorAll('.project-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `perspective(900px) rotateY(${px * 4}deg) rotateX(${py * -4}deg)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
      });
    }
  })();

  (function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  })();

  (function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const submitBtn = form.querySelector('.btn-submit');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      submitBtn.classList.add('is-sent');
      submitBtn.disabled = true;
      setTimeout(() => {
        form.reset();
        submitBtn.classList.remove('is-sent');
        submitBtn.disabled = false;
      }, 2600);
    });
  })();

})();
