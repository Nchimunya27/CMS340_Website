# SmartFox API Documentation
Tentative url: https://d855-2603-9001-2af0-4c60-5d41-1cf-df83-2a86.ngrok-free.app
Url will change on host disconnect/reconnect - Url must be updated and verified before presentation


Endpoints
1. Home

    Endpoint: /
    Method: GET
    Description: Displays a welcome message.
    Response:

    "Welcome to SmartFox!"

2. Students
2.1 Get All Students

    Endpoint: /students
    Method: GET
    Description: Fetch all students in the Student table.
    Response Example:

    [
        {
            "rNumber": "R1001",
            "name": "Alice Freshman",
            "email": "alice.freshman@example.com",
            "status": "Active",
            "currentYear": 1,
            "courseTaken": null
        },
        ...
    ]

2.2 Add a New Student

    Endpoint: /students
    Method: POST
    Description: Add a new student to the Student table.
    Request Body Example:

{
    "rNumber": "R1005",
    "name": "Eve Test",
    "email": "eve.test@example.com",
    "status": "Active",
    "currentYear": 1,
    "courseTaken": null
}

Response:

    {
        "message": "Student added successfully"
    }

2.3 Update a Student

    Endpoint: /students/<rNumber>
    Method: PUT
    Description: Update an existing student.
    Request Body Example:

{
    "name": "Eve Updated",
    "email": "eve.updated@example.com",
    "status": "Inactive",
    "currentYear": 2,
    "courseTaken": null
}

Response:

    {
        "message": "Student updated successfully"
    }

2.4 Delete a Student

    Endpoint: /students/<rNumber>
    Method: DELETE
    Description: Delete a student by their rNumber.
    Response:

    {
        "message": "Student deleted successfully"
    }

3. Courses
3.1 Get All Courses

    Endpoint: /courses
    Method: GET
    Description: Fetch all courses in the Course table.
    Response Example:

    [
        {
            "courseID": 13903,
            "title": "Intro to Computer Science",
            "professor": "D Myers",
            "capacity": 22,
            "credit": 4,
            "time": "10:00-10:50A",
            "days": "MWF"
        },
        ...
    ]

3.2 Add a New Course

    Endpoint: /courses
    Method: POST
    Description: Add a new course to the Course table.
    Request Body Example:

{
    "courseID": 13908,
    "title": "Advanced Data Structures",
    "professor": "J Smith",
    "capacity": 25,
    "credit": 4,
    "time": "9:00-10:15A",
    "days": "TR"
}

Response:

    {
        "message": "Course added successfully"
    }

3.3 Update a Course

    Endpoint: /courses/<courseID>
    Method: PUT
    Description: Update an existing course.
    Request Body Example:

{
    "title": "Advanced Data Structures Updated",
    "professor": "J Smith",
    "capacity": 30,
    "credit": 4,
    "time": "9:00-10:30A",
    "days": "MWF"
}

Response:

    {
        "message": "Course updated successfully"
    }

3.4 Delete a Course

    Endpoint: /courses/<courseID>
    Method: DELETE
    Description: Delete a course by its courseID.
    Response:

    {
        "message": "Course deleted successfully"
    }

4. Enrollments
4.1 Get All Enrollments

    Endpoint: /enrollments
    Method: GET
    Description: Fetch all enrollments in the Enrollment table.
    Response Example:

    [
        {
            "EnrollmentID": 1,
            "rNumber": "R1001",
            "courseID": 13903
        },
        ...
    ]

4.2 Add a New Enrollment

    Endpoint: /enrollments
    Method: POST
    Description: Add a new enrollment to the Enrollment table.
    Request Body Example:

{
    "rNumber": "R1001",
    "courseID": 13903
}

Response:

    {
        "message": "Enrollment added successfully"
    }

4.3 Update an Enrollment

    Endpoint: /enrollments/<EnrollmentID>
    Method: PUT
    Description: Update an enrollment.
    Request Body Example:

{
    "rNumber": "R1001",
    "courseID": 13904
}

Response:

    {
        "message": "Enrollment updated successfully"
    }

4.4 Delete an Enrollment

    Endpoint: /enrollments/<EnrollmentID>
    Method: DELETE
    Description: Delete an enrollment by its EnrollmentID.
    Response:

    {
        "message": "Enrollment deleted successfully"
    }

5. Prerequisites
5.1 Get All Prerequisites

    Endpoint: /prereqs
    Method: GET
    Description: Fetch all prerequisites in the PreRequisite table.
    Response Example:

    [
        {
            "prereqID": 1,
            "prereqCourseID": 13903,
            "requiredBy": 13905
        },
        ...
    ]

5.2 Add a New Prerequisite

    Endpoint: /prereqs
    Method: POST
    Description: Add a new prerequisite to the PreRequisite table.
    Request Body Example:

{
    "prereqCourseID": 13905,
    "requiredBy": 14870
}

Response:

    {
        "message": "Prerequisite added successfully"
    }

5.3 Update a Prerequisite

    Endpoint: /prereqs/<prereqID>
    Method: PUT
    Description: Update a prerequisite.
    Request Body Example:

{
    "prereqCourseID": 13903,
    "requiredBy": 15086
}

Response:

    {
        "message": "Prerequisite updated successfully"
    }

5.4 Delete a Prerequisite

    Endpoint: /prereqs/<prereqID>
    Method: DELETE
    Description: Delete a prerequisite by its prereqID.
    Response:

{
    "message": "Prerequisite deleted successfully"
}
