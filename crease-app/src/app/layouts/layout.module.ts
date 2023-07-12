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
import { LoaiChiPhiComponent } from '../pages/loai-chi-phi/loai-chi-phi.component';
import { SideBarComponent } from '../shared/component/sidebar/sidebar.component';
import { CauHinhUtmComponent } from '../pages/cau-hinh-utm/cau-hinh-utm-component';
import { CostRecordComponent } from '../pages/ban-ghi-chi-phi/ban-ghi-chi-phi.component';
import { CostMarketingComponent } from '../pages/cost-marketing/cost.marketing.component';
import { CallLogsStatisticComponent } from '../pages/callLogs-statistic/callLogs-statistic.component';
import { UtmStatisticComponent } from '../pages/utm-statistic-marketing/utm-statistic-marketing.component';
import { CauhinhKhoComponent } from '../pages/kho/cau-hinh-kho/cau-hinh-kho.component';
import { StatiscalRevenue } from '../pages/statiscal-revenue/statiscal-revenue.component';
import { StatiscalCostComponent } from '../pages/statiscal-cost/statiscal-cost.component';
import { OrderComponent } from '../pages/order/order.component';
import { OrderStatisticComponent } from '../pages/statiscal-order/order-statistic.component';
import { lichsunhapxuatComponent } from '../pages/kho/lich-su-xuat-nhap/lich-su-nhap-xuat.component';
import { NhapHangComponent } from '../pages/kho/nhap-hang/nhap-hang.component';
import { DataOrderComponent } from '../pages/data-order/data-order.component';
import { UtmStatisticSaleComponent } from '../pages/utm-statistic-sale/utm-statistic-sale.component';
import { XuatHangComponent } from '../pages/kho/xuat-hang/xuat-hang.component';
import { HangLoiComponent } from '../pages/kho/hang-loi/hang-loi.component';

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
    LoaiChiPhiComponent,
    CauHinhUtmComponent,
    CostRecordComponent,
    DatePickerComponent,
    ProgressDateComponent,
    SideBarComponent,
    CostMarketingComponent,
    CallLogsStatisticComponent,
    UtmStatisticComponent,
    CauhinhKhoComponent,
    StatiscalRevenue,
    StatiscalCostComponent,
    OrderComponent,
    OrderStatisticComponent,
    lichsunhapxuatComponent,
    NhapHangComponent,
    DataOrderComponent,
    UtmStatisticSaleComponent,
    XuatHangComponent,
    HangLoiComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutModule {}
