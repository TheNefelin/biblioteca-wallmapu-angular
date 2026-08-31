const fs = require('fs');

const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000/api';
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';

const content = `export const environment = {
  production: true,
  apiUrl: ${JSON.stringify(apiUrl)},
  googleClientId: ${JSON.stringify(googleClientId)},
  version: '1.0.266',
};
`;

fs.writeFileSync('./src/environments/environment.ts', content);

console.log('environment.ts generado correctamente');
