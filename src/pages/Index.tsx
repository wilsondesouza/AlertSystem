import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AlertRuleForm from '@/components/AlertRuleForm';
import AlertRulesList from '@/components/AlertRulesList';
import AlertHistory from '@/components/AlertHistory';
import Dashboard from '@/components/Dashboard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bell, History, Settings, BarChart3 } from 'lucide-react';

export default function Index() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleRuleCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-6 max-w-7xl">
                {/* Cabeçalho com botão de tema */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Sistema de Alertas
                        </h1>
                        <p className="text-muted-foreground">
                            Monitore sensores e receba notificações em tempo real
                        </p>
                    </div>
                    <ThemeToggle />
                </div>

                <Tabs defaultValue="dashboard" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="dashboard" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Dashboard
                        </TabsTrigger>
                        <TabsTrigger value="rules" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Regras
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <History className="h-4 w-4" />
                            Histórico
                        </TabsTrigger>
                        <TabsTrigger value="create" className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            Nova Regra
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard" className="space-y-6">
                        <Dashboard refreshTrigger={refreshTrigger} />
                    </TabsContent>

                    <TabsContent value="rules" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Regras de Alerta Ativas</CardTitle>
                                <CardDescription>
                                    Gerencie suas regras de monitoramento
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AlertRulesList refreshTrigger={refreshTrigger} onRuleUpdated={handleRuleCreated} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Histórico de Alertas</CardTitle>
                                <CardDescription>
                                    Visualize todos os alertas enviados
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AlertHistory refreshTrigger={refreshTrigger} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="create" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Criar Nova Regra de Alerta</CardTitle>
                                <CardDescription>
                                    Configure as condições para receber notificações por email
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AlertRuleForm onRuleCreated={handleRuleCreated} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}