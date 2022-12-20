import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { Peer } from '../../../api';
import { Table } from '../../base';

interface PeerTableProps {
  readonly peers: Peer[];
}

export const PeerTable: React.FC<PeerTableProps> = ({ peers }) => {
  const columns = useMemo<ColumnDef<Peer>[]>(
    () => [
      {
        header: 'Node Id',
        accessorKey: 'id',
        enableSorting: false,
      },
      {
        header: 'Address',
        accessorKey: 'address',
        enableSorting: false,
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

  return <Table<Peer> header={header} columns={columns} data={peers} />;
};
