import {CanActivateFn, RedirectCommand, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthStorageService} from '../services/auth-storage.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authStorageService = inject(AuthStorageService);

  if(!authStorageService.isAuthenticated()){
    const loginPath = router.parseUrl("/login");
    return new RedirectCommand(loginPath)
  }

  return true;
};
