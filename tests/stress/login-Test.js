import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  stages: [
    { duration: '3s', target: 10 },   // 20 VUs en 30 segundos
    { duration: '3s', target: 200 },   // Escala a 50 VUs
    { duration: '10s', target: 500 },   // Escala a 100 VUs
    { duration: '3s', target: 100 },   // Disminuye a 50 VUs
    { duration: '3s', target: 0 },    // Finaliza la prueba
  ],
  thresholds: {
    http_req_duration: ['p(95)<50000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const url = 'https://eventplannerbackend.onrender.com/api/auth/login';
  const payload = JSON.stringify({
    email: 'planner1@yopmail.com',
    password: 'hola123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: '120s',
  };

  const response = http.post(url, payload, params);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response not empty': (r) => r.body.length > 0,
    'response time < 5s': (r) => r.timings.duration < 50000,
    'no server errors': (r) => ![500, 502, 503, 504].includes(r.status),
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "summary-login.html": htmlReport(data),
  };
}