/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export interface AppConfig {
  isProduction: boolean;
  webServerUrl: string;
}

/* eslint-disable prefer-destructuring */
const ENV = (window as any).ENV;
Object.keys(ENV).forEach(key => {
  ENV[key] = ENV[key].indexOf('<!--') !== -1 ? null : ENV[key];
});

export const loadConfig: () => AppConfig = () => {
  const { NODE_ENV, REACT_APP_MIDDLEWARE_URL: reactAppMiddlewareUrl } =
    process.env;
  const { MIDDLEWARE_URL: middlewareUrl } = ENV;

  const isProduction = NODE_ENV === 'production';

  const webServerUrl = isProduction ? middlewareUrl : reactAppMiddlewareUrl;

  if (!webServerUrl) {
    throw new Error('Invalid Config: Missing MIDDLEWARE_URL');
  }

  return {
    isProduction,
    webServerUrl,
  };
};
