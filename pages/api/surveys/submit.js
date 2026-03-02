import dbConnect from "@/lib/dbConnect";
import Survey from "@/models/Survey";
import getNextSequence from "@/lib/getNextSequence";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await dbConnect();
    const seq = await getNextSequence("surveyId", "SRV-");
    
    const { surveyType, poleCode, images, location } = req.body;

    if (!surveyType || !images?.length || !location?.lat || !location?.lng) {
      return res.status(400).json({
        success: false,
        error: "ข้อมูลไม่ครบ: งานที่สำรวจ, รูปภาพ และพิกัดเป็นข้อมูลบังคับ"
      });
    }

    const newSurvey = await Survey.create({
      surveyType,
      poleCode: poleCode || '',
      images,
      location,
      surveyId: seq,
      status: 'ปักเสร็จ'
    });

    res.status(201).json({ success: true, data: newSurvey, surveyId: newSurvey.surveyId });
  } catch (error) {
    console.error("Survey submit error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}
