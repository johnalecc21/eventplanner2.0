import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // Aumenta a 20 VUs en 30 segundos
    { duration: '30s', target: 50 },   // Escala a 50 VUs
    { duration: '1m', target: 80 },    // Escala a 80 VUs
    { duration: '30s', target: 50 },   // Baja a 50 VUs
    { duration: '30s', target: 0 },    // Finaliza la prueba
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],  // 95% de las respuestas deben ser < 5s
    http_req_failed: ['rate<0.01'],     // Menos del 1% de fallos
  },
};

export default function () {
  const url = 'https://eventplannerbackend.onrender.com/api/services';

  const response = http.get(url, { timeout: '120s' });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response not empty': (r) => r.body.length > 2,
    'response time < 5s': (r) => r.timings.duration < 5000,
    'no server errors': (r) => ![500, 502, 503, 504].includes(r.status),
  });

  sleep(1); 
}

export function handleSummary(data) {
  return {
    "summary-marketplace.html": htmlReport(data),
  };
}
