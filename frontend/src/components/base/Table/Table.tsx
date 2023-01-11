import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  SortingState,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';
import styled from '@emotion/styled';
import { colors, fontWeight, pxToRem } from 'src/styled-theme';
import { css } from '@emotion/react';

export interface TableProps<T> {
  readonly header?: React.ReactNode;
  readonly columns: ColumnDef<T>[];
  readonly data: T[];
  readonly footer?: React.ReactNode;
  onSortingChange?: OnChangeFn<SortingState>;
  sorting?: SortingState;
}

export function Table<T extends unknown>({
  columns,
  data,
  header,
  footer,
  onSortingChange,
  sorting,
}: TableProps<T>) {
  const options: TableOptions<T> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  };
  if (onSortingChange) options.onSortingChange = onSortingChange;
  if (sorting) options.state = { sorting };

  const { getHeaderGroups, getRowModel } = useReactTable(options);

  return (
    <TableWrapper>
      <Header>{header}</Header>
      <StyledTable>
        <TableHead>
          {getHeaderGroups().map(headerGroup => (
            <TableHeader key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ width: header.getSize() }}
                  sortable={header.column.getCanSort()}
                  {...{
                    onClick: header.column.getToggleSortingHandler(),
                  }}>
                  {header.isPlaceholder ? null : (
                    <>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      <span>
                        {{
                          asc: '🔼',
                          desc: '🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </>
                  )}
                </Th>
              ))}
            </TableHeader>
          ))}
        </TableHead>
        <tbody>
          {getRowModel().rows.map(row => (
            <TableBodyRow key={row.id}>
              {row.getVisibleCells().map(cell => {
                return (
                  <TableBodyItem
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableBodyItem>
                );
              })}
            </TableBodyRow>
          ))}
        </tbody>
      </StyledTable>
      {footer}
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  width: 100%;
  margin-bottom: 8rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  max-width: calc(100vw - 5rem);
  background-color: white;
  box-shadow: 0px 2px 7px rgba(127, 128, 149, 0.2);
`;

const Header = styled.div`
  padding: 1rem 2rem;
  width: 100%;
`;

const StyledTable = styled.table`
  table-layout: auto;
  width: 100%;
  border-spacing: 0px 0px;
  min-width: ${pxToRem(800)};
  background-color: white;
`;

const TableHead = styled.thead`
  background-color: ${colors.lightGrey};
`;

const TableHeader = styled.tr`
  height: 4rem;
`;

const Th = styled.th<{ sortable?: boolean }>`
  text-align: start;
  font-weight: ${fontWeight.bold};
  padding: 0 2rem;
  ${({ sortable }) => {
    if (sortable)
      return css`
        position: relative;
        user-select: none;
        cursor: pointer;
        & > span {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      `;
  }}
`;

const TableBodyRow = styled.tr`
  height: ${pxToRem(50)};
  :hover {
    background-color: ${colors.lightGrey};
  }
`;

const TableBodyItem = styled.td`
  text-align: start;
  padding: 0 ${pxToRem(32)};
  border-bottom: ${pxToRem(1)} solid ${colors.lightGrey};
`;
