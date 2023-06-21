import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { HttpResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/plugins/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingController } from '@ionic/angular';
import { OPERATIONS } from 'src/app/app.constant';
import { ModalController } from '@ionic/angular';
import { ThemSuaShop } from 'src/app/shared/popup/them-sua-shop/them-sua-shop.component';
import { Store } from '@ngrx/store';

@Component({
  selector: 'shop-component',
  templateUrl: 'shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  data: any;
  REQUEST_URL = '/api/v1/shop';
  shopCode = '';
  ftTen = '';
  isOpenDeleteShop = false;
  shopSeleted: any;
  isToastOpen: any;
  messageToast: any;
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private router: Router,
    private loading: LoadingController,
    private modal: ModalController,
    private store: Store<any>
  ) {}
  public actionForDelete = [
    {
      text: 'Hủy',
      role: 'cancel',
      handler: () => {},
    },
    {
      text: 'Đồng ý',
      role: 'confirm',
      handler: () => {
        this.deleteShop(this.shopSeleted);
      },
    },
  ];
  ngOnInit() {
    this.loadData();
  }
  public async loadData() {
    const payload = {
      page: 0,
      size: 1000,
      filter: this.filterData(),
      sort: ['id', 'asc'],
    };
    await this.isLoading();
    this.dmService.query(payload, this.REQUEST_URL).subscribe(
      (res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.data = res.body.RESULT.content;
          this.resetData();
          this.loading.dismiss();
        } else {
          this.isToastOpen = true;
          this.messageToast = 'Lấy danh sách cửa hàng thất bại';
          this.data = [];
          this.loading.dismiss();
        }
      },
      () => {
        this.isToastOpen = true;
        this.messageToast = 'Lấy danh sách cửa hàng thất bại';
        console.error();
        this.loading.dismiss();
        this.data = [];
      }
    );
  }

  public filterData() {
    const filter = [];
    filter.push('id>0');
    if (this.ftTen) {
      filter.push(`name=="*${this.ftTen.trim()}*"`);
    }
    return filter.join(';');
  }
  public selectRow(item: any) {
    this.localStorage.store('shop', item);
    this.localStorage.store('shopCode', item.code);
    this.store.dispatch({
      type: 'SET_SHOP_INFO',
      payload: item,
    });
    this.router.navigate(['/dashboard']);
    this.dmService.sendClickEvent();
  }
  resetData() {
    this.ftTen = '';
  }
  openDeleteShop(item: any, isOpen: boolean) {
    this.isOpenDeleteShop = isOpen;
    this.shopSeleted = item;
  }
  deleteShop(entity: any) {
    this.isLoading();
    this.dmService
      .delete(entity.id, this.REQUEST_URL + OPERATIONS.DELETE)
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.loadData();
            this.isToastOpen = true;
            this.messageToast = 'Xóa cửa hàng thành công';
            this.loading.dismiss();
          } else {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Xóa cửa hàng thất bại';
          }
        },
        () => {
          this.isToastOpen = true;
          this.loading.dismiss();
          console.error();
          this.messageToast = 'Xóa cửa hàng thất bại';
        }
      );
  }
  async editShop(item: any) {
    const modal = await this.modal.create({
      component: ThemSuaShop,
      componentProps: {
        title: 'Xử lý thông tin cửa hàng',
        data: item,
        type: 'edit',
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
  }
  async addShop() {
    const modal = await this.modal.create({
      component: ThemSuaShop,
      componentProps: {
        title: 'Tạo cửa hàng',
        data: null,
        type: 'add',
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
  }
  public async isLoading() {
    const isLoading = await this.loading.create({
      spinner: 'circles',
      keyboardClose: true,
      message: 'Đang tải',
      translucent: true,
    });
    return await isLoading.present();
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
