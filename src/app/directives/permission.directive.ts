import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { DataService } from '../services/data.service';

@Directive({
  selector: '[appPermission]',
  standalone: true
})
export class PermissionDirective {
  private dataService = inject(DataService);
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  @Input() set appPermission(value: { resource: string; action: string }) {
    this.updateView(value.resource, value.action);
  }

  private updateView(resource: string, action: string) {
    this.viewContainer.clear();
    
    if (this.dataService.hasPermission(resource, action)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}

@Directive({
  selector: '[appRole]',
  standalone: true
})
export class RoleDirective {
  private dataService = inject(DataService);
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  @Input() set appRole(roles: string[]) {
    this.updateView(roles);
  }

  private updateView(roles: string[]) {
    this.viewContainer.clear();
    
    const currentUser = this.dataService.getCurrentUser();
    if (currentUser && roles.includes(currentUser.role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
