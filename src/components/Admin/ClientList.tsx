import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, Button } from '../ui';
import type { Client } from '../../lib/types';
import { Plus, Mail, CheckCircle, Clock, ChevronRight, Users } from 'lucide-react';

interface ClientListProps {
  onCreateClient: () => void;
  onSelectClient: (client: Client) => void;
}

export function ClientList({ onCreateClient, onSelectClient }: ClientListProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setClients(data);
    }
    setLoading(false);
  };

  const getStatusBadge = (client: Client) => {
    if (client.user_id) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs">
          <CheckCircle className="w-3 h-3" />
          Active
        </span>
      );
    }
    if (client.invite_sent_at) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta text-xs">
          <Mail className="w-3 h-3" />
          Invited
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ink/10 text-slate text-xs">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-6 bg-ink/10 rounded w-1/3 mb-2" />
            <div className="h-4 bg-ink/10 rounded w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <Card variant="bordered" className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sunset/10 flex items-center justify-center">
          <Users className="w-8 h-8 text-sunset" />
        </div>
        <h3 className="text-xl mb-2">No clients yet</h3>
        <p className="text-slate mb-6">Create your first client to get started.</p>
        <Button onClick={onCreateClient}>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl">Clients ({clients.length})</h2>
        <Button onClick={onCreateClient}>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {clients.map((client) => (
        <Card
          key={client.id}
          variant="bordered"
          className="cursor-pointer hover:border-sunset/50 transition-colors group"
          onClick={() => onSelectClient(client)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-medium text-ink" style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: '19px' }}>{client.name}</h3>
                {getStatusBadge(client)}
              </div>
              <p className="text-sm text-slate">
                {client.email}
                {client.company && ` • ${client.company}`}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-ink/30 group-hover:text-sunset transition-colors" />
          </div>
        </Card>
      ))}
    </div>
  );
}

