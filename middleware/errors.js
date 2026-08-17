export function notFound(_req, res) { res.status(404).json({ error: "Resource not found." }); }

export function errorHandler(error, _req, res, _next) {
  console.error(error);
  if (error?.code === 11000) return res.status(400).json({ errors: ["A record with the same unique value already exists."] });
  if (error?.name === "ValidationError") return res.status(400).json({ errors: Object.values(error.errors).map((item) => item.message) });
  res.status(error?.statusCode || 500).json({ error: "Internal server error" });
}


