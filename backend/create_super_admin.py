import sys

from database import UsersDB

UsersDB.registration_super_user(login=sys.argv[1], password=sys.argv[2], user=True, admin=True, super_admin=True)
