import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageCircle, List, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useAgendaData } from "@/hooks/use-agenda-data";
import { format, addDays, subDays, startOfDay, endOfDay, addWeeks, subWeeks, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

const Agenda = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'agenda' | 'list'>('agenda');
  const [agendaMode, setAgendaMode] = useState<'daily' | 'weekly'>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calcular datas de início e fim baseado no modo
  const getDateRange = () => {
    if (viewMode === 'list') {
      return { startDate: undefined, endDate: undefined };
    }
    
    if (agendaMode === 'daily') {
      return {
        startDate: startOfDay(currentDate),
        endDate: endOfDay(currentDate)
      };
    } else {
      return {
        startDate: startOfWeek(currentDate, { locale: ptBR }),
        endDate: endOfWeek(currentDate, { locale: ptBR })
      };
    }
  };

  const { startDate, endDate } = getDateRange();
  const { agendamentos, loading, error } = useAgendaData(startDate, endDate);

  const handleChatClick = (whaticketConversationId: string) => {
    if (whaticketConversationId) {
      const chatUrl = `https://whaticket.com/conversations/${whaticketConversationId}`;
      window.open(chatUrl, '_blank');
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (agendaMode === 'daily') {
      setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1));
    } else {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDateTitle = () => {
    if (agendaMode === 'daily') {
      return format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } else {
      const start = startOfWeek(currentDate, { locale: ptBR });
      const end = endOfWeek(currentDate, { locale: ptBR });
      return `${format(start, "dd/MM", { locale: ptBR })} - ${format(end, "dd/MM/yyyy", { locale: ptBR })}`;
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-foreground">Agenda de Agendamentos</CardTitle>
                  
                  {/* Controles de Visualização */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'agenda' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('agenda')}
                      className="gap-2"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      Agenda
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="gap-2"
                    >
                      <List className="h-4 w-4" />
                      Lista
                    </Button>
                  </div>
                </div>

                {/* Controles de Navegação - apenas no modo agenda */}
                {viewMode === 'agenda' && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-border/20">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={agendaMode === 'daily' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAgendaMode('daily')}
                      >
                        Diário
                      </Button>
                      <Button
                        variant={agendaMode === 'weekly' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAgendaMode('weekly')}
                      >
                        Semanal
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateDate('prev')}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="text-sm font-medium text-foreground min-w-[200px] text-center">
                        {getDateTitle()}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateDate('next')}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToToday}
                      >
                        Hoje
                      </Button>
                    </div>
                  </div>
                )}
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