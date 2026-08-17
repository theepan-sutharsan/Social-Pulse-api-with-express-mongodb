import { defineModel, iso, now } from "./_base.js";

const TrackedChannel = defineModel("TrackedChannel", "tracked_channels", {
  added_by_id: { type: Number, required: true }, platform: { type: String, enum: ["youtube"], default: "youtube" }, channel_id: { type: String, required: true, unique: true }, channel_name: { type: String, required: true }, description: String, subscriber_count: { type: Number, default: 0 }, total_views: { type: Number, default: 0 }, total_videos_count: { type: Number, default: 0 }, profile_image: String, banner_url: String, country: String, keywords: String, upload_playlist_id: String, channel_created_at: Date, niche: String, created_at: { type: Date, default: now }
});
TrackedChannel.prototype.toDict = function toDict(videoCount = 0) {
  return { id: this.id, added_by_id: this.added_by_id, platform: this.platform, channel_id: this.channel_id, channel_name: this.channel_name, description: this.description, subscriber_count: this.subscriber_count || 0, total_views: this.total_views || 0, video_count: this.total_videos_count || videoCount, profile_image: this.profile_image, banner_url: this.banner_url, country: this.country, keywords: this.keywords, upload_playlist_id: this.upload_playlist_id, niche: this.niche, channel_created_at: iso(this.channel_created_at), created_at: iso(this.created_at) };
};
export default TrackedChannel;
