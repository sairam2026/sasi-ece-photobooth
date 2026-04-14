import { useState, useEffect, useCallback, useRef } from 'react';
import { photosAPI } from '../utils/api';

export const usePhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadingRef = useRef(false);

  const fetchPhotos = useCallback(async (pageNum, reset = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const { data } = await photosAPI.getAll(pageNum, 20);
      if (data.success) {
        setPhotos(prev => reset ? data.data : [...prev, ...data.data]);
        setHasMore(data.pagination.hasMore);
        setPage(pageNum);
      }
    } catch (err) {
      setError('Failed to load photos');
    } finally {
      setLoading(false);
      setInitialLoading(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchPhotos(1, true);
  }, [fetchPhotos]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPhotos(page + 1);
    }
  }, [loading, hasMore, page, fetchPhotos]);

  const refresh = useCallback(() => {
    setInitialLoading(true);
    fetchPhotos(1, true);
  }, [fetchPhotos]);

  const removePhoto = useCallback((id) => {
    setPhotos(prev => prev.filter(p => p._id !== id));
  }, []);

  return { photos, loading, initialLoading, hasMore, error, loadMore, refresh, removePhoto };
};
