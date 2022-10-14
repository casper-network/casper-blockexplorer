import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Select from 'react-select';

import { FormValues, SelectOptions } from '../partials.types';
import { useAppWidth } from '../../../../../hooks';
import {
  MobileSelectButton,
  MobileSelectContainer,
} from './SearchSelect.styled';

interface SearchSelectProps {
  readonly control: Control<FormValues, any>;
  readonly currentFilterOption: string;
  readonly setCurrentFilterOption: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchSelect: React.FC<SearchSelectProps> = ({
  control,
  currentFilterOption,
  setCurrentFilterOption,
}) => {
  const { isMobile } = useAppWidth();

  const selectOptions: SelectOptions[] = [
    { value: 'account', label: 'Account' },
    { value: 'deploy', label: 'Deploy' },
    { value: 'block', label: 'Block Hash' },
    { value: 'blockHeight', label: 'Block Height' },
  ];

  return (
    <Controller
      control={control}
      render={({ field: { onChange, value, name } }) => {
        const currentSelection = selectOptions.find(
          option => option.value === value,
        );

        const handleSelectChange = (selectedOption: SelectOptions | null) => {
          onChange(selectedOption?.value);
          setCurrentFilterOption(selectedOption?.value!);
        };

        return !isMobile ? (
          <Select
            defaultValue={selectOptions[0]}
            value={currentSelection}
            name={name}
            options={selectOptions}
            onChange={handleSelectChange}
            isSearchable={false}
            noOptionsMessage={() => null}
            className="custom-select"
            classNamePrefix="react-select"
          />
        ) : (
          <MobileSelectContainer>
            {selectOptions.map(option => {
              const handleClick = () => {
                onChange(option.value);
                setCurrentFilterOption(option.value);
              };

              return (
                <li key={option.value}>
                  <MobileSelectButton
                    onClick={handleClick}
                    style={{
                      backgroundColor:
                        currentFilterOption === option.value
                          ? '#0325d1'
                          : '#F1F1F4',
                      color:
                        currentFilterOption === option.value ? '#fff' : '#000',
                    }}
                    type="button">
                    {option.label.includes('Block')
                      ? option.label.replace('Block', 'Blk')
                      : option.label}
                  </MobileSelectButton>
                </li>
              );
            })}
          </MobileSelectContainer>
        );
      }}
      name="filterOptions"
      rules={{
        required: true,
      }}
    />
  );
};