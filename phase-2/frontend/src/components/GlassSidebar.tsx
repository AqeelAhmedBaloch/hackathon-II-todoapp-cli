import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { clearAuthData } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const GlassSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuthData();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    ];

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 glass-panel border-r border-white/10 z-50"
        >
            <div className="p-8">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 font-sans">
                    Todo App
                </h1>
                <p className="text-xs text-slate-500 mt-1">Phase 2 Premium</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden
              ${isActive ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium tracking-wide">{item.label}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors group"
                >
                    <LogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                    <span className="font-medium">Disconnect</span>
                </button>
            </div>
        </motion.div>
    );
};

export default GlassSidebar;
