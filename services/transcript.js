export function extractVideoId(value = "") { const match = String(value).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{6,})/); return match?.[1] || null; }
export async function transcript(videoId) { if (!videoId) throw new Error("Please enter a valid YouTube video URL."); return { text: `Transcript is unavailable for ${videoId} in the local migration runtime.`, language: "en", segments: [] }; }


