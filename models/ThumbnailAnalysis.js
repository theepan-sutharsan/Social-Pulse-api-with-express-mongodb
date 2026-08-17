import { defineModel, iso, now } from "./_base.js";
const ThumbnailAnalysis = defineModel("ThumbnailAnalysis", "thumbnail_analyses", { video_id: { type: Number, required: true, unique: true }, dominant_colors: Object, has_text: Boolean, face_count: { type: Number, default: 0 }, composition_notes: String, score: Number, created_at: { type: Date, default: now } });
ThumbnailAnalysis.prototype.toDict = function toDict() { return { id: this.id, video_id: this.video_id, dominant_colors: this.dominant_colors, has_text: this.has_text, face_count: this.face_count, composition_notes: this.composition_notes, score: this.score, created_at: iso(this.created_at) }; };
export default ThumbnailAnalysis;
