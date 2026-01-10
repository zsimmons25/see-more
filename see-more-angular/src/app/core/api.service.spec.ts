import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService, Product, User, Order, CreateOrderDto } from './api.service';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    brand: 'Test Brand',
    manufacturer: 'Test Manufacturer',
    price: 99.99,
    image: 'test.jpg',
    category: 'Electronics',
    description: 'Test description'
  };

  const mockUser: User = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    balance: 100,
    memberSince: '2024-01-01'
  };

  const mockOrder: Order = {
    id: '1',
    userId: '1',
    items: [
      { productId: 1, productName: 'Test Product', quantity: 2, price: 99.99 }
    ],
    total: 199.98,
    status: 'pending',
    createdAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should make GET request to products endpoint', () => {
      service.getProducts().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush([mockProduct]);
    });

    it('should return array of products', async () => {
      const mockProducts = [mockProduct, { ...mockProduct, id: 2 }];

      const promise = new Promise<void>((resolve) => {
        service.getProducts().subscribe((products) => {
          expect(products).toEqual(mockProducts);
          expect(products.length).toBe(2);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products`);
      req.flush(mockProducts);

      await promise;
    });
  });

  describe('getProduct', () => {
    it('should make GET request to product by id endpoint', () => {
      service.getProduct(1).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('should return single product', async () => {
      const promise = new Promise<void>((resolve) => {
        service.getProduct(1).subscribe((product) => {
          expect(product).toEqual(mockProduct);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
      req.flush(mockProduct);

      await promise;
    });
  });

  describe('getUser', () => {
    it('should make GET request to user endpoint', () => {
      service.getUser('1').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should return user data', async () => {
      const promise = new Promise<void>((resolve) => {
        service.getUser('1').subscribe((user) => {
          expect(user).toEqual(mockUser);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
      req.flush(mockUser);

      await promise;
    });
  });

  describe('updateUser', () => {
    it('should make PATCH request to user endpoint', () => {
      const updates = { firstName: 'Jane' };
      service.updateUser('1', updates).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updates);
      req.flush({ ...mockUser, firstName: 'Jane' });
    });

    it('should return updated user', async () => {
      const updates = { firstName: 'Jane' };
      const updatedUser = { ...mockUser, firstName: 'Jane' };

      const promise = new Promise<void>((resolve) => {
        service.updateUser('1', updates).subscribe((user) => {
          expect(user).toEqual(updatedUser);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
      req.flush(updatedUser);

      await promise;
    });
  });

  describe('addFunds', () => {
    it('should make POST request to add-funds endpoint', () => {
      service.addFunds('1', 50).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/users/1/add-funds`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ amount: 50 });
      req.flush({ ...mockUser, balance: 150 });
    });

    it('should return user with updated balance', async () => {
      const updatedUser = { ...mockUser, balance: 150 };

      const promise = new Promise<void>((resolve) => {
        service.addFunds('1', 50).subscribe((user) => {
          expect(user.balance).toBe(150);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/1/add-funds`);
      req.flush(updatedUser);

      await promise;
    });
  });

  describe('changePassword', () => {
    it('should make POST request to change-password endpoint', () => {
      service.changePassword('1', 'oldPass', 'newPass').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/users/1/change-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        currentPassword: 'oldPass',
        newPassword: 'newPass'
      });
      req.flush({ message: 'Password changed successfully' });
    });

    it('should return success message', async () => {
      const promise = new Promise<void>((resolve) => {
        service.changePassword('1', 'oldPass', 'newPass').subscribe((response) => {
          expect(response.message).toBe('Password changed successfully');
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/1/change-password`);
      req.flush({ message: 'Password changed successfully' });

      await promise;
    });
  });

  describe('createOrder', () => {
    it('should make POST request to orders endpoint', () => {
      const orderDto: CreateOrderDto = {
        userId: '1',
        items: [{ productId: 1, productName: 'Test', quantity: 2, price: 99.99 }],
        total: 199.98
      };

      service.createOrder(orderDto).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/orders`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(orderDto);
      req.flush(mockOrder);
    });

    it('should return created order', async () => {
      const orderDto: CreateOrderDto = {
        userId: '1',
        items: [{ productId: 1, productName: 'Test', quantity: 2, price: 99.99 }],
        total: 199.98
      };

      const promise = new Promise<void>((resolve) => {
        service.createOrder(orderDto).subscribe((order) => {
          expect(order).toEqual(mockOrder);
          expect(order.id).toBeTruthy();
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/orders`);
      req.flush(mockOrder);

      await promise;
    });
  });

  describe('getOrders', () => {
    it('should make GET request to user orders endpoint', () => {
      service.getOrders('1').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/orders/user/1`);
      expect(req.request.method).toBe('GET');
      req.flush([mockOrder]);
    });

    it('should return array of orders', async () => {
      const mockOrders = [mockOrder, { ...mockOrder, id: '2' }];

      const promise = new Promise<void>((resolve) => {
        service.getOrders('1').subscribe((orders) => {
          expect(orders).toEqual(mockOrders);
          expect(orders.length).toBe(2);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/orders/user/1`);
      req.flush(mockOrders);

      await promise;
    });
  });

  describe('getOrder', () => {
    it('should make GET request to order by id endpoint', () => {
      service.getOrder('1').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/orders/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockOrder);
    });

    it('should return single order', async () => {
      const promise = new Promise<void>((resolve) => {
        service.getOrder('1').subscribe((order) => {
          expect(order).toEqual(mockOrder);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/orders/1`);
      req.flush(mockOrder);

      await promise;
    });
  });
});
