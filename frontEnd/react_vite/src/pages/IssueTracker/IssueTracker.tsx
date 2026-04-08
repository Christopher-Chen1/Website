import { useEffect, useState } from 'react';
import IssueTableEditor, { IssueRow } from './IssueTableEditor';

const IssueTracker = () => {
  const [rows, setRows] = useState<IssueRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWarRoomRows = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/issue-tracker/war-room-list`);
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error('Failed to fetch war room list:', error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarRoomRows();
  }, []);

  const handleSave = async (psrNumber: string, payload: {
    war_room_flag: string | null;
    additional_details_updates: string | null;
    mitigation_contingency: string | null;
  }) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/issue-tracker/pqm-list/${encodeURIComponent(psrNumber)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to save row');
    }

    await fetchWarRoomRows();
  };

  return (
    <IssueTableEditor
      title="GCS ODW WarRoom Issue Tracker"
      rows={rows}
      loading={loading}
      onSave={handleSave}
    />
  );
};

export default IssueTracker;
