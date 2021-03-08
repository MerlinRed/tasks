from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/', methods=['GET'])
def get():
    return jsonify({'Method': 'GET'})


@app.route('/', methods=['POST'])
def post():
    return jsonify({'Method': 'POST'}), 201


# @app.route('todo/api/v1.0/tasks/<int:put_id>', methods=['PUT'])
@app.route('/', methods=['PUT'])
def put():
    return jsonify({'Method': 'PUT'})


# @app.route('todo/api/v1.0/tasks/<int:delete_id>', methods=['DELETE'])
@app.route('/', methods=['DELETE'])
def delete():
    return jsonify({'Method': 'DELETE'})


if __name__ == '__main__':
    app.run(debug=True)
