import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { HeaderComponent } from './header.component';
import { SidebarService } from '../../core/sidebar.service';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let sidebarServiceMock: any;
  let authServiceMock: any;
  let cartServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    sidebarServiceMock = {
      isOpen: signal(false),
      toggle: vi.fn(),
      close: vi.fn()
    };

    authServiceMock = {
      isAuthenticated: signal(false),
      logout: vi.fn()
    };

    cartServiceMock = {
      itemCount: signal(0)
    };

    routerMock = {
      navigate: vi.fn(),
      createUrlTree: vi.fn(),
      serializeUrl: vi.fn(),
      events: of()
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: SidebarService, useValue: sidebarServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleSidebar', () => {
    it('should call sidebarService.toggle', () => {
      component.toggleSidebar();

      expect(sidebarServiceMock.toggle).toHaveBeenCalled();
    });
  });

  describe('user dropdown', () => {
    it('should toggle user dropdown visibility', () => {
      expect(component.showUserDropdown()).toBe(false);

      component.toggleUserDropdown();
      expect(component.showUserDropdown()).toBe(true);

      component.toggleUserDropdown();
      expect(component.showUserDropdown()).toBe(false);
    });

    it('should close user dropdown', () => {
      component.showUserDropdown.set(true);

      component.closeUserDropdown();

      expect(component.showUserDropdown()).toBe(false);
    });
  });

  describe('navigateToProfile', () => {
    it('should close dropdown and navigate to profile', () => {
      component.showUserDropdown.set(true);

      component.navigateToProfile();

      expect(component.showUserDropdown()).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/profile']);
    });
  });

  describe('signOut', () => {
    it('should close dropdown and call authService.logout', () => {
      component.showUserDropdown.set(true);

      component.signOut();

      expect(component.showUserDropdown()).toBe(false);
      expect(authServiceMock.logout).toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should navigate to login page', () => {
      component.signIn();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
