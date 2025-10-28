"""
Script de Teste da Integração AlertSystem <-> SmartLume

Este script verifica se a integração entre o AlertSystem e o banco de dados
real do SmartLume está funcionando corretamente.
"""

import os
import sys
import sqlite3
from datetime import datetime, timedelta

# Adicionar o diretório backend ao path
sys.path.insert(0, os.path.dirname(__file__))

try:
    from config import DB_PATH, DB_SOURCE, SMARTLUME_DB_PATH, LOCAL_DB_PATH
    import db_manager
except ImportError as e:
    print(f"❌ Erro ao importar módulos: {e}")
    sys.exit(1)

def print_header(text):
    """Imprime um cabeçalho formatado"""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)

def check_database_exists():
    """Verifica se o banco de dados existe"""
    print_header("1. VERIFICAÇÃO DE EXISTÊNCIA DO BANCO DE DADOS")
    
    print(f"\n📍 Caminho configurado: {DB_PATH}")
    print(f"📍 Fonte: {DB_SOURCE}")
    
    if os.path.exists(DB_PATH):
        print(f"✅ Banco de dados encontrado!")
        file_size = os.path.getsize(DB_PATH) / 1024  # KB
        mod_time = datetime.fromtimestamp(os.path.getmtime(DB_PATH))
        print(f"   Tamanho: {file_size:.2f} KB")
        print(f"   Última modificação: {mod_time}")
        return True
    else:
        print(f"❌ Banco de dados NÃO encontrado!")
        return False

def check_smartlume_path():
    """Verifica se o caminho do SmartLume está correto"""
    print_header("2. VERIFICAÇÃO DO CAMINHO DO SMARTLUME")
    
    print(f"\n📍 Caminho esperado do SmartLume: {SMARTLUME_DB_PATH}")
    
    if os.path.exists(SMARTLUME_DB_PATH):
        print(f"✅ Banco do SmartLume encontrado!")
        return True
    else:
        print(f"❌ Banco do SmartLume NÃO encontrado!")
        print(f"\n💡 Verifique se o SmartLume está na pasta correta:")
        print(f"   OrangePi/SmartLume/server/sistema.db")
        return False

def check_tables():
    """Verifica as tabelas no banco de dados"""
    print_header("3. VERIFICAÇÃO DE TABELAS")
    
    try:
        with sqlite3.connect(DB_PATH) as conn:
            c = conn.cursor()
            
            # Listar todas as tabelas
            c.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = c.fetchall()
            
            print(f"\n📊 Tabelas encontradas ({len(tables)}):")
            for table in tables:
                print(f"   ✓ {table[0]}")
            
            # Verificar tabelas essenciais
            required_tables = ['sistema_info', 'alert_rules', 'alert_history']
            missing_tables = []
            
            table_names = [t[0] for t in tables]
            for required in required_tables:
                if required not in table_names:
                    missing_tables.append(required)
            
            if missing_tables:
                print(f"\n⚠️  Tabelas faltando: {', '.join(missing_tables)}")
                if 'alert_rules' in missing_tables or 'alert_history' in missing_tables:
                    print(f"   💡 Execute: python app.py ou python alert_monitor.py")
                    print(f"      Isso criará as tabelas automaticamente.")
            else:
                print(f"\n✅ Todas as tabelas essenciais estão presentes!")
            
            return True
    except Exception as e:
        print(f"\n❌ Erro ao verificar tabelas: {e}")
        return False

def check_recent_data():
    """Verifica se há dados recentes no banco"""
    print_header("4. VERIFICAÇÃO DE DADOS RECENTES")
    
    try:
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            c = conn.cursor()
            
            # Verificar sistema_info
            c.execute("""
                SELECT COUNT(*) as total FROM sistema_info 
                WHERE timestamp >= datetime('now', '-10 minutes')
            """)
            recent_count = c.fetchone()['total']
            
            print(f"\n📈 Leituras nos últimos 10 minutos: {recent_count}")
            
            if recent_count > 0:
                print(f"✅ Há dados recentes! O SmartLume está coletando dados.")
                
                # Mostrar última leitura
                c.execute("""
                    SELECT * FROM sistema_info 
                    ORDER BY timestamp DESC LIMIT 1
                """)
                last_reading = c.fetchone()
                
                if last_reading:
                    print(f"\n📊 Última leitura:")
                    print(f"   Timestamp: {last_reading['timestamp']}")
                    print(f"   CPU: {last_reading['cpu']:.1f}%")
                    print(f"   RAM: {last_reading['ram']:.1f}%")
                    print(f"   Temperatura: {last_reading['temperatura']:.1f}°C")
                    print(f"   Potência: {last_reading['potencia']:.2f}W")
                return True
            else:
                print(f"⚠️  Não há dados recentes!")
                print(f"   💡 O SmartLume pode não estar rodando ou coletando dados.")
                
                # Verificar se há dados antigos
                c.execute("SELECT COUNT(*) as total FROM sistema_info")
                total_count = c.fetchone()['total']
                
                if total_count > 0:
                    c.execute("""
                        SELECT timestamp FROM sistema_info 
                        ORDER BY timestamp DESC LIMIT 1
                    """)
                    last = c.fetchone()
                    print(f"   Última leitura foi em: {last['timestamp']}")
                else:
                    print(f"   A tabela sistema_info está vazia.")
                
                return False
    except Exception as e:
        print(f"\n❌ Erro ao verificar dados: {e}")
        return False

