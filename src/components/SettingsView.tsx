import React, { useState } from 'react';
import { CenterSettings } from '../types';
import { Settings, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  settings: CenterSettings;
  onSaveSettings: (newSettings: CenterSettings) => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetDemoData,
}) => {
  const [centerName, setCenterName] = useState(settings.centerName);
  const [defaultCurrency, setDefaultCurrency] = useState(settings.defaultCurrency);
  const [defaultSessionPrice, setDefaultSessionPrice] = useState(settings.defaultSessionPrice);
  const [commonConditions, setCommonConditions] = useState<string[]>([...settings.commonConditions]);
  const [newCondition, setNewCondition] = useState('');
  
  const [commonExtraItems, setCommonExtraItems] = useState([...settings.commonExtraItems]);
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraAmount, setNewExtraAmount] = useState(50);

  const [savedMessage, setSavedMessage] = useState(false);

  const handleAddCondition = () => {
    if (!newCondition.trim()) return;
    setCommonConditions([...commonConditions, newCondition.trim()]);
    setNewCondition('');
  };

  const handleRemoveCondition = (index: number) => {
    setCommonConditions(commonConditions.filter((_, i) => i !== index));
  };

  const handleAddExtraItem = () => {
    if (!newExtraName.trim()) return;
    setCommonExtraItems([...commonExtraItems, { name: newExtraName.trim(), amount: Number(newExtraAmount) || 0 }]);
    setNewExtraName('');
  };

  const handleRemoveExtraItem = (index: number) => {
    setCommonExtraItems(commonExtraItems.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      centerName,
      defaultCurrency,
      defaultSessionPrice: Number(defaultSessionPrice) || 350,
      commonConditions,
      commonExtraItems,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6">
      
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">إعدادات المركز والخدمات</h2>
            <p className="text-xs text-slate-500">تخصيص اسم المركز، العملة الافتراضية، أنواع الحالات، والبنود الإضافية</p>
          </div>
          {savedMessage && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم حفظ الإعدادات بنجاح</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6 pt-6">
          
          {/* General info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">اسم مركز العلاج الطبيعي</label>
              <input
                type="text"
                required
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">العملة الافتراضية</label>
              <input
                type="text"
                required
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">سعر الجلسة الافتراضي</label>
              <input
                type="number"
                min="0"
                required
                value={defaultSessionPrice}
                onChange={(e) => setDefaultSessionPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-mono tabular-nums font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Common Conditions Management */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900">أنواع الحالات والإصابات الافتراضية</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="أضف نوع حالة أو إصابة جديدة..."
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
              />
              <button
                type="button"
                onClick={handleAddCondition}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all"
              >
                إضافة
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {commonConditions.map((cond, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-800 border border-slate-200">
                  <span>{cond}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(idx)}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Common Extra Items Management */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900">البنود الإضافية السريعة (مثل أجهزة الليزر، الأشرطة الطبية)</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="اسم البند الإضافي..."
                value={newExtraName}
                onChange={(e) => setNewExtraName(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
              />
              <input
                type="number"
                placeholder="السعر"
                value={newExtraAmount}
                onChange={(e) => setNewExtraAmount(Number(e.target.value))}
                className="w-24 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-mono tabular-nums"
              />
              <button
                type="button"
                onClick={handleAddExtraItem}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all"
              >
                إضافة بند
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {commonExtraItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 px-3.5 py-2 rounded-xl text-xs border border-slate-200">
                  <span className="font-medium text-slate-800">{item.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-mono tabular-nums font-bold text-teal-700">{item.amount} {defaultCurrency}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExtraItem(idx)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">إعادة تعيين البيانات التجريبية</div>
              <p className="text-[11px] text-slate-500">استعادة الجلسات التجريبية الافتراضية للتدريب واختبار النظام</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('هل أنت متأكد من إعادة تعيين البيانات التجريبية؟ سيتم استبدال البيانات الحالية.')) {
                  onResetDemoData();
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all"
            >
              استعادة البيانات التجريبية
            </button>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm shadow-teal-600/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات والإعدادات</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
