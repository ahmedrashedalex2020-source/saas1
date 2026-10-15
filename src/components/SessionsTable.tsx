import React, { useState } from 'react';
import { PatientSession } from '../types';
import { Search, Filter, Edit3, Trash2, Calendar, FileSpreadsheet, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';

interface SessionsTableProps {
  sessions: PatientSession[];
  onEditSession: (session: PatientSession) => void;
  onDeleteSession: (id: string) => void;
  onAddSession: () => void;
  currency: string;
}

export const SessionsTable: React.FC<SessionsTableProps> = ({
  sessions,
  onEditSession,
  onDeleteSession,
  onAddSession,
  currency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'partial'>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');

  // Extract unique conditions for filter dropdown
  const uniqueConditions = Array.from(new Set(sessions.map(s => s.condition)));

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.phone.includes(searchQuery) ||
      session.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (session.notes && session.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || session.paymentStatus === statusFilter;
    const matchesCondition = conditionFilter === 'all' || session.condition === conditionFilter;

    return matchesSearch && matchesStatus && matchesCondition;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['اسم العميل', 'رقم الهاتف', 'نوع الحالة', 'تاريخ الحضور', 'السعر الأساسي', 'البنود الإضافية', 'التخفيض/الزيادة', 'الإجمالي', 'حالة الدفع', 'المدفوع', 'طريقة الدفع', 'ملاحظات'];
    const rows = filteredSessions.map(s => [
      `"${s.clientName}"`,
      `"${s.phone}"`,
      `"${s.condition}"`,
      `"${s.sessionDate} ${s.sessionTime || ''}"`,
      s.basePrice,
      `"${s.extraItems.map(e => `${e.name} (${e.amount})`).join('، ')}"`,
      s.percentageAdjustment ? `"${s.percentageAdjustment.name}: ${s.percentageAdjustment.percentage}%"` : 'لا يوجد',
      s.totalPrice,
      s.paymentStatus === 'paid' ? 'مدفوع' : s.paymentStatus === 'partial' ? 'جزئي' : 'معلق',
      s.paidAmount,
      s.paymentMethod === 'cash' ? 'نقدي' : s.paymentMethod === 'transfer' ? 'تحويل بنكي' : 'بطاقة',
      `"${s.notes || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sessions_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden my-6">
      
      {/* Header & Controls bar */}
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-base font-bold text-slate-900">سجل حضور الحالات والجلسات المرضية</h2>
          <p className="text-xs text-slate-500 mt-0.5">إدارة الحضور، الأسعار، تحليل المدفوعات، والبنود الإضافية</p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>تصدير Excel/CSV</span>
          </button>

          <button
            onClick={onAddSession}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل حضور حالة</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="p-4 border-b border-slate-200 bg-white grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث باسم العميل، الهاتف، أو نوع الحالة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              statusFilter === 'paid' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مدفوع
          </button>
          <button
            onClick={() => setStatusFilter('partial')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              statusFilter === 'partial' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            جزئي
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              statusFilter === 'pending' ? 'bg-white text-amber-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            معلق
          </button>
        </div>

        {/* Condition Filter */}
        <div className="relative">
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-700 font-medium"
          >
            <option value="all">جميع أنواع الحالات والإصابات</option>
            {uniqueConditions.map(cond => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold">
              <th className="py-3.5 px-4">اسم العميل / الهاتف</th>
              <th className="py-3.5 px-4">نوع الحالة / الإصابة</th>
              <th className="py-3.5 px-4">تاريخ الحضور</th>
              <th className="py-3.5 px-4">تفاصيل السعر والبنود</th>
              <th className="py-3.5 px-4">الإجمالي</th>
              <th className="py-3.5 px-4">حالة الدفع</th>
              <th className="py-3.5 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Calendar className="w-8 h-8 text-slate-300" />
                    <p className="font-medium">لا توجد جلسات مطابقة للبحث أو الفلتر الحالي</p>
                    <button
                      onClick={onAddSession}
                      className="mt-2 px-4 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-all"
                    >
                      إضافة جلسة جديدة الآن
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Client Name & Phone */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{session.clientName}</div>
                    <div className="text-slate-400 text-[11px] font-mono tabular-nums">{session.phone || 'بدون هاتف'}</div>
                  </td>

                  {/* Condition */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{session.condition}</div>
                    {session.notes && <div className="text-slate-400 text-[11px] truncate max-w-xs">{session.notes}</div>}
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                    <div>{session.sessionDate}</div>
                    {session.sessionTime && <div className="text-slate-400 text-[11px]">{session.sessionTime}</div>}
                  </td>

                  {/* Pricing Breakdown */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-700 font-mono tabular-nums">
                      أساسي: {session.basePrice} {currency}
                    </div>
                    {session.extraItems.length > 0 && (
                      <div className="text-[11px] text-teal-600 font-medium">
                        + {session.extraItems.map(e => `${e.name} (${e.amount})`).join('، ')}
                      </div>
                    )}
                    {session.percentageAdjustment && (
                      <div className={`text-[11px] font-medium ${session.percentageAdjustment.type === 'discount' ? 'text-amber-600' : 'text-blue-600'}`}>
                        {session.percentageAdjustment.name} ({session.percentageAdjustment.percentage}%)
                      </div>
                    )}
                  </td>

                  {/* Total Price */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono tabular-nums whitespace-nowrap">
                    {session.totalPrice.toLocaleString()} {currency}
                  </td>

                  {/* Payment Status */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold w-fit ${
                        session.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : session.paymentStatus === 'partial'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {session.paymentStatus === 'paid' && <CheckCircle className="w-3 h-3" />}
                        {session.paymentStatus === 'partial' && <Clock className="w-3 h-3" />}
                        {session.paymentStatus === 'pending' && <AlertCircle className="w-3 h-3" />}
                        {session.paymentStatus === 'paid' ? 'مدفوع بالكامل' : session.paymentStatus === 'partial' ? `مدفوع جزئياً (${session.paidAmount})` : 'معلق / غير مدفوع'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {session.paymentMethod === 'cash' ? 'نقدي' : session.paymentMethod === 'transfer' ? 'تحويل بنكي' : 'بطاقة ائتمان'}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onEditSession(session)}
                        className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="تعديل الجلسة"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSession(session.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف الجلسة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <div>
          عرض <span className="font-semibold text-slate-800 font-mono">{filteredSessions.length}</span> من أصل <span className="font-semibold text-slate-800 font-mono">{sessions.length}</span> جلسة مسجلة
        </div>
        <div className="font-mono tabular-nums">
          إجمالي قيمة المعروض: <span className="font-bold text-slate-900">{filteredSessions.reduce((acc, s) => acc + s.totalPrice, 0).toLocaleString()} {currency}</span>
        </div>
      </div>

    </div>
  );
};
