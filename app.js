export const S4_CONFIG = {
  eventName: 'Hack with GDG S4',
  organizer: 'GDG On Campus KSRCE',
  venue: 'K.S.R. College of Engineering, Tiruchengode, Tamil Nadu',
  eventStart: '2026-10-08T09:00:00+05:30',
  eventEnd: '2026-10-10T18:00:00+05:30',
  ideationDeadline: 'September 28, 2026',
  contactEmail: 'gdg@ksrce.ac.in',
  registrationState: 'coming soon',
  timeline: [
    { date: 'SEPTEMBER 28, 2026', title: 'IDEATION SUBMISSION DEADLINE' },
    { date: 'OCTOBER 8, 2026', title: '36-HOUR HACKATHON BEGINS' },
    { date: 'OCTOBER 9, 2026', title: 'BUILD • MENTOR • COLLABORATE' },
    { date: 'OCTOBER 10, 2026', title: 'FINAL DEMO • JUDGING • CLOSING' },
  ],
  devfolioUrl: null,
};

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

  const label = document.getElementById('countdown-label');
  const ids = ['days', 'hours', 'minutes', 'seconds'];
  const updateCountdown = () => {
    const now = Date.now();
    const start = new Date(S4_CONFIG.eventStart).getTime();
    const end = new Date(S4_CONFIG.eventEnd).getTime();
    const isBefore = now < start;
    const isDuring = now >= start && now < end;
    if (label) label.textContent = isBefore ? 'THE BUILD BEGINS IN' : isDuring ? 'HACK WITH GDG S4 IS LIVE' : 'HACK WITH GDG S4 — THANK YOU, BUILDERS';
    const remaining = Math.max(0, (isBefore ? start : end) - now);
    const values = [Math.floor(remaining / 86400000), Math.floor((remaining / 3600000) % 24), Math.floor((remaining / 60000) % 60), Math.floor((remaining / 1000) % 60)];
    ids.forEach((id, index) => { const element = document.getElementById(id); if (element) element.textContent = String(values[index]).padStart(2, '0'); });
  };
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  const journey = document.querySelector('.journey');
  const progression = document.querySelectorAll('.progression span');
  if (journey && progression.length) {
    const journeyObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) progression.forEach((item, index) => window.setTimeout(() => item.classList.add('active'), index * 180)); }), { threshold: 0.3 });
    journeyObserver.observe(journey);
  }
  const timeline = document.querySelector('.timeline');
  const timelineItems = [...document.querySelectorAll('.timeline-item')];
  S4_CONFIG.timeline.forEach((milestone, index) => {
    const item = timelineItems[index];
    if (!item) return;
    const date = item.querySelector('time');
    const title = item.querySelector('h3');
    if (date) date.textContent = milestone.date;
    if (title) title.textContent = milestone.title;
  });
  const timelineFill = document.querySelector('.timeline-track span');
  if (timeline && timelineItems.length && timelineFill) {
    const updateTimeline = () => {
      const bounds = timeline.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.72 - bounds.top) / bounds.height));
      timelineFill.style.height = `${progress * 100}%`;
      timelineItems.forEach((item, index) => {
        const itemProgress = (index + 0.5) / timelineItems.length;
        item.classList.toggle('revealed', progress >= itemProgress);
      });
    };
    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();
  }

  const hero = document.querySelector('.hero');
  const heroArt = document.querySelector('.hero-art');
  if (hero && heroArt && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.addEventListener('pointermove', (event) => { const bounds = hero.getBoundingClientRect(); heroArt.style.setProperty('--parallax-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 10}px`); heroArt.style.setProperty('--parallax-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * 8}px`); });
    hero.addEventListener('pointerleave', () => { heroArt.style.setProperty('--parallax-x', '0px'); heroArt.style.setProperty('--parallax-y', '0px'); });
  }
});

if (typeof window !== 'undefined') window.S4_CONFIG = S4_CONFIG;
if (typeof module !== 'undefined') module.exports = { S4_CONFIG };
