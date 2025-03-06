from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Endpoint to approve payment
@app.route('/approve-payment', methods=['POST'])
def approve_payment():
    data = request.json
    payment_id = data.get('paymentId')

    if not payment_id:
        return jsonify({"success": False, "error": "paymentId is required"}), 400

    try:
        # Call Pi Network API to approve payment
        pi_network_url = "https://api.minepi.com/v2/payments/approve"
        response = requests.post(pi_network_url, json={"paymentId": payment_id})

        if response.status_code == 200:
            return jsonify({"success": True, "data": response.json()})
        else:
            return jsonify({"success": False, "error": response.text}), response.status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Endpoint to complete payment
@app.route('/complete-payment', methods=['POST'])
def complete_payment():
    data = request.json
    payment_id = data.get('paymentId')

    if not payment_id:
        return jsonify({"success": False, "error": "paymentId is required"}), 400

    try:
        # Call Pi Network API to complete payment
        pi_network_url = "https://api.minepi.com/v2/payments/complete"
        response = requests.post(pi_network_url, json={"paymentId": payment_id})

        if response.status_code == 200:
            return jsonify({"success": True, "data": response.json()})
        else:
            return jsonify({"success": False, "error": response.text}), response.status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000) 
