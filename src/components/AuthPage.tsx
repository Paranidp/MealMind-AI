/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  Phone,
  AlertCircle,
  CheckCircle2,
  Flame,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Language, ManagerUser } from '../types';
import { translations } from '../translations';
import {
  isFirebaseConfigured,
  getStoredFirebaseConfig,
  loginManager,
  registerManager,
  DEMO_CREDENTIALS,
} from '../services/firebaseAuth';
import { FirebaseConfigModal } from './FirebaseConfigModal';

interface AuthPageProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onSuccessLogin: (user: ManagerUser) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  language,
  onToggleLanguage,
  onSuccessLogin,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up Form States (Exact 5 fields requested)
  const [signUpManagerName, setSignUpManagerName] = useState('');
  const [signUpHotelName, setSignUpHotelName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Validation & Error States
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Firebase Setup Modal
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [firebaseActive, setFirebaseActive] = useState(isFirebaseConfigured());

  const t = translations[language];

  // Validation rules
  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const validatePhone = (val: string) => /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/.test(val.trim());

  const loginErrors = {
    email: !loginEmail ? 'Email is required' : !validateEmail(loginEmail) ? 'Please enter a valid email' : null,
    password: !loginPassword ? 'Password is required' : loginPassword.length < 6 ? 'Password must be at least 6 characters' : null,
  };

  const signUpErrors = {
    managerName: !signUpManagerName.trim()
      ? 'Manager name is required'
      : signUpManagerName.trim().length < 2
      ? 'Name must be at least 2 characters'
      : null,
    hotelName: !signUpHotelName.trim()
      ? 'Hotel or restaurant name is required'
      : signUpHotelName.trim().length < 2
      ? 'Hotel name must be at least 2 characters'
      : null,
    email: !signUpEmail.trim()
      ? 'Email is required'
      : !validateEmail(signUpEmail)
      ? 'Please enter a valid email address'
      : null,
    phone: !signUpPhone.trim()
      ? 'Phone number is required'
      : !validatePhone(signUpPhone)
      ? 'Please enter a valid phone number (min 7 digits)'
      : null,
    password: !signUpPassword
      ? 'Password is required'
      : signUpPassword.length < 6
      ? 'Password must be at least 6 characters'
      : null,
    confirmPassword:
      signUpConfirmPassword !== signUpPassword
        ? 'Passwords do not match'
        : null,
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Mark all login fields as touched
    setTouched({ loginEmail: true, loginPassword: true });

    if (loginErrors.email || loginErrors.password) {
      setFormError(loginErrors.email || loginErrors.password || 'Please fix the errors below.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginManager(loginEmail, loginPassword);
      setFormSuccess(language === 'en' ? 'Authentication successful. Entering dashboard...' : 'உள்நுழைவு வெற்றிகரமானது...');
      setTimeout(() => {
        onSuccessLogin(user);
      }, 500);
    } catch (err: any) {
      setFormError(err?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Mark all signup fields as touched
    setTouched({
      signUpManagerName: true,
      signUpHotelName: true,
      signUpEmail: true,
      signUpPhone: true,
      signUpPassword: true,
      signUpConfirmPassword: true,
    });

    const hasErrors = Object.values(signUpErrors).some((err) => err !== null);
    if (hasErrors) {
      const firstError = Object.values(signUpErrors).find((err) => err !== null);
      setFormError(firstError || 'Please complete all required fields correctly.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await registerManager({
        managerName: signUpManagerName,
        hotelName: signUpHotelName,
        email: signUpEmail,
        phone: signUpPhone,
        password: signUpPassword,
      });

      setFormSuccess(language === 'en' ? 'Account registered successfully. Opening dashboard...' : 'கணக்கு பதிவு செய்யப்பட்டது...');
      setTimeout(() => {
        onSuccessLogin(user);
      }, 600);
    } catch (err: any) {
      setFormError(err?.message || 'Sign up failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setLoginEmail(DEMO_CREDENTIALS.email);
    setLoginPassword(DEMO_CREDENTIALS.password);
    setFormError(null);
    setTouched({});
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Top Brand Bar */}
      <header className="border-b border-slate-800 bg-[#0B132B]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-slate-800 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xs">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 leading-none">
              <span className="font-serif font-bold text-lg text-white">MealMind</span>
              <span className="text-xs font-semibold tracking-wider text-amber-400">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 tracking-wide">
              {language === 'en' ? 'Hotel & Restaurant Preparation Suite' : 'ஹோட்டல் சமையலறை தயாரிப்பு தளம்'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Firebase Status Badge */}
          <button
            onClick={() => setIsFirebaseModalOpen(true)}
            id="auth-firebase-status-badge"
            className={`flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
              firebaseActive
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
            }`}
            title="Click to view Firebase setup & credentials"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">
              {firebaseActive ? 'Firebase Auth: Live' : 'Firebase Auth: Config Needed'}
            </span>
            <span className="sm:hidden font-medium">
              {firebaseActive ? 'Firebase Live' : 'Firebase Config'}
            </span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onToggleLanguage('ta')}
              className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                language === 'ta'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Visual Column: Hospitality Platform Highlights (Desktop) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0B132B] via-[#0F172A] to-[#1E293B] p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Executive Culinary Portal' : 'தலைமை சமையலறை தளம்'}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                {language === 'en'
                  ? 'Precision Food Demand Planning'
                  : 'துல்லியமான உணவு தேவை திட்டமிடல்'}
              </h2>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'en'
                  ? 'Eliminate buffet overproduction and kitchen shortages with Random Forest machine learning models grounded in hotel occupancy and service metrics.'
                  : 'ஹோட்டல் தங்கும் விகிதம் மற்றும் சேவை அளவுகளின் அடிப்படையில் உணவு வீணாவதைத் தடுத்து துல்லியமாக தயாரிக்கவும்.'}
              </p>

              {/* Core Feature Pillars */}
              <div className="mt-8 space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-md bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100">
                      {language === 'en' ? 'Target Demand Forecasting' : 'துல்லிய தேவை முன்கணிப்பு'}
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {language === 'en'
                        ? 'Accurately predicts quantity prepared for each dish to minimize food waste.'
                        : 'ஒவ்வொரு உணவுக்கும் தேவையான அளவைத் துல்லியமாகக் கணித்து உணவு விரயத்தைத் தவிர்க்கிறது.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-md bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100">
                      {language === 'en' ? 'Multi-Service Planning' : 'முழுமையான சேவை திட்டமிடல்'}
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {language === 'en'
                        ? 'Comprehensive forecasting for Breakfast buffets, Grand Lunch spreads, and Dinner services.'
                        : 'காலை, மதிய மற்றும் இரவு உணவிற்கான தனிப்பயனாக்கப்பட்ட திட்டங்கள்.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Firebase Architecture Note */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span className="font-medium">
                    {firebaseActive ? 'Google Firebase Live' : 'Firebase Setup Ready'}
                  </span>
                </div>
                <button
                  onClick={() => setIsFirebaseModalOpen(true)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline cursor-pointer"
                >
                  {language === 'en' ? 'Configuration Details' : 'அமைப்பு விவரங்கள்'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Clean White / Crisp Interactive Auth Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 text-slate-900 flex flex-col justify-center">
            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mb-6">
              <button
                id="tab-login"
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setFormError(null);
                  setFormSuccess(null);
                  setTouched({});
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'en' ? 'Sign In' : 'உள்நுழைக'}
              </button>
              <button
                id="tab-signup"
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setFormError(null);
                  setFormSuccess(null);
                  setTouched({});
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'en' ? 'Create Account' : 'புதிய கணக்கு'}
              </button>
            </div>

            {/* Error & Success Notification Banners */}
            {formError && (
              <div
                id="auth-error-banner"
                className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start space-x-2.5 animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-950">
                    {language === 'en' ? 'Authentication Notice' : 'அங்கீகார அறிவிப்பு'}
                  </p>
                  <p className="text-rose-800 mt-0.5">{formError}</p>
                </div>
              </div>
            )}

            {formSuccess && (
              <div
                id="auth-success-banner"
                className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center space-x-2.5 animate-in fade-in"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{formSuccess}</span>
              </div>
            )}

            {/* ---------------- LOGIN VIEW ---------------- */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="mb-2">
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    {language === 'en' ? 'Manager Login' : 'மேலாளர் உள்நுழைவு'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en'
                      ? 'Sign in with your work email and password to access the planning dashboard.'
                      : 'உங்கள் மின்னஞ்சல் மற்றும் கடவுச்சொல் மூலம் உள்நுழையவும்.'}
                  </p>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Work Email Address' : 'மின்னஞ்சல் முகவரி'}{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      onBlur={() => handleBlur('loginEmail')}
                      placeholder="chef@grandhorizon.com"
                      required
                      className={`w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border transition-colors bg-white ${
                        touched.loginEmail && loginErrors.email
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                          : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                      }`}
                    />
                  </div>
                  {touched.loginEmail && loginErrors.email && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {loginErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {language === 'en' ? 'Password' : 'கடவுச்சொல்'}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onBlur={() => handleBlur('loginPassword')}
                      placeholder="••••••••••••"
                      required
                      className={`w-full text-xs pl-9 pr-10 py-2.5 rounded-lg border transition-colors bg-white ${
                        touched.loginPassword && loginErrors.password
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                          : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      title={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {touched.loginPassword && loginErrors.password && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {loginErrors.password}
                    </p>
                  )}
                </div>

                {/* Quick Demo Fill Helper */}
                <div className="pt-1 flex items-center justify-between">
                  <button
                    id="login-demo-autofill-btn"
                    type="button"
                    onClick={handleFillDemoCredentials}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>
                      {language === 'en' ? 'Fill Demo Credentials' : 'மாதிரி நற்சான்றிதழ்கள்'}
                    </span>
                  </button>
                  <span className="text-[11px] text-slate-500">
                    chef@grandhorizon.com
                  </span>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    id="login-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                  >
                    <span>{isLoading ? 'Verifying Credentials...' : t.login}</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>

                {/* Switch to SignUp */}
                <p className="text-center text-xs text-slate-600 pt-2">
                  {language === 'en' ? "Don't have an account?" : 'கணக்கு இல்லையா?'}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setFormError(null);
                    }}
                    className="font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                  >
                    {language === 'en' ? 'Register Hotel / Restaurant' : 'புதிய உணவகம் பதிவு'}
                  </button>
                </p>
              </form>
            )}

            {/* ---------------- SIGN UP VIEW ---------------- */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div className="mb-2">
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    {language === 'en' ? 'Create Manager Account' : 'மேலாளர் கணக்கு தொடங்கு'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en'
                      ? 'Register your property to unlock customized recipe forecasts and batch planning.'
                      : 'உங்கள் ஹோட்டல் அல்லது உணவகத்தை பதிவு செய்யவும்.'}
                  </p>
                </div>

                {/* 1. Manager Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Manager Name' : '1. மேலாளர் பெயர்'}{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-manager-name"
                      type="text"
                      value={signUpManagerName}
                      onChange={(e) => setSignUpManagerName(e.target.value)}
                      onBlur={() => handleBlur('signUpManagerName')}
                      placeholder="Chef Vikram Raman"
                      required
                      className={`w-full text-xs pl-9 pr-3 py-2 rounded-lg border transition-colors bg-white ${
                        touched.signUpManagerName && signUpErrors.managerName
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                          : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                      }`}
                    />
                  </div>
                  {touched.signUpManagerName && signUpErrors.managerName && (
                    <p className="text-[11px] text-rose-600 mt-0.5 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {signUpErrors.managerName}
                    </p>
                  )}
                </div>

                {/* 2. Hotel / Restaurant Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Hotel / Restaurant Name' : '2. ஹோட்டல் / உணவகம் பெயர்'}{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-hotel-name"
                      type="text"
                      value={signUpHotelName}
                      onChange={(e) => setSignUpHotelName(e.target.value)}
                      onBlur={() => handleBlur('signUpHotelName')}
                      placeholder="The Grand Horizon Hotel & Suites"
                      required
                      className={`w-full text-xs pl-9 pr-3 py-2 rounded-lg border transition-colors bg-white ${
                        touched.signUpHotelName && signUpErrors.hotelName
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                          : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                      }`}
                    />
                  </div>
                  {touched.signUpHotelName && signUpErrors.hotelName && (
                    <p className="text-[11px] text-rose-600 mt-0.5 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {signUpErrors.hotelName}
                    </p>
                  )}
                </div>

                {/* 3. Email & 4. Phone Number in 2-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 3. Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'Email' : '3. மின்னஞ்சல்'}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-email"
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        onBlur={() => handleBlur('signUpEmail')}
                        placeholder="vikram@grandhorizon.com"
                        required
                        className={`w-full text-xs pl-9 pr-3 py-2 rounded-lg border transition-colors bg-white ${
                          touched.signUpEmail && signUpErrors.email
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                            : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                        }`}
                      />
                    </div>
                    {touched.signUpEmail && signUpErrors.email && (
                      <p className="text-[11px] text-rose-600 mt-0.5 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {signUpErrors.email}
                      </p>
                    )}
                  </div>

                  {/* 4. Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'Phone Number' : '4. தொலைபேசி எண்'}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-phone"
                        type="tel"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        onBlur={() => handleBlur('signUpPhone')}
                        placeholder="+91 98401 23456"
                        required
                        className={`w-full text-xs pl-9 pr-3 py-2 rounded-lg border transition-colors bg-white ${
                          touched.signUpPhone && signUpErrors.phone
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                            : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                        }`}
                      />
                    </div>
                    {touched.signUpPhone && signUpErrors.phone && (
                      <p className="text-[11px] text-rose-600 mt-0.5 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {signUpErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* 5. Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 5. Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'Password' : '5. கடவுச்சொல்'}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-password"
                        type={showSignUpPassword ? 'text' : 'password'}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        onBlur={() => handleBlur('signUpPassword')}
                        placeholder="Min 6 characters"
                        required
                        className={`w-full text-xs pl-9 pr-8 py-2 rounded-lg border transition-colors bg-white ${
                          touched.signUpPassword && signUpErrors.password
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                            : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showSignUpPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {touched.signUpPassword && signUpErrors.password && (
                      <p className="text-[11px] text-rose-600 mt-0.5 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {signUpErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'Confirm Password' : 'கடவுச்சொல்லை உறுதிப்படுத்துக'}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-confirm-password"
                        type={showSignUpPassword ? 'text' : 'password'}
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        onBlur={() => handleBlur('signUpConfirmPassword')}
                        placeholder="Re-enter password"
                        required
                        className={`w-full text-xs pl-9 pr-3 py-2 rounded-lg border transition-colors bg-white ${
                          touched.signUpConfirmPassword && signUpErrors.confirmPassword
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                            : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                        }`}
                      />
                    </div>
                    {touched.signUpConfirmPassword && signUpErrors.confirmPassword && (
                      <p className="text-[11px] text-rose-600 mt-0.5 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {signUpErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    id="signup-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                  >
                    <span>{isLoading ? 'Creating Account...' : (language === 'en' ? 'Register Manager & Open Dashboard' : 'கணக்கு தொடங்கி டாஷ்போர்டுக்கு செல்லவும்')}</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>

                {/* Switch to Login */}
                <p className="text-center text-xs text-slate-600 pt-1">
                  {language === 'en' ? 'Already registered?' : 'ஏற்கனவே பதிவு செய்துள்ளீர்களா?'}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setFormError(null);
                    }}
                    className="font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                  >
                    {language === 'en' ? 'Sign In' : 'உள்நுழைக'}
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer / Transparency Notice */}
      <footer className="border-t border-slate-800 bg-[#0B132B]/80 px-4 py-3 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto w-full gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          <span>
            {firebaseActive
              ? (language === 'en' ? 'Firebase Authentication Engine: Active' : 'ஃபயர்பேஸ் அங்கீகாரம்: இயக்கத்தில் உள்ளது')
              : (language === 'en' ? 'Local Hotel Vault Active · Firebase Config Optional' : 'உள்ளூர் பெட்டகம் செயலில் உள்ளது')}
          </span>
        </div>

        <button
          onClick={() => setIsFirebaseModalOpen(true)}
          className="text-amber-400 hover:text-amber-300 underline font-medium text-[11px] cursor-pointer"
        >
          {language === 'en' ? 'View Firebase Setup Instructions' : 'ஃபயர்பேஸ் அமைவு வழிமுறைகள்'}
        </button>
      </footer>

      {/* Firebase Setup Instructions Modal */}
      <FirebaseConfigModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        language={language}
        onConfigUpdated={() => setFirebaseActive(isFirebaseConfigured())}
      />
    </div>
  );
};
