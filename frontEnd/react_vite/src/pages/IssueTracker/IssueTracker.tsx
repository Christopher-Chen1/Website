import React, { useEffect, useMemo, useState } from "react";
import { DDSButton, DDSInput, DDSTable, DDSTextArea } from "@dds/react";

type WarRoomRow = {
  [key: string]: unknown;
  "PSR Number": string;
  Title?: string | null;
  Status?: string | null;
  Region?: string | null;
  "Issue Type"?: string | null;
  war_room_flag?: string | null;
  "Additional Details / Updates"?: string | null;
  "Mitigation / Contingency"?: string | null;
};

const emptyToNull = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const columns = [
  { value: "PSR Number" },
  { value: "Title" },
  { value: "Status" },
  { value: "Region" },
  { value: "Issue Type" },
  { value: "War Room Flag (Y/N)" },
  { value: "Additional Details / Updates" },
  { value: "Mitigation / Contingency" },
  { value: "Action" },
];

const IssueTracker: React.FC = () => {
  const [rows, setRows] = useState<WarRoomRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWarRoomList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/war-room-list`);
      if (!response.ok) {
        throw new Error("Failed to fetch war room list");
      }
      const data = await response.json();
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarRoomList();
  }, []);

  const updateLocalRow = (psrNumber: string, field: keyof WarRoomRow, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row["PSR Number"] === psrNumber
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );
  };

  const saveRow = async (row: WarRoomRow) => {
    const psrNumber = row["PSR Number"];
    setSavingId(psrNumber);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pqm-list/${encodeURIComponent(psrNumber)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          war_room_flag: emptyToNull(String(row.war_room_flag ?? ""))?.toUpperCase() ?? null,
          additional_details_updates: emptyToNull(String(row["Additional Details / Updates"] ?? "")),
          mitigation_contingency: emptyToNull(String(row["Mitigation / Contingency"] ?? "")),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to save record");
      }

      await fetchWarRoomList();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSavingId(null);
    }
  };

  const data = useMemo(
    () =>
      rows.map((row) => {
        const psrNumber = row["PSR Number"];
        return {
          columns: [
            { value: psrNumber },
            { value: String(row.Title ?? "") },
            { value: String(row.Status ?? "") },
            { value: String(row.Region ?? "") },
            { value: String(row["Issue Type"] ?? "") },
            {
              value: (
                <DDSInput
                  aria-label={`war-room-flag-${psrNumber}`}
                  value={String(row.war_room_flag ?? "")}
                  maxLength={1}
                  onInput={(e) => updateLocalRow(psrNumber, "war_room_flag", (e.target as HTMLInputElement).value)}
                />
              ),
            },
            {
              value: (
                <DDSTextArea
                  aria-label={`additional-details-${psrNumber}`}
                  value={String(row["Additional Details / Updates"] ?? "")}
                  onInput={(e) =>
                    updateLocalRow(
                      psrNumber,
                      "Additional Details / Updates",
                      (e.target as HTMLTextAreaElement).value,
                    )
                  }
                />
              ),
            },
            {
              value: (
                <DDSTextArea
                  aria-label={`mitigation-${psrNumber}`}
                  value={String(row["Mitigation / Contingency"] ?? "")}
                  onInput={(e) =>
                    updateLocalRow(psrNumber, "Mitigation / Contingency", (e.target as HTMLTextAreaElement).value)
                  }
                />
              ),
            },
            {
              value: (
                <DDSButton
                  size="sm"
                  disabled={savingId === psrNumber}
                  onClick={() => saveRow(row)}
                >
                  {savingId === psrNumber ? "Saving..." : "Save"}
                </DDSButton>
              ),
            },
          ],
        };
      }),
    [rows, savingId],
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#0076ce", fontStyle: "italic", marginBottom: "12px" }}>
        GCS ODW WarRoom Issue Tracker
      </h2>
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {loading ? <p>Loading...</p> : <DDSTable columnFilter columns={columns} data={data} />}
    </div>
  );
};

export default IssueTracker;
