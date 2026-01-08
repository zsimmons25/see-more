  import { Component, inject } from '@angular/core';
  import { RouterLink, RouterLinkActive } from '@angular/router';
  import { SidebarService } from '../../core/sidebar.service';
  import { AuthService } from '../../core/auth.service';

  @Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
  })
  export class HeaderComponent {
    private sidebarService = inject(SidebarService);
    private authService = inject(AuthService);

    isOpen = this.sidebarService.isOpen;
    isAuthenticated = this.authService.isAuthenticated;

    toggleSidebar(): void {
      this.sidebarService.toggle();
    }

    signIn(): void {
      this.authService.login();
    }

    signOut(): void {
      this.authService.logout();
    }
  }