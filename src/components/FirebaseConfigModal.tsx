/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Flame, CheckCircle2, AlertTriangle, ExternalLink, KeyRound, Copy, Check } from 'lucide-react';
import {
  isFirebaseConfigured,
  getStoredFirebaseConfig,
  saveFirebaseConfig,
  clearFirebaseConfig,
  FirebaseClientConfig,
} from '../services/firebaseAuth';
import { Language } from '../types';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onConfigUpdated: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
  language,
  onConfigUpdated,
}) => {
  const currentConfig = getStoredFirebaseConfig();
  const configured = isFirebaseConfigured();

  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');
  const [projectId, setProjectId] = useState(currentConfig?.projectId || '');
  const [authDomain, setAuthDomain] = useState(currentConfig?.authDomain || '');
  const [appId, setAppId] = useState(currentConfig?.appId || '');
  const [jsonPaste, setJsonPaste] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);

  if (!isOpen) return null;

  const handleParseJson = () => {
    try {
      setJsonError(null);
      // Clean up JS object text if user pasted const firebaseConfig = { ... }
      let cleanText = jsonPaste.trim();
      if (cleanText.includes('{')) {
        cleanText = cleanText.substring(cleanText.indexOf('{'), cleanText.lastIndexOf('}') + 1);
        // Replace unquoted keys with quoted keys if needed
        cleanText = cleanText.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
        // Replace single quotes with double quotes
        cleanText = cleanText.replace(/'/g, '"');
      }
      const parsed = JSON.parse(cleanText);
      if (parsed.apiKey) setApiKey(parsed.apiKey);
      if (parsed.projectId) setProjectId(parsed.projectId);
      if (parsed.authDomain) setAuthDomain(parsed.authDomain);
      if (parsed.appId) setAppId(parsed.appId);
      setJsonPaste('');
    } catch (e: any) {
      setJsonError('Could not parse configuration object. Please check the JSON format or enter fields below.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || !projectId.trim()) {
      setJsonError('API Key and Project ID are required.');
      return;
    }

    const newConfig: FirebaseClientConfig = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      appId: appId.trim() || 'mealmind-web-app',
    };

    saveFirebaseConfig(newConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onConfigUpdated();
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    clearFirebaseConfig();
    setApiKey('');
    setProjectId('');
    setAuthDomain('');
    setAppId('');
    onConfigUpdated();
  };

  const envSample = `VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_PROJECT_ID="mealmind-hotel-app"
VITE_FIREBASE_APP_ID="1:123456:web:abcd"
VITE_FIREBASE_AUTH_DOMAIN="mealmind-hotel-app.firebaseapp.com"`;

  const copyEnvSample = () => {
    navigator.clipboard.writeText(envSample);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0B132B] px-6 py-4.5 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                {language === 'en' ? 'Firebase Authentication Setup' : 'ஃபயர்பேஸ் அங்கீகார அமைப்பு'}
              </h3>
              <p className="text-xs text-amber-400/90 font-medium">
                {configured
                  ? (language === 'en' ? 'Live Cloud Firebase Connected' : 'நேரடி ஃபயர்பேஸ் இணைக்கப்பட்டுள்ளது')
                  : (language === 'en' ? 'Configuration & Credentials Guide' : 'அமைப்பு மற்றும் சான்றுகள் வழிகாட்டி')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Status Alert */}
          {configured ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs">
                  {language === 'en' ? 'Firebase Project Connected' : 'ஃபயர்பேஸ் திட்டம் இணைக்கப்பட்டுள்ளது'}
                </p>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Project: <span className="font-mono font-bold">{currentConfig?.projectId}</span> · Live Email/Password authentication is active.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200/90 flex items-start space-x-3 text-amber-950">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">
                  {language === 'en' ? 'Firebase Configuration Required for Live Cloud Auth' : 'நேரடி மேகக்கணிக்கு ஃபயர்பேஸ் அமைப்பு தேவை'}
                </p>
                <p className="text-slate-700 mt-1 leading-relaxed">
                  To authenticate against your live Google Firebase project, provide your Firebase Web App credentials below or declare them in <span className="font-mono font-semibold bg-white/80 px-1 py-0.5 rounded border border-amber-200">.env</span>.
                </p>
              </div>
            </div>
          )}

          {/* Step by Step Guide */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>{language === 'en' ? 'Required Steps to Configure Live Firebase' : 'நேரடி ஃபயர்பேஸை அமைப்பதற்கான படிகள்'}</span>
            </h4>
            <ol className="list-decimal pl-4 space-y-2 text-slate-700 leading-relaxed">
              <li>
                <strong>Create / Select Project:</strong> Open the{' '}
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-700 underline font-medium inline-flex items-center gap-0.5 hover:text-amber-900"
                >
                  Firebase Console <ExternalLink className="w-3 h-3" />
                </a>{' '}
                and create or choose your project.
              </li>
              <li>
                <strong>Enable Email/Password Sign-In:</strong> Go to <strong>Build &gt; Authentication &gt; Sign-in method</strong>, select <strong>Email/Password</strong>, and toggle <strong>Enable</strong>.
              </li>
              <li>
                <strong>Register Web App:</strong> Go to <strong>Project Settings &gt; General &gt; Your apps &gt; Web App</strong> to get your config credentials.
              </li>
              <li>
                <strong>Paste Credentials:</strong> Paste your credentials below, or add them to your environment secrets.
              </li>
            </ol>
          </div>

          {/* Quick Paste JSON / Config Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800">
                {language === 'en' ? 'Quick Paste Firebase Config Object' : 'ஃபயர்பேஸ் அமைப்பை ஒட்டவும்'}
              </label>
              <button
                type="button"
                onClick={copyEnvSample}
                className="text-[11px] font-medium text-amber-700 hover:text-amber-900 flex items-center space-x-1 cursor-pointer"
              >
                {copiedSample ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSample ? 'Copied .env sample' : 'Copy .env format'}</span>
              </button>
            </div>
            <div className="flex space-x-2">
              <textarea
                value={jsonPaste}
                onChange={(e) => setJsonPaste(e.target.value)}
                placeholder={'{\n  "apiKey": "AIzaSy...",\n  "projectId": "my-hotel-app",\n  "appId": "1:123:web:..."\n}'}
                rows={3}
                className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
              />
              <button
                type="button"
                onClick={handleParseJson}
                disabled={!jsonPaste.trim()}
                className="px-3 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                Auto Fill
              </button>
            </div>
            {jsonError && <p className="text-xs text-rose-600 font-medium">{jsonError}</p>}
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSave} className="space-y-3 pt-2 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  API Key <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  required
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="mealmind-app-123"
                  required
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Auth Domain</label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="project-id.firebaseapp.com"
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">App ID</label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="1:12345678:web:abcdef"
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                />
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Firebase credentials saved! Live authentication initialized.</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3">
              {configured ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                >
                  Reset / Disconnect Firebase
                </button>
              ) : (
                <span className="text-[11px] text-slate-500">
                  Awaiting credentials
                </span>
              )}

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Save &amp; Connect Firebase
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
