import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils';
import { Navbar } from './Navbar';

jest.mock('../../../hooks', () => {
  return {
    useAppWidth: () => {
      return { windowWidth: 1022, isMobile: false };
    },
  };
});

describe('Navbar', () => {
  it('should render the Navbar component and contain nav items', () => {
    render(<Navbar />);

    const nav = screen.getByTestId('navigation');

    expect(nav).toBeInTheDocument();
    expect(nav).toHaveTextContent('Home');
    expect(nav).toHaveTextContent('Blocks');
    expect(nav).toHaveTextContent('Peers');
  });

  it('should hide navigation text content when screen width is below 1023px', () => {
    render(<Navbar />);
    const navItem1 = screen.getByText('Home');
    const navItem2 = screen.getByText('Blocks');
    const navItem3 = screen.getByText('Peers');

    expect(navItem1).not.toBeVisible();
    expect(navItem2).not.toBeVisible();
    expect(navItem3).not.toBeVisible();
  });
});
