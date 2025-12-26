import mongoose from "mongoose";

const SatisfactionSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    // โปรเจกต์นี้ใช้โมเดล/คอลเลกชันร้องเรียนหลักเป็น SubmittedReport
    ref: "SubmittedReport",
    required: true,
  },
  attempt: {
    // ลำดับครั้งที่ประเมินของเรื่องนั้นๆ (1..4)
    type: Number,
    default: 1,
    min: 1,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: "",
  },
}, {
  timestamps: { createdAt: true, updatedAt: true }
});

export default mongoose.models.Satisfaction || mongoose.model("Satisfaction", SatisfactionSchema);