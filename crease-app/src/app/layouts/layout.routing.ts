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
import { CauhinhKhoComponent } from '../pages/cau-hinh-kho/cau-hinh-kho.component';
import { StatiscalRevenue } from '../pages/statiscal-revenue/statiscal-revenue.component';

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
    path: 'statiscal-revenue',
    component: StatiscalRevenue,
  },
];
