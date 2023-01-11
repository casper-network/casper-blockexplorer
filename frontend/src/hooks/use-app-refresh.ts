import { useEffect } from 'react';
import { updateRefreshTimer, useAppDispatch } from '../store';

export const useAppRefresh = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (!document.hidden) dispatch(updateRefreshTimer());
    }, 1000);

    return () => clearTimeout(refreshInterval);
  }, [dispatch]);
};
