import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form);
    if (success) navigate('/admin');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #F4B942 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="w-full max-w-sm animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-dark-900 font-display font-bold text-xl mx-auto mb-4 animate-pulse-gold">
            SE
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-dark-400 text-sm mt-1">SASI ECE Photo Booth</p>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-dark-400 mb-1.5 tracking-wide uppercase">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                required
                placeholder="admin"
                className="w-full bg-dark-800 border border-dark-500 focus:border-gold-500 rounded-xl px-4 py-3 text-white text-sm placeholder-dark-400 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-400 mb-1.5 tracking-wide uppercase">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className="w-full bg-dark-800 border border-dark-500 focus:border-gold-500 rounded-xl px-4 py-3 pr-10 text-white text-sm placeholder-dark-400 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-dark-900 font-semibold text-sm transition-all mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
