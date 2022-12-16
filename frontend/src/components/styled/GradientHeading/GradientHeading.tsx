import styled from 'styled-components';
import { Heading, HeadingProps } from '../../base';

interface GradientHeadingProps extends HeadingProps {
  readonly gradient?: string;
}

const baseGradient =
  'linear-gradient(95.02deg, #1C1E90 0.62%, #693590 48.99%, #D81D54 70.51%, #D81E54 70.85%, #FD6B52 116.85%)';

export const GradientHeading = styled(Heading)<GradientHeadingProps>`
  background: ${({ gradient }) => gradient ?? baseGradient};
  background-clip: text;
  background-size: 100%;
  width: fit-content;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
`;
