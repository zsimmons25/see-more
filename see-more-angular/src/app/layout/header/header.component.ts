import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../core/sidebar.service';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private sidebarService = inject(SidebarService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  isOpen = this.sidebarService.isOpen;
  isAuthenticated = this.authService.isAuthenticated;
  cartItemCount = this.cartService.itemCount;

  showUserDropdown = signal<boolean>(false);

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  toggleUserDropdown(): void {
    this.showUserDropdown.update((val) => !val);
  }

  closeUserDropdown(): void {
    this.showUserDropdown.set(false);
  }

  navigateToProfile(): void {
    this.closeUserDropdown();
    this.router.navigate(['/profile']);
  }

  signOut(): void {
    this.closeUserDropdown();
    this.authService.logout();
  }

  signIn(): void {
    this.router.navigate(['/login']);
  }
}
