import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { SidebarComponent } from './sidebar.component';
import { SidebarService } from '../../core/sidebar.service';
import { AuthService } from '../../core/auth.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let sidebarServiceMock: any;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    sidebarServiceMock = {
      isOpen: signal(false),
      close: vi.fn()
    };

    authServiceMock = {
      isAuthenticated: signal(false),
      logout: vi.fn()
    };

    routerMock = {
      navigate: vi.fn(),
      createUrlTree: vi.fn(),
      serializeUrl: vi.fn(),
      events: of()
    };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: SidebarService, useValue: sidebarServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('should call sidebarService.close', () => {
      component.close();

      expect(sidebarServiceMock.close).toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('should call authService.logout and close sidebar', () => {
      component.signOut();

      expect(authServiceMock.logout).toHaveBeenCalled();
      expect(sidebarServiceMock.close).toHaveBeenCalled();
    });
  });
});
