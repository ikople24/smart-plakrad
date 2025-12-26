import dbConnect from "@/lib/dbConnect";
import Satisfaction from "@/models/Satisfaction";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { complaintId, rating, comment } = req.body;

  if (!complaintId || !mongoose.Types.ObjectId.isValid(complaintId)) {
    return res.status(400).json({ success: false, message: "Invalid complaintId" });
  }

  const numericRating = Number(rating);
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ success: false, message: "Invalid rating (1-5)" });
  }

  if (!comment || !String(comment).trim()) {
    return res.status(400).json({ success: false, message: "Missing comment" });
  }

  // จำกัดการประเมินต่อ 1 เรื่อง ไม่เกิน 4 ครั้ง
  const currentCount = await Satisfaction.countDocuments({ complaintId });
  if (currentCount >= 4) {
    return res.status(409).json({ success: false, message: "ประเมินครบ 4 ครั้งแล้ว", maxAttempts: 4, count: currentCount });
  }

  const attempt = currentCount + 1;

  try {
    const newSatisfaction = await Satisfaction.create({
      complaintId,
      attempt,
      rating: numericRating,
      comment: String(comment).trim(),
    });

    return res.status(201).json({ success: true, data: newSatisfaction });
  } catch (error) {
    console.error("Error saving satisfaction:", error);
    return res.status(500).json({ message: "Server error" });
  }
}