import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../shared/utils/data';
import { LocalStorageService } from 'ngx-webstorage';
import { Location } from '@angular/common';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  location: Location;
  constructor(
    private router: Router,
    private local: LocalStorageService,
    location: Location
  ) {
    this.location = location;
  }
  get info() {
    return this.local.retrieve('authenticationToken');
  }
  get infoShop() {
    return this.local.retrieve('shop');
  }
  get listMenu() {
    return ROUTES;
  }
  get isShowMenu() {
    return this.info.role === 'admin' && this.infoShop;
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
  ngOnInit(): void {}
  logout() {
    this.router.navigate(['/login']);
  }
  toHomePage() {
    this.router.navigate(['/shop']);
  }
}
