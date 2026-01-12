import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ProfileComponent } from './profile.component';
import { ApiService, User, Order } from '../../core/api.service';
import { AuthService, AuthUser } from '../../core/auth.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let apiServiceMock: any;
  let authServiceMock: any;
  let routerMock: any;

  const mockAuthUser: AuthUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    balance: 500
  };

  const mockUser: User = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    balance: 500,
    memberSince: '2024-01-01'
  };

  const mockOrders: Order[] = [
    {
      id: '1',
      userId: '1',
      items: [],
      total: 100,
      status: 'completed',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    apiServiceMock = {
      getUser: vi.fn(),
      getOrders: vi.fn(),
      addFunds: vi.fn(),
      changePassword: vi.fn()
    };

    authServiceMock = {
      currentUser: signal<AuthUser | null>(null)
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should navigate to login if not authenticated', () => {
      authServiceMock.currentUser.set(null);

      component.ngOnInit();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should load user data if authenticated', async () => {
      authServiceMock.currentUser.set(mockAuthUser);
      apiServiceMock.getUser.mockReturnValue(of(mockUser));
      apiServiceMock.getOrders.mockReturnValue(of(mockOrders));

      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.user()).toEqual(mockUser);
      expect(component.loading()).toBe(false);
    });

    it('should load orders after loading user', async () => {
      authServiceMock.currentUser.set(mockAuthUser);
      apiServiceMock.getUser.mockReturnValue(of(mockUser));
      apiServiceMock.getOrders.mockReturnValue(of(mockOrders));

      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.orderHistory()).toEqual(mockOrders);
      expect(component.totalOrders()).toBe(1);
    });

    it('should handle user load error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      authServiceMock.currentUser.set(mockAuthUser);
      apiServiceMock.getUser.mockReturnValue(throwError(() => new Error('API Error')));

      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.loading()).toBe(false);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('totalSpent computed', () => {
    it('should calculate total spent from orders', () => {
      component.orderHistory.set([
        { ...mockOrders[0], total: 100 },
        { ...mockOrders[0], id: '2', total: 200 }
      ]);

      expect(component.totalSpent()).toBe(300);
    });
  });

  describe('add funds modal', () => {
    beforeEach(() => {
      component.user.set(mockUser);
    });

    it('should open add funds modal', () => {
      component.openAddFundsModal();

      expect(component.showAddFundsModal()).toBe(true);
      expect(component.fundsAmount()).toBe('');
      expect(component.fundsError()).toBeNull();
    });

    it('should close add funds modal', () => {
      component.showAddFundsModal.set(true);

      component.closeAddFundsModal();

      expect(component.showAddFundsModal()).toBe(false);
    });

    it('should set error for invalid amount', () => {
      component.fundsAmount.set('invalid');

      component.submitAddFunds();

      expect(component.fundsError()).toBe('Please enter a valid amount');
    });

    it('should set error for negative amount', () => {
      component.fundsAmount.set('-50');

      component.submitAddFunds();

      expect(component.fundsError()).toBe('Please enter a valid amount');
    });

    it('should add funds successfully', async () => {
      const updatedUser = { ...mockUser, balance: 600 };
      apiServiceMock.addFunds.mockReturnValue(of(updatedUser));
      component.fundsAmount.set('100');

      component.submitAddFunds();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(apiServiceMock.addFunds).toHaveBeenCalledWith('1', 100);
      expect(component.user()).toEqual(updatedUser);
      expect(component.showAddFundsModal()).toBe(false);
    });

    it('should handle add funds error', async () => {
      apiServiceMock.addFunds.mockReturnValue(throwError(() => new Error('API Error')));
      component.fundsAmount.set('100');

      component.submitAddFunds();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.fundsError()).toBe('Failed to add funds. Please try again.');
      expect(component.addingFunds()).toBe(false);
    });
  });

  describe('change password modal', () => {
    beforeEach(() => {
      component.user.set(mockUser);
    });

    it('should open change password modal', () => {
      component.openChangePasswordModal();

      expect(component.showChangePasswordModal()).toBe(true);
      expect(component.currentPassword()).toBe('');
      expect(component.newPassword()).toBe('');
      expect(component.confirmPassword()).toBe('');
      expect(component.passwordError()).toBeNull();
    });

    it('should close change password modal', () => {
      component.showChangePasswordModal.set(true);

      component.closeChangePasswordModal();

      expect(component.showChangePasswordModal()).toBe(false);
    });

    it('should validate current password is required', () => {
      component.currentPassword.set('');
      component.newPassword.set('newpass123');
      component.confirmPassword.set('newpass123');

      component.submitChangePassword();

      expect(component.passwordError()).toBe('Current password is required');
    });

    it('should validate new password length', () => {
      component.currentPassword.set('oldpass');
      component.newPassword.set('short');
      component.confirmPassword.set('short');

      component.submitChangePassword();

      expect(component.passwordError()).toBe('New password must be at least 6 characters');
    });

    it('should validate passwords match', () => {
      component.currentPassword.set('oldpass');
      component.newPassword.set('newpass123');
      component.confirmPassword.set('different');

      component.submitChangePassword();

      expect(component.passwordError()).toBe('Passwords do not match');
    });

    it('should change password successfully', async () => {
      const response = { message: 'Password changed successfully' };
      apiServiceMock.changePassword.mockReturnValue(of(response));
      component.currentPassword.set('oldpass');
      component.newPassword.set('newpass123');
      component.confirmPassword.set('newpass123');

      component.submitChangePassword();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(apiServiceMock.changePassword).toHaveBeenCalledWith('1', 'oldpass', 'newpass123');
      expect(component.passwordSuccess()).toBe('Password changed successfully');
      expect(component.changingPassword()).toBe(false);

      await new Promise(resolve => setTimeout(resolve, 2100));
      expect(component.showChangePasswordModal()).toBe(false);
    }, 10000);

    it('should handle change password error', async () => {
      const errorResponse = {
        error: { message: 'Current password is incorrect' }
      };
      apiServiceMock.changePassword.mockReturnValue(throwError(() => errorResponse));
      component.currentPassword.set('wrongpass');
      component.newPassword.set('newpass123');
      component.confirmPassword.set('newpass123');

      component.submitChangePassword();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(component.passwordError()).toBe('Current password is incorrect');
      expect(component.changingPassword()).toBe(false);
    }, 10000);
  });
});
