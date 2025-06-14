import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import * as XLSX from "xlsx";

type Row = {
  "S.no": number;
  Length: string;
  Width: string;
  Height: string;
  GSM: string;
  Ply: string;
  "Cardboard Size": string;
  "Total Weight (grams)": string;
};

type FormState = {
  length: string;
  lengthUnit: string;
  width: string;
  widthUnit: string;
  height: string;
  heightUnit: string;
  gsm: string;
  ply: string;
};

export default function CalculationPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<FormState>({
    length: "",
    lengthUnit: "cm",
    width: "",
    widthUnit: "cm",
    height: "",
    heightUnit: "cm",
    gsm: "",
    ply: "3PLY",
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cardboardRows");
      if (saved) setRows(JSON.parse(saved));
    } catch {
      setRows([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cardboardRows", JSON.stringify(rows));
  }, [rows]);

  // Handle form input
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Convert to cm
  const toCm = (value: string, unit: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return 0;
    if (unit === "cm") return num;
    if (unit === "mm") return num / 10;
    if (unit === "inches") return num * 2.54;
    return num;
  };

  // Calculate and add row
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !form.length ||
      !form.width ||
      !form.height ||
      !form.gsm ||
      isNaN(Number(form.length)) ||
      isNaN(Number(form.width)) ||
      isNaN(Number(form.height)) ||
      isNaN(Number(form.gsm))
    ) {
      alert("Please fill all fields with valid numbers.");
      return;
    }

    const lengthCm = toCm(form.length, form.lengthUnit);
    const widthCm = toCm(form.width, form.widthUnit);
    const heightCm = toCm(form.height, form.heightUnit);

    let extra1 = 3, extra2 = 6;
    if (form.ply !== "3PLY") extra2 = 12;

    const part1 = widthCm + heightCm + extra1;
    const part2 = (lengthCm + widthCm) * 2 + extra2;
    const cardboardLength = part1 * part2;
    const weight = (cardboardLength * (parseFloat(form.gsm) || 0)) / 1000;

    setRows([
      ...rows,
      {
        "S.no": rows.length + 1,
        Length: `${parseFloat(form.length).toFixed(2)} cm`,
        Width: `${parseFloat(form.width).toFixed(2)} cm`,
        Height: `${parseFloat(form.height).toFixed(2)} cm`,
        GSM: form.gsm,
        Ply: form.ply,
        "Cardboard Size": `${part1.toFixed(2)} cm × ${part2.toFixed(2)} cm`,
        "Total Weight (grams)": `${weight.toFixed(2)} grams`,
      },
    ]);
    setForm({
      length: "",
      lengthUnit: "cm",
      width: "",
      widthUnit: "cm",
      height: "",
      heightUnit: "cm",
      gsm: "",
      ply: "3PLY",
    });
  };

  // Delete row
  const deleteRow = (idx: number) => {
    const newRows = rows.filter((_, i) => i !== idx).map((row, i) => ({ ...row, "S.no": i + 1 }));
    setRows(newRows);
  };

  // Export to Excel
  const exportExcel = () => {
    if (rows.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "cardboard_data.xlsx");
  };

  // Export & Reset
  const exportAndReset = () => {
    exportExcel();
    setRows([]);
    localStorage.removeItem("cardboardRows");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#f3f4f6",
        margin: 0,
        padding: 0,
        position: "absolute",
        left: 0,
        top: 0,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "auto",
          padding: "24px 8px", // Add horizontal padding for small screens
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2563eb",
            fontSize: "clamp(1.3rem, 4vw, 2.2rem)",
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          📦 Cardboard Weight Calculator for 3PLY and 5PLY/7PLY
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#334155",
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            marginBottom: 16,
          }}
        >
          Enter your cardboard dimensions and GSM to calculate the size and weight.
        </p>
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#f8fafc",
            padding: 24,
            borderRadius: 16,
            marginBottom: 32,
            boxShadow: "0 4px 16px 0 #e0e7ff55",
            maxWidth: 400,
            marginLeft: "auto",
            marginRight: "auto",
            width: "100%",
            minWidth: 0,
          }}
        >
          {/* Length Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 2, minWidth: 0 }}>
              <label style={{ fontWeight: 500 }}>Length</label>
              <input
                name="length"
                value={form.length}
                onChange={handleChange}
                type="number"
                step="0.01"
                required
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  marginTop: 4,
                  minWidth: 0,
                }}
              />
            </div>
            <div style={{ flex: 1, marginTop: 22, minWidth: 80 }}>
              <select
                name="lengthUnit"
                value={form.lengthUnit}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  minWidth: 0,
                }}
              >
                <option>cm</option>
                <option>inches</option>
                <option>mm</option>
              </select>
            </div>
          </div>
          {/* Width Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 2, minWidth: 0 }}>
              <label style={{ fontWeight: 500 }}>Width</label>
              <input
                name="width"
                value={form.width}
                onChange={handleChange}
                type="number"
                step="0.01"
                required
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  marginTop: 4,
                  minWidth: 0,
                }}
              />
            </div>
            <div style={{ flex: 1, marginTop: 22, minWidth: 80 }}>
              <select
                name="widthUnit"
                value={form.widthUnit}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  minWidth: 0,
                }}
              >
                <option>cm</option>
                <option>inches</option>
                <option>mm</option>
              </select>
            </div>
          </div>
          {/* Height Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 2, minWidth: 0 }}>
              <label style={{ fontWeight: 500 }}>Height</label>
              <input
                name="height"
                value={form.height}
                onChange={handleChange}
                type="number"
                step="0.01"
                required
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  marginTop: 4,
                  minWidth: 0,
                }}
              />
            </div>
            <div style={{ flex: 1, marginTop: 22, minWidth: 80 }}>
              <select
                name="heightUnit"
                value={form.heightUnit}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  minWidth: 0,
                }}
              >
                <option>cm</option>
                <option>inches</option>
                <option>mm</option>
              </select>
            </div>
          </div>
          {/* Ply and GSM Row */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <label style={{ fontWeight: 500 }}>Ply</label>
              <select
                name="ply"
                value={form.ply}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  marginTop: 4,
                  minWidth: 0,
                }}
              >
                <option>3PLY</option>
                <option>5PLY</option>
                <option>7PLY</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label style={{ fontWeight: 500 }}>GSM</label>
              <input
                name="gsm"
                value={form.gsm}
                onChange={handleChange}
                type="number"
                step="0.01"
                required
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  marginTop: 4,
                  minWidth: 0,
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "10px 0",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
              fontSize: "1.1em",
              width: "100%",
              marginTop: 12,
              boxShadow: "0 2px 8px #2563eb22",
              letterSpacing: 1,
            }}
          >
            Calculate & Add
          </button>
        </form>

        <h2
          style={{
            textAlign: "center",
            color: "#2563eb",
            fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
            margin: "24px 0 8px 0",
          }}
        >
          Weight Calculator
        </h2>
        <div
          style={{
            marginBottom: 8,
            color: "#334155",
            fontSize: "clamp(1em, 2vw, 1.05em)",
            wordBreak: "break-word",
          }}
        >
          Below is your Excel database. You can store up to <b>500 entries</b> in a single file.<br />
          <ul>
            <li>To <b>delete</b> a row, click the <b>Delete</b> button next to it.</li>
            <li>To <b>download</b> the current database, use the <b>Download Current Excel</b> button below the table (right side).</li>
            <li>To <b>export and reset</b> the database, use the <b>Export & Reset</b> button at the bottom.</li>
          </ul>
        </div>
        <div style={{ overflowX: "auto", marginBottom: 8 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: 8,
              minWidth: 600,
            }}
          >
            <thead>
              <tr>
                {rows[0] &&
                  Object.keys(rows[0]).map((col) => (
                    <th
                      key={col}
                      style={{
                        border: "1px solid #e0e7ff",
                        padding: 8,
                        background: "#f1f5f9",
                        fontSize: "clamp(0.9em, 2vw, 1em)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                <th
                  style={{
                    border: "1px solid #e0e7ff",
                    padding: 8,
                    background: "#f1f5f9",
                    fontSize: "clamp(0.9em, 2vw, 1em)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td
                      key={i}
                      style={{
                        border: "1px solid #e0e7ff",
                        padding: 8,
                        fontSize: "clamp(0.9em, 2vw, 1em)",
                        wordBreak: "break-word",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {val}
                    </td>
                  ))}
                  <td style={{ border: "1px solid #e0e7ff", padding: 8 }}>
                    <button
                      onClick={() => deleteRow(idx)}
                      style={{
                        color: "#fff",
                        background: "#ef4444",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 12px",
                        fontSize: "clamp(0.9em, 2vw, 1em)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <button
            onClick={exportExcel}
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "8px 24px",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
              fontSize: "clamp(1em, 2vw, 1.1em)",
              marginBottom: 8,
              whiteSpace: "nowrap",
            }}
          >
            Download Current Excel
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={exportAndReset}
            style={{
              background: "#f59e42",
              color: "#fff",
              padding: "8px 24px",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
              fontSize: "clamp(1em, 2vw, 1.1em)",
              marginBottom: 8,
              whiteSpace: "nowrap",
            }}
          >
            Export & Reset
          </button>
        </div>
      </div>
    </div>
  );
}