import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { askQuestion } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Bonjour ! Je suis votre assistant juridique IA. Je peux vous aider à analyser des documents, répondre à vos questions juridiques et vous guider dans vos démarches. Comment puis-je vous aider aujourd'hui ?",
  },
];

const suggestedQuestions = [
  "Quelles sont les clauses obligatoires d'un contrat de travail ?",
  "Comment résilier un bail commercial ?",
  "Quelles sont les obligations RGPD pour une PME ?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const userQuestion = input;
    setInput("");
    setIsTyping(true);

    try {
      // Appel à l'API avec le service centralisé
      const data = await askQuestion(userQuestion);

      const aiMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: data.answer,
        sources: data.sources?.map((s) => s.name) || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);
      const errorMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: `Désolé, une erreur s'est produite: ${error instanceof Error ? error.message : "Veuillez réessayer."}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <AppLayout title="Chatbot légal">
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
              )}

              <div className={cn("chat-bubble", message.role === "user" ? "chat-bubble-user" : "chat-bubble-ai")}>
                <div className={cn(
                  "text-sm prose prose-sm max-w-none dark:prose-invert",
                  "prose-p:leading-relaxed prose-pre:bg-muted prose-pre:p-2 prose-pre:rounded-lg",
                  "prose-headings:text-foreground prose-headings:font-semibold prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0",
                  "prose-ul:list-disc prose-ul:pl-4 prose-li:mb-1"
                )}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>

              </div>

              {message.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="chat-bubble chat-bubble-ai">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Questions suggérées
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors text-foreground"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="pt-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question juridique..."
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Les réponses de l'IA sont indicatives et ne remplacent pas un avis juridique professionnel.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
