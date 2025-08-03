import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardData {
  atendimentosConcluidos: number;
  agendamentosConfirmados: number;
  followupsRealizados: number;
  loading: boolean;
  error: string | null;
}

export const useDashboardData = (): DashboardData => {
  const [data, setData] = useState<DashboardData>({
    atendimentosConcluidos: 0,
    agendamentosConfirmados: 0,
    followupsRealizados: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Buscar atendimentos concluídos
        const { count: atendimentosConcluidos, error: atendimentosError } = await supabase
          .from('agendamentos')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'concluido');

        if (atendimentosError) throw atendimentosError;

        // Buscar agendamentos confirmados
        const { count: agendamentosConfirmados, error: agendamentosError } = await supabase
          .from('agendamentos')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'agendado');

        if (agendamentosError) throw agendamentosError;

        // Buscar follow-ups realizados
        const { count: followupsRealizados, error: followupsError } = await supabase
          .from('followups')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'enviado');

        if (followupsError) throw followupsError;

        setData({
          atendimentosConcluidos: atendimentosConcluidos || 0,
          agendamentosConfirmados: agendamentosConfirmados || 0,
          followupsRealizados: followupsRealizados || 0,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        }));
      }
    };

    fetchData();
  }, []);

  return data;
};