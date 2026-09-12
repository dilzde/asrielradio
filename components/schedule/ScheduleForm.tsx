"use client";

import { useState, useTransition } from "react";
import { addProgram, updateProgram, deleteProgram, type Program } from "@/lib/actions/programs";

interface ScheduleFormProps {
  programs: Program[];
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function ScheduleForm({ programs }: ScheduleFormProps) {
  const [isPending, startTransition] = useTransition();
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        await addProgram(formData);
        form.reset();
        setShowAddForm(false);
      } catch (err: any) {
        setError(err?.message || "Failed to add program");
      }
    });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProgram) return;
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        await updateProgram(editingProgram.id, formData);
        setEditingProgram(null);
      } catch (err: any) {
        setError(err?.message || "Failed to update program");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    setError(null);

    startTransition(async () => {
      try {
        await deleteProgram(id);
      } catch (err: any) {
        setError(err?.message || "Failed to delete program");
      }
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1C1208" }}>Manage Broadcast Schedule</h2>
          <p style={{ color: "#6B7573", fontSize: "14px" }}>
            Add, update, or remove live programs. Broadcasts update automatically across the site.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProgram(null);
          }}
          style={{
            background: "#D4860A",
            color: "#1C1208",
            fontWeight: 700,
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            border: "none",
          }}
        >
          {showAddForm ? "Cancel" : "+ Add New Program"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", color: "#991B1B", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {/* Add or Edit Form */}
      {(showAddForm || editingProgram) && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E0D4", borderRadius: "16px", padding: "24px", marginBottom: "32px", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "#1C1208" }}>
            {editingProgram ? `Edit Program: ${editingProgram.title}` : "Add New Program"}
          </h3>

          <form onSubmit={editingProgram ? handleUpdate : handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                Program Title *
              </label>
              <input
                type="text"
                name="title"
                defaultValue={editingProgram?.title || ""}
                required
                placeholder="e.g. Morning Glory & Praise"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                Host Name
              </label>
              <input
                type="text"
                name="host"
                defaultValue={editingProgram?.host || ""}
                placeholder="e.g. Prophet Dr. Samo Mtishiby"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                Day of Week *
              </label>
              <select
                name="day_of_week"
                defaultValue={editingProgram ? editingProgram.day_of_week : 0}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              >
                {DAYS.map((day, idx) => (
                  <option key={day} value={idx}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                Start Time (HH:MM:SS) *
              </label>
              <input
                type="text"
                name="start_time"
                defaultValue={editingProgram?.start_time || "06:00:00"}
                required
                placeholder="06:00:00"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1C1208", marginBottom: "4px", textTransform: "uppercase" }}>
                End Time (HH:MM:SS) *
              </label>
              <input
                type="text"
                name="end_time"
                defaultValue={editingProgram?.end_time || "08:00:00"}
                required
                placeholder="08:00:00"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" }}
              />
            </div>

            <div style={{ gridColumn: "span 2", display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                type="submit"
                disabled={isPending}
                style={{
                  background: "#D4860A",
                  color: "#1C1208",
                  fontWeight: 700,
                  padding: "10px 24px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? "Saving..." : editingProgram ? "Update Program" : "Create Program"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProgram(null);
                }}
                style={{
                  background: "#F3F4F6",
                  color: "#374151",
                  fontWeight: 600,
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Programs Grouped by Day */}
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {DAYS.map((dayName, dayIdx) => {
          const dayShows = programs.filter((p) => p.day_of_week === dayIdx);
          return (
            <div key={dayName} style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E0D4", overflow: "hidden" }}>
              <div style={{ background: "#FDFCF7", padding: "14px 20px", borderBottom: "1px solid #E5E0D4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1C1208" }}>{dayName}</h4>
                <span style={{ fontSize: "12px", color: "#6B7573" }}>{dayShows.length} programs</span>
              </div>

              {dayShows.length === 0 ? (
                <div style={{ padding: "20px", color: "#9CA3AF", fontSize: "13.5px", fontStyle: "italic" }}>
                  No programs scheduled for {dayName}.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {dayShows.map((show) => (
                    <div
                      key={show.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 20px",
                        borderBottom: "1px solid #F3F4F6",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <div style={{ width: "120px", fontSize: "13px", fontWeight: 600, color: "#D4860A" }}>
                          {show.start_time.slice(0, 5)} - {show.end_time.slice(0, 5)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "15px", color: "#1C1208" }}>{show.title}</div>
                          <div style={{ fontSize: "12.5px", color: "#6B7573" }}>{show.host || "VPM International"}</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProgram(show);
                            setShowAddForm(false);
                          }}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            background: "#F3F4F6",
                            color: "#1F2937",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(show.id)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            background: "#FEE2E2",
                            color: "#991B1B",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
