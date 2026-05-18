import axios from 'axios';

axios.get('https://api.remove.bg/v1.0/account', {
  headers: {
    'X-Api-Key': 'JSmGSkPtAUbMxnirstGKWLsF'
  }
})
.then(r => console.log('API Key valid:', JSON.stringify(r.data, null, 2)))
.catch(e => console.log('API Error:', e.response?.status, e.response?.data?.toString() || e.message));
