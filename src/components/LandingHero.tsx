import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  Clock,
  Layers,
  ShieldCheck,
  Building,
  CheckCircle2,
  Cpu,
  ChefHat,
  BarChart3,
  Flame
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface LandingHeroProps {
  language: Language;
  onStartWorkflow: () => void;
  onOpenDashboard: () => void;
  onOpenModelSpecs: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  language,
  onStartWorkflow,
  onOpenDashboard,
  onOpenModelSpecs,
}) => {
  const t = translations[language];

  return (
    <div className="w-full bg-[#0B132B] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-20 lg:pt-18 lg:pb-28">
        {/* Subtle decorative gold-navy radial background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-900/0 to-transparent pointer-events-none" />
        <div className="absolute -top-24 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Top hospitality badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-400 text-xs font-semibold tracking-wide uppercase shadow-inner mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.heroBadge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
              {t.heroTitle1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                {t.heroTitleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              {t.heroSubtitle}
            </p>

            {/* Primary CTA buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="hero-start-planning-btn"
                onClick={onStartWorkflow}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
              >
                <span>{t.ctaStartPlanning}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-open-dashboard-btn"
                onClick={onOpenDashboard}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 hover:border-amber-500/40 transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>{t.ctaExploreDashboard}</span>
              </button>
            </div>

            {/* Micro-trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'en' ? 'Trained Random Forest Regressors' : 'பயிற்சி பெற்ற ரேண்டம் ஃபாரஸ்ட் அல்காரிதம்'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'en' ? 'Staggered 60/40 Batch Logic' : '60/40 தொகுதி சமையல் கணக்கீடு'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'en' ? 'Bilingual English & தமிழ்' : 'இருமொழி இடைமுகம்'}</span>
              </div>
            </div>
          </div>

          {/* Luxury White Content Area Preview Panel */}
          <div className="mt-16 bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
                    RF
                  </div>
                  <h3 className="font-serif font-bold text-xl text-slate-900">
                    {language === 'en' ? 'Executive Culinary Operations Overview' : 'ஹோட்டல் சமையலறை செயல்பாட்டுப் பார்வை'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'en'
                    ? 'Automated demand projection based on hotel occupancy, day seasonality, and banquet heads'
                    : 'அறை முன்பதிவு மற்றும் விருந்தினர் வருகையின் அடிப்படையிலான துல்லிய கணிப்பு'}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{language === 'en' ? 'Target: Zero Buffet Waste' : 'இலக்கு: பூஜ்ஜிய உணவு விரயம்'}</span>
                </span>
                <button
                  onClick={onOpenModelSpecs}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center space-x-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'View Model Pipeline' : 'மாதிரி விவரங்கள்'}</span>
                </button>
              </div>
            </div>

            {/* Quick 3-Pillar Hospitality Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* Pillar 1 */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#0B132B] text-amber-400 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{t.keyFeature1Title}</h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{t.keyFeature1Desc}</p>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{language === 'en' ? 'Phase 1: 60% Early' : 'கட்டம் 1: 60% ஆரம்பம்'}</span>
                  <span className="font-semibold text-slate-800">{language === 'en' ? 'Phase 2: 40% Dynamic' : 'கட்டம் 2: 40% தேவைக்கேற்ப'}</span>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#0B132B] text-amber-400 flex items-center justify-center mb-4">
                  <Building className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{t.keyFeature2Title}</h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{t.keyFeature2Desc}</p>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{language === 'en' ? 'Input features' : 'உள்ளீடுகள்'}</span>
                  <span className="font-semibold text-slate-800">Occupancy + Weather + Banquets</span>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#0B132B] text-amber-400 flex items-center justify-center mb-4">
                  <ChefHat className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{t.keyFeature3Title}</h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{t.keyFeature3Desc}</p>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{language === 'en' ? 'Meal Timing' : 'வேளைகள்'}</span>
                  <span className="font-semibold text-slate-800">Breakfast · Lunch · Dinner</span>
                </div>
              </div>
            </div>

            {/* Model Architecture Note banner */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-amber-500 text-slate-950 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-950">{t.modelNoticeTitle}</p>
                  <p className="text-xs text-amber-800 mt-0.5">{t.modelNoticeDesc}</p>
                </div>
              </div>
              <button
                id="hero-specs-action-btn"
                onClick={onOpenModelSpecs}
                className="text-xs font-bold text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-lg border border-amber-300 shadow-xs whitespace-nowrap cursor-pointer"
              >
                {language === 'en' ? 'Inspect RF Specs' : 'மாதிரி விவரங்கள்'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
