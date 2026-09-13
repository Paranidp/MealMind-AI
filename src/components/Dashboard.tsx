import React from 'react';
import {
  Calendar,
  ArrowRight,
  FileText,
  Clock,
  Sparkles,
  UtensilsCrossed,
  CheckCircle2
} from 'lucide-react';
import { Language, ManagerUser, PreparationPlan } from '../types';
import { translations } from '../translations';

interface DashboardProps {
  language: Language;
  currentUser: ManagerUser | null;
  plans: PreparationPlan[];
  onStartPlanning: () => void;
  onViewPlan: (plan: PreparationPlan) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  language,
  currentUser,
  plans,
  onStartPlanning,
  onViewPlan,
}) => {
  const t = translations[language];

  const todayFormatted = new Date().toLocaleDateString(
    language === 'ta' ? 'ta-IN' : 'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Executive Welcome & Context Header */}
      <div className="bg-[#0B132B] rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayFormatted}</span>
              <span className="text-slate-600">·</span>
              <span>{currentUser?.propertyName || 'The Grand Horizon Hotel'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
              {currentUser
                ? `${t.welcomeBack}, ${currentUser.name}`
                : `${t.welcomeBack}, Manager`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {language === 'en'
                ? 'Central kitchen production planning and food demand forecasting engine.'
                : 'மைய சமையலறை செயல்பாடுகள் மற்றும் உணவுத் தேவை முன்கணிப்பு பலகை.'}
            </p>
          </div>

          <div className="text-left md:text-right text-xs text-slate-400 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-amber-400/90 block font-semibold">
              {currentUser?.role || 'Hospitality Management'}
            </span>
            <span className="text-slate-300 font-mono text-[11px]">
              {currentUser?.propertyLocation || 'Chennai Central Corridor'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Card: Start Planning */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-700 border border-amber-200/80">
            <UtensilsCrossed className="w-7 h-7" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              {language === 'en' ? 'Daily Culinary Production' : 'தினசரி சமையலறை திட்டமிடல்'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              {language === 'en'
                ? 'Plan Food Preparation'
                : 'சமையல் தயாரிப்பை திட்டமிடுங்கள்'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {language === 'en'
                ? 'Generate ML-driven food preparation quantities for Breakfast, Lunch, and Dinner tailored to expected customers and operating conditions.'
                : 'எதிர்பார்க்கப்படும் வாடிக்கையாளர்கள் மற்றும் அன்றைய சூழலுக்கு ஏற்ப காலை, மதிய மற்றும் இரவு உணவு தயாரிப்பு அளவுகளை துல்லியமாக உருவாக்குங்கள்.'}
            </p>
          </div>

          {/* ONE Primary Action Button */}
          <div className="pt-2">
            <button
              id="start-planning-primary-btn"
              onClick={onStartPlanning}
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-xl text-sm sm:text-base font-bold bg-[#0B132B] hover:bg-[#162447] text-white border border-amber-500/40 shadow-sm transition-all duration-150 cursor-pointer group"
            >
              <span>{t.startPlanning}</span>
              <ArrowRight className="w-5 h-5 text-amber-400 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-500 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{language === 'en' ? 'Breakfast · Lunch · Dinner' : 'காலை · மதியம் · இரவு உணவு'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{language === 'en' ? 'Condition-tuned quantities' : 'சூழலுக்கு ஏற்ற துல்லிய அளவுகள்'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{language === 'en' ? 'Instant kitchen prep sheets' : 'உடனடி சமையல் தாள்'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Production Plan History / Kitchen Logs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg text-slate-900">
              {t.recentPlansTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'en'
                ? 'Authorized preparation sheets for kitchen production'
                : 'சமையலறை தயாரிப்பிற்காக அங்கீகரிக்கப்பட்ட தாள்கள்'}
            </p>
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            <p>{t.recentPlansEmpty}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {plans.map((plan) => {
              const mealNames = (plan.mealSlots && plan.mealSlots.length > 0)
                ? plan.mealSlots.map((s) => s.toUpperCase()).join(' & ')
                : plan.mealSlot ? plan.mealSlot.toUpperCase() : 'MEAL';

              return (
                <div
                  key={plan.id}
                  className="p-5 sm:p-6 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {mealNames}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {plan.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          plan.status === 'kitchen_dispatched'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {plan.status === 'kitchen_dispatched'
                          ? (language === 'en' ? 'Dispatched to Kitchen' : 'சமையலறைக்கு அனுப்பப்பட்டது')
                          : (language === 'en' ? 'Plan Ready' : 'தயார்')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 text-xs text-slate-500 pt-0.5">
                      <span>{plan.date}</span>
                      <span>·</span>
                      <span>
                        <strong className="text-slate-800">{plan.totalGuestsTarget}</strong>{' '}
                        {language === 'en' ? 'Expected Customers' : 'வாடிக்கையாளர்கள்'}
                      </span>
                      <span>·</span>
                      <span>
                        <strong className="text-slate-800">{plan.prepItems.length}</strong>{' '}
                        {language === 'en' ? 'Dishes Planned' : 'உணவுகள்'}
                      </span>
                    </div>

                    {plan.summaryNote && (
                      <p className="text-xs text-slate-600 mt-1">
                        {plan.summaryNote}
                      </p>
                    )}
                  </div>

                  <button
                    id={`dashboard-view-plan-${plan.id}`}
                    onClick={() => onViewPlan(plan)}
                    className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer self-start sm:self-center shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t.viewDetails}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
