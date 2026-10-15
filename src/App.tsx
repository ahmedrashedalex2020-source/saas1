import React, { useState, useEffect } from 'react';
import { PatientSession, CenterSettings } from './types';
import { initialSessions, initialSettings } from './data/mockData';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { SessionsTable } from './components/SessionsTable';
import { SessionModal } from './components/SessionModal';
import { AnalyticsView } from './components/AnalyticsView';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { SettingsView } from './components/SettingsView';
import { Activity, Plus, Calendar, BarChart3, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [sessions, setSessions] = useState<PatientSession[]>(() => {
    const saved = localStorage.getItem('pt_sessions_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return initialSessions;
  });

  const [settings, setSettings] = useState<CenterSettings>(() => {
    const saved = localStorage.getItem('pt_settings_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return initialSettings;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'sessions' | 'analytics' | 'settings'>('dashboard');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<PatientSession | null>(null);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  // Save to localStorage whenever sessions or settings change
  useEffect(() => {
    localStorage.setItem('pt_sessions_data', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('pt_settings_data', JSON.stringify(settings));
  }, [settings]);

  const handleOpenAddModal = () => {
    setSessionToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditSession = (session: PatientSession) => {
    setSessionToEdit(session);
    setIsModalOpen(true);
  };

  const handleSaveSession = (savedSession: PatientSession) => {
    setSessions(prev => {
      const exists = prev.some(s => s.id === savedSession.id);
      if (exists) {
        return prev.map(s => s.id === savedSession.id ? savedSession : s);
      } else {
        return [savedSession, ...prev];
      }
    });
  };

  const handleDeleteSession = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الجلسة والسجل؟')) {
      setSessions(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleResetDemoData = () => {
    setSessions(initialSessions);
    setSettings(initialSettings);
  };

  return (
    <div className="min-h-screen bg-slate-900/5 text-slate-900 font-sans antialiased flex flex-col selection:bg-teal-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        centerName={settings.centerName}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Hero Welcome Banner */}
            <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="space-y-2 z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-600/50 border border-teal-400/30 text-teal-100 text-xs font-medium">
                  <Activity className="w-3.5 h-3.5 text-teal-300" />
                  <span>نظام إدارة مراكز العلاج الطبيعي وإعادة التأهيل</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  مرحباً بك في لوحة تحكم {settings.centerName}
                </h2>
                <p className="text-teal-100 text-xs md:text-sm leading-relaxed">
                  تابع حضور الحالات المرضية، أسعار الجلسات، البنود الإضافية والخصومات، واحصل على إحصائيات مالية دقيقة أسبوعياً وشهرياً.
                </p>
              </div>

              <div className="flex items-center gap-3 z-10 shrink-0">
                <button
                  onClick={handleOpenAddModal}
                  className="px-5 py-3 text-xs font-bold text-teal-900 bg-white hover:bg-teal-50 rounded-2xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>تسجيل حضور جلسة جديدة</span>
                </button>
                <button
                  onClick={() => setIsAiAdvisorOpen(true)}
                  className="px-4 py-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-2xl shadow-lg transition-all flex items-center gap-2 border border-purple-400/30"
                >
                  <Activity className="w-4 h-4" />
                  <span>تحليل الذكاء الاصطناعي</span>
                </button>
              </div>
            </div>

            {/* Dashboard Stats */}
            <DashboardStats sessions={sessions} currency={settings.defaultCurrency} />

            {/* Recent Sessions Table Preview */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">أحدث الجلسات والحالات المسجلة</h3>
                <button
                  onClick={() => setActiveTab('sessions')}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  <span>عرض كل السجل</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <SessionsTable
                sessions={sessions}
                onEditSession={handleEditSession}
                onDeleteSession={handleDeleteSession}
                onAddSession={handleOpenAddModal}
                currency={settings.defaultCurrency}
              />
            </div>

          </div>
        )}

        {/* Tab 2: Sessions Table */}
        {activeTab === 'sessions' && (
          <SessionsTable
            sessions={sessions}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
            onAddSession={handleOpenAddModal}
            currency={settings.defaultCurrency}
          />
        )}

        {/* Tab 3: Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsView sessions={sessions} currency={settings.defaultCurrency} />
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={(newSet) => setSettings(newSet)}
            onResetDemoData={handleResetDemoData}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            جميع الحقوق محفوظة © 2026 - {settings.centerName}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('sessions')} className="hover:text-teal-600 transition-colors">السجل</button>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-teal-600 transition-colors">الإحصائيات</button>
            <button onClick={() => setActiveTab('settings')} className="hover:text-teal-600 transition-colors">الإعدادات</button>
          </div>
        </div>
      </footer>

      {/* Add / Edit Session Modal */}
      <SessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSession}
        sessionToEdit={sessionToEdit}
        commonConditions={settings.commonConditions}
        commonExtraItems={settings.commonExtraItems}
        defaultSessionPrice={settings.defaultSessionPrice}
        currency={settings.defaultCurrency}
      />

      {/* AI Advisor Modal */}
      <AiAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        sessions={sessions}
        currency={settings.defaultCurrency}
      />

    </div>
  );
}
