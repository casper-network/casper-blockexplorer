import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils';
import { PageWrapper } from './PageWrapper';

describe('PageWrapper', () => {
  it('should render loader when page is loading', () => {
    render(<PageWrapper isLoading>Content</PageWrapper>);

    const loader = screen.getByTestId('loader');

    expect(loader).toBeInTheDocument();
  });

  it('should render error content when error occurred', () => {
    render(
      <PageWrapper isLoading={false} error={{ message: 'error message' }}>
        Content
      </PageWrapper>,
    );

    const errorContent = screen.getByTestId('error-content');

    expect(errorContent).toBeInTheDocument();
    expect(errorContent.textContent).toContain('error message');
  });

  it('should render children when done loading & no error', () => {
    render(
      <PageWrapper isLoading={false}>
        <p data-testid="children-content">Content</p>
      </PageWrapper>,
    );

    const pageContent = screen.getByTestId('children-content').textContent;

    expect(pageContent).toBe('Content');
  });
});
