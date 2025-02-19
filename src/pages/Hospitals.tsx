import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLoadScript } from "@react-google-maps/api";
import { SearchHeader } from "@/components/hospitals/SearchHeader";
import { HospitalCard } from "@/components/hospitals/HospitalCard";
import { HospitalDetail } from "@/components/hospitals/HospitalDetail";
import { useHospitalsSearch } from "@/hooks/useHospitalsSearch";
import type { Hospital } from "@/types/hospital";

const Hospitals = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchRadius, setSearchRadius] = useState(5000);
  const [facilityTypes, setFacilityTypes] = useState<string[]>(["hospital"]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyC64yN_KKggu93bt3eJtHPQUqYUO_8CPSM",
    libraries: ["places", "geometry"],
  });

  const { hospitals, loading } = useHospitalsSearch(
    userLocation,
    searchRadius,
    facilityTypes
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          toast.error("Error getting location: " + error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  }, []);

  if (loadError) {
    return <div className="font-nothing">Error loading maps</div>;
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background nothing-dots">
      <SearchHeader
        searchRadius={searchRadius}
        onRadiusChange={setSearchRadius}
        onFilterChange={setFacilityTypes}
      />
      
      <div className="container mx-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          hospitals.map((hospital) => (
            <HospitalCard
              key={hospital.place_id}
              hospital={hospital}
              userLocation={userLocation}
              onClick={() => setSelectedHospital(hospital)}
            />
          ))
        )}
      </div>

      {selectedHospital && (
        <HospitalDetail
          hospital={selectedHospital}
          onClose={() => setSelectedHospital(null)}
        />
      )}

      <div className="system-status">
        <p>SYSTEM STATUS: ONLINE</p>
        <p>BATTERY: 73% | NETWORK: STABLE</p>
      </div>
    </div>
  );
};

export default Hospitals;