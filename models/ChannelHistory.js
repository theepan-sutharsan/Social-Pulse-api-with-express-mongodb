import { defineModel, iso, now } from "./_base.js";
const ChannelHistory = defineModel("ChannelHistory", "channel_history", { channel_id: { type: String, required: true, index: true }, subscribers: { type: Number, default: 0 }, total_views: { type: Number, default: 0 }, total_videos: { type: Number, default: 0 }, recorded_at: { type: Date, default: now }, created_at: { type: Date, default: now } });
ChannelHistory.prototype.toDict = function toDict() { return { id: this.id, channel_id: this.channel_id, subscribers: this.subscribers, total_views: this.total_views, total_videos: this.total_videos, date: this.recorded_at?.toISOString().slice(0, 10), recorded_at: iso(this.recorded_at), created_at: iso(this.created_at) }; };
export default ChannelHistory;
