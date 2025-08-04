import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Contact {
  id: string;
  nome: string;
  telefone: string;
  primeiro_atendimento: boolean;
  data_cadastro: string;
  ultimo_agendamento?: string;
}

export const useContactsData = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('clientes')
          .select(`
            id,
            nome,
            telefone,
            primeiro_atendimento,
            data_cadastro,
            agendamentos!inner(data_hora_agendamento)
          `)
          .order('data_cadastro', { ascending: false });

        if (error) {
          console.error('Erro ao buscar contatos:', error);
          setError(error.message);
          return;
        }

        // Processar dados para incluir último agendamento
        const processedContacts = data?.map(contact => ({
          id: contact.id,
          nome: contact.nome || '',
          telefone: contact.telefone || '',
          primeiro_atendimento: contact.primeiro_atendimento || false,
          data_cadastro: contact.data_cadastro || '',
          ultimo_agendamento: contact.agendamentos?.[0]?.data_hora_agendamento
        })) || [];

        setContacts(processedContacts);
      } catch (err) {
        console.error('Erro inesperado:', err);
        setError('Erro inesperado ao carregar contatos');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return { contacts, loading, error };
};