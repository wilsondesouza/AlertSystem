import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getApiUrl } from '@/config/api';

interface AlertRuleData {
    sensor_type: string;
    metric: string;
    condition: string;
    threshold_value: number | string;
    threshold_max: number | string;
    recipient_email: string;
    cooldown_minutes: number;
}

interface AlertRuleFormProps {
    onRuleCreated: () => void;
    initialData?: AlertRuleData;
    ruleId?: number;
}

export default function AlertRuleForm({ onRuleCreated, initialData, ruleId }: AlertRuleFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        sensor_type: initialData?.sensor_type || 'Sistema',
        metric: initialData?.metric || 'temperatura',
        condition: initialData?.condition || 'greater_than',
        threshold_value: initialData?.threshold_value || '',
        threshold_max: initialData?.threshold_max || '',
        recipient_email: initialData?.recipient_email || '',
        cooldown_minutes: initialData?.cooldown_minutes || 30,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = ruleId
                ? getApiUrl(`/api/alert-rules/${ruleId}`)
                : getApiUrl('/api/alert-rules');

            const method = ruleId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: ruleId ? 'Regra atualizada!' : 'Regra criada!',
                    description: ruleId
                        ? 'A regra de alerta foi atualizada com sucesso.'
                        : 'A regra de alerta foi criada com sucesso.',
                });

                if (!ruleId) {
                    setFormData({
                        sensor_type: 'Sistema',
                        metric: 'temperatura',
                        condition: 'greater_than',
                        threshold_value: '',
                        threshold_max: '',
                        recipient_email: '',
                        cooldown_minutes: 30,
                    });
                }

                onRuleCreated();
            } else {
                throw new Error(data.error || 'Erro ao salvar regra');
            }
        } catch (error) {
            toast({
                title: 'Erro',
                description: error instanceof Error ? error.message : 'Erro ao salvar regra',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const showMaxThreshold = formData.condition === 'between' || formData.condition === 'outside';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="sensor_type">Tipo de Sensor</Label>
                    <Input
                        id="sensor_type"
                        value={formData.sensor_type}
                        onChange={(e) => setFormData({ ...formData, sensor_type: e.target.value })}
                        placeholder="Ex: Sistema, Ambiente, etc."
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="metric">Métrica</Label>
                    <Select
                        value={formData.metric}
                        onValueChange={(value) => setFormData({ ...formData, metric: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cpu">CPU (%)</SelectItem>
                            <SelectItem value="ram">RAM (%)</SelectItem>
                            <SelectItem value="temperatura">Temperatura (°C)</SelectItem>
                            <SelectItem value="potencia">Potência (W)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="condition">Condição</Label>
                    <Select
                        value={formData.condition}
                        onValueChange={(value) => setFormData({ ...formData, condition: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="greater_than">Maior que</SelectItem>
                            <SelectItem value="less_than">Menor que</SelectItem>
                            <SelectItem value="between">Entre</SelectItem>
                            <SelectItem value="outside">Fora do intervalo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="threshold_value">
                        {showMaxThreshold ? 'Valor Mínimo' : 'Valor Limite'}
                    </Label>
                    <Input
                        id="threshold_value"
                        type="number"
                        step="0.01"
                        value={formData.threshold_value}
                        onChange={(e) => setFormData({ ...formData, threshold_value: e.target.value })}
                        placeholder="Ex: 30"
                        required
                    />
                </div>

                {showMaxThreshold && (
                    <div className="space-y-2">
                        <Label htmlFor="threshold_max">Valor Máximo</Label>
                        <Input
                            id="threshold_max"
                            type="number"
                            step="0.01"
                            value={formData.threshold_max}
                            onChange={(e) => setFormData({ ...formData, threshold_max: e.target.value })}
                            placeholder="Ex: 100"
                            required
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="recipient_email">Email do Destinatário</Label>
                    <Input
                        id="recipient_email"
                        type="email"
                        value={formData.recipient_email}
                        onChange={(e) => setFormData({ ...formData, recipient_email: e.target.value })}
                        placeholder="seu@email.com"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cooldown_minutes">Cooldown (minutos)</Label>
                    <Input
                        id="cooldown_minutes"
                        type="number"
                        min="1"
                        value={formData.cooldown_minutes}
                        onChange={(e) => setFormData({ ...formData, cooldown_minutes: parseInt(e.target.value) })}
                        placeholder="30"
                        required
                    />
                    <p className="text-xs text-slate-500">
                        Tempo mínimo entre alertas para evitar spam
                    </p>
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {ruleId ? 'Atualizar Regra' : 'Criar Regra'}
            </Button>
        </form>
    );
}