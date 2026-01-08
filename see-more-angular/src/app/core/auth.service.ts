  import { Injectable, signal } from '@angular/core';
  import { BehaviorSubject, Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root',
  })
  export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

    // Signal version for reactive templates
    isAuthenticated = signal<boolean>(false);

    login(): void {
      this.isAuthenticatedSubject.next(true);
      this.isAuthenticated.set(true);
      console.log('User logged in');
    }

    logout(): void {
      this.isAuthenticatedSubject.next(false);
      this.isAuthenticated.set(false);
      console.log('User logged out');
    }

    getAuthState(): boolean {
      return this.isAuthenticatedSubject.value;
    }
  }