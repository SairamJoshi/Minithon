import React, { useState, useEffect, useRef } from 'react';
import '../styles/style.css';

// Import images from assets
import heroDesktopApp from '../assets/hero_desktop_app.png';
import heroMobileApp from '../assets/hero_mobile_app.png';
import featureFollowWebsites from '../assets/feature_follow_websites.png';
import featureContentHub from '../assets/feature_content_hub.png';
import featureAutomation from '../assets/feature_automation.png';
import { loginWithGoogle } from '../services/firebase';
import { AUTH } from '../utils/auth';

export default function LandingPage({ onNavigate }) {
  // Navigation / Mobile drawer state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNavSection, setActiveNavSection] = useState('home');

  // Modals state
  const [signinModalOpen, setSigninModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // Billing toggle (Monthly vs Yearly)
  const [isYearly, setIsYearly] = useState(false);

  // Case Studies Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const touchStartXRef = useRef(0);
  const autoplayTimerRef = useRef(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Particles generator
  const [particles] = useState(() => {
    const colors = ['#1875F3', '#7c3aed', '#ec4899', '#059669', '#f59e0b'];
    const sizes = [60, 100, 140, 80, 120, 50, 90];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 12 + Math.random() * 18,
      delay: -Math.random() * 20,
      left: Math.random() * 100,
    }));
  });

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active Nav Link on Scroll
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNavSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  // Scroll Reveal Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const animateTargets = [
      '.hero-content', '.hero-visuals',
      '.feature-row', '.mini-feature-card',
      '.case-card', '.testimonial-card',
      '.pricing-card', '.enterprise-cta',
      '.app-download-text', '.phone-mockup-wrap',
      '.cta-content', '.logos-strip .container',
      '.section-header'
    ];

    animateTargets.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('fade-up');
        el.style.transitionDelay = `${i * 0.07}s`;
        observer.observe(el);
      });
    });

    return () => observer.disconnect();
  }, []);

  // Carousel card width & max index calculations
  const totalCards = 5;
  const getVisibleCards = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };
  const [visibleCount, setVisibleCount] = useState(getVisibleCards());

  useEffect(() => {
    const handleResize = () => {
      const count = getVisibleCards();
      setVisibleCount(count);
      setCarouselIndex((prev) => Math.min(prev, Math.max(0, totalCards - count)));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, totalCards - visibleCount);

  const startAutoplay = () => {
    clearInterval(autoplayTimerRef.current);
    autoplayTimerRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 5000);
  };

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayTimerRef.current);
  }, [maxIndex]);

  const goNext = () => {
    setCarouselIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    startAutoplay();
  };

  const goPrev = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    startAutoplay();
  };

  const goToSlide = (idx) => {
    setCarouselIndex(Math.max(0, Math.min(idx, maxIndex)));
    startAutoplay();
  };

  // Keyboard close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSigninModalOpen(false);
        setSignupModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Button ripple click handler
  const handleRippleClick = (e) => {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position: absolute;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
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
    const prevPos = btn.style.position;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => {
      ripple.remove();
      if (!prevPos) btn.style.position = '';
    });
  };

  // Modal Sign-in Submit
  const handleSigninSubmit = (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      setSigninModalOpen(false);
      showToast('Welcome back! Redirecting to your feed...');
      setTimeout(() => {
        if (onNavigate) onNavigate('reader');
      }, 900);
    }, 1400);
  };

  // Modal Sign-up Submit
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setIsCreatingAccount(true);
    setTimeout(() => {
      setIsCreatingAccount(false);
      setSignupModalOpen(false);
      showToast('🎉 Account created! Welcome to Inoreader!');
      setTimeout(() => {
        if (onNavigate) onNavigate('reader');
      }, 900);
    }, 1600);
  };

  const handleGoogleAuth = async () => {
    try {
      const user = await loginWithGoogle();
      const sessionUser = {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        username: user.email.split('@')[0],
        avatar: (user.displayName?.[0] || user.email[0]).toUpperCase(),
        plan: 'pro',
        joined: new Date().toISOString(),
      };
      AUTH.setSession(sessionUser);
      setSigninModalOpen(false);
      setSignupModalOpen(false);
      showToast('🎉 Signed in with Google! Welcome!');
      setTimeout(() => {
        if (onNavigate) onNavigate('reader');
      }, 500);
    } catch (err) {
      showToast(err.message || 'Google sign in failed');
    }
  };

  // Helper for internal routing
  const navigateTo = (path, e) => {
    if (e) e.preventDefault();
    if (onNavigate) onNavigate(path);
  };

  return (
    <div className="landing-wrapper">
      {/* ===== NAVBAR ===== */}
      <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`} id="site-header">
        <nav className="navbar">
          <a href="#" className="navbar-logo" aria-label="Inoreader Home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <svg width="135" height="29" viewBox="0 0 135 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12.5" cy="12.5" r="12.5" fill="#1875F3" />
              <circle cx="16.25" cy="8.75" r="3.75" fill="white" />
              <text x="31" y="21" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="17" fill="#111827" letterSpacing="-0.5">inoreader</text>
            </svg>
          </a>

          <ul className="navbar-links" id="navbar-links">
            <li><a href="#" className={`nav-link ${activeNavSection === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a></li>
            <li><a href="#features" className={`nav-link ${activeNavSection === 'features' ? 'active' : ''}`}>Features</a></li>
            <li><a href="#enterprise" className={`nav-link ${activeNavSection === 'enterprise' ? 'active' : ''}`}>Enterprise</a></li>
            <li><a href="#pricing" className={`nav-link ${activeNavSection === 'pricing' ? 'active' : ''}`}>Pricing</a></li>
            <li><a href="#blog" className={`nav-link ${activeNavSection === 'blog' ? 'active' : ''}`}>Blog</a></li>
          </ul>

          <div className="navbar-actions">
            <a
              href="/"
              className="btn-signin"
              style={{ borderColor: 'rgba(124, 92, 252, 0.4)', color: '#7c5cfc', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('ekai'); else window.location.href = '/'; }}
              title="Go to EKAI Intelligence Dashboard"
            >
              <span>⚡ EKAI Agent</span>
            </a>
            <a
              href="login.html"
              className="btn-signin"
              id="open-signin"
              onClick={(e) => navigateTo('login', e)}
            >
              Sign in
            </a>
            <a
              href="signup.html"
              className="btn-primary-sm"
              id="open-signup"
              onClick={(e) => navigateTo('signup', e)}
            >
              Create account
            </a>
            <button
              className="hamburger"
              id="hamburger-btn"
              aria-label="Open navigation menu"
              onClick={() => setMobileNavOpen(true)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div
          className="mobile-overlay visible"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <div className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`} id="mobile-nav">
        <button
          className="mobile-nav-close"
          id="close-mobile-nav"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        >
          ✕
        </button>
        <ul>
          <li><a href="#" className="nav-link active" onClick={() => { setMobileNavOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a></li>
          <li><a href="#features" onClick={() => setMobileNavOpen(false)}>Features</a></li>
          <li><a href="#enterprise" onClick={() => setMobileNavOpen(false)}>Enterprise</a></li>
          <li><a href="#pricing" onClick={() => setMobileNavOpen(false)}>Pricing</a></li>
          <li><a href="#blog" onClick={() => setMobileNavOpen(false)}>Blog</a></li>
          <li>
            <a
              href="login.html"
              className="mobile-signin"
              onClick={(e) => { setMobileNavOpen(false); navigateTo('login', e); }}
            >
              Sign in
            </a>
          </li>
          <li>
            <a
              href="signup.html"
              className="mobile-cta"
              onClick={(e) => { setMobileNavOpen(false); navigateTo('signup', e); }}
            >
              Create account
            </a>
          </li>
        </ul>
      </div>

      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="hero-particles" id="particles-container">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                left: `${p.left}%`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                filter: `blur(${p.size * 0.4}px)`,
              }}
            />
          ))}
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1875F3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span>The world's most powerful RSS reader</span>
            </div>
            <h1 className="hero-heading">Build your own<br /><span className="gradient-text">newsfeed</span></h1>
            <p className="hero-subtext">
              With Inoreader, information comes straight to you the minute it's available.
              Follow your favorite websites and creators, collect articles, and discover
              inspiring content from across the web. Filter out the noise and make the most of your time online.
            </p>
            <div className="hero-actions">
              <a
                href="signup.html"
                className="btn-primary btn-xl"
                id="hero-signup-btn"
                onClick={(e) => { handleRippleClick(e); navigateTo('signup', e); }}
              >
                Create free account
              </a>
              <a href="#features" className="btn-outline btn-xl">View features</a>
            </div>
            <div className="hero-trust">
              <div className="trust-item">
                <span className="trust-number">7M+</span>
                <span className="trust-label">Users worldwide</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <span className="trust-number">15</span>
                <span className="trust-label">Years of excellence</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <span className="trust-number">4.8★</span>
                <span className="trust-label">App Store rating</span>
              </div>
            </div>
          </div>
          <div className="hero-visuals">
            <div className="hero-desktop-img">
              <img src={heroDesktopApp} alt="Inoreader Desktop Application" className="desktop-screenshot" />
            </div>
            <div className="hero-mobile-img">
              <img src={heroMobileApp} alt="Inoreader Mobile App" className="mobile-screenshot" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOGOS STRIP ===== */}
      <section className="logos-strip">
        <div className="container">
          <p className="logos-label">Trusted by professionals at</p>
          <div className="logos-track">
            <div className="logo-item">
              <svg width="80" height="24" viewBox="0 0 80 24" fill="none"><text x="0" y="18" fontFamily="Inter" fontWeight="700" fontSize="18" fill="#9ca3af">Microsoft</text></svg>
            </div>
            <div className="logo-item">
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none"><text x="0" y="18" fontFamily="Inter" fontWeight="700" fontSize="18" fill="#9ca3af">Forbes</text></svg>
            </div>
            <div className="logo-item">
              <svg width="80" height="24" viewBox="0 0 80 24" fill="none"><text x="0" y="18" fontFamily="Inter" fontWeight="700" fontSize="18" fill="#9ca3af">Bloomberg</text></svg>
            </div>
            <div className="logo-item">
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none"><text x="0" y="18" fontFamily="Inter" fontWeight="700" fontSize="18" fill="#9ca3af">Reuters</text></svg>
            </div>
            <div className="logo-item">
              <svg width="70" height="24" viewBox="0 0 70 24" fill="none"><text x="0" y="18" fontFamily="Inter" fontWeight="700" fontSize="18" fill="#9ca3af">Deloitte</text></svg>
            </div>
            <div className="logo-item">
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none"><text x="0" y="18" fontFamily="Inter" fontWeight="700" fontSize="18" fill="#9ca3af">Gartner</text></svg>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section" id="features">
        <div className="container">

          {/* Feature Row 1 */}
          <div className="feature-row">
            <div className="feature-img-wrap">
              <div className="feature-img-glow glow-blue"></div>
              <img src={featureFollowWebsites} alt="Follow your favorite websites" className="feature-screenshot animate-float" />
            </div>
            <div className="feature-text">
              <div className="feature-tag">Content Discovery</div>
              <h2>Follow your favorite websites and creators</h2>
              <p>Bring the content that matters to you together and enjoy the best from the web in a single place. RSS, Atom, JSON feeds, social media — all in one unified inbox.</p>
              <ul className="feature-bullets">
                <li>
                  <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Subscribe to any website with an RSS feed
                </li>
                <li>
                  <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Follow YouTube channels and podcasts
                </li>
                <li>
                  <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Monitor newsletters and email digests
                </li>
              </ul>
              <a href="#" className="btn-text-link">Learn more →</a>
            </div>
          </div>

          {/* Feature Row 2 */}
          <div className="feature-row row-reverse">
            <div className="feature-img-wrap">
              <div className="feature-img-glow glow-purple"></div>
              <img src={featureContentHub} alt="Create a one-stop content hub" className="feature-screenshot animate-float-delay" />
            </div>
            <div className="feature-text">
              <div className="feature-tag">Organization</div>
              <h2>Create a one-stop content hub</h2>
              <p>Save items to read later, collect web pages, and manage your reading list with tags. Build a personal knowledge base that grows with you.</p>
              <ul className="feature-bullets">
                <li>
                  <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Smart tags and folders for organization
                </li>
                <li>
                  <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Read later with offline support
                </li>
                <li>
                  <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Sync across all your devices
                </li>
              </ul>
              <a href="#" className="btn-text-link">Learn more →</a>
            </div>
          </div>

          {/* Feature Row 3 */}
          <div className="feature-row">
            <div className="feature-img-wrap">
              <div className="feature-img-glow glow-green"></div>
              <img src={featureAutomation} alt="Save time with powerful automations" className="feature-screenshot animate-float" />
            </div>
            <div className="feature-text">
              <div className="feature-tag">Automation</div>
              <h2>Save time with powerful automations</h2>
              <p>Streamline content discovery and leave out what's irrelevant. You set the rules, Inoreader does the work. From keyword filters to complex conditional rules.</p>
              <ul className="feature-bullets">
                <li>
                  <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Keyword rules and filters
                </li>
                <li>
                  <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Auto-tag and auto-highlight content
                </li>
                <li>
                  <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Integrations with 3,000+ apps via Zapier
                </li>
              </ul>
              <a href="#" className="btn-text-link">Learn more →</a>
            </div>
          </div>

          {/* Feature Row 4 - AI */}
          <div className="feature-row row-reverse ai-row">
            <div className="feature-img-wrap">
              <div className="feature-img-glow glow-ai"></div>
              <div className="ai-demo-card">
                <div className="ai-demo-header">
                  <div className="ai-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 8v4l3 3"/></svg>
                  </div>
                  <span>Inoreader Intelligence</span>
                  <div className="ai-badge">AI Powered</div>
                </div>
                <div className="ai-demo-body">
                  <div className="ai-prompt">Summarize the top 5 AI news articles from this week</div>
                  <div className="ai-response">
                    <div className="ai-typing-dot"></div>
                    <div className="ai-text">
                      <strong>Weekly AI Highlights:</strong><br />
                      1. OpenAI releases new reasoning model with breakthrough capabilities in math...<br />
                      2. Google DeepMind announces protein folding advances reducing drug discovery time by 60%...<br />
                      3. EU AI Act enforcement begins, shaping global tech policies...
                    </div>
                  </div>
                </div>
                <div className="ai-demo-actions">
                  <button className="ai-action-btn" type="button">Ask a question</button>
                  <button className="ai-action-btn" type="button">Generate report</button>
                </div>
              </div>
            </div>
            <div className="feature-text">
              <div className="feature-tag ai-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#7c3aed" stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                AI-Powered
              </div>
              <h2><span className="gradient-text">Inoreader Intelligence</span></h2>
              <p>Harness the power of generative AI to summarize articles, ask questions, execute custom or predefined prompts, and generate reports from multiple articles at once.</p>
              <ul className="feature-bullets">
                <li>
                  <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Instant article summaries and key points
                </li>
                <li>
                  <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Ask questions about your feed content
                </li>
                <li>
                  <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Generate multi-article intelligence reports
                </li>
              </ul>
              <a href="#" className="btn-text-link ai-link">Explore Intelligence →</a>
            </div>
          </div>

        </div>
      </section>

      {/* ===== MINI FEATURES GRID ===== */}
      <section className="mini-features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything you need to master your information</h2>
            <p>A complete toolkit for professionals, researchers, and curious minds</p>
          </div>
          <div className="mini-features-grid">

            <div className="mini-feature-card">
              <div className="mini-feature-icon" style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <h3>Powerful Search</h3>
              <p>Search across all your subscriptions with boolean queries, date filters, and full-text indexing.</p>
            </div>

            <div className="mini-feature-card">
              <div className="mini-feature-icon" style={{ background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              </div>
              <h3>Real-time Alerts</h3>
              <p>Get notified the moment content matching your criteria is published anywhere on the web.</p>
            </div>

            <div className="mini-feature-card">
              <div className="mini-feature-icon" style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <h3>Analytics & Trends</h3>
              <p>Track trending topics and understand reading patterns with built-in analytics dashboards.</p>
            </div>

            <div className="mini-feature-card">
              <div className="mini-feature-icon" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <h3>Multi-platform Apps</h3>
              <p>Native apps for iOS, Android, Mac and a powerful web app — all perfectly in sync.</p>
            </div>

            <div className="mini-feature-card">
              <div className="mini-feature-icon" style={{ background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <h3>Team Collaboration</h3>
              <p>Share feeds, articles, and annotations with your team. Build shared knowledge bases together.</p>
            </div>

            <div className="mini-feature-card">
              <div className="mini-feature-icon" style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              </div>
              <h3>Brand Monitoring</h3>
              <p>Monitor mentions of your brand, competitors, and keywords across thousands of sources simultaneously.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES CAROUSEL ===== */}
      <section className="case-studies-section" id="blog">
        <div className="container">
          <div className="section-header">
            <h2>Case studies</h2>
            <div className="carousel-nav-btns">
              <button className="carousel-btn prev-btn" id="prev-btn" aria-label="Previous" onClick={goPrev}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button className="carousel-btn next-btn" id="next-btn" aria-label="Next" onClick={goNext}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          <div
            className="carousel-track-wrapper"
            onTouchStart={(e) => { touchStartXRef.current = e.changedTouches[0].clientX; }}
            onTouchEnd={(e) => {
              const diff = touchStartXRef.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 40) {
                if (diff > 0) goNext();
                else goPrev();
              }
            }}
          >
            <div
              className="carousel-track"
              id="carousel-track"
              style={{
                transform: `translateX(-${carouselIndex * (100 / visibleCount)}%)`,
                transition: 'transform 0.45s ease',
              }}
            >
              <div className="case-card" style={{ background: "linear-gradient(180deg, rgba(24,117,243,0.15) 0%, #1a1a2e 60%), url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600') center/cover no-repeat" }}>
                <div className="case-card-body">
                  <div className="case-tag">Content Workflows</div>
                  <h3>Content workflows with Inoreader Intelligence</h3>
                  <p>How marketing teams 10x their content pipeline using AI-powered feed monitoring.</p>
                  <a href="#" className="case-link">Read story →</a>
                </div>
              </div>

              <div className="case-card" style={{ background: "linear-gradient(180deg, rgba(124,58,237,0.15) 0%, #1a1a2e 60%), url('https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600') center/cover no-repeat" }}>
                <div className="case-card-body">
                  <div className="case-tag">Brand Monitoring</div>
                  <h3>Brand monitoring simplified</h3>
                  <p>A Fortune 500 company's journey from information overload to strategic clarity.</p>
                  <a href="#" className="case-link">Read story →</a>
                </div>
              </div>

              <div className="case-card" style={{ background: "linear-gradient(180deg, rgba(5,150,105,0.15) 0%, #1a1a2e 60%), url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600') center/cover no-repeat" }}>
                <div className="case-card-body">
                  <div className="case-tag">Research</div>
                  <h3>Academic research at scale</h3>
                  <p>University research teams leverage Inoreader to monitor academic publications efficiently.</p>
                  <a href="#" className="case-link">Read story →</a>
                </div>
              </div>

              <div className="case-card" style={{ background: "linear-gradient(180deg, rgba(217,119,6,0.15) 0%, #1a1a2e 60%), url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600') center/cover no-repeat" }}>
                <div className="case-card-body">
                  <div className="case-tag">Journalism</div>
                  <h3>The newsroom of the future</h3>
                  <p>How digital-first newsrooms use Inoreader to stay ahead of breaking stories 24/7.</p>
                  <a href="#" className="case-link">Read story →</a>
                </div>
              </div>

              <div className="case-card" style={{ background: "linear-gradient(180deg, rgba(220,38,38,0.15) 0%, #1a1a2e 60%), url('https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=600') center/cover no-repeat" }}>
                <div className="case-card-body">
                  <div className="case-tag">Finance</div>
                  <h3>Market intelligence for investors</h3>
                  <p>Investment analysts use Inoreader to track market signals and financial news in real-time.</p>
                  <a href="#" className="case-link">Read story →</a>
                </div>
              </div>
            </div>
          </div>

          <div className="carousel-dots" id="carousel-dots">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === carouselIndex ? 'active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Loved by information professionals</h2>
            <p>Join millions of readers who trust Inoreader every day</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card featured-testimonial">
              <div className="stars">★★★★★</div>
              <blockquote>"Inoreader has completely transformed how I consume information. The automation features alone save me 2+ hours every single day. I couldn't imagine going back to browsing the web manually."</blockquote>
              <div className="testimonial-author">
                <div className="avatar" style={{ background: 'linear-gradient(135deg, #1875F3, #60a5fa)' }}>SM</div>
                <div>
                  <strong>Sarah M.</strong>
                  <span>Head of Research, TechCorp</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <blockquote>"The best RSS reader I've ever used. Clean interface, powerful filters, and the AI summaries are incredibly accurate. Worth every penny."</blockquote>
              <div className="testimonial-author">
                <div className="avatar" style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}>JK</div>
                <div>
                  <strong>James K.</strong>
                  <span>Senior Journalist, MediaHouse</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <blockquote>"We use Inoreader for competitive intelligence across our entire marketing team. It's become an indispensable part of our strategy workflow."</blockquote>
              <div className="testimonial-author">
                <div className="avatar" style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>AR</div>
                <div>
                  <strong>Ana R.</strong>
                  <span>VP Marketing, ScaleUp Inc.</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <blockquote>"The brand monitoring capabilities are unmatched. I can track mentions across hundreds of sites in real-time and get alerts before our competitors even notice."</blockquote>
              <div className="testimonial-author">
                <div className="avatar" style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}>TL</div>
                <div>
                  <strong>Thomas L.</strong>
                  <span>Brand Manager, GlobalBrands</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Simple, transparent pricing</h2>
            <p>Start free, upgrade when you need more power</p>
            <div className="billing-toggle">
              <span
                className="toggle-label"
                id="monthly-label"
                style={{
                  fontWeight: isYearly ? '400' : '700',
                  color: isYearly ? 'var(--gray-400)' : 'var(--gray-700)',
                }}
              >
                Monthly
              </span>
              <button
                className={`toggle-btn ${isYearly ? 'yearly' : ''}`}
                id="billing-toggle"
                aria-label="Toggle billing period"
                onClick={() => setIsYearly(!isYearly)}
              >
                <div className={`toggle-thumb ${isYearly ? 'yearly' : ''}`} id="toggle-thumb"></div>
              </button>
              <span
                className="toggle-label"
                id="yearly-label"
                style={{
                  fontWeight: isYearly ? '700' : '400',
                  color: isYearly ? 'var(--gray-700)' : 'var(--gray-500)',
                }}
              >
                Yearly <span className="savings-badge">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="plan-header">
                <div className="plan-name">Free</div>
                <div className="plan-price">
                  <span className="price-amount">$0</span>
                  <span className="price-period">/ forever</span>
                </div>
                <p className="plan-desc">Perfect for personal use and getting started</p>
              </div>
              <ul className="plan-features">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Up to 150 subscriptions</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Basic article search</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Mobile & web apps</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> 1 month article history</li>
              </ul>
              <a href="signup.html" className="btn-plan btn-plan-outline" onClick={(e) => navigateTo('signup', e)}>Get started free</a>
            </div>

            <div className="pricing-card featured-plan">
              <div className="plan-popular-badge">Most Popular</div>
              <div className="plan-header">
                <div className="plan-name">Supporter</div>
                <div className="plan-price">
                  <span className="price-amount">{isYearly ? '$6.39' : '$7.99'}</span>
                  <span className="price-period">/ month</span>
                </div>
                <p className="plan-desc">For power users who need more features</p>
              </div>
              <ul className="plan-features">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Unlimited subscriptions</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Full-text article search</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Rules & automation (10 rules)</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> 1 year article history</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Priority support</li>
              </ul>
              <a
                href="signup.html"
                className="btn-plan btn-plan-primary"
                onClick={(e) => { handleRippleClick(e); navigateTo('signup', e); }}
              >
                Start 15-day trial
              </a>
            </div>

            <div className="pricing-card">
              <div className="plan-header">
                <div className="plan-name">Professional</div>
                <div className="plan-price">
                  <span className="price-amount">{isYearly ? '$11.99' : '$14.99'}</span>
                  <span className="price-period">/ month</span>
                </div>
                <p className="plan-desc">For professionals and small teams</p>
              </div>
              <ul className="plan-features">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Everything in Supporter</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Unlimited automation rules</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Inoreader Intelligence (AI)</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Unlimited article history</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> API access</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="#1875F3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Zapier integration</li>
              </ul>
              <a href="#" className="btn-plan btn-plan-outline" onClick={(e) => navigateTo('signup', e)}>Start 15-day trial</a>
            </div>
          </div>

          <div className="enterprise-cta" id="enterprise">
            <div className="enterprise-content">
              <h3>Need more for your team?</h3>
              <p>Inoreader Enterprise offers custom plans for large teams, advanced compliance, SSO, and dedicated support.</p>
              <a href="#" className="btn-primary" onClick={handleRippleClick}>Contact sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== APP DOWNLOAD ===== */}
      <section className="app-download-section">
        <div className="container">
          <div className="app-download-content">
            <div className="app-download-text">
              <h2>Take your newsfeed everywhere</h2>
              <p>Available on all your devices. Seamlessly sync your reading progress, bookmarks, and preferences across web, iOS, and Android.</p>
              <div className="app-badges">
                <a href="#" className="app-badge" aria-label="Download on App Store">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <div>
                    <span className="badge-sub">Download on the</span>
                    <span className="badge-main">App Store</span>
                  </div>
                </a>
                <a href="#" className="app-badge" aria-label="Get it on Google Play">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/></svg>
                  <div>
                    <span className="badge-sub">Get it on</span>
                    <span className="badge-main">Google Play</span>
                  </div>
                </a>
              </div>
              <div className="app-rating">
                <div className="rating-stars">★★★★★</div>
                <span>4.8 out of 5 based on 50,000+ reviews</span>
              </div>
            </div>
            <div className="app-download-visual">
              <div className="phone-mockup-wrap">
                <img src={heroMobileApp} alt="Inoreader Mobile App" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-banner">
        <div className="cta-particles"></div>
        <div className="container">
          <div className="cta-content">
            <h2>Start building your newsfeed today</h2>
            <p>Join 7 million+ readers. Free to start, no credit card required.</p>
            <div className="cta-actions">
              <a
                href="signup.html"
                className="btn-primary btn-xl btn-white"
                id="cta-signup"
                onClick={(e) => { handleRippleClick(e); navigateTo('signup', e); }}
              >
                Create free account
              </a>
              <a href="#pricing" className="btn-outline btn-xl btn-outline-white">View pricing</a>
            </div>
            <p className="cta-sub">15-day free trial of Pro features • No credit card required</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#" className="footer-logo" aria-label="Inoreader" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <svg width="120" height="26" viewBox="0 0 135 29" fill="none">
                  <circle cx="12.5" cy="12.5" r="12.5" fill="#1875F3" />
                  <circle cx="16.25" cy="8.75" r="3.75" fill="white" />
                  <text x="31" y="21" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="17" fill="white" letterSpacing="-0.5">inoreader</text>
                </svg>
              </a>
              <p>Build your own newsfeed. Follow what matters.</p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Twitter/X">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.907-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>

            <div className="footer-cols">
              <div className="footer-col">
                <h4>Product</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#">What's new</a></li>
                  <li><a href="#">Roadmap</a></li>
                  <li><a href="#">Changelog</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Solutions</h4>
                <ul>
                  <li><a href="#">Brand monitoring</a></li>
                  <li><a href="#">Content marketing</a></li>
                  <li><a href="#">Media monitoring</a></li>
                  <li><a href="#enterprise">Enterprise</a></li>
                  <li><a href="#">Education</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Developers</h4>
                <ul>
                  <li><a href="#">API docs</a></li>
                  <li><a href="#">Integrations</a></li>
                  <li><a href="#">Browser extension</a></li>
                  <li><a href="#">Zapier</a></li>
                  <li><a href="#">IFTTT</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <ul>
                  <li><a href="#">About us</a></li>
                  <li><a href="#blog">Blog</a></li>
                  <li><a href="#">Press</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 Inoreader. All rights reserved. Built with ♥ for information lovers.</p>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
              <a href="#">GDPR</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== SIGN IN MODAL ===== */}
      {signinModalOpen && (
        <div
          className="modal-overlay active"
          id="signin-modal"
          onClick={(e) => { if (e.target.id === 'signin-modal') setSigninModalOpen(false); }}
        >
          <div className="modal">
            <button
              className="modal-close"
              id="close-signin"
              aria-label="Close"
              onClick={() => setSigninModalOpen(false)}
            >
              ✕
            </button>
            <div className="modal-logo">
              <svg width="36" height="36" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#1875F3"/><circle cx="30" cy="18" r="7" fill="white"/></svg>
            </div>
            <h2 className="modal-title">Welcome back</h2>
            <p className="modal-subtitle">Sign in to your Inoreader account</p>
            <div className="oauth-btns">
              <button
                className="oauth-btn google-btn"
                type="button"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleGoogleAuth}
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>
            </div>
            <div className="modal-divider"><span>or</span></div>
            <form className="modal-form" id="signin-form" onSubmit={handleSigninSubmit}>
              <div className="form-group">
                <label htmlFor="signin-email">Email address</label>
                <input type="email" id="signin-email" placeholder="you@example.com" autoComplete="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="signin-password">Password</label>
                <input type="password" id="signin-password" placeholder="••••••••" autoComplete="current-password" required />
              </div>
              <a href="#" className="forgot-link">Forgot password?</a>
              <button
                type="submit"
                className="btn-primary btn-full"
                disabled={isSigningIn}
                style={{ opacity: isSigningIn ? 0.7 : 1 }}
              >
                {isSigningIn ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <p className="modal-footer-text">
              Don't have an account?{' '}
              <a
                href="#"
                id="switch-to-signup"
                onClick={(e) => {
                  e.preventDefault();
                  setSigninModalOpen(false);
                  setTimeout(() => setSignupModalOpen(true), 200);
                }}
              >
                Create one free
              </a>
            </p>
          </div>
        </div>
      )}

      {/* ===== SIGN UP MODAL ===== */}
      {signupModalOpen && (
        <div
          className="modal-overlay active"
          id="signup-modal"
          onClick={(e) => { if (e.target.id === 'signup-modal') setSignupModalOpen(false); }}
        >
          <div className="modal">
            <button
              className="modal-close"
              id="close-signup"
              aria-label="Close"
              onClick={() => setSignupModalOpen(false)}
            >
              ✕
            </button>
            <div className="modal-logo">
              <svg width="36" height="36" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#1875F3"/><circle cx="30" cy="18" r="7" fill="white"/></svg>
            </div>
            <h2 className="modal-title">Start for free</h2>
            <p className="modal-subtitle">Create your Inoreader account — no credit card needed</p>
            <div className="oauth-btns">
              <button
                className="oauth-btn google-btn"
                type="button"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleGoogleAuth}
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign up with Google
              </button>
            </div>
            <div className="modal-divider"><span>or</span></div>
            <form className="modal-form" id="signup-form" onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label htmlFor="signup-email">Email address</label>
                <input type="email" id="signup-email" placeholder="you@example.com" autoComplete="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="signup-username">Username</label>
                <input type="text" id="signup-username" placeholder="Choose a username" autoComplete="username" required />
              </div>
              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input type="password" id="signup-password" placeholder="At least 8 characters" autoComplete="new-password" required />
              </div>
              <button
                type="submit"
                className="btn-primary btn-full"
                disabled={isCreatingAccount}
                style={{ opacity: isCreatingAccount ? 0.7 : 1 }}
              >
                {isCreatingAccount ? 'Creating account...' : 'Create free account'}
              </button>
              <p className="terms-text">By creating an account, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
            </form>
            <p className="modal-footer-text">
              Already have an account?{' '}
              <a
                href="#"
                id="switch-to-signin"
                onClick={(e) => {
                  e.preventDefault();
                  setSignupModalOpen(false);
                  setTimeout(() => setSigninModalOpen(true), 200);
                }}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%) translateY(0)',
            background: '#111827',
            color: 'white',
            padding: '14px 24px',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.93rem',
            fontWeight: 500,
            boxShadow: '0 8px 32px rgba(0,0,0,.3)',
            zIndex: 9999,
            transition: 'transform .4s cubic-bezier(.34,1.56,.64,1), opacity .4s',
            opacity: 1,
            whiteSpace: 'nowrap',
            maxWidth: '90vw',
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
