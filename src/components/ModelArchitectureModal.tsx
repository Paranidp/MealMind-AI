import React from 'react';
import { X, Cpu, Sliders, Code2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface ModelArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ModelArchitectureModal: React.FC<ModelArchitectureModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0B132B] px-6 py-5 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">{t.mlModalTitle}</h3>
              <p className="text-xs text-amber-400 font-medium">
                Scikit-Learn Pipeline (RandomForestRegressor)
              </p>
            </div>
          </div>
          <button
            id="ml-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Executive Overview Notice */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-950 leading-relaxed">
            <p className="font-bold text-sm text-amber-900 mb-1">
              {language === 'en' ? 'Model Integration Specification' : 'இயந்திர கற்றல் மாதிரி இணைப்பு விவரம்'}
            </p>
            <p>
              {language === 'en'
                ? 'MealMind AI integrates a trained scikit-learn Pipeline saved as mealmind_model.pkl. The Pipeline contains a ColumnTransformer (OneHotEncoder for categorical features) and a RandomForestRegressor predicting Quantity_Prepared.'
                : 'இந்த தளம் பயிற்சி பெற்ற ரேண்டம் ஃபாரஸ்ட் பைலைன் மாதிரியுடன் நேரடியாக இணைக்கும் வகையில் வடிவமைக்கப்பட்டுள்ளது.'}
            </p>
          </div>

          {/* Exact 14 Features Matrix */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span>{language === 'en' ? 'Exact 14 Training Features' : 'பயிற்சி பெற்ற 14 அம்சங்கள்'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { name: 'Day_of_Week', type: 'Categorical', desc: 'Monday, Tuesday, etc.' },
                { name: 'Day_Type', type: 'Categorical', desc: 'Weekend, Weekday' },
                { name: 'Month', type: 'Numerical', desc: 'Month number (1 - 12)' },
                { name: 'Meal', type: 'Categorical', desc: 'Breakfast, Lunch, Dinner' },
                { name: 'Food_Item', type: 'Categorical', desc: 'Dosa, Idli, Biryani, etc.' },
                { name: 'Customers', type: 'Numerical', desc: 'Expected customer headcount' },
                { name: 'Advance_Bookings', type: 'Numerical', desc: 'Confirmed advance reservations' },
                { name: 'Is_Holiday', type: 'Numerical', desc: '1 for holiday, 0 otherwise' },
                { name: 'Holiday_Name', type: 'Categorical', desc: 'Holiday title or None' },
                { name: 'Festival_Name', type: 'Categorical', desc: 'Festival title or None' },
                { name: 'Festival_Type', type: 'Categorical', desc: 'Festival category or None' },
                { name: 'Special_Event', type: 'Categorical', desc: 'Event description or None' },
                { name: 'Weather', type: 'Categorical', desc: 'Normal, Hot, Rainy, Cloudy' },
                { name: 'Special_Offer', type: 'Numerical', desc: '1 for active offer, 0 otherwise' },
              ].map((feat) => (
                <div key={feat.name} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-[11px] block">{feat.name}</span>
                    <span className="text-[10px] text-slate-500">{feat.desc}</span>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shrink-0">
                    {feat.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Contract & Endpoint Scaffold */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-amber-600" />
              <span>FastAPI Backend Prediction Endpoint</span>
            </h4>
            <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
              <span className="text-emerald-400">POST</span> /api/predict
              <br />
              <span className="text-slate-500">// Inference format:</span>
              <br />
              {`{
  "selected_meals": ["breakfast", "lunch"],
  "meal_details": { ... },
  "conditions": {
    "date": "2026-09-13",
    "weather": "Normal", // Strictly: Normal, Hot, Rainy, Cloudy
    ...
  }
}`}
            </div>
          </div>

          {/* Official Output Contract */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h5 className="font-bold text-slate-900 text-xs mb-1">
              {language === 'en' ? 'Official MealMind AI Output Contract' : 'வெளியீட்டு வடிவம்'}
            </h5>
            <p className="text-slate-700 text-[11px] leading-relaxed font-semibold">
              Food Item | Recommended Quantity | Unit
            </p>
            <p className="text-slate-500 text-[10px] mt-1">
              {language === 'en'
                ? 'Direct inference of target variable Quantity_Prepared from the trained scikit-learn Pipeline.'
                : 'பயிற்சி பெற்ற ML மாதிரியிலிருந்து நேரடியாக கணக்கிடப்படும் தயாரிப்பு அளவு.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            id="ml-modal-close-action-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#0B132B] hover:bg-[#162447] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
