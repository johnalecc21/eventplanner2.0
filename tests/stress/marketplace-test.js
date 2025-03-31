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
  const url = 'https://eventplannerbackend.onrender.com/api/services';

  const response = http.get(url, { timeout: '120s' });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response not empty': (r) => r.body.length > 2,
    'response time < 5s': (r) => r.timings.duration < 50000,
    'no server errors': (r) => ![500, 502, 503, 504].includes(r.status),
  });

  sleep(1); 
}

export function handleSummary(data) {
  return {
    "summary-marketplace.html": htmlReport(data),
  };
}
