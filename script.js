/* ============================================================
   ABHISHEK KUMAR — PREMIUM FUTURISTIC PORTFOLIO
   script.js — complete JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ==================== SHORTCUTS ==================== */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const isMobile = () => window.innerWidth < 768;

  /* ==================== 1. PRELOADER ==================== */
  const preloader = $('#preloader');

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('hidden');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 700);
  }

  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 2200); // safety fallback

  /* ==================== 2. DYNAMIC YEAR IN FOOTER ==================== */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ==================== 3. CUSTOM CURSOR ==================== */
  const cursorDot = $('#cursorDot');
  const cursorOutline = $('#cursorOutline');

  if (cursorDot && cursorOutline && !isTouchDevice && !prefersReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX, dotY = mouseY;
    let outlineX = mouseX, outlineY = mouseY;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
    });

    (function animateCursor() {
      dotX += (mouseX - dotX) * 0.9;
      dotY += (mouseY - dotY) * 0.9;
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;

      cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animateCursor);
    })();

    const hoverTargets =
      'a, button, .btn, .skill-card, .project-card, .certificate-card, .hobby-card, .social-card, .contact-card, .nav-link, .nav-toggle, input, textarea';
    $$(hoverTargets).forEach((el) => {
      el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
  } else {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorOutline) cursorOutline.style.display = 'none';
    document.body.style.cursor = 'auto';
  }

  /* ==================== 4. SCROLL PROGRESS BAR ==================== */
  const scrollProgress = $('#scrollProgress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = percent + '%';
  }

  /* ==================== 5. NAVBAR SCROLL EFFECT ==================== */
  const header = $('#header');

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }

  /* ==================== 6. MOBILE MENU ==================== */
  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');

  function closeMobileMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.classList.contains('active')) return;
      if (navMenu.contains(e.target) || navToggle.contains(e.target)) return;
      closeMobileMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMobileMenu();
    });
  }

  /* ==================== 7. SMOOTH SCROLL ==================== */
  const getNavHeight = () => {
    const h = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
    const n = parseInt(h, 10);
    return isNaN(n) ? 78 : n;
  };

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      closeMobileMenu();

      const top = target.getBoundingClientRect().top + window.pageYOffset - getNavHeight() + 2;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });

      if (history.pushState) history.pushState(null, '', href);
    });
  });

  /* ==================== 8. ACTIVE NAV LINK ON SCROLL ==================== */
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  function updateActiveNavLink() {
    if (!sections.length || !navLinks.length) return;
    const scrollPos = window.scrollY + getNavHeight() + 60;
    let currentId = '';
    sections.forEach((sec) => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  /* ==================== 9. SCROLL EVENT (rAF throttled) ==================== */
  let scrollTicking = false;
  function onScroll() {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateScrollProgress();
        updateHeader();
        updateActiveNavLink();
        updateBackToTop();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  updateScrollProgress();
  updateHeader();
  updateActiveNavLink();

  /* ==================== 10. TYPEWRITER ==================== */
  const typedTextEl = $('#typedText');
  const roles = ['CSE Student', 'B.Tech CSE', 'Web Developer', 'Coder', 'Creative Thinker'];

  if (typedTextEl) {
    if (!prefersReducedMotion) {
      let roleIndex = 0, charIndex = 0, isDeleting = false, speed = 100;

      (function typeLoop() {
        const current = roles[roleIndex];
        if (isDeleting) {
          typedTextEl.textContent = current.substring(0, charIndex - 1);
          charIndex--;
          speed = 45;
        } else {
          typedTextEl.textContent = current.substring(0, charIndex + 1);
          charIndex++;
          speed = 110;
        }
        if (!isDeleting && charIndex === current.length) {
          speed = 1600;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          speed = 400;
        }
        setTimeout(typeLoop, speed);
      })();
    } else {
      typedTextEl.textContent = roles[0];
    }
  }

  /* ==================== 11. NUMBER COUNTER ==================== */
  const statNumbers = $$('.stat-number');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count') || '0', 10);
    if (isNaN(target) || target <= 0) {
      el.textContent = '0';
      return;
    }
    if (prefersReducedMotion) {
      el.textContent = String(target);
      return;
    }
    const duration = 1500;
    const startTime = performance.now();

    (function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    })(performance.now());
  }

  /* ==================== 12. REVEAL + SKILL BARS + COUNTERS ==================== */
  const revealEls = $$('.reveal');
  const skillBars = $$('.skill-bar span');

  function activateSkillBar(bar) {
    const width = bar.getAttribute('data-width') || '0%';
    bar.style.width = width;
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activateSkillBar(entry.target);
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    skillBars.forEach((bar) => skillObserver.observe(bar));

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach((el) => counterObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('active'));
    skillBars.forEach(activateSkillBar);
    statNumbers.forEach((el) => (el.textContent = el.getAttribute('data-count') || '0'));
  }

  /* ==================== 13. BACK TO TOP ==================== */
  const backToTop = $('#backToTop');

  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('show', window.scrollY > 400);
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ==================== 14. HERO IMAGE PARALLAX ==================== */
  const heroVisual = $('.hero-visual');
  const heroImage = $('.hero-image');

  if (
    heroVisual &&
    heroImage &&
    !isTouchDevice &&
    !prefersReducedMotion &&
    window.innerWidth > 900
  ) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });

    (function animateParallax() {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      const tx = currentX * 14;
      const ty = currentY * 14;
      const ry = currentX * 8;
      const rx = -currentY * 8;

      heroImage.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;

      const badges = $$('.floating-badge', heroVisual);
      badges.forEach((badge, i) => {
        const depth = (i + 1) * 6;
        badge.style.transform = `translate3d(${-currentX * depth}px, ${-currentY * depth}px, 0)`;
      });

      requestAnimationFrame(animateParallax);
    })();
  }

  /* ==================== 15. CONTACT FORM ==================== */
  const contactForm = $('#contactForm');
  const formStatus = $('#formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = ($('#name')?.value || '').trim();
      const email = ($('#email')?.value || '').trim();
      const subject = ($('#subject')?.value || '').trim();
      const message = ($('#message')?.value || '').trim();

      if (!name || !email || !subject || !message) {
        if (formStatus) {
          formStatus.textContent = '⚠️ Please fill in all the fields.';
          formStatus.className = 'form-status error';
        }
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (formStatus) {
          formStatus.textContent = '⚠️ Please enter a valid email address.';
          formStatus.className = 'form-status error';
        }
        return;
      }

      if (formStatus) {
        formStatus.textContent = '📨 Sending your message...';
        formStatus.className = 'form-status';
      }

      setTimeout(() => {
        const mailto =
          `mailto:guptaabhishek63501@gmail.com` +
          `?subject=${encodeURIComponent(subject)}` +
          `&body=${encodeURIComponent(`Hi Abhishek,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
        window.location.href = mailto;

        if (formStatus) {
          formStatus.textContent = '✅ Opening your email app to send the message...';
          formStatus.className = 'form-status success';
        }

        setTimeout(() => {
          contactForm.reset();
          if (formStatus) {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
          }
        }, 2500);
      }, 600);
    });

    $$('.form-input', contactForm).forEach((input) => {
      input.addEventListener('input', () => {
        if (formStatus && formStatus.classList.contains('error')) {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }
      });
    });
  }

  /* ==================== 16. PARTICLE BACKGROUND ==================== */
  (function initParticles() {
    if (prefersReducedMotion) return;

    const isSmallScreen = window.innerWidth < 768;
    const particleCount = isSmallScreen ? 18 : 42;

    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;opacity:0.55;';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      particles = [];
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 0.8,
          hue: Math.random() > 0.5 ? 265 : 190
        });
      }
    }

    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, 0.8)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, 0.9)`;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      const maxDist = isSmallScreen ? 90 : 130;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const alpha = 1 - distSq / maxDistSq;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.28})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    function start() {
      resize();
      createParticles();
      if (animationId) cancelAnimationFrame(animationId);
      draw();
    }

    function stop() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        createParticles();
      }, 250);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    start();
  })();

  /* ==================== 17. MAGNETIC BUTTONS ==================== */
  if (!isTouchDevice && !prefersReducedMotion) {
    const magneticBtns = $$('.btn-primary, .btn-nav, .back-to-top');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px) translateY(-3px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ==================== 18. SUBTLE 3D TILT ON CARDS ==================== */
  if (!isTouchDevice && !prefersReducedMotion && window.innerWidth > 900) {
    const tiltCards = $$('.project-card, .skill-card, .certificate-card, .hobby-card');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rx = -y * 4;
        const ry = x * 4;
        card.style.transform = `translateY(-8px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ==================== 19. CERTIFICATE & ACHIEVEMENT IMAGE → OPEN IN NEW TAB ==================== */
  // Make certificate images clickable (open original in new tab) — no HTML change needed
  (function enableCertificateClicks() {
    const certImages = $$('.certificate-image');
    certImages.forEach((img) => {
      // Accessible
      img.style.cursor = 'zoom-in';
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.setAttribute('title', 'Click to view full certificate');

      const openImage = () => {
        const src = img.getAttribute('src');
        if (!src) return;
        window.open(src, '_blank', 'noopener,noreferrer');
      };

      img.addEventListener('click', openImage);
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openImage();
        }
      });
    });
  })();

  /* ==================== 20. "VIEW CERTIFICATE" DYNAMIC BUTTON ==================== */
  // Add a "View Certificate" button to each certificate card
  // (Only if HTML doesn't already have one — we don't replace existing content)
  (function addViewCertificateButtons() {
    const cards = $$('.certificate-card');
    cards.forEach((card) => {
      // Skip if button already exists
      if (card.querySelector('.view-cert-btn')) return;

      const img = card.querySelector('.certificate-image');
      if (!img) return;
      const src = img.getAttribute('src');
      if (!src) return;

      const info = card.querySelector('.certificate-info');
      if (!info) return;

      const btn = document.createElement('a');
      btn.className = 'view-cert-btn';
      btn.href = src;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.textContent = 'View Certificate';

      // Inline styling so we don't touch style.css
      btn.style.cssText = `
        display:inline-flex;
        align-items:center;
        gap:8px;
        margin-top:14px;
        padding:10px 20px;
        font-family:'Outfit',sans-serif;
        font-size:0.85rem;
        font-weight:600;
        color:#ffffff;
        background:linear-gradient(135deg,#8b5cf6 0%,#06b6d4 100%);
        border-radius:999px;
        text-decoration:none;
        box-shadow:0 8px 20px rgba(139,92,246,0.4);
        transition:transform 0.3s ease, box-shadow 0.3s ease;
        width:fit-content;
      `;

      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px)';
        btn.style.boxShadow = '0 12px 28px rgba(139,92,246,0.6)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.boxShadow = '0 8px 20px rgba(139,92,246,0.4)';
      });

      info.appendChild(btn);
    });
  })();

  /* ==================== 21. PROJECT CARDS → "VIEW PROJECT" BUTTON ==================== */
  // Add a "View Project" button to each project card.
  // Since we don't have real project URLs yet, we link back to the GitHub profile
  // only if the project truly exists there. Otherwise we open the section anchor.
  // NOTE: No fake URLs — we use your real GitHub profile as the landing place,
  // and you can edit project-specific URLs later by editing the data-project-url attributes below.
  (function addViewProjectButtons() {
    // Map each project card (by index) to a URL.
    // Use empty string '' to open GitHub profile in new tab as a safe default.
    // You can replace these with real project URLs anytime.
    const GITHUB_PROFILE = '';

    const cards = $$('.project-card');
    cards.forEach((card) => {
      if (card.querySelector('.view-project-btn')) return;

      const titleEl = card.querySelector('.project-title');
      const title = titleEl ? titleEl.textContent.trim() : 'Project';

      // Map title → URL (edit these later as per your real projects)
      const projectUrls = {
        'Personal Portfolio Website': '',
        'Trader Utility Calculator': 'https://apexabhi54-cloud.github.io/trader-utility-calculatores/',
        'Abhi quiz portal': 'https://apexabhi54-cloud.github.io/abhi-quiz-portale/',
        'MyGov India': 'https://apexabhi54-cloud.github.io/my-goverment/',
        'Brain Battle Abhi': 'https://brainbattle9.blogspot.com/',
        'Coders world portal': 'https://apexabhi54-cloud.github.io/corder-world-portal/'
      };

      const url = projectUrls[title] && projectUrls[title].length > 0
        ? projectUrls[title]
        : GITHUB_PROFILE;

      const btn = document.createElement('a');
      btn.className = 'view-project-btn';
      btn.href = url;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.textContent = 'View Project';

      btn.style.cssText = `
        display:inline-flex;
        align-items:center;
        gap:8px;
        margin-top:18px;
        padding:11px 24px;
        font-family:'Outfit',sans-serif;
        font-size:0.88rem;
        font-weight:600;
        color:#ffffff;
        background:linear-gradient(135deg,#8b5cf6 0%,#06b6d4 100%);
        border-radius:999px;
        text-decoration:none;
        box-shadow:0 8px 20px rgba(139,92,246,0.4);
        transition:transform 0.3s ease, box-shadow 0.3s ease;
        width:fit-content;
        cursor:pointer;
      `;

      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px)';
        btn.style.boxShadow = '0 12px 28px rgba(139,92,246,0.65)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.boxShadow = '0 8px 20px rgba(139,92,246,0.4)';
      });

      card.appendChild(btn);
    });
  })();

  /* ==================== 22. RESUME DOWNLOAD — SAFE HANDLING ==================== */
  // The HTML already has an <a download> tag. This block just ensures
  // that clicking it never breaks the page (e.g., stops propagation).
  $$('a[download]').forEach((link) => {
    link.addEventListener('click', (e) => {
      // Let the browser handle the download normally — just stop bubbling.
      e.stopPropagation();
    });
  });

  /* ==================== 23. INITIAL POST-LOAD REVEAL REFRESH ==================== */
  window.addEventListener('load', () => {
    onScroll();

    setTimeout(() => {
      revealEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) el.classList.add('active');
      });
    }, 120);
  });

  /* ==================== 24. SCROLL RESTORATION ==================== */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
})();