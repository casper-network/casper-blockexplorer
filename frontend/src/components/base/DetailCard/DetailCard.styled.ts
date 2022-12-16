import styled from 'styled-components';
import { colors } from '../../../styled-theme';

export const TableData = styled.td<{ noDividers?: boolean }>`
  height: 100%;
  width: auto;
  padding: 1rem 0;
  border: none;
  border-bottom: ${({ noDividers }) =>
    noDividers ? 'none' : '1px solid rgb(245 245 247)'};
`;

export const TableLabel = styled(TableData)`
  width: 12.5rem;
  color: ${colors.greyBlue};
  white-space: nowrap;
  padding-right: 2rem;
  vertical-align: top;
`;

export const TableValue = styled(TableData)`
  display: flex;
  align-items: center;
`;
