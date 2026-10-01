/* ============================================================
   INOREADER CLONE — app.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ── */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── Mobile Navigation ── */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  let mobileOverlay = null;

  function openMobileNav() {
    mobileNav.classList.add('open');
    // Create overlay
    mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    document.body.appendChild(mobileOverlay);
    setTimeout(() => mobileOverlay.classList.add('visible'), 10);
    mobileOverlay.addEventListener('click', closeMobileNav);
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    if (mobileOverlay) {
      mobileOverlay.classList.remove('visible');
      setTimeout(() => { mobileOverlay && mobileOverlay.remove(); mobileOverlay = null; }, 350);
    }
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', openMobileNav);
  document.getElementById('close-mobile-nav').addEventListener('click', closeMobileNav);

  // Close mobile nav on link clicks
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ── Modal System ── */
  const signinModal = document.getElementById('signin-modal');
  const signupModal = document.getElementById('signup-modal');

  function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open triggers
  document.getElementById('open-signin').addEventListener('click', e => { e.preventDefault(); openModal(signinModal); });
  document.getElementById('hero-signup-btn').addEventListener('click', e => { e.preventDefault(); openModal(signupModal); });
  document.getElementById('cta-signup').addEventListener('click', e => { e.preventDefault(); openModal(signupModal); });

  // The mobile buttons also open modals
  document.querySelectorAll('.mobile-cta').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); closeMobileNav(); openModal(signupModal); });
  });
  document.querySelectorAll('.mobile-signin').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); closeMobileNav(); openModal(signinModal); });
  });

  // Close buttons
  document.getElementById('close-signin').addEventListener('click', () => closeModal(signinModal));
  document.getElementById('close-signup').addEventListener('click', () => closeModal(signupModal));

  // Close on overlay click
  [signinModal, signupModal].forEach(modal => {
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal); });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal(signinModal);
      closeModal(signupModal);
    }
  });

  // Switch between modals
  document.getElementById('switch-to-signup').addEventListener('click', e => {
    e.preventDefault();
    closeModal(signinModal);
    setTimeout(() => openModal(signupModal), 200);
  });
  document.getElementById('switch-to-signin').addEventListener('click', e => {
    e.preventDefault();
    closeModal(signupModal);
    setTimeout(() => openModal(signinModal), 200);
  });

  // Form submissions (demo)
  document.getElementById('signin-form').addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Signing in...';
    btn.style.opacity = '.7';
    setTimeout(() => {
      closeModal(signinModal);
      btn.textContent = 'Sign in';
      btn.style.opacity = '1';
      showToast('Welcome back! Redirecting to your feed...');
    }, 1400);
  });

  document.getElementById('signup-form').addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Creating account...';
    btn.style.opacity = '.7';
    setTimeout(() => {
      closeModal(signupModal);
      btn.textContent = 'Create free account';
      btn.style.opacity = '1';
      showToast('🎉 Account created! Welcome to Inoreader!');
    }, 1600);
  });

  /* ── Toast Notification ── */
  function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(80px);
      background: #111827; color: white; padding: 14px 24px; border-radius: 12px;
      font-family: Inter, sans-serif; font-size: 0.93rem; font-weight: 500;
      box-shadow: 0 8px 32px rgba(0,0,0,.3); z-index: 9999;
      transition: transform .4s cubic-bezier(.34,1.56,.64,1), opacity .4s;
      opacity: 0; white-space: nowrap; max-width: 90vw;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    });
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(80px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* ── Case Studies Carousel ── */
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  const cards = track ? track.querySelectorAll('.case-card') : [];
  const totalCards = cards.length;
  const visibleCards = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  let currentIndex = 0;
  let autoplayTimer = null;

  function maxIndex() {
    return Math.max(0, totalCards - visibleCards());
  }

  // Build dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function getCardWidth() {
    if (!cards.length) return 0;
    const card = cards[0];
    return card.offsetWidth + 20; // 20 = gap
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex()));
    track.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
    updateDots();
    resetAutoplay();
  }

  function goNext() { goTo(currentIndex < maxIndex() ? currentIndex + 1 : 0); }
  function goPrev() { goTo(currentIndex > 0 ? currentIndex - 1 : maxIndex()); }

  if (prevBtn) prevBtn.addEventListener('click', goPrev);
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  function startAutoplay() {
    autoplayTimer = setInterval(goNext, 5000);
  }
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  if (track) {
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
    }, { passive: true });
  }

  buildDots();
  startAutoplay();

  window.addEventListener('resize', () => {
    buildDots();
    goTo(Math.min(currentIndex, maxIndex()));
  });

  /* ── Billing Toggle ── */
  const billingToggle = document.getElementById('billing-toggle');
  const toggleThumb = document.getElementById('toggle-thumb');
  const monthlyLabel = document.getElementById('monthly-label');
  const yearlyLabel = document.getElementById('yearly-label');
  let isYearly = false;

  billingToggle.addEventListener('click', () => {
    isYearly = !isYearly;
    billingToggle.classList.toggle('yearly', isYearly);
    toggleThumb.classList.toggle('yearly', isYearly);

    // Update prices
    document.querySelectorAll('.price-amount[data-monthly]').forEach(el => {
      el.textContent = isYearly ? el.dataset.yearly : el.dataset.monthly;
    });

    // Toggle label weights
    monthlyLabel.style.fontWeight = isYearly ? '400' : '700';
    monthlyLabel.style.color = isYearly ? 'var(--gray-400)' : 'var(--gray-700)';
    yearlyLabel.style.fontWeight = isYearly ? '700' : '400';
    yearlyLabel.style.color = isYearly ? 'var(--gray-700)' : 'var(--gray-500)';
  });

  /* ── Scroll Reveal Animations ── */
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply fade-up to key sections
  const animateTargets = [
    '.hero-content', '.hero-visuals',
    '.feature-row', '.mini-feature-card',
    '.case-card', '.testimonial-card',
    '.pricing-card', '.enterprise-cta',
    '.app-download-text', '.phone-mockup-wrap',
    '.cta-content', '.logos-strip .container',
    '.section-header'
  ];

  animateTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('fade-up');
      el.style.transitionDelay = `${i * 0.07}s`;
      observer.observe(el);
    });
  });

  /* ── Floating Particles ── */
  const particlesContainer = document.getElementById('particles-container');
  if (particlesContainer) {
    const colors = ['#1875F3', '#7c3aed', '#ec4899', '#059669', '#f59e0b'];
    const sizes = [60, 100, 140, 80, 120, 50, 90];

    for (let i = 0; i < 18; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = 12 + Math.random() * 18;
      const delay = -Math.random() * 20;
      const leftPos = Math.random() * 100;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${leftPos}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        filter: blur(${size * 0.4}px);
      `;
      particlesContainer.appendChild(particle);
    }
  }

  /* ── Active Nav Link on Scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-links .nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));

  /* ── Smooth hover ripple on primary buttons ── */
  document.querySelectorAll('.btn-primary, .btn-plan-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position: absolute;
        left: ${e.clientX - rect.left - size/2}px;
        top: ${e.clientY - rect.top - size/2}px;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255,255,255,.25);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple-anim .6s ease-out forwards;
      `;
      if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `@keyframes ripple-anim { to { transform: scale(1); opacity: 0; } }`;
        document.head.appendChild(style);
      }
      const prevPos = this.style.position;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => {
        ripple.remove();
        if (!prevPos) this.style.position = '';
      });
    });
  });

  console.log('%c🗞️ Inoreader Clone', 'color: #1875F3; font-size: 18px; font-weight: bold;');
  console.log('%cBuilt with HTML, CSS & Vanilla JS', 'color: #6b7280; font-size: 12px;');
});
