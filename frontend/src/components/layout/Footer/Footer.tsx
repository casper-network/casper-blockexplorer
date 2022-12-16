import styled from 'styled-components';
import React from 'react';
import { colors, fontWeight } from 'src/styled-theme';
import { useAppSelector, getNetworkStatus } from '../../../store';

export const Footer: React.FC = () => {
  const { api, build } = useAppSelector(getNetworkStatus);

  return (
    <FooterWrapper>
      <p>Casper Node version: {build}</p>
      <p>API version: {api}</p>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  color: ${colors.cobaltBlue};
  font-size: clamp(0.9rem, 1.2vw, 1.4rem);
  font-weight: ${fontWeight.medium};
  padding-bottom: 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
