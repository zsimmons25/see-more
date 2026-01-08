  import { Injectable, signal } from '@angular/core';
  import { BehaviorSubject, Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root',
  })
  export class SidebarService {
    private isOpenSubject = new BehaviorSubject<boolean>(false);

    isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();

    isOpen = signal<boolean>(false);

    toggle(): void {
      const newState = !this.isOpenSubject.value;
      this.isOpenSubject.next(newState);
      this.isOpen.set(newState);
    }

    open(): void {
      this.isOpenSubject.next(true);
      this.isOpen.set(true);
    }

    close(): void {
      this.isOpenSubject.next(false);
      this.isOpen.set(false);
    }

    getState(): boolean {
      return this.isOpenSubject.value;
    }
  }