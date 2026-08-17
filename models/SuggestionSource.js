import { defineModel, iso, now } from "./_base.js";
const SuggestionSource = defineModel("SuggestionSource", "suggestion_sources", { suggestion_id: { type: Number, required: true }, video_id: { type: Number, required: true }, created_at: { type: Date, default: now } });
SuggestionSource.schema.index({ suggestion_id: 1, video_id: 1 }, { unique: true });
SuggestionSource.prototype.toDict = function toDict() { return { id: this.id, suggestion_id: this.suggestion_id, video_id: this.video_id, created_at: iso(this.created_at) }; };
export default SuggestionSource;
