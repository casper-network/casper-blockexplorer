import { AppConfig } from '../utils';

export const mockLoadConfig: () => AppConfig = () => {
  const isProduction = false;
  const middlewareUrl = 'https://example.com:4000/rpc';
  const orgName = 'Casper';
  const orgLogoUrl = undefined;

  return {
    isProduction,
    middlewareUrl,
    orgName,
    orgLogoUrl,
  };
};