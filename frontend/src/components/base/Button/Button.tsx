import React from 'react';
import styled from 'styled-components';
import { pxToRem } from '../../../styled-theme';

export type ButtonType = 'submit' | 'reset' | 'button';

export interface ButtonProps {
  readonly children: React.ReactNode;
  readonly onClick?: () => void;
  readonly color?: string;
  readonly type: ButtonType;
  readonly className?: string;
  readonly isDisabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  color = 'blue',
  type,
  className,
  isDisabled = false,
}) => {
  return (
    <StyledButton
      type={type}
      className={className}
      bgColor={color}
      onClick={onClick}
      disabled={isDisabled}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{ bgColor: string }>`
  color: white;
  background-color: ${({ bgColor }) => bgColor};
  text-align: center;
  padding: ${pxToRem(10)};
  border-radius: ${pxToRem(10)};
  cursor: pointer;
  border: none;
`;
