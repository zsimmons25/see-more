import { isDevMode } from '@angular/core';

export const environment = {
  production: !isDevMode(),
  apiUrl: isDevMode() ? 'http://localhost:3000' : '/api/seemore',
};
