import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { breakpoints, pxToRem } from '../../../styled-theme';

export const Nav = styled.nav`
  @media (min-width: ${breakpoints.lg}) {
    width: 27%;
  }
`;

export const NavComponentsContainer = styled.div`
  display: flex;
`;

export const NavItemsContainer = styled.div`
  width: 100%;
`;

export const MobileNav = styled.nav`
  @media (min-width: ${breakpoints.lg}) {
    display: none;
  }
`;

export const MobileNavItemsContainer = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  align-items: center;
  gap: 1.25rem;
  z-index: 10;
  background-color: #0325d1;
  position: fixed;
  left: 0;
  top: 0;
`;

export const MobileNavItemLink = styled(Link)`
  color: white;
  font-size: 1.375rem;
  padding: 0.3125rem;
  width: 100%;
  font-weight: 500;
  letter-spacing: 0.025em;

  :hover {
    transition: color ease-in 200ms;
    color: #d51e4a;
    transition-property: color;
    text-decoration: none;
  }
`;

export const DesktopNav = styled.nav`
  display: none;

  @media (min-width: ${breakpoints.lg}) {
    display: flex;
  }
`;

export const DesktopNavItemsContainer = styled.ul`
  display: flex;
  justify-content: space-between;
  gap: ${pxToRem(4)};
  width: 100%;
  padding-top: ${pxToRem(8)};
`;

export const DesktopNavItemLink = styled(Link)`
  transition: all 0.2s ease;
  color: #0325d1;
  padding: ${pxToRem(6)} ${pxToRem(20)};
  font-size: clamp(0.9rem, 1.2vw, 1.4rem);
  font-weight: 500;
  text-decoration: none;
  border-radius: ${pxToRem(8)};

  @media (hover: hover) {
    :hover,
    :focus {
      color: white;
      background-color: #02115f;
      padding: ${pxToRem(6)} ${pxToRem(20)};
      background-color: #02115f;
      text-decoration: none;
    }
  }
`;
