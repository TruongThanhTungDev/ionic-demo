import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';

@Component({
  selector: 'checkout-cmp',
  templateUrl: './check-out.component.html',
})
export class CheckOutComponent implements OnInit {
  checkOut = moment(new Date()).format('YYYYMMDDHHmmss');
  data: any = {};
  REQUEST_URL = '/api/v1/work/infoCheckout';
  info: any;
  isToastOpen = false;
  messageToast = '';
  constructor(
    private modalCtrl: ModalController,
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
  }
  ngOnInit(): void {
    this.getInfo();
  }

  async getInfo() {
    const token = this.localStorage.retrieve('authenticationtoken');
    await this.isLoading();
    this.dmService
      .postOption({ nhanVienId: token.id }, '/api/v1/work/checkWorkActive', '')
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.data = res.body.RESULT;
            if (this.data) {
              this.data.timeIn = this.data.timeIn
                ? moment(this.data.timeIn, 'YYYYMMDDHHmmss').format(
                    'HH:mm:ss DD/MM/YYYY'
                  )
                : '';
              this.checkOut = this.checkOut
                ? moment(this.checkOut, 'YYYYMMDDHHmmss').format(
                    'HH:mm:ss DD/MM/YYYY'
                  )
                : '';
            }
            this.loading.dismiss();
          } else {
            this.loading.dismiss();
          }
        },
        () => {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
        }
      );
  }
  activeCall(): void {
    const callInfo = this.localStorage.retrieve('callInfo');
    if (callInfo) {
      this.dmService
        .getOption(null, '/api/v1/call/active?id=' + callInfo.id, '')
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.body.CODE === 200) {
              this.localStorage.clear('callInfo');
              this.isToastOpen = true;
              this.messageToast = 'Đóng ext call thành công';
            }
          },
          () => {
            console.error();
          }
        );
    }
  }
  async handleCheckOut() {
    await this.isLoading();
    let time = moment(new Date()).format('YYYYMMDDHHmmss');
    let checkOutEntity = {
      id: this.data.id,
      timeOut: time,
      totalOrder: this.data.totalOrder,
      successOrder: this.data.successOrder,
      processedOrder: this.data.processedOrder,
      onlyOrder: this.data.onlyOrder,
      processedOnlyOrder: this.data.processedOnlyOrder,
    };
    this.dmService
      .postOption(checkOutEntity, '/api/v1/work/checkOut/', '')
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Check Out thành công';
            this.localStorage.store('check_work_active', false);
            this.localStorage.store('shopcode', '');
            this.activeCall();
            this.confirm();
          } else {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Check Out thất bại';
          }
        },
        () => {
          this.loading.dismiss();
          console.error();
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
        }
      );
  }
  setOpen(open: boolean) {
    this.isToastOpen = open;
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
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
}
