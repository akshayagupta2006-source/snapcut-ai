import axios from 'axios';
import fs from 'fs';

// Create a small test image (1x1 red pixel PNG)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
const dataUrl = `data:image/png;base64,${testImageBase64}`;

console.log('Testing remove-background endpoint...');
console.log('Image data length:', dataUrl.length);

axios.post('http://localhost:3001/api/remove-background', 
  { image: dataUrl },
  { 
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 60000
  }
)
.then(response => {
  console.log('Status:', response.status);
  console.log('Success:', response.data.success);
  console.log('URL length:', response.data.url?.length);
})
.catch(error => {
  console.log('Error:', error.response?.status);
  console.log('Error data:', error.response?.data?.toString());
  console.log('Error message:', error.message);
});