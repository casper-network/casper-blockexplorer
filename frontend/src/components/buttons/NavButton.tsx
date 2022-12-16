import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../../styled-theme';
import { Button } from '../base';
import { ButtonProps } from '../base/Button/Button';

export const NavButton: React.FC<ButtonProps> = ({
  children,
  type,
  onClick,
  color,
}) => {
  return (
    <ButtonStyles>
      <Button type={type} onClick={onClick} color={color}>
        {children}
      </Button>
    </ButtonStyles>
  );
};

export const ButtonStyles = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  margin: 0 auto;
  padding: 0;
  width: 90%;
  border-style: none;
  z-index: 20;

  @media (min-width: ${breakpoints.lg}) {
    display: none;
  }
`;
