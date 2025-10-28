import { AlertSystemSpinner } from '@/components/AlertSystemSpinner';

/**
 * Página de teste do Spinner
 * 
 * Para testar, adicione esta rota no App.tsx:
 * <Route path="/spinner-test" element={<SpinnerTest />} />
 * 
 * Depois acesse: http://localhost:5173/spinner-test
 */
export const SpinnerTest = () => {
  return (
    <div className="min-h-screen bg-background">
      <AlertSystemSpinner />
    </div>
  );
};

export default SpinnerTest;
