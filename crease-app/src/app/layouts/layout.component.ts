import {
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { MENU_MKT, MENU_USER, ROUTES } from '../shared/utils/data';
import { LocalStorageService } from 'ngx-webstorage';
import { Location } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { DanhMucService } from '../danhmuc.services';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit, OnChanges {
  location: Location;
  isChange: any;
  customTitle: any;
  shop: any;
  shopInfo: any;
  shopCode: any;
  info: any;
  listMenu: any;
  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    location: Location,
    private store: Store<any>,
    private dmService: DanhMucService
  ) {
    this.location = location;
    this.shop = this.localStorage.retrieve('shop');
    this.info = this.localStorage.retrieve('authenticationToken');
    this.shopCode = this.localStorage.retrieve('shopCode');
    this.setMenu();
    this.dmService.getClickEvent().subscribe(() => {
      this.shop = this.localStorage.retrieve('shop');
      this.shopCode = this.localStorage.retrieve('shopCode');
      if (this.shopCode) {
        this.setMenu();
        this.loadData(this.listMenu);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.shopCode) {
      console.log('1 :>> ', 1);
    }
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
    return this.localStorage.retrieve('shop');
  }
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
    });
  }

  ngAfterViewInit(): void {}

  setMenu() {
    if (this.isAdmin) {
      this.listMenu = this.shopCode ? ROUTES : [];
    } else if (this.isMarketing) {
      this.listMenu = MENU_MKT;
    } else if (this.isUser) {
      this.listMenu = MENU_USER;
    }
  }

  logout() {
    this.router.navigate(['/login']);
    this.localStorage.clear();
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
  loadData(list: any): void {
    list.forEach((e: any) => {
      if (e.params) {
        e.params.shopCode = this.shopCode;
      }
      if (e.items.length > 0) {
        for (let i = 0; i < e.items.length; i++) {
          if (e.items[i].params) {
            e.items[i].params.shopCode = this.shopCode;
          }
        }
      }
    });
  }
}
