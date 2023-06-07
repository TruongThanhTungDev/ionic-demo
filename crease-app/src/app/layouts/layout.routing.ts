import { Routes } from '@angular/router';
import { ShopComponent } from '../pages/shop/shop.component';
import { Dashboard } from '../pages/dashboard/dashboard.component';

export const LayoutRoutes: Routes = [
  {
    path: 'shop',
    component: ShopComponent,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
];
