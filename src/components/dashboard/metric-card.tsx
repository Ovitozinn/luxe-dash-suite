import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  loading?: boolean;
}

export function MetricCard({ title, value, icon: Icon, loading = false }: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 group">
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'var(--gradient-card)' }}
      />
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-20" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground tracking-wide">
            {title}
          </h3>
          {loading ? (
            <div className="h-8 w-16 bg-muted/50 animate-pulse rounded" />
          ) : (
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {value.toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}