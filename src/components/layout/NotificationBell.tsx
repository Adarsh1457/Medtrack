import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NotificationBell = () => {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-4 w-4" />
      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-600 text-[8px] text-white flex items-center justify-center">
        3
      </span>
    </Button>
  );
};