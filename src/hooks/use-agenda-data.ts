import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AgendamentoComCliente {
  id: string;
  data_hora_agendamento: string | null;
  whaticket_conversation_id: string | null;
  clientes: {
    nome: string | null;
    telefone: string | null;
  } | null;
}

interface AgendaData {
  agendamentos: AgendamentoComCliente[];
  loading: boolean;
  error: string | null;
}

export const useAgendaData = (): AgendaData => {
  const [data, setData] = useState<AgendaData>({
    agendamentos: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Primeiro buscar agendamentos
        const { data: agendamentos, error } = await supabase
          .from('agendamentos')
          .select('*')
          .eq('status', 'agendado')
          .not('data_hora_agendamento', 'is', null)
          .order('data_hora_agendamento', { ascending: true });

        if (error) {
          console.error('Erro na query agendamentos:', error);
          throw error;
        }

        // Buscar clientes para cada agendamento
        const agendamentosComClientes: AgendamentoComCliente[] = [];
        
        for (const agendamento of agendamentos || []) {
          let cliente = null;
          
          if (agendamento.cliente_id) {
            const { data: clienteData, error: clienteError } = await supabase
              .from('clientes')
              .select('nome, telefone')
              .eq('id', agendamento.cliente_id)
              .single();
              
            if (!clienteError && clienteData) {
              cliente = clienteData;
            }
          }
          
          agendamentosComClientes.push({
            id: agendamento.id,
            data_hora_agendamento: agendamento.data_hora_agendamento,
            whaticket_conversation_id: (agendamento as any).whaticket_conversation_id || null,
            clientes: cliente
          });
        }

        setData({
          agendamentos: agendamentosComClientes,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        }));
      }
    };

    fetchAgendamentos();
  }, []);

  return data;
};