import { Card, CardContent } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#333333", "#666666"];

export const ComplianceChart = () => {
  const complianceData = [
    { name: "Taken", value: 21 },
    { name: "Missed", value: 3 },
  ];

  return (
    <Card className="card-nothing">
      <CardContent className="p-4">
        <h3 className="font-nothing mb-3 flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          MEDICATION COMPLIANCE RATE
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={complianceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {complianceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};