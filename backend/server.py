from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

from database import TasksDB, UsersDB

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

UsersID = []


@app.route('/', methods=['GET'])
@cross_origin()
def get():
    data = TasksDB.select_data_from_db(users_id=UsersID[0])
    return jsonify({'data': [tasks for tasks in data], 'users_id': UsersID})


@app.route('/', methods=['POST'])
@cross_origin()
def post():
    global UsersID
    content = request.get_json()
    if 'user' in content:
        if content['user']:
            UsersDB.registration(login=content['login'], password=content['password'], user=content['user'])
            return jsonify({'registration': True,
                            'login': content['login'],
                            'password': content['password'],
                            'user': content['user']}), 201
        else:
            UsersID = UsersDB.select_user(login=content['login'], password=content['password'])
            return jsonify({'data': UsersID}), 201
    if 'get' in content:
        if content['get']:
            data = TasksDB.select_data_from_db(users_id=UsersID[0])
            return jsonify({'data': [tasks for tasks in data], 'users_id': UsersID[0]}), 201
        else:
            TasksDB.insert_data_in_db(description=content['description'], users_id=UsersID[0])
            return jsonify({'transaction': 'successfully'}), 201
    if 'users_list' in content:
        data = UsersDB.select_all_users(UsersID[0])
        return jsonify({'users': [users for users in data], 'users_id': UsersID}), 201


@app.route('/', methods=['PUT'])
@cross_origin()
def put():
    content = request.get_json()
    TasksDB.update_data_in_db(new_description=content['description'], tasks_id=content['tasks_id'])
    return jsonify({'transaction': 'successfully'})


@app.route('/', methods=['DELETE'])
@cross_origin()
def delete():
    content = request.get_json()
    if 'tasks_id' in content:
        TasksDB.delete_data_from_db(tasks_id=content['tasks_id'])
        return jsonify({'transaction': 'successfully'})
    elif 'users_id' in content:
        UsersDB.delete_user(users_id=content['users_id'])
        return jsonify({'transaction': 'successfully', 'deleted': content})


if __name__ == '__main__':
    app.run(debug=True)
