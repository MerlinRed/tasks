import psycopg2
from psycopg2.errors import InFailedSqlTransaction

from tasks.backend.config.create_hash_from_password import hash_password


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

    def registration(self, login: str, password: str, user: bool):
        password = hash_password(password)
        self.__cursor.execute("""INSERT INTO users (login, password, user_site) VALUES (%s, %s, %s) """,
                              (login, password, user,))
        self.__connection.commit()

    def registration_super_user(self, login: str, password: str, user: bool, admin: bool,
                                super_admin: bool):
        self.__cursor.execute("""SELECT super_admin FROM users WHERE super_admin = true""")
        self.__connection.commit()
        fetch = self.__cursor.fetchone()
        data = None if fetch is None else fetch[0]
        if data:
            print('Супер Админ уже есть')
        else:
            password = hash_password(password)
            self.__cursor.execute("""INSERT INTO users (login, password, user_site, admin_site, super_admin) 
                                     VALUES (%s, %s, %s, %s, %s) """,
                                  (login, password, user, admin, super_admin))
            self.__connection.commit()

    def select_user(self, login: str, password: str):

        try:
            password = hash_password(password)
            self.__cursor.execute("""SELECT users_id, admin_site FROM users WHERE login = %s and password = %s""",
                                  (login, password))
            self.__connection.commit()
            fetch = self.__cursor.fetchone()
            data = None if fetch is None else fetch
            return data
        except InFailedSqlTransaction:
            self.__connection.rollback()

    def select_all_users(self, users_id: int):

        try:
            if users_id != 1:
                self.__cursor.execute(
                    """SELECT users_id, login FROM users WHERE super_admin = false and admin_site = false""", )
                self.__connection.commit()
                fetch = self.__cursor.fetchall()
                data = [users for users in fetch]
                return data
            else:
                self.__cursor.execute(
                    """SELECT users_id, login FROM users WHERE super_admin = false ORDER BY users_id ASC""")
                self.__connection.commit()
                fetch = self.__cursor.fetchall()
                data = [users for users in fetch]
                return data
        except InFailedSqlTransaction:
            self.__connection.rollback()

    def delete_user(self, users_id: int):
        self.__cursor.execute("""DELETE FROM tasks WHERE users_id = %s """, (users_id,))
        self.__cursor.execute("""DELETE FROM users WHERE users_id = %s """, (users_id,))
        self.__connection.commit()

    def update_users_to_admin(self, login: str):
        self.__cursor.execute("""UPDATE users SET admin_site = true WHERE user_site = true and login = %s""",
                              (login,))
        self.__connection.commit()

    def remove_from_admins(self, login: str):
        if login == 'admin':
            return 'Супер админа нельзя разжаловать'
        self.__cursor.execute("""UPDATE users SET admin_site = false WHERE login = %s""",
                              (login,))
        self.__connection.commit()


UsersDB = UsersDataBase()
UsersDB.create_db()
