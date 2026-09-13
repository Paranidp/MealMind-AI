import React from 'react';
import { UtensilsCrossed, ShieldCheck, Cpu, Building2 } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
  onOpenModelSpecs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenModelSpecs }) => {
  return (
    <footer className="bg-[#070D1F] border-t border-slate-800 text-slate-400 py-10 print:hidden text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-white text-sm">
                MealMind <span className="text-amber-400">AI</span>
              </span>
              <p className="text-[11px] text-slate-400">
                {language === 'en'
                  ? 'Hospitality Food Demand Forecasting & Kitchen Preparation Planning Engine'
                  : 'ஹோட்டல் உணவுத் தேவை முன்கணிப்பு மற்றும் சமையலறை திட்டமிடல் தளம்'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
            <button
              id="footer-ml-specs-link"
              onClick={onOpenModelSpecs}
              className="text-amber-400/90 hover:text-amber-300 hover:underline flex items-center space-x-1"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Random Forest Pipeline Specs' : 'ML மாதிரி விவரங்கள்'}</span>
            </button>
            <div className="flex items-center space-x-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'Staggered 60/40 Batch Logic' : '60/40 தொகுதி கட்டமைப்பு'}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'Hotel & Restaurant Management' : 'ஹோட்டல் & உணவக மேலாண்மை'}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} MealMind AI Hospitality Technologies. All rights reserved.</p>
          <p className="text-slate-400">
            {language === 'en'
              ? 'Engineered for executive chefs, F&B directors, and hotel operations.'
              : 'தலைமை செஃப் மற்றும் ஹோட்டல் நிர்வாகத்திற்கான பிரத்யேக தளம்.'}
          </p>
        </div>
      </div>
    </footer>
  );
};
