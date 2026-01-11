import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Search, FileText, MoreVertical, Eye, Download, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const documents = [
  {
    id: 1,
    name: "Contrat de prestation NDA.pdf",
    type: "Contrat",
    date: "2024-01-15",
    status: "analyzed",
  },
  {
    id: 2,
    name: "Politique RGPD v2.docx",
    type: "Politique interne",
    date: "2024-01-14",
    status: "analyzed",
  },
  {
    id: 3,
    name: "Bail commercial 2024.pdf",
    type: "Contrat",
    date: "2024-01-13",
    status: "pending",
  },
  {
    id: 4,
    name: "CGV Entreprise.pdf",
    type: "Conditions générales",
    date: "2024-01-12",
    status: "analyzed",
  },
  {
    id: 5,
    name: "Accord de confidentialité.docx",
    type: "Contrat",
    date: "2024-01-11",
    status: "pending",
  },
];

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout title="Documents">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="gap-2">
            <Upload className="w-4 h-4" />
            Importer un document
          </Button>
        </div>

        {/* Documents Table */}
        <div className="stat-card p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Nom du fichier</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Date d'upload</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc, index) => (
                <TableRow
                  key={doc.id}
                  className="animate-fade-in cursor-pointer hover:bg-muted/30"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{doc.type}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(doc.date).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "risk-badge",
                        doc.status === "analyzed" ? "risk-safe" : "risk-warning"
                      )}
                    >
                      {doc.status === "analyzed" ? "Analysé" : "En attente"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="w-4 h-4" /> Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Download className="w-4 h-4" /> Télécharger
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="w-4 h-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
