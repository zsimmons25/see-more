import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService, LoginResponse, AuthUser } from '../../core/auth.service';

declare const jest: any;

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let routerMock: any;

  const mockUser: AuthUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    balance: 0
  };

  const mockRegisterResponse: LoginResponse = {
    user: mockUser,
    token: 'test-token-123'
  };

  beforeEach(async () => {
    authServiceMock = {
      register: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(component.firstName()).toBe('');
      expect(component.lastName()).toBe('');
      expect(component.email()).toBe('');
      expect(component.password()).toBe('');
      expect(component.loading()).toBe(false);
      expect(component.error()).toBeNull();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.email.set('test@example.com');
      component.password.set('password123');
    });

    it('should set loading to true when submitting', () => {
      authServiceMock.register.mockReturnValue(of(mockRegisterResponse));

      component.onSubmit();

      expect(component.loading()).toBe(true);
    });

    it('should clear error when submitting', () => {
      component.error.set('Previous error');
      authServiceMock.register.mockReturnValue(of(mockRegisterResponse));

      component.onSubmit();

      expect(component.error()).toBeNull();
    });

    it('should call authService.register with form values', () => {
      authServiceMock.register.mockReturnValue(of(mockRegisterResponse));

      component.onSubmit();

      expect(authServiceMock.register).toHaveBeenCalledWith(
        'John',
        'Doe',
        'test@example.com',
        'password123'
      );
    });

    it('should navigate to products on successful registration', async () => {
      authServiceMock.register.mockReturnValue(of(mockRegisterResponse));

      component.onSubmit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should set loading to false after successful registration', async () => {
      authServiceMock.register.mockReturnValue(of(mockRegisterResponse));

      component.onSubmit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.loading()).toBe(false);
    });

    it('should set error message on registration failure', async () => {
      const errorResponse = {
        error: { message: 'Email already exists' }
      };
      authServiceMock.register.mockReturnValue(throwError(() => errorResponse));

      component.onSubmit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.error()).toBe('Email already exists');
    });

    it('should use default error message if none provided', async () => {
      authServiceMock.register.mockReturnValue(throwError(() => ({})));

      component.onSubmit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.error()).toBe('Registration failed. Please try again.');
    });

    it('should set loading to false after registration failure', async () => {
      authServiceMock.register.mockReturnValue(throwError(() => ({})));

      component.onSubmit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.loading()).toBe(false);
    });

    it('should not navigate on registration failure', async () => {
      authServiceMock.register.mockReturnValue(throwError(() => ({})));

      component.onSubmit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('goToLogin', () => {
    it('should navigate to login page', () => {
      component.goToLogin();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('form state', () => {
    it('should update firstName signal', () => {
      component.firstName.set('Jane');

      expect(component.firstName()).toBe('Jane');
    });

    it('should update lastName signal', () => {
      component.lastName.set('Smith');

      expect(component.lastName()).toBe('Smith');
    });

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
