import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useContactsData } from "@/hooks/use-contacts-data";
import { Send, Users, Clock, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { subDays } from "date-fns";

const Disparos = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sendOption, setSendOption] = useState<'all' | 'no-schedule' | 'selected'>('all');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const { contacts, loading } = useContactsData();
  const { toast } = useToast();

  // Filtrar contatos que não agendaram nos últimos 30 dias
  const contactsWithoutRecentSchedule = contacts.filter(contact => {
    if (!contact.ultimo_agendamento) return true;
    const lastSchedule = new Date(contact.ultimo_agendamento);
    const thirtyDaysAgo = subDays(new Date(), 30);
    return lastSchedule < thirtyDaysAgo;
  });

  const getTargetContacts = () => {
    switch (sendOption) {
      case 'all':
        return contacts;
      case 'no-schedule':
        return contactsWithoutRecentSchedule;
      case 'selected':
        return contacts.filter(contact => selectedContacts.includes(contact.id));
      default:
        return [];
    }
  };

  const handleContactSelection = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  const handleSendMessage = () => {
    const targetContacts = getTargetContacts();
    
    if (!message.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite uma mensagem.",
        variant: "destructive",
      });
      return;
    }

    if (targetContacts.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum contato selecionado para envio.",
        variant: "destructive",
      });
      return;
    }

    // Aqui seria implementada a lógica de envio das mensagens
    toast({
      title: "Mensagens enviadas!",
      description: `${targetContacts.length} mensagem(ns) enviada(s) com sucesso.`,
    });

    // Limpar formulário
    setMessage("");
    setSelectedContacts([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
      <DashboardSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="pt-16 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Configuração da Mensagem */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Send className="h-5 w-5" />
                Disparos de Mensagens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mensagem Padrão */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">Mensagem Padrão</Label>
                <Textarea
                  id="message"
                  placeholder="Digite sua mensagem aqui..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Opções de Envio */}
              <div className="space-y-4">
                <Label className="text-foreground">Opções de Envio</Label>
                <RadioGroup value={sendOption} onValueChange={(value: 'all' | 'no-schedule' | 'selected') => setSendOption(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="text-muted-foreground cursor-pointer flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Todos os contatos ({contacts.length})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-schedule" id="no-schedule" />
                    <Label htmlFor="no-schedule" className="text-muted-foreground cursor-pointer flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Contatos que não agendaram nos últimos 30 dias ({contactsWithoutRecentSchedule.length})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="selected" id="selected" />
                    <Label htmlFor="selected" className="text-muted-foreground cursor-pointer flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Selecionar contatos manualmente ({selectedContacts.length} selecionados)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Botão de Envio */}
              <div className="flex justify-end">
                <Button onClick={handleSendMessage} className="gap-2">
                  <Send className="h-4 w-4" />
                  Enviar Mensagens ({getTargetContacts().length})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Seleção Manual de Contatos */}
          {sendOption === 'selected' && (
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Selecionar Contatos</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-muted-foreground">Carregando contatos...</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead className="text-muted-foreground">Nome</TableHead>
                          <TableHead className="text-muted-foreground">Telefone</TableHead>
                          <TableHead className="text-muted-foreground">Último Agendamento</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedContacts.includes(contact.id)}
                                onCheckedChange={(checked) => 
                                  handleContactSelection(contact.id, checked as boolean)
                                }
                              />
                            </TableCell>
                            <TableCell className="text-foreground font-medium">
                              {contact.nome || 'Nome não informado'}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {contact.telefone || 'Telefone não informado'}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {contact.ultimo_agendamento 
                                ? new Date(contact.ultimo_agendamento).toLocaleDateString('pt-BR')
                                : 'Nunca agendou'
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Disparos;