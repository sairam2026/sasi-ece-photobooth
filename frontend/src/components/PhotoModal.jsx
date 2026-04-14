import { useEffect } from 'react';

const PhotoModal = ({ photo, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  const handleDownload = async () => {
    try {
      const res = await fetch(photo.url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${photo.photoNumber}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(photo.url, '_blank');
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`📸 Check out my farewell photo! Photo ID: ${photo.photoNumber}\n${photo.url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-dark-600/80 hover:bg-dark-500 text-white transition-all"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 z-10 p-3 rounded-full bg-dark-600/80 hover:bg-dark-500 text-white transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 z-10 p-3 rounded-full bg-dark-600/80 hover:bg-dark-500 text-white transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-4xl w-full mx-4 flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.url}
          alt={photo.photoNumber}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
        />

        {/* Info + Actions */}
        <div className="glass rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg">
          <div className="text-center sm:text-left flex-1">
            <p className="font-mono text-gold-400 font-semibold text-lg">{photo.photoNumber}</p>
            <p className="text-dark-400 text-xs mt-0.5">
              {photo.width && photo.height ? `${photo.width} × ${photo.height}` : ''}{' '}
              {photo.size ? `· ${(photo.size / 1024).toFixed(0)} KB` : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold text-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
