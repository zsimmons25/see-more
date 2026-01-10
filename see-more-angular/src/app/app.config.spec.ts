import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { appConfig } from './app.config';

describe('App Config', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: appConfig.providers
    });
  });

  it('should have providers defined', () => {
    expect(appConfig.providers).toBeDefined();
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });

  it('should provide Router', () => {
    const router = TestBed.inject(Router);
    expect(router).toBeDefined();
  });

  it('should provide HttpClient', () => {
    const http = TestBed.inject(HttpClient);
    expect(http).toBeDefined();
  });
});
