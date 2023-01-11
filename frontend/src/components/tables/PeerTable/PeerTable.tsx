import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ColumnDef } from '@tanstack/react-table';
import { colors, fontWeight } from 'src/styled-theme';
import { Peer } from '../../../api';
import { Table } from '../../base';

interface PeerTableProps {
  readonly peers: Peer[];
}

export const PeerTable: React.FC<PeerTableProps> = ({ peers }) => {
  const { t } = useTranslation();
  const columns = useMemo<ColumnDef<Peer>[]>(
    () => [
      {
        header: `${t('node-id')}`,
        accessorKey: 'id',
        enableSorting: false,
      },
      {
        header: `${t('address')}`,
        accessorKey: 'address',
        enableSorting: false,
      },
    ],
    [t],
  );

  const header = (
    <PeerTableHead>
      <HeadLabel>{t('currently-online')}</HeadLabel>
      <HeadValue>
        {peers.length} {t('total-rows')}
      </HeadValue>
    </PeerTableHead>
  );

  return <Table<Peer> header={header} columns={columns} data={peers} />;
};

const PeerTableHead = styled.div`
  display: flex;
`;

const HeadLabel = styled.p`
  color: black;
  font-weight: ${fontWeight.bold};
  padding-right: 2rem;
`;

const HeadValue = styled.p`
  color: ${colors.grey};
`;
