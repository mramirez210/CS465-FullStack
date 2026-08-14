import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  return authenticationService.isLoggedIn()
    ? true
    : router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url, reason: 'authentication' }
    });
};
