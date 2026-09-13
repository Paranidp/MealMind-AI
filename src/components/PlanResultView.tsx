import React, { useState } from 'react';
import {
  Printer,
  Send,
  ArrowLeft,
  CheckCircle2,
  UtensilsCrossed,
  Layers,
  Calendar,
  Users,
  Check,
  Plus
} from 'lucide-react';
import { Language, PreparationPlan, MealSlot } from '../types';
import { translations } from '../translations';

interface PlanResultViewProps {
  plan: PreparationPlan;
  language: Language;
  onBackToDashboard: () => void;
  onStartNewPlan?: () => void;
  onUpdatePlanStatus?: (planId: string, status: 'planned' | 'kitchen_dispatched' | 'completed') => void;
}

export const PlanResultView: React.FC<PlanResultViewProps> = ({
  plan,
  language,
  onBackToDashboard,
  onStartNewPlan,
  onUpdatePlanStatus,
}) => {
  const t = translations[language];
  const [currentStatus, setCurrentStatus] = useState(plan.status);
  const [chefApproved, setChefApproved] = useState(plan.status === 'kitchen_dispatched');

  const handlePrint = () => {
    window.print();
  };

  const handleDispatch = () => {
    setCurrentStatus('kitchen_dispatched');
    setChefApproved(true);
    if (onUpdatePlanStatus) {
      onUpdatePlanStatus(plan.id, 'kitchen_dispatched');
    }
  };

  // Determine selected meal slots
  const mealSlots: MealSlot[] =
    plan.mealSlots && plan.mealSlots.length > 0
      ? plan.mealSlots
      : plan.mealSlot
      ? [plan.mealSlot]
      : ['breakfast'];

  // Map meal slot titles
  const getMealTitle = (slot: MealSlot) => {
    if (slot === 'breakfast') return language === 'en' ? 'Breakfast' : 'காலை உணவு';
    if (slot === 'lunch') return language === 'en' ? 'Lunch' : 'மதிய உணவு';
    return language === 'en' ? 'Dinner' : 'இரவு உணவு';
  };

  // Group prep items by meal slot
  const itemsByMealSlot = mealSlots.reduce((acc, slot) => {
    const items = plan.prepItems.filter((item) => item.mealSlot === slot);
    acc[slot] = items;
    return acc;
  }, {} as Record<MealSlot, typeof plan.prepItems>);

  // Summary message
  const summaryMessage =
    plan.summaryNote ||
    (language === 'en'
      ? `Preparation plan generated for ${plan.totalGuestsTarget} expected customers.`
      : `${plan.totalGuestsTarget} வாடிக்கையாளர்களுக்கான சமையல் தயாரிப்பு திட்டம் உருவாக்கப்பட்டது.`);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 print:p-0 print:m-0 print:max-w-full">
      {/* Top Bar with Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 print:hidden">
        <div className="flex items-center space-x-3">
          <button
            id="result-back-dashboard-btn"
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToDashboard}</span>
          </button>

          {onStartNewPlan && (
            <button
              id="result-start-new-plan-btn"
              onClick={onStartNewPlan}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 pl-3 border-l border-slate-300 transition-colors cursor-pointer"
            >
              + {language === 'en' ? 'Start New Plan' : 'புதிய திட்டம்'}
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="print-prep-sheet-btn"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{t.printPrepSheet}</span>
          </button>

          <button
            id="dispatch-to-kitchen-btn"
            onClick={handleDispatch}
            disabled={currentStatus === 'kitchen_dispatched'}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              currentStatus === 'kitchen_dispatched'
                ? 'bg-emerald-800 text-white cursor-default'
                : 'bg-[#0B132B] hover:bg-[#162447] text-amber-400 border border-amber-500/40 shadow-xs'
            }`}
          >
            {currentStatus === 'kitchen_dispatched' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>
                  {language === 'en' ? 'Dispatched to Kitchen' : 'சமையலறைக்கு அனுப்பப்பட்டது'}
                </span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{t.dispatchToKitchen}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Banner Card */}
      <div className="bg-[#0B132B] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm print:bg-white print:text-black print:border-black print:rounded-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1.5 print:text-black">
              <Calendar className="w-3.5 h-3.5" />
              <span>{plan.date}</span>
              <span>·</span>
              <span>MealMind AI Preparation Plan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight print:text-black">
              {mealSlots.map((s) => getMealTitle(s)).join(' & ')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 print:text-gray-700">
              {summaryMessage}
            </p>
          </div>

          <div className="text-left md:text-right text-xs text-slate-300 space-y-1 print:text-black">
            <p className="font-mono text-slate-400 text-[11px] print:text-black">
              ORDER ID: <span className="font-bold text-amber-400 print:text-black">{plan.id}</span>
            </p>
            <div className="pt-1">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                  currentStatus === 'kitchen_dispatched'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {currentStatus === 'kitchen_dispatched'
                  ? language === 'en'
                    ? 'Dispatched to Kitchen'
                    : 'சமையலறையில் செயலில்'
                  : language === 'en'
                  ? 'Plan Authorized'
                  : 'தயாரிப்பு திட்டம் தயார்'}
              </span>
            </div>
          </div>
        </div>

        {/* Small Summary Card Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 print:border-black text-xs">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wide block print:text-black">
              {language === 'en' ? 'Total Expected Diners' : 'எதிர்பார்க்கப்படும் வாடிக்கையாளர்கள்'}
            </span>
            <span className="text-2xl font-serif font-bold text-white print:text-black">
              {plan.totalGuestsTarget}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wide block print:text-black">
              {language === 'en' ? 'Meal Services' : 'உணவு சேவைகள்'}
            </span>
            <span className="text-2xl font-serif font-bold text-amber-400 print:text-black">
              {mealSlots.length}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wide block print:text-black">
              {language === 'en' ? 'Weather Condition' : 'வானிலை'}
            </span>
            <span className="text-sm font-bold text-white block mt-1 print:text-black">
              {plan.conditions?.weather || 'Normal'}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wide block print:text-black">
              {language === 'en' ? 'Target Metric' : 'இலக்கு அளவு'}
            </span>
            <span className="text-sm font-bold text-amber-400 block mt-1 print:text-black font-mono">
              Quantity Prepared
            </span>
          </div>
        </div>
      </div>

      {/* Preparation Plan Summary Note Box */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-5 text-amber-950 flex items-start space-x-3 shadow-2xs print:border-black">
        <UtensilsCrossed className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            {language === 'en' ? 'Preparation Plan Summary' : 'தயாரிப்பு திட்ட சுருக்கம்'}
          </h2>
          <p className="text-sm font-semibold text-amber-950">
            {summaryMessage}
          </p>
          {plan.chefNotes && (
            <p className="text-xs text-amber-800">
              {plan.chefNotes}
            </p>
          )}
        </div>
      </div>

      {/* SEPARATE SECTIONS FOR EACH SELECTED MEAL */}
      <div className="space-y-8">
        {mealSlots.map((slot) => {
          const items = itemsByMealSlot[slot] || [];
          const slotDetails = plan.mealDetails ? plan.mealDetails[slot] : null;
          const slotTitle = getMealTitle(slot);

          return (
            <div
              key={slot}
              id={`meal-result-section-${slot}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-black print:shadow-none"
            >
              {/* Section Header */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 print:bg-gray-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0B132B] text-amber-400 flex items-center justify-center font-bold text-xs">
                    {slot.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-slate-900">
                      {slotTitle} {language === 'en' ? 'Preparation Plan' : 'தயாரிப்பு திட்டம்'}
                    </h3>
                    {slotDetails && (
                      <span className="text-xs text-slate-500">
                        {slotDetails.expectedCustomers}{' '}
                        {language === 'en' ? 'expected customers' : 'வாடிக்கையாளர்கள்'} ·{' '}
                        {slotDetails.advanceBookings}{' '}
                        {language === 'en' ? 'advance bookings' : 'முன்பதிவுகள்'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
                  {items.length} {language === 'en' ? 'Food Items' : 'உணவு வகைகள்'}
                </div>
              </div>

              {/* Desktop Table: Food Item | Recommended Quantity | Unit */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] text-slate-600 uppercase tracking-wider font-bold">
                      <th className="py-3.5 px-6">
                        {language === 'en' ? 'Food Item' : 'உணவுப் பெயர்'}
                      </th>
                      <th className="py-3.5 px-6 text-right font-bold text-slate-900 bg-amber-50/50">
                        {language === 'en' ? 'Recommended Quantity' : 'பரிந்துரைக்கப்படும் அளவு'}
                      </th>
                      <th className="py-3.5 px-6 text-left">
                        {language === 'en' ? 'Unit' : 'அலகு (Unit)'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr
                        key={item.menuItemId}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Food Item */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900 text-sm">
                            {language === 'en' ? item.nameEn : item.nameTa}
                          </div>
                          {language === 'ta' && (
                            <div className="text-[11px] text-slate-500 font-normal">
                              {item.nameEn}
                            </div>
                          )}
                          <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide block mt-0.5">
                            {item.category}
                          </span>
                        </td>

                        {/* Recommended Quantity */}
                        <td className="py-4 px-6 text-right font-mono font-bold text-slate-950 bg-amber-50/30 text-base">
                          {item.recommendedPrepQuantity}
                        </td>

                        {/* Unit */}
                        <td className="py-4 px-6 font-semibold text-slate-700">
                          {language === 'en' ? item.unit : item.unitTa}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chef Approval Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 print:border-black">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-sm text-slate-900">
              {t.chefApproval}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'en'
                ? 'Sign off to authorize kitchen prep sheets and dispatch to cooking stations.'
                : 'சமையலறை தயாரிப்புக்கு அனுமதி வழங்க தலைமை செஃப் கையொப்பம் செய்க.'}
            </p>
          </div>

          <button
            id="chef-approval-toggle-btn"
            onClick={() => setChefApproved(!chefApproved)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition-all cursor-pointer self-start sm:self-auto ${
              chefApproved
                ? 'bg-slate-900 border-slate-900 text-amber-400'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {chefApproved && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            <span>{chefApproved ? `${t.chefApproval} (Signed)` : t.chefApproval}</span>
          </button>
        </div>

        {chefApproved && (
          <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.chefApprovedNotice}</span>
          </div>
        )}
      </div>

      {/* Print Signature Line (Visible during print) */}
      <div className="hidden print:block text-xs pt-8 border-t border-black text-black space-y-3">
        <div className="flex justify-between">
          <span>Executive Chef Signature: ___________________________</span>
          <span>Station Sous Chef: ___________________________</span>
        </div>
        <p className="text-[10px] text-gray-600">
          MealMind AI Central Kitchen Sheet · Generated on {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};
