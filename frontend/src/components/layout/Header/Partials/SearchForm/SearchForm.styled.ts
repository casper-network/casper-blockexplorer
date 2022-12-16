import styled from 'styled-components';
import { breakpoints } from 'src/styled-theme';

export const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 2.6rem;
  padding-bottom: 2.7rem;
  margin: 0 auto;
  position: relative;

  @media (min-width: ${breakpoints.lg}) {
    padding: 5rem 0rem 8.5rem 0rem;
    width: 100%;
  }
`;

export const Form = styled.form`
  width: 92%;

  @media (min-width: ${breakpoints.md}) {
    width: 63%;
    min-width: 40rem;
  }

  @media (min-width: ${breakpoints.lg}) {
    min-width: 42.4rem;
    width: 100%;
    max-width: 48rem;
  }
`;

export const FormComponentsContainer = styled.div`
  @media (min-width: ${breakpoints.lg}) {
    display: flex;
    width: 100%;
  }
`;

export const InputAndButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 1.4rem;
  margin: 0 auto;
  width: 91%;

  @media (min-width: ${breakpoints.lg}) {
    padding-top: 0;
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  display: block;
  color: black;
  background-color: #fff;
  height: 2.8125rem;
  width: 100%;
  font-size: clamp(0.9rem, 1.1vw, 1.4rem);
  border-radius: 0.375rem 0 0 0.375rem;
  padding: 0 1.25rem;
  margin-top: 0;
  margin-bottom: 0;
  box-shadow: inset 0px 1px 7px rgba(127, 128, 149, 0.2);
  border-style: none;
  appearance: none;

  :hover,
  :focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  @media (min-width: ${breakpoints.lg}) {
    height: 3.2rem;
    border-radius: 0;
  }
`;

export const SubmitButton = styled.button`
  font-weight: 500;
  background-color: #0325d1;
  height: 2.8125rem;
  width: 3.4rem;
  padding-top: 0.5rem;
  border-radius: 0 0.375rem 0.375rem 0;
  cursor: pointer;
  position: relative;
  right: 0.0625rem;
  border-style: none;

  :hover,
  :focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  @media (min-width: ${breakpoints.lg}) {
    height: 3.2rem;
    width: 3.9rem;
  }
`;

export const ErrorMessageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 1rem 0;
  position: absolute;
  right: 0;
  left: 0;
`;

export const ErrorSvgContainer = styled.div`
  height: 1.55rem;
  width: 1.55rem;
  stroke: #da2f54;
  stroke-width: 2;
  fill: #fff;
`;

export const ErrorMessage = styled.p`
  color: #da2f54;
  font-size: 0.9rem;
  padding-top: 0.1rem;
`;
