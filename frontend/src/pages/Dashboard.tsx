import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { FileText, AlertTriangle, MessageSquare, CheckCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Documents analysés"
            value={156}
            subtitle="Ce mois-ci"
            icon={FileText}
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title="Clauses à risque"
            value={23}
            subtitle="Nécessitent attention"
            icon={AlertTriangle}
            trend={{ value: 8, positive: false }}
          />
          <StatCard
            title="Questions chatbot"
            value={89}
            subtitle="Cette semaine"
            icon={MessageSquare}
            trend={{ value: 24, positive: true }}
          />
          <StatCard
            title="Documents conformes"
            value="94%"
            subtitle="Taux de conformité"
            icon={CheckCircle}
            trend={{ value: 3, positive: true }}
          />
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityChart />
          <RecentActivity />
        </div>
      </div>
    </AppLayout>
  );
}
