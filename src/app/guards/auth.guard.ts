import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RoleService } from '../services/role.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private roleService: RoleService
  ) {}

  canActivate(): boolean {
    // Check if user is logged in (you can expand this logic)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
}
