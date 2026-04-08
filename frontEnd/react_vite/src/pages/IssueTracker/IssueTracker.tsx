import React, { useEffect, useState } from "react";

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

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#0076ce", fontStyle: "italic", marginBottom: "12px" }}>
        GCS ODW WarRoom Issue Tracker
      </h2>
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="dds__data-table" style={{ minWidth: "1200px", width: "100%" }}>
            <thead>
              <tr>
                <th>PSR Number</th>
                <th>Title</th>
                <th>Status</th>
                <th>Region</th>
                <th>Issue Type</th>
                <th>War Room Flag (Y/N)</th>
                <th>Additional Details / Updates</th>
                <th>Mitigation / Contingency</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const psrNumber = row["PSR Number"];
                return (
                  <tr key={psrNumber}>
                    <td>{psrNumber}</td>
                    <td>{String(row.Title ?? "")}</td>
                    <td>{String(row.Status ?? "")}</td>
                    <td>{String(row.Region ?? "")}</td>
                    <td>{String(row["Issue Type"] ?? "")}</td>
                    <td>
                      <input
                        value={String(row.war_room_flag ?? "")}
                        onChange={(e) => updateLocalRow(psrNumber, "war_room_flag", e.target.value)}
                        maxLength={1}
                      />
                    </td>
                    <td>
                      <textarea
                        value={String(row["Additional Details / Updates"] ?? "")}
                        onChange={(e) =>
                          updateLocalRow(psrNumber, "Additional Details / Updates", e.target.value)
                        }
                        rows={2}
                      />
                    </td>
                    <td>
                      <textarea
                        value={String(row["Mitigation / Contingency"] ?? "")}
                        onChange={(e) => updateLocalRow(psrNumber, "Mitigation / Contingency", e.target.value)}
                        rows={2}
                      />
                    </td>
                    <td>
                      <button type="button" onClick={() => saveRow(row)} disabled={savingId === psrNumber}>
                        {savingId === psrNumber ? "Saving..." : "Save"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IssueTracker;
