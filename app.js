export const S4_CONFIG = { eventName: 'Hack with GDG S4', organizer: 'GDG On Campus KSRCE', venue: 'K.S.R. College of Engineering, Tiruchengode, Tamil Nadu', eventStart: '2026-10-08T09:00:00+05:30', eventEnd: '2026-10-10T18:00:00+05:30', contactEmail: 'gdg@ksrce.ac.in', registrationState: 'coming soon' };

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  const setMenu = (open) => {
    mobileNav?.classList.toggle('open', open);
    mobileNav?.setAttribute('aria-hidden', String(!open));
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  menuToggle?.addEventListener('click', () => setMenu(!mobileNav?.classList.contains('open')));
  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  const targetDate = new Date(S4_CONFIG.eventStart).getTime();
  const updateCountdown = () => {
    const remaining = Math.max(0, targetDate - Date.now());
    const values = { days: Math.floor(remaining / 86400000), hours: Math.floor((remaining / 3600000) % 24), minutes: Math.floor((remaining / 60000) % 60), seconds: Math.floor((remaining / 1000) % 60) };
    Object.entries(values).forEach(([id, value]) => { const element = document.getElementById(id); if (element) element.textContent = String(value).padStart(2, '0'); });
  };
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
});
