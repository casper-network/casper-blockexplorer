import React from 'react';
import useAsyncEffect from 'use-async-effect';
import styled from 'styled-components';

import {
  BlocksInfo,
  DeploysInfo,
  ValidatorsInfo,
  PeersInfo,
} from '../components/layout/Home';

import { PageWrapper } from '../components';

import {
  getBlocks,
  getBlockLoadingStatus,
  getPeers,
  getPeerLoadingStatus,
  useAppDispatch,
  useAppSelector,
  Loading,
  fetchBlocks,
  fetchPeers,
} from '../store';
import { breakpoints } from '../styled-theme';

export const Home: React.FC = () => {
  const dispatch = useAppDispatch();

  const blocks = useAppSelector(getBlocks);
  const peers = useAppSelector(getPeers);

  const blockLoadingStatus = useAppSelector(getBlockLoadingStatus);
  const peerLoadingStatus = useAppSelector(getPeerLoadingStatus);

  const blocksAreLoading = blockLoadingStatus !== Loading.Complete;
  const peersAreLoading = peerLoadingStatus !== Loading.Complete;
  const isLoading = blocksAreLoading || peersAreLoading;

  const firstListedBlockHeight = !blocksAreLoading
    ? blocks[0].height.toLocaleString()
    : 'n/a';
  const firstListedBlockEraID = !blocksAreLoading
    ? blocks[0].eraID.toLocaleString()
    : 'n/a';
  const firstListedBlockEraTimeStamp = !blocksAreLoading
    ? blocks[0].readableTimestamp
    : 'n/a';

  const currentPeers = !peersAreLoading ? peers.length.toLocaleString() : 'n/a';

  useAsyncEffect(async () => {
    if (blockLoadingStatus === Loading.Idle) {
      dispatch(fetchBlocks());
    }
    if (peerLoadingStatus === Loading.Idle) {
      dispatch(fetchPeers());
    }
  }, []);

  return (
    <PageWrapper isLoading={isLoading}>
      <HomeContentContainer>
        <BlocksInfo
          blockHeight={firstListedBlockHeight}
          blockEraTimeStamp={firstListedBlockEraTimeStamp}
          blockEraID={firstListedBlockEraID}
        />
        <DeploysInfo />
        <ValidatorsInfo />
        <PeersInfo currentPeers={currentPeers} />
      </HomeContentContainer>
    </PageWrapper>
  );
};

const HomeContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 17.2rem;

  @media (min-width: ${breakpoints.md}) {
    min-width: 39rem;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }

  @media (min-width: ${breakpoints.lg}) {
    min-width: 54.8rem;
    max-width: 65rem;
  }
`;
