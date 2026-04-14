import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuth, logout, username } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-40 glass border-b border-dark-500/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-dark-900 font-display font-bold text-sm shadow-lg group-hover:scale-105 transition-transform">
              SE
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-sm font-bold text-white leading-tight">SASI ECE</p>
              <p className="text-[10px] text-dark-400 leading-tight tracking-widest uppercase">Farewell Photo Booth</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !isAdmin ? 'text-gold-400 bg-gold-500/10' : 'text-dark-400 hover:text-white hover:bg-dark-600'
              }`}
            >
              Gallery
            </Link>
            {isAuth ? (
              <>
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isAdmin ? 'text-gold-400 bg-gold-500/10' : 'text-dark-400 hover:text-white hover:bg-dark-600'
                  }`}
                >
                  Admin Panel
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-dark-500">
                  <span className="text-xs text-dark-400 font-mono">{username}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold transition-all"
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-600 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden pb-4 space-y-1 animate-slide-up">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm text-white hover:bg-dark-600 transition-all">Gallery</Link>
            {isAuth ? (
              <>
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm text-white hover:bg-dark-600 transition-all">Admin Panel</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">Logout</button>
              </>
            ) : (
              <Link to="/admin/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-gold-400 hover:bg-dark-600 transition-all">Admin Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
