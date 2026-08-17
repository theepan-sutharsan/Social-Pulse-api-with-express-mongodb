import { defineModel, iso, now } from "./_base.js";

const ConnectedAccount = defineModel("ConnectedAccount", "connected_accounts", {
  user_id: { type: Number, required: true, index: true },
  platform: { type: String, enum: ["youtube", "instagram", "facebook", "tiktok"], required: true },
  platform_account_id: { type: String, required: true },
  display_name: { type: String, required: true },
  access_token: String,
  refresh_token: String,
  token_expires_at: Date,
  last_synced_at: Date,
  created_at: { type: Date, default: now }
});
ConnectedAccount.schema.index({ user_id: 1, platform: 1, platform_account_id: 1 }, { unique: true });
ConnectedAccount.prototype.toDict = function toDict(videoCount = 0) {
  return { id: this.id, user_id: this.user_id, platform: this.platform, platform_account_id: this.platform_account_id, display_name: this.display_name, token_expires_at: iso(this.token_expires_at), is_token_expired: this.token_expires_at ? new Date() > this.token_expires_at : false, last_synced_at: iso(this.last_synced_at), created_at: iso(this.created_at), video_count: videoCount };
};
export default ConnectedAccount;
