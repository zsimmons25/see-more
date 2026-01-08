  import { Component, inject, OnInit, OnDestroy } from '@angular/core';
  import { RouterLink, RouterLinkActive } from '@angular/router';
  import { SidebarService } from '../../core/sidebar.service';
  import { AuthService } from '../../core/auth.service';
  import { Subscription } from 'rxjs';

  @Component({
    selector: 'app-sidebar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
  })
  export class SidebarComponent implements OnInit, OnDestroy {
    private sidebarService = inject(SidebarService);
    private authService = inject(AuthService);
    private subscription?: Subscription;

    isOpen = this.sidebarService.isOpen;
    isAuthenticated = this.authService.isAuthenticated;

    ngOnInit(): void {
      this.subscription = this.sidebarService.isOpen$.subscribe((isOpen) => {
        console.log('Sidebar state changed:', isOpen);
      });
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }

    close(): void {
      this.sidebarService.close();
    }
  }