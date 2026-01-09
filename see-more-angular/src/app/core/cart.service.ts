import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  items = this.cartItems.asReadonly();

  itemCount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  total = computed(() =>
    this.cartItems().reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  );

  private loadCartFromStorage(): CartItem[] {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  addItem(item: CartItem): void {
    const items = [...this.cartItems()];
    const existingIndex = items.findIndex(
      (i) => i.productId === item.productId
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += item.quantity;
    } else {
      items.push(item);
    }

    this.cartItems.set(items);
    this.saveCartToStorage();
  }

  removeItem(productId: number): void {
    const items = this.cartItems().filter((i) => i.productId !== productId);
    this.cartItems.set(items);
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    const items = [...this.cartItems()];
    const index = items.findIndex((i) => i.productId === productId);

    if (index >= 0) {
      if (quantity <= 0) {
        items.splice(index, 1);
      } else {
        items[index].quantity = quantity;
      }
      this.cartItems.set(items);
      this.saveCartToStorage();
    }
  }

  clearCart(): void {
    this.cartItems.set([]);
    localStorage.removeItem('cart');
  }
}
