import mongoose from 'mongoose';

const SurveySchema = new mongoose.Schema({
  surveyType: { type: String, required: true }, // เสาไฟฟ้า | โคมนวัตกรรม | โคมLED
  poleCode: { type: String, default: '' },      // รหัสเสาไฟ (ไม่บังคับ)
  images: { type: [String], default: [] },      // รูปภาพ (บังคับ)
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  surveyId: { type: String, required: true },    // เลขที่งานสำรวจ
  status: { type: String, default: 'ปักเสร็จ' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'surveys',
  timestamps: true
});

export default mongoose.models.Survey || mongoose.model('Survey', SurveySchema);
