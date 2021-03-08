import psycopg2
from psycopg2.errors import InFailedSqlTransaction


class DataBase:

    def __init__(self):
        self.__connection = psycopg2.connect(dbname='frontend', user='postgres', password='1')
        self.__cursor = self.__connection.cursor()

    def create_db(self):
        self.__cursor.execute("""CREATE TABLE IF NOT EXISTS tasks(
                                tasks_id serial,
                                description text NOT NULL,
                                PRIMARY KEY (tasks_id))
                            """)
        self.__connection.commit()

    def insert_data_in_db(self, description):
        self.__cursor.execute("""INSERT INTO tasks (description) VALUES (%s) """, (description,))
        self.__connection.commit()

    def select_data_from_db(self):

        try:
            self.__cursor.execute("""SELECT * FROM tasks""")
            self.__connection.commit()
            fetch = self.__cursor.fetchall()
            data = [task for task in fetch]
            return data
        except InFailedSqlTransaction:
            self.__connection.rollback()

    def delete_data_from_db(self, description):
        self.__cursor.execute("""DELETE FROM tasks WHERE description = %s """, (description,))
        self.__connection.commit()

    def update_data_in_db(self, new_description, old_description):
        self.__cursor.execute("""UPDATE tasks SET description = %s WHERE description = %s""",
                              (new_description, old_description))
        self.__connection.commit()


DataBaseWork = DataBase()
DataBaseWork.create_db()
