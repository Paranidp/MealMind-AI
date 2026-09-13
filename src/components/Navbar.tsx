import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Building2,
  ChevronDown,
  LogOut,
  User,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { Language, ManagerUser } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  currentView: 'dashboard' | 'workflow' | 'result';
  onNavigateDashboard: () => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  currentUser: ManagerUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateDashboard,
  language,
  onToggleLanguage,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-[#0B132B] border-b border-slate-800 text-white shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Property Identity */}
          <div className="flex items-center space-x-4">
            <button
              id="brand-home-btn"
              onClick={onNavigateDashboard}
              className="flex items-center space-x-3 text-left focus:outline-hidden group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-800/90 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5 leading-none">
                  <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-white">
                    MealMind
                  </span>
                  <span className="text-[11px] font-sans font-semibold tracking-wider text-amber-400">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 tracking-wide block mt-0.5">
                  {language === 'en' ? 'Kitchen Preparation Platform' : 'சமையலறை திட்டமிடல் தளம்'}
                </span>
              </div>
            </button>

            {/* Property Badge (Desktop) */}
            <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-800 text-xs text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-amber-500/80" />
              <span className="font-medium text-slate-300">
                {currentUser?.propertyName || 'The Grand Horizon Hotel'}
              </span>
            </div>
          </div>

          {/* Right Navigation & Controls */}
          <div className="hidden sm:flex items-center space-x-3">
            {currentView !== 'dashboard' && (
              <button
                id="nav-dashboard-return-btn"
                onClick={onNavigateDashboard}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer mr-1"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{t.navDashboard}</span>
              </button>
            )}

            {/* Language Switcher (Subtle, refined pill) */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                id="lang-btn-en"
                onClick={() => onToggleLanguage('en')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  language === 'en'
                    ? 'bg-slate-800 text-amber-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                id="lang-btn-ta"
                onClick={() => onToggleLanguage('ta')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  language === 'ta'
                    ? 'bg-slate-800 text-amber-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="தமிழ்"
              >
                தமிழ்
              </button>
            </div>

            {/* User Profile & Simple Logout */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    id="user-profile-menu-button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2.5 bg-slate-900/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-semibold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-medium text-slate-200 leading-tight truncate max-w-[130px]">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {currentUser.role}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#0F172A] border border-slate-800 rounded-xl shadow-xl py-2 z-50">
                      <div className="px-4 py-2.5 border-b border-slate-800 text-xs">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-amber-500/90">
                          {currentUser.role}
                        </p>
                        <p className="font-semibold text-white mt-0.5">{currentUser.name}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5 truncate">{currentUser.propertyName}</p>
                        <p className="text-slate-500 text-[10px] truncate">{currentUser.email}</p>
                        {currentUser.phone && (
                          <p className="text-slate-500 text-[10px] truncate">{currentUser.phone}</p>
                        )}
                      </div>

                      <button
                        id="menu-sign-out-btn"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-slate-800/80 flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t.logout}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Direct Simple Logout Button */}
                <button
                  id="header-direct-logout-btn"
                  onClick={onLogout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors cursor-pointer border border-slate-800 hover:border-rose-900/50"
                  title={t.logout}
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden md:inline">{t.logout}</span>
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </button>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              id="mobile-lang-btn"
              onClick={() => onToggleLanguage(language === 'en' ? 'ta' : 'en')}
              className="px-2 py-1 text-xs rounded bg-slate-900 border border-slate-800 text-amber-400 font-medium"
            >
              {language === 'en' ? 'தமிழ்' : 'EN'}
            </button>

            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#070D1F] border-b border-slate-800 px-4 py-3 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
            <span className="font-medium text-amber-400">
              {currentUser?.propertyName || 'The Grand Horizon Hotel'}
            </span>
          </div>

          {currentView !== 'dashboard' && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateDashboard();
              }}
              className="w-full text-left py-2 text-xs font-medium text-slate-200 flex items-center space-x-2"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>{t.navDashboard}</span>
            </button>
          )}

          {currentUser ? (
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400">{currentUser.role}</p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="text-xs text-rose-400 px-2 py-1 rounded bg-slate-900 border border-slate-800"
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-lg text-center"
            >
              {t.login}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
