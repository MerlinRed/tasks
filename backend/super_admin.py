import sys

from database import UsersDB

UsersDB.registration(login=sys.argv[1], password=sys.argv[2], super_admin=True)
