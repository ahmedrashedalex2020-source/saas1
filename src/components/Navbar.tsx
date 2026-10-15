import React from 'react';
import { Activity, Plus, BarChart3, Calendar, Settings, Sparkles, FileText } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'sessions' | 'analytics' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'sessions' | 'analytics' | 'settings') => void;
  onOpenAddModal: () => void;
  onOpenAiAdvisor: () => void;
  centerName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenAiAdvisor,
  centerName,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand title */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                {centerName}
              </h1>
              <span className="text-xs text-slate-500 font-medium">نظام إدارة الحضور والمدفوعات</span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'sessions'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              سجل الحالات والجلسات
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              الإحصائيات والتحليلات
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              الإعدادات
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenAiAdvisor}
              className="px-3.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">مستشار الذكاء الاصطناعي</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-teal-600/20 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة جلسة جديدة</span>
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-1 ${activeTab === 'dashboard' ? 'text-teal-600 font-bold border-b-2 border-teal-600' : ''}`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`pb-1 ${activeTab === 'sessions' ? 'text-teal-600 font-bold border-b-2 border-teal-600' : ''}`}
          >
            الجلسات
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-1 ${activeTab === 'analytics' ? 'text-teal-600 font-bold border-b-2 border-teal-600' : ''}`}
          >
            الإحصائيات
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-1 ${activeTab === 'settings' ? 'text-teal-600 font-bold border-b-2 border-teal-600' : ''}`}
          >
            الإعدادات
          </button>
        </div>

      </div>
    </header>
  );
};
