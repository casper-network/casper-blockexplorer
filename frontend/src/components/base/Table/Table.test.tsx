import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils';
import { Table } from './Table';

const headContent = <div>This is the head content</div>;
const tableHeads = [
  { title: 'Title 1', key: 1 },
  { title: 'Title 2', key: 2 },
  { title: 'Title 3', key: 3 },
  { title: 'Title 4', key: 4 },
  { title: 'Title 5', key: 5 },
];
const tableRows = [
  {
    items: [
      { content: 'Row 1 Col 1 Content', key: 1 },
      { content: 'Row 1 Col 2 Content', key: 2 },
      { content: 'Row 1 Col 3 Content', key: 3 },
      { content: 'Row 1 Col 4 Content', key: 4 },
      { content: 'Row 1 Col 5 Content', key: 5 },
    ],
    key: 1,
  },
  {
    items: [
      { content: 'Row 2 Col 1 Content', key: 1 },
      { content: 'Row 2 Col 2 Content', key: 2 },
      { content: 'Row 2 Col 3 Content', key: 3 },
      { content: 'Row 2 Col 4 Content', key: 4 },
      { content: 'Row 2 Col 5 Content', key: 5 },
    ],
    key: 2,
  },
  {
    items: [
      { content: 'Row 3 Col 1 Content', key: 1 },
      { content: 'Row 3 Col 2 Content', key: 2 },
      { content: 'Row 3 Col 3 Content', key: 3 },
      { content: 'Row 3 Col 4 Content', key: 4 },
      { content: 'Row 3 Col 5 Content', key: 5 },
    ],
    key: 3,
  },
  {
    items: [
      { content: 'Row 4 Col 1 Content', key: 1 },
      { content: 'Row 4 Col 2 Content', key: 2 },
      { content: 'Row 4 Col 3 Content', key: 3 },
      { content: 'Row 4 Col 4 Content', key: 4 },
      { content: 'Row 4 Col 5 Content', key: 5 },
    ],
    key: 4,
  },
  {
    items: [
      { content: 'Row 5 Col 1 Content', key: 1 },
      { content: 'Row 5 Col 2 Content', key: 2 },
      { content: 'Row 5 Col 3 Content', key: 3 },
      { content: 'Row 5 Col 4 Content', key: 4 },
      { content: 'Row 5 Col 5 Content', key: 5 },
    ],
    key: 5,
  },
];
const footContent = <div>This is the foot content</div>;

describe('Table', () => {
  it('should render 5 table heads when given 5 head columns', () => {
    render(
      <Table
        headContent={headContent}
        headColumns={tableHeads}
        rows={tableRows}
        footContent={footContent}
      />,
    );

    const fifthTableHead = screen.getByTestId('head-5');

    expect(fifthTableHead).toBeInTheDocument();
  });

  it('should render 5 rows when given 5 rows', () => {
    render(
      <Table
        headContent={headContent}
        headColumns={tableHeads}
        rows={tableRows}
        footContent={footContent}
      />,
    );

    const fifthRow = screen.getByTestId('row-5');

    expect(fifthRow).toBeInTheDocument();
  });

  it('should render row column content', () => {
    render(
      <Table
        headContent={headContent}
        headColumns={tableHeads}
        rows={tableRows}
        footContent={footContent}
      />,
    );

    const thirdRowThirdColumnContent = screen.getByText('Row 3 Col 3 Content');

    expect(thirdRowThirdColumnContent).toBeInTheDocument();
  });

  it('should render foot content when given foot content', () => {
    render(
      <Table
        headContent={headContent}
        headColumns={tableHeads}
        rows={tableRows}
        footContent={footContent}
      />,
    );

    const footContentByText = screen.getByText('This is the foot content');

    expect(footContentByText).toBeInTheDocument();
  });

  it('should render head content', () => {
    render(
      <Table
        headContent={headContent}
        headColumns={tableHeads}
        rows={tableRows}
        footContent={footContent}
      />,
    );

    const headContentByText = screen.getByText('This is the head content');

    expect(headContentByText).toBeInTheDocument();
  });
});
