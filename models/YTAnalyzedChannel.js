import { defineModel, iso, now } from "./_base.js";
const YTAnalyzedChannel = defineModel("YTAnalyzedChannel", "yt_analyzed_channels", { user_id: { type: Number, required: true, index: true }, channel_id: { type: String, required: true }, channel_handle: String, channel_title: String, subscriber_count: { type: Number, default: 0 }, thumbnail_url: String, last_analyzed_at: Date, created_at: { type: Date, default: now } });
YTAnalyzedChannel.schema.index({ user_id: 1, channel_id: 1 }, { unique: true });
YTAnalyzedChannel.prototype.toDict = function toDict() { return { id: this.id, user_id: this.user_id, channel_id: this.channel_id, channel_handle: this.channel_handle, channel_title: this.channel_title, subscriber_count: this.subscriber_count || 0, thumbnail_url: this.thumbnail_url, last_analyzed_at: iso(this.last_analyzed_at), created_at: iso(this.created_at) }; };
export default YTAnalyzedChannel;
