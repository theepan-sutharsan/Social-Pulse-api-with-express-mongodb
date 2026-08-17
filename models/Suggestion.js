import { defineModel, iso, now } from "./_base.js";
export const SUGGESTION_TYPES = ["title", "caption", "hook", "hashtag", "thumbnail_concept", "posting_time", "content_calendar"];
const Suggestion = defineModel("Suggestion", "suggestions", { user_id: { type: Number, required: true, index: true }, connected_account_id: Number, tracked_channel_id: Number, type: { type: String, enum: SUGGESTION_TYPES, required: true }, input_context: String, output: mongooseMixed(), created_at: { type: Date, default: now } });
Suggestion.prototype.toDict = function toDict(sourceCount = 0) { return { id: this.id, user_id: this.user_id, connected_account_id: this.connected_account_id ?? null, tracked_channel_id: this.tracked_channel_id ?? null, type: this.type, input_context: this.input_context, output: this.output, source_count: sourceCount, created_at: iso(this.created_at) }; };
function mongooseMixed() { return { type: Object, default: null }; }
export default Suggestion;
