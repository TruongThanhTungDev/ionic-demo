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

@Component({
  selector: 'shop-component',
  templateUrl: 'shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  data: any;
  REQUEST_URL = '/api/v1/shop';
  shopcode = '';
  ftTen = '';
  isOpenDeleteShop = false;
  shopSeleted: any;
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private router: Router,
    private notificationService: NotificationService,
    private spinner: NgxSpinnerService,
    private loading: LoadingController,
    private modal: ModalController
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
  public loadData() {
    const payload = {
      page: 0,
      size: 1000,
      filter: this.filterData(),
      sort: ['id', 'asc'],
    };
    this.spinner.show();
    this.dmService.query(payload, this.REQUEST_URL).subscribe(
      (res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.data = res.body.RESULT.content;
          this.resetData();
        } else {
          this.notificationService.showError(res.body.MESSAGE, 'Fail');
          this.data = [];
        }
        this.spinner.hide();
      },
      () => {
        this.notificationService.showError('Đã có lỗi xảy ra', 'Fail');
        console.error();
        this.spinner.hide();
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
    this.dmService
      .delete(entity.id, this.REQUEST_URL + OPERATIONS.DELETE)
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.loadData();
          } else {
          }
        },
        () => {
          console.error();
        }
      );
  }
  async editShop() {
    const modal = await this.modal.create({
      component: ThemSuaShop,
    });
    modal.present();
  }
}
