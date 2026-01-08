import { Routes } from '@angular/router';
import { AboutComponent } from './features/about/about.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full',
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/orders.component').then(
        (m) => m.OrdersComponent
      ),
  },
  {
    path: 'product/:name',
    loadComponent: () =>
      import('./features/product/product.component').then(
        (m) => m.ProductComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'about',
  },
];
