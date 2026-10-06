import React from 'react';

export interface SummaryTableRow {
  id?: string | number;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  href?: string;
  setting?: React.ReactNode;
  outcome?: React.ReactNode;
  [key: string]: any;
}

export interface SummaryTableProps {
  caption?: React.ReactNode;
  headers?: [string, string, string, string];
  rows: SummaryTableRow[];
}

export const SummaryTable: React.FC<SummaryTableProps> = ({
  caption,
  headers = ['Study', 'Question', 'Setting', 'Outcome'],
  rows,
}) => {
  return (
    <div className="tablewrap">
      <table className="sumtable">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.id != null ? r.id : i + 1}</td>
              <td>
                {r.href ? (
                  <a href={r.href}>{r.title}</a>
                ) : (
                  <span>{r.title}</span>
                )}
                {r.subtitle && (
                  <>
                    <br />
                    <span className="small">{r.subtitle}</span>
                  </>
                )}
              </td>
              <td>{r.setting}</td>
              <td>{r.outcome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
