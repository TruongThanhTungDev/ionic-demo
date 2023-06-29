import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { OPERATIONS } from 'src/app/app.constant';
import { DanhMucService } from 'src/app/danhmuc.services';

@Component({
  selector: 'costTypePopup-cmp',
  templateUrl: './them-sua-loai-chi-phi.component.html',
})
export class ThemSuaCostTypeComponent implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  isToastOpen = false;
  messageToast: any;
  id = '';
  code = '';
  name = '';
  priod = 1;
  status = 1;
  isCountOrder = 0;
  REQUEST_URL = '/api/v1/costtype';
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private actionSheetCtrl: ActionSheetController
  ) {}
  get validData() {
    if (this.code == '') {
      this.isToastOpen = true;
      this.messageToast = 'Mã chi phí không được để trống';
      return false;
    }

    if (this.name == '') {
      this.isToastOpen = true;
      this.messageToast = 'Tên loại chi phí không được để trống';
      return false;
    }
    return true;
  }
  ngOnInit() {
    if (this.type === 'edit') {
      this.id = this.data.id;
      this.code = this.data.code;
      this.name = this.data.name;
      this.priod = this.data.priod;
      this.isCountOrder = this.data.isCountOrder;
      this.status = this.data.status;
    }
  }

  async saveInfo() {
    if (this.validData) {
      const payload = {
        id: this.id,
        code: this.code,
        name: this.name,
        priod: this.priod,
        status: this.status,
        isCountOrder: this.isCountOrder,
      };
      if (this.type === 'add') {
        await this.isLoading();
        this.dmService
          .postOption(payload, '/api/v1/costtype/create', '')
          .subscribe(
            (res: HttpResponse<any>) => {
              if (res.body.CODE === 200) {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = res.body.MESSAGE
                  ? res.body.MESSAGE
                  : 'Tạo Loại chi phí thành công';
                this.confirm();
              } else {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Tạo Loại chi phí thất bại';
                this.cancel();
              }
            },
            () => {
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau';
              console.error();
            }
          );
      } else {
        this.dmService
          .putOption(
            payload,
            this.REQUEST_URL + OPERATIONS.UPDATE,
            '?id=' + payload.id
          )
          .subscribe(
            (res: HttpResponse<any>) => {
              if (res.body.CODE === 200) {
                this.messageToast = res.body.MESSAGE
                  ? res.body.MESSAGE
                  : 'Cập nhật Loại chi phí thành công';
                this.confirm();
              } else {
                this.messageToast = res.body.MESSAGE
                  ? res.body.MESSAGE
                  : 'Cập nhật Loại chi phí thất bại';
                this.cancel();
              }
            },
            () => {
              this.isToastOpen = true;
              this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau';
              console.error();
            }
          );
      }
    }
  }
  async cancel() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Bạn có chắc muốn thoát không?',
      buttons: [
        {
          text: 'Đồng ý',
          role: 'confirm',
        },
        {
          text: 'Hủy',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();
    if (role === 'confirm') {
      this.modal.dismiss();
    }
  }

  confirm() {
    this.modal.dismiss(null, 'confirm');
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
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
