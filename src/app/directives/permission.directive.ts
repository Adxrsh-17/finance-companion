import { Directive, TemplateRef, ViewContainerRef, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserRole, RoleService } from '../services/role.service';
import { combineLatest } from 'rxjs';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private readonly roleService = inject(RoleService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  private requiredRoles: UserRole[] = [];
  private currentRole: UserRole = this.roleService.getCurrentRole();
  private isAuthenticated = this.roleService.isAuthenticated();
  private hasView = false;

  @Input() set appHasRole(roles: UserRole | UserRole[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor() {
    combineLatest([this.roleService.role$, this.roleService.isAuthenticated$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([role, isAuthenticated]) => {
        this.currentRole = role;
        this.isAuthenticated = isAuthenticated;
        this.updateView();
      });
  }

  private updateView(): void {
    const canShow = this.isAuthenticated && this.requiredRoles.includes(this.currentRole);
    if (canShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
      return;
    }

    if (!canShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
