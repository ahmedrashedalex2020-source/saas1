import React, { useState, useEffect } from 'react';
import { PatientSession, ExtraItem, PercentageAdjustment } from '../types';
import { X, Plus, Trash2, Calculator, Check, AlertCircle } from 'lucide-react';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: PatientSession) => void;
  sessionToEdit?: PatientSession | null;
  commonConditions: string[];
  commonExtraItems: { name: string; amount: number }[];
  defaultSessionPrice: number;
  currency: string;
}

export const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  sessionToEdit,
  commonConditions,
  commonExtraItems,
  defaultSessionPrice,
  currency,
}) => {
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [condition, setCondition] = useState(commonConditions[0] || 'علاج طبيعي عام');
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

  useEffect(() => {
    if (sessionToEdit) {
      setClientName(sessionToEdit.clientName);
      setPhone(sessionToEdit.phone);
      setCondition(sessionToEdit.condition);
      setSessionDate(sessionToEdit.sessionDate);
      setSessionTime(sessionToEdit.sessionTime || '10:00');
      setBasePrice(sessionToEdit.basePrice);
      setExtraItems([...sessionToEdit.extraItems]);
      if (sessionToEdit.percentageAdjustment) {
        setHasPercentage(true);
        setPctType(sessionToEdit.percentageAdjustment.type);
        setPctValue(sessionToEdit.percentageAdjustment.percentage);
        setPctName(sessionToEdit.percentageAdjustment.name);
      } else {
        setHasPercentage(false);
      }
      setPaymentStatus(sessionToEdit.paymentStatus);
      setPaidAmount(sessionToEdit.paidAmount);
      setPaymentMethod(sessionToEdit.paymentMethod);
      setNotes(sessionToEdit.notes || '');
    } else {
      setClientName('');
      setPhone('');
      setCondition(commonConditions[0] || 'علاج طبيعي عام');
      setSessionDate(new Date().toISOString().split('T')[0]);
      setSessionTime('10:00');
      setBasePrice(defaultSessionPrice);
      setExtraItems([]);
      setHasPercentage(false);
      setPaymentStatus('paid');
      setPaidAmount(defaultSessionPrice);
      setPaymentMethod('cash');
      setNotes('');
    }
  }, [sessionToEdit, isOpen, defaultSessionPrice, commonConditions]);

  // Calculate total price automatically
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

  // Update paid amount automatically if status is paid
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert('يرجى إدخال اسم العميل');
      return;
    }

    const newSession: PatientSession = {
      id: sessionToEdit ? sessionToEdit.id : 'session-' + Date.now(),
      clientName: clientName.trim(),
      phone: phone.trim(),
      condition,
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

    onSave(newSession);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {sessionToEdit ? 'تعديل بيانات الجلسة والحالة' : 'تسجيل حضور جلسة جديدة'}
            </h3>
            <p className="text-xs text-slate-500">إدخال تفاصيل المريض، سعر الجلسة، والبنود الإضافية والخصومات</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">اسم العميل / المريض *</label>
              <input
                type="text"
                required
                placeholder="مثال: أحمد محمد حسن"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">رقم الهاتف</label>
              <input
                type="text"
                placeholder="01012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Condition & Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">نوع الحالة / الإصابة *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-slate-800"
              >
                {commonConditions.map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">تاريخ الحضور *</label>
              <input
                type="date"
                required
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Base Session Price */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-teal-600" />
              <span>حساب المدفوعات والأسعار</span>
            </h4>

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
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-mono tabular-nums font-bold text-slate-900"
              />
            </div>

            {/* Extra Items Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">البنود الإضافية على الخدمة (أجهزة، أدوات، استشارات)</label>
              
              {/* Preset buttons */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {commonExtraItems.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPresetExtra(item)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3 h-3 text-teal-600" />
                    <span>{item.name} ({item.amount} {currency})</span>
                  </button>
                ))}
              </div>

              {/* Custom extra input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="اسم البند الإضافي المخصص..."
                  value={customExtraName}
                  onChange={(e) => setCustomExtraName(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                />
                <input
                  type="number"
                  placeholder="السعر"
                  value={customExtraAmount}
                  onChange={(e) => setCustomExtraAmount(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-mono tabular-nums"
                />
                <button
                  type="button"
                  onClick={handleAddCustomExtra}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all"
                >
                  إضافة بند
                </button>
              </div>

              {/* Added items list */}
              {extraItems.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {extraItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                      <span className="font-medium text-slate-800">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono tabular-nums font-semibold text-teal-700">+{item.amount} {currency}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExtra(item.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Percentage / Discount section */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasPercentage}
                    onChange={(e) => setHasPercentage(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span>إضافة نسبة مئوية أو خصم على الإجمالي</span>
                </label>
              </div>

              {hasPercentage && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 bg-white p-3 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">نوع التعديل</label>
                    <select
                      value={pctType}
                      onChange={(e) => setPctType(e.target.value as 'addition' | 'discount')}
                      className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option value="discount">خصم نسبة (%)</option>
                      <option value="addition">إضافة نسبة / ضريبة (%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">النسبة المئوية (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={pctValue}
                      onChange={(e) => setPctValue(Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">اسم التعديل</label>
                    <input
                      type="text"
                      placeholder="مثال: خصم خاص"
                      value={pctName}
                      onChange={(e) => setPctName(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Calculated Final Total Preview */}
            <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900">الإجمالي النهائي المستحق:</span>
              <span className="text-base font-bold text-teal-900 font-mono tabular-nums">
                {Math.round(finalTotal).toLocaleString()} {currency}
              </span>
            </div>

          </div>

          {/* Payment Status & Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">حالة الدفع</label>
              <select
                value={paymentStatus}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-slate-800"
              >
                <option value="paid">مدفوع بالكامل</option>
                <option value="partial">مدفوع جزئياً</option>
                <option value="pending">معلق / غير مدفوع</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">المبلغ المدفوع ({currency})</label>
              <input
                type="number"
                min="0"
                max={finalTotal}
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-mono tabular-nums font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">طريقة الدفع</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-slate-800"
              >
                <option value="cash">نقدي (Cash)</option>
                <option value="transfer">تحويل بنكي (Transfer)</option>
                <option value="card">بطاقة ائتمان (Card)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">ملاحظات الجلسة والتقدم الطبي</label>
            <textarea
              rows={2}
              placeholder="اكتب أي ملاحظات خاصة بالحالة أو التطورات الطبية..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm shadow-teal-600/20"
            >
              {sessionToEdit ? 'حفظ التعديلات' : 'حفظ وتسجيل الجلسة'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
