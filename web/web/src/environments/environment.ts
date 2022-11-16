export const environment = {
  production: false,
  apiUrl: 'http://192.168.0.106',
  apiPort: '8000',
  whitelistedDomains: [new RegExp('192.168.0.106:8000'),
    new RegExp('localhost:8000')],
  blacklistedRoutes: [new RegExp('\/oauth\/token')]
  // blacklistedRoutes: [/\/oauth\/token/]
};
