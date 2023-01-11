import {
  QueryFunctionContext,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { SortDirection } from '@tanstack/react-table';

import { casperApi } from 'src/api';
import { QueryProps } from './types';
import useLatestBlockHeight from './useLatestBlockHeight';

export interface IUseBlocks extends QueryProps {
  orderByHeight?: SortDirection;
  numToShow?: number;
}

interface QueryPageParam {
  fromHeight: number;
  numToShow?: number;
}

export default function useBlocks(props?: IUseBlocks) {
  const numToShow = props?.numToShow || 20;
  const orderByHeight = props?.orderByHeight || 'desc';

  const { data: latestBlockHeight } = useLatestBlockHeight();

  return useInfiniteQuery(
    ['blocks'],
    async ({ pageParam }: QueryFunctionContext<QueryKey, QueryPageParam>) => {
      const fromHeight =
        orderByHeight === 'desc'
          ? pageParam?.fromHeight
          : pageParam?.fromHeight || numToShow - 1;

      const blocks = await casperApi.getBlocks(fromHeight, numToShow);

      return blocks.sort((a, b) =>
        orderByHeight === 'asc' ? a.height - b.height : b.height - a.height,
      );
    },
    {
      enabled: latestBlockHeight !== undefined,
      getNextPageParam: lastPage => {
        if (orderByHeight === 'desc')
          return {
            fromHeight: lastPage[numToShow - 1].height - (numToShow - 1),
          };
        return {
          fromHeight: lastPage[numToShow - 1].height + numToShow,
        };
      },
    },
  );
}
