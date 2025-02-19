import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddMedicationForm } from "@/components/reminders/AddMedicationForm";
import { WeeklyOverview } from "@/components/reminders/WeeklyOverview";
import { ComplianceChart } from "@/components/reminders/ComplianceChart";
import { useMedications } from "@/hooks/useMedications";
import { Card, CardContent } from "@/components/ui/card";

const Reminders = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { data: medications, isLoading } = useMedications();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-nothing">REMINDERS</h1>
        <Button onClick={() => setShowAddForm(true)} className="button-nothing gap-2">
          <Plus className="h-4 w-4" />
          ADD MEDICATION
        </Button>
      </div>

      {showAddForm && <AddMedicationForm onClose={() => setShowAddForm(false)} />}

      <WeeklyOverview />
      <ComplianceChart />

      <Card className="card-nothing">
        <CardContent className="p-4">
          <h3 className="font-nothing mb-3">ACTIVE MEDICATIONS</h3>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading medications...</p>
          ) : medications && medications.length > 0 ? (
            <div className="space-y-3">
              {medications.map((medication) => (
                <div
                  key={medication.id}
                  className="p-3 bg-accent/5 rounded-lg space-y-1 nothing-glow"
                >
                  <p className="font-nothing">{medication.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {medication.timings.join(", ")}
                  </p>
                  {medication.remarks && (
                    <p className="text-xs text-muted-foreground">{medication.remarks}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No active medications</p>
          )}
        </CardContent>
      </Card>

      <div className="system-status">
        <p>SYSTEM STATUS: ONLINE</p>
        <p>BATTERY: 73% | NETWORK: STABLE</p>
      </div>
    </div>
  );
};

export default Reminders;