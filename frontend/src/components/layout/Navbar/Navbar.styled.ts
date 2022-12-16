import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { breakpoints } from '../../../styled-theme';

export const Nav = styled.nav`
  @media (min-width: ${breakpoints.lg}) {
    width: 25%;
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
  width: 100%;
`;

export const DesktopNavItemLink = styled(Link)`
  color: #0325d1;
  font-size: clamp(0.9rem, 1.2vw, 1.4rem);
  font-weight: 500;
  text-decoration: none;

  :hover,
  :focus {
    background-color: #0325d1;
    transition: ease-in;
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
