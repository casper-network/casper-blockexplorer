import styled from 'styled-components';
import React from 'react';
import { standardizeNumber } from '../../../utils';
import { fonts } from '../../../styled-theme';

interface CoinProps {
  children: string;
}

export const Coin: React.FC<CoinProps> = ({ children }) => {
  return <CoinWrapper>{standardizeNumber(children)} Motes</CoinWrapper>;
};

const CoinWrapper = styled.p`
  font-family: ${fonts.jetBrains};
`;
