import React, { useState, useEffect } from 'react';
import ImageUploads from './ImageUploads';
import LocationConfirm from './LocationConfirm';
import Swal from 'sweetalert2';

const SURVEY_TYPES = ['เสาไฟฟ้า', 'โคมนวัตกรรม', 'โคมLED'];

const SurveyFormModal = ({ onClose }) => {
  const [surveyType, setSurveyType] = useState('');
  const [poleCode, setPoleCode] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [location, setLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  useEffect(() => {
    import('leaflet').then(L => {
      if (L.Icon?.Default?.prototype?._getIconUrl) {
        delete L.Icon.Default.prototype._getIconUrl;
      }
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || isUploadingImages) {
      if (isUploadingImages) {
        await Swal.fire({
          icon: 'warning',
          title: 'กรุณารอสักครู่',
          text: 'กำลังอัปโหลดรูปภาพอยู่ กรุณารอจนกว่าจะเสร็จสิ้น',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#f97316',
        });
      }
      return;
    }

    // Validation
    if (!surveyType) {
      await Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณาเลือกงานที่ต้องการสำรวจ (เสาไฟฟ้า / โคมนวัตกรรม / โคมLED)',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f97316',
      });
      return;
    }

    if (!imageUrls?.length) {
      await Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f97316',
      });
      return;
    }

    if (!location?.lat || !location?.lng) {
      await Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณาเลือกตำแหน่งที่ตั้ง (กดปุ่มใช้ตำแหน่งปัจจุบัน)',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f97316',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/surveys/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyType,
          poleCode: poleCode.trim() || '',
          images: imageUrls,
          location,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'ส่งข้อมูลไม่สำเร็จ');
      }

      await Swal.fire({
        icon: 'success',
        title: 'บันทึกงานสำรวจสำเร็จ',
        html: `เลขที่งานสำรวจของคุณคือ <strong>${data.surveyId}</strong>`,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f97316',
      });

      handleClearForm();
      onClose?.();
    } catch (err) {
      console.error('Survey submit error:', err);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.message || 'ไม่สามารถส่งข้อมูลได้',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f97316',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setSurveyType('');
    setPoleCode('');
    setImageUrls([]);
    setUseCurrentLocation(false);
    setLocation(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 overflow-y-auto flex items-center justify-center transition-all">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 opacity-0 scale-95 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-gray-800">งานสำรวจ</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 1. งานที่ต้องการสำรวจ (บังคับ) */}
          <div>
            <p className="font-semibold text-sm text-gray-700 mb-2">
              1. งานที่ต้องการสำรวจ <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {SURVEY_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`inline-flex px-3 py-2 rounded-full border whitespace-nowrap transition-all ${
                    surveyType === type
                      ? 'bg-orange-500 text-white border-none'
                      : 'bg-white text-gray-900 hover:bg-orange-300 border-gray-400'
                  }`}
                  onClick={() => setSurveyType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 2. รหัสเสาไฟ (ไม่บังคับ) */}
          <div>
            <p className="font-semibold text-sm text-gray-700 mb-2">2. รหัสเสาไฟ</p>
            <input
              type="text"
              value={poleCode}
              onChange={(e) => setPoleCode(e.target.value)}
              placeholder="ระบุรหัสเสาไฟ (ถ้ามี)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* 3. รูปภาพ (บังคับ) */}
          <div>
            <p className="font-semibold text-sm text-gray-700 mb-2">
              3. รูปภาพ <span className="text-red-500">*</span>
            </p>
            <ImageUploads
              onChange={(urls) => setImageUrls(urls)}
              onUploadingChange={setIsUploadingImages}
            />
          </div>

          {/* 4. พิกัด (บังคับ) */}
          <div>
            <p className="font-semibold text-sm text-gray-700 mb-2">
              4. พิกัด <span className="text-red-500">*</span>
            </p>
            <LocationConfirm
              useCurrent={useCurrentLocation}
              onToggle={setUseCurrentLocation}
              location={location}
              setLocation={setLocation}
            />
          </div>

          <div className="flex mb-4 gap-2 justify-end">
            <button
              type="button"
              onClick={handleClearForm}
              className="px-4 py-2 rounded-lg border-2 border-orange-400 text-orange-600 font-medium hover:bg-orange-50 transition-all"
              disabled={isSubmitting || isUploadingImages}
            >
              ล้างฟอร์ม
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isSubmitting || isUploadingImages}
            >
              {(isSubmitting || isUploadingImages) && (
                <span className="loading loading-infinity loading-xs mr-2" />
              )}
              {isUploadingImages ? 'กำลังอัปโหลดรูป...' : 'บันทึกงานสำรวจ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyFormModal;
