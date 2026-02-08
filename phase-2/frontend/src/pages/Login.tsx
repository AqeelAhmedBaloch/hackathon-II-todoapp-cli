import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setAuthData } from '../utils/auth';
import { UserLogin } from '../types';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState<UserLogin>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { access_token, user } = response.data;

      setAuthData(access_token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="glass-panel rounded-xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Lock className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 font-sans">
              Welcome Back
            </h2>
            <p className="text-slate-400 mt-2 text-sm">Enter your credentials to access Phase 2</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-950/30 border border-red-500/30 text-red-400 px-4 py-3 rounded text-sm flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-cyan-500/80 mb-1 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-slate-200 placeholder-slate-600 transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cyan-500/80 mb-1 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-slate-200 placeholder-slate-600 transition-all"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-cyan-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 rounded-lg font-bold tracking-wide hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50 group relative overflow-hidden"
            >
              <span className="relative">{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline">
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
