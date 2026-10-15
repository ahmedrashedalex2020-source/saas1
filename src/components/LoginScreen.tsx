import React, { useState } from 'react';
import { Activity, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email.trim().toLowerCase() === 'mayalaa560@gmail.com' && password === 'alaa1234') {
        localStorage.setItem('pt_auth_logged_in', 'true');
        onLoginSuccess();
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-100 relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Logo & Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-600/30">
            <Activity className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            مركز العلاج الطبيعي والتأهيل
          </h1>
          <p className="text-xs text-slate-500">نظام إدارة الحضور، الجلسات، والمدفوعات</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">البريد الإلكتروني / اسم المستخدم</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-10 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-mono text-slate-800"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-mono text-slate-800"
                placeholder="أدخل كلمة المرور"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <span>{isLoading ? 'جاري التحقق والدخول...' : 'تسجيل الدخول للنظام'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
