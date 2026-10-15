import React, { useState } from 'react';
import { PatientSession } from '../types';
import { Users, Search, Calendar, Phone, ChevronLeft, Plus, DollarSign } from 'lucide-react';

interface PatientsViewProps {
  sessions: PatientSession[];
  onOpenClientProfile: (clientName: string, clientPhone: string, clientCondition: string) => void;
  onOpenAddModal: () => void;
  currency: string;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  sessions,
  onOpenClientProfile,
  onOpenAddModal,
  currency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Group sessions by client name
  const clientMap: { [key: string]: { name: string; phone: string; condition: string; sessions: PatientSession[] } } = {};

  sessions.forEach(s => {
    const key = s.clientName.trim();
    if (!clientMap[key]) {
      clientMap[key] = {
        name: s.clientName,
        phone: s.phone || '',
        condition: s.condition || 'علاج طبيعي',
        sessions: []
      };
    }
    clientMap[key].sessions.push(s);
    if (s.phone && !clientMap[key].phone) {
      clientMap[key].phone = s.phone;
    }
  });

  const clientsList = Object.values(clientMap).filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery) ||
    client.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 my-6">
      
      {/* Header & Search */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">ملفات العملاء والحالات المرضية (حضور متعدد الجلسات)</h2>
          <p className="text-xs text-slate-500 mt-0.5">عرض كافة العملاء وإدارة جلساتهم المتعددة أسبوعياً مع إحصاء إجمالي الجلسات والمدفوعات</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة حضور جديد</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="بحث في ملفات العملاء بالاسم، الهاتف، أو الحالة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 shadow-xs"
        />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientsList.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-xs">لا توجد ملفات عملاء مطابقة للبحث</p>
          </div>
        ) : (
          clientsList.map((client) => {
            const totalSessions = client.sessions.length;
            const totalRevenue = client.sessions.reduce((acc, s) => acc + s.totalPrice, 0);
            const totalPaid = client.sessions.reduce((acc, s) => acc + s.paidAmount, 0);
            const lastSessionDate = client.sessions.sort((a, b) => b.sessionDate.localeCompare(a.sessionDate))[0]?.sessionDate;

            return (
              <div
                key={client.name}
                onClick={() => onOpenClientProfile(client.name, client.phone, client.condition)}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{client.name}</h3>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{client.phone || 'بدون هاتف'}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 font-mono">
                      {totalSessions} جلسة
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 font-medium mb-4">
                    الحالة: <span className="text-slate-800">{client.condition}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">إجمالي المدفوعات</div>
                    <div className="font-bold text-slate-900 font-mono tabular-nums">{totalRevenue.toLocaleString()} {currency}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400">آخر حضور</div>
                    <div className="font-semibold text-slate-600 font-mono">{lastSessionDate}</div>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-teal-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
