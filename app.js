export const S4_CONFIG = { eventName: 'Hack with GDG S4', organizer: 'GDG On Campus KSRCE', venue: 'K.S.R. College of Engineering, Tiruchengode, Tamil Nadu', eventStart: '2026-10-08T09:00:00+05:30', eventEnd: '2026-10-10T18:00:00+05:30', contactEmail: 'gdg@ksrce.ac.in', registrationState: 'coming soon', devfolioUrl: null };

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
  const navLinks = [...document.querySelectorAll('.desktop-nav a[data-section], .mobile-nav a[data-section]')];
  const setActiveSection = (id) => navLinks.forEach((link) => {
    const active = link.dataset.section === id;
    link.classList.toggle('active', active);
    link.setAttribute('aria-current', active ? 'true' : 'false');
  });
  const sections = [...document.querySelectorAll('main section[id]')];
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveSection(visible.target.id);
  }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.3, 0.6] });
  sections.forEach((section) => sectionObserver.observe(section));

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (link.matches('[data-devfolio-cta]') && !S4_CONFIG.devfolioUrl) {
      event.preventDefault();
      window.alert('Devfolio applications will open soon. The official link will be shared here.');
      return;
    }
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  document.querySelectorAll('[data-devfolio-cta]').forEach((link) => { if (S4_CONFIG.devfolioUrl) link.href = S4_CONFIG.devfolioUrl; });

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
