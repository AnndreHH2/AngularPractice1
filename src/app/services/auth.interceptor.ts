import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (req.url.includes('/api/Auth/login')) {
    return next(req);
  }

  // si no hay token, continuar sin modificar la solicitud
  if (!token) {
    return next(req);
  }

  // clonar la solicitud y agregar el encabezado de autorización con el token
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authReq);
};
