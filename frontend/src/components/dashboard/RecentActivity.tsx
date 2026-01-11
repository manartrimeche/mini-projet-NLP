import { FileText, Scale, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "document",
    title: "Contrat de prestation NDA.pdf",
    description: "Analysé avec 2 clauses à risque",
    time: "Il y a 10 min",
    icon: FileText,
  },
  {
    id: 2,
    type: "analysis",
    title: "Analyse de conformité RGPD",
    description: "5 points de non-conformité détectés",
    time: "Il y a 32 min",
    icon: Scale,
  },
  {
    id: 3,
    type: "chat",
    title: "Question sur clause de non-concurrence",
    description: "Réponse générée avec sources",
    time: "Il y a 1h",
    icon: MessageSquare,
  },
  {
    id: 4,
    type: "document",
    title: "Bail commercial 2024.docx",
    description: "Upload réussi, en attente d'analyse",
    time: "Il y a 2h",
    icon: FileText,
  },
];

export function RecentActivity() {
  return (
    <div className="stat-card animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Activité récente
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                activity.type === "document" && "bg-primary/10 text-primary",
                activity.type === "analysis" && "bg-risk-warning-bg text-risk-warning",
                activity.type === "chat" && "bg-risk-safe-bg text-risk-safe"
              )}
            >
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activity.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
