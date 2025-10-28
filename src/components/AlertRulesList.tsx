import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Loader2 } from 'lucide-react';
import { getApiUrl } from '@/config/api';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AlertRule {
    id: number;
    sensor_type: string;
    metric: string;
    condition: string;
    threshold_value: number;
    threshold_max: number | null;
    recipient_email: string;
    cooldown_minutes: number;
    is_active: number;
    created_at: string;
}

interface AlertRulesListProps {
    refreshTrigger: number;
    onRuleUpdated: () => void;
}

export default function AlertRulesList({ refreshTrigger, onRuleUpdated }: AlertRulesListProps) {
    const { toast } = useToast();
    const [rules, setRules] = useState<AlertRule[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRules = async () => {
        try {
            const response = await fetch(getApiUrl('/api/alert-rules'));
            const data = await response.json();
            if (data.success) {
                setRules(data.data);
            }
        } catch (error) {
            toast({
                title: 'Erro',
                description: 'Erro ao carregar regras',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, [refreshTrigger]);

    const handleToggle = async (ruleId: number, currentStatus: number) => {
        try {
            const response = await fetch(getApiUrl(`/api/alert-rules/${ruleId}/toggle`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: currentStatus ? 0 : 1 }),
            });

            const data = await response.json();
            if (data.success) {
                toast({
                    title: 'Status atualizado',
                    description: currentStatus ? 'Regra desativada' : 'Regra ativada',
                });
                fetchRules();
                onRuleUpdated();
            }
        } catch (error) {
            toast({
                title: 'Erro',
                description: 'Erro ao atualizar status',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (ruleId: number) => {
        try {
            const response = await fetch(getApiUrl(`/api/alert-rules/${ruleId}`), {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                toast({
                    title: 'Regra excluída',
                    description: 'A regra foi excluída com sucesso',
                });
                fetchRules();
                onRuleUpdated();
            }
        } catch (error) {
            toast({
                title: 'Erro',
                description: 'Erro ao excluir regra',
                variant: 'destructive',
            });
        }
    };

    const formatCondition = (rule: AlertRule) => {
        const conditions: Record<string, string> = {
            greater_than: `> ${rule.threshold_value}`,
            less_than: `< ${rule.threshold_value}`,
            between: `${rule.threshold_value} - ${rule.threshold_max}`,
            outside: `fora de ${rule.threshold_value} - ${rule.threshold_max}`,
        };
        return conditions[rule.condition] || rule.condition;
    };

    const getMetricLabel = (metric: string) => {
        const labels: Record<string, string> = {
            cpu: 'CPU',
            ram: 'RAM',
            temperatura: 'Temperatura',
            potencia: 'Potência',
        };
        return labels[metric] || metric;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (rules.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                Nenhuma regra cadastrada. Crie sua primeira regra na aba "Nova Regra".
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {rules.map((rule) => (
                <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                >
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-slate-900">
                                {rule.sensor_type} - {getMetricLabel(rule.metric)}
                            </h3>
                            <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                                {rule.is_active ? 'Ativa' : 'Inativa'}
                            </Badge>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                            <p>
                                <span className="font-medium">Condição:</span> {formatCondition(rule)}
                            </p>
                            <p>
                                <span className="font-medium">Email:</span> {rule.recipient_email}
                            </p>
                            <p>
                                <span className="font-medium">Cooldown:</span> {rule.cooldown_minutes} minutos
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Switch
                            checked={rule.is_active === 1}
                            onCheckedChange={() => handleToggle(rule.id, rule.is_active)}
                        />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir regra?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. A regra será permanentemente excluída.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(rule.id)} className="bg-red-600 hover:bg-red-700">
                                        Excluir
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            ))}
        </div>
    );
}