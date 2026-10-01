import React, { useState } from 'react';
import '../styles/auth.css';
import { AUTH } from '../utils/auth';
import { loginWithGoogle, loginWithEmail } from '../services/firebase';

export default function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [emailError, setEmailError] = useState(false);
  const [pwError, setPwError] = useState(false);

  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });
  const [loading, setLoading] = useState(false);
  const [btnText, setBtnText] = useState('Sign in');

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const showAlert = (message, type = 'error') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val && !validateEmail(val)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
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
      if (onNavigate) {
        onNavigate('reader');
      }
    } catch (err) {
      showAlert(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    let valid = true;
    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (!password || password.length < 6) {
      setPwError(true);
      valid = false;
    } else {
      setPwError(false);
    }

    if (!valid) return;

    setLoading(true);
    setBtnText('Signing in…');

    try {
      const user = await loginWithEmail(trimmedEmail, password);
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
      setBtnText('✓ Signed in!');
      await new Promise((r) => setTimeout(r, 400));
      if (onNavigate) {
        onNavigate('reader');
      }
    } catch (err) {
      let msg = 'Failed to sign in. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Incorrect email or password. Please try again.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email. Please sign up first.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again later.';
      } else if (err.message) {
        msg = err.message;
      }
      showAlert(msg);
      setBtnText('Sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* LEFT: Branding Panel */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="brand-logo" onClick={() => onNavigate && onNavigate('home')} style={{ cursor: 'pointer' }}>
            <div className="brand-logo-icon">
              <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="23" fill="#1875F3" />
                <circle cx="30" cy="18" r="7" fill="white" />
              </svg>
            </div>
            <span className="brand-logo-text">inoreader</span>
          </div>

          <h1 className="brand-headline">Your personal<br />intelligence hub</h1>
          <p className="brand-sub">Stay ahead of the curve. Follow any source, filter the noise, and get smarter every day — all in one place.</p>

          <div className="brand-features">
            <div className="brand-feature">
              <div className="brand-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <div className="brand-feature-text">
                <strong>Follow any website or creator</strong>
                <span>RSS, newsletters, podcasts and more</span>
              </div>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <div className="brand-feature-text">
                <strong>AI-powered summaries</strong>
                <span>Inoreader Intelligence saves you hours</span>
              </div>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div className="brand-feature-text">
                <strong>Powerful automation rules</strong>
                <span>Filter, tag and act on content automatically</span>
              </div>
            </div>
          </div>
        </div>

        <div className="brand-testimonial">
          <blockquote>"Inoreader is the first thing I open every morning. It's replaced my entire social media habit with something actually useful."</blockquote>
          <div className="brand-testimonial-author">
            <div className="brand-avatar">MK</div>
            <div>
              <strong>Maya K.</strong>
              <span>Product Manager, Stripe</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="auth-form-panel">
        <a
          href="/"
          className="back-home"
          onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('ekai'); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Back to EKAI Dashboard
        </a>

        <div className="auth-top-nav">
          <span>Don't have an account?</span>
          <a
            href="signup.html"
            onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('signup'); }}
          >
            Create one free
          </a>
        </div>

        <div className="auth-form-wrap">
          <h2 className="form-title">Welcome back</h2>
          <p className="form-subtitle">Sign in to continue to your newsfeed</p>

          {/* Alert box */}
          <div className={`alert-box ${alert.show ? 'show' : ''} ${alert.type}`} id="login-alert" role="alert">
            {alert.message}
          </div>

          {/* OAuth: Google only (Apple removed per request) */}
          <div className="oauth-row" style={{ display: 'flex' }}>
            <button
              className="oauth-btn"
              id="google-btn"
              type="button"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign in with Google
            </button>
          </div>

          <div className="divider"><span>or continue with email</span></div>

          {/* Form */}
          <form className="auth-form" id="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-email">Email address</label>
              <div className="input-wrap">
                <input
                  type="email"
                  id="login-email"
                  className={`form-input ${emailError ? 'error' : ''}`}
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={loading}
                />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div className={`field-error ${emailError ? 'show' : ''}`} id="email-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Please enter a valid email address
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  className={`form-input ${pwError ? 'error' : ''}`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  disabled={loading}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value.length >= 6) setPwError(false);
                  }}
                />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <button
                  type="button"
                  className="pw-toggle"
                  id="pw-toggle-login"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg id="eye-icon-login" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPassword ? (
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    ) : (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    )}
                    {showPassword && <circle cx="12" cy="12" r="3" />}
                  </svg>
                </button>
              </div>
              <div className={`field-error ${pwError ? 'show' : ''}`} id="pw-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Password must be at least 6 characters
              </div>
            </div>

            <div className="forgot-wrap">
              <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); showAlert('Password reset email feature is available via Firebase.', 'info'); }}>Forgot password?</a>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me">Keep me signed in for 30 days</label>
            </div>

            <button type="submit" className="btn-submit" id="login-submit" disabled={loading}>
              {loading && <div className="spinner" id="login-spinner" style={{ display: 'block' }}></div>}
              <span id="login-btn-text">{btnText}</span>
            </button>
          </form>

          <p className="switch-link">
            Don't have an account?{' '}
            <a
              href="signup.html"
              onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('signup'); }}
            >
              Create one free →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
