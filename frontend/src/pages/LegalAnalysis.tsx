import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, AlertTriangle, ChevronRight, X } from "lucide-react";

type RiskLevel = "safe" | "warning" | "danger";

interface Clause {
  id: number;
  title: string;
  excerpt: string;
  riskLevel: RiskLevel;
  explanation: string;
  recommendation: string;
}

const clauses: Clause[] = [
  {
    id: 1,
    title: "Clause de confidentialité",
    excerpt: "Les parties s'engagent à maintenir la confidentialité des informations...",
    riskLevel: "safe",
    explanation: "Cette clause est conforme aux standards du marché et protège adéquatement les deux parties.",
    recommendation: "Aucune modification nécessaire.",
  },
  {
    id: 2,
    title: "Clause de non-concurrence",
    excerpt: "Le prestataire s'interdit, pendant une durée de 5 ans...",
    riskLevel: "danger",
    explanation: "La durée de 5 ans est excessive et pourrait être considérée comme abusive par un tribunal.",
    recommendation: "Réduire la durée à 2 ans maximum et limiter le périmètre géographique.",
  },
  {
    id: 3,
    title: "Clause de responsabilité",
    excerpt: "La responsabilité du prestataire est limitée au montant des honoraires...",
    riskLevel: "warning",
    explanation: "La limitation de responsabilité est acceptable mais pourrait être plus précise.",
    recommendation: "Préciser les cas d'exclusion (faute lourde, dol) pour plus de clarté.",
  },
  {
    id: 4,
    title: "Clause de propriété intellectuelle",
    excerpt: "Tous les droits de propriété intellectuelle sont transférés au client...",
    riskLevel: "safe",
    explanation: "Transfert de propriété clair et conforme aux attentes du contrat.",
    recommendation: "Aucune modification nécessaire.",
  },
  {
    id: 5,
    title: "Clause de résiliation",
    excerpt: "Le contrat peut être résilié sans motif avec un préavis de 7 jours...",
    riskLevel: "warning",
    explanation: "Le préavis de 7 jours est très court pour ce type de prestation.",
    recommendation: "Porter le préavis à 30 jours minimum pour permettre une transition ordonnée.",
  },
];

const riskConfig = {
  safe: {
    icon: CheckCircle,
    label: "Standard",
    className: "risk-safe",
    borderColor: "border-l-risk-safe",
  },
  warning: {
    icon: AlertTriangle,
    label: "Sensible",
    className: "risk-warning",
    borderColor: "border-l-risk-warning",
  },
  danger: {
    icon: AlertCircle,
    label: "À risque",
    className: "risk-danger",
    borderColor: "border-l-risk-danger",
  },
};

export default function LegalAnalysis() {
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [filter, setFilter] = useState<RiskLevel | "all">("all");

  const filteredClauses = filter === "all" 
    ? clauses 
    : clauses.filter((c) => c.riskLevel === filter);

  const riskCounts = {
    safe: clauses.filter((c) => c.riskLevel === "safe").length,
    warning: clauses.filter((c) => c.riskLevel === "warning").length,
    danger: clauses.filter((c) => c.riskLevel === "danger").length,
  };

  return (
    <AppLayout title="Analyse juridique">
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Clauses List */}
        <div className="flex-1 flex flex-col">
          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Tous ({clauses.length})
            </Button>
            <Button
              variant={filter === "safe" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("safe")}
              className={filter === "safe" ? "" : "text-risk-safe hover:text-risk-safe"}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Standard ({riskCounts.safe})
            </Button>
            <Button
              variant={filter === "warning" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("warning")}
              className={filter === "warning" ? "" : "text-risk-warning hover:text-risk-warning"}
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Sensible ({riskCounts.warning})
            </Button>
            <Button
              variant={filter === "danger" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("danger")}
              className={filter === "danger" ? "" : "text-risk-danger hover:text-risk-danger"}
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              À risque ({riskCounts.danger})
            </Button>
          </div>

          {/* Clauses */}
          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            {filteredClauses.map((clause, index) => {
              const config = riskConfig[clause.riskLevel];
              const Icon = config.icon;
              return (
                <div
                  key={clause.id}
                  onClick={() => setSelectedClause(clause)}
                  className={cn(
                    "stat-card border-l-4 cursor-pointer hover:shadow-md transition-all animate-fade-in",
                    config.borderColor,
                    selectedClause?.id === clause.id && "ring-2 ring-primary"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={cn("w-4 h-4", `text-risk-${clause.riskLevel}`)} />
                        <span className={cn("risk-badge", config.className)}>
                          {config.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{clause.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {clause.excerpt}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedClause && (
          <div className="w-96 stat-card animate-slide-in overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span
                className={cn(
                  "risk-badge",
                  riskConfig[selectedClause.riskLevel].className
                )}
              >
                {riskConfig[selectedClause.riskLevel].label}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedClause(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-4">
              {selectedClause.title}
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Extrait
                </h4>
                <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg italic">
                  "{selectedClause.excerpt}"
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Analyse
                </h4>
                <p className="text-sm text-foreground">
                  {selectedClause.explanation}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Recommandation
                </h4>
                <p className="text-sm text-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
                  {selectedClause.recommendation}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">
                  Voir source
                </Button>
                <Button className="flex-1">
                  Consulter un avocat
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
