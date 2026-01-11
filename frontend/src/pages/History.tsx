import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, MessageSquare, Scale, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type ActivityType = "document" | "chat" | "analysis";

interface HistoryItem {
  id: number;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  time: string;
}

const historyItems: HistoryItem[] = [
  {
    id: 1,
    type: "document",
    title: "Contrat de prestation NDA.pdf",
    description: "Document uploadé et analysé",
    date: "2024-01-15",
    time: "14:32",
  },
  {
    id: 2,
    type: "chat",
    title: "Question sur clause de non-concurrence",
    description: "Discussion avec 5 messages",
    date: "2024-01-15",
    time: "11:20",
  },
  {
    id: 3,
    type: "analysis",
    title: "Analyse de conformité RGPD",
    description: "5 points de non-conformité détectés",
    date: "2024-01-14",
    time: "16:45",
  },
  {
    id: 4,
    type: "document",
    title: "Bail commercial 2024.pdf",
    description: "Document en attente d'analyse",
    date: "2024-01-14",
    time: "09:15",
  },
  {
    id: 5,
    type: "chat",
    title: "Résiliation anticipée de contrat",
    description: "Discussion avec 8 messages",
    date: "2024-01-13",
    time: "15:30",
  },
  {
    id: 6,
    type: "analysis",
    title: "Revue du contrat de travail CDI",
    description: "2 clauses à risque identifiées",
    date: "2024-01-12",
    time: "10:00",
  },
];

const typeConfig = {
  document: {
    icon: FileText,
    label: "Document",
    color: "text-primary bg-primary/10",
  },
  chat: {
    icon: MessageSquare,
    label: "Conversation",
    color: "text-risk-safe bg-risk-safe-bg",
  },
  analysis: {
    icon: Scale,
    label: "Analyse",
    color: "text-risk-warning bg-risk-warning-bg",
  },
};

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<ActivityType | "all">("all");

  const filteredItems = historyItems
    .filter((item) => filter === "all" || item.type === filter)
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Group by date
  const groupedItems = filteredItems.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, HistoryItem[]>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === yesterday.toDateString()) return "Hier";
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return (
    <AppLayout title="Historique">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans l'historique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Tous
            </Button>
            <Button
              variant={filter === "document" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("document")}
            >
              <FileText className="w-4 h-4 mr-1" />
              Documents
            </Button>
            <Button
              variant={filter === "chat" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("chat")}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Chats
            </Button>
            <Button
              variant={filter === "analysis" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("analysis")}
            >
              <Scale className="w-4 h-4 mr-1" />
              Analyses
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([date, items]) => (
            <div key={date} className="animate-fade-in">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatDate(date)}
              </h3>
              <div className="space-y-3">
                {items.map((item, index) => {
                  const config = typeConfig[item.type];
                  const Icon = config.icon;
                  return (
                    <div
                      key={item.id}
                      className="stat-card flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          config.color
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-muted-foreground">{item.time}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
