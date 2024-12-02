from db_config import get_connection

connection = get_connection()
cursor = connection.cursor()
cursor.execute("SHOW TABLES;")
for table in cursor:
    print(table)
connection.close()