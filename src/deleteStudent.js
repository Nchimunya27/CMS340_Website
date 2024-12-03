const BASE_URL = 'https://24e0-2603-9001-2af0-4c60-1140-75c3-a2ac-4e48.ngrok-free.app';

fetch(`${BASE_URL}/students/R01224460`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => console.log('Student deleted:', data))
    .catch(error => console.error('Error deleting student:', error));