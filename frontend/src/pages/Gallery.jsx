import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BANNER_SRC = '/banner.png'; // Place your SASI banner image in /public/banner.png

const Navbar = () => {
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <>
      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .navbar-anim { animation: navSlideDown 0.45s cubic-bezier(0.22,1,0.36,1) both; }

        .nav-btn {
          font-size: 13px;
          font-weight: 600;
          padding: 8px 20px;
          border-radius: 8px;
          transition: all 0.18s ease;
          cursor: pointer;
          border: none;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .nav-btn-gallery {
          background: transparent;
          color: #e0eaff;
          border: 1.5px solid rgba(255,255,255,0.25);
        }
        .nav-btn-gallery:hover {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.45);
          color: #fff;
        }
        .nav-btn-admin {
          background: #CC0000;
          color: #fff;
          box-shadow: 0 2px 10px rgba(204,0,0,0.35);
        }
        .nav-btn-admin:hover {
          background: #a30000;
          box-shadow: 0 3px 14px rgba(204,0,0,0.50);
        }
        .nav-btn-logout {
          background: transparent;
          color: #f87171;
          border: 1.5px solid rgba(248,113,113,0.40);
        }
        .nav-btn-logout:hover {
          background: rgba(248,113,113,0.10);
          border-color: rgba(248,113,113,0.70);
        }

        /* Banner image styles */
        .sasi-banner-img {
          height: 52px;
          width: auto;
          max-width: 420px;
          object-fit: contain;
          display: block;
          filter: brightness(1.05);
        }

        /* Fallback text banner */
        .sasi-fallback {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sasi-fallback-logo {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: linear-gradient(135deg, #CC0000, #8B0000);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 900;
          color: #fff;
          flex-shrink: 0;
        }
        .sasi-fallback-text-main {
          font-size: 15px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.04em;
          line-height: 1.2;
        }
        .sasi-fallback-text-sub {
          font-size: 10px;
          color: #a8c0ff;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
        }

        @media (max-width: 480px) {
          .sasi-banner-img {
            height: 38px;
            max-width: 220px;
          }
          .nav-btn {
            padding: 7px 12px;
            font-size: 12px;
          }
        }
      `}</style>

      <nav
        className="navbar-anim sticky top-0 z-40 w-full"
        style={{
          background: 'linear-gradient(90deg, #0d2260 0%, #1B3A8C 100%)',
          borderBottom: '3px solid #CC0000',
          boxShadow: '0 2px 16px rgba(13,34,96,0.45)',
        }}
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '68px',
          }}
        >
          {/* ── Left: SASI Banner ── */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <img
              src={BANNER_SRC}
              alt="SASI Institute of Technology and Engineering"
              className="sasi-banner-img"
              onError={e => {
                // Fallback if banner.png not found
                e.currentTarget.style.display = 'none';
                const fb = e.currentTarget.nextElementSibling;
                if (fb) fb.style.display = 'flex';
              }}
            />
            {/* Fallback (hidden by default, shown if image fails) */}
            <div className="sasi-fallback" style={{ display: 'none' }}>
              <div className="sasi-fallback-logo">SE</div>
              <div>
                <div className="sasi-fallback-text-main">SASI ECE</div>
                <div className="sasi-fallback-text-sub">Farewell Photo Booth</div>
              </div>
            </div>
          </Link>

          {/* ── Right: Nav Buttons ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/">
              <button className="nav-btn nav-btn-gallery">Gallery</button>
            </Link>

            {isAuth ? (
              <>
                <Link to="/admin">
                  <button className="nav-btn nav-btn-admin">Dashboard</button>
                </Link>
                <button className="nav-btn nav-btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="nav-btn nav-btn-admin">Admin Login</button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
