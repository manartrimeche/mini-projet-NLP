import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Bell, Shield, Globe, Palette, Users, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SettingSection {
  id: string;
  icon: typeof User;
  title: string;
  description: string;
}

const sections: SettingSection[] = [
  { id: "profile", icon: User, title: "Profil", description: "Gérez vos informations personnelles" },
  { id: "notifications", icon: Bell, title: "Notifications", description: "Préférences de notification" },
  { id: "privacy", icon: Shield, title: "Confidentialité", description: "Paramètres de confidentialité des données" },
  { id: "language", icon: Globe, title: "Langue & Région", description: "Langue et format régional" },
  { id: "appearance", icon: Palette, title: "Apparence", description: "Thème et personnalisation" },
  { id: "team", icon: Users, title: "Équipe", description: "Gestion des utilisateurs" },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <AppLayout title="Paramètres">
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{section.title}</p>
                    <p className={cn(
                      "text-xs",
                      activeSection === section.id ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {section.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 stat-card overflow-y-auto animate-fade-in">
          {activeSection === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Profil</h2>
                <p className="text-sm text-muted-foreground">Gérez vos informations personnelles</p>
              </div>
              <Separator />
              <div className="grid gap-6 max-w-lg">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" defaultValue="Marie Dupont" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="marie.dupont@entreprise.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Fonction</Label>
                  <Input id="role" defaultValue="Juriste d'entreprise" />
                </div>
                <Button className="w-fit gap-2">
                  <Save className="w-4 h-4" />
                  Enregistrer
                </Button>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">Gérez vos préférences de notification</p>
              </div>
              <Separator />
              <div className="space-y-4 max-w-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nouvelles analyses</p>
                    <p className="text-sm text-muted-foreground">Être notifié lorsqu'une analyse est terminée</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertes de risque</p>
                    <p className="text-sm text-muted-foreground">Être notifié pour les clauses à risque</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappels</p>
                    <p className="text-sm text-muted-foreground">Rappels pour les documents en attente</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Newsletter</p>
                    <p className="text-sm text-muted-foreground">Actualités juridiques hebdomadaires</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          )}

          {activeSection === "privacy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Confidentialité</h2>
                <p className="text-sm text-muted-foreground">Paramètres de confidentialité des données</p>
              </div>
              <Separator />
              <div className="space-y-4 max-w-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Historique des conversations</p>
                    <p className="text-sm text-muted-foreground">Conserver l'historique des discussions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analyse anonyme</p>
                    <p className="text-sm text-muted-foreground">Contribuer à l'amélioration du service</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Partage avec l'équipe</p>
                    <p className="text-sm text-muted-foreground">Permettre le partage de documents</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          )}

          {activeSection === "language" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Langue & Région</h2>
                <p className="text-sm text-muted-foreground">Langue et format régional</p>
              </div>
              <Separator />
              <div className="grid gap-6 max-w-lg">
                <div className="grid gap-2">
                  <Label>Langue de l'interface</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Format de date</Label>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Apparence</h2>
                <p className="text-sm text-muted-foreground">Thème et personnalisation</p>
              </div>
              <Separator />
              <div className="grid gap-6 max-w-lg">
                <div className="grid gap-2">
                  <Label>Thème</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">☀️ Clair</SelectItem>
                      <SelectItem value="dark">🌙 Sombre</SelectItem>
                      <SelectItem value="system">💻 Système</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mode compact</p>
                    <p className="text-sm text-muted-foreground">Réduire l'espacement de l'interface</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          )}

          {activeSection === "team" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Gestion de l'équipe</h2>
                <p className="text-sm text-muted-foreground">Gérez les membres de votre équipe</p>
              </div>
              <Separator />
              <div className="space-y-4">
                <Button>Inviter un membre</Button>
                <div className="space-y-3">
                  {[
                    { name: "Marie Dupont", email: "marie.dupont@entreprise.com", role: "Admin" },
                    { name: "Jean Martin", email: "jean.martin@entreprise.com", role: "Éditeur" },
                    { name: "Sophie Bernard", email: "sophie.bernard@entreprise.com", role: "Lecteur" },
                  ].map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
