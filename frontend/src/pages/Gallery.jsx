import { useState, useCallback, useEffect } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { photosAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PhotoCard from '../components/PhotoCard';
import PhotoModal from '../components/PhotoModal';
import SkeletonGrid from '../components/SkeletonGrid';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────────────────────
// ANNOUNCEMENT CONFIG
const ANNOUNCEMENT_ENABLED = true;
const ANNOUNCEMENT_TYPE    = 'image';
const ANNOUNCEMENT_URL     = '/announcement.jpg';
// ─────────────────────────────────────────────────────────────────────────────

const BANNER_SRC = '/banner.png'; // Place your SASI banner at /public/banner.png

/* ── Announcement Modal ─────────────────────────────────────────────────── */
const AnnouncementModal = ({ onClose }) => (
  <>
    <style>{`
      @keyframes modalIn {
        from { opacity:0; transform:scale(0.90) translateY(20px); }
        to   { opacity:1; transform:scale(1)    translateY(0); }
      }
      @keyframes bdIn { from{opacity:0} to{opacity:1} }
      .ann-bd   { animation:bdIn    0.25s ease both; }
      .ann-card { animation:modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
    `}</style>
    <div
      className="ann-bd fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor:'rgba(10,20,60,0.85)', backdropFilter:'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="ann-card relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background:'#fff', border:'3px solid #CC0000' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3"
          style={{ background:'linear-gradient(135deg,#1B3A8C 0%,#0d2260 100%)' }}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400" />
            </span>
            <p className="text-white font-semibold text-sm tracking-widest uppercase">📢 Announcement</p>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background:'rgba(255,255,255,0.15)' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.30)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative bg-black flex items-center justify-center" style={{ maxHeight:'68vh' }}>
          {ANNOUNCEMENT_TYPE === 'video' ? (
            <video src={ANNOUNCEMENT_URL} controls autoPlay className="w-full" style={{ maxHeight:'65vh', display:'block' }} />
          ) : (
            <img src={ANNOUNCEMENT_URL} alt="Announcement" className="w-full object-contain"
              style={{ maxHeight:'65vh', display:'block', margin:'0 auto' }} />
          )}
        </div>
        <div className="flex items-center justify-between px-5 py-3"
          style={{ background:'#f0f4ff', borderTop:'1px solid #d0d9f0' }}>
          <p className="text-xs font-medium" style={{ color:'#1B3A8C' }}>
            SASI Institute of Technology &amp; Engineering · ECE Farewell 2026
          </p>
          <button onClick={onClose}
            className="px-5 py-1.5 rounded-lg text-white text-xs font-semibold transition-all"
            style={{ background:'#CC0000' }}
            onMouseEnter={e => e.currentTarget.style.background='#a30000'}
            onMouseLeave={e => e.currentTarget.style.background='#CC0000'}>
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  </>
);

