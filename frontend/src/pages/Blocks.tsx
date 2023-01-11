import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SortingState } from '@tanstack/react-table';

import { useBlocks, useLatestBlockHeight, IUseBlocks } from 'src/hooks';
import { BlockTable, GradientHeading, PageWrapper } from 'src/components';
import { useAppSelector } from 'src/store';

const DEFAULT_BLOCKS_COUNT_TO_FETCH = 2;

const initialParam: IUseBlocks = {
  orderByHeight: 'desc',
  numToShow: DEFAULT_BLOCKS_COUNT_TO_FETCH,
};

export const Blocks: React.FC = () => {
  const [sort, setSort] = useState<SortingState>([]);
  const [params, setParams] = useState<IUseBlocks>(initialParam);
  const [shouldRefetchBlocks, setShouldRefetchBlocks] = useState(false);

  const { refreshTimer } = useAppSelector(state => state.app);

  const { t } = useTranslation();
  const { data: latestBlockHeight, refetch: refetchLatestBlockHeight } =
    useLatestBlockHeight();
  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    refetch: refetchBlocks,
  } = useBlocks(params);

  const blocks = useMemo(() => {
    return data?.pages.reduce((accum, page) => [...accum, ...page], []);
  }, [data]);

  useEffect(() => {
    if (refreshTimer === 0) {
      refetchLatestBlockHeight();
      refetchBlocks();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTimer]);

  useEffect(() => {
    if (sort.length === 0) return;
    const { id, desc } = sort[0];
    if (id === 'height') {
      setParams(prev => ({
        ...prev,
        orderByHeight: desc ? 'desc' : 'asc',
      }));
      setShouldRefetchBlocks(prev => !prev);
    }
  }, [sort]);

  useEffect(() => {
    refetchBlocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRefetchBlocks]);

  return (
    <PageWrapper isLoading={isLoading}>
      <GradientHeading type="h2">{t('blocks')}</GradientHeading>
      {blocks && (
        <BlockTable
          latestBlockHeight={latestBlockHeight}
          blocks={blocks}
          fetchMore={fetchNextPage}
          isLoadingMoreBlocks={isLoading || isFetching}
          sorting={sort}
          onSortingChange={setSort}
        />
      )}
    </PageWrapper>
  );
};
