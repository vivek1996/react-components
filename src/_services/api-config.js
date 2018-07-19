let backendHost;
const hostname = window && window.location && window.location.hostname;

if(hostname === 'admin.example.com') {
  backendHost = 'https://api.example.com';
} else if(hostname === 'dev-admin.example.com') {
  backendHost = 'https://dev-api.example.com';
} else {
  backendHost = 'https://dev-api.example.com';
}

export const API_ROOT = `${backendHost}`;