/* ── Gallery Page ───────────────────────────────────────────────────────── */
const Gallery = () => {
  const { photos, loading, initialLoading, hasMore, error, loadMore, refresh, removePhoto } = usePhotos();
  const { isAuth } = useAuth();
  const [selectedIdx, setSelectedIdx]     = useState(null);
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching]         = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    if (ANNOUNCEMENT_ENABLED) {
      const t = setTimeout(() => setShowAnnouncement(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const sentinelRef = useIntersectionObserver(useCallback(() => {
    if (!searchResults) loadMore();
  }, [loadMore, searchResults]));

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) { setSearchResults(null); return; }
    setSearching(true);
    try {
      const { data } = await photosAPI.search(q);
      setSearchResults(data.data);
    } catch { toast.error('Search failed'); }
    finally { setSearching(false); }
  };

  const clearSearch = () => { setSearchQuery(''); setSearchResults(null); };

  const handleDelete = async (id) => {
    try {
      await photosAPI.delete(id);
      removePhoto(id);
      if (searchResults) setSearchResults(prev => prev.filter(p => p._id !== id));
      toast.success('Photo deleted');
    } catch { toast.error('Delete failed'); }
  };

  const displayPhotos = searchResults || photos;
  const openModal = (photo) => {
    const idx = displayPhotos.findIndex(p => p._id === photo._id);
    setSelectedIdx(idx);
  };

  return (
    <div className="min-h-screen" style={{ background:'#0a0f1e' }}>

      <style>{`
        @keyframes floatY {
          0%,100%{transform:translateY(0) scale(1);}
          50%{transform:translateY(-22px) scale(1.06);}
        }
        @keyframes twinkle {
          0%,100%{opacity:0;transform:scale(.5) rotate(0deg);}
          50%{opacity:1;transform:scale(1.2) rotate(20deg);}
        }
        @keyframes shimmerTitle {
          0%{background-position:-200% center;}
          100%{background-position:200% center;}
        }
        @keyframes scanLine {
          0%{top:0%;opacity:.15;} 100%{top:100%;opacity:.07;}
        }
        @keyframes pulseBlue {
          0%{box-shadow:0 0 0 0 rgba(27,58,140,.5);}
          70%{box-shadow:0 0 0 12px rgba(27,58,140,0);}
          100%{box-shadow:0 0 0 0 rgba(27,58,140,0);}
        }
        @keyframes cardIn {
          from{opacity:0;transform:translateY(18px) scale(.96);}
          to{opacity:1;transform:translateY(0) scale(1);}
        }
        @keyframes bannerSlide {
          from{opacity:0;transform:translateY(-12px);}
          to{opacity:1;transform:translateY(0);}
        }

        .shimmer-title {
          background: linear-gradient(90deg,#ffffff 0%,#a8c0ff 30%,#CC0000 55%,#ffffff 80%,#a8c0ff 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerTitle 4s linear infinite;
        }
        .banner-anim { animation: bannerSlide .55s cubic-bezier(.22,1,.36,1) both; }
        .card-anim   { animation: cardIn .45s ease both; }
        .btn-search  { animation: pulseBlue 2.2s ease-in-out infinite; }

        .search-input {
          background: rgba(255,255,255,0.06) !important;
          border: 1.5px solid rgba(255,255,255,0.12) !important;
          color: #fff !important;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.30); }
        .search-input:focus {
          border-color: #1B3A8C !important;
          background: rgba(27,58,140,0.18) !important;
          outline: none;
        }
        .refresh-btn {
          color: rgba(255,255,255,0.38);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 8px;
          transition: all 0.18s;
        }
        .refresh-btn:hover {
          color: #fff;
          background: rgba(27,58,140,0.30);
          border-color: rgba(27,58,140,0.55);
        }
      `}</style>

      {/* ══ SASI College Banner Header ═══════════════════════════════════ */}
      <header className="banner-anim w-full"
        style={{
          background: '#ffffff',
          borderBottom: '4px solid #CC0000',
          boxShadow: '0 3px 20px rgba(204,0,0,0.18), 0 1px 6px rgba(27,58,140,0.12)',
        }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 16px' }}>
          <img
            src={BANNER_SRC}
            alt="SASI Institute of Technology and Engineering – Dept. of ECE"
            style={{ width:'100%', maxHeight:'100px', objectFit:'contain', display:'block' }}
            onError={e => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
          {/* ── Fallback banner (shown only if banner.png missing) ── */}
          <div style={{
            display:'none', alignItems:'center', justifyContent:'space-between',
            padding:'14px 0', gap:'16px', flexWrap:'wrap'
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
              <div style={{
                width:'56px', height:'56px', borderRadius:'50%',
                background:'linear-gradient(135deg,#CC0000,#8B0000)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'20px', fontWeight:'900', color:'#fff', flexShrink:0,
                boxShadow:'0 3px 12px rgba(204,0,0,0.35)'
              }}>S</div>
              <div>
                <div style={{fontSize:'21px',fontWeight:'900',color:'#1B3A8C',letterSpacing:'1px'}}>SASI</div>
                <div style={{fontSize:'11px',color:'#555',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.4px'}}>
                  Institute of Technology &amp; Engineering
                </div>
                <div style={{fontSize:'10px',color:'#CC0000',fontWeight:'500',marginTop:'1px'}}>
                  Tadepalligudem, West Godavari · Autonomous
                </div>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{fontSize:'13px',fontWeight:'700',color:'#1B3A8C'}}>
                Department of Electronics &amp; Communication Engineering
              </div>
              <div style={{display:'flex',gap:'6px',justifyContent:'flex-end',marginTop:'5px',flexWrap:'wrap'}}>
                {[
                  {label:'AICTE Approved', bg:'#f0f4ff', border:'#c8d4f0', color:'#1B3A8C'},
                  {label:'NAAC A+',        bg:'#fff0f0', border:'#f0c0c0', color:'#CC0000'},
                  {label:'UGC',            bg:'#f0f4ff', border:'#c8d4f0', color:'#1B3A8C'},
                  {label:'ISO 21001:2018', bg:'#f0fff4', border:'#b0d4bc', color:'#1a7a3c'},
                ].map(b => (
                  <span key={b.label} style={{
                    fontSize:'9px', padding:'2px 8px', borderRadius:'20px', fontWeight:'600',
                    background:b.bg, border:`1px solid ${b.border}`, color:b.color
                  }}>{b.label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ══ Hero ════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden"
        style={{ background:'linear-gradient(160deg,#0d1b4a 0%,#0a1230 50%,#160820 100%)' }}>

        {/* Dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage:'radial-gradient(circle at 2px 2px,rgba(27,58,140,0.30) 1px,transparent 0)',
          backgroundSize:'30px 30px'
        }} />

        {/* Glow orbs */}
        <div className="absolute top-8 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background:'rgba(27,58,140,0.15)', animation:'floatY 7s ease-in-out infinite', filter:'blur(50px)' }} />
        <div className="absolute top-12 right-1/4 w-56 h-56 rounded-full pointer-events-none"
          style={{ background:'rgba(204,0,0,0.10)', animation:'floatY 9s ease-in-out infinite 1.5s', filter:'blur(40px)' }} />

        {/* Scan line */}
        <div className="absolute inset-x-0 h-px pointer-events-none"
          style={{ background:'linear-gradient(90deg,transparent,rgba(204,0,0,0.45),transparent)',
            animation:'scanLine 6s linear infinite' }} />

        {/* Bottom separator */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background:'linear-gradient(90deg,transparent,#CC0000 30%,#CC0000 70%,transparent)', opacity:0.5 }} />

        {/* Stars */}
        {[
          {top:'18%',left:'8%', delay:'0s',  size:5, color:'#4a8eff'},
          {top:'30%',right:'8%',delay:'0.9s',size:4, color:'#CC0000'},
          {top:'62%',left:'5%', delay:'1.7s',size:6, color:'#4a8eff'},
          {top:'16%',right:'16%',delay:'2.3s',size:3,color:'#CC0000'},
          {top:'50%',left:'14%',delay:'1.2s',size:3, color:'#4a8eff'},
        ].map((s, i) => (
          <div key={i} className="absolute pointer-events-none"
            style={{top:s.top,left:s.left,right:s.right,
              animation:`twinkle ${2.5+i*0.4}s ease-in-out infinite ${s.delay}`}}>
            <svg width={s.size*2} height={s.size*2} viewBox="0 0 10 10">
              <polygon points="5,0 6,4 10,5 6,6 5,10 4,6 0,5 4,4" fill={s.color} opacity="0.75" />
            </svg>
          </div>
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">

          {/* Live pill */}
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{background:'#CC0000'}} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{background:'#CC0000'}} />
            </span>
            <p className="text-xs font-mono tracking-[0.22em] uppercase" style={{color:'#7a9fff'}}>
              Department of Electronics &amp; Communication Engineering
            </p>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3">
            ECE Farewell
            <span className="block shimmer-title">Photo Booth</span>
          </h1>

          {/* College divider tag */}
          <div className="inline-flex items-center gap-3 my-3">
            <div className="h-px w-12" style={{background:'linear-gradient(90deg,transparent,rgba(204,0,0,0.6))'}} />
            <p className="text-sm font-medium" style={{color:'rgba(255,255,255,0.45)', letterSpacing:'0.06em'}}>
              SASI Institute of Technology &amp; Engineering
            </p>
            <div className="h-px w-12" style={{background:'linear-gradient(90deg,rgba(204,0,0,0.6),transparent)'}} />
          </div>

          <p className="text-sm max-w-md mx-auto mb-8" style={{color:'rgba(255,255,255,0.38)'}}>
            Find your memories. Download &amp; share with friends forever.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{color:'rgba(255,255,255,0.28)'}}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by photo number (e.g. ECE001)"
                className="search-input w-full rounded-xl pl-10 pr-4 py-3 text-sm font-mono"
              />
            </div>
            <button type="submit" disabled={searching}
              className="btn-search px-5 py-3 rounded-xl text-white font-semibold text-sm transition-all whitespace-nowrap"
              style={{
                background: searching ? '#1a2a6c' : '#1B3A8C',
                boxShadow: searching ? 'none' : '0 2px 14px rgba(27,58,140,0.5)'
              }}
              onMouseEnter={e => { if(!searching) e.currentTarget.style.background='#0d2260'; }}
              onMouseLeave={e => { if(!searching) e.currentTarget.style.background='#1B3A8C'; }}>
              {searching ? '...' : 'Search'}
            </button>
            {searchResults && (
              <button type="button" onClick={clearSearch}
                className="px-4 py-3 rounded-xl text-sm transition-all font-medium"
                style={{
                  background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.65)',
                  border:'1px solid rgba(255,255,255,0.14)'
                }}>
                Clear
              </button>
            )}
          </form>
        </div>
      </div>

      {/* ══ Gallery Content ══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8">

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm" style={{color:'rgba(255,255,255,0.40)'}}>
            {searchResults ? (
              <p>
                Found{' '}
                <span className="font-semibold" style={{color:'#CC0000'}}>{searchResults.length}</span>
                {' '}result{searchResults.length !== 1 ? 's' : ''} for{' '}
                <span className="font-mono" style={{color:'#fff'}}>"{searchQuery}"</span>
              </p>
            ) : (
              <p>
                <span className="font-semibold" style={{color:'#4a8eff'}}>{photos.length}</span> photos loaded
              </p>
            )}
          </div>
          <button onClick={refresh}
            className="refresh-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {error && (
          <div className="text-center py-16">
            <p className="mb-4" style={{color:'#f87171'}}>{error}</p>
            <button onClick={refresh}
              className="px-6 py-2 rounded-lg text-white font-semibold text-sm"
              style={{background:'#CC0000'}}>
              Try Again
            </button>
          </div>
        )}

        {initialLoading && <SkeletonGrid count={12} />}

        {!initialLoading && displayPhotos.length === 0 && !error && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{background:'rgba(27,58,140,0.18)', border:'1.5px solid rgba(27,58,140,0.35)'}}>
              <svg className="w-7 h-7" style={{color:'rgba(255,255,255,0.22)'}}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-semibold" style={{color:'rgba(255,255,255,0.45)'}}>No photos yet</p>
            <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.22)'}}>
              Photos will appear here once uploaded by admin
            </p>
          </div>
        )}

        {!initialLoading && displayPhotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {displayPhotos.map((photo, index) => (
              <div key={photo._id} className="card-anim"
                style={{animationDelay:`${Math.min(index*40,600)}ms`}}>
                <PhotoCard
                  photo={photo}
                  onDelete={handleDelete}
                  isAdmin={isAuth}
                  onClick={openModal}
                />
              </div>
            ))}
          </div>
        )}

        {!searchResults && (
          <div ref={sentinelRef} className="py-8 flex justify-center">
            {loading && !initialLoading && (
              <div className="flex items-center gap-2 text-sm" style={{color:'rgba(255,255,255,0.30)'}}>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Loading more...
              </div>
            )}
            {!hasMore && photos.length > 0 && !loading && (
              <p className="text-xs font-mono" style={{color:'rgba(255,255,255,0.18)'}}>
                — All {photos.length} photos loaded —
              </p>
            )}
          </div>
        )}
      </div>

      {/* ══ Footer ══════════════════════════════════════════════════════ */}
      <footer className="py-5 text-center"
        style={{ background:'#060c24', borderTop:'3px solid #CC0000' }}>
        <p className="text-xs font-semibold" style={{color:'rgba(255,255,255,0.45)', letterSpacing:'0.06em'}}>
          SASI Institute of Technology &amp; Engineering &nbsp;·&nbsp; ECE Farewell 2026
        </p>
        <p className="text-xs mt-1" style={{color:'rgba(255,255,255,0.20)'}}>
          Tadepalligudem, West Godavari District
        </p>
      </footer>

      {/* Lightbox */}
      {selectedIdx !== null && displayPhotos[selectedIdx] && (
        <PhotoModal
          photo={displayPhotos[selectedIdx]}
          onClose={() => setSelectedIdx(null)}
          onPrev={() => setSelectedIdx(i => i - 1)}
          onNext={() => setSelectedIdx(i => i + 1)}
          hasPrev={selectedIdx > 0}
          hasNext={selectedIdx < displayPhotos.length - 1}
        />
      )}

      {showAnnouncement && (
        <AnnouncementModal onClose={() => setShowAnnouncement(false)} />
      )}
    </div>
  );
};

export default Gallery;
