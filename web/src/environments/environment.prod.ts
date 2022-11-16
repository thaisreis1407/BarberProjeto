export const environment = {
  production: true,
  apiUrl: 'http://barber.thsystem.com.br',
  apiPort: '9438',
  whitelistedDomains: [new RegExp('barber.thsystem.com.br')],
  blacklistedRoutes: [new RegExp('\/oauth\/token')]
};
