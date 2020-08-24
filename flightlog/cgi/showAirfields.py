#!/usr/bin/python3

import mysql.connector as mariadb
import json

dbfile = open("db.json", "r")
db = json.loads(dbfile)
cnx = mariadb.connect(user=db["user"], password=db["password"], database=db["database"])
cursor = cnx.cursor()

query = "SELECT id, name FROM airfields WHERE id=%s;"
id1 = 1
cursor.execute(query, (id1,))

print("Content-type:text/html\r\n\r\n")
print("<html>")
print("<head>")
print("<title>Airfields</title>")
print("</head>")
print("<body>")

for id, name in cursor:
    print(("id: \"{}\" name: \"{}\"").format(id, name))

print("<br>")

query = "DESC airfields;"
cursor.execute(query)
for row in cursor:
    print(row)

print("</body>")
print("</html>")

cursor.close()
cnx.close()