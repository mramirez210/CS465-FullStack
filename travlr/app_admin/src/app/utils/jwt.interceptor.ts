import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { BROWSER_STORAGE } from '../storage';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const storage = inject(BROWSER_STORAGE);
  const isAuthRequest = request.url.endsWith('/login') || request.url.endsWith('/register');
  const token = storage.getItem('travlr-token');
  const authenticatedRequest = token && !isAuthRequest
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthRequest) {
        storage.removeItem('travlr-token');
      }
      return throwError(() => error);
    })
  );
};
