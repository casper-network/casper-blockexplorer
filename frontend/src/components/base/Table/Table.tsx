import React from 'react';
import { useTable, useSortBy } from 'react-table';
import { TableProps } from './Table.types';

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  header,
  footer,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <div className="w-full mb-32 shadow-card rounded-lg overflow-x-auto max-w-screen-p-incl bg-white">
      <div className="w-full py-12">{header}</div>
      <table
        className="table-auto w-full border-spacing-0 min-w-800 bg-white"
        {...getTableProps()}>
        <thead className="bg-light-grey">
          {headerGroups.map(headerGroup => (
            <tr className="h-40" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th
                  className="text-start px-32"
                  {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr className="h-50 hover:bg-light-grey" {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td
                      className="text-start px-32 border-0 border-b-1 border-light-grey border-solid"
                      {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {footer}
    </div>
  );
};
