import React from 'react';
import {
  Table as UiTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '../../ui/table.js';

export interface TableColumn<T = any> {
  key: string;
  label: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  numeric?: boolean;
  width?: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface TableProps<T = Record<string, any>> {
  caption?: React.ReactNode;
  columns?: TableColumn<T>[];
  data?: T[];
  highlightRows?: number[];
  className?: string;
  children?: React.ReactNode;
}

export const Table = <T extends Record<string, any>>({
  caption,
  columns,
  data,
  highlightRows = [],
  className = '',
  children,
}: TableProps<T>): React.ReactElement => {
  // If children are provided directly (e.g. pure standard markdown table or JSX table)
  if (children) {
    return (
      <div className={className || undefined}>
        <UiTable>
          {caption && <TableCaption>{caption}</TableCaption>}
          {children}
        </UiTable>
      </div>
    );
  }

  return (
    <div className={className || undefined}>
      <UiTable>
        {caption && <TableCaption>{caption}</TableCaption>}
        {columns && (
          <TableHeader>
            <TableRow>
              {columns.map((col) => {
                const isNum = col.numeric || col.align === 'right';
                return (
                  <TableHead
                    key={col.key}
                    className={isNum ? 'num' : undefined}
                    style={{
                      textAlign: col.align || (col.numeric ? 'right' : 'left'),
                      width: col.width,
                    }}
                  >
                    {col.label}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
        )}
        {data && (
          <TableBody>
            {data.map((row, rowIdx) => {
              const isHl = highlightRows.includes(rowIdx);
              return (
                <TableRow key={rowIdx} className={isHl ? 'hl' : undefined}>
                  {columns?.map((col) => {
                    const isNum = col.numeric || col.align === 'right';
                    const rawVal = row[col.key];
                    const content = col.render ? col.render(rawVal, row, rowIdx) : rawVal;
                    return (
                      <TableCell
                        key={col.key}
                        className={isNum ? 'num' : undefined}
                        style={{ textAlign: col.align || (col.numeric ? 'right' : 'left') }}
                      >
                        {content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </UiTable>
    </div>
  );
};
