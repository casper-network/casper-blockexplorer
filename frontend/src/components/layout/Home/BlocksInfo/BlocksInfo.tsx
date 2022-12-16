import React from 'react';
import styled from 'styled-components';

import {
  IconH2Container,
  H2,
  PageLink,
  H3,
  H3Data,
  DataContext,
} from '../HomeComponents.styled';
import { breakpoints } from '../../../../styled-theme';
import { BlocksIcon } from '../../../icons';

interface BlockInfoProps {
  readonly blockHeight: string;
  readonly blockEraTimeStamp: string;
  readonly blockEraID: string;
}

export const BlocksInfo: React.FC<BlockInfoProps> = ({
  blockHeight,
  blockEraTimeStamp,
  blockEraID,
}) => (
  <BlockInfoDisplay>
    <BlocksHeader>
      <IconH2Container>
        <BlocksIcon />
        <H2>Blocks</H2>
      </IconH2Container>
      <PageLink to="/blocks">View all</PageLink>
    </BlocksHeader>
    <BlockDetails>
      <H3>Block Height</H3>
      <H3Data>{blockHeight}</H3Data>
      <DataContext>{blockEraTimeStamp}</DataContext>
      <H3>Current Era</H3>
      <H3Data>{blockEraID}</H3Data>
    </BlockDetails>
  </BlockInfoDisplay>
);

const BlockInfoDisplay = styled.section`
  background: #ffffff;
  border: 0.063rem solid #e3e3e9;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.438rem rgba(127, 128, 149, 0.15);
  padding-bottom: 1.5rem;
  margin-bottom: 3.25rem;

  @media (min-width: ${breakpoints.md}) {
    margin-bottom: 4.25rem;
    margin-right: 3.125rem;
    min-width: 44.5%;
  }

  @media (min-width: ${breakpoints.lg}) {
    min-width: 45%;
    margin: 0 4.8rem 4rem 0;
  }
`;

const BlocksHeader = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1.15rem 2rem;
`;

const BlockDetails = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: start;
  border-top: 0.094rem solid #f2f3f5;
  padding: 0 0;
  margin: 0 2rem;
`;
