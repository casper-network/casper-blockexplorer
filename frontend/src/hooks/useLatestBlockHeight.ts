import { useQuery } from '@tanstack/react-query';
import { casperApi } from 'src/api';
import { REFRESH_TIMER_SECONDS } from 'src/constants';
import { QueryProps } from './types';

type IUseLatestBlockHeight = QueryProps;

export default function useLatestBlockHeight(props?: IUseLatestBlockHeight) {
  const staleTime = props?.staleTime || REFRESH_TIMER_SECONDS * 1000;
  return useQuery(['latest-block-height'], casperApi.getCurrentBlockHeight, {
    initialData: undefined,
    staleTime,
  });
}
