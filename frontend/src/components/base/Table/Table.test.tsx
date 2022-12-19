import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils';
import { Table } from './Table';

const header = <div>This is the head content</div>;
const columns = [
  {
    Header: 'Name',
    columns: [
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
    ],
  },
  {
    Header: 'Info',
    columns: [
      {
        Header: 'Age',
        accessor: 'age',
      },
      {
        Header: 'Visits',
        accessor: 'visits',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Profile Progress',
        accessor: 'progress',
      },
    ],
  },
];
const tableRows = [
  {
    firstName: 'republic',
    lastName: 'furniture',
    age: 24,
    visits: 53,
    progress: 92,
    status: 'single',
  },
  {
    firstName: 'chance',
    lastName: 'fly',
    age: 13,
    visits: 86,
    progress: 76,
    status: 'complicated',
  },
  {
    firstName: 'purpose',
    lastName: 'religion',
    age: 6,
    visits: 15,
    progress: 26,
    status: 'complicated',
  },
  {
    firstName: 'oven',
    lastName: 'library',
    age: 21,
    visits: 86,
    progress: 82,
    status: 'relationship',
  },
  {
    firstName: 'expansion',
    lastName: 'dog',
    age: 18,
    visits: 69,
    progress: 37,
    status: 'relationship',
  },
];
const footer = <div>This is the foot content</div>;

describe('Table', () => {
  it('should render 5 table heads when given 5 head columns', () => {
    render(
      <Table
        header={header}
        columns={columns}
        data={tableRows}
        footer={footer}
      />,
    );

    const fifthTableHead = screen.getByTestId('head-5');

    expect(fifthTableHead).toBeInTheDocument();
  });

  it('should render 5 rows when given 5 rows', () => {
    render(
      <Table
        header={header}
        columns={columns}
        data={tableRows}
        footer={footer}
      />,
    );

    const fifthRow = screen.getByTestId('row-5');

    expect(fifthRow).toBeInTheDocument();
  });

  it('should render row column content', () => {
    render(
      <Table
        header={header}
        columns={columns}
        data={tableRows}
        footer={footer}
      />,
    );

    const thirdRowThirdColumnContent = screen.getByText('Row 3 Col 3 Content');

    expect(thirdRowThirdColumnContent).toBeInTheDocument();
  });

  it('should render foot content when given foot content', () => {
    render(
      <Table
        header={header}
        columns={columns}
        data={tableRows}
        footer={footer}
      />,
    );

    const footerByText = screen.getByText('This is the foot content');

    expect(footerByText).toBeInTheDocument();
  });

  it('should render head content', () => {
    render(
      <Table
        header={header}
        columns={columns}
        data={tableRows}
        footer={footer}
      />,
    );

    const headerByText = screen.getByText('This is the head content');

    expect(headerByText).toBeInTheDocument();
  });
});
