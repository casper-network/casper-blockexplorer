import styled from 'styled-components';

interface FlexProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  justifyItems?:
    | 'normal'
    | 'stretch'
    | 'center'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'self-start'
    | 'self-end'
    | 'left;  '
    | 'right';
  alignItems?:
    | 'stretch'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'baseline'
    | 'first baseline'
    | 'last baseline'
    | 'start'
    | 'end'
    | 'self-start'
    | 'self-end';
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch'
    | 'start'
    | 'end'
    | 'baseline'
    | 'first baseline'
    | 'last baseline';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: string;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction ?? 'row'};
  justify-content: ${({ justifyContent }) => justifyContent ?? 'flex-start'};
  justify-items: ${({ justifyItems }) => justifyItems ?? 'legacy'};
  align-content: ${({ alignContent }) => alignContent ?? 'stretch'};
  align-items: ${({ alignItems }) => alignItems ?? 'stretch'};
  flex-wrap: ${({ wrap }) => wrap ?? 'nowrap'};
  gap: ${({ gap }) => gap ?? '0px'};
  width: 100%;
`;
