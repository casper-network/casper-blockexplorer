import React from 'react';
import { screen } from '@testing-library/react';

import { Block } from 'src/api';
import { render } from '../../../test-utils';
import { Table } from './Table';

const header = <div>This is the head content</div>;

const footer = <div>This is the foot content</div>;

const rawBlock = '';

const data = [
  {
    hash: '32135f24f7bbd85657b0060b68e3daaae647391c1316fb04fc0610f92421e9b3',
    height: 1345504,
    eraID: 7419,
    deployCount: 0,
    readableTimestamp: 'Dec 22nd 2022, 5:09:40 PM',
    timestamp: 1671696848171,
    timeSince: '1 minute ago',
    transferHashes: [],
    deployHashes: [],
    validatorPublicKey:
      '01e6c56c86ca97d7387d0c989c061ceeb205eeb04adf9ec41569292120ed9ae4a5',
    stateRootHash:
      'd3792aa87c76f6e0c19aaeb1d1e9984c6788e6457c29e6f2e57434aa7770a265',
    parentHash:
      '6c6f097f29c1a0e9a954400234a497d57c8f1c40dcfdeb8611e1385496176e05',
    rawBlock,
  },
  {
    hash: '6c6f097f29c1a0e9a954400234a497d57c8f1c40dcfdeb8611e1385496176e05',
    height: 1345503,
    eraID: 7419,
    deployCount: 0,
    readableTimestamp: 'Dec 22nd 2022, 5:09:07 PM',
    timestamp: 1671696848171,
    timeSince: '2 minutes ago',
    transferHashes: [],
    deployHashes: [],
    validatorPublicKey:
      '0144e35abc4886168a53338539a8a3649ab1257d9f0c235ce38961624a025d40dd',
    stateRootHash:
      'd3792aa87c76f6e0c19aaeb1d1e9984c6788e6457c29e6f2e57434aa7770a265',
    parentHash:
      '777e2ca3178459b3fb6ccfdad74774e90168d3e6031c10a78383152c7a82b81e',
    rawBlock,
  },
  {
    hash: '777e2ca3178459b3fb6ccfdad74774e90168d3e6031c10a78383152c7a82b81e',
    height: 1345502,
    eraID: 7419,
    deployCount: 0,
    readableTimestamp: 'Dec 22nd 2022, 5:08:35 PM',
    timestamp: 1671696848171,
    timeSince: '2 minutes ago',
    transferHashes: [],
    deployHashes: [],
    validatorPublicKey:
      '0144e35abc4886168a53338539a8a3649ab1257d9f0c235ce38961624a025d40dd',
    stateRootHash:
      'd3792aa87c76f6e0c19aaeb1d1e9984c6788e6457c29e6f2e57434aa7770a265',
    parentHash:
      'a280f857e326ea223e73839cebf3718b25197751237e5898ca6efb8f4c9aec3e',
    rawBlock,
  },
  {
    hash: 'a280f857e326ea223e73839cebf3718b25197751237e5898ca6efb8f4c9aec3e',
    height: 1345501,
    eraID: 7419,
    deployCount: 0,
    readableTimestamp: 'Dec 22nd 2022, 5:08:02 PM',
    timestamp: 1671696848171,
    timeSince: '3 minutes ago',
    transferHashes: [],
    deployHashes: [],
    validatorPublicKey:
      '0107cba5b4826a87ddbe0ba8cda8064881b75882f05094c1a5f95e957512a3450e',
    stateRootHash:
      'd3792aa87c76f6e0c19aaeb1d1e9984c6788e6457c29e6f2e57434aa7770a265',
    parentHash:
      '1c4b1a3595ba2bc57d55008ce0160f1f69b712bd1bea8588fb3f4fcf995cde6c',
    rawBlock,
  },
  {
    hash: '1c4b1a3595ba2bc57d55008ce0160f1f69b712bd1bea8588fb3f4fcf995cde6c',
    height: 1345500,
    eraID: 7419,
    deployCount: 0,
    readableTimestamp: 'Dec 22nd 2022, 5:07:29 PM',
    timestamp: 1671696848171,
    timeSince: '3 minutes ago',
    transferHashes: [],
    deployHashes: [],
    validatorPublicKey:
      '0158ed3b452164d0f79e65e05cec9052f6b0acb6c470159bd9ed41037bd20c0100',
    stateRootHash:
      'd3792aa87c76f6e0c19aaeb1d1e9984c6788e6457c29e6f2e57434aa7770a265',
    parentHash:
      '024661c608f33ec79a89107b6af1e16482513051a40ac6edf6d99a33d76dae9c',
    rawBlock,
  },
];

const columns = [
  {
    header: 'Block Height',
    accessorKey: 'height',
  },
  {
    header: 'Era',
    accessorKey: 'eraID',
  },
  {
    header: 'Deploy',
    accessorKey: 'deployCount',
  },
  {
    header: 'Age',
    accessorKey: 'timestamp',
  },
  {
    header: 'Block Hash',
    accessorKey: 'hash',
    minSize: 230,
  },
  {
    header: 'Validator',
    accessorKey: 'validatorPublicKey',
    maxSize: 100,
  },
];

const Template = () => {
  return (
    <Table<Block>
      header={header}
      columns={columns}
      data={data}
      footer={footer}
    />
  );
};

describe('Table', () => {
  it('should render 5 table heads when given 5 head columns', () => {
    render(<Template />);

    const fifthTableHead = screen.getByText('Block Hash');

    expect(fifthTableHead).toBeInTheDocument();
  });

  it('should render 5 rows when given 5 rows', () => {
    render(<Template />);

    const fifthRow = screen.getByText(data[4].hash);

    expect(fifthRow).toBeInTheDocument();
  });

  it('should render row column content', () => {
    render(<Template />);

    const thirdRowSecondColumnContent = screen.getByText(data[2].hash);

    expect(thirdRowSecondColumnContent).toBeInTheDocument();
  });

  it('should render foot content when given foot content', () => {
    render(<Template />);

    const footerByText = screen.getByText('This is the foot content');

    expect(footerByText).toBeInTheDocument();
  });

  it('should render head content', () => {
    render(<Template />);

    const headerByText = screen.getByText('This is the head content');

    expect(headerByText).toBeInTheDocument();
  });
});
