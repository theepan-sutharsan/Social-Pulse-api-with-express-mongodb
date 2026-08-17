import { defineModel, iso, now } from "./_base.js";

const User = defineModel("User", "users", {
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "member"], default: "member" },
  full_name: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: now }
});

User.prototype.toDict = function toDict() {
  return { id: this.id, email: this.email, role: this.role, full_name: this.full_name, is_active: this.is_active, created_at: iso(this.created_at) };
};

export default User;
