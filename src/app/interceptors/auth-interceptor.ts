import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth';
import { catchError, throwError } from 'rxjs';

export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const _userAuthService = inject(UserAuthService);
  const _router = inject(Router);

  const HAS_TOKEN = _userAuthService.getUserToken();

  const clonedRequest = HAS_TOKEN
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${HAS_TOKEN}`)
      })
    : req;

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('⚠️ Token expirado ou ausente. Redirecionando para login...');
        _userAuthService.clearSession(); // remove token/localStorage
        _router.navigate(['/login']);
      }

      if (error.status === 403) {
        console.error('🚫 Token inválido. Acesso negado.');
        _userAuthService.clearSession();
        _router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
