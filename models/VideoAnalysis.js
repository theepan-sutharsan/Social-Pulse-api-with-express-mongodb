import { defineModel, iso, now } from "./_base.js";
const VideoAnalysis = defineModel("VideoAnalysis", "video_analyses", { user_id: { type: Number, required: true, index: true }, youtube_url: { type: String, required: true }, video_title: String, transcript: String, analysis_json: Object, thumbnail_analysis_json: Object, overall_score: { type: Number, default: 0 }, created_at: { type: Date, default: now } });
VideoAnalysis.prototype.toDict = function toDict() { return { id: this.id, user_id: this.user_id, youtube_url: this.youtube_url, video_title: this.video_title, transcript: this.transcript, analysis_json: this.analysis_json, thumbnail_analysis_json: this.thumbnail_analysis_json, overall_score: this.overall_score, created_at: iso(this.created_at) }; };
export default VideoAnalysis;
