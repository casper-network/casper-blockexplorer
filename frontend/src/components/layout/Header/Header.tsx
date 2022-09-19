import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';

import { Navbar } from '../Navbar/Navbar';
import logo from '../../../assets/images/logo.png';

type FormValues = {
  hash: string;
  filterOptions: string;
  path: string;
  blockHeight: string | number;
};

const resolver: Resolver<FormValues> = async values => {
  const isHexadecimal = /^[A-F0-9]+$/i.test(values.hash);
  const isPublicKey = /^0(1[0-9a-fA-F]{64}|2[0-9a-fA-F]{66})$/.test(
    values.hash,
  );
  const isBlockHeight = values.hash.split(',').join('');
  const onlyNumbers = /^[0-9]+$/.test(isBlockHeight);

  let currentErrorMessage;

  const errorMessage = {
    account: 'Please enter a valid public key.',
    deploy: 'Please enter a valid deploy hash.',
    block: 'Please enter a valid block hash.',
    blockHeight: 'Please enter a valid block height',
  };

  const path = {
    account: `/account/${values.hash}`,
    deploy: `/deploy/${values.hash}`,
    block: `/block/${values.hash}`,
    blockHeight: `/block/${isBlockHeight}?type=height`,
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
      if (isBlockHeight && onlyNumbers) {
        values.path = path.blockHeight;
      } else currentErrorMessage = errorMessage.blockHeight;
      break;
    default:
      throw new Error('Please enter a valid hash or block height');
  }

  return {
    values: values.filterOptions ? values : {},
    errors: !values.path
      ? {
          hash: {
            type: 'required',
            message: `${currentErrorMessage}`,
          },
        }
      : {},
  };
};

export const Header: React.FC = () => {
  const navigate = useNavigate();
  // TODO: remove this when used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // TODO: Move this magic strings to some constant variables

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });
  const onSubmit: SubmitHandler<FormValues> = data => navigate(data.path);

  return (
    <header className="w-full bg-casper-blue flex justify-center">
      <div className="relative w-full max-w-1600 pl-22 md:pl-30 xl:pl-46 pr-28 md:pr-36 xl:pr-52">
        <div className="flex flex-row justify-center pt-20 pb-30">
          <Link
            className="no-underline hover:no-underline focus:no-underline flex flex-row items-center"
            to="/">
            <div className="flex flex-row items-center">
              <img className="h-40 xxs:h-50" src={logo} alt="Casper Logo" />
              <p className="text-white text-18 xs:text-20 sm:text-24 md:text-26 pl-10 lg:pl-12 font-bold w-20ch">
                Casper BlockExplorer
              </p>
            </div>
          </Link>
          <Navbar />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="default-search" className="sr-only">
            Search
          </label>
          <div className="bg-casper-blue flex relative justify-center pb-50 pt-4">
            <select
              {...register('filterOptions')}
              className="relative left-10 w-90 h-32 sm:h-36 md:h-42 md:w-114 text-center rounded-r-none bg-casper-red rounded-lg border-none text-white focus:outline-none text-12 xs:text-13 sm:text-14 md:text-16 xxs:w-105">
              <option value="account">Account</option>
              <option value="deploy">Deploy Hash</option>
              <option value="block">Block Hash</option>
              <option value="blockHeight">Block Height</option>
            </select>
            <input
              {...register('hash', { required: true })}
              type="search"
              id="search"
              className="block p-4 sm:p-6 md:p-10 pl-20 sm:pl-20 md:pl-20 text-xs text-gray-900 bg-gray-50 rounded-lg border-1 border-solid border-gray-400 focus:outline-none w-full max-w-280 xxs:max-w-400 xxs:text-sm xxs:pr-32"
            />
            <button
              type="submit"
              className="bg-casper-red relative right-20 px-16 hover:bg-red-400 focus:outline-none font-medium rounded-r-lg border-none">
              <svg
                aria-hidden="true"
                className="w-24 h-24 text-white pt-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          {errors.hash && (
            <div className="flex flex-row justify-center relative bottom-25">
              <svg className="fill-casper-blue w-20 h-20 stroke-casper-red stroke-2 mr-2 pb">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <p className="text-casper-red">{errors.hash.message}</p>
            </div>
          )}
        </form>
      </div>
    </header>
  );
};
