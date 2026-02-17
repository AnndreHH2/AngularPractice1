import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

// guard para proteger las rutas que requieren autenticación, verificando si el usuario está logueado antes de permitir el acceso
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigateByUrl('/login');
  return false;
};
