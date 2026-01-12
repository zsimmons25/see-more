import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { LoginComponent } from './login.component';
import { AuthService, LoginResponse, AuthUser } from '../../core/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: Partial<ActivatedRoute>;

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

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn()
    };

    routerMock = {
      navigate: vi.fn(),
      createUrlTree: vi.fn(),
      serializeUrl: vi.fn(),
      events: of()
    };

    activatedRouteMock = {
      snapshot: {
        queryParams: {}
      } as any
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(component.email()).toBe('');
      expect(component.password()).toBe('');
      expect(component.loading()).toBe(false);
      expect(component.error()).toBeNull();
    });

    it('should set returnUrl to /products by default', () => {
      expect(component.returnUrl()).toBe('/products');
    });

    it('should set returnUrl from query params', async () => {
      activatedRouteMock.snapshot!.queryParams['returnUrl'] = '/cart';

      const newFixture = TestBed.createComponent(LoginComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.ngOnInit();

      expect(newComponent.returnUrl()).toBe('/cart');
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.email.set('test@example.com');
      component.password.set('password123');
    });

    it('should set loading to true when submitting', () => {
      let subscribed = false;
      authServiceMock.login.mockReturnValue({
        subscribe: (nextOrObserver: any) => {
          if (!subscribed) {
            subscribed = true;
            expect(component.loading()).toBe(true);
          }
          if (typeof nextOrObserver === 'function') {
            nextOrObserver(mockLoginResponse);
          } else {
            nextOrObserver.next(mockLoginResponse);
            if (nextOrObserver.complete) nextOrObserver.complete();
          }
          return { unsubscribe: () => {} };
        }
      });

      component.onSubmit();
    });

    it('should clear error when submitting', () => {
      component.error.set('Previous error');
      authServiceMock.login.mockReturnValue(of(mockLoginResponse));

      component.onSubmit();

      expect(component.error()).toBeNull();
    });

    it('should call authService.login with email and password', () => {
      authServiceMock.login.mockReturnValue(of(mockLoginResponse));

      component.onSubmit();

      expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should navigate to returnUrl on successful login', async () => {
      authServiceMock.login.mockReturnValue(of(mockLoginResponse));
      component.returnUrl.set('/cart');

      component.onSubmit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(routerMock.navigate).toHaveBeenCalledWith(['/cart']);
    });

    it('should set loading to false after successful login', async () => {
      authServiceMock.login.mockReturnValue(of(mockLoginResponse));

      component.onSubmit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.loading()).toBe(false);
    });

    it('should set error message on login failure', async () => {
      const errorResponse = {
        error: { message: 'Invalid credentials' }
      };
      authServiceMock.login.mockReturnValue(throwError(() => errorResponse));

      component.onSubmit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.error()).toBe('Invalid credentials');
    });

    it('should use default error message if none provided', async () => {
      authServiceMock.login.mockReturnValue(throwError(() => ({})));

      component.onSubmit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.error()).toBe('Login failed. Please try again.');
    });

    it('should set loading to false after login failure', async () => {
      authServiceMock.login.mockReturnValue(throwError(() => ({})));

      component.onSubmit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.loading()).toBe(false);
    });

    it('should not navigate on login failure', async () => {
      authServiceMock.login.mockReturnValue(throwError(() => ({})));

      component.onSubmit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('goToRegister', () => {
    it('should navigate to register page', () => {
      component.goToRegister();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/register']);
    });
  });

  describe('form state', () => {
    it('should update email signal', () => {
      component.email.set('new@email.com');

      expect(component.email()).toBe('new@email.com');
    });

    it('should update password signal', () => {
      component.password.set('newPassword');

      expect(component.password()).toBe('newPassword');
    });
  });
});
