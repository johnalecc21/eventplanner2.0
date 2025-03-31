import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  stages: [
    { duration: '3s', target: 20 },  
    { duration: '5s', target: 100 },   
    { duration: '3s', target: 0 },   
  ],
  thresholds: {
    http_req_duration: ['p(95)<50000'], 
    http_req_failed: ['rate<0.01'],   
  },
};

export default function () {
  const url = 'https://eventplannerbackend.onrender.com/api/auth/register';
  
  const payload = JSON.stringify({
    name: `User${Math.random().toString(36).substring(7)}`, 
    email: `test${Math.random().toString(36).substring(7)}@gmail.com`,
    password: 'Hola123.',
    role: 'user',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: '120s',
  };

  const response = http.post(url, payload, params);

  check(response, {
    'status is 201': (r) => r.status === 201,
    'response not empty': (r) => r.body.length > 0,
    'response time < 5s': (r) => r.timings.duration < 50000,
    'no server errors': (r) => ![500, 502, 503, 504].includes(r.status),
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "summary-register.html": htmlReport(data),
  };
}
