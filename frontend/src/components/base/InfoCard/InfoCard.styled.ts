import styled from 'styled-components';
import { breakpoints } from '../../../styled-theme';

export const InfoCardSection = styled.section`
  margin: 0;
  padding: 0;
  width: 100%;
`;

export const InfoCardContentWrapper = styled.div`
  width: 100%;
  background: white;
  border: 1px solid #e3e3e9;
  box-shadow: 0px 0.125rem 0.5rem rgba(127, 128, 149, 0.2);
  border-radius: 0.35rem;
  padding: 2rem;
  overflow-x: auto;
  max-width: calc(100vw - 4rem);
  margin-bottom: 2rem;

  @media only screen and (min-width: ${breakpoints.md}) {
    max-width: calc(100vw - 5rem);
  }
`;

export const HeadContentWrapper = styled.div`
  margin-bottom: 2rem;
`;

export const FootContentWrapper = styled.div`
  margin-top: 1rem;
`;
