import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MENU_MKT, MENU_USER, ROUTES } from '../shared/utils/data';
import { LocalStorageService } from 'ngx-webstorage';
import { Location } from '@angular/common';
import { Store, select } from '@ngrx/store';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  location: Location;
  isChange: any;
  customTitle: any;
  shop: any;
  shopInfo: any;
  listMenu: any;
  constructor(
    private router: Router,
    private local: LocalStorageService,
    location: Location,
    private store: Store<any>
  ) {
    this.location = location;
    this.shop = this.local.retrieve('shop');
    // this.setMenu();
  }
  get info() {
    return this.local.retrieve('authenticationToken');
  }
  get isAdmin() {
    return this.info.role === 'admin';
  }
  get isMarketing() {
    return this.info.role === 'marketing';
  }
  get isUser() {
    return this.info.role === 'user';
  }
  get infoShop() {
    return this.local.retrieve('shop');
  }
  // get listMenu() {
  //   if (this.info.role === 'admin') {
  //     return ROUTES
  //   } else if(this.info.role === 'user') {}

  // }
  get isShowMenu() {
    return (
      (this.info.role === 'admin' && this.infoShop) ||
      this.info.role === 'marketing' ||
      this.info.role === 'user'
    );
  }
  get titleHeader() {
    var title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === '#') {
      title = title.slice(1);
    }

    if (title.split('?')[0] === '/data' && title.split('?')[1]) {
      return 'Đơn hàng ' + title.split('?')[1].split('=')[1];
    }
    const listMenuItem = [
      { ma: '/costType', title: 'Loại chi phí' },
      { ma: '/work', title: 'Chấm công' },
      { ma: '/account', title: 'Tài khoản' },
      { ma: '/order-config', title: 'Cấu hình đơn hàng' },
      { ma: '/cost', title: 'Bản ghi chi phí' },
      { ma: '/shop', title: 'Danh sách cửa hàng' },
      { ma: '/cost-marketing', title: 'Chi phí Marketing' },
      { ma: '/utm-statistic', title: 'Thống kê UTM' },
      { ma: '/utm-medium', title: 'Cấu hình UTM' },
      { ma: '/statiscal-revenue', title: 'Thống kê doanh thu' },
      { ma: '/statiscal-cost', title: 'Thống kê chi phí' },
      { ma: '/statistic-performance-sale', title: 'Thống kê hiệu suất sale' },
      { ma: '/kho/quan-ly-san-pham', title: 'Quản lý sản phẩm' },
      { ma: '/kho/nhap-hang', title: 'Nhập hàng' },
      { ma: '/kho/xuat-hang', title: 'Xuất hàng' },
      { ma: '/dashboard', title: 'Bảng điều khiển' },
      { ma: '/kho/lich-su-xuat-nhap', title: 'Lịch sử nhập xuất' },
      { ma: '/kho/quan-ly-kho', title: 'Cấu hình kho hàng' },
      { ma: '/kho/hang-loi', title: 'Hàng lỗi' },
    ];
    for (let i = 0; i < listMenuItem.length; i++) {
      if (listMenuItem[i].ma === title.split('?')[0]) {
        return listMenuItem[i].title;
      }
    }
    return 'Bảng điều khiển';
  }
  ngOnInit(): void {
    this.store.subscribe((state) => {
      this.isChange = state.common.isBackHeader;
      this.customTitle = state.common.titleCustom;
      this.shopInfo = state.common.shopInfo;
      if (this.shopInfo || this.isMarketing) {
        this.setMenu();
      }
    });
  }

  setMenu() {
    if (this.isAdmin) {
      this.listMenu = ROUTES;
    } else if (this.isUser) {
      console.log('2 :>> ', 2);
      this.listMenu = MENU_USER;
    } else {
      console.log('1 :>> ', 1);
      this.listMenu = MENU_MKT;
    }
  }

  logout() {
    this.router.navigate(['/login']);
    this.store.dispatch({
      type: 'SET_SHOP_INFO',
      payload: null,
    });
  }
  toHomePage() {
    this.router.navigate(['/shop']);
  }
  handleBackHeader() {
    this.store.dispatch({
      type: 'CHANGE_HEADER',
      payload: {
        title: '',
        state: false,
      },
    });
  }
}
