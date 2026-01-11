import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkHealth } from "@/lib/api";

export function ApiStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");
  const [details, setDetails] = useState<{ ragReady: boolean; llmAvailable: boolean } | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const health = await checkHealth();
        setDetails({
          ragReady: health.rag_ready,
          llmAvailable: health.llm_available,
        });
        setStatus(health.rag_ready ? "connected" : "error");
      } catch (error) {
        console.error("Failed to connect to API:", error);
        setStatus("error");
      }
    };

    checkConnection();
    // Vérifier la connexion toutes les 30 secondes
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    loading: {
      icon: Loader,
      text: "Vérification...",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
    },
    connected: {
      icon: CheckCircle,
      text: "Connecté au serveur",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
    },
    error: {
      icon: XCircle,
      text: "Déconnecté",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border", config.bgColor, config.borderColor)}>
      <Icon className={cn("w-4 h-4 flex-shrink-0", config.textColor, status === "loading" && "animate-spin")} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", config.textColor)}>{config.text}</p>
        {details && (
          <div className={cn("text-xs", config.textColor, "opacity-75")}>
            RAG: {details.ragReady ? "✓" : "✗"} • LLM: {details.llmAvailable ? "✓" : "✗"}
          </div>
        )}
      </div>
    </div>
  );
}
