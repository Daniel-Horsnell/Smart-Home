import random
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# TODO: make actual function
def get_moisture_tomato():
    return 50

# TODO: make actual function
def get_moisture_chilli():
    return 75

@app.route('/copy/<input_string>')
def echo(input_string):
    if 'stupid' in input_string.lower():
        return jsonify({'data': "You're stupid"})
    else:
        return jsonify({'data': input_string})
    
@app.route('/plant/moisture/<input_string>')
def get_moisture(input_string):
    print(input_string)
    if input_string == 'tomato':
        return jsonify({'data': get_moisture_tomato()})
    elif input_string == 'chilli':
        return jsonify({'data': get_moisture_chilli()})
    else:
        print('wrong')
        return 'you failed'



if __name__ == '__main__':
    app.run()