const BASE_URL = 'https://d855-2603-9001-2af0-4c60-5d41-1cf-df83-2a86.ngrok-free.app';

fetch(`${BASE_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rNumber: 'R01224460',
      name: 'Jorge',
      email: 'jlameiras@rollins.edu',
      status: 'Active',
      currentYear: 4,
      courseTaken: 'CMS 120, CMS 430, CMS 250, CMS 140', 
    }),
  })
    .then(response => response.json())
    .then(data => console.log('Student added:', data))
    .catch(error => console.error('Error adding student:', error));