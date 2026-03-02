import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function MapDisplay({ lat, lng, showPopup = false, onLocationChange, draggable = true }) {
  const defaultPosition = [16.687, 100.092];
  const [position, setPosition] = useState(
    lat != null && lng != null ? [lat, lng] : defaultPosition,
  );

  useEffect(() => {
    if (lat != null && lng != null) {
      setPosition([lat, lng]);
    }
  }, [lat, lng]);

  const updatePosition = (newLat, newLng) => {
    setPosition([newLat, newLng]);
    onLocationChange?.({ lat: newLat, lng: newLng });
  };

  return (
    <MapContainer
      center={position}
      zoom={17}
      style={{ height: "100%", width: "100%" }}
    >
      <ClickHandler
        onClick={(latlng) => updatePosition(latlng.lat, latlng.lng)}
      />

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

      {position ? (
        <Marker
          position={position}
          draggable={draggable}
          eventHandlers={
            draggable
              ? {
                  dragend: (e) => {
                    const pos = e.target.getLatLng();
                    updatePosition(pos.lat, pos.lng);
                  },
                }
              : undefined
          }
        >
          {showPopup ? (
            <Popup>
              <div>
                <div>📍 ตำแหน่งของคุณ</div>
                {draggable ? (
                  <div className="text-xs text-gray-500 mt-1">
                    ลากหมุดเพื่อปรับตำแหน่ง หรือคลิกบนแผนที่
                  </div>
                ) : null}
                <div className="mt-1">
                  ละติจูด: {position[0].toFixed(6)}
                  <br />
                  ลองจิจูด: {position[1].toFixed(6)}
                </div>
              </div>
            </Popup>
          ) : null}
        </Marker>
      ) : null}
    </MapContainer>
  );
}
