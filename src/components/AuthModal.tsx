/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  Building2,
  User,
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Language, ManagerUser } from '../types';
import { translations } from '../translations';
import {
  loginManager,
  registerManager,
  DEMO_CREDENTIALS,
} from '../services/firebaseAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSuccessLogin: (user: ManagerUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onSuccessLogin,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Form Fields
  const [managerName, setManagerName] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation & feedback
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const t = translations[language];

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const validatePhone = (val: string) => /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/.test(val.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (isSignUp) {
      if (!managerName.trim() || managerName.trim().length < 2) {
        setFormError('Manager name must be at least 2 characters.');
        return;
      }
      if (!hotelName.trim() || hotelName.trim().length < 2) {
        setFormError('Hotel or restaurant name must be at least 2 characters.');
        return;
      }
      if (!email.trim() || !validateEmail(email)) {
        setFormError('Please enter a valid email address.');
        return;
      }
      if (!phone.trim() || !validatePhone(phone)) {
        setFormError('Please enter a valid phone number.');
        return;
      }
      if (!password || password.length < 6) {
        setFormError('Password must be at least 6 characters.');
        return;
      }

      setIsLoading(true);
      try {
        const user = await registerManager({
          managerName,
          hotelName,
          email,
          phone,
          password,
        });
        onSuccessLogin(user);
        onClose();
      } catch (err: any) {
        setFormError(err?.message || 'Sign up failed.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Login
      if (!email.trim() || !validateEmail(email)) {
        setFormError('Please enter a valid email address.');
        return;
      }
      if (!password || password.length < 6) {
        setFormError('Password must be at least 6 characters.');
        return;
      }

      setIsLoading(true);
      try {
        const user = await loginManager(email, password);
        onSuccessLogin(user);
        onClose();
      } catch (err: any) {
        setFormError(err?.message || 'Login failed.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    try {
      const user = await loginManager(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
      onSuccessLogin(user);
      onClose();
    } catch {
      // If error, register demo and login
      const user = await registerManager({
        managerName: DEMO_CREDENTIALS.managerName,
        hotelName: DEMO_CREDENTIALS.hotelName,
        email: DEMO_CREDENTIALS.email,
        phone: DEMO_CREDENTIALS.phone,
        password: DEMO_CREDENTIALS.password,
      });
      onSuccessLogin(user);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Top Header with Dark Navy & Gold touch */}
        <div className="bg-[#0B132B] px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm">
              M
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                {isSignUp
                  ? (language === 'en' ? 'Manager Registration' : 'மேலாளர் பதிவு')
                  : (language === 'en' ? 'Manager Sign In' : 'மேலாளர் உள்நுழைவு')}
              </h3>
              <p className="text-xs text-amber-400 font-medium">MealMind AI · Hospitality Suite</p>
            </div>
          </div>
          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Access banner */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-700">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">
              {language === 'en' ? 'Instant hotel manager preview' : 'உடனடி நிர்வாக முன்னோட்டம்'}
            </span>
          </div>
          <button
            id="auth-quick-demo-btn"
            type="button"
            onClick={handleQuickDemo}
            className="text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300/80 px-3 py-1 rounded-md transition-colors cursor-pointer"
          >
            {t.demoLogin}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {isSignUp && (
            <>
              {/* 1. Manager Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'en' ? 'Manager Name' : 'மேலாளர் பெயர்'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="modal-manager-name"
                    type="text"
                    required
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Chef Vikram Raman"
                  />
                </div>
              </div>

              {/* 2. Hotel / Restaurant Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'en' ? 'Hotel / Restaurant Name' : 'ஹோட்டல் / உணவகம் பெயர்'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="modal-hotel-name"
                    type="text"
                    required
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="The Grand Horizon Hotel"
                  />
                </div>
              </div>

              {/* 4. Phone Number (Sign Up only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'en' ? 'Phone Number' : 'தொலைபேசி எண்'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="+91 98401 23456"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'en' ? 'Hospitality Work Email' : 'அலுவலக மின்னஞ்சல்'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="modal-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                placeholder="chef@grandhorizon.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'en' ? 'Password' : 'கடவுச்சொல்'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="modal-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Min 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#0B132B] hover:bg-[#162447] text-amber-400 font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              <span>
                {isLoading
                  ? 'Processing...'
                  : isSignUp
                  ? (language === 'en' ? 'Create Account & Sign In' : 'கணக்கை உருவாக்குக')
                  : t.login}
              </span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              id="auth-toggle-mode-btn"
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormError(null);
              }}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium underline cursor-pointer"
            >
              {isSignUp
                ? (language === 'en' ? 'Already registered? Sign in here' : 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக')
                : (language === 'en' ? 'New property? Register as a Manager' : 'புதிய உணவகமா? மேலாளராக பதிவு செய்க')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
