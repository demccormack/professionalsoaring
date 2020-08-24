#!/usr/bin/python3

import json, cgi
import mysql.connector as mariadb

dbfile = open("db.json", "r")
db = json.loads(dbfile)
cnx = mariadb.connect(user=db["user"], password=db["password"], database=db["database"])
cursor = cnx.cursor(dictionary=True)

table = cgi.FieldStorage().getvalue('table')

query = 'SELECT * FROM {};'.format(table)
cursor.execute(query)

l = list()
for row in cursor:
    l.append(row)

print('Content-type:application/json\r\n\r\n')
print(json.dumps(l))

cursor.close()
cnx.close()