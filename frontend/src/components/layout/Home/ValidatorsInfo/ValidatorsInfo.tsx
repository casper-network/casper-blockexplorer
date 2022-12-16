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
import { ValidatorsIcon } from '../../../icons';

export const ValidatorsInfo: React.FC = () => (
  <ValidatorsInfoDisplay>
    <ValidatorsHeader>
      <IconH2Container>
        <ValidatorsIcon />
        <H2>Validators</H2>
      </IconH2Container>
      <PageLink to="/validators">View all</PageLink>
    </ValidatorsHeader>
    <ValidatorDetails>
      <H3>Active Validators</H3>
      <H3Data>n/a</H3Data>
      <DataContext>out of 0 active bids</DataContext>
    </ValidatorDetails>
  </ValidatorsInfoDisplay>
);

const ValidatorsInfoDisplay = styled.section`
  box-shadow: 0 0.125rem 0.438rem rgba(127, 128, 149, 0.15);
  border-radius: 0.5rem;
  background: #ffffff;
  border: 0.063rem solid #e3e3e9;
  padding-bottom: 1.5rem;
  margin-bottom: 3.25rem;

  @media (min-width: ${breakpoints.md}) {
    margin-bottom: 4.25rem;
    margin-right: 3.125rem;
    min-width: 44.5%;
  }

  @media (min-width: ${breakpoints.lg}) {
    min-width: 45%;
    margin: 0 7% 4rem 0;
  }
`;

const ValidatorsHeader = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1.15rem 2rem;
`;

const ValidatorDetails = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: start;
  border-top: 0.094rem solid #f2f3f5;
  padding: 0;
  margin: 0 2rem;
`;
