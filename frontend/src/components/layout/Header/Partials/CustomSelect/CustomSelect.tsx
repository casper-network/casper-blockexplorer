import styled from 'styled-components';
import React, { useState } from 'react';
import Select, { PropsValue } from 'react-select';
import { pxToRem, colors } from '../../../../../styled-theme';
import { SelectOptions } from '../partials.types';

export interface CustomSelectProps {
  readonly currentSelection: SelectOptions | undefined;
  readonly name: string;
  readonly defaultValue: PropsValue<SelectOptions>;
  readonly options: SelectOptions[];
  readonly onChange: (selectedOption: SelectOptions | null) => void;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  currentSelection,
  name,
  defaultValue,
  options,
  onChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <SelectWrapper isMenuOpen={isMenuOpen} data-testid="select-wrapper">
      <label htmlFor="select" className="sr-only">
        Select
      </label>
      <Select
        aria-label="select-button"
        inputId="select"
        onMenuOpen={() => setIsMenuOpen(true)}
        onMenuClose={() => setIsMenuOpen(false)}
        defaultValue={defaultValue}
        value={currentSelection}
        name={name}
        options={options}
        onChange={onChange}
        isSearchable={false}
        noOptionsMessage={() => null}
        classNamePrefix="react-select"
      />
    </SelectWrapper>
  );
};

const SelectWrapper = styled.div<{ isMenuOpen: boolean }>`
  .react-select__control {
    width: 11rem;
    box-shadow: none;
    border: none;
  }

  .react-select__value-container {
    height: 3.2rem;
    background-color: #fff;
    padding: 0.7rem 0rem 0.7rem 0rem;
    margin: 0;
    border-radius: 0.375rem 0 0 0.375rem;
    box-shadow: inset 0px 1px 7px rgba(127, 128, 149, 0.3);
    position: relative;
  }

  .react-select__indicators {
    display: block;
    position: absolute;
    top: 0.5rem;
    left: 7.938rem;
    padding: 0;
  }

  .react-select__value-container:hover {
    cursor: pointer;
  }

  .react-select__single-value {
    color: black;
    font-weight: 500;
    font-size: clamp(1rem, 1vw, 1.1rem);
    text-align: left;
    padding-right: 2.3rem;
    padding-left: 1rem;
    padding-bottom: 0.05rem;
    margin: 0 auto;
  }

  .react-select__dropdown-indicator svg {
    color: ${colors.black};
    width: ${pxToRem(25)};
    transition: all 200ms ease-in;
    transform: ${({ isMenuOpen }) => (isMenuOpen ? 'rotate(180deg)' : null)};

    :focus,
    :hover {
      cursor: pointer;
    }
  }

  .react-select__indicator {
    display: block;
    color: black;
    width: 5px;
    padding: 0.5rem 0.4rem 0.5rem 0;
  }

  .react-select__menu-list {
    color: black;
    font-size: clamp(1rem, 1.2vw, 1.4rem);
    padding: 0;
    margin: 0;
    border-radius: 0.375rem;
  }

  .react-select__menu {
    color: white;
    text-align: center;
    background-color: #fff;
    border-radius: 0.375rem;
    width: 10.2rem;
    margin-left: 0.4rem;
  }

  .react-select__option:hover,
  .react-select__option:focus {
    color: black;
    transition: ease-in-out, font-weight, color, 400ms;
    font-weight: 700;
    background: linear-gradient(
      95.02deg,
      #1c1e90 0.62%,
      #693590 48.99%,
      #d81d54 70.51%,
      #d81e54 70.85%,
      #fd6b52 116.85%
    );
    background-size: 100%;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
    background-color: transparent;
  }
  .react-select__option {
    background-color: transparent;
  }

  .react-select__option--is-selected {
    display: none;
  }
`;
