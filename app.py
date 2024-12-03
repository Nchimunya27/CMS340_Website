from flask import Flask, jsonify, request
from db_config import get_connection

app = Flask(__name__)

# Home route
@app.route('/')
def home():
    return "Welcome to SmartFox!"

# ----------------- STUDENT CRUD -----------------
@app.route('/students', methods=['GET'])
def get_students():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Student;")
    students = cursor.fetchall()
    connection.close()
    return jsonify(students)

@app.route('/students', methods=['POST'])
def add_student():
    data = request.json
    connection = get_connection()
    cursor = connection.cursor()
    sql = "INSERT INTO Student (rNumber, name, email, status, currentYear, courseTaken) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (data['rNumber'], data['name'], data['email'], data['status'], data['currentYear'], data['courseTaken'])
    cursor.execute(sql, values)
    connection.commit()
    connection.close()
    return jsonify({"message": "Student added successfully"}), 201

@app.route('/students/<string:rNumber>', methods=['PUT'])
def update_student(rNumber):
    data = request.json
    connection = get_connection()
    cursor = connection.cursor()
    sql = "UPDATE Student SET name=%s, email=%s, status=%s, currentYear=%s, courseTaken=%s WHERE rNumber=%s"
    values = (data['name'], data['email'], data['status'], data['currentYear'], data['courseTaken'], rNumber)
    cursor.execute(sql, values)
    connection.commit()
    connection.close()
    return jsonify({"message": "Student updated successfully"})

@app.route('/students/<string:rNumber>', methods=['DELETE'])
def delete_student(rNumber):
    connection = get_connection()
    cursor = connection.cursor()
    sql = "DELETE FROM Student WHERE rNumber=%s"
    cursor.execute(sql, (rNumber,))
    connection.commit()
    connection.close()
    return jsonify({"message": "Student deleted successfully"})

# ----------------- COURSE CRUD -----------------
@app.route('/courses', methods=['GET'])
def get_courses():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Course;")
    courses = cursor.fetchall()
    connection.close()
    return jsonify(courses)

@app.route('/courses', methods=['POST'])
def add_course():
    data = request.json
    connection = get_connection()
    cursor = connection.cursor()
    sql = "INSERT INTO Course (courseID, title, professor, capacity, credit, time, days) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    values = (data['courseID'], data['title'], data['professor'], data['capacity'], data['credit'], data['time'], data['days'])
    cursor.execute(sql, values)
    connection.commit()
    connection.close()
    return jsonify({"message": "Course added successfully"}), 201

@app.route('/courses/<int:courseID>', methods=['PUT'])
def update_course(courseID):
    data = request.json
    connection = get_connection()
    cursor = connection.cursor()
    sql = "UPDATE Course SET title=%s, professor=%s, capacity=%s, credit=%s, time=%s, days=%s WHERE courseID=%s"
    values = (data['title'], data['professor'], data['capacity'], data['credit'], data['time'], data['days'], courseID)
    cursor.execute(sql, values)
    connection.commit()
    connection.close()
    return jsonify({"message": "Course updated successfully"})

@app.route('/courses/<int:courseID>', methods=['DELETE'])
def delete_course(courseID):
    connection = get_connection()
    cursor = connection.cursor()
    sql = "DELETE FROM Course WHERE courseID=%s"
    cursor.execute(sql, (courseID,))
    connection.commit()
    connection.close()
    return jsonify({"message": "Course deleted successfully"})

# ----------------- ENROLLMENT CRUD -----------------
@app.route('/enrollments', methods=['GET'])
def get_enrollments():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Enrollment;")
    enrollments = cursor.fetchall()
    connection.close()
    return jsonify(enrollments)

@app.route('/enrollments', methods=['POST'])
def add_enrollment():
    data = request.json
    connection = get_connection()
    cursor = connection.cursor()
    sql = "INSERT INTO Enrollment (rNumber, courseID) VALUES (%s, %s)"
    values = (data['rNumber'], data['courseID'])
    cursor.execute(sql, values)
    connection.commit()
    connection.close()
    return jsonify({"message": "Enrollment added successfully"}), 201

@app.route('/enrollments/<int:EnrollmentID>', methods=['PUT'])
def update_enrollment(EnrollmentID):
    data = request.json
    connection = get_connection()
    cursor = connection.cursor()
    sql = "UPDATE Enrollment SET rNumber=%s, courseID=%s WHERE EnrollmentID=%s"
    values = (data['rNumber'], data['courseID'], EnrollmentID)
    cursor.execute(sql, values)
    connection.commit()
    connection.close()
    return jsonify({"message": "Enrollment updated successfully"})

@app.route('/enrollments/<int:EnrollmentID>', methods=['DELETE'])
def delete_enrollment(EnrollmentID):
    connection = get_connection()
    cursor = connection.cursor()
    sql = "DELETE FROM Enrollment WHERE EnrollmentID=%s"
    cursor.execute(sql, (EnrollmentID,))
    connection.commit()
    connection.close()
    return jsonify({"message": "Enrollment deleted successfully"})

# ----------------- PREREQUISITE CRUD -----------------
@app.route('/prereqs', methods=['GET'])
def get_prerequisites():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM PreRequisite;")
    prereqs = cursor.fetchall()
    connection.close()
    return jsonify(prereqs)

@app.route('/prereqs', methods=['POST'])
def add_prerequisite():
    data = request.json
    connection = get_connection()
    cursor = connection.cursor()
    sql = "INSERT INTO PreRequisite (prereqCourseID, requiredBy) VALUES (%s, %s)"
    values = (data['prereqCourseID'], data['requiredBy'])
    cursor.execute(sql, values)
    connection.commit()
    connection.close()
    return jsonify({"message": "Prerequisite added successfully"}), 201

@app.route('/prereqs/<int:prereqID>', methods=['PUT'])
def update_prerequisite(prereqID):
    data = request.json
    connection = get_connection()
    cursor = connection.cursor()
    sql = "UPDATE PreRequisite SET prereqCourseID=%s, requiredBy=%s WHERE prereqID=%s"
    values = (data['prereqCourseID'], data['requiredBy'], prereqID)
    cursor.execute(sql, values)
    connection.commit()
    connection.close()
    return jsonify({"message": "Prerequisite updated successfully"})

@app.route('/prereqs/<int:prereqID>', methods=['DELETE'])
def delete_prerequisite(prereqID):
    connection = get_connection()
    cursor = connection.cursor()
    sql = "DELETE FROM PreRequisite WHERE prereqID=%s"
    cursor.execute(sql, (prereqID,))
    connection.commit()
    connection.close()
    return jsonify({"message": "Prerequisite deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True)
