import styled from 'styled-components';
import React from 'react';

export type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps {
  readonly type: HeadingType;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  type,
  className,
}) => {
  switch (type) {
    case 'h1':
      return <HeadingOne className={className}>{children}</HeadingOne>;
    case 'h2':
      return <HeadingTwo className={className}>{children}</HeadingTwo>;
    case 'h3':
      return <HeadingThree className={className}>{children}</HeadingThree>;
    case 'h4':
      return <HeadingFour className={className}>{children}</HeadingFour>;
    case 'h5':
      return <HeadingFive className={className}>{children}</HeadingFive>;
    case 'h6':
      return <HeadingSix className={className}>{children}</HeadingSix>;
    default:
      return <HeadingOne className={className}>{children}</HeadingOne>;
  }
};

const HeadingOne = styled.h1`
  font-size: 3.75rem;
  margin-bottom: 1.25rem;
`;

const HeadingTwo = styled.h2`
  font-size: 2.75rem;
  margin-bottom: 1rem;
`;

const HeadingThree = styled.h3`
  font-size: 2.25rem;
  margin-bottom: 1rem;
`;

const HeadingFour = styled.h4`
  font-size: 1.75rem;
  margin-bottom: 1rem;
`;

const HeadingFive = styled.h5`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const HeadingSix = styled.h6`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;
