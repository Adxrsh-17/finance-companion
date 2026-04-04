import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoleService, UserRole } from './services/role.service';

export const authGuard: CanActivateFn = (route) => {
  const roleService = inject(RoleService);
  const router = inject(Router);

  if (!roleService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data?.['roles'] as UserRole[] | undefined;
  if (allowedRoles?.length) {
    const currentRole = roleService.getCurrentRole();
    if (!allowedRoles.includes(currentRole)) {
      router.navigate(['/dashboard']);
      return false;
    }
  }

  return true;
};
