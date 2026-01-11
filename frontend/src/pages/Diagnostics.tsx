import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { runDiagnostics, DiagnosticResult } from "@/lib/diagnostics";
import { cn } from "@/lib/utils";

export default function Diagnostics() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    try {
      const diagnostics = await runDiagnostics();
      setResult(diagnostics);
    } catch (error) {
      console.error("Erreur lors du diagnostic:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <AppLayout title="Diagnostics">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Diagnostics du Système</h2>
            <p className="text-muted-foreground">Vérifiez la connexion Frontend-Backend</p>
          </div>
          <Button onClick={runTests} disabled={loading} variant="default">
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            {loading ? "Vérification..." : "Tester à nouveau"}
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <StatusCard
                title="API"
                status={result.apiConnected}
                icon={result.apiConnected ? CheckCircle : XCircle}
              />
              <StatusCard
                title="RAG"
                status={result.ragReady}
                icon={result.ragReady ? CheckCircle : AlertCircle}
              />
              <StatusCard
                title="LLM"
                status={result.llmAvailable}
                icon={result.llmAvailable ? CheckCircle : AlertCircle}
              />
              <StatusCard
                title="Test Query"
                status={result.testQuery.success}
                icon={result.testQuery.success ? CheckCircle : XCircle}
              />
            </div>

            {/* Details */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Détails</h3>
              <ul className="space-y-2">
                {result.details.map((detail, index) => (
                  <li key={index} className="text-sm font-mono text-muted-foreground">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-muted-foreground text-right">
              Dernier test: {new Date(result.timestamp).toLocaleString()}
            </div>

            {/* Recommendations */}
            {!result.apiConnected && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-destructive mb-1">API non accessible</p>
                  <p className="text-destructive/90">
                    Vérifiez que le serveur backend fonctionne sur http://localhost:8000
                  </p>
                </div>
              </div>
            )}

            {!result.ragReady && result.apiConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-700 mb-1">RAG non initialisé</p>
                  <p className="text-yellow-700/90">
                    Le système RAG est en cours de démarrage. Veuillez patienter quelques instants.
                  </p>
                </div>
              </div>
            )}

            {result.apiConnected && result.ragReady && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-green-700 mb-1">Système opérationnel</p>
                  <p className="text-green-700/90">
                    Le frontend et le backend sont correctement connectés. Vous pouvez utiliser l'application.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

interface StatusCardProps {
  title: string;
  status: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

function StatusCard({ title, status, icon: Icon }: StatusCardProps) {
  return (
    <div className={cn(
      "border rounded-lg p-4 flex items-center gap-3",
      status ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
    )}>
      <Icon className={cn("w-6 h-6", status ? "text-green-700" : "text-red-700")} />
      <div>
        <p className={cn("text-sm font-semibold", status ? "text-green-700" : "text-red-700")}>
          {title}
        </p>
        <p className={cn("text-xs", status ? "text-green-600" : "text-red-600")}>
          {status ? "Opérationnel" : "Erreur"}
        </p>
      </div>
    </div>
  );
}
