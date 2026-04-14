import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { photosAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { usePhotos } from '../hooks/usePhotos';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import PhotoCard from '../components/PhotoCard';
import PhotoModal from '../components/PhotoModal';
import toast from 'react-hot-toast';

const UploadZone = ({ onUpload }) => {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = (selected) => {
    setFiles(Array.from(selected));
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setProgress(0);
    setResult(null);

    const formData = new FormData();
    const isSingle = files.length === 1;

    if (isSingle) {
      formData.append('photo', files[0]);
    } else {
      files.forEach(f => formData.append('photos', f));
    }

    try {
      const onProgress = (e) => {
        if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
      };

      const { data } = isSingle
        ? await photosAPI.upload(formData, onProgress)
        : await photosAPI.uploadMultiple(formData, onProgress);

      if (data.success) {
        const count = isSingle ? 1 : data.uploaded;
        toast.success(`${count} photo${count > 1 ? 's' : ''} uploaded!`);
        setResult({ uploaded: count, failed: data.failed || 0 });
        setFiles([]);
        onUpload();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-gold-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </span>
        Upload Photos
      </h2>

      {/* Drop zone */}
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragging ? 'drop-zone-active' : 'border-dark-500 hover:border-dark-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <svg className="w-10 h-10 text-dark-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-white font-medium">Drop photos here or click to browse</p>
        <p className="text-dark-400 text-sm mt-1">JPEG, PNG, WebP · Max 20MB per file · Up to 150 files</p>
      </div>

      {/* Selected files preview */}
      {files.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-dark-700 border border-dark-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-white">{files.length} file{files.length > 1 ? 's' : ''} selected</p>
            <button onClick={() => setFiles([])} className="text-xs text-dark-400 hover:text-white transition-colors">Clear</button>
          </div>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
            {files.map((f, i) => (
              <span key={i} className="text-xs bg-dark-600 text-dark-300 px-2 py-0.5 rounded-full truncate max-w-[150px]">
                {f.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Progress */}
      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-dark-400 mb-1">
            <span>Uploading {files.length} photo{files.length > 1 ? 's' : ''}...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm">
          <p className="text-green-400 font-medium">✓ {result.uploaded} photo{result.uploaded > 1 ? 's' : ''} uploaded successfully</p>
          {result.failed > 0 && <p className="text-red-400 mt-0.5">{result.failed} failed</p>}
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!files.length || uploading}
        className="w-full mt-4 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-dark-900 font-semibold text-sm transition-all flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload {files.length > 0 ? `${files.length} Photo${files.length > 1 ? 's' : ''}` : 'Photos'}
          </>
        )}
      </button>
    </div>
  );
};

const AdminPanel = () => {
  const { isAuth, logout, username } = useAuth();
  const navigate = useNavigate();
  const { photos, loading, initialLoading, hasMore, loadMore, refresh, removePhoto } = usePhotos();
  const [selectedIdx, setSelectedIdx] = useState(null);

  const sentinelRef = useIntersectionObserver(useCallback(() => loadMore(), [loadMore]));

  if (!isAuth) {
    navigate('/admin/login');
    return null;
  }

  const handleDelete = async (id) => {
    try {
      await photosAPI.delete(id);
      removePhoto(id);
      toast.success('Photo deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-dark-400 text-sm mt-0.5">Welcome back, <span className="text-gold-400 font-mono">{username}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-xl px-4 py-2 text-center">
              <p className="text-gold-400 font-bold text-xl font-mono">{photos.length}</p>
              <p className="text-dark-400 text-xs">Total Photos</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Upload */}
          <div className="lg:col-span-1">
            <UploadZone onUpload={refresh} />
          </div>

          {/* Right: Photo management */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold text-white">Manage Photos</h2>
                <button onClick={refresh} className="text-xs text-dark-400 hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>

              {initialLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl skeleton" />
                  ))}
                </div>
              ) : photos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-dark-400">No photos uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
                  {photos.map((photo) => (
                    <PhotoCard
                      key={photo._id}
                      photo={photo}
                      onDelete={handleDelete}
                      isAdmin={true}
                      onClick={(p) => {
                        const idx = photos.findIndex(x => x._id === p._id);
                        setSelectedIdx(idx);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Load more */}
              <div ref={sentinelRef} className="pt-4 flex justify-center">
                {loading && !initialLoading && (
                  <svg className="w-5 h-5 animate-spin text-gold-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedIdx !== null && photos[selectedIdx] && (
        <PhotoModal
          photo={photos[selectedIdx]}
          onClose={() => setSelectedIdx(null)}
          onPrev={() => setSelectedIdx(i => i - 1)}
          onNext={() => setSelectedIdx(i => i + 1)}
          hasPrev={selectedIdx > 0}
          hasNext={selectedIdx < photos.length - 1}
        />
      )}
    </div>
  );
};

export default AdminPanel;
