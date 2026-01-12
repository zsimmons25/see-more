import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty cart by default', () => {
      expect(service.items()).toEqual([]);
      expect(service.itemCount()).toBe(0);
      expect(service.total()).toBe(0);
    });

    it('should load cart from localStorage on init', () => {
      const mockCart: CartItem[] = [
        { productId: 1, productName: 'Test Product', quantity: 2, price: 10 }
      ];
      localStorage.setItem('cart', JSON.stringify(mockCart));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});

      const newService = TestBed.inject(CartService);

      expect(newService.items()).toEqual(mockCart);
      expect(newService.itemCount()).toBe(2);
      expect(newService.total()).toBe(20);
    });
  });

  describe('addItem', () => {
    it('should add a new item to cart', () => {
      const item: CartItem = {
        productId: 1,
        productName: 'Test Product',
        quantity: 1,
        price: 10
      };

      service.addItem(item);

      expect(service.items().length).toBe(1);
      expect(service.items()[0]).toEqual(item);
      expect(service.itemCount()).toBe(1);
      expect(service.total()).toBe(10);
    });

    it('should increment quantity if item already exists', () => {
      const item: CartItem = {
        productId: 1,
        productName: 'Test Product',
        quantity: 1,
        price: 10
      };

      service.addItem(item);
      service.addItem({ ...item, quantity: 2 });

      expect(service.items().length).toBe(1);
      expect(service.items()[0].quantity).toBe(3);
      expect(service.itemCount()).toBe(3);
      expect(service.total()).toBe(30);
    });

    it('should save cart to localStorage', () => {
      const item: CartItem = {
        productId: 1,
        productName: 'Test Product',
        quantity: 1,
        price: 10
      };

      service.addItem(item);

      const stored = localStorage.getItem('cart');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual([item]);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const item: CartItem = {
        productId: 1,
        productName: 'Test Product',
        quantity: 1,
        price: 10
      };

      service.addItem(item);
      expect(service.items().length).toBe(1);

      service.removeItem(1);
      expect(service.items().length).toBe(0);
      expect(service.itemCount()).toBe(0);
      expect(service.total()).toBe(0);
    });

    it('should update localStorage after removal', () => {
      const item: CartItem = {
        productId: 1,
        productName: 'Test Product',
        quantity: 1,
        price: 10
      };

      service.addItem(item);
      service.removeItem(1);

      const stored = localStorage.getItem('cart');
      expect(JSON.parse(stored!)).toEqual([]);
    });

    it('should not affect other items', () => {
      service.addItem({ productId: 1, productName: 'Product 1', quantity: 1, price: 10 });
      service.addItem({ productId: 2, productName: 'Product 2', quantity: 2, price: 20 });

      service.removeItem(1);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].productId).toBe(2);
    });
  });

  describe('updateQuantity', () => {
    beforeEach(() => {
      service.addItem({ productId: 1, productName: 'Test', quantity: 5, price: 10 });
    });

    it('should update item quantity', () => {
      service.updateQuantity(1, 3);

      expect(service.items()[0].quantity).toBe(3);
      expect(service.itemCount()).toBe(3);
      expect(service.total()).toBe(30);
    });

    it('should remove item if quantity is 0', () => {
      service.updateQuantity(1, 0);

      expect(service.items().length).toBe(0);
    });

    it('should remove item if quantity is negative', () => {
      service.updateQuantity(1, -1);

      expect(service.items().length).toBe(0);
    });

    it('should do nothing if product not found', () => {
      service.updateQuantity(999, 10);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].quantity).toBe(5);
    });

    it('should update localStorage', () => {
      service.updateQuantity(1, 7);

      const stored = JSON.parse(localStorage.getItem('cart')!);
      expect(stored[0].quantity).toBe(7);
    });
  });

  describe('clearCart', () => {
    it('should empty the cart', () => {
      service.addItem({ productId: 1, productName: 'Test', quantity: 1, price: 10 });
      service.addItem({ productId: 2, productName: 'Test2', quantity: 2, price: 20 });

      service.clearCart();

      expect(service.items()).toEqual([]);
      expect(service.itemCount()).toBe(0);
      expect(service.total()).toBe(0);
    });

    it('should remove cart from localStorage', () => {
      service.addItem({ productId: 1, productName: 'Test', quantity: 1, price: 10 });
      service.clearCart();

      expect(localStorage.getItem('cart')).toBeNull();
    });
  });

  describe('computed properties', () => {
    it('should calculate total item count correctly', () => {
      service.addItem({ productId: 1, productName: 'A', quantity: 2, price: 10 });
      service.addItem({ productId: 2, productName: 'B', quantity: 3, price: 20 });

      expect(service.itemCount()).toBe(5);
    });

    it('should calculate total price correctly', () => {
      service.addItem({ productId: 1, productName: 'A', quantity: 2, price: 10 });
      service.addItem({ productId: 2, productName: 'B', quantity: 3, price: 20 });

      expect(service.total()).toBe(80);
    });
  });
});
