import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ColumnDef, OnChangeFn, SortingState } from '@tanstack/react-table';

import { colors, fontWeight, pxToRem } from 'src/styled-theme';
import styled from '@emotion/styled';
import { Block } from '../../../api';
import {
  formatDate,
  formatTimeAgo,
  standardizeNumber,
  truncateHash,
} from '../../../utils';
import { CopyToClipboard, Loader, RefreshTimer } from '../../utility';

import { Table } from '../../base';

interface BlockTableProps {
  readonly latestBlockHeight?: number;
  readonly blocks: Block[];
  readonly showValidators?: boolean;
  fetchMore: () => void;
  isLoadingMoreBlocks: boolean;
  onSortingChange?: OnChangeFn<SortingState>;
  sorting?: SortingState;
}

export const BlockTable: React.FC<BlockTableProps> = ({
  latestBlockHeight,
  blocks,
  showValidators,
  fetchMore,
  isLoadingMoreBlocks,
  ...props
}) => {
  const { t } = useTranslation();

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const header = useMemo(
    () => (
      <BlockTableHead>
        <p>
          {standardizeNumber(latestBlockHeight ? latestBlockHeight + 1 : 0)}{' '}
          {t('total-rows')}
        </p>
        <RefreshTimer />
      </BlockTableHead>
    ),
    [latestBlockHeight, t],
  );

  const footer = useMemo(
    () => (
      <BlockTableFooter>
        <ShowMoreButton
          type="button"
          disabled={isLoadingMoreBlocks}
          onClick={fetchMore}>
          {isLoadingMoreBlocks ? <Loader size="sm" /> : t('show-more')}
        </ShowMoreButton>
      </BlockTableFooter>
    ),
    [fetchMore, isLoadingMoreBlocks, t],
  );

  const blockTableTitles = [
    'block-height',
    'era',
    'deploy',
    'age',
    'block-hash',
  ];
  if (showValidators) {
    blockTableTitles.push('validator');
  }

  const columns = useMemo<ColumnDef<Block>[]>(
    () => [
      {
        header: `${t('block-height')}`,
        accessorKey: 'height',
        cell: ({ getValue }) => <>{standardizeNumber(getValue<number>())}</>,
      },
      {
        header: `${t('era')}`,
        accessorKey: 'eraID',
        maxSize: 100,
      },
      {
        header: `${t('deploy')}`,
        accessorKey: 'deployCount',
        maxSize: 100,
      },
      {
        header: `${t('age')}`,
        accessorKey: 'timestamp',
        cell: ({ getValue, column }) => (
          <div>
            {column.getIsSorted()
              ? formatDate(new Date(getValue<number>()))
              : formatTimeAgo(new Date(getValue<number>()))}
          </div>
        ),
        minSize: 200,
      },
      {
        header: `${t('block-hash')}`,
        accessorKey: 'hash',
        cell: ({ getValue }) => (
          <div className="flex flex-row items-center">
            <Link
              to={{
                pathname: `/block/${getValue<string>()}`,
              }}>
              {truncateHash(getValue<string>())}
            </Link>
            <CopyToClipboard textToCopy={getValue<string>()} />
          </div>
        ),
        enableSorting: false,
        minSize: 230,
      },
      {
        header: `${t('validator')}`,
        accessorKey: 'validatorPublicKey',
        cell: ({ getValue }) => (
          <div className="flex flex-row items-center">
            <Link
              to={{
                pathname: `/account/${getValue<string>()}`,
              }}>
              {truncateHash(getValue<string>())}
            </Link>
            <CopyToClipboard textToCopy={getValue<string>()} />
          </div>
        ),
        enableSorting: false,
        isVisible: showValidators,
        minSize: 230,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showValidators, t, currentTime],
  );

  return (
    <Table<Block>
      header={header}
      columns={columns}
      data={blocks}
      footer={footer}
      {...props}
    />
  );
};
const BlockTableHead = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${colors.grey};
`;

const BlockTableFooter = styled.div`
  display: flex;
  justify-content: space-around;
  padding: ${pxToRem(20)} 2rem;
`;

const ShowMoreButton = styled.button`
  background-color: ${colors.lightGrey};
  color: ${colors.darkRed};
  min-width: ${pxToRem(150)};
  padding: 0.5rem 0;
  width: fit-content;
  border-radius: 0.375rem;
  border: none;
  font-weight: ${fontWeight.medium};

  :hover {
    background-color: ${colors.lightRed};
  }
`;
