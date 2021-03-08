import psycopg2


class DataBase:

    def __init__(self):
        self.__connection = psycopg2.connect(dbname='frontend', user='postgres', password='1')
        self.__cursor = self.__connection.cursor()

    def create_db(self):
        self.__cursor.execute("""CREATE TABLE IF NOT EXISTS tasks
                                tasks_id serial,
                                description text NOT NULL,
                                PRIMARY KEY (tasks_id)
                            """)
        self.__connection.commit()

    def insert_data_in_db(self, description):
        self.__cursor.execute("""INSERT INTO tasks description VALUES (%)""", (description,))
        self.__connection.commit()


DataBase = DataBase()
