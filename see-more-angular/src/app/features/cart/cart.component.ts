import { Component, signal, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/cart.service';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);

  cartItems = this.cartService.items;
  itemCount = this.cartService.itemCount;
  total = this.cartService.total;

  currentUser = this.authService.currentUser;

  placingOrder = signal<boolean>(false);
  orderError = signal<string | null>(null);
  orderSuccess = signal<boolean>(false);
  showClearCartModal = signal<boolean>(false);
  showRemoveItemModal = signal<boolean>(false);
  itemToRemove = signal<number | null>(null);

  hasEnoughBalance = computed(() => {
    const user = this.currentUser();
    if (!user) return false;
    return user.balance >= this.total();
  });

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity > 5) {
      quantity = 5;
    }
    this.cartService.updateQuantity(productId, quantity);
  }

  openRemoveItemModal(productId: number): void {
    this.itemToRemove.set(productId);
    this.showRemoveItemModal.set(true);
  }

  closeRemoveItemModal(): void {
    this.showRemoveItemModal.set(false);
    this.itemToRemove.set(null);
  }

  confirmRemoveItem(): void {
    const productId = this.itemToRemove();
    if (productId !== null) {
      this.cartService.removeItem(productId);
    }
    this.closeRemoveItemModal();
  }

  openClearCartModal(): void {
    this.showClearCartModal.set(true);
  }

  closeClearCartModal(): void {
    this.showClearCartModal.set(false);
  }

  confirmClearCart(): void {
    this.cartService.clearCart();
    this.closeClearCartModal();
  }

  goToSignIn(): void {
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
  }

  placeOrder(): void {
    const user = this.currentUser();
    if (!user) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }

    if (!this.hasEnoughBalance()) {
      this.orderError.set('Insufficient balance to complete this order');
      return;
    }

    this.placingOrder.set(true);
    this.orderError.set(null);

    const orderData = {
      userId: user.id,
      items: this.cartItems().map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
      total: this.total(),
    };

    this.apiService.createOrder(orderData).subscribe({
      next: (order) => {
        this.orderSuccess.set(true);
        this.authService.updateUserBalance(user.balance - this.total());
        this.cartService.clearCart();
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1500);
      },
      error: (err) => {
        this.orderError.set(
          err.error?.message || 'Failed to place order. Please try again.'
        );
        this.placingOrder.set(false);
      },
    });
  }
}
