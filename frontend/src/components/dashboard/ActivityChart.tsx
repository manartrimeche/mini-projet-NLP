import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Lun", documents: 12, analyses: 8 },
  { name: "Mar", documents: 19, analyses: 14 },
  { name: "Mer", documents: 15, analyses: 11 },
  { name: "Jeu", documents: 22, analyses: 18 },
  { name: "Ven", documents: 18, analyses: 13 },
  { name: "Sam", documents: 5, analyses: 3 },
  { name: "Dim", documents: 2, analyses: 1 },
];

export function ActivityChart() {
  return (
    <div className="stat-card h-80 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Activité hebdomadaire
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Bar
            dataKey="documents"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            name="Documents"
          />
          <Bar
            dataKey="analyses"
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
            name="Analyses"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
