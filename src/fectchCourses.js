const BASE_URL = 'https://d855-2603-9001-2af0-4c60-5d41-1cf-df83-2a86.ngrok-free.app';


fetch(`${BASE_URL}/courses`)
  .then(response => response.json())
  .then(data => console.log('Courses:', data))
  .catch(error => console.error('Error fetching courses:', error));