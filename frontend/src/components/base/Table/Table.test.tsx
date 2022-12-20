import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils';
import { Table } from './Table';
import { ColumnDef } from '@tanstack/react-table';

const header = <div>This is the head content</div>;

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: 'relationship' | 'complicated' | 'single';
  subRows?: Person[];
};

const columns: ColumnDef<Person>[] = [
  {
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.lastName,
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      },
    ],
  },
  {
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: props => props.column.id,
      },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          },
          {
            accessorKey: 'status',
            header: 'Status',
            footer: props => props.column.id,
          },
          {
            accessorKey: 'progress',
            header: 'Profile Progress',
            footer: props => props.column.id,
          },
        ],
      },
    ],
  },
];

const tableRows: Person[] = [
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
      <Table<Person>
        header={header}
        columns={columns}
        data={tableRows}
        footer={footer}
      />,
    );

    const fifthTableHead = screen.getByText('Profile Progress');

    expect(fifthTableHead).toBeInTheDocument();
  });

  it('should render 5 rows when given 5 rows', () => {
    render(
      <Table<Person>
        header={header}
        columns={columns}
        data={tableRows}
        footer={footer}
      />,
    );

    const fifthRow = screen.getByText('expansion');

    expect(fifthRow).toBeInTheDocument();
  });

  it('should render row column content', () => {
    render(
      <Table<Person>
        header={header}
        columns={columns}
        data={tableRows}
        footer={footer}
      />,
    );

    const thirdRowSecondColumnContent = screen.getByText('religion');

    expect(thirdRowSecondColumnContent).toBeInTheDocument();
  });

  it('should render foot content when given foot content', () => {
    render(
      <Table<Person>
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
      <Table<Person>
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
