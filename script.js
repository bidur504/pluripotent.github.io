// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Close the menu after tapping a link (mobile)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll-reveal
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Show more / less for mentor & mentee galleries
document.querySelectorAll('.show-more').forEach((btn) => {
  const gallery = document.getElementById(btn.dataset.target);
  if (!gallery) return;
  const label = btn.textContent.replace(/^Show more/, '').trim(); // "mentors" / "mentees"
  btn.addEventListener('click', () => {
    const expanded = gallery.classList.toggle('expanded');
    btn.setAttribute('aria-expanded', String(expanded));
    btn.textContent = (expanded ? 'Show fewer ' : 'Show more ') + label;
  });
});

// Current year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
