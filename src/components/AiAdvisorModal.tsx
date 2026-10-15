import React, { useState } from 'react';
import { PatientSession } from '../types';
import { X, Sparkles, Loader2, Bot, CheckCircle } from 'lucide-react';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: PatientSession[];
  currency: string;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  sessions,
  currency,
}) => {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      // Calculate summary stats to send to Gemini API
      const totalRevenue = sessions.reduce((acc, s) => acc + s.totalPrice, 0);
      const totalPaid = sessions.reduce((acc, s) => acc + s.paidAmount, 0);
      const totalSessions = sessions.length;
      
      const conditionCounts: { [key: string]: number } = {};
      sessions.forEach(s => {
        conditionCounts[s.condition] = (conditionCounts[s.condition] || 0) + 1;
      });

      const statsPayload = {
        totalSessions,
        totalRevenue,
        totalPaid,
        pendingAmount: totalRevenue - totalPaid,
        conditionCounts,
        currency,
        sessionsCount: sessions.length
      };

      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionsStats: statsPayload })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ في الاتصال بالخادم');
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-purple-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-purple-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">مستشار الذكاء الاصطناعي للمركز</h3>
              <p className="text-xs text-slate-500">تحليل المبيعات، التدفقات المالية، وتوصيات لتطوير العيادة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!analysisResult && !loading && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
                <Bot className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-sm font-bold text-slate-800 mb-1">جاهز لتحليل أداء مركز العلاج الطبيعي</h4>
                <p className="text-xs text-slate-500">
                  سيقوم الذكاء الاصطناعي بدراسة إجمالي الإيرادات، توزيع الحالات، والمدفوعات المعلقة ليقدم لك تقريراً شاملاً وتوصيات استراتيجية.
                </p>
              </div>
              <button
                onClick={handleRunAnalysis}
                className="px-6 py-3 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-md shadow-purple-600/20 inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>بدء التحليل الذكي الآن</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-16 space-y-3">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
              <div className="text-xs font-semibold text-slate-700">جاري تحليل بيانات المركز وإعداد التقرير المالي...</div>
              <p className="text-[11px] text-slate-400">قد يستغرق ذلك بضع ثوانٍ</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs">
              {error}
            </div>
          )}

          {analysisResult && (
            <div className="space-y-4">
              <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-5 text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                {analysisResult}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleRunAnalysis}
                  className="px-4 py-2 text-xs font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition-all"
                >
                  إعادة التحليل وتحديث التقرير
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all"
                >
                  إغلاق
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
