"""
Configuração do AlertSystem
"""
import os

# ========================================
# CONFIGURAÇÃO DO BANCO DE DADOS
# ========================================

# banco de dados real (RECOMENDADO)

REAL_DB_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "Diretorio", "Banco-de-Dados", "sistema.db"
)

# banco de dados local (cópia antiga - NÃO RECOMENDADO)
LOCAL_DB_PATH = os.path.join(os.path.dirname(__file__), "sistema.db")

# Usar variável de ambiente (útil para produção)
ENV_DB_PATH = os.environ.get('SISTEMA_DB_PATH')

# ========================================
# ESCOLHA QUAL BANCO DE DADOS USAR
# ========================================

# Prioridade: Variável de ambiente > Real Time > Local
if ENV_DB_PATH and os.path.exists(ENV_DB_PATH):
    DB_PATH = ENV_DB_PATH
    DB_SOURCE = "environment variable"
elif os.path.exists(REAL_DB_PATH):
    DB_PATH = REAL_DB_PATH
    DB_SOURCE = "Sistema (real-time)"
else:
    DB_PATH = LOCAL_DB_PATH
    DB_SOURCE = "local copy (WARNING: may be outdated)"

# ========================================
# CONFIGURAÇÕES DE EMAIL
# ========================================

EMAILJS_SERVICE_ID = os.environ.get('EMAILJS_SERVICE_ID', 'seu_service_id_aqui')
EMAILJS_TEMPLATE_ID = os.environ.get('EMAILJS_TEMPLATE_ID', 'seu_template_id_aqui')
EMAILJS_PUBLIC_KEY = os.environ.get('EMAILJS_PUBLIC_KEY', 'seu_public_key_aqui')
EMAILJS_PRIVATE_KEY = os.environ.get('EMAILJS_PRIVATE_KEY', 'seu_private_key_aqui')
EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send'

# ========================================
# CONFIGURAÇÕES DE MONITORAMENTO
# ========================================

# Intervalo de verificação (em segundos)
CHECK_INTERVAL = 30

# Janela de tempo para buscar leituras recentes (em minutos)
READING_WINDOW_MINUTES = 1

# ========================================
# DEBUG
# ========================================

def print_config():
    """Imprime a configuração atual do AlertSystem"""
    print("=" * 60)
    print("ALERTSYSTEM - CONFIGURAÇÃO")
    print("=" * 60)
    print(f"Banco de dados: {DB_PATH}")
    print(f"Fonte: {DB_SOURCE}")
    print(f"Arquivo existe? {os.path.exists(DB_PATH)}")
    print(f"Intervalo de verificação: {CHECK_INTERVAL}s")
    print(f"Janela de leituras: {READING_WINDOW_MINUTES} minuto(s)")
    print("=" * 60)

if __name__ == '__main__':
    print_config()
