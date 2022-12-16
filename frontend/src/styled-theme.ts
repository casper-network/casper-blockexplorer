/**
 * This is not an actual styled-componentss theme
 * Emotion recommends that you only use an actual theme if you support multiple
 * https://emotion.sh/docs/best-practices#dont-use-a-theme-unless-your-app-supports-multiple-themes-or-will-eventually-support-multiple-themes
 */

export const colors = {
  black: '#000',
  white: '#FFF',
  offWhite: '#F7F7F7',
  grey: '#828282',
  lightGrey: 'rgb(245, 245, 247)',
  casperBlue: '#03105B',
  casperRed: '#da2f54',
  lightRed: 'rgba(255, 0, 19, 0.125)',
  darkRed: '#BF000E',
  green: '#09A129',
  greyBlue: '#64748b',
  cobaltBlue: '#0325D1',
  darkBlue: '#02115f',
};

export const breakpoints = {
  xxs: '420px',
  xs: '480px',
  sm: '640px',
  md: '768px',
  xmd: '992px',
  lg: '1024px',
  xl: '1200px',
  xxl: '1440px',
  xxxl: '1600px',
};

export const fonts = {
  inter: 'Inter, sans-serif',
  jetBrains: 'JetBrains Mono, monospace',
};

export const fontWeight = {
  thin: 100,
  light: 300,
  normal: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};

export const pxToRem = (px: number, base: number = 16) => {
  return `${px / base}rem`;
};
