import { useState, useEffect } from 'react';
import { AlertSystemSpinner } from '@/components/AlertSystemSpinner';

/**
 * Exemplo de uso do AlertSystemSpinner
 * 
 * Este componente demonstra diferentes formas de usar o spinner
 */

export const SpinnerExample = () => {
    const [showSpinner, setShowSpinner] = useState(true);

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Exemplos de Uso do Spinner</h1>

            {/* Exemplo 1: Spinner com auto-hide */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">1. Spinner com Auto-hide (3 segundos)</h2>
                <button
                    onClick={() => setShowSpinner(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                    Mostrar Spinner
                </button>

                {showSpinner && (
                    <AlertSystemSpinner
                        autoHide={true}
                        autoHideDelay={3000}
                        onHide={() => {
                            setShowSpinner(false);
                            console.log('Spinner ocultado!');
                        }}
                    />
                )}
            </section>

            {/* Exemplo 2: Código de uso básico */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">2. Como usar no seu componente</h2>
                <div className="bg-muted p-4 rounded-md">
                    <pre className="text-sm">
                        {`import { AlertSystemSpinner } from '@/components/AlertSystemSpinner';

// Uso básico (sem auto-hide)
<AlertSystemSpinner />

// Com auto-hide
<AlertSystemSpinner 
  autoHide={true}
  autoHideDelay={3000}
  onHide={() => console.log('Spinner ocultado')}
/>

// Com classe customizada
<AlertSystemSpinner 
  className="bg-black/90"
  autoHide={true}
/>`}
                    </pre>
                </div>
            </section>

            {/* Exemplo 3: Uso em App.tsx */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">3. Integração no App.tsx (Loading inicial)</h2>
                <div className="bg-muted p-4 rounded-md">
                    <pre className="text-sm">
                        {`import { AlertSystemSpinner } from '@/components/AlertSystemSpinner';
import { useState, useEffect } from 'react';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <AlertSystemSpinner />}
      
      {/* Resto do seu app */}
      <YourMainContent />
    </>
  );
};`}
                    </pre>
                </div>
            </section>
        </div>
    );
};
