import { defineModel, iso, now } from "./_base.js";

const Video = defineModel("Video", "videos", {
  connected_account_id: Number, tracked_channel_id: Number, platform: { type: String, enum: ["youtube", "instagram", "facebook", "tiktok"], required: true }, external_id: { type: String, required: true }, title: String, description: String, tags: { type: [String], default: [] }, thumbnail_url: String, duration_seconds: Number, published_at: Date, fetched_at: { type: Date, default: now }
});
Video.schema.index({ platform: 1, external_id: 1 }, { unique: true });
Video.prototype.toDict = async function toDict(includeMetrics = true) {
  const value = { id: this.id, connected_account_id: this.connected_account_id ?? null, tracked_channel_id: this.tracked_channel_id ?? null, platform: this.platform, external_id: this.external_id, title: this.title, description: this.description, tags: this.tags, thumbnail_url: this.thumbnail_url, duration_seconds: this.duration_seconds, published_at: iso(this.published_at), fetched_at: iso(this.fetched_at), views: 0, likes: 0, comments: 0, shares: 0, engagement_rate: 0.0 };
  if (includeMetrics) {
    const { default: VideoMetric } = await import("./VideoMetric.js");
    const metric = await VideoMetric.findOne({ video_id: this.id }).sort({ recorded_at: -1 });
    if (metric) Object.assign(value, { views: metric.views, likes: metric.likes, comments: metric.comments, shares: metric.shares, engagement_rate: metric.engagement_rate, metric_recorded_at: iso(metric.recorded_at) });
  }
  return value;
};
export default Video;
