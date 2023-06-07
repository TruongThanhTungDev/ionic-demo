import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DanhMucService } from 'src/app/danhmuc.services';
@Component({
  selector: 'them-sua-shop',
  templateUrl: 'them-sua-shop.component.html',
})
export class ThemSuaShop implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  name: any;
  id: any;
  code: any;
  note: any;
  status: any;
  url: any;
  isToastOpen = false;
  messageToast: any;
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.name = this.data.name;
      this.code = this.data.code;
      this.note = this.data.note;
      this.status = this.data.status;
      this.url = this.data.url;
    }
  }
  async saveInfo() {
    const entity = {
      id: this.data ? this.data.id : 0,
      code: this.code ? this.code.trim().toUpperCase() : '',
      name: this.name ? this.name.trim() : '',
      status: this.status,
      url: this.url,
      note: this.note,
    };
    await this.isLoading();
    if (this.type === 'edit') {
      this.dmService
        .putOption(entity, '/api/v1/shop/', 'update?id=' + entity.id)
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.body.CODE === 200) {
              this.confirm();
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = 'Cập nhật cửa hàng thành công';
            } else {
              this.cancel();
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = 'Cập nhật cửa hàng thất bại';
            }
          },
          () => {
            console.error();
            this.loading.dismiss();
            this.messageToast = 'Cập nhật cửa hàng thất bại';
          }
        );
    } else {
      delete entity.id;
      this.dmService.postOption(entity, '/api/v1/shop/', 'create').subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.confirm();
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Thêm mới cửa hàng thành công';
          } else {
            this.cancel();
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Thêm mới cửa hàng thất bại';
          }
        },
        () => {
          console.error();
          this.loading.dismiss();
          this.messageToast = 'Thêm mới cửa hàng thất bại';
        }
      );
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
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(null, 'confirm');
  }
}
