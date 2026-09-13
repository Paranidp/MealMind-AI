/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, ManagerUser, PreparationPlan, MealSlot } from './types';
import { DEFAULT_MANAGER, INITIAL_PLANS } from './data/initialState';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { GuidedWorkflow } from './components/GuidedWorkflow';
import { PlanResultView } from './components/PlanResultView';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { ModelArchitectureModal } from './components/ModelArchitectureModal';
import { Footer } from './components/Footer';
import { getStoredSession, logoutManager } from './services/firebaseAuth';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<'dashboard' | 'workflow' | 'result'>('dashboard');
  
  // Authenticated Manager Session (null if logged out, or active session)
  const [currentUser, setCurrentUser] = useState<ManagerUser | null>(() => getStoredSession());
  
  const [plans, setPlans] = useState<PreparationPlan[]>(INITIAL_PLANS);
  const [activePlan, setActivePlan] = useState<PreparationPlan | null>(INITIAL_PLANS[0] || null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isModelSpecsModalOpen, setIsModelSpecsModalOpen] = useState(false);

  // Handlers
  const handleToggleLanguage = (newLang: Language) => {
    setLanguage(newLang);
  };

  const handleViewPlan = (plan: PreparationPlan) => {
    setActivePlan(plan);
    setCurrentView('result');
  };

  const handleCompletePlan = (newPlan: PreparationPlan) => {
    setPlans([newPlan, ...plans]);
    setActivePlan(newPlan);
    setCurrentView('result');
  };

  const handleUpdatePlanStatus = (
    planId: string,
    status: 'planned' | 'kitchen_dispatched' | 'completed'
  ) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, status } : p))
    );
    if (activePlan && activePlan.id === planId) {
      setActivePlan({ ...activePlan, status });
    }
  };

  const handleLogout = async () => {
    await logoutManager();
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleSuccessLogin = (user: ManagerUser) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    setIsAuthModalOpen(false);
  };

  // If manager is not logged in, render the dedicated, responsive Authentication Page
  if (!currentUser) {
    return (
      <AuthPage
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onSuccessLogin={handleSuccessLogin}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigateDashboard={() => setCurrentView('dashboard')}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area: Simplified Direct Journey */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <Dashboard
            language={language}
            currentUser={currentUser}
            plans={plans}
            onStartPlanning={() => setCurrentView('workflow')}
            onViewPlan={handleViewPlan}
          />
        )}

        {currentView === 'workflow' && (
          <GuidedWorkflow
            language={language}
            onCancel={() => setCurrentView('dashboard')}
            onCompletePlan={handleCompletePlan}
          />
        )}

        {currentView === 'result' && activePlan && (
          <PlanResultView
            plan={activePlan}
            language={language}
            onBackToDashboard={() => setCurrentView('dashboard')}
            onStartNewPlan={() => setCurrentView('workflow')}
            onUpdatePlanStatus={handleUpdatePlanStatus}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onOpenModelSpecs={() => setIsModelSpecsModalOpen(true)}
      />

      {/* Manager Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onSuccessLogin={handleSuccessLogin}
      />

      {/* Technical Random Forest Architecture Modal */}
      <ModelArchitectureModal
        isOpen={isModelSpecsModalOpen}
        onClose={() => setIsModelSpecsModalOpen(false)}
        language={language}
      />
    </div>
  );
}
