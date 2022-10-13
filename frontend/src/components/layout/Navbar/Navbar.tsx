import React, { useState, useEffect } from 'react';

import {
  NavComponentsContainer,
  Nav,
  NavButtonContainer,
  NavButton,
  NavItemsContainer,
  DesktopNav,
  DesktopNavItemsContainer,
  DesktopNavItemLink,
  MobileNav,
  MobileNavItemsContainer,
  MobileNavItemLink,
} from './Navbar.styled';

import { OpenMenuIcon, CloseMenuIcon } from '../../icons';

const navItems = [
  {
    title: 'Home',
    path: '/',
    key: 'home',
  },
  {
    title: 'Blocks',
    path: '/blocks',
    key: 'blocks',
  },
  {
    title: 'Peers',
    path: '/peers',
    key: 'peers',
  },
];

export const Navbar: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const escKeyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (isOpened) {
          setIsOpened(false);
        }
      }
    };

    document.addEventListener('keydown', escKeyHandler);

    return () => {
      document.removeEventListener('keydown', escKeyHandler);
    };
  }, [isOpened]);

  return (
    <Nav>
      <NavComponentsContainer>
        <NavButtonContainer>
          <NavButton type="button" onClick={() => setIsOpened(!isOpened)}>
            {isOpened ? <CloseMenuIcon /> : <OpenMenuIcon />}
          </NavButton>
        </NavButtonContainer>
        <NavItemsContainer>
          {isOpened && (
            <MobileNav>
              <MobileNavItemsContainer>
                {navItems.map(({ path, title, key }) => {
                  return (
                    <li key={key}>
                      <MobileNavItemLink
                        to={path}
                        onClick={() => setIsOpened(false)}>
                        {title}
                      </MobileNavItemLink>
                    </li>
                  );
                })}
              </MobileNavItemsContainer>
            </MobileNav>
          )}
          <DesktopNav>
            <DesktopNavItemsContainer>
              {navItems.map(({ path, title, key }) => {
                return (
                  <li key={key}>
                    <DesktopNavItemLink to={path}>{title}</DesktopNavItemLink>
                  </li>
                );
              })}
            </DesktopNavItemsContainer>
          </DesktopNav>
        </NavItemsContainer>
      </NavComponentsContainer>
    </Nav>
  );
};
