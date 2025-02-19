import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Hospital, FacilityType } from "@/types/hospital";

export const useHospitalsSearch = (
  userLocation: { lat: number; lng: number } | null,
  searchRadius: number,
  facilityTypes: string[]
) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);

  const searchNearbyHospitals = useCallback(async () => {
    if (!userLocation || !window.google) return;

    setLoading(true);
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request = {
      location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: searchRadius,
      type: facilityTypes[0] as FacilityType,
    };

    service.nearbySearch(request, (results, status) => {
      setLoading(false);
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const processResults = results.map((place) => {
          // Get detailed place information
          return new Promise<Hospital>((resolve) => {
            service.getDetails(
              { placeId: place.place_id!, fields: ["opening_hours", "formatted_phone_number"] },
              (detailedPlace, detailedStatus) => {
                if (detailedStatus === google.maps.places.PlacesServiceStatus.OK) {
                  resolve({
                    place_id: place.place_id!,
                    name: place.name!,
                    vicinity: place.vicinity!,
                    geometry: {
                      location: place.geometry!.location,
                    },
                    opening_hours: {
                      open_now: detailedPlace?.opening_hours?.isOpen() ?? false,
                    },
                    rating: place.rating,
                    formatted_phone_number: detailedPlace?.formatted_phone_number,
                  });
                } else {
                  resolve({
                    place_id: place.place_id!,
                    name: place.name!,
                    vicinity: place.vicinity!,
                    geometry: {
                      location: place.geometry!.location,
                    },
                    opening_hours: {
                      open_now: false,
                    },
                    rating: place.rating,
                  });
                }
              }
            );
          });
        });

        Promise.all(processResults).then(setHospitals);
      } else {
        toast.error("Error finding nearby hospitals");
      }
    });
  }, [userLocation, searchRadius, facilityTypes]);

  useEffect(() => {
    if (userLocation) {
      searchNearbyHospitals();
    }
  }, [userLocation, searchNearbyHospitals]);

  return { hospitals, loading };
};