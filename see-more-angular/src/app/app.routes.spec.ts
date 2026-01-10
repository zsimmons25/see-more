import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

describe('App Routes', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should have routes defined', () => {
    expect(routes).toBeDefined();
    expect(routes.length).toBeGreaterThan(0);
  });

  it('should redirect empty path to about', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/about');
  });

  it('should have about route', () => {
    const route = routes.find(r => r.path === 'about');
    expect(route).toBeDefined();
    expect(route?.component).toBeDefined();
  });

  it('should have login route', () => {
    const route = routes.find(r => r.path === 'login');
    expect(route).toBeDefined();
    expect(route?.component).toBeDefined();
  });

  it('should have register route', () => {
    const route = routes.find(r => r.path === 'register');
    expect(route).toBeDefined();
    expect(route?.component).toBeDefined();
  });

  it('should have cart route', () => {
    const route = routes.find(r => r.path === 'cart');
    expect(route).toBeDefined();
    expect(route?.component).toBeDefined();
  });

  it('should have orders lazy route', () => {
    const route = routes.find(r => r.path === 'orders');
    expect(route).toBeDefined();
    expect(route?.loadComponent).toBeDefined();
  });

  it('should have product lazy route with parameter', () => {
    const route = routes.find(r => r.path === 'product/:name');
    expect(route).toBeDefined();
    expect(route?.loadComponent).toBeDefined();
  });

  it('should have profile lazy route', () => {
    const route = routes.find(r => r.path === 'profile');
    expect(route).toBeDefined();
    expect(route?.loadComponent).toBeDefined();
  });

  it('should redirect wildcard route to about', () => {
    const wildcardRoute = routes.find(r => r.path === '**');
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBe('about');
  });
});
