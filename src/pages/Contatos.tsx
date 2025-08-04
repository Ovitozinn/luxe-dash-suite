import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useContactsData } from "@/hooks/use-contacts-data";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Contatos = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { contacts, loading, error } = useContactsData();

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
              <CardTitle className="text-foreground">Lista de Contatos</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground">Carregando contatos...</div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-destructive">Erro ao carregar contatos: {error}</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-muted-foreground">Nome</TableHead>
                        <TableHead className="text-muted-foreground">Telefone</TableHead>
                        <TableHead className="text-muted-foreground">Data Cadastro</TableHead>
                        <TableHead className="text-muted-foreground">Último Agendamento</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="text-foreground font-medium">
                            {contact.nome || 'Nome não informado'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {contact.telefone || 'Telefone não informado'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {contact.data_cadastro 
                              ? format(new Date(contact.data_cadastro), "dd/MM/yyyy", { locale: ptBR })
                              : 'Data não informada'
                            }
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {contact.ultimo_agendamento 
                              ? format(new Date(contact.ultimo_agendamento), "dd/MM/yyyy", { locale: ptBR })
                              : 'Nunca agendou'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant={contact.primeiro_atendimento ? "default" : "secondary"}>
                              {contact.primeiro_atendimento ? "Cliente" : "Prospect"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {contacts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            Nenhum contato encontrado
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

export default Contatos;