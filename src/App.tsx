import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { useState, useEffect } from 'react';
import { AlertSystemSpinner } from '@/components/AlertSystemSpinner';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => {
    const [showSpinner, setShowSpinner] = useState(true);

    return (
        <>
            {showSpinner && (
                <AlertSystemSpinner 
                    autoHide={true}
                    autoHideDelay={3000}
                    onHide={() => setShowSpinner(false)}
                />
            )}
            
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    <TooltipProvider>
                        <Toaster />
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<Index />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </BrowserRouter>
                    </TooltipProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </>
    );
};

export default App;
