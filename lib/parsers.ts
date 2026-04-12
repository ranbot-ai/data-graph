import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { ParsedData, Column, ColumnType } from "./types";

export function inferColumnType(samples: string[]): ColumnType {
  const nonEmpty = samples.filter(Boolean);
  if (nonEmpty.length === 0) return "string";

  const allNumbers = nonEmpty.every(
    (v) => !isNaN(Number(v)) && v.trim() !== "",
  );
  if (allNumbers) return "number";

  const dateRe = /^\d{4}-\d{2}-\d{2}(T[\d:.Z]+)?$/;
  const allDates = nonEmpty.every((v) => dateRe.test(v.trim()));
  if (allDates) return "date";

  return "string";
}

export async function parseCSV(csvText: string): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rawRows = result.data as Record<string, string>[];
        const columnNames = result.meta.fields ?? [];

        const columns: Column[] = columnNames.map((name) => ({
          name,
          type: inferColumnType(rawRows.map((r) => r[name] ?? "")),
        }));

        const rows: Record<string, unknown>[] = rawRows.map((row) =>
          Object.fromEntries(
            columnNames.map((col) => {
              const colDef = columns.find((c) => c.name === col)!;
              const raw = row[col];
              if (colDef.type === "number") return [col, Number(raw)];
              return [col, raw];
            }),
          ),
        );

        resolve({ columns, rows });
      },
      error: reject,
    });
  });
}

export async function parseExcel(buffer: ArrayBuffer): Promise<ParsedData> {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  if (rawRows.length === 0) return { columns: [], rows: [] };

  const columnNames = Object.keys(rawRows[0]);
  const columns: Column[] = columnNames.map((name) => ({
    name,
    type: inferColumnType(rawRows.map((r) => String(r[name] ?? ""))),
  }));

  const rows: Record<string, unknown>[] = rawRows.map((row) =>
    Object.fromEntries(
      columnNames.map((col) => {
        const colDef = columns.find((c) => c.name === col)!;
        const raw = row[col];
        if (colDef.type === "number") return [col, Number(raw)];
        return [col, raw];
      }),
    ),
  );

  return { columns, rows };
}
