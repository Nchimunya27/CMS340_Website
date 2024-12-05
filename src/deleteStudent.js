const BASE_URL = 'https://d855-2603-9001-2af0-4c60-5d41-1cf-df83-2a86.ngrok-free.app';

fetch(`${BASE_URL}/students/R01224460`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => console.log('Student deleted:', data))
    .catch(error => console.error('Error deleting student:', error));