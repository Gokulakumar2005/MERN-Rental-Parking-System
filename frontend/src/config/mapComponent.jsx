import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Routing = ({ from, to }) => {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!map || !from || !to) return;

    if (routingRef.current) {
      map.removeControl(routingRef.current);
      routingRef.current = null;
    }

    routingRef.current = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng),
      ],
      lineOptions: {
        styles: [{ color: "blue", weight: 5 }],
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
    }).addTo(map);

    return () => {
      if (routingRef.current) {
        map.removeControl(routingRef.current);
      }
    };
  }, [map, from, to]);

  return null;
};


export default function MyMap({location}) {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);

  // Get destination from navigation state
  // console.log({"location in  map Container":location.state.location.geo})
  // const { lat, lng } = location.state.location.geo || {};
  // console.log({"lat and lng ":lat,lng});
  // const destination = lat && lng ? { lat, lng } : null;
  const destination = location || null;
  

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Location error:", error);
      }
    );
  }, []);

  if (!currentLocation) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading map...
      </div>
    );
  }
  if (!destination) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-10">
        <p className="text-red-500 font-semibold">
          No destination provided.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
   <div className="relative h-screen w-full">
  {/* <button
    onClick={() => navigate(-1)}
    className="absolute top-4 right-4 z-[9999] bg-blue-600 px-6 py-2 rounded-xl shadow-lg hover:bg-red-100 transition"
  >
    ← Back
  </button> */}

      <MapContainer
        center={[currentLocation.lat, currentLocation.lng]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Current Location */}
        <Marker position={[currentLocation.lat, currentLocation.lng]}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* Destination */}
        <Marker position={[destination.lat, destination.lng]}>
          <Popup>Destination</Popup>
        </Marker>

        {/* Routing */}
        <Routing from={currentLocation} to={destination} />
      </MapContainer>
    </div>
  );
}