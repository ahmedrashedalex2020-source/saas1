import React, { useState } from 'react';
import { PatientSession, ExtraItem, PercentageAdjustment } from '../types';
import { X, Plus, Calendar, CheckCircle, Clock, AlertCircle, Trash2, Phone, User, Calculator } from 'lucide-react';

interface ClientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  clientPhone: string;
  clientCondition: string;
  clientSessions: PatientSession[];
  onSaveSession: (session: PatientSession) => void;
  onDeleteSession: (sessionId: string) => void;
  currency: string;
  commonExtraItems: { name: string; amount: number }[];
  defaultSessionPrice: number;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  isOpen,
  onClose,
  clientName,
  clientPhone,
  clientCondition,
  clientSessions,
  onSaveSession,
  onDeleteSession,
  currency,
  commonExtraItems,
  defaultSessionPrice,
}) => {
  // New session quick form state for this client
  const [showAddForm, setShowAddForm] = useState(false);
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionTime, setSessionTime] = useState('10:00');
  const [basePrice, setBasePrice] = useState<number>(defaultSessionPrice);
  const [extraItems, setExtraItems] = useState<ExtraItem[]>([]);
  
  // Custom extra item input
  const [customExtraName, setCustomExtraName] = useState('');
  const [customExtraAmount, setCustomExtraAmount] = useState<number>(50);

  // Percentage adjustment
  const [hasPercentage, setHasPercentage] = useState(false);
  const [pctType, setPctType] = useState<'addition' | 'discount'>('discount');
  const [pctValue, setPctValue] = useState<number>(10);
  const [pctName, setPctName] = useState('خصم خاص');

  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'partial'>('paid');
  const [paidAmount, setPaidAmount] = useState<number>(defaultSessionPrice);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'card'>('cash');
  const [notes, setNotes] = useState('');

  // Calculations
  const extrasTotal = extraItems.reduce((acc, item) => acc + item.amount, 0);
  const subtotal = basePrice + extrasTotal;
  
  let percentageAdjustment: PercentageAdjustment | null = null;
  let finalTotal = subtotal;

  if (hasPercentage) {
    const adjustmentAmount = (subtotal * pctValue) / 100;
    if (pctType === 'addition') {
      finalTotal = subtotal + adjustmentAmount;
    } else {
      finalTotal = subtotal - adjustmentAmount;
    }
    percentageAdjustment = {
      type: pctType,
      percentage: pctValue,
      name: pctName || (pctType === 'addition' ? 'إضافة نسبة' : 'خصم نسبة')
    };
  }

  const handleStatusChange = (status: 'paid' | 'pending' | 'partial') => {
    setPaymentStatus(status);
    if (status === 'paid') {
      setPaidAmount(Math.round(finalTotal));
    } else if (status === 'pending') {
      setPaidAmount(0);
    }
  };

  const handleAddPresetExtra = (item: { name: string; amount: number }) => {
    setExtraItems([
      ...extraItems,
      { id: 'ex-' + Date.now() + Math.random(), name: item.name, amount: item.amount }
    ]);
  };

  const handleAddCustomExtra = () => {
    if (!customExtraName.trim()) return;
    setExtraItems([
      ...extraItems,
      { id: 'ex-' + Date.now(), name: customExtraName.trim(), amount: Number(customExtraAmount) || 0 }
    ]);
    setCustomExtraName('');
  };

  const handleRemoveExtra = (id: string) => {
    setExtraItems(extraItems.filter(e => e.id !== id));
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: PatientSession = {
      id: 'session-' + Date.now(),
      clientName,
      phone: clientPhone,
      condition: clientCondition,
      sessionDate,
      sessionTime,
      basePrice: Number(basePrice) || 0,
      extraItems,
      percentageAdjustment: hasPercentage ? percentageAdjustment : null,
      totalPrice: Math.round(finalTotal),
      paymentStatus,
      paidAmount: Number(paidAmount) || 0,
      paymentMethod,
      notes: notes.trim()
    };

    onSaveSession(newSession);
    setShowAddForm(false);
    // Reset form
    setExtraItems([]);
    setNotes('');
  };

  if (!isOpen) return null;

  // Client stats
  const totalSessionsCount = clientSessions.length;
  const totalRevenue = clientSessions.reduce((acc, s) => acc + s.totalPrice, 0);
  const totalPaid = clientSessions.reduce((acc, s) => acc + s.paidAmount, 0);
  const totalPending = totalRevenue - totalPaid;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-base shadow-inner">
              {clientName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{clientName}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {clientPhone || 'بدون هاتف'}</span>
                <span>·</span>
                <span>الحالة الأساسية: <strong className="text-slate-700">{clientCondition}</strong></span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="text-xs text-slate-500 mb-1">إعدد الجلسات المحضورة</div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{totalSessionsCount} <span className="text-xs font-normal text-slate-500">جلسة</span></div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="text-xs text-slate-500 mb-1">إجمالي المستحقات</div>
              <div className="text-2xl font-bold text-teal-700 font-mono tabular-nums">{totalRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-500">{currency}</span></div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="text-xs text-slate-500 mb-1">المبلغ المدفوع</div>
              <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">{totalPaid.toLocaleString()} <span className="text-xs font-normal text-slate-500">{currency}</span></div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="text-xs text-slate-500 mb-1">المتبقي / الآجل</div>
              <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums">{totalPending.toLocaleString()} <span className="text-xs font-normal text-slate-500">{currency}</span></div>
            </div>
          </div>

          {/* Action Header for Adding Session */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900">سجل أيام الحضور والجلسات الخاصة بالعميل</h4>
              <p className="text-xs text-slate-500">يمكنك إضافة جلسات متعددة لنفس العميل في أيام مختلفة خلال الأسبوع</p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة جلسة حضور جديدة لهذا العميل</span>
              </button>
            )}
          </div>

          {/* Quick Add Session Form for this client */}
          {showAddForm && (
            <form onSubmit={handleQuickSubmit} className="bg-teal-50/50 border border-teal-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-teal-100">
                <h5 className="text-xs font-bold text-teal-900">تسجيل يوم حضور جديد للعميل: {clientName}</h5>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-medium"
                >
                  إلغاء
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">تاريخ الحضور *</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">وقت الجلسة</label>
                  <input
                    type="time"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">سعر الجلسة الأساسي ({currency}) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={basePrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBasePrice(val);
                      if (paymentStatus === 'paid') setPaidAmount(val);
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono tabular-nums font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">حالة الدفع</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => handleStatusChange(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="paid">مدفوع بالكامل</option>
                    <option value="partial">مدفوع جزئياً</option>
                    <option value="pending">معلق / غير مدفوع</option>
                  </select>
                </div>
              </div>

              {/* Extra Items */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">بنود إضافية أو أجهزة للجلسة</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {commonExtraItems.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPresetExtra(item)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-teal-50 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-teal-600" />
                      <span>{item.name} ({item.amount} {currency})</span>
                    </button>
                  ))}
                </div>

                {extraItems.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {extraItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs">
                        <span>{item.name}</span>
                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-teal-700 font-bold">+{item.amount} {currency}</span>
                          <button type="button" onClick={() => handleRemoveExtra(item.id)} className="text-red-500">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">المبلغ المدفوع لهذه الجلسة ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    max={finalTotal}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono tabular-nums font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">طريقة الدفع</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                  >
                    <option value="cash">نقدي</option>
                    <option value="transfer">تحويل بنكي</option>
                    <option value="card">بطاقة ائتمان</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ملاحظات الجلسة</label>
                <input
                  type="text"
                  placeholder="ملاحظات حول التقدم في هذا اليوم..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs font-bold text-teal-900 font-mono">
                  إجمالي الجلسة: {Math.round(finalTotal).toLocaleString()} {currency}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs"
                  >
                    حفظ جلسة الحضور
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* Sessions List for this Client */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 text-xs font-bold text-slate-700">
              سجل الجلسات السابقة (أيام الحضور والمدفوعات)
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {clientSessions.length === 0 ? (
                <div className="p-8 text-center text-slate-400">لا توجد جلسات مسجلة لهذا العميل حتى الآن</div>
              ) : (
                clientSessions.map((session, idx) => (
                  <div key={session.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono">جلسة #{idx + 1}</span>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-700">{session.sessionDate}</span>
                        {session.sessionTime && <span className="text-slate-400 font-mono text-[11px]">({session.sessionTime})</span>}
                      </div>
                      <div className="text-slate-600 font-medium">{session.condition}</div>
                      {session.extraItems.length > 0 && (
                        <div className="text-[11px] text-teal-600">
                          بنود إضافية: {session.extraItems.map(e => `${e.name} (${e.amount})`).join('، ')}
                        </div>
                      )}
                      {session.notes && <div className="text-slate-400 text-[11px]">{session.notes}</div>}
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-left font-mono">
                        <div className="font-bold text-slate-900">{session.totalPrice.toLocaleString()} {currency}</div>
                        <div className={`text-[11px] font-semibold ${session.paymentStatus === 'paid' ? 'text-emerald-600' : session.paymentStatus === 'partial' ? 'text-blue-600' : 'text-amber-600'}`}>
                          مدفوع: {session.paidAmount.toLocaleString()} {currency}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteSession(session.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف هذه الجلسة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
