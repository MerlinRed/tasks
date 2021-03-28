import psycopg2
from psycopg2.errors import InFailedSqlTransaction

"""
непонятно как будут связываться записи с пользователями
какой таблице делать FOREIGN KEY

если сделать таблице tasks на users_id, получается при новой вставке задач
они должны будут как-то отражаться на таблицу users, чтобы понимать чьи это задачи

отношение один ко многим, один юзер к нескольким записям
при входе на сайт, надо делать проверку на id пользователя, и выдавать
задачи по колонке users_id, колонке которая связывает 2 таблицы
"""


# superadmin может видеть все записи, добавляет админов и юзеров и записи, их же может удалять, записи у всех удалять
# admin может видеть все записи, добавлять юзеров и записи, их же может и удалять

class UsersDataBase:

    def __init__(self):
        self.__connection = psycopg2.connect(dbname='frontend', user='postgres', password='1')
        self.__cursor = self.__connection.cursor()

    def create_db(self):
        self.__cursor.execute("""CREATE TABLE IF NOT EXISTS users (
                                 users_id int GENERATED ALWAYS AS IDENTITY (start with 1) NOT NULL,
                                 login varchar(255) UNIQUE NOT NULL,
                                 password varchar(255) NOT NULL,
                                 user_site bool default False,
                                 admin_site bool default False,
                                 super_admin bool default False,
                                 PRIMARY KEY (users_id) )
                            """)
        self.__connection.commit()

    def registration(self, login, password, user=False, admin=False, super_admin=False):
        self.__cursor.execute("""INSERT INTO users (login, password, user_site, admin_site, super_admin) 
                                 VALUES (%s, %s, %s, %s, %s) """,
                              (login, password, user, admin, super_admin))
        self.__connection.commit()

    def select_data_from_db(self, login, password):

        try:
            self.__cursor.execute("""SELECT users_id FROM users WHERE login = %s and password = %s""",
                                  (login, password))
            self.__connection.commit()
            fetch = self.__cursor.fetchone()
            data = None if fetch is None else fetch[0]
            return data
        except InFailedSqlTransaction:
            self.__connection.rollback()

    # def delete_data_from_db(self, tasks_id):
    #     self.__cursor.execute("""DELETE FROM tasks WHERE tasks_id = %s """, (tasks_id,))
    #     self.__connection.commit()
    #
    # def update_data_in_db(self, new_description, tasks_id):
    #     self.__cursor.execute("""UPDATE tasks SET description = %s WHERE tasks_id = %s""",
    #                           (new_description, tasks_id))
    #     self.__connection.commit()


UsersDB = UsersDataBase()
UsersDB.create_db()