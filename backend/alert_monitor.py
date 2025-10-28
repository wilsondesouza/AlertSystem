import time
import requests
from datetime import datetime, timedelta
import db_manager
from config import (
    EMAILJS_SERVICE_ID, 
    EMAILJS_TEMPLATE_ID, 
    EMAILJS_PUBLIC_KEY, 
    EMAILJS_PRIVATE_KEY,
    EMAILJS_API_URL,
    CHECK_INTERVAL,
    READING_WINDOW_MINUTES
)

def check_condition(value, condition, threshold_value, threshold_max=None):
    """Check if a value meets the alert condition"""
    if condition == 'greater_than':
        return value > threshold_value
    elif condition == 'less_than':
        return value < threshold_value
    elif condition == 'between':
        if threshold_max is None:
            return False
        return threshold_value <= value <= threshold_max
    elif condition == 'outside':
        if threshold_max is None:
            return False
        return value < threshold_value or value > threshold_max
    return False

def send_email_via_emailjs(recipient_email, subject, message):
    """Send email via EmailJS"""
    if not all([EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY]):
        print("EmailJS not configured. Skipping email send.")
        return False
    
    try:
        payload = {
            'service_id': EMAILJS_SERVICE_ID,
            'template_id': EMAILJS_TEMPLATE_ID,
            'user_id': EMAILJS_PUBLIC_KEY,
            'accessToken': EMAILJS_PRIVATE_KEY,
            'template_params': {
                'to_email': recipient_email,
                'subject': subject,
                'message': message
            }
        }
        
        response = requests.post(EMAILJS_API_URL, json=payload)
        
        if response.status_code == 200:
            print(f"Email sent successfully to {recipient_email}")
            return True
        else:
            print(f"Failed to send email: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

def format_condition_text(condition, threshold_value, threshold_max=None):
    """Format condition text for display"""
    if condition == 'greater_than':
        return f"> {threshold_value}"
    elif condition == 'less_than':
        return f"< {threshold_value}"
    elif condition == 'between':
        return f"between {threshold_value} and {threshold_max}"
    elif condition == 'outside':
        return f"outside {threshold_value} - {threshold_max}"
    return ""

def monitor_alerts():
    """Main monitoring loop"""
    print("Alert Monitor started...")
    
    # Initialize database
    db_manager.init_alert_tables()
    
    while True:
        try:
            # Get active alert rules
            active_rules = db_manager.get_active_alert_rules()
            
            if not active_rules:
                print("No active rules. Waiting...")
                time.sleep(CHECK_INTERVAL)
                continue
            
            # Get recent readings (using configured window)
            recent_readings = db_manager.get_recent_readings(minutes=READING_WINDOW_MINUTES)
            
            if not recent_readings:
                print("No recent readings. Waiting...")
                time.sleep(CHECK_INTERVAL)
                continue
            
            print(f"Checking {len(active_rules)} rules against {len(recent_readings)} readings...")
            
            # Check each rule against recent readings
            for rule in active_rules:
                # Map sensor type to database column
                metric_map = {
                    'cpu': 'cpu',
                    'ram': 'ram',
                    'temperatura': 'temperatura',
                    'temperature': 'temperatura',
                    'potencia': 'potencia',
                    'power': 'potencia'
                }
                
                metric_column = metric_map.get(rule['metric'].lower())
                if not metric_column:
                    continue
                
                # Check cooldown
                last_alert_time = db_manager.get_last_alert_time(rule['id'])
                if last_alert_time:
                    cooldown_end = last_alert_time + timedelta(minutes=rule['cooldown_minutes'])
                    if datetime.now() < cooldown_end:
                        print(f"Rule {rule['id']} in cooldown. Skipping...")
                        continue
                
                # Check each reading
                for reading in recent_readings:
                    sensor_value = reading.get(metric_column)
                    if sensor_value is None:
                        continue
                    
                    # Check if condition is met
                    if check_condition(
                        sensor_value, 
                        rule['condition'], 
                        rule['threshold_value'],
                        rule['threshold_max']
                    ):
                        # Condition violated! Send alert
                        condition_text = format_condition_text(
                            rule['condition'], 
                            rule['threshold_value'],
                            rule['threshold_max']
                        )
                        
                        subject = f"Alert: {rule['sensor_type']} {rule['metric']} threshold exceeded"
                        message = f"""
Alert Triggered!

Sensor Type: {rule['sensor_type']}
Metric: {rule['metric']}
Current Value: {sensor_value}
Condition: {condition_text}
Timestamp: {reading['timestamp']}

This alert will not be sent again for {rule['cooldown_minutes']} minutes.
                        """
                        
                        # Send email
                        email_sent = send_email_via_emailjs(
                            rule['recipient_email'],
                            subject,
                            message
                        )
                        
                        # Record in history
                        db_manager.create_alert_history(
                            rule_id=rule['id'],
                            sensor_value=sensor_value,
                            message=message,
                            email_status='sent' if email_sent else 'failed'
                        )
                        
                        print(f"Alert sent for rule {rule['id']}: {rule['metric']} = {sensor_value}")
                        
                        # Only send one alert per rule per check cycle
                        break
            
            # Wait before next check
            print(f"Check complete. Waiting {CHECK_INTERVAL} seconds...")
            time.sleep(CHECK_INTERVAL)
            
        except Exception as e:
            print(f"Error in monitoring loop: {str(e)}")
            time.sleep(CHECK_INTERVAL)

if __name__ == '__main__':
    monitor_alerts()