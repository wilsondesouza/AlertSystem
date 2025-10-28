import sqlite3
import os
from datetime import datetime, timedelta, timezone
from .config import DB_PATH, DB_SOURCE, print_config

# Mostrar configuração ao inicializar o módulo
print_config()

# Fuso horário do Brasil (UTC-3)
BR_TZ = timezone(timedelta(hours=-3))

def _now_br_str():
    """Retorna timestamp no fuso BR (UTC-3) no formato 'YYYY-MM-DD HH:MM:SS'."""
    return datetime.now(BR_TZ).strftime("%Y-%m-%d %H:%M:%S")

def init_alert_tables():
    """Initialize alert_rules and alert_history tables"""
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        
        # Create alert_rules table
        c.execute("""
            CREATE TABLE IF NOT EXISTS alert_rules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sensor_type TEXT NOT NULL,
                metric TEXT NOT NULL,
                condition TEXT NOT NULL,
                threshold_value REAL NOT NULL,
                threshold_max REAL,
                recipient_email TEXT NOT NULL,
                cooldown_minutes INTEGER DEFAULT 30,
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create alert_history table
        c.execute("""
            CREATE TABLE IF NOT EXISTS alert_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                rule_id INTEGER NOT NULL,
                sensor_value REAL NOT NULL,
                message TEXT NOT NULL,
                sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
                email_status TEXT DEFAULT 'sent',
                FOREIGN KEY (rule_id) REFERENCES alert_rules(id)
            )
        """)
        
        conn.commit()

def create_alert_rule(sensor_type, metric, condition, threshold_value, threshold_max, recipient_email, cooldown_minutes):
    """Create a new alert rule (armazena created_at em BR_TZ)"""
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("""
            INSERT INTO alert_rules 
            (sensor_type, metric, condition, threshold_value, threshold_max, recipient_email, cooldown_minutes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (sensor_type, metric, condition, threshold_value, threshold_max, recipient_email, cooldown_minutes, _now_br_str()))
        conn.commit()
        return c.lastrowid

def get_all_alert_rules():
    """Get all alert rules"""
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM alert_rules ORDER BY created_at DESC")
        return [dict(row) for row in c.fetchall()]

def get_active_alert_rules():
    """Get only active alert rules"""
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM alert_rules WHERE is_active = 1")
        return [dict(row) for row in c.fetchall()]

def update_alert_rule(rule_id, sensor_type, metric, condition, threshold_value, threshold_max, recipient_email, cooldown_minutes, is_active):
    """Update an existing alert rule"""
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("""
            UPDATE alert_rules 
            SET sensor_type = ?, metric = ?, condition = ?, threshold_value = ?, 
                threshold_max = ?, recipient_email = ?, cooldown_minutes = ?, is_active = ?
            WHERE id = ?
        """, (sensor_type, metric, condition, threshold_value, threshold_max, recipient_email, cooldown_minutes, is_active, rule_id))
        conn.commit()

def toggle_alert_rule(rule_id, is_active):
    """Toggle alert rule active status"""
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("UPDATE alert_rules SET is_active = ? WHERE id = ?", (is_active, rule_id))
        conn.commit()

def delete_alert_rule(rule_id):
    """Delete an alert rule"""
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("DELETE FROM alert_rules WHERE id = ?", (rule_id,))
        conn.commit()

def create_alert_history(rule_id, sensor_value, message, email_status='sent'):
    """Create a new alert history entry (armazena sent_at em BR_TZ)"""
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("""
            INSERT INTO alert_history (rule_id, sensor_value, message, email_status, sent_at)
            VALUES (?, ?, ?, ?, ?)
        """, (rule_id, sensor_value, message, email_status, _now_br_str()))
        conn.commit()
        return c.lastrowid
    
def get_alert_history(limit=100):
    """Get alert history with rule details"""
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("""
            SELECT 
                ah.*,
                ar.sensor_type,
                ar.metric,
                ar.condition,
                ar.threshold_value,
                ar.recipient_email
            FROM alert_history ah
            JOIN alert_rules ar ON ah.rule_id = ar.id
            ORDER BY ah.sent_at DESC
            LIMIT ?
        """, (limit,))
        return [dict(row) for row in c.fetchall()]

def get_last_alert_time(rule_id):
    """Get the timestamp of the last alert sent for a specific rule (retorna datetime com BR_TZ)"""
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("""
            SELECT sent_at FROM alert_history 
            WHERE rule_id = ? 
            ORDER BY sent_at DESC 
            LIMIT 1
        """, (rule_id,))
        result = c.fetchone()
        if result and result[0]:
            # formato esperado: "YYYY-MM-DD HH:MM:SS"
            try:
                dt = datetime.strptime(result[0], "%Y-%m-%d %H:%M:%S")
            except Exception:
                # fallback para fromisoformat
                dt = datetime.fromisoformat(result[0])
            return dt.replace(tzinfo=BR_TZ)
        return None

def get_recent_readings(minutes=1):
    """Get recent sensor readings from the last N minutes (usa fuso BR para cálculo do cutoff)"""
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        cutoff = (datetime.now(BR_TZ) - timedelta(minutes=minutes)).strftime("%Y-%m-%d %H:%M:%S")
        c.execute("""
            SELECT * FROM sistema_info 
            WHERE timestamp >= ?
            ORDER BY timestamp DESC
        """, (cutoff,))
        return [dict(row) for row in c.fetchall()]

def get_alert_statistics():
    """Get alert statistics (usa data BR para 'today')"""
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        
        # Total rules
        c.execute("SELECT COUNT(*) as total FROM alert_rules")
        total_rules = c.fetchone()['total']
        
        # Active rules
        c.execute("SELECT COUNT(*) as active FROM alert_rules WHERE is_active = 1")
        active_rules = c.fetchone()['active']
        
        # Total alerts sent
        c.execute("SELECT COUNT(*) as total FROM alert_history")
        total_alerts = c.fetchone()['total']
        
        # Alerts sent today (considerando fuso BR)
        today_str = datetime.now(BR_TZ).strftime("%Y-%m-%d")
        c.execute("""
            SELECT COUNT(*) as today FROM alert_history 
            WHERE DATE(sent_at) = DATE(?)
        """, (today_str,))
        alerts_today = c.fetchone()['today']
        
        # Alerts by sensor type
        c.execute("""
            SELECT ar.sensor_type, COUNT(ah.id) as count
            FROM alert_history ah
            JOIN alert_rules ar ON ah.rule_id = ar.id
            GROUP BY ar.sensor_type
        """)
        alerts_by_sensor = [dict(row) for row in c.fetchall()]
        
        return {
            'total_rules': total_rules,
            'active_rules': active_rules,
            'total_alerts': total_alerts,
            'alerts_today': alerts_today,
            'alerts_by_sensor': alerts_by_sensor
        }