/* ============================================================
   URBAN CRUST — SHARED BRAND SCRIPT
   Preloader, nav, scroll reveal, floating buttons, toast.
============================================================ */
(function(){
  // Modern preloader (auto-upgrades every page)
  const pre = document.getElementById('preloader');
  let loadDone = false, pct = 0;
  if (pre) {
    pre.className = 'uc-loader';
    pre.innerHTML = '<div class="ld-stage"><div class="ld-ring"></div><div class="ld-ring r2"></div>' +
      '<div class="ld-orbit"><i class="fas fa-pizza-slice"></i><i class="fas fa-burger"></i><i class="fas fa-drumstick-bite"></i><i class="fas fa-ice-cream"></i></div>' +
      '<img class="ld-logo" src="images/logo.png" alt="Urban Crust"></div>' +
      '<div class="ld-word">Urban <span>Crust</span></div><div class="ld-msg" id="ldMsg">Heating the oven…</div>' +
      '<div class="ld-bar"><i id="ldFill"></i></div><div class="ld-pct" id="ldPct">0%</div>';
    const msgs = ['Heating the oven…','Stretching the dough…','Frying the crunch…','Melting the cheese…','Plating your order…'];
    const fill = document.getElementById('ldFill'), pt = document.getElementById('ldPct'), mg = document.getElementById('ldMsg');
    const t = setInterval(() => {
      pct += loadDone ? 12 : Math.max(1, (88 - pct) * 0.07);
      if (pct >= 100) { pct = 100; clearInterval(t); setTimeout(() => { pre.classList.add('hide'); document.body.classList.add('is-loaded'); }, 350); }
      fill.style.width = pct + '%'; pt.textContent = Math.floor(pct) + '%';
      mg.textContent = msgs[Math.min(msgs.length - 1, Math.floor(pct / 20))];
    }, 60);
    window.addEventListener('load', () => { loadDone = true; });
    setTimeout(() => { loadDone = true; }, 4000);
  }

  // Scroll progress bar
  const bar = document.createElement('div'); bar.className = 'scroll-progress'; document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
  }, { passive: true });

  // Mobile nav toggle
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    }));
  }

  // Navbar scrolled state
  const navWrap = document.getElementById('navWrap');
  const fabTop = document.getElementById('fabTop');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (navWrap) navWrap.classList.toggle('scrolled', y > 30);
    if (fabTop) fabTop.classList.toggle('visible', y > 400);
  }, { passive: true });

  if (fabTop) {
    fabTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal, .reveal-zoom, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('in'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.done) {
          entry.target.dataset.done = '1';
          const target = parseFloat(entry.target.dataset.count);
          const suffix = entry.target.dataset.suffix || '';
          let cur = 0;
          const step = Math.max(target / 60, 0.1);
          const tick = () => {
            cur += step;
            if (cur >= target) { entry.target.textContent = target.toLocaleString() + suffix; return; }
            entry.target.textContent = Math.floor(cur).toLocaleString() + suffix;
            requestAnimationFrame(tick);
          };
          tick();
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  }

  // Tilt effect on cards with .tilt
  const tiltEls = document.querySelectorAll('.tilt');
  if (window.matchMedia('(pointer:fine)').matches) {
    tiltEls.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // Lightbox (simple)
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = document.getElementById('lightboxImg');
    document.querySelectorAll('[data-lightbox]').forEach(el => {
      el.addEventListener('click', () => {
        lbImg.src = el.dataset.lightbox;
        lightbox.classList.add('show');
      });
    });
    lightbox.addEventListener('click', () => lightbox.classList.remove('show'));
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox) lightbox.classList.remove('show');
  });
})();

// Toast helper (shared)
function ucToast(message, icon) {
  let toast = document.getElementById('ucToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ucToast';
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${icon || 'fa-check-circle'}"></i><span id="ucToastText"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('#ucToastText').textContent = message;
  toast.querySelector('i').className = `fas ${icon || 'fa-check-circle'}`;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}
