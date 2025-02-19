import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, X } from "lucide-react";

interface HospitalDetailProps {
  hospital: Hospital;
  onClose: () => void;
}

interface Hospital {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: google.maps.LatLng;
  };
  opening_hours?: {
    open_now: boolean;
  };
  rating?: number;
  formatted_phone_number?: string;
}

export const HospitalDetail = ({ hospital, onClose }: HospitalDetailProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container max-w-lg mx-auto h-full p-4 flex flex-col">
        <Card className="flex-1 overflow-hidden">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle>{hospital.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[200px] relative">
              <GoogleMap
                mapContainerClassName="w-full h-full"
                center={{
                  lat: hospital.geometry.location.lat(),
                  lng: hospital.geometry.location.lng(),
                }}
                zoom={15}
              >
                <Marker
                  position={{
                    lat: hospital.geometry.location.lat(),
                    lng: hospital.geometry.location.lng(),
                  }}
                />
              </GoogleMap>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {hospital.vicinity}
                </p>
                {hospital.formatted_phone_number && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {hospital.formatted_phone_number}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {hospital.opening_hours?.open_now ? "Open now" : "Closed"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};