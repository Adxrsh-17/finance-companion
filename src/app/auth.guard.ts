import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DataService } from './services/data.service';

export const authGuard: CanActivateFn = () => {
  const dataService = inject(DataService);
  const router = inject(Router);

  const currentUser = dataService.getCurrentUser();
  
  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
