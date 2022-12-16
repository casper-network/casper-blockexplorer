import styled from 'styled-components';
import { colors, fontWeight } from '../../../styled-theme';

export const DetailDataLabel = styled.h3`
  font-weight: ${fontWeight.normal};
  font-size: 1.05rem;
  color: ${colors.greyBlue};
`;

export const DetailDataWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

interface DetailDataListProps {
  width?: string;
  gap?: string;
}

export const DetailDataList = styled.ul<DetailDataListProps>`
  display: grid;
  gap: ${({ gap }) => gap ?? '2.5rem'};
  width: ${({ width }) => width ?? 'inherit'};
  height: fit-content;
`;

export const DetailDataValue = styled.div`
  font-size: 1.25rem;
  color: black;
  font-weight: ${fontWeight.medium};
`;
