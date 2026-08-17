import { defineModel, iso, now } from "./_base.js";
const Alert = defineModel("Alert", "alerts", { user_id: { type: Number, required: true }, type: { type: String, enum: ["competitor_viral", "milestone"], required: true }, message: { type: String, required: true }, related_video_id: Number, is_read: { type: Boolean, default: false }, created_at: { type: Date, default: now } });
Alert.prototype.toDict = function toDict() { return { id: this.id, user_id: this.user_id, type: this.type, message: this.message, related_video_id: this.related_video_id ?? null, is_read: this.is_read, created_at: iso(this.created_at) }; };
export default Alert;
