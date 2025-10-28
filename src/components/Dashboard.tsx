import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bell, CheckCircle2, TrendingUp, Activity } from 'lucide-react';
import { getApiUrl } from '@/config/api';

interface Statistics {
    total_rules: number;
    active_rules: number;
    total_alerts: number;
    alerts_today: number;
    alerts_by_sensor: Array<{ sensor_type: string; count: number }>;
}

interface DashboardProps {
    refreshTrigger: number;
}

export default function Dashboard({ refreshTrigger }: DashboardProps) {
    const { toast } = useToast();
    const [stats, setStats] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStatistics = async () => {
        try {
            const response = await fetch(getApiUrl('/api/alert-statistics'));
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            toast({
                title: 'Erro',
                description: 'Erro ao carregar estatísticas',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, [refreshTrigger]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12 text-slate-500">
                Erro ao carregar estatísticas
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Regras</CardTitle>
                        <Bell className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_rules}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            {stats.active_rules} ativas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Regras Ativas</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active_rules}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Monitorando sensores
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alertas Hoje</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.alerts_today}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Enviados nas últimas 24h
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
                        <Activity className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_alerts}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Desde o início
                        </p>
                    </CardContent>
                </Card>
            </div>

            {stats.alerts_by_sensor.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Alertas por Tipo de Sensor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.alerts_by_sensor.map((sensor) => (
                                <div key={sensor.sensor_type} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        <span className="font-medium">{sensor.sensor_type}</span>
                                    </div>
                                    <span className="text-slate-600">{sensor.count} alertas</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-blue-900">Como Funciona o Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-blue-800">
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                            1
                        </div>
                        <p>
                            <strong>Configure Regras:</strong> Defina as condições de monitoramento (temperatura, CPU, RAM, etc.)
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                            2
                        </div>
                        <p>
                            <strong>Monitoramento Contínuo:</strong> O sistema verifica os sensores a cada 30 segundos
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                            3
                        </div>
                        <p>
                            <strong>Alertas Automáticos:</strong> Quando um limite é ultrapassado, você recebe um email
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                            4
                        </div>
                        <p>
                            <strong>Cooldown Inteligente:</strong> Evita spam com intervalo mínimo entre alertas
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}