import React from 'react';
import { useAppSelector } from 'src/store';

export const RefreshTimer: React.FC = () => {
  const { refreshTimer } = useAppSelector(state => state.app);

  return <span>Refreshing in {refreshTimer} seconds..</span>;
};
