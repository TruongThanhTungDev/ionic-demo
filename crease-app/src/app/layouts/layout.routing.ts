import { Routes } from '@angular/router';
import { ShopComponent } from '../pages/shop/shop.component';
import { Dashboard } from '../pages/dashboard/dashboard.component';
import { AccountComponent } from '../pages/account/account.component';
import { WorkComponent } from '../pages/work/work.component';
import { LoaiChiPhiComponent } from '../pages/loai-chi-phi/loai-chi-phi.component';
import { CauHinhUtmComponent } from '../pages/cau-hinh-utm/cau-hinh-utm-component';
import { CostRecordComponent } from '../pages/ban-ghi-chi-phi/ban-ghi-chi-phi.component';
import { CostMarketingComponent } from '../pages/cost-marketing/cost.marketing.component';
import { CallLogsStatisticComponent } from '../pages/callLogs-statistic/callLogs-statistic.component';
import { UtmStatisticComponent } from '../pages/utm-statistic-marketing/utm-statistic-marketing.component';
import { CauhinhKhoComponent } from '../pages/kho/cau-hinh-kho/cau-hinh-kho.component';

import { StatiscalCostComponent } from '../pages/statiscal-cost/statiscal-cost.component';
import { OrderComponent } from '../pages/order/order.component';
import { OrderStatisticComponent } from '../pages/statiscal-order/order-statistic.component';
import { lichsunhapxuatComponent } from '../pages/kho/lich-su-xuat-nhap/lich-su-nhap-xuat.component';
import { NhapHangComponent } from '../pages/kho/nhap-hang/nhap-hang.component';
import { DataOrderComponent } from '../pages/data-order/data-order.component';
import { UtmStatisticSaleComponent } from '../pages/utm-statistic-sale/utm-statistic-sale.component';
import { XuatHangComponent } from '../pages/kho/xuat-hang/xuat-hang.component';
import { HangLoiComponent } from '../pages/kho/hang-loi/hang-loi.component';
import { QuanLiSanPhamComponent } from '../pages/quan-li-san-pham/quan-li-san-pham.component';
import { StatiscalRevenueComponent } from '../pages/statiscal-revenue/statiscal-revenue.component';
import { StatisticGenaral } from '../pages/statistics-genaral/statistics-genaral.component';

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
    data: {
      code: 'account',
    },
  },
  {
    path: 'work',
    component: WorkComponent,
    data: {
      code: 'work',
    },
  },
  {
    path: 'cost-type',
    component: LoaiChiPhiComponent,
  },
  {
    path: 'utm-medium',
    component: CauHinhUtmComponent,
  },
  {
    path: 'cost',
    component: CostRecordComponent,
  },
  {
    path: 'cost-marketing',
    component: CostMarketingComponent,
  },
  {
    path: 'calllogs',
    component: CallLogsStatisticComponent,
  },
  {
    path: 'utm-statistic',
    component: UtmStatisticComponent,
  },
  {
    path: 'kho/quan-ly-kho',
    component: CauhinhKhoComponent,
  },
  {
    path: 'statiscal-cost',
    component: StatiscalCostComponent,
  },
  {
    path: 'data',
    component: OrderComponent,
  },
  {
    path: 'order-shipping',
    component: OrderStatisticComponent,
  },
  {
    path: 'kho/lich-su-nhap-xuat',
    component: lichsunhapxuatComponent,
  },
  {
    path: 'kho/nhap-hang',
    component: NhapHangComponent,
  },
  {
    path: 'kho/hang-loi',
    component: HangLoiComponent,
  },
  {
    path: 'kho/xuat-hang',
    component: XuatHangComponent,
  },
  {
    path: 'data-after-order',
    component: DataOrderComponent,
  },
  {
    path: 'statistic-performance-sale',
    component: UtmStatisticSaleComponent,
  },
  {
    path: 'kho/quan-ly-san-pham',
    component: QuanLiSanPhamComponent,
  },
  {
    path: 'kho/quan-ly-san-pham',
    component: QuanLiSanPhamComponent,
  },
  {
    path: 'statiscal-revenue',
    component: StatiscalRevenueComponent,
  },
  {
    path: 'statistics-genaral',
    component: StatisticGenaral,
  },
];
