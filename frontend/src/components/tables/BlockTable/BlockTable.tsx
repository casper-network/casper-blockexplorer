import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import {
  fetchMoreBlocks,
  getEarliestLoadedBlock,
  getLatestBlockHeight,
  getLoadingMoreBlocksStatus,
  Loading,
  useAppDispatch,
  useAppSelector,
} from '../../../store';
import { Block } from '../../../api';
import { formatTimeAgo, standardizeNumber, truncateHash } from '../../../utils';
import { CopyToClipboard, Loader, RefreshTimer } from '../../utility';

import { Table } from '../../base';
import { ColumnDef } from '@tanstack/react-table';

interface BlockTableProps {
  readonly blocks: Block[];
  readonly showValidators?: boolean;
}

export const BlockTable: React.FC<BlockTableProps> = ({
  blocks,
  showValidators,
}) => {
  const dispatch = useAppDispatch();

  const latestBlockHeight = useAppSelector(getLatestBlockHeight);
  const earliestLoadedBlockHeight = useAppSelector(getEarliestLoadedBlock);
  const loadingMoreBlocksStatus = useAppSelector(getLoadingMoreBlocksStatus);

  const isLoadingMoreBlocks = loadingMoreBlocksStatus === Loading.Pending;

  const header = useMemo(
    () => (
      <div className="flex justify-between text-grey px-32">
        <p>{standardizeNumber(latestBlockHeight || 0)} total rows</p>
        <RefreshTimer />
      </div>
    ),
    [latestBlockHeight],
  );

  const footer = useMemo(
    () => (
      <div className="flex justify-around px-32 py-20">
        <button
          type="button"
          disabled={isLoadingMoreBlocks}
          onClick={() => {
            if (earliestLoadedBlockHeight) {
              dispatch(fetchMoreBlocks(earliestLoadedBlockHeight));
            }
          }}
          className="bg-light-grey hover:bg-light-red text-dark-red min-w-150 py-8 text-14 w-fit rounded-md border-none font-medium">
          {isLoadingMoreBlocks ? <Loader size="sm" /> : 'Show more'}
        </button>
      </div>
    ),
    [dispatch, earliestLoadedBlockHeight, isLoadingMoreBlocks],
  );

  const columns = useMemo<ColumnDef<Block>[]>(
    () => [
      {
        header: 'Block Height',
        accessorKey: 'height',
        cell: ({ getValue }) => <>{standardizeNumber(getValue<number>())}</>,
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
        cell: ({ getValue }) => (
          <>{formatTimeAgo(new Date(getValue<number>()))}</>
        ),
      },
      {
        header: 'Block Hash',
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
      },
      {
        header: 'Validator',
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
      },
    ],
    [showValidators],
  );

  return (
    <Table<Block>
      header={header}
      columns={columns}
      data={blocks}
      footer={footer}
    />
  );
};
