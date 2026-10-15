import React from 'react';
import { PatientSession } from '../types';
import { DollarSign, Users, CalendarCheck, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DashboardStatsProps {
  sessions: PatientSession[];
  currency: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ sessions, currency }) => {
  const totalSessions = sessions.length;
  
  const totalRevenue = sessions.reduce((acc, s) => acc + s.totalPrice, 0);
  const totalPaid = sessions.reduce((acc, s) => acc + s.paidAmount, 0);
  const totalPending = totalRevenue - totalPaid;

  const avgSessionPrice = totalSessions > 0 ? Math.round(totalRevenue / totalSessions) : 0;
  
  const uniquePatients = new Set(sessions.map(s => s.clientName.trim())).size;

  const collectionRate = totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 my-6">
      
      {/* Card 1: Total Revenue */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-teal-500/50 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">إجمالي الإيرادات</span>
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums tracking-tight">
            {totalRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-500">{currency}</span>
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>المحصل: {totalPaid.toLocaleString()} {currency}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Total Sessions & Cases */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-teal-500/50 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">عدد الجلسات والحالات</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums tracking-tight">
            {totalSessions} <span className="text-xs font-normal text-slate-500">جلسة</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            لعدد <span className="font-semibold text-slate-700">{uniquePatients}</span> عميل فريد
          </div>
        </div>
      </div>

      {/* Card 3: Average Session Price */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-teal-500/50 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">متوسط سعر الجلسة</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums tracking-tight">
            {avgSessionPrice.toLocaleString()} <span className="text-xs font-normal text-slate-500">{currency}</span>
          </div>
          <div className="text-xs text-indigo-600 font-medium mt-1">
            شامل الإضافات والخصومات
          </div>
        </div>
      </div>

      {/* Card 4: Pending / Due Payments */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-teal-500/50 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">المبالغ الآجلة / المعلقة</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-700 font-mono tabular-nums tracking-tight">
            {totalPending.toLocaleString()} <span className="text-xs font-normal text-slate-500">{currency}</span>
          </div>
          <div className="text-xs text-amber-600 mt-1 font-medium">
            تحتاج متابعة التحصيل
          </div>
        </div>
      </div>

      {/* Card 5: Collection Rate */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-teal-500/50 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">نسبة التحصيل</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums tracking-tight">
            {collectionRate}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(collectionRate, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

    </div>
  );
};
