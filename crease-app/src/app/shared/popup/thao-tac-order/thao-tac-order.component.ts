import { Component, Input } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Plugin } from '../../utils/plugins';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'thao-tac-order',
  templateUrl: 'thao-tac-order.component.html',
})
export class ThaoTacOrder {
  @Input() shopCode: any;
  @Input() listWork: any;
  REQUEST_WORK_URL = '/api/v1/work';
  REQUEST_DATA_URL = '/api/v1/data';
  status = 0;
  info: any;
  listUser: any[] = [];
  isToastOpen = false;
  messageToast: any;
  plugins = new Plugin();
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
  }
  get isHideOption() {
    return this.info.role === 'admin' || this.info.role === 'user';
  }
  public async getUserActive() {
    await this.isLoading();
    this.dmService
      .getOption(null, this.REQUEST_WORK_URL, '/getAllActive')
      .subscribe(
        (res: HttpResponse<any>) => {
          this.listUser = res.body.RESULT;
          this.loading.dismiss();
        },
        (error: any) => {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra';
        }
      );
  }
  async assignWork() {
    this.listWork.forEach((unitItem: any) => {
      unitItem.dateChanged = moment(new Date()).format('YYYYMMDDHHmmss');
      unitItem.dateChangedOnly = moment(new Date()).format('YYYYMMDD');
      unitItem.status = this.status;
      if (Number(unitItem.status) === 6) unitItem.price = 0;
    });

    const list: any[] = [];
    this.listWork.forEach((element: any) => {
      list.push(element.id);
    });

    const entity = {
      dataList: list,
      status: this.status,
    };
    await this.isLoading();
    this.dmService
      .postOption(entity, this.REQUEST_DATA_URL, '/updateStatusDataList')
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.isToastOpen = true;
            this.messageToast =
              res.body.MESSAGE.toUpperCase() !== 'ok'.toUpperCase()
                ? res.body.MESSAGE
                : 'Giao việc thành công';
          } else {
            this.isToastOpen = true;
            this.messageToast = res.body.MESSAGE
              ? res.body.MESSAGE
              : 'Giao việc thất bại';
          }
          this.loading.dismiss();
          this.confirm();
        },
        (error: any) => {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = error.body.MESSAGE
            ? error.body.MESSAGE
            : 'Có lỗi xảy ra, vui lòng thử lại';
        }
      );
  }
  setOpen(open: boolean) {
    this.isToastOpen = open;
  }
  async cancel() {
    this.modal.dismiss();
  }
  confirm() {
    this.modal.dismiss(null, 'confirm');
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
