#!/usr/bin/python3

import mysql.connector as mariadb
import json

dbfile = open("db.json", "r")
db = json.loads(dbfile)
cnx = mariadb.connect(user=db["user"], password=db["password"], database=db["database"])
cursor = cnx.cursor()

query = "SELECT id, name FROM airfields;"
cursor.execute(query)

print("Content-type:application/json\r\n\r\n")
print('{"airfields": [ ')
items = []
for id, name in cursor:
    items.append('{"id": ' + str(id) + ', "name": "' + name +'"}')
strItems = ", ".join(items)
print(strItems)
print(' ] }')

cursor.close()
cnx.close()