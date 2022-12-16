import styled from 'styled-components';
import React from 'react';
import { fonts } from '../../../styled-theme';
import { truncateHash } from '../../../utils';
import { useAppWidth } from '../../../hooks';

interface HashProps {
  readonly hash: string;
  readonly alwaysTruncate?: boolean;
}

export const Hash: React.FC<HashProps> = ({ hash, alwaysTruncate }) => {
  const { isMobile } = useAppWidth();

  if (alwaysTruncate || isMobile) {
    return <StyledHash>{truncateHash(hash)}</StyledHash>;
  }

  return <StyledHash>{hash}</StyledHash>;
};

export const StyledHash = styled.span`
  font-family: ${fonts.jetBrains};
`;
