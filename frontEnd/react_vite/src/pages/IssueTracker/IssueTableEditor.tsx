import React, { useEffect, useState } from 'react';
import { DDSButton, DDSLoadingIndicator } from '@dds/react';

export const ISSUE_COLUMNS = [
  'PSR Number',
  'Title',
  'Status',
  'Workflow',
  'PSR Type',
  'Factory',
  'Failure Category',
  'Originator',
  'Analyst',
  'Date Submitted',
  'Date Originated',
  'Analyze Date',
  'Date Assigned',
  'Date Verified',
  'Closed Date',
  'Final Complete Date',
  'Description',
  'Disposition Details',
  'Technical Root Cause',
  'Preventive Action',
  'Corrective Action',
  'Containment',
  'CFI LOB Subset',
  'CFI Platform Subset',
  'Order Number',
  'SI Code-Revision',
  'Project Manager',
  'Project Engineer',
  'Service Tag',
  'Failed Phase',
  'Responsible',
  'Root Cause',
  'Impact Order QTY',
  'Discretionary Field',
  'System QTY (WIP)',
  'System QTY (Backlog)',
  'Region',
  'Customer Name',
  'Issue Type',
  'war_room_flag',
  'SLA',
  'Additional Details / Updates',
  'Mitigation / Contingency',
] as const;

type IssueColumn = typeof ISSUE_COLUMNS[number];
export type IssueRow = Partial<Record<IssueColumn, string | null>>;

const EDITABLE_COLUMNS: IssueColumn[] = [
  'war_room_flag',
  'Additional Details / Updates',
  'Mitigation / Contingency',
];

interface IssueTableEditorProps {
  title: string;
  rows: IssueRow[];
  loading: boolean;
  onSave: (psrNumber: string, payload: {
    war_room_flag: string | null;
    additional_details_updates: string | null;
    mitigation_contingency: string | null;
  }) => Promise<void>;
}

const getStringValue = (row: IssueRow, key: IssueColumn): string => {
  const value = row[key];
  return value == null ? '' : String(value);
};

const IssueTableEditor: React.FC<IssueTableEditorProps> = ({ title, rows, loading, onSave }) => {
  const [draftRows, setDraftRows] = useState<IssueRow[]>([]);
  const [savingPsr, setSavingPsr] = useState<string | null>(null);

  useEffect(() => {
    setDraftRows(rows);
  }, [rows]);

  const handleDraftChange = (psrNumber: string, key: IssueColumn, value: string) => {
    setDraftRows((prev) => prev.map((row) => {
      if (String(row['PSR Number'] ?? '') !== psrNumber) {
        return row;
      }
      return {
        ...row,
        [key]: value,
      };
    }));
  };

  const handleSave = async (row: IssueRow) => {
    const psrNumber = String(row['PSR Number'] ?? '').trim();
    if (!psrNumber) {
      return;
    }

    setSavingPsr(psrNumber);
    try {
      await onSave(psrNumber, {
        war_room_flag: getStringValue(row, 'war_room_flag').trim() || null,
        additional_details_updates: getStringValue(row, 'Additional Details / Updates').trim() || null,
        mitigation_contingency: getStringValue(row, 'Mitigation / Contingency').trim() || null,
      });
    } finally {
      setSavingPsr(null);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#0076ce', fontStyle: 'italic', marginBottom: '12px' }}>{title}</h2>
      {loading ? <DDSLoadingIndicator /> : null}
      <div style={{ overflowX: 'auto' }}>
        <table className="dds__table dds__table--striped" style={{ minWidth: '1800px' }}>
          <thead>
            <tr>
              {ISSUE_COLUMNS.map((column) => <th key={column}>{column}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {draftRows.map((row) => {
              const psrNumber = String(row['PSR Number'] ?? '');
              return (
                <tr key={psrNumber || `row-${row.Title ?? ''}`}>
                  {ISSUE_COLUMNS.map((column) => {
                    const value = getStringValue(row, column);
                    if (column === 'war_room_flag') {
                      return (
                        <td key={`${psrNumber}-${column}`}>
                          <select
                            value={value}
                            onChange={(event) => handleDraftChange(psrNumber, column, event.target.value)}
                          >
                            <option value="">(null)</option>
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                          </select>
                        </td>
                      );
                    }

                    if (EDITABLE_COLUMNS.includes(column)) {
                      return (
                        <td key={`${psrNumber}-${column}`}>
                          <input
                            style={{ width: '260px' }}
                            type="text"
                            value={value}
                            onChange={(event) => handleDraftChange(psrNumber, column, event.target.value)}
                          />
                        </td>
                      );
                    }

                    return <td key={`${psrNumber}-${column}`}>{value}</td>;
                  })}
                  <td>
                    <DDSButton
                      disabled={!psrNumber || savingPsr === psrNumber}
                      size="sm"
                      onClick={() => handleSave(row)}
                    >
                      {savingPsr === psrNumber ? 'Saving...' : 'Save'}
                    </DDSButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueTableEditor;
