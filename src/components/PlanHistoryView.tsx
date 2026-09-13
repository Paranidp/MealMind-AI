import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Coffee,
  Sun,
  Moon,
  FileText,
  Search,
  PlusCircle,
  ChefHat,
  Filter,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { Language, PreparationPlan, MealSlot } from '../types';
import { translations } from '../translations';

interface PlanHistoryViewProps {
  plans: PreparationPlan[];
  language: Language;
  onViewPlan: (plan: PreparationPlan) => void;
  onStartNewPlan: () => void;
}

export const PlanHistoryView: React.FC<PlanHistoryViewProps> = ({
  plans,
  language,
  onViewPlan,
  onStartNewPlan,
}) => {
  const t = translations[language];
  const [filterSlot, setFilterSlot] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPlans = plans.filter((plan) => {
    const matchesSlot = filterSlot === 'all' || plan.mealSlot === filterSlot;
    const matchesSearch =
      plan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.date.includes(searchQuery) ||
      plan.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSlot && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            {language === 'en' ? 'Kitchen Logs & Archive' : 'சமையலறை பதிவுகள்'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-0.5">
            {t.navHistory}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'en'
              ? 'Review historical preparation quantities, batch breakdowns, and chef execution logs'
              : 'முந்தைய சமையல் திட்டங்கள் மற்றும் தொகுதிகளின் தொகுப்பு'}
          </p>
        </div>

        <button
          id="history-start-plan-btn"
          onClick={onStartNewPlan}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#162447] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>{t.quickPlanAction}</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="history-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Filter by Plan ID, Date...' : 'தேடுக...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Slot Filters */}
        <div className="flex items-center space-x-2 text-xs w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: language === 'en' ? 'All Services' : 'அனைத்தும்' },
            { id: 'breakfast', label: t.breakfastService },
            { id: 'lunch', label: t.lunchService },
            { id: 'dinner', label: t.dinnerService },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterSlot(item.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterSlot === item.id
                  ? 'bg-[#0B132B] text-amber-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plans List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredPlans.length === 0 ? (
          <div className="p-12 text-center">
            <ChefHat className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">{t.noRecentPlans}</p>
            <button
              onClick={onStartNewPlan}
              className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
            >
              {t.quickPlanAction}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0B132B] shrink-0 mt-0.5">
                    {plan.mealSlot === 'breakfast' && <Coffee className="w-5 h-5 text-amber-700" />}
                    {plan.mealSlot === 'lunch' && <Sun className="w-5 h-5 text-orange-600" />}
                    {plan.mealSlot === 'dinner' && <Moon className="w-5 h-5 text-indigo-700" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {plan.mealSlot === 'breakfast' && t.breakfastService}
                        {plan.mealSlot === 'lunch' && t.lunchService}
                        {plan.mealSlot === 'dinner' && t.dinnerService}
                        {' - '}
                        {plan.serviceType.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {plan.id}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>{plan.date}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-700">
                        {plan.totalGuestsTarget} {language === 'en' ? 'Target Diners' : 'விருந்தினர்கள்'}
                      </span>
                      <span>•</span>
                      <span>
                        {plan.prepItems.length} {language === 'en' ? 'Dishes Planned' : 'உணவுகள்'}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">
                        {plan.modelInfo.modelName}
                      </span>
                    </div>

                    {plan.chefNotes && (
                      <p className="mt-1.5 text-xs text-slate-600 italic line-clamp-1">
                        &quot;{plan.chefNotes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end lg:self-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      plan.status === 'kitchen_dispatched'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {plan.status === 'kitchen_dispatched'
                      ? (language === 'en' ? 'Dispatched to Kitchen' : 'சமையலறைக்கு அனுப்பப்பட்டது')
                      : (language === 'en' ? 'Plan Ready' : 'திட்டம் தயார்')}
                  </span>

                  <button
                    id={`history-view-plan-${plan.id}`}
                    onClick={() => onViewPlan(plan)}
                    className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t.viewDetails}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