def check_alert_rules():
    """Verifica as regras de alerta configuradas"""
    print_header("5. VERIFICAÇÃO DE REGRAS DE ALERTA")
    
    try:
        rules = db_manager.get_all_alert_rules()
        
        print(f"\n📋 Total de regras: {len(rules)}")
        
        if rules:
            active_count = sum(1 for r in rules if r['is_active'])
            print(f"   Ativas: {active_count}")
            print(f"   Inativas: {len(rules) - active_count}")
            
            print(f"\n📝 Regras configuradas:")
            for rule in rules:
                status = "✓ ATIVA" if rule['is_active'] else "✗ INATIVA"
                print(f"\n   [{status}] Regra #{rule['id']}")
                print(f"      Métrica: {rule['metric']}")
                print(f"      Condição: {rule['condition']}")
                print(f"      Limite: {rule['threshold_value']}")
                print(f"      Email: {rule['recipient_email']}")
                print(f"      Cooldown: {rule['cooldown_minutes']} min")
        else:
            print(f"\n⚠️  Nenhuma regra configurada ainda.")
            print(f"   💡 Acesse a interface web para criar regras.")
        
        return True
    except Exception as e:
        print(f"\n❌ Erro ao verificar regras: {e}")
        return False

def check_alert_history():
    """Verifica o histórico de alertas"""
    print_header("6. HISTÓRICO DE ALERTAS")
    
    try:
        history = db_manager.get_alert_history(limit=5)
        
        print(f"\n📬 Total de alertas enviados: {len(history)}")
        
        if history:
            print(f"\n📧 Últimos 5 alertas:")
            for alert in history[:5]:
                print(f"\n   Alerta #{alert['id']}")
                print(f"      Regra: #{alert['rule_id']} - {alert['metric']}")
                print(f"      Valor: {alert['sensor_value']}")
                print(f"      Enviado em: {alert['sent_at']}")
                print(f"      Status: {alert['email_status']}")
        else:
            print(f"\n✓ Nenhum alerta enviado ainda (isso é bom!).")
        
        return True
    except Exception as e:
        print(f"\n❌ Erro ao verificar histórico: {e}")
        return False

def run_full_test():
    """Executa todos os testes"""
    print("\n" + "=" * 70)
    print("  TESTE DE INTEGRAÇÃO ALERTSYSTEM <-> SMARTLUME")
    print("  Data/Hora:", datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
    print("=" * 70)
    
    results = []
    
    # Executar testes
    results.append(("Banco de dados existe", check_database_exists()))
    results.append(("Caminho do SmartLume", check_smartlume_path()))
    results.append(("Tabelas do banco", check_tables()))
    results.append(("Dados recentes", check_recent_data()))
    results.append(("Regras de alerta", check_alert_rules()))
    results.append(("Histórico de alertas", check_alert_history()))
    
    # Resumo
    print_header("RESUMO DOS TESTES")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print(f"\n✓ Testes passados: {passed}/{total}")
    
    print(f"\n📋 Detalhes:")
    for test_name, result in results:
        status = "✅ PASSOU" if result else "❌ FALHOU"
        print(f"   {status} - {test_name}")
    
    # Conclusão
    print_header("CONCLUSÃO")
    
    if passed == total:
        print(f"\n🎉 PERFEITO! Tudo está funcionando corretamente!")
        print(f"\n✓ O AlertSystem está integrado com o banco do SmartLume")
        print(f"✓ Você pode criar regras de alerta e receber emails em tempo real")
    elif passed >= total - 1:
        print(f"\n✓ Quase tudo está OK! Verifique os itens que falharam acima.")
    else:
        print(f"\n⚠️  Há problemas que precisam ser resolvidos.")
        print(f"   Consulte o arquivo INTEGRACAO_SMARTLUME.md para mais informações.")
    
    print("\n" + "=" * 70)

if __name__ == '__main__':
    try:
        run_full_test()
    except KeyboardInterrupt:
        print("\n\n❌ Teste interrompido pelo usuário.")
    except Exception as e:
        print(f"\n\n❌ Erro fatal: {e}")
        import traceback
        traceback.print_exc()
