import { env } from "../config/env.js";

export class AIProviderError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "AIProviderError";
    this.statusCode = statusCode;
  }
}
const stub = { title: { titles: ["The Algorithm Decoded: Your Complete Growth Playbook", "Stop Making These Creator Mistakes", "The ONLY Content Strategy You Need"], reasoning: "Curiosity, specificity, and a clear benefit improve click-through rate.", seo_tips: "Place the primary keyword early in the title." }, caption: { captions: [{ length: "short", text: "Growth accelerates with the right system.", character_count: 41 }, { length: "medium", text: "The best creators build repeatable systems, not one-off lucky posts.", character_count: 67 }, { length: "long", text: "Study the pattern, make the promise clear, and deliver value early.", character_count: 68 }] }, hook: { hooks: ["Nobody talks about this creator growth shortcut.", "In the next 60 seconds, I will show the exact framework.", "This single change doubled my reach.", "What if the algorithm is not your real problem?", "Here is the pattern behind the top videos."], hook_types: ["curiosity", "promise", "result", "challenge", "insight"], reasoning: "Each hook creates curiosity and promises value." }, hashtag: { hashtags: ["#contentcreator", "#socialmediagrowth", "#viralcontent", "#youtubegrowth", "#creatoreconomy"], categories: { trending: ["#viralcontent"], niche: ["#youtubegrowth"], branded: ["#socialmediagrowth"] }, avoid: ["#follow4follow", "#like4like"] }, thumbnail_concept: { concepts: [{ title: "High-Contrast Emotion", description: "Bright background, one expressive face, and a short bold message.", colors: ["#FFDD00", "#FF4136"], text_overlay: "THE TRUTH", emotion: "Surprise", ctr_score: 8.5 }] }, posting_time: { recommendations: [{ day: "Tuesday", time: "18:00", timezone: "EST", reason: "High audience activity", expected_boost: "+25% reach" }], frequency: "3 videos/week" }, content_calendar: { weeks: [{ week: 1, theme: "Foundation & Introduction", posts: [{ day: "Monday", topic: "Channel introduction", format: "Talking head", duration: "8-12 min", note: "Establish brand voice" }] }] } };

const outputExamples = {
  title: { titles: ["Three concise title options"], reasoning: "Why these titles fit the content", seo_tips: "One practical SEO tip" },
  caption: { captions: [{ length: "short", text: "A short caption", character_count: 16 }, { length: "medium", text: "A medium-length caption", character_count: 24 }, { length: "long", text: "A longer caption with a clear benefit", character_count: 39 }] },
  hook: { hooks: ["A strong opening hook"], hook_types: ["curiosity"], reasoning: "Why the hooks should hold attention" },
  hashtag: { hashtags: ["#example"], categories: { trending: [], niche: [], branded: [] }, avoid: [] },
  thumbnail_concept: { concepts: [{ title: "Concept name", description: "Visual direction", colors: ["#FFDD00"], text_overlay: "SHORT TEXT", emotion: "Curiosity", ctr_score: 8 }] },
  posting_time: { recommendations: [{ day: "Tuesday", time: "18:00", timezone: "UTC", reason: "Audience activity", expected_boost: "+10% reach" }], frequency: "3 posts/week" },
  content_calendar: { weeks: [{ week: 1, theme: "Theme", posts: [{ day: "Monday", topic: "Topic", format: "Video", duration: "Short", note: "Execution note" }] }] }
};

function videoContext(videos = []) {
  return videos.slice(0, 50).map((video) => ({
    title: video.title,
    description: String(video.description || "").slice(0, 500),
    tags: video.tags || [],
    views: video.views || 0,
    likes: video.likes || 0,
    comments: video.comments || 0
  }));
}

function parseJsonResponse(text) {
  const cleaned = String(text || "").replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new AIProviderError("The AI provider returned an invalid JSON response.");
  }
}

async function generateWithGemini(type, videos, accountName) {
  if (!env.googleApiKey) throw new AIProviderError("GOOGLE_API_KEY is not configured. Add it to api with express+mongodb/.env.", 503);
  const baseUrl = env.geminiBaseUrl.replace(/\/+$/, "");
  const endpoint = `${baseUrl}/models/${encodeURIComponent(env.geminiModel)}:generateContent`;
  const prompt = [
    "You are a social media strategist. Generate a useful recommendation from the supplied video data.",
    "Return only valid JSON, with no Markdown fences or extra text.",
    `Suggestion type: ${type}`,
    `Account/channel: ${accountName || "Unknown"}`,
    `Required JSON shape: ${JSON.stringify(outputExamples[type])}`,
    `Video data: ${JSON.stringify(videoContext(videos))}`
  ].join("\n");
  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.googleApiKey },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.7 } })
    });
  } catch (error) {
    throw new AIProviderError(`Unable to reach Gemini: ${error.message}`);
  }
  let data;
  try { data = await response.json(); } catch { throw new AIProviderError("Gemini returned an invalid response."); }
  if (!response.ok || data.error) throw new AIProviderError(data.error?.message || `Gemini request failed with status ${response.status}.`);
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("");
  if (!text) throw new AIProviderError("Gemini returned no generated content.");
  return parseJsonResponse(text);
}

export async function generateSuggestion(type, videos, accountName, provider = "auto") {
  const selectedProvider = String(provider || "auto").toLowerCase();
  if (selectedProvider === "stub") return stub[type] || { message: "Suggestion generated.", type };
  if (!["auto", "gemini", "claude"].includes(selectedProvider)) throw new AIProviderError(`Unsupported provider '${provider}'.`, 400);
  if (selectedProvider === "claude") throw new AIProviderError("Claude provider is not configured. Use provider 'gemini' or 'auto'.", 503);
  return generateWithGemini(type, videos, accountName);
}
