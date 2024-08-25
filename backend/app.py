from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route('/bfhl', methods=['POST'])
def handle_post():

    try:
        data = request.get_json()
        if not isinstance(data, dict):
            return jsonify({"error": "Invalid input format"}), 400
        # Extract the incoming data array
        dataarray = data.get('data', [])
        if not isinstance(dataarray, list):
            return jsonify({"error": "data must be an array"}), 400
        
        numbers = []
        alphabets = []

        for item in dataarray:
            if item.isdigit():
                numbers.append(item)
            elif item.isalpha():
                alphabets.append(item)
            else:
                continue

        highest_lowercase = [ch for ch in alphabets if ch.islower()]
        highest_lowercase = sorted(set(highest_lowercase), reverse=True)
        
        if highest_lowercase:
            highest_lowercase = [highest_lowercase[0]]
        else:
            highest_lowercase = []


        # Build the response JSON
        response = {
            'is_success': True,
            'user_id': 'Pramodh_Krishna_03012004',
            'college_email': 'pramodh.krishna2021@vitstudent.ac.in',
            'college_roll_number': '21BIT0510',
            'numbers': numbers,
            'alphabets': alphabets,
            'highest_lowercase': highest_lowercase
        }
        
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/bfhl', methods=['GET'])
def handle_get():
    response = {
        'operation_code': '1'
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True)
