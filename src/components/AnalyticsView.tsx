import React, { useState } from 'react';
import { PatientSession } from '../types';
import { BarChart3, TrendingUp, Calendar, PieChart, DollarSign, Users, Award } from 'lucide-react';

interface AnalyticsViewProps {
  sessions: PatientSession[];
  currency: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ sessions, currency }) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('monthly');

  // Total revenue & sessions
  const totalRevenue = sessions.reduce((acc, s) => acc + s.totalPrice, 0);
  const totalPaid = sessions.reduce((acc, s) => acc + s.paidAmount, 0);
  const totalSessions = sessions.length;

  // Breakdown by condition
  const conditionStats: { [key: string]: { count: number; revenue: number } } = {};
  sessions.forEach(s => {
    if (!conditionStats[s.condition]) {
      conditionStats[s.condition] = { count: 0, revenue: 0 };
    }
    conditionStats[s.condition].count += 1;
    conditionStats[s.condition].revenue += s.totalPrice;
  });

  const sortedConditions = Object.entries(conditionStats).sort((a, b) => b[1].revenue - a[1].revenue);

  // Breakdown by payment method
  const paymentMethodStats = {
    cash: sessions.filter(s => s.paymentMethod === 'cash').reduce((acc, s) => acc + s.totalPrice, 0),
    transfer: sessions.filter(s => s.paymentMethod === 'transfer').reduce((acc, s) => acc + s.totalPrice, 0),
    card: sessions.filter(s => s.paymentMethod === 'card').reduce((acc, s) => acc + s.totalPrice, 0),
  };

  // Group by Month (YYYY-MM)
  const monthlyStats: { [key: string]: { count: number; revenue: number; paid: number } } = {};
  sessions.forEach(s => {
    const monthKey = s.sessionDate.substring(0, 7); // YYYY-MM
    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = { count: 0, revenue: 0, paid: 0 };
    }
    monthlyStats[monthKey].count += 1;
    monthlyStats[monthKey].revenue += s.totalPrice;
    monthlyStats[monthKey].paid += s.paidAmount;
  });

  const sortedMonths = Object.entries(monthlyStats).sort((a, b) => b[0].localeCompare(a[0]));

  // Group by Week (approximation using date intervals or week numbers)
  const weeklyStats: { [key: string]: { count: number; revenue: number } } = {};
  sessions.forEach(s => {
    // Simple week grouping by date prefix or day intervals
    const d = new Date(s.sessionDate);
    const weekNum = Math.ceil(d.getDate() / 7);
    const weekKey = `${s.sessionDate.substring(0, 7)} - الأسبوع ${weekNum}`;
    if (!weeklyStats[weekKey]) {
      weeklyStats[weekKey] = { count: 0, revenue: 0 };
    }
    weeklyStats[weekKey].count += 1;
    weeklyStats[weekKey].revenue += s.totalPrice;
  });

  const sortedWeeks = Object.entries(weeklyStats).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div className="space-y-6 my-6">
      
      {/* Header & View switch */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">إحصائيات وتحليلات مركز العلاج الطبيعي</h2>
          <p className="text-xs text-slate-500 mt-0.5">تقارير الإيرادات، توزيع الحالات، وتحليلات الأداء الأسبوعي والشهري</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              timeframe === 'monthly' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الإحصائيات الشهرية
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              timeframe === 'weekly' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الإحصائيات الأسبوعية
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Revenue & Collection Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500">ملخص الإيرادات والتحصيل</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-400">إجمالي الإيرادات المسجلة</div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {totalRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-500">{currency}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">المحصل فعلياً</div>
                <div className="text-sm font-bold text-emerald-600 font-mono tabular-nums">
                  {totalPaid.toLocaleString()} {currency}
                </div>
              </div>
              <div className="text-left">
                <div className="text-[11px] text-slate-400">المتبقي / الآجل</div>
                <div className="text-sm font-bold text-amber-600 font-mono tabular-nums">
                  {(totalRevenue - totalPaid).toLocaleString()} {currency}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500">طرق الدفع والتحصيل</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">نقدي (Cash)</span>
              <span className="font-bold text-slate-900 font-mono tabular-nums">{paymentMethodStats.cash.toLocaleString()} {currency}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${totalRevenue ? (paymentMethodStats.cash / totalRevenue) * 100 : 0}%` }}></div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-600 font-medium">تحويل بنكي</span>
              <span className="font-bold text-slate-900 font-mono tabular-nums">{paymentMethodStats.transfer.toLocaleString()} {currency}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${totalRevenue ? (paymentMethodStats.transfer / totalRevenue) * 100 : 0}%` }}></div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-600 font-medium">بطاقة ائتمان</span>
              <span className="font-bold text-slate-900 font-mono tabular-nums">{paymentMethodStats.card.toLocaleString()} {currency}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${totalRevenue ? (paymentMethodStats.card / totalRevenue) * 100 : 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* Total Sessions & Patient Count */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500">حجم العمل والحالات</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-400">إجمالي الجلسات المسجلة</div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {totalSessions} <span className="text-xs font-normal text-slate-500">جلسة</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">متوسط قيمة الجلسة الواحدة:</span>
              <span className="font-bold text-slate-900 font-mono tabular-nums">
                {totalSessions ? Math.round(totalRevenue / totalSessions).toLocaleString() : 0} {currency}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Timeframe Detailed Statistics Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Period Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">
              {timeframe === 'monthly' ? 'تحليل الإيرادات الشهرية' : 'تحليل الإيرادات الأسبوعية'}
            </h3>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {timeframe === 'monthly' ? (
              sortedMonths.length === 0 ? (
                <div className="p-8 text-center text-slate-400">لا توجد بيانات شهرية كافية</div>
              ) : (
                sortedMonths.map(([month, data]) => (
                  <div key={month} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-slate-900 font-mono">{month}</div>
                      <div className="text-slate-400 text-[11px]">{data.count} جلسة مسجلة</div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-teal-700 font-mono tabular-nums text-sm">{data.revenue.toLocaleString()} {currency}</div>
                      <div className="text-[11px] text-emerald-600">محصل: {data.paid.toLocaleString()} {currency}</div>
                    </div>
                  </div>
                ))
              )
            ) : (
              sortedWeeks.length === 0 ? (
                <div className="p-8 text-center text-slate-400">لا توجد بيانات أسبوعية كافية</div>
              ) : (
                sortedWeeks.map(([week, data]) => (
                  <div key={week} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-slate-900 font-mono">{week}</div>
                      <div className="text-slate-400 text-[11px]">{data.count} جلسة مسجلة</div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-teal-700 font-mono tabular-nums text-sm">{data.revenue.toLocaleString()} {currency}</div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* Condition / Service Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">توزيع الحالات والإصابات الأكثر طلباً وإيراداً</h3>
            <Award className="w-4 h-4 text-teal-600" />
          </div>
          <div className="divide-y divide-slate-100 text-xs max-h-96 overflow-y-auto">
            {sortedConditions.length === 0 ? (
              <div className="p-8 text-center text-slate-400">لا توجد حالات مسجلة</div>
            ) : (
              sortedConditions.map(([condition, data], idx) => (
                <div key={condition} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-[11px] font-mono">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{condition}</div>
                      <div className="text-slate-400 text-[11px]">{data.count} جلسة</div>
                    </div>
                  </div>
                  <div className="text-left font-mono tabular-nums">
                    <div className="font-bold text-slate-900">{data.revenue.toLocaleString()} {currency}</div>
                    <div className="text-[11px] text-slate-400">{Math.round((data.revenue / (totalRevenue || 1)) * 100)}% من الإجمالي</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
