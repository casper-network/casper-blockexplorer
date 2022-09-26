import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import { useAppSelector, getBounds } from '../../../store';

import logo from '../../../assets/images/logo.png';
import { ReactComponent as OpenMenuIcon } from '../../../assets/icons/open-menu-icon.svg';
import { ReactComponent as CloseMenuIcon } from '../../../assets/icons/close-menu-icon.svg';
import { ReactComponent as ButtonIcon } from '../../../assets/icons/button-icon.svg';

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
  const formattedBlockHeight = values.hash.split(',').join('').trim();
  const onlyNumbers = /^[0-9]+$/.test(formattedBlockHeight);

  let currentErrorMessage;

  const errorMessage = {
    account: 'Please enter a valid public key.',
    deploy: 'Please enter a valid deploy hash.',
    block: 'Please enter a valid block hash.',
    blockHeight: 'Please enter a valid block height',
  };

  const defaultErrorMessage = 'Please enter a valid hash or block height';

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

const navItems = [
  {
    title: 'Blocks',
    path: '/',
    key: 'blocks',
  },
  {
    title: 'Peers',
    path: '/peers',
    key: 'peers',
  },
];

export const DemoHeader: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver,
    defaultValues: { hash: '' },
    mode: 'onChange',
  });
  const submitPath: SubmitHandler<FormValues> = data => navigate(data.path);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ hash: '' });
    }
  }, [isSubmitSuccessful, reset]);

  const [isOpened, setIsOpened] = useState(false);
  const bounds = useAppSelector(getBounds);

  const windowWidth = bounds?.width || 0;
  const MOBILE_BREAKPOINT = 1023;

  useEffect(() => {
    const escKeyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (isOpened) {
          setIsOpened(false);
        }
      }
    };

    document.addEventListener('keydown', escKeyHandler);

    return () => {
      document.removeEventListener('keydown', escKeyHandler);
    };
  }, [isOpened]);

  const form = (
    <div className={`${isOpened ? 'block' : 'hidden'} lg:block`}>
      <form onSubmit={handleSubmit(submitPath)}>
        <label htmlFor="default-search" className="sr-only">
          Search
        </label>
        <div
          className={`${
            isOpened ? 'pt-0' : ''
          } bg-casper-blue pl-10 flex relative justify-center pt-10 lg:pt-31`}>
          <select
            {...register('filterOptions')}
            className="relative left-14 w-100 h-32 sm:h-36 xxs:w-109 md:w-135 md:mt-7 md:h-35 text-center rounded-r-none bg-casper-red rounded-lg border-none text-white focus:outline-none text-12 xs:text-13 sm:text-14 md:text-16 appearance-none pr-20">
            <option value="account">Account</option>
            <option value="deploy">Deploy Hash</option>
            <option value="block">Block Hash</option>
            <option value="blockHeight">Block Height</option>
          </select>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="w-20 h-20 absolute -left-10 top-6 sm:top-8 md:top-15">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              />
            </svg>
          </div>
          <input
            {...register('hash', { required: true })}
            type="search"
            id="search"
            className="block py-4 sm:py-6 md:py-5 px-20 sm:pl-20 md:px-20 md:mt-7 text-xs text-gray-900 bg-gray-50 border-1 border-solid border-gray-400 focus:outline-none w-full max-w-280 xl:w-500 xxs:text-sm xxs:pr-32"
            required
          />
          <button
            type="submit"
            className="bg-casper-red relative right-20 px-16 md:mt-7 hover:bg-red-400 focus:outline-none font-medium rounded-r-lg border-none cursor-pointer">
            <ButtonIcon />
          </button>
        </div>
        {errors.hash && (
          <div className="flex flex-row justify-center relative -bottom-4 xxs:-bottom-4 sm:-bottom-2 md:-bottom-1 lg:pb-17">
            <div className="fill-casper-blue w-20 h-30 stroke-casper-red stroke-2 pt-10">
              <svg>
                <path
                  viewBox="0 0 30 16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <p className="text-casper-red pl-6 pt-10">{errors.hash.message}</p>
          </div>
        )}
      </form>
    </div>
  );

  return (
    <header className="w-full bg-casper-blue">
      <div className="flex flex-row justify-between relative w-full max-w-1600 pl-15 xxs:pl-22 md:pl-30 xl:pl-46 pr-28 md:pr-36 xl:pr-52">
        <div className="pt-30 pb-35">
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
        </div>
        {windowWidth > MOBILE_BREAKPOINT ? form : null}
        <nav className="z-10 py-10 lg:py-40 bg-casper-blue lg:w-200">
          <div className="flex flex-col lg:flex-row lg:justify-between">
            <div className="z-30 flex flex-row justify-end lg:justify-between">
              <button
                type="button"
                className="lg:hidden bg-transparent border-none h-40 mt-20 xxs:mt-24"
                onClick={() => setIsOpened(!isOpened)}>
                {isOpened ? <OpenMenuIcon /> : <CloseMenuIcon />}
              </button>
            </div>
            <div className="bg-casper-blue border-none lg:flex lg:space-x-12 lg:flex-row lg:w-auto">
              {isOpened && (
                <nav className="pr-20 pl-20 lg:hidden">
                  <ul className="z-10 bg-casper-blue flex flex-col gap-2 absolute w-screen h-200 items-center justify-center left-0 top-0">
                    {navItems.map(({ path, title, key }) => {
                      return (
                        <li key={key}>
                          <Link
                            to={path}
                            className="text-white text-22 p-5 xxs:py-11 w-full font-medium tracking-wide">
                            {title}
                          </Link>
                        </li>
                      );
                    })}
                    {form}
                  </ul>
                </nav>
              )}
              <nav className="hidden lg:block">
                <ul className="flex gap-x-8 pt-2">
                  {navItems.map(({ path, title, key }) => {
                    return (
                      <li key={key}>
                        <Link
                          to={path}
                          className="text-white text-18 py-5 xxs:py-11 lg:py-0 w-full font-medium tracking-wide">
                          {title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
