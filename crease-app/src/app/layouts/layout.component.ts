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
import { HttpResponse } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { CheckInComponent } from '../shared/popup/check-in/check-in.component';
import { CheckOutComponent } from '../shared/popup/check-out/check-out.component';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  location: Location;
  isChange: any;
  customTitle: any;
  shop: any;
  shopInfo: any;
  shopCode: any;
  info: any;
  listMenu: any;
  checkWorkActive = false;
  disableToggle = false;
  SHOP_URL = '/api/v1/shop';
  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    location: Location,
    private store: Store<any>,
    private dmService: DanhMucService,
    private modalCtrl: ModalController
  ) {
    this.location = location;
    this.shop = this.localStorage.retrieve('shop');
    this.info = this.localStorage.retrieve('authenticationToken');
    this.shopCode = this.localStorage.retrieve('shopcode');
    this.checkWorkActive = this.localStorage.retrieve('check_work_active');
    this.dmService.getClickEvent().subscribe(() => {
      this.shop = this.localStorage.retrieve('shop');
    });
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
      { ma: '/utm-statistic', title: 'Thống kê hiệu suất marketing' },
      { ma: '/data', title: 'Đơn hàng' },
      { ma: '/utm-medium', title: 'Cấu hình UTM' },
      { ma: '/statiscal-revenue', title: 'Thống kê doanh thu' },
      { ma: '/statiscal-cost', title: 'Thống kê chi phí' },
      { ma: '/order-shipping', title: 'Thống kê đơn hàng' },
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
      const loadingCompleted = state.common.isLoadCompleted;
      if (loadingCompleted) {
        this.shopCode = this.localStorage.retrieve('shopcode');
        if (this.info.role === 'admin' || this.info.role === 'marketing') {
          this.setMenu();
          this.loadData(this.listMenu);
        } else {
          this.loadShopList();
        }
      }
    });
    this.getAccountStatus();
  }

  ngAfterViewInit(): void {}

  setMenu() {
    if (this.isAdmin) {
      this.listMenu = this.shopCode ? ROUTES : [];
    } else if (this.isMarketing) {
      this.listMenu = MENU_MKT;
    } else if (this.isUser) {
      this.listMenu = [
        ...MENU_USER,
        {
          path: '/notF',
          title: this.shopInfo ? this.shopInfo.name : 'Đơn hàng',
          icon: 'fa fa-archive',
          class: '',
          role: '',
          params: '',
          show: true,
          items: [
            {
              path: '/data',
              title: 'Order',
              icon: 'nc-basket',
              class: '',
              role: 'user',
              params: { shopCode: this.shopCode },
            },
            {
              path: '/data-after-order',
              title: 'Đơn hàng',
              icon: 'nc-basket',
              class: '',
              role: 'user',
              params: { shopCode: this.shopCode },
            },
          ],
        },
      ];
    }
  }
  getAccountStatus(): void {
    this.disableToggle = true;
    const entity = {
      nhanVienId: this.info.id,
    };
    this.store.dispatch({
      type: 'SET_LOADING_COMPLETED',
      payload: false,
    });
    this.dmService
      .postOption(entity, '/api/v1/work/checkWorkActive', '')
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.checkWorkActive = true;
            this.localStorage.store('check_work_active', true);
            this.localStorage.store('call_info', res.body.RESULT.callInfo);
            this.localStorage.store('shopCode', res.body.RESULT.shopCode);
            this.store.dispatch({
              type: 'SET_LOADING_COMPLETED',
              payload: true,
            });
          } else {
            this.store.dispatch({
              type: 'SET_LOADING_COMPLETED',
              payload: true,
            });
            this.checkWorkActive = false;
          }
          this.disableToggle = false;
        },
        () => {
          this.store.dispatch({
            type: 'SET_LOADING_COMPLETED',
            payload: true,
          });
          this.checkWorkActive = false;
          this.disableToggle = false;
          console.error();
        }
      );
  }
  async onTriggerWorkActive() {
    if (this.checkWorkActive) {
      const modal = await this.modalCtrl.create({
        component: CheckInComponent,
        cssClass: 'modal-md',
      });
      modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (role === 'confirm') {
        this.checkWorkActive = true;
        this.store.dispatch({
          type: 'SET_RELOAD',
          payload: true,
        });
        // setTimeout(() => {
        //   window.location.reload();
        // }, 500);
      } else {
        this.checkWorkActive = false;
      }
    } else {
      const modal = await this.modalCtrl.create({
        component: CheckOutComponent,
        cssClass: 'modal-md',
      });
      modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (role === 'confirm') {
        this.checkWorkActive = false;
        this.store.dispatch({
          type: 'SET_RELOAD',
          payload: true,
        });
        // setTimeout(() => {
        //   window.location.reload();
        // }, 500);
      } else {
        this.checkWorkActive = true;
      }
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
  public loadShopList() {
    this.dmService.getOption(null, this.SHOP_URL, `?status=1`).subscribe(
      (res: HttpResponse<any>) => {
        this.shopInfo = res.body.RESULT[0];
        this.setMenu();
      },
      () => {
        console.error();
      }
    );
  }
}
