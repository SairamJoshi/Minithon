import React, { useState } from 'react';
import '../styles/auth.css';
import { AUTH } from '../utils/auth';
import { loginWithGoogle, registerWithEmail } from '../services/firebase';

export default function SignupPage({ onNavigate }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Step 1 Errors
  const [emailError, setEmailError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [step1Loading, setStep1Loading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });

  // Step 2 Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('curious');
  const [userError, setUserError] = useState(false);
  const [step2Loading, setStep2Loading] = useState(false);

  // Step 3 progress
  const [progressWidth, setProgressWidth] = useState('0%');

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const checkPwStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const pwScore = checkPwStrength(password);
  const widths = ['25%', '50%', '75%', '100%'];
  const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  const showAlert = (message, type = 'error') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleGoogleSignup = async () => {
    try {
      setStep1Loading(true);
      const user = await loginWithGoogle();
      const sessionUser = {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        username: user.email.split('@')[0],
        avatar: (user.displayName?.[0] || user.email[0]).toUpperCase(),
        plan: 'pro_trial',
        joined: new Date().toISOString(),
      };
      AUTH.setSession(sessionUser);
      if (onNavigate) {
        onNavigate('reader');
      }
    } catch (err) {
      showAlert(err.message || 'Failed to sign up with Google');
    } finally {
      setStep1Loading(false);
    }
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    let valid = true;
    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (password.length < 8) {
      setPwError(true);
      valid = false;
    } else {
      setPwError(false);
    }

    if (password !== confirmPassword) {
      setConfirmError(true);
      valid = false;
    } else {
      setConfirmError(false);
    }

    if (!agreeTerms) {
      setTermsError(true);
      valid = false;
    } else {
      setTermsError(false);
    }

    if (!valid) return;

    setCurrentStep(2);
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 3) {
      setUserError(true);
      return;
    }
    setUserError(false);

    setStep2Loading(true);

    try {
      const displayName = `${firstName} ${lastName}`.trim() || trimmedUsername;
      const user = await registerWithEmail(email.trim(), password, displayName);

      const sessionUser = {
        id: user.uid,
        email: user.email,
        name: displayName,
        username: trimmedUsername,
        role,
        avatar: (firstName[0] || trimmedUsername[0] || 'U').toUpperCase(),
        plan: 'pro_trial',
        joined: new Date().toISOString(),
      };

      AUTH.setSession(sessionUser);

      setStep2Loading(false);
      setCurrentStep(3);

      setTimeout(() => {
        setProgressWidth('100%');
      }, 50);

      setTimeout(() => {
        if (onNavigate) onNavigate('reader');
      }, 2200);
    } catch (err) {
      setStep2Loading(false);
      let msg = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please sign in.';
        setCurrentStep(1);
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please choose a stronger password.';
        setCurrentStep(1);
      } else if (err.message) {
        msg = err.message;
      }
      showAlert(msg);
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

          <h1 className="brand-headline">Start reading<br />smarter today</h1>
          <p className="brand-sub">Join 7 million professionals who use Inoreader to cut through the noise and stay informed on what matters most.</p>

          <div className="brand-features">
            <div className="brand-feature">
              <div className="brand-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div className="brand-feature-text">
                <strong>Free plan, always available</strong>
                <span>150 subscriptions, no credit card needed</span>
              </div>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div className="brand-feature-text">
                <strong>Works everywhere</strong>
                <span>Web, iOS, Android — always in sync</span>
              </div>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              </div>
              <div className="brand-feature-text">
                <strong>15-day Pro trial included</strong>
                <span>Unlock all features, cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        <div className="brand-testimonial">
          <blockquote>"I cut my morning news routine from 90 minutes to 20. Inoreader's filters and AI summaries are genuinely life-changing."</blockquote>
          <div className="brand-testimonial-author">
            <div className="brand-avatar" style={{ background: 'linear-gradient(135deg, #1875F3, #60a5fa)' }}>JR</div>
            <div>
              <strong>James R.</strong>
              <span>Senior Analyst, McKinsey</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Signup Form */}
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
          <span>Already have an account?</span>
          <a
            href="login.html"
            onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('login'); }}
          >
            Sign in
          </a>
        </div>

        <div className="auth-form-wrap">
          {/* Step indicator */}
          <div className="step-indicator" id="step-indicator">
            <div className={`step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`} id="step-1">
              <div className="step-dot">{currentStep > 1 ? '✓' : '1'}</div>
              <span className="step-label">Account</span>
            </div>
            <div className={`step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`} id="step-2">
              <div className="step-dot">{currentStep > 2 ? '✓' : '2'}</div>
              <span className="step-label">Profile</span>
            </div>
            <div className={`step ${currentStep === 3 ? 'active' : ''}`} id="step-3">
              <div className="step-dot">3</div>
              <span className="step-label">Done</span>
            </div>
          </div>

          {/* Step 1 */}
          {currentStep === 1 && (
            <div id="panel-1">
              <h2 className="form-title">Create your account</h2>
              <p className="form-subtitle">Free forever. No credit card required.</p>

              <div className={`alert-box ${alert.show ? 'show' : ''} ${alert.type}`} id="signup-alert" role="alert">
                {alert.message}
              </div>

              {/* OAuth: Google only (Apple removed per request) */}
              <div className="oauth-row" style={{ display: 'flex' }}>
                <button
                  className="oauth-btn"
                  id="google-signup-btn"
                  type="button"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleGoogleSignup}
                  disabled={step1Loading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Sign up with Google
                </button>
              </div>

              <div className="divider"><span>or sign up with email</span></div>

              <form className="auth-form" id="signup-form-1" onSubmit={handleStep1Submit} noValidate>
                <div className="form-group">
                  <label htmlFor="signup-email">Email address</label>
                  <div className="input-wrap">
                    <input
                      type="email"
                      id="signup-email"
                      className={`form-input ${emailError ? 'error' : ''}`}
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (validateEmail(e.target.value)) setEmailError(false);
                      }}
                      disabled={step1Loading}
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div className={`field-error ${emailError ? 'show' : ''}`} id="s-email-error">Please enter a valid email</div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <div className="input-wrap">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="signup-password"
                      className={`form-input ${pwError ? 'error' : ''}`}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      value={password}
                      disabled={step1Loading}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (e.target.value.length >= 8) setPwError(false);
                      }}
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    <button
                      type="button"
                      className="pw-toggle"
                      id="pw-toggle-signup"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <svg id="eye-icon-signup" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {showPassword ? (
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z" />
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
                  <div className={`pw-strength ${password ? 'show' : ''}`} id="pw-strength">
                    <div className="pw-strength-bar">
                      <div
                        className="pw-strength-fill"
                        id="pw-fill"
                        style={{
                          width: widths[pwScore - 1] || '0%',
                          background: colors[pwScore - 1] || '#e5e7eb',
                        }}
                      ></div>
                    </div>
                    <span className="pw-strength-label" id="pw-label">
                      Strength: {labels[pwScore - 1] || '–'}
                    </span>
                  </div>
                  <div className={`field-error ${pwError ? 'show' : ''}`} id="s-pw-error">Password must be at least 8 characters</div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-confirm">Confirm password</label>
                  <div className="input-wrap">
                    <input
                      type="password"
                      id="signup-confirm"
                      className={`form-input ${confirmError ? 'error' : ''}`}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      disabled={step1Loading}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (e.target.value === password) setConfirmError(false);
                      }}
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  </div>
                  <div className={`field-error ${confirmError ? 'show' : ''}`} id="s-confirm-error">Passwords do not match</div>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (e.target.checked) setTermsError(false);
                    }}
                  />
                  <label htmlFor="agree-terms">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
                </div>
                <div className={`field-error ${termsError ? 'show' : ''}`} id="s-terms-error">Please agree to the terms to continue</div>

                <button type="submit" className="btn-submit" id="step1-submit" disabled={step1Loading}>
                  {step1Loading && <div className="spinner" id="step1-spinner" style={{ display: 'block' }}></div>}
                  <span id="step1-btn-text">{step1Loading ? 'Checking…' : 'Continue →'}</span>
                </button>
              </form>

              <p className="switch-link">
                Already have an account?{' '}
                <a
                  href="login.html"
                  onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('login'); }}
                >
                  Sign in →
                </a>
              </p>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div id="panel-2">
              <h2 className="form-title">Set up your profile</h2>
              <p className="form-subtitle">Tell us a bit about yourself — we'll personalise your feed</p>

              <form className="auth-form" id="signup-form-2" onSubmit={handleStep2Submit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="first-name">First name</label>
                    <div className="input-wrap">
                      <input
                        type="text"
                        id="first-name"
                        className="form-input"
                        placeholder="Alex"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={step2Loading}
                      />
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="last-name">Last name</label>
                    <div className="input-wrap">
                      <input
                        type="text"
                        id="last-name"
                        className="form-input"
                        placeholder="Morgan"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={step2Loading}
                      />
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      id="username"
                      className={`form-input ${userError ? 'error' : ''}`}
                      placeholder="Choose a unique username"
                      autoComplete="username"
                      value={username}
                      disabled={step2Loading}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (e.target.value.length >= 3) setUserError(false);
                      }}
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  </div>
                  <div className={`field-error ${userError ? 'show' : ''}`} id="s-user-error">Username must be at least 3 characters</div>
                </div>

                <div className="form-group">
                  <label>What best describes you?</label>
                  <div id="role-picker" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
                    <label className={`role-option ${role === 'researcher' ? 'selected' : ''}`} htmlFor="role-researcher">
                      <input
                        type="radio"
                        name="role"
                        id="role-researcher"
                        value="researcher"
                        checked={role === 'researcher'}
                        onChange={() => setRole('researcher')}
                      />
                      <span>🔬 Researcher</span>
                    </label>
                    <label className={`role-option ${role === 'journalist' ? 'selected' : ''}`} htmlFor="role-journalist">
                      <input
                        type="radio"
                        name="role"
                        id="role-journalist"
                        value="journalist"
                        checked={role === 'journalist'}
                        onChange={() => setRole('journalist')}
                      />
                      <span>📰 Journalist</span>
                    </label>
                    <label className={`role-option ${role === 'marketer' ? 'selected' : ''}`} htmlFor="role-marketer">
                      <input
                        type="radio"
                        name="role"
                        id="role-marketer"
                        value="marketer"
                        checked={role === 'marketer'}
                        onChange={() => setRole('marketer')}
                      />
                      <span>📢 Marketer</span>
                    </label>
                    <label className={`role-option ${role === 'curious' ? 'selected' : ''}`} htmlFor="role-curious">
                      <input
                        type="radio"
                        name="role"
                        id="role-curious"
                        value="curious"
                        checked={role === 'curious'}
                        onChange={() => setRole('curious')}
                      />
                      <span>🧠 Just curious</span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn-submit" id="step2-submit" disabled={step2Loading}>
                  {step2Loading && <div className="spinner" id="step2-spinner" style={{ display: 'block' }}></div>}
                  <span id="step2-btn-text">{step2Loading ? 'Creating…' : 'Create account →'}</span>
                </button>
                <button
                  type="button"
                  className="btn-submit"
                  id="back-btn"
                  style={{ background: 'white', color: 'var(--gray-700)', border: '2px solid var(--gray-200)', marginTop: '8px' }}
                  onClick={() => setCurrentStep(1)}
                  disabled={step2Loading}
                >
                  ← Back
                </button>
              </form>
            </div>
          )}

          {/* Step 3: Success */}
          {currentStep === 3 && (
            <div id="panel-3" style={{ textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg,#10b981,#34d399)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="form-title" style={{ marginBottom: '8px' }}>You're all set! 🎉</h2>
              <p className="form-subtitle" style={{ marginBottom: '32px' }}>Your account has been created. Taking you to your newsfeed…</p>
              <div style={{ height: '4px', background: 'var(--gray-100)', borderRadius: '2px', overflow: 'hidden' }}>
                <div id="redirect-bar" style={{ height: '100%', background: 'var(--blue)', borderRadius: '2px', width: progressWidth, transition: 'width 2s linear' }}></div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '12px' }}>Redirecting in 2 seconds…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
