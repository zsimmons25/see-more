import { Component, signal, OnInit, inject } from '@angular/core';
import { ApiService, User, Order } from '../../core/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private apiService = inject(ApiService);

  user = signal<User | null>(null);
  loading = signal<boolean>(true);
  totalOrders = signal<number>(0);
  orderHistory = signal<Order[]>([]);

  ngOnInit(): void {}

  loadUser(id: number): void {
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

  loadOrders(userId: number): void {
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

  addFunds(): void {
    console.log('Add funds clicked');
    // TODO: Implement add funds functionality
  }
}
