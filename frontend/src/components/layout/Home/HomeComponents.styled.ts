import { Link } from 'react-router-dom';

import styled from 'styled-components';
import { fontWeight } from '../../../styled-theme';

export const IconH2Container = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 84%;
`;

export const H2 = styled.h2`
  font-size: clamp(1.5rem, 2vw, 1.7rem);
  font-weight: ${fontWeight.semiBold};
  line-height: 1;
  max-width: 10.5rem;
  padding-left: 0.7rem;
`;

export const PageLink = styled(Link)`
  color: #0325d1;
  font-size: clamp(0.67rem, 1.25vw, 1rem);
  text-align: right;
  font-weight: ${fontWeight.medium};
  min-width: 3.5rem;
  text-decoration: none;

  :hover,
  :focus {
    background-color: #0325d1;
    background-image: linear-gradient(
      90deg,
      #1c1e90,
      #693590,
      #d81d54,
      #d81e54,
      #fd6b52
    );
    background-size: 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
    text-decoration: none;
  }
`;

export const H3 = styled.h3`
  font-weight: ${fontWeight.medium};
  font-size: clamp(0.9rem, 1.35vw, 1rem);
  line-height: 1;
  padding-top: 1.45rem;
`;

export const H3Data = styled.p`
  color: #0325d1;
  font-weight: ${fontWeight.extraBold};
  font-size: clamp(1.6rem, 2vw, 2.2rem);
  padding: 0.55rem 0 0.2rem 0;
`;

export const DataContext = styled.p`
  color: #7f8095;
  font-weight: ${fontWeight.medium};
  font-size: clamp(0.9rem, 1.25vw, 1rem);
`;
