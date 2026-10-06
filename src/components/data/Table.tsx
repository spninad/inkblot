import React from 'react';

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
      <div className={`tablewrap ${className}`.trim()}>
        <table>
          {caption && <caption>{caption}</caption>}
          {children}
        </table>
      </div>
    );
  }

  return (
    <div className={`tablewrap ${className}`.trim()}>
      <table>
        {caption && <caption>{caption}</caption>}
        {columns && (
          <thead>
            <tr>
              {columns.map((col) => {
                const isNum = col.numeric || col.align === 'right';
                return (
                  <th
                    key={col.key}
                    className={isNum ? 'num' : undefined}
                    style={{
                      textAlign: col.align || (col.numeric ? 'right' : 'left'),
                      width: col.width,
                    }}
                  >
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
        )}
        {data && (
          <tbody>
            {data.map((row, rowIdx) => {
              const isHl = highlightRows.includes(rowIdx);
              return (
                <tr key={rowIdx} className={isHl ? 'hl' : undefined}>
                  {columns?.map((col) => {
                    const isNum = col.numeric || col.align === 'right';
                    const rawVal = row[col.key];
                    const content = col.render ? col.render(rawVal, row, rowIdx) : rawVal;
                    return (
                      <td
                        key={col.key}
                        className={isNum ? 'num' : undefined}
                        style={{ textAlign: col.align || (col.numeric ? 'right' : 'left') }}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
};
