import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function LocationPickerModal({
  initialLocation,
  onConfirm,
  onCancel,
}) {
  const [location, setLocation] = useState(
    initialLocation || { lat: 18.7, lng: 98.9 },
  );

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

  function LocationSelector() {
    useMapEvents({
      click(e) {
        setLocation(e.latlng);
      },
    });
    return null;
  }

  return (
    <div className="w-full h-full relative">
      <p className="text-center mt-2 text-sm text-gray-700">
        พิกัดใหม่📍 {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
      </p>
      <div className="card p-4 mb-4 relative" style={{ paddingBottom: "4rem" }}>
        <div className="w-full">
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
          >
            <LayersControl position="topright">
              {/* แผนที่ถนน */}
              <LayersControl.BaseLayer name="แผนที่ถนน">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
              </LayersControl.BaseLayer>

              {/* Google ดาวเทียม + ถนน */}
              <LayersControl.BaseLayer checked name="แผนที่ดาวเทียม">
                <TileLayer
                  url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                  subdomains={["mt0", "mt1", "mt2", "mt3"]}
                  attribution="&copy; Google"
                  maxZoom={20}
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                พิกัดใหม่: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
              </Popup>
            </Marker>
            <LocationSelector />
          </MapContainer>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onCancel} className="btn btn-secondary">
          ยกเลิก
        </button>
        <button
          onClick={() => {
            onConfirm(location);
            alert("✅ แก้ไขพิกัดสำเร็จแล้ว");
          }}
          className="btn btn-success"
        >
          บันทึกพิกัด
        </button>
      </div>
    </div>
  );
}

LocationPickerModal.propTypes = {
  initialLocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
