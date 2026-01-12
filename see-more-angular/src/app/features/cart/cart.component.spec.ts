import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { CartComponent } from './cart.component';
import { CartService, CartItem } from '../../core/cart.service';
import { AuthService, AuthUser } from '../../core/auth.service';
import { ApiService, Order } from '../../core/api.service';

import { vi } from 'vitest';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartServiceMock: any;
  let authServiceMock: any;
  let apiServiceMock: any;
  let routerMock: any;

  const mockUser: AuthUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    balance: 500
  };

  const mockCartItems: CartItem[] = [
    { productId: 1, productName: 'Product 1', quantity: 2, price: 100 },
    { productId: 2, productName: 'Product 2', quantity: 1, price: 150 }
  ];

  const mockOrder: Order = {
    id: '1',
    userId: '1',
    items: mockCartItems,
    total: 350,
    status: 'pending',
    createdAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    cartServiceMock = {
      items: signal<CartItem[]>([]),
      itemCount: signal<number>(0),
      total: signal<number>(0),
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn()
    };

    authServiceMock = {
      currentUser: signal<AuthUser | null>(null),
      updateUserBalance: vi.fn()
    };

    apiServiceMock = {
      createOrder: vi.fn()
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('continueShopping', () => {
    it('should navigate to orders page', () => {
      component.continueShopping();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/orders']);
    });
  });

  describe('updateQuantity', () => {
    it('should call cartService.updateQuantity', () => {
      component.updateQuantity(1, 3);

      expect(cartServiceMock.updateQuantity).toHaveBeenCalledWith(1, 3);
    });

    it('should limit quantity to 5', () => {
      component.updateQuantity(1, 10);

      expect(cartServiceMock.updateQuantity).toHaveBeenCalledWith(1, 5);
    });
  });

  describe('removeItem modal', () => {
    it('should open remove item modal', () => {
      component.openRemoveItemModal(1);

      expect(component.showRemoveItemModal()).toBe(true);
      expect(component.itemToRemove()).toBe(1);
    });

    it('should close remove item modal', () => {
      component.openRemoveItemModal(1);
      component.closeRemoveItemModal();

      expect(component.showRemoveItemModal()).toBe(false);
      expect(component.itemToRemove()).toBeNull();
    });

    it('should confirm remove item', () => {
      component.itemToRemove.set(1);
      component.confirmRemoveItem();

      expect(cartServiceMock.removeItem).toHaveBeenCalledWith(1);
      expect(component.showRemoveItemModal()).toBe(false);
    });
  });

  describe('clearCart modal', () => {
    it('should open clear cart modal', () => {
      component.openClearCartModal();

      expect(component.showClearCartModal()).toBe(true);
    });

    it('should close clear cart modal', () => {
      component.openClearCartModal();
      component.closeClearCartModal();

      expect(component.showClearCartModal()).toBe(false);
    });

    it('should confirm clear cart', () => {
      component.confirmClearCart();

      expect(cartServiceMock.clearCart).toHaveBeenCalled();
      expect(component.showClearCartModal()).toBe(false);
    });
  });

  describe('goToSignIn', () => {
    it('should navigate to login with returnUrl', () => {
      component.goToSignIn();

      expect(routerMock.navigate).toHaveBeenCalledWith(
        ['/login'],
        { queryParams: { returnUrl: '/cart' } }
      );
    });
  });

  describe('placeOrder', () => {
    beforeEach(() => {
      authServiceMock.currentUser.set(mockUser);
      cartServiceMock.items.set(mockCartItems);
      cartServiceMock.total.set(350);
    });

    it('should navigate to login if user not authenticated', () => {
      authServiceMock.currentUser.set(null);

      component.placeOrder();

      expect(routerMock.navigate).toHaveBeenCalledWith(
        ['/login'],
        { queryParams: { returnUrl: '/cart' } }
      );
    });

    it('should set error if insufficient balance', () => {
      authServiceMock.currentUser.set({ ...mockUser, balance: 100 });

      component.placeOrder();

      expect(component.orderError()).toBe('Insufficient balance to complete this order');
    });

    it('should create order with correct data', () => {
      apiServiceMock.createOrder.mockReturnValue(of(mockOrder));

      component.placeOrder();

      expect(apiServiceMock.createOrder).toHaveBeenCalledWith({
        userId: '1',
        items: mockCartItems,
        total: 350
      });
    });

    it('should set placingOrder to true', () => {
      apiServiceMock.createOrder.mockReturnValue(of(mockOrder));

      component.placeOrder();

      expect(component.placingOrder()).toBe(true);
    });

    it('should update user balance on success', async () => {
      apiServiceMock.createOrder.mockReturnValue(of(mockOrder));

      component.placeOrder();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(authServiceMock.updateUserBalance).toHaveBeenCalledWith(150);
    });

    it('should clear cart on success', async () => {
      apiServiceMock.createOrder.mockReturnValue(of(mockOrder));

      component.placeOrder();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(cartServiceMock.clearCart).toHaveBeenCalled();
    });

    it('should set orderSuccess on success', async () => {
      apiServiceMock.createOrder.mockReturnValue(of(mockOrder));

      component.placeOrder();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.orderSuccess()).toBe(true);
    });

    it('should navigate to profile after delay on success', async () => {
      apiServiceMock.createOrder.mockReturnValue(of(mockOrder));

      component.placeOrder();

      await new Promise(resolve => setTimeout(resolve, 0));
      await new Promise(resolve => setTimeout(resolve, 1600));

      expect(routerMock.navigate).toHaveBeenCalledWith(['/profile']);
    }, 10000);

    it('should set error message on failure', async () => {
      const errorResponse = {
        error: { message: 'Order failed' }
      };
      apiServiceMock.createOrder.mockReturnValue(throwError(() => errorResponse));

      component.placeOrder();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.orderError()).toBe('Order failed');
    });

    it('should use default error message if none provided', async () => {
      apiServiceMock.createOrder.mockReturnValue(throwError(() => ({})));

      component.placeOrder();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.orderError()).toBe('Failed to place order. Please try again.');
    });

    it('should set placingOrder to false on failure', async () => {
      apiServiceMock.createOrder.mockReturnValue(throwError(() => ({})));

      component.placeOrder();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.placingOrder()).toBe(false);
    });
  });

  describe('hasEnoughBalance computed', () => {
    it('should return false if no user', () => {
      authServiceMock.currentUser.set(null);

      expect(component.hasEnoughBalance()).toBe(false);
    });

    it('should return true if balance >= total', () => {
      authServiceMock.currentUser.set(mockUser);
      cartServiceMock.total.set(400);

      expect(component.hasEnoughBalance()).toBe(true);
    });

    it('should return false if balance < total', () => {
      authServiceMock.currentUser.set(mockUser);
      cartServiceMock.total.set(600);

      expect(component.hasEnoughBalance()).toBe(false);
    });
  });
});
