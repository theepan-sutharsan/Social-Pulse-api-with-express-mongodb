export function parseNumeric(value, fallback = null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

export function sendCsv(res, filename, headers, rows) {
  const escape = (value) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  const body = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
  res.status(200).type("text/csv").set("Content-Disposition", `attachment; filename="${filename}"`).send(body);
}

export function sendTextPdf(res, filename, title, sections = []) {
  const lines = [title, ...sections.flatMap((section) => [section.heading || "", section.body || "", ...(section.fields || []).map(([key, value]) => `${key}: ${value}`), ""])];
  const content = ["BT", "/F1 11 Tf", "50 760 Td", ...lines.slice(0, 55).map((line, index) => `(${String(line).replace(/[()\\]/g, "\\$&").slice(0, 120)}) Tj ${index < lines.length - 1 ? "0 -16 Td" : ""}`), "ET"].join("\n");
  const objects = [`<< /Type /Catalog /Pages 2 0 R >>`, `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`, `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`];
  let pdf = "%PDF-1.4\n"; const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(pdf); pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  res.status(200).type("application/pdf").set("Content-Disposition", `attachment; filename="${filename}"`).send(Buffer.from(pdf));
}
