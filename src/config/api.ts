// Configuração da URL base da API
// Em produção (Orange Pi), como o Flask serve tanto o frontend quanto o backend,
// podemos usar URLs relativas (sem especificar host/porta)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (endpoint: string): string => {
    // Remove a barra inicial se existir para evitar duplicação
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Se API_BASE_URL estiver vazio, usa URL relativa (produção)
    // Se estiver definido, usa a URL completa (desenvolvimento)
    return `${API_BASE_URL}${cleanEndpoint}`;
};

export default API_BASE_URL;
