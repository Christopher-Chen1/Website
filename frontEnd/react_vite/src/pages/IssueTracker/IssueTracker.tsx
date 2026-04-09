import React, { useEffect, useMemo, useState } from "react";
import { DDSButton, DDSInput, DDSPagination, DDSTable, DDSTextArea } from "@dds/react";

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

const getCurrentUserDisplayName = (): string => {
  try {
    const raw = sessionStorage.getItem("user_info");
    if (!raw) return "Unknown User";
    const parsed = JSON.parse(raw) as Record<string, string>;
    return (
      parsed.name ||
      parsed.displayName ||
      parsed.preferred_username ||
      parsed.username ||
      parsed.account_alias_name ||
      "Unknown User"
    );
  } catch {
    return "Unknown User";
  }
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
  const [originalRows, setOriginalRows] = useState<Record<string, WarRoomRow>>({});
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
      setOriginalRows(
        data.reduce((acc: Record<string, WarRoomRow>, row: WarRoomRow) => {
          acc[row["PSR Number"]] = row;
          return acc;
        }, {}),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarRoomList();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  const pagination = useMemo(
    () => ({
      currentPage,
      pageSize,
    }),
    [currentPage, pageSize],
  );

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
    const originalRow = originalRows[psrNumber];
    const payload: Record<string, string | null> = {};
    const currentWarRoomFlag = emptyToNull(String(row.war_room_flag ?? ""))?.toUpperCase() ?? null;
    const originalWarRoomFlag = emptyToNull(String(originalRow?.war_room_flag ?? ""))?.toUpperCase() ?? null;
    const currentAdditional = emptyToNull(String(row["Additional Details / Updates"] ?? ""));
    const originalAdditional = emptyToNull(String(originalRow?.["Additional Details / Updates"] ?? ""));
    const currentMitigation = emptyToNull(String(row["Mitigation / Contingency"] ?? ""));
    const originalMitigation = emptyToNull(String(originalRow?.["Mitigation / Contingency"] ?? ""));

    if (currentWarRoomFlag !== originalWarRoomFlag) {
      payload.war_room_flag = currentWarRoomFlag;
    }
    if (currentAdditional !== originalAdditional) {
      payload.additional_details_updates = currentAdditional;
    }
    if (currentMitigation !== originalMitigation) {
      payload.mitigation_contingency = currentMitigation;
    }

    if (Object.keys(payload).length === 0) {
      return;
    }

    if (payload.additional_details_updates !== undefined || payload.mitigation_contingency !== undefined) {
      payload.updated_by = getCurrentUserDisplayName();
    }

    setSavingId(psrNumber);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pqm-list/${encodeURIComponent(psrNumber)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DDSTable columnFilter columns={columns} data={data} pagination={pagination} />
          <DDSPagination
            currentPage={currentPage}
            totalItems={data.length}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50]}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </div>
  );
};

export default IssueTracker;
