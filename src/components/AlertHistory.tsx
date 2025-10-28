import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getApiUrl } from '@/config/api';

interface AlertHistoryItem {
    id: number;
    rule_id: number;
    sensor_value: number;
    message: string;
    sent_at: string;
    email_status: string;
    sensor_type: string;
    metric: string;
    condition: string;
    threshold_value: number;
    recipient_email: string;
}

interface AlertHistoryProps {
    refreshTrigger: number;
}

export default function AlertHistory({ refreshTrigger }: AlertHistoryProps) {
    const { toast } = useToast();
    const [history, setHistory] = useState<AlertHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const response = await fetch(getApiUrl('/api/alert-history?limit=50'));
            const data = await response.json();
            if (data.success) {
                setHistory(data.data);
            }
        } catch (error) {
            toast({
                title: 'Erro',
                description: 'Erro ao carregar histórico',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [refreshTrigger]);

    const getMetricLabel = (metric: string) => {
        const labels: Record<string, string> = {
            cpu: 'CPU',
            ram: 'RAM',
            temperatura: 'Temperatura',
            potencia: 'Potência',
        };
        return labels[metric] || metric;
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                Nenhum alerta foi enviado ainda.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {history.map((item) => (
                <div
                    key={item.id}
                    className="flex gap-4 p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                >
                    <div className="flex-shrink-0">
                        {item.email_status === 'sent' ? (
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Mail className="h-5 w-5 text-green-600" />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-slate-900">
                                {item.sensor_type} - {getMetricLabel(item.metric)}
                            </h3>
                            <Badge variant={item.email_status === 'sent' ? 'default' : 'destructive'}>
                                {item.email_status === 'sent' ? 'Enviado' : 'Falhou'}
                            </Badge>
                        </div>

                        <div className="text-sm text-slate-600 space-y-1">
                            <p>
                                <span className="font-medium">Valor detectado:</span> {item.sensor_value}
                            </p>
                            <p>
                                <span className="font-medium">Destinatário:</span> {item.recipient_email}
                            </p>
                            <p>
                                <span className="font-medium">Data:</span> {formatDate(item.sent_at)}
                            </p>
                        </div>

                        <details className="text-sm">
                            <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                                Ver mensagem completa
                            </summary>
                            <pre className="mt-2 p-3 bg-slate-50 rounded text-xs whitespace-pre-wrap">
                                {item.message}
                            </pre>
                        </details>
                    </div>
                </div>
            ))}
        </div>
    );
}