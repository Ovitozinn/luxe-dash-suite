import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageCircle } from "lucide-react";
import { useAgendaData } from "@/hooks/use-agenda-data";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Agenda = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { agendamentos, loading, error } = useAgendaData();

  const handleChatClick = (whaticketConversationId: string) => {
    if (whaticketConversationId) {
      const chatUrl = `https://whaticket.com/conversations/${whaticketConversationId}`;
      window.open(chatUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
      <DashboardSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Agenda de Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-muted-foreground">Carregando agendamentos...</div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-destructive">Erro ao carregar agendamentos: {error}</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-muted-foreground">Nome do Cliente</TableHead>
                          <TableHead className="text-muted-foreground">Telefone</TableHead>
                          <TableHead className="text-muted-foreground">Data e Hora</TableHead>
                          <TableHead className="text-muted-foreground text-center">Ação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {agendamentos.map((agendamento) => (
                          <TableRow key={agendamento.id}>
                            <TableCell className="text-foreground font-medium">
                              {agendamento.clientes?.nome || 'Nome não informado'}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {agendamento.clientes?.telefone || 'Telefone não informado'}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {agendamento.data_hora_agendamento 
                                ? format(new Date(agendamento.data_hora_agendamento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                                : 'Data não informada'
                              }
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleChatClick(agendamento.whaticket_conversation_id || '')}
                                disabled={!agendamento.whaticket_conversation_id}
                                className="border-primary/20 hover:bg-primary/10"
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Chat
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {agendamentos.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              Nenhum agendamento encontrado
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
    </div>
  );
};

export default Agenda;