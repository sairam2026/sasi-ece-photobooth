import { useState, useCallback } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { photosAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PhotoCard from '../components/PhotoCard';
import PhotoModal from '../components/PhotoModal';
import SkeletonGrid from '../components/SkeletonGrid';
import toast from 'react-hot-toast';

const Gallery = () => {
  const { photos, loading, initialLoading, hasMore, error, loadMore, refresh, removePhoto } = usePhotos();
  const { isAuth } = useAuth();
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  // Infinite scroll sentinel
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
    } catch {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  const handleDelete = async (id) => {
    try {
      await photosAPI.delete(id);
      removePhoto(id);
      if (searchResults) setSearchResults(prev => prev.filter(p => p._id !== id));
      toast.success('Photo deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const displayPhotos = searchResults || photos;
  const openModal = (photo) => {
    const idx = displayPhotos.findIndex(p => p._id === photo._id);
    setSelectedIdx(idx);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #F4B942 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <p className="text-gold-500 text-xs font-mono tracking-[0.3em] uppercase mb-3 animate-fade-in">
            Sri Aditya School of Engineering
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 animate-slide-up">
            ECE Farewell
            <span className="block gold-text">Photo Booth</span>
          </h1>
          <p className="text-dark-400 text-base sm:text-lg max-w-md mx-auto mb-8 animate-slide-up animate-delay-100">
            Find your memories. Download & share with friends forever.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto animate-slide-up animate-delay-200">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by photo number (e.g. ECE001)"
                className="w-full bg-dark-700 border border-dark-500 focus:border-gold-500 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-dark-400 outline-none transition-colors font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-dark-900 font-semibold text-sm transition-all whitespace-nowrap"
            >
              {searching ? '...' : 'Search'}
            </button>
            {searchResults && (
              <button type="button" onClick={clearSearch} className="px-4 py-3 rounded-xl bg-dark-600 hover:bg-dark-500 text-white text-sm transition-all">
                Clear
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Gallery content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Stats / search results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {searchResults ? (
              <p className="text-dark-400 text-sm">
                Found <span className="text-gold-400 font-semibold">{searchResults.length}</span> result{searchResults.length !== 1 ? 's' : ''} for <span className="font-mono text-white">"{searchQuery}"</span>
              </p>
            ) : (
              <p className="text-dark-400 text-sm">
                <span className="text-gold-400 font-semibold">{photos.length}</span> photos loaded
              </p>
            )}
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-dark-400 hover:text-white hover:bg-dark-600 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={refresh} className="px-6 py-2 rounded-lg bg-gold-500 text-dark-900 font-semibold text-sm">Try Again</button>
          </div>
        )}

        {/* Initial loading */}
        {initialLoading && <SkeletonGrid count={12} />}

        {/* Empty state */}
        {!initialLoading && displayPhotos.length === 0 && !error && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-dark-700 border border-dark-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-dark-400 text-lg font-display">No photos yet</p>
            <p className="text-dark-500 text-sm mt-1">Photos will appear here once uploaded by admin</p>
          </div>
        )}

        {/* Photo grid */}
        {!initialLoading && displayPhotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {displayPhotos.map((photo) => (
              <PhotoCard
                key={photo._id}
                photo={photo}
                onDelete={handleDelete}
                isAdmin={isAuth}
                onClick={openModal}
              />
            ))}
          </div>
        )}

        {/* Load more sentinel */}
        {!searchResults && (
          <div ref={sentinelRef} className="py-8 flex justify-center">
            {loading && !initialLoading && (
              <div className="flex items-center gap-2 text-dark-400 text-sm">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading more...
              </div>
            )}
            {!hasMore && photos.length > 0 && !loading && (
              <p className="text-dark-500 text-xs font-mono">— All {photos.length} photos loaded —</p>
            )}
          </div>
        )}
      </div>

      {/* Lightbox modal */}
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
    </div>
  );
};

export default Gallery;
