import { env } from "../config/env.js";

export class YouTubeApiError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "YouTubeApiError";
    this.statusCode = statusCode;
  }
}

export function parseYoutubeIdentifier(input = "") { let value = String(input).trim(); if (!value) return { type: "id", value: "" }; if (/^https?:\/\//.test(value) || value.startsWith("www.youtube.com") || value.startsWith("youtube.com")) { if (!/^https?:\/\//.test(value)) value = `https://${value}`; const path = new URL(value).pathname.replace(/^\/+|\/+$/g, ""); if (path.startsWith("@")) return { type: "handle", value: path }; if (path.startsWith("channel/")) return { type: "id", value: path.split("/")[1] || path }; if (path.startsWith("c/") || path.startsWith("user/")) return { type: "handle", value: `@${path.split("/")[1]}` }; return path.startsWith("UC") ? { type: "id", value: path.split("/")[0] } : { type: "handle", value: `@${path.split("/")[0]}` }; } if (value.startsWith("@")) return { type: "handle", value }; if (value.startsWith("UC")) return { type: "id", value }; return { type: "handle", value: `@${value}` }; }

export function stubChannel(input) { const parsed = parseYoutubeIdentifier(input).value; return { channel_id: parsed.startsWith("UC") ? parsed : `UC_${parsed.replace(/^@/, "").slice(0, 18)}`, display_name: parsed.startsWith("@") ? parsed : `Channel (${parsed.slice(0, 8)}...)`, description: "Demo data is shown because YOUTUBE_API_KEY is not configured.", subscriber_count: 10000, total_views: 0, video_count: 50, thumbnail: "", data_source: "stub" }; }
export function stubVideos(channelId, count = 20) { const titles = ["How I Built a SaaS in 30 Days", "5 Mistakes Every Developer Makes", "Next.js Full Course", "REST API Tutorial", "React vs Vue", "The BEST AI Tools for Developers", "Build a Full Stack App", "Docker for Beginners", "Git Workflow for Teams", "TypeScript Tips"]; return Array.from({ length: count }, (_, index) => ({ external_id: `yt_stub_${String(channelId).slice(0, 6)}_${index}`, title: `${titles[index % titles.length]}${index >= titles.length ? ` (Part ${index + 1})` : ""}`, description: "A detailed video guide for creators and developers.", tags: ["tutorial", "programming", "tech"], thumbnail_url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", duration_seconds: 300 + (index * 45) % 1800, published_at: new Date(Date.now() - index * 86400000).toISOString(), views: 0, likes: 0, comments: 0, shares: 0 })); }
async function fetchYoutubeJson(url, operation) {
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new YouTubeApiError(`Unable to reach YouTube while ${operation}: ${error.message}`);
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new YouTubeApiError(`YouTube returned an invalid response while ${operation}.`);
  }
  if (!response.ok || data.error) {
    const reason = data.error?.errors?.[0]?.reason;
    const message = data.error?.message || `YouTube request failed with status ${response.status}.`;
    throw new YouTubeApiError(`${message}${reason ? ` (${reason})` : ""}`);
  }
  return data;
}

export async function getChannelInfo(input) { const parsed = parseYoutubeIdentifier(input); if (!env.youtubeApiKey) return stubChannel(parsed.value); const params = new URLSearchParams({ part: "snippet,statistics,brandingSettings", key: env.youtubeApiKey, [parsed.type === "id" ? "id" : "forHandle"]: parsed.value }); const data = await fetchYoutubeJson(`https://www.googleapis.com/youtube/v3/channels?${params}`, "loading channel information"); const item = data.items?.[0]; if (!item) throw new YouTubeApiError(`YouTube channel not found for '${parsed.value}'.`, 404); return { channel_id: item.id, display_name: item.snippet?.title || "", description: item.snippet?.description || "", subscriber_count: Number(item.statistics?.subscriberCount || 0), total_views: Number(item.statistics?.viewCount || 0), video_count: Number(item.statistics?.videoCount || 0), thumbnail: item.snippet?.thumbnails?.default?.url || "", banner_url: item.brandingSettings?.image?.bannerExternalUrl || "", country: item.snippet?.country, data_source: "youtube_api" }; }
export async function getChannelVideos(channelId, count = 20) { if (!env.youtubeApiKey) return stubVideos(channelId, count); const search = new URLSearchParams({ part: "id", channelId, maxResults: String(count), order: "date", type: "video", key: env.youtubeApiKey }); const found = await fetchYoutubeJson(`https://www.googleapis.com/youtube/v3/search?${search}`, "searching channel videos"); const ids = (found.items || []).map((item) => item.id?.videoId).filter(Boolean); if (!ids.length) return []; const details = new URLSearchParams({ part: "snippet,contentDetails,statistics", id: ids.join(","), key: env.youtubeApiKey }); const data = await fetchYoutubeJson(`https://www.googleapis.com/youtube/v3/videos?${details}`, "loading video details"); return (data.items || []).map((item) => ({ external_id: item.id, title: item.snippet?.title || "", description: item.snippet?.description || "", tags: item.snippet?.tags || [], thumbnail_url: item.snippet?.thumbnails?.high?.url || "", published_at: item.snippet?.publishedAt, duration_seconds: parseDuration(item.contentDetails?.duration), views: Number(item.statistics?.viewCount || 0), likes: Number(item.statistics?.likeCount || 0), comments: Number(item.statistics?.commentCount || 0), shares: 0 })); }
function parseDuration(value = "PT0S") { const matches = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/) || []; return Number(matches[1] || 0) * 3600 + Number(matches[2] || 0) * 60 + Number(matches[3] || 0); }

