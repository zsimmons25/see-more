import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, AuthUser, LoginResponse } from './auth.service';
import { environment } from '../../environments/environment';

declare const jest: any;

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: any;

  const mockUser: AuthUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    balance: 100
  };

  const mockLoginResponse: LoginResponse = {
    user: mockUser,
    token: 'test-token-123'
  };

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn()
    };

    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should start with no authenticated user', () => {
      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should load user from localStorage on init', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const newService = TestBed.inject(AuthService);

      expect(newService.currentUser()).toEqual(mockUser);
      expect(newService.isAuthenticated()).toBe(true);
    });

    it('should not authenticate if only token exists', () => {
      localStorage.setItem('token', 'test-token');

      const newService = TestBed.inject(AuthService);

      expect(newService.isAuthenticated()).toBe(false);
    });

    it('should not authenticate if only user exists', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));

      const newService = TestBed.inject(AuthService);

      expect(newService.isAuthenticated()).toBe(false);
    });
  });

  describe('login', () => {
    it('should make POST request to login endpoint', () => {
      service.login('test@example.com', 'password').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password' });
      req.flush(mockLoginResponse);
    });

    it('should store token and user on successful login', async () => {
      const promise = new Promise<void>((resolve) => {
        service.login('test@example.com', 'password').subscribe(() => {
          expect(localStorage.getItem('token')).toBe('test-token-123');
          expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockLoginResponse);

      await promise;
    });

    it('should update signals on successful login', async () => {
      const promise = new Promise<void>((resolve) => {
        service.login('test@example.com', 'password').subscribe(() => {
          expect(service.currentUser()).toEqual(mockUser);
          expect(service.isAuthenticated()).toBe(true);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockLoginResponse);

      await promise;
    });

    it('should return the login response', async () => {
      const promise = new Promise<void>((resolve) => {
        service.login('test@example.com', 'password').subscribe((response) => {
          expect(response).toEqual(mockLoginResponse);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockLoginResponse);

      await promise;
    });
  });

  describe('register', () => {
    it('should make POST request to register endpoint', () => {
      service.register('John', 'Doe', 'test@example.com', 'password').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password'
      });
      req.flush(mockLoginResponse);
    });

    it('should store token and user on successful registration', async () => {
      const promise = new Promise<void>((resolve) => {
        service.register('John', 'Doe', 'test@example.com', 'password').subscribe(() => {
          expect(localStorage.getItem('token')).toBe('test-token-123');
          expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush(mockLoginResponse);

      await promise;
    });

    it('should update signals on successful registration', async () => {
      const promise = new Promise<void>((resolve) => {
        service.register('John', 'Doe', 'test@example.com', 'password').subscribe(() => {
          expect(service.currentUser()).toEqual(mockUser);
          expect(service.isAuthenticated()).toBe(true);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush(mockLoginResponse);

      await promise;
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      service.currentUser.set(mockUser);
      service.isAuthenticated.set(true);
    });

    it('should clear localStorage', () => {
      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should clear signals', () => {
      service.logout();

      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should navigate to login page', () => {
      service.logout();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('updateUserBalance', () => {
    beforeEach(() => {
      service.currentUser.set(mockUser);
    });

    it('should update user balance in signal', () => {
      service.updateUserBalance(250);

      expect(service.currentUser()?.balance).toBe(250);
    });

    it('should update user balance in localStorage', () => {
      service.updateUserBalance(250);

      const storedUser = JSON.parse(localStorage.getItem('user')!);
      expect(storedUser.balance).toBe(250);
    });

    it('should preserve other user properties', () => {
      service.updateUserBalance(250);

      const updatedUser = service.currentUser();
      expect(updatedUser?.id).toBe(mockUser.id);
      expect(updatedUser?.email).toBe(mockUser.email);
      expect(updatedUser?.firstName).toBe(mockUser.firstName);
      expect(updatedUser?.lastName).toBe(mockUser.lastName);
    });

    it('should do nothing if no user is logged in', () => {
      service.currentUser.set(null);

      service.updateUserBalance(250);

      expect(service.currentUser()).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });
});
