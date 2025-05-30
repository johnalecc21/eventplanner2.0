import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  stages: [
    { duration: '3s', target: 20 },  
    { duration: '3s', target: 50 },  
    { duration: '10s', target: 100 },   
    { duration: '3s', target: 50 },  
    { duration: '3s', target: 0 },   
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],  
    http_req_failed: ['rate<0.01'],     
  },
};

export default function () {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2FmYWZjODE2MDI5M2QyNTg2YjU5ZWMiLCJyb2xlIjoicHJvdmlkZXIiLCJuYW1lIjoiYWxlam8iLCJpYXQiOjE3NDE3NDEwNDgsImV4cCI6MTc0MjM0NTg0OH0.6f6DxaHzCmAqIJ7T8sq3b_I5Qbly3to3AKBOiyB34Dg'; 
  const url = 'https://eventplannerbackend.onrender.com/api/bookings/user';

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = http.get(url, headers);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response not empty': (r) => r.body.length > 2,
    'response time < 5s': (r) => r.timings.duration < 5000,
    'no server errors': (r) => ![500, 502, 503, 504].includes(r.status),
  });

  sleep(1); // Simula espera entre peticiones
}

export function handleSummary(data) {
  return {
    "summary-user-bookings.html": htmlReport(data),
  };
}
