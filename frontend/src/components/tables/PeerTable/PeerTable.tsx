import React, { useMemo } from 'react';
import { Peer } from '../../../api';
import { Table } from '../../base';

interface PeerTableProps {
  readonly peers: Peer[];
}

export const PeerTable: React.FC<PeerTableProps> = ({ peers }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Node Id',
        accessor: 'id',
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
    ],
    [],
  );

  const header = useMemo(
    () => (
      <div className="flex pl-32">
        <p className="text-black font-bold pr-32">Currently Online</p>
        <p className="text-grey">{peers.length} total rows</p>
      </div>
    ),
    [peers.length],
  );

  return <Table header={header} columns={columns} data={peers} />;
};
