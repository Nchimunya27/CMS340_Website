import mysql.connector

def get_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="0220",
        database="SmartFox"
    )
    return connection