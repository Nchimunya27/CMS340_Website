const BASE_URL = 'https://24e0-2603-9001-2af0-4c60-1140-75c3-a2ac-4e48.ngrok-free.app';

fetch(`${BASE_URL}/students`)
  .then(response => response.json())
  .then(data => console.log('Students:', data))
  .catch(error => console.error('Error fetching students:', error));