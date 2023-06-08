import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutRoutes } from './layout.routing';
import { ShopComponent } from '../pages/shop/shop.component';
import { Dashboard } from '../pages/dashboard/dashboard.component';
import { AccountComponent } from '../pages/account/account.component';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(LayoutRoutes)],
  declarations: [ShopComponent, Dashboard, AccountComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutModule {}
