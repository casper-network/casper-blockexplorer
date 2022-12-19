import React from 'react';
import { Column } from 'react-table';
export interface TableHeadColumn {
  readonly title: React.ReactNode;
  readonly key: React.Key;
}

export interface TableRowItem {
  readonly content: React.ReactNode;
  readonly key: React.Key;
}

export interface TableRow {
  readonly items: TableRowItem[];
  readonly key: React.Key;
}

export interface TableProps {
  readonly header?: React.ReactNode;
  readonly columns: Column[];
  readonly data: any[];
  readonly footer?: React.ReactNode;
}
