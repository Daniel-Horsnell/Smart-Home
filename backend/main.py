import random
from flask import Flask, jsonify
from flask_cors import CORS
from flask import request

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
    
@app.route('/plant/moisture/<input_string>', methods = ['GET', 'POST'])
def get_moisture(input_string):
    if request.method == 'GET':
      if input_string == 'tomato':
          return jsonify({'data': get_moisture_tomato()})
      elif input_string == 'chilli':
          return jsonify({'data': get_moisture_chilli()})
      else:
          return 'you failed'
    elif request.method == 'POST':
        data = request.form
        print(data)
    else:
        return 'What?'



if __name__ == '__main__':
    app.run()