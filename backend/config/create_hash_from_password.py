import binascii
import hashlib


def hash_password(login: str) -> str:
    sha256 = hashlib.pbkdf2_hmac('sha256', bytes(login, encoding='utf-8'), b'salt', 10000)
    password = str(binascii.hexlify(sha256), encoding='utf-8')
    return password
