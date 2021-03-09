import psycopg2
from psycopg2.errors import InFailedSqlTransaction


class DataBase:

    def __init__(self):
        self.__connection = psycopg2.connect(dbname='frontend', user='postgres', password='1')
        self.__cursor = self.__connection.cursor()

    def create_db(self):
        self.__cursor.execute("""CREATE TABLE IF NOT EXISTS tasks(
                                tasks_id int GENERATED ALWAYS AS IDENTITY (start with 1) NOT NULL,
                                description text NOT NULL,
                                PRIMARY KEY (tasks_id))
                            """)
        self.__connection.commit()

    def insert_data_in_db(self, description):
        self.__cursor.execute("""INSERT INTO tasks (description) VALUES (%s) """, (description,))
        self.__connection.commit()

    def select_data_from_db(self):

        try:
            self.__cursor.execute("""SELECT * FROM tasks ORDER BY tasks_id ASC""")
            self.__connection.commit()
            fetch = self.__cursor.fetchall()
            data = [task for task in fetch]
            return data
        except InFailedSqlTransaction:
            self.__connection.rollback()

    def delete_data_from_db(self, tasks_id):
        self.__cursor.execute("""DELETE FROM tasks WHERE tasks_id = %s """, (tasks_id,))
        self.__connection.commit()

    def update_data_in_db(self, new_description, tasks_id):
        self.__cursor.execute("""UPDATE tasks SET description = %s WHERE tasks_id = %s""",
                              (new_description, tasks_id))
        self.__connection.commit()


DataBaseWork = DataBase()
DataBaseWork.create_db()
