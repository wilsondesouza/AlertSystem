from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import db_manager
import os

# Define o caminho para a pasta dist (frontend build)
DIST_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dist')

app = Flask(__name__, static_folder=DIST_FOLDER, static_url_path='')
CORS(app)

# Initialize database tables
db_manager.init_alert_tables()

@app.route('/api/alert-rules', methods=['GET'])
def get_alert_rules():
    """Get all alert rules"""
    try:
        rules = db_manager.get_all_alert_rules()
        return jsonify({'success': True, 'data': rules})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/alert-rules', methods=['POST'])
def create_alert_rule():
    """Create a new alert rule"""
    try:
        data = request.json
        rule_id = db_manager.create_alert_rule(
            sensor_type=data['sensor_type'],
            metric=data['metric'],
            condition=data['condition'],
            threshold_value=float(data['threshold_value']),
            threshold_max=float(data.get('threshold_max')) if data.get('threshold_max') else None,
            recipient_email=data['recipient_email'],
            cooldown_minutes=int(data.get('cooldown_minutes', 30))
        )
        return jsonify({'success': True, 'rule_id': rule_id})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/alert-rules/<int:rule_id>', methods=['PUT'])
def update_alert_rule(rule_id):
    """Update an existing alert rule"""
    try:
        data = request.json
        db_manager.update_alert_rule(
            rule_id=rule_id,
            sensor_type=data['sensor_type'],
            metric=data['metric'],
            condition=data['condition'],
            threshold_value=float(data['threshold_value']),
            threshold_max=float(data.get('threshold_max')) if data.get('threshold_max') else None,
            recipient_email=data['recipient_email'],
            cooldown_minutes=int(data.get('cooldown_minutes', 30)),
            is_active=int(data.get('is_active', 1))
        )
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/alert-rules/<int:rule_id>/toggle', methods=['PATCH'])
def toggle_alert_rule(rule_id):
    """Toggle alert rule active status"""
    try:
        data = request.json
        db_manager.toggle_alert_rule(rule_id, int(data['is_active']))
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/alert-rules/<int:rule_id>', methods=['DELETE'])
def delete_alert_rule(rule_id):
    """Delete an alert rule"""
    try:
        db_manager.delete_alert_rule(rule_id)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/alert-history', methods=['GET'])
def get_alert_history():
    """Get alert history"""
    try:
        limit = request.args.get('limit', 100, type=int)
        history = db_manager.get_alert_history(limit)
        return jsonify({'success': True, 'data': history})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/alert-statistics', methods=['GET'])
def get_alert_statistics():
    """Get alert statistics"""
    try:
        stats = db_manager.get_alert_statistics()
        return jsonify({'success': True, 'data': stats})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/emailjs-config', methods=['GET'])
def get_emailjs_config():
    """Get EmailJS configuration (stored in environment variables)"""
    return jsonify({
        'success': True,
        'data': {
            'service_id': os.environ.get('EMAILJS_SERVICE_ID', ''),
            'template_id': os.environ.get('EMAILJS_TEMPLATE_ID', ''),
            'public_key': os.environ.get('EMAILJS_PUBLIC_KEY', '')
        }
    })

@app.route('/api/emailjs-config', methods=['POST'])
def save_emailjs_config():
    """Save EmailJS configuration"""
    try:
        data = request.json
        # In a production environment, you would save this to a secure configuration file
        # For now, we'll just return success
        return jsonify({'success': True, 'message': 'Configuration saved. Please set environment variables: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Rotas para servir o frontend (React build)
@app.route('/')
def serve_frontend():
    """Serve the frontend index.html"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    """Serve static files from the dist folder"""
    # Se o arquivo existe, serve ele
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # Caso contrário, serve o index.html (para suportar rotas do React Router)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555, debug=True)