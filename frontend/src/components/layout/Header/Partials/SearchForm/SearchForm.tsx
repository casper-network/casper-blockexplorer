import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { SubmitHandler, useForm, Resolver } from 'react-hook-form';

import {
  FormContainer,
  Form,
  FormComponentsContainer,
  InputAndButtonContainer,
  SearchInput,
  SubmitButton,
  ErrorMessageContainer,
  ErrorSvgContainer,
  ErrorMessage,
} from './SearchForm.styled';

import { ButtonIcon } from '../../../../icons';

import { SearchSelect } from '../SearchSelect/SearchSelect';
import { FormValues } from '../partials.types';

interface SearchFormProps {}

const resolver: Resolver<FormValues> = async values => {
  const isHexadecimal = /^[A-F0-9]+$/i.test(values.hash);
  const isPublicKey = /^0(1[0-9a-fA-F]{64}|2[0-9a-fA-F]{66})$/.test(
    values.hash,
  );
  const formattedBlockHeight = values.hash.split(',').join('').trim();
  const onlyNumbers = /^[0-9]+$/.test(formattedBlockHeight);

  let currentErrorMessage;

  const errorMessage = {
    account: 'Please enter a valid public key.',
    deploy: 'Please enter a valid deploy hash.',
    block: 'Please enter a valid block hash.',
    blockHeight: 'Please enter a valid block height',
  };

  const defaultErrorMessage = 'Please select an option and enter a value';

  const path = {
    account: `/account/${values.hash}`,
    deploy: `/deploy/${values.hash}`,
    block: `/block/${values.hash}`,
    blockHeight: `/block/${formattedBlockHeight}?type=height`,
  };

  switch (values.filterOptions) {
    case 'account':
      if (isPublicKey) {
        values.path = path.account;
      } else currentErrorMessage = errorMessage.account;
      break;
    case 'deploy':
      if (isHexadecimal) {
        values.path = path.deploy;
      } else currentErrorMessage = errorMessage.deploy;
      break;
    case 'block':
      if (isHexadecimal) {
        values.path = path.block;
      } else currentErrorMessage = errorMessage.block;
      break;
    case 'blockHeight':
      if (formattedBlockHeight && onlyNumbers) {
        values.path = path.blockHeight;
      } else currentErrorMessage = errorMessage.blockHeight;
      break;
    default:
      currentErrorMessage = defaultErrorMessage;
  }

  return {
    values: values.filterOptions ? values : {},
    errors: !values.path
      ? {
          hash: {
            type: 'required',
            message: `${currentErrorMessage || defaultErrorMessage}`,
          },
        }
      : {},
  };
};

export const SearchForm: React.FC<SearchFormProps> = () => {
  const navigate = useNavigate();
  const [currentFilterOption, setCurrentFilterOption] = useState('account');

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver,
    defaultValues: { hash: '', filterOptions: 'account' },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ hash: '', filterOptions: currentFilterOption });
    }
  }, [isSubmitSuccessful, reset, currentFilterOption]);

  const submitPath: SubmitHandler<FormValues> = data => navigate(data.path);

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(submitPath)}>
        <label htmlFor="default-search" className="sr-only">
          Search
        </label>
        <FormComponentsContainer>
          <SearchSelect
            control={control}
            currentFilterOption={currentFilterOption}
            setCurrentFilterOption={setCurrentFilterOption}
          />
          <InputAndButtonContainer>
            <SearchInput
              {...register('hash', { required: true })}
              type="search"
              id="search"
              placeholder="Select search criteria"
              required
            />
            <SubmitButton type="submit">
              <ButtonIcon />
            </SubmitButton>
          </InputAndButtonContainer>
        </FormComponentsContainer>
        {errors.hash && (
          <ErrorMessageContainer>
            <ErrorSvgContainer>
              <svg>
                <path
                  viewBox="0 0 30 16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </ErrorSvgContainer>
            <ErrorMessage>{errors.hash.message}</ErrorMessage>
          </ErrorMessageContainer>
        )}
      </Form>
    </FormContainer>
  );
};