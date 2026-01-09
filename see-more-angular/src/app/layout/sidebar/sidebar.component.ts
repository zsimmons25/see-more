import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../core/sidebar.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private sidebarService = inject(SidebarService);
  private authService = inject(AuthService);

  isOpen = this.sidebarService.isOpen;
  isAuthenticated = this.authService.isAuthenticated;

  close(): void {
    this.sidebarService.close();
  }

  signOut(): void {
    this.authService.logout();
    this.close();
  }
}
