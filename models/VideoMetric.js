import { defineModel, iso, now } from "./_base.js";
const VideoMetric = defineModel("VideoMetric", "video_metrics", { video_id: { type: Number, required: true, index: true }, views: { type: Number, default: 0 }, likes: { type: Number, default: 0 }, comments: { type: Number, default: 0 }, shares: { type: Number, default: 0 }, engagement_rate: { type: Number, default: 0 }, recorded_at: { type: Date, default: now } });
VideoMetric.prototype.toDict = function toDict() { return { id: this.id, video_id: this.video_id, views: this.views, likes: this.likes, comments: this.comments, shares: this.shares, engagement_rate: this.engagement_rate, recorded_at: iso(this.recorded_at) }; };
export default VideoMetric;
