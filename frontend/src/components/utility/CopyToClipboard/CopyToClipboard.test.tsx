import React from 'react';
import { screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '../../../test-utils';
import { CopyToClipboard } from './CopyToClipboard';

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

describe('CopyToClipboard', () => {
  jest.spyOn(navigator.clipboard, 'writeText');

  it('should render the copy icon on first load', () => {
    render(<CopyToClipboard textToCopy="copy this" />);

    const copyIcon = screen.getByTestId('copy-icon');

    expect(copyIcon).toBeInTheDocument();
  });

  it('should render copied icon after copy icon click', async () => {
    render(<CopyToClipboard textToCopy="copy this" />);

    const copyIcon = screen.getByTestId('copy-icon');

    fireEvent.click(copyIcon);

    const copiedIcon = await screen.findByTestId('copied-icon');

    expect(copiedIcon).toBeInTheDocument();
  });

  it('should render copy icon after copy icon click and waiting for the timeout to run', async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    render(<CopyToClipboard textToCopy="copy this" />);

    const copyIcon = screen.getByTestId('copy-icon');

    fireEvent.click(copyIcon);

    // need to wrap in act as our state is updated within out fake setTimeout
    act(() => {
      jest.runAllTimers();
    });

    const copyIconAfterClick = await screen.findByTestId('copy-icon');

    expect(copyIconAfterClick).toBeInTheDocument();
  });
});
