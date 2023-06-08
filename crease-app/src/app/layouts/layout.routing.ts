import { Routes } from '@angular/router';
import { ShopComponent } from '../pages/shop/shop.component';
import { Dashboard } from '../pages/dashboard/dashboard.component';
import { AccountComponent } from '../pages/account/account.component';

export const LayoutRoutes: Routes = [
  {
    path: 'shop',
    component: ShopComponent,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'account',
    component: AccountComponent,
  },
];
