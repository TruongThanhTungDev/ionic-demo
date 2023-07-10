import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Plugin } from '../../utils/plugins';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'giao-viec',
  templateUrl: 'giao-viec.component.html',
})
export class GiaoViecOrder implements OnInit {
  @Input() shopCode: any;
  @Input() listWork: any;
  REQUEST_WORK_URL = '/api/v1/work';
  REQUEST_DATA_URL = '/api/v1/data';
  user: any;
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
  ngOnInit(): void {
    this.getUserActive();
  }
  public async getUserActive() {
    await this.isLoading();
    this.dmService
      .getOption(
        null,
        this.REQUEST_WORK_URL,
        '/getAllActive?shopCode=' + this.shopCode
      )
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
    const entity = {
      dataList: this.listWork.map((item: any) => {
        return {
          ...item,
          nhanVienId: parseInt(this.user),
          date: parseInt(
            moment(item.date, 'HH:mm:ss DD/MM/YYYY').format('YYYYMMDDHHmmss')
          ),
          dateChanged: moment(new Date()).format('YYYYMMDDHHmmss'),
          dateChangedOnly: moment(new Date()).format('YYYYMMDD'),
          status: item.status === 0 ? 1 : item.status,
          dataInfo: JSON.stringify(item.dataInfo),
          productIds: JSON.stringify(item.listProduct),
        };
      }),
    };
    await this.isLoading();
    this.dmService
      .postOption(entity, this.REQUEST_DATA_URL, '/assignWork')
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
            this.messageToast = 'Giao việc thất bại';
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
