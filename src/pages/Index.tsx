import { useState } from 'react';
import { CheckCircle, Calendar, Send } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { MetricCard } from '@/components/dashboard/metric-card';
import { useDashboardData } from '@/hooks/use-dashboard-data';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { atendimentosConcluidos, agendamentosConfirmados, followupsRealizados, loading, error } = useDashboardData();

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">Erro ao carregar dados</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMenuClick={handleMenuClick} />
      <DashboardSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Atendimentos Concluídos */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 tracking-wide">
                Atendimentos
              </h2>
              <MetricCard
                title="Atendimentos Concluídos"
                value={atendimentosConcluidos}
                icon={CheckCircle}
                loading={loading}
              />
            </div>

            {/* Agendamentos Confirmados */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 tracking-wide">
                Agendamentos
              </h2>
              <MetricCard
                title="Agendamentos Confirmados"
                value={agendamentosConfirmados}
                icon={Calendar}
                loading={loading}
              />
            </div>

            {/* Follow-ups Realizados */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 tracking-wide">
                Follow-ups
              </h2>
              <MetricCard
                title="Follow-ups Realizados"
                value={followupsRealizados}
                icon={Send}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
