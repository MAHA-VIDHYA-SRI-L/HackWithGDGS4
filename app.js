/**
 * ==========================================================================
 * HACK WITH GDG S4 - APPLICATION LOGIC & INTERACTIVE SYSTEMS
 * ==========================================================================
 */

/**
 * Centralized Editable Event Configuration (Placeholders for easy customization)
 */
export const S4_CONFIG = {
  eventName: "Hack with GDG S4",
  organizer: "GDG On Campus KSRCE",
  venue: "K.S.R. College of Engineering, Tiruchengode, Tamil Nadu",
  datesPlaceholder: "Official Dates Announced Soon (2026)",
  registrationUrl: "https://devfolio.co",
  contactEmail: "gdg@ksrce.ac.in",
  stats: {
    hackers: 400,
    teams: 100,
    hours: 36
  },
  prizes: {
    winner: "TO BE ANNOUNCED",
    runnerUp: "TO BE ANNOUNCED",
    secondRunnerUp: "TO BE ANNOUNCED"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initAppConfig();
  initNavigation();
  initInteractiveCanvas();
  initStatsCounter();
  initTrackExplorer();
  initTimelineProgress();
  initVenueModal();
  initSmoothScroll();
  initLivingBackground();
  initMotionReveals();
});

/**
 * 1. Initialize placeholders from configuration
 */
function initAppConfig() {
  const dateEl = document.getElementById('heroDatePlaceholder');
  if (dateEl) dateEl.textContent = S4_CONFIG.datesPlaceholder;

  const prize1 = document.getElementById('prizeVal1');
  const prize2 = document.getElementById('prizeVal2');
  const prize3 = document.getElementById('prizeVal3');
  
  if (prize1) prize1.textContent = S4_CONFIG.prizes.winner;
  if (prize2) prize2.textContent = S4_CONFIG.prizes.runnerUp;
  if (prize3) prize3.textContent = S4_CONFIG.prizes.secondRunnerUp;
}

/**
 * 2. Sticky Navbar & Mobile Drawer Navigation
 */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta-btn');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Open mobile menu
  function openMobileMenu() {
    mobileMenu?.classList.add('open');
    mobileMenu?.setAttribute('aria-hidden', 'false');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  // Close mobile menu
  function closeMobileMenu() {
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn?.addEventListener('click', openMobileMenu);
  closeMenuBtn?.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
      closeMobileMenu();
    }
  });
}

/**
 * 3. Hero Section Canvas - Interactive Developer Node Visual
 * Renders connected nodes representing IDEA -> CODE -> BUILD -> DEMO with mouse reaction
 */
function initInteractiveCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;

  // Mouse / Touch tracking state
  const mouse = {
    x: -1000,
    y: -1000,
    radius: 120
  };

  function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth - 32; // padding subtraction
    canvas.height = 340;
    width = canvas.width;
    height = canvas.height;
    initNodes();
  }

  // Define four core pipeline stages
  const stages = [
    { label: "01 IDEA", color: "#4285F4" },   // Google Blue
    { label: "02 CODE", color: "#EA4335" },   // Google Red
    { label: "03 BUILD", color: "#FBBC04" },  // Google Yellow
    { label: "04 DEMO", color: "#34A853" }   // Google Green
  ];

  let nodes = [];
  let connections = [];

  class Node {
    constructor(x, y, isStage = false, stageData = null) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = isStage ? 14 : Math.random() * 3 + 2;
      this.isStage = isStage;
      this.stageData = stageData;
      this.color = isStage ? stageData.color : '#BDC1C6';
      this.pulse = Math.random() * Math.PI;
    }

    update() {
      // Floating motion
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.03;

      // Bounce off canvas boundaries
      if (this.x < 20 || this.x > width - 20) this.vx *= -1;
      if (this.y < 20 || this.y > height - 20) this.vy *= -1;

      // Mouse repulsion / attraction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 3;
        this.y -= Math.sin(angle) * force * 3;
      } else {
        // Slowly return to base position if it's a stage node
        if (this.isStage) {
          this.x += (this.baseX - this.x) * 0.05;
          this.y += (this.baseY - this.y) * 0.05;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();

      if (this.isStage) {
        // Ring around stage node
        ctx.beginPath();
        const ringRadius = this.radius + 6 + Math.sin(this.pulse) * 3;
        ctx.arc(this.x, this.y, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Stage text label
        ctx.font = '700 12px "JetBrains Mono", monospace';
        ctx.fillStyle = '#111111';
        ctx.fillText(this.stageData.label, this.x - 24, this.y + 32);
      }
    }
  }

  function initNodes() {
    nodes = [];
    const stageMargin = width / 5;

    // Create 4 main pipeline stage nodes spaced evenly
    stages.forEach((stage, i) => {
      const x = stageMargin * (i + 1);
      const y = height / 2 + (i % 2 === 0 ? -30 : 30);
      nodes.push(new Node(x, y, true, stage));
    });

    // Create supporting background particles
    const particleCount = Math.floor(width / 25);
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * (width - 40) + 20;
      const y = Math.random() * (height - 40) + 20;
      nodes.push(new Node(x, y, false));
    }
  }

  function drawConnections() {
    // Draw main pipeline line between stage nodes
    const stageNodes = nodes.filter(n => n.isStage);
    ctx.beginPath();
    for (let i = 0; i < stageNodes.length - 1; i++) {
      ctx.moveTo(stageNodes[i].x, stageNodes[i].y);
      ctx.lineTo(stageNodes[i + 1].x, stageNodes[i + 1].y);
    }
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]); // Dashed line effect
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Draw proximity lines between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          const alpha = (1 - dist / 90) * 0.3;
          ctx.strokeStyle = `rgba(180, 185, 190, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw subtle grid lines on canvas background
    ctx.strokeStyle = 'rgba(232, 234, 237, 0.6)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    drawConnections();

    // Update and draw all nodes
    nodes.forEach(node => {
      node.update();
      node.draw();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  // Event Listeners for Mouse interaction
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener('resize', resizeCanvas);

  resizeCanvas();
  render();
}

/**
 * 4. Animated Stats Counter (Scroll Triggered)
 */
function initStatsCounter() {
  const statCards = document.querySelectorAll('.stat-card');
  if (!statCards.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.4 });

  statCards.forEach(card => observer.observe(card));

  function animateCounters() {
    const counters = [
      { id: 'statHackers', target: S4_CONFIG.stats.hackers },
      { id: 'statTeams', target: S4_CONFIG.stats.teams },
      { id: 'statHours', target: S4_CONFIG.stats.hours }
    ];

    counters.forEach(c => {
      const el = document.getElementById(c.id);
      if (!el) return;

      const duration = 1600; // ms
      const start = 0;
      const target = c.target;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quadratic
        const currentNumber = Math.floor(start + (target - start) * (1 - (1 - progress) * (1 - progress)));
        el.textContent = currentNumber;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }
}

/**
 * 5. Interactive Editorial Track Explorer
 */
function initTrackExplorer() {
  const trackItems = document.querySelectorAll('.track-item');

  trackItems.forEach(item => {
    const header = item.querySelector('.track-header');
    
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Accordion toggle: deactivate others if desired, or toggle current
      trackItems.forEach(t => t.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * 6. Flowing Path Journey Timeline — Scroll-driven path & milestone activation
 */
function initTimelineProgress() {
  const timelineSection = document.getElementById('timeline');
  const progressPath = document.getElementById('tlProgressPath');
  const milestones = document.querySelectorAll('.tl-milestone');

  if (!timelineSection) return;

  // --- SVG path scroll animation ---
  let pathLength = 0;
  if (progressPath) {
    try {
      pathLength = progressPath.getTotalLength();
      progressPath.style.strokeDasharray = pathLength;
      progressPath.style.strokeDashoffset = pathLength;
    } catch (e) {
      // SVG not in layout yet — ignore
    }
  }

  function updatePathProgress() {
    if (!progressPath || !pathLength) return;
    const rect = timelineSection.getBoundingClientRect();
    const winH = window.innerHeight;
    // progress: 0 when section top enters viewport bottom → 1 when section bottom exits viewport top
    let progress = (winH * 0.65 - rect.top) / rect.height;
    progress = Math.max(0, Math.min(1, progress));
    progressPath.style.strokeDashoffset = pathLength * (1 - progress);
  }

  window.addEventListener('scroll', updatePathProgress, { passive: true });
  updatePathProgress();

  // --- Milestone viewport activation ---
  const milestoneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('tl-active');
      } else {
        // Only deactivate if milestone is still below viewport (not yet scrolled past)
        if (entry.target.getBoundingClientRect().top > window.innerHeight) {
          entry.target.classList.remove('tl-active');
        }
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  milestones.forEach(m => milestoneObserver.observe(m));
}

/**
 * 7. Interactive Map Modal
 */
function initVenueModal() {
  const openModalBtn = document.getElementById('openMapModalBtn');
  const closeModalBtn = document.getElementById('closeMapModalBtn');
  const mapModal = document.getElementById('mapModal');

  function openModal() {
    mapModal?.classList.add('open');
    mapModal?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    mapModal?.classList.remove('open');
    mapModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openModalBtn?.addEventListener('click', openModal);
  closeModalBtn?.addEventListener('click', closeModal);

  mapModal?.addEventListener('click', (e) => {
    if (e.target === mapModal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mapModal?.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * 8. Smooth Scrolling for Internal Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * 9. Subtle Living GDG Background Layer
 */
function initLivingBackground() {
  const bg = document.getElementById('livingGdgBg');
  if (!bg) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const wordLayer = document.createElement('div');
  wordLayer.className = 'gdg-word-layer';
  wordLayer.setAttribute('aria-hidden', 'true');

  const words = [
    { className: 'build', text: 'BUILD', style: { left: '7%', top: '10%' } },
    { className: 'connect', text: 'CONNECT', style: { right: '10%', top: '18%' } },
    { className: 'innovate', text: 'INNOVATE', style: { left: '31%', top: '39%' } },
    { className: 'collaborate', text: 'COLLABORATE', style: { right: '7%', bottom: '12%' } }
  ];

  words.forEach(({ className, text, style }) => {
    const word = document.createElement('span');
    word.className = `gdg-word ${className}`;
    word.textContent = text;

    Object.entries(style).forEach(([property, value]) => {
      word.style[property] = value;
    });

    wordLayer.appendChild(word);
  });

  bg.appendChild(wordLayer);

  if (prefersReducedMotion) return;

  let lastScroll = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const diff = currentScroll - lastScroll;
    lastScroll = currentScroll;
    wordLayer.style.transform = `translate3d(0, ${diff * -0.12}px, 0)`;
  }, { passive: true });
}

function initMotionReveals() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.stat-card, .journey-step-card, .track-item, .feature-box, .organizer-card, .sponsors-group, .footer-panel, .google-tech-item, .intro-text, .intro-quote-container, .hero-text-content, .hero-visual-wrapper').forEach(el => {
      el.classList.add('reveal-visible');
    });
    return;
  }

  const revealTargets = document.querySelectorAll('.intro-text, .intro-quote-container, .stat-card, .journey-step-card, .track-item, .feature-box, .google-tech-item, .organizer-card, .sponsors-group, .footer-panel, .hero-text-content, .hero-visual-wrapper, .track-card, .tech-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px'
  });

  revealTargets.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(index % 6) * 0.08}s`;
    revealObserver.observe(el);
  });
}
