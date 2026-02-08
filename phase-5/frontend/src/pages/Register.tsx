import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setAuthData } from '../utils/auth';
import { UserCreate } from '../types';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState<UserCreate>({
    email: '',
    password: '',
    full_name: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      const { access_token, user } = response.data;

      setAuthData(access_token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing after an error
    if (error) {
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950 relative overflow-hidden">
      {/* Cyber Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="glass-panel rounded-xl p-8 border border-white/10 cyber-card">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center mb-4 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <User className="w-8 h-8 text-violet-400" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500 font-sans">
              Create Account
            </h2>
            <p className="text-slate-400 mt-2 font-normal text-sm">Join us today to get started</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-950/30 border border-red-500/30 text-red-400 px-4 py-3 rounded text-sm flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-xs font-semibold text-violet-500/80 mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors w-5 h-5" />
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-violet-500 focus:border-violet-500 text-slate-200 placeholder-slate-600 transition-all"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-violet-500/80 mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-violet-500 focus:border-violet-500 text-slate-200 placeholder-slate-600 transition-all"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-violet-500/80 mb-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-12 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-violet-500 focus:border-violet-500 text-slate-200 placeholder-slate-600 transition-all"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-violet-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 px-4 rounded-lg font-bold tracking-wide hover:from-violet-500 hover:to-fuchsia-500 focus:outline-none ring-1 ring-white/10 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative">{loading ? 'Creating Account...' : 'Sign Up'}</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-violet-400 hover:text-violet-300 transition-colors hover:underline decoration-violet-500/30 underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
