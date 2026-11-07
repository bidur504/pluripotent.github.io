const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Toast ---------- */
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 3200);
}

// Links that have no destination yet explain themselves instead of jumping to the top.
document.querySelectorAll('[data-soon]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showToast(link.dataset.soon);
  });
});

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
const header = document.querySelector('.site-header');

function setNavOpen(open) {
  nav.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  updateScrollUI();
}

navToggle.addEventListener('click', () => setNavOpen(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setNavOpen(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setNavOpen(false);
    navToggle.focus();
  }
});

/* ---------- Theme ---------- */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const darkQuery = matchMedia('(prefers-color-scheme: dark)');

function labelThemeToggle() {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  themeToggle.setAttribute('aria-label', `Switch to ${next} theme`);
}
labelThemeToggle();

themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  labelThemeToggle();
  try { localStorage.setItem('pf-theme', root.dataset.theme); } catch (e) { /* not saved; still applies now */ }
});

// Follow the OS setting until the visitor has made a choice.
darkQuery.addEventListener('change', (event) => {
  let saved = null;
  try { saved = localStorage.getItem('pf-theme'); } catch (e) { /* treated as no choice */ }
  if (saved) return;
  root.dataset.theme = event.matches ? 'dark' : 'light';
  labelThemeToggle();
});

/* ---------- Scroll: progress bar, header state, back-to-top ---------- */
const progressEl = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');
let scrollQueued = false;

function updateScrollUI() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressEl.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  header.classList.toggle('is-solid', y > 40 || nav.classList.contains('open'));
  toTop.classList.toggle('is-visible', y > window.innerHeight);
}

window.addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    updateScrollUI();
    scrollQueued = false;
  });
}, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

/* ---------- Scrollspy with sliding underline ---------- */
const navLinks = [...nav.querySelectorAll('a:not(.btn)')];
const indicator = document.getElementById('navIndicator');

function moveIndicator() {
  const current = nav.querySelector('a[aria-current]');
  indicator.style.opacity = current ? '1' : '0';
  if (current) {
    indicator.style.transform = `translateX(${current.offsetLeft}px) scaleX(${current.offsetWidth})`;
  }
}

const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const link = navLinks.find((a) => a.getAttribute('href') === `#${entry.target.id}`);
    if (entry.isIntersecting) {
      navLinks.forEach((a) => a.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
  moveIndicator();
}, { rootMargin: '-25% 0px -70% 0px' });

navLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute('href'));
  if (section) spy.observe(section);
});
window.addEventListener('resize', moveIndicator);

/* ---------- Scroll reveal, staggered among siblings ---------- */
const revealEls = document.querySelectorAll('.reveal');
revealEls.forEach((el) => {
  const siblings = [...el.parentElement.children].filter((child) => child.classList.contains('reveal'));
  el.style.setProperty('--i', Math.min(siblings.indexOf(el), 6));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('is-visible');
    revealObserver.unobserve(el);
    // Drop the class afterwards so its slow transition doesn't override hover effects.
    setTimeout(() => {
      el.classList.remove('reveal', 'is-visible');
    }, 1300);
  });
}, { threshold: 0.1 });
revealEls.forEach((el) => revealObserver.observe(el));

/* ---------- Pointer glow on cards ---------- */
document.querySelectorAll('.spot').forEach((el) => {
  el.addEventListener('pointermove', (event) => {
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    el.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }, { passive: true });
});

/* ---------- Stat counters ---------- */
function runCounter(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsEl = document.getElementById('stats');
if (statsEl && !reducedMotion) {
  const counters = statsEl.querySelectorAll('[data-count]');
  counters.forEach((el) => { el.textContent = `0${el.dataset.suffix || ''}`; });
  const statsObserver = new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    counters.forEach(runCounter);
    observer.disconnect();
  }, { threshold: 0.4 });
  statsObserver.observe(statsEl);
}

/* ---------- Hero rotating word ---------- */
const rotator = document.getElementById('rotator');
if (rotator && !reducedMotion) {
  const words = [...rotator.children];
  let active = 0;
  setInterval(() => {
    if (document.hidden) return;
    const previous = words[active];
    active = (active + 1) % words.length;
    previous.classList.remove('is-active');
    previous.classList.add('is-leaving');
    words[active].classList.add('is-active');
    setTimeout(() => previous.classList.remove('is-leaving'), 500);
  }, 2400);
}

/* ---------- Mentor filter ---------- */
const mentorGrid = document.getElementById('mentorGrid');
if (mentorGrid) {
  const COLLAPSED_COUNT = 12;
  const cards = [...mentorGrid.children];
  const filters = [...document.querySelectorAll('#mentorFilters .filter')];
  const moreBtn = document.getElementById('mentorMore');
  let activeFilter = 'all';
  let expanded = false;

  function renderMentors() {
    const matches = cards.filter((card) => activeFilter === 'all' || card.dataset.group === activeFilter);
    const shown = expanded ? matches : matches.slice(0, COLLAPSED_COUNT);
    cards.forEach((card) => {
      const show = shown.includes(card);
      card.classList.toggle('is-new', show && card.hidden);
      card.hidden = !show;
    });
    moreBtn.hidden = matches.length <= COLLAPSED_COUNT;
    moreBtn.setAttribute('aria-expanded', String(expanded));
    moreBtn.textContent = expanded ? 'Show fewer mentors' : `Show all ${matches.length} mentors`;
  }

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      expanded = false;
      filters.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      renderMentors();
    });
  });
  moreBtn.addEventListener('click', () => {
    expanded = !expanded;
    renderMentors();
  });
  renderMentors();
}

/* ---------- Copy email ---------- */
const copyEmail = document.getElementById('copyEmail');
if (copyEmail) {
  copyEmail.addEventListener('click', async () => {
    const { email } = copyEmail.dataset;
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email address copied.');
    } catch (e) {
      showToast(`Couldn't copy automatically. The address is ${email}`);
    }
  });
}

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
