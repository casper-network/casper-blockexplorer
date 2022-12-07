import React from 'react';
import { useForm } from 'react-hook-form';
import { render, renderHook } from '../../../../../test-utils';
import { SearchSelect } from './SearchSelect';
import { FormValues } from '../partials.types';

jest.mock('../../../../../hooks', () => {
  return {
    useAppWidth: () => {
      return { windowWidth: 1024, isMobile: false };
    },
  };
});

describe('SearchSelect', () => {
  it('should render without error', () => {
    const { result } = renderHook(useForm<FormValues>);
    const mockCurrentFilterOption = 'current-option';
    const { getByTestId } = render(
      <SearchSelect
        control={result.current.control}
        currentFilterOption={mockCurrentFilterOption}
        setCurrentFilterOption={jest.fn()}
      />,
    );

    const searchSelectWrapper = getByTestId('search-select');

    expect(searchSelectWrapper).toBeInTheDocument();
  });

  it('should not display react-select component if screen width is less than 1023px', () => {
    const { result } = renderHook(useForm<FormValues>);

    const mockCurrentFilterOption = 'current option';
    const { getByLabelText } = render(
      <SearchSelect
        control={result.current.control}
        currentFilterOption={mockCurrentFilterOption}
        setCurrentFilterOption={jest.fn()}
      />,
    );

    const selectButton = getByLabelText('select-button');

    expect(selectButton).toBeInTheDocument();
  });
});
