import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutRoutes } from './layout.routing';
import { ShopComponent } from '../pages/shop/shop.component';
import { Dashboard } from '../pages/dashboard/dashboard.component';
import { AccountComponent } from '../pages/account/account.component';
import { WorkComponent } from '../pages/work/work.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePickerComponent } from '../shared/component/datepicker/datepicker.component';
import { ProgressDateComponent } from '../shared/component/progressDate/progress-date.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(LayoutRoutes),
    NgxPaginationModule,
  ],
  declarations: [
    ShopComponent,
    Dashboard,
    AccountComponent,
    WorkComponent,
    DatePickerComponent,
    ProgressDateComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutModule {}
