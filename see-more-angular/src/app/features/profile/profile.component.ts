import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, User, Order } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  user = signal<User | null>(null);
  loading = signal<boolean>(true);
  totalOrders = signal<number>(0);
  orderHistory = signal<Order[]>([]);

  totalSpent = computed(() => {
    return this.orderHistory().reduce(
      (sum, order) => sum + Number(order.total),
      0
    );
  });

  showAddFundsModal = signal<boolean>(false);
  fundsAmount = signal<string>('');
  addingFunds = signal<boolean>(false);
  fundsError = signal<string | null>(null);

  showChangePasswordModal = signal<boolean>(false);
  currentPassword = signal<string>('');
  newPassword = signal<string>('');
  confirmPassword = signal<string>('');
  changingPassword = signal<boolean>(false);
  passwordError = signal<string | null>(null);
  passwordSuccess = signal<string | null>(null);

  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUser(currentUser.id);
  }

  loadUser(id: string): void {
    this.apiService.getUser(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
        this.loadOrders(id);
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.loading.set(false);
      },
    });
  }

  loadOrders(userId: string): void {
    this.apiService.getOrders(userId).subscribe({
      next: (orders) => {
        this.orderHistory.set(orders);
        this.totalOrders.set(orders.length);
      },
      error: (err) => {
        console.error('Error loading orders:', err);
      },
    });
  }

  openAddFundsModal(): void {
    this.showAddFundsModal.set(true);
    this.fundsAmount.set('');
    this.fundsError.set(null);
  }

  closeAddFundsModal(): void {
    this.showAddFundsModal.set(false);
  }

  confirmAddFunds(): void {
    this.submitAddFunds();
  }

  submitAddFunds(): void {
    const amount = parseFloat(this.fundsAmount());
    if (isNaN(amount) || amount <= 0) {
      this.fundsError.set('Please enter a valid amount');
      return;
    }

    const userId = this.user()?.id;
    if (!userId) return;

    this.addingFunds.set(true);
    this.fundsError.set(null);

    this.apiService.addFunds(userId, amount).subscribe({
      next: (updatedUser) => {
        this.user.set(updatedUser);
        this.addingFunds.set(false);
        this.closeAddFundsModal();
      },
      error: (err) => {
        this.fundsError.set('Failed to add funds. Please try again.');
        this.addingFunds.set(false);
      },
    });
  }

  openChangePasswordModal(): void {
    this.showChangePasswordModal.set(true);
    this.currentPassword.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.passwordError.set(null);
    this.passwordSuccess.set(null);
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal.set(false);
  }

  confirmChangePassword(): void {
    this.submitChangePassword();
  }

  submitChangePassword(): void {
    if (!this.currentPassword()) {
      this.passwordError.set('Current password is required');
      return;
    }

    if (this.newPassword().length < 6) {
      this.passwordError.set('New password must be at least 6 characters');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.passwordError.set('Passwords do not match');
      return;
    }

    const userId = this.user()?.id;
    if (!userId) return;

    this.changingPassword.set(true);
    this.passwordError.set(null);

    this.apiService
      .changePassword(userId, this.currentPassword(), this.newPassword())
      .subscribe({
        next: (response) => {
          this.passwordSuccess.set(response.message);
          this.changingPassword.set(false);
          setTimeout(() => {
            this.closeChangePasswordModal();
          }, 2000);
        },
        error: (err) => {
          this.passwordError.set(
            err.error?.message || 'Failed to change password. Please try again.'
          );
          this.changingPassword.set(false);
        },
      });
  }
}
