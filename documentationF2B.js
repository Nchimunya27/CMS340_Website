General Notes for the Frontend Team

    Replace BASE_URL in the examples with your API's ngrok URL:

    const BASE_URL = 'https://24e0-2603-9001-2af0-4c60-1140-75c3-a2ac-4e48.ngrok-free.app/';

JavaScript Code Samples
1. Fetch All Students

fetch(`${BASE_URL}/students`)
  .then(response => response.json())
  .then(data => console.log('Students:', data))
  .catch(error => console.error('Error fetching students:', error));

2. Add a New Student

fetch(`${BASE_URL}/students`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    rNumber: 'R1005',
    name: 'Eve Test',
    email: 'eve.test@example.com',
    status: 'Active',
    currentYear: 1,
    courseTaken: null,
  }),
})
  .then(response => response.json())
  .then(data => console.log('Student added:', data))
  .catch(error => console.error('Error adding student:', error));

3. Update a Student

fetch(`${BASE_URL}/students/R1005`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Eve Updated',
    email: 'eve.updated@example.com',
    status: 'Inactive',
    currentYear: 2,
    courseTaken: null,
  }),
})
  .then(response => response.json())
  .then(data => console.log('Student updated:', data))
  .catch(error => console.error('Error updating student:', error));

4. Delete a Student

fetch(`${BASE_URL}/students/R1005`, {
  method: 'DELETE',
})
  .then(response => response.json())
  .then(data => console.log('Student deleted:', data))
  .catch(error => console.error('Error deleting student:', error));

5. Fetch All Courses

fetch(`${BASE_URL}/courses`)
  .then(response => response.json())
  .then(data => console.log('Courses:', data))
  .catch(error => console.error('Error fetching courses:', error));

6. Add a New Course

fetch(`${BASE_URL}/courses`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    courseID: 13908,
    title: 'Advanced Data Structures',
    professor: 'J Smith',
    capacity: 25,
    credit: 4,
    time: '9:00-10:15A',
    days: 'TR',
  }),
})
  .then(response => response.json())
  .then(data => console.log('Course added:', data))
  .catch(error => console.error('Error adding course:', error));

7. Update a Course

fetch(`${BASE_URL}/courses/13908`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Advanced Data Structures Updated',
    professor: 'J Smith',
    capacity: 30,
    credit: 4,
    time: '9:00-10:30A',
    days: 'MWF',
  }),
})
  .then(response => response.json())
  .then(data => console.log('Course updated:', data))
  .catch(error => console.error('Error updating course:', error));

8. Delete a Course

fetch(`${BASE_URL}/courses/13908`, {
  method: 'DELETE',
})
  .then(response => response.json())
  .then(data => console.log('Course deleted:', data))
  .catch(error => console.error('Error deleting course:', error));

9. Fetch All Enrollments

fetch(`${BASE_URL}/enrollments`)
  .then(response => response.json())
  .then(data => console.log('Enrollments:', data))
  .catch(error => console.error('Error fetching enrollments:', error));

10. Add an Enrollment

fetch(`${BASE_URL}/enrollments`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    rNumber: 'R1001',
    courseID: 13903,
  }),
})
  .then(response => response.json())
  .then(data => console.log('Enrollment added:', data))
  .catch(error => console.error('Error adding enrollment:', error));

11. Fetch All Prerequisites

fetch(`${BASE_URL}/prereqs`)
  .then(response => response.json())
  .then(data => console.log('Prerequisites:', data))
  .catch(error => console.error('Error fetching prerequisites:', error));

12. Add a Prerequisite

fetch(`${BASE_URL}/prereqs`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prereqCourseID: 13905,
    requiredBy: 14870,
  }),
})
  .then(response => response.json())
  .then(data => console.log('Prerequisite added:', data))
  .catch(error => console.error('Error adding prerequisite:', error));
