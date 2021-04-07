from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

from database import TasksDB, UsersDB

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

UsersID = 0


@app.route('/', methods=['POST'])
@cross_origin()
def post():
    global UsersID
    content = request.get_json()
    if 'user' in content:
        if content['user']:
            UsersDB.registration(login=content['login'].strip(), password=content['password'].strip(),
                                 user=content['user'])
            return jsonify({'registration': True, 'user': content['login']}), 201
        else:
            # достаем юзера и смотрим админ ли он, чтобы в registr.js отправить его на нужный сайт
            data = UsersDB.select_user(login=content['login'].strip(), password=content['password'].strip())
            UsersID = data[0] if data is not None else None
            return jsonify({'data': data}), 201
    if 'get' in content:
        if content['get']:
            data = TasksDB.select_data_from_db(users_id=UsersID)
            return jsonify({'data': [tasks for tasks in data], 'users_id': UsersID}), 201
        else:
            TasksDB.insert_data_in_db(description=content['description'], users_id=content['users_id'])
            return jsonify({'transaction': 'successfully'}), 201
    if 'users_list' in content:
        data = UsersDB.select_all_users(UsersID)
        return jsonify({'users': [users for users in data], 'users_id': UsersID}), 201


@app.route('/', methods=['PUT'])
@cross_origin()
def put():
    content = request.get_json()
    if 'update' in content:
        if content['update']:
            UsersDB.update_users_to_admin(login=content['admin'])
        else:
            UsersDB.remove_from_admins(login=content['admin'])
            return jsonify({'transaction': 'successfully', 'updated': content})
    else:
        TasksDB.update_data_in_db(new_description=content['description'], tasks_id=content['tasks_id'])
    return jsonify({'transaction': 'successfully', 'updated': content})


@app.route('/', methods=['DELETE'])
@cross_origin()
def delete():
    content = request.get_json()
    if 'tasks_id' in content:
        TasksDB.delete_data_from_db(tasks_id=content['tasks_id'])
    elif 'users_id' in content:
        UsersDB.delete_user(users_id=content['users_id'])
    return jsonify({'transaction': 'successfully', 'deleted': content})


if __name__ == '__main__':
    app.run(debug=True)
