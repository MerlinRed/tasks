from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

from database import DataBaseWork

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/', methods=['GET'])
@cross_origin()
def get():
    data = DataBaseWork.select_data_from_db()
    return jsonify({'data': [tasks for tasks in data]})


@app.route('/', methods=['POST'])
@cross_origin()
def post():
    content = request.get_json()
    data = DataBaseWork.insert_data_in_db(description=content['description'])
    return jsonify({'method': data}), 201


@app.route('/', methods=['PUT'])
@cross_origin()
def put():
    content = request.get_json()
    data = DataBaseWork.update_data_in_db(new_description=content['description'], tasks_id=content['tasks_id'])
    return jsonify({'Method': data})


@app.route('/', methods=['DELETE'])
@cross_origin()
def delete():
    content = request.get_json()
    data = DataBaseWork.delete_data_from_db(tasks_id=content['tasks_id'])
    return jsonify({'Method': data})


if __name__ == '__main__':
    app.run(debug=True)
