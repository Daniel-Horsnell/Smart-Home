from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/copy/<input_string>')
def echo(input_string):
    if 'stupid' in input_string.lower():
        return jsonify({'data': "You're stupid"})
    else:
        return jsonify({'data': input_string})

if __name__ == '__main__':
    app.run()