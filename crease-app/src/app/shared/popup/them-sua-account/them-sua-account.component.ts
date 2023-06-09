import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DanhMucService } from 'src/app/danhmuc.services';

@Component({
  selector: 'them-sua-account-component',
  templateUrl: './them-sua-account.component.html',
})
export class ThemSuaAccount implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  id: any;
  address = '';
  email = '';
  fullName = '';
  idUser = '';
  phone = '';
  role = '';
  shop = '';
  userName = '';
  passWord = '';
  confirmPassword = '';
  isShowPassword = false;
  isToastOpen = false;
  messageToast: any;
  listShop: any = [];
  listSelect: any = [];
  constructor(
    private modal: ModalController,
    private loading: LoadingController,
    private dmService: DanhMucService
  ) {}

  async ngOnInit() {
    await this.loadData();
    if (this.type === 'edit') {
      this.id = this.data.id;
      this.userName = this.data.userName;
      this.fullName = this.data.fullName;
      this.email = this.data.email;
      this.phone = this.data.phone;
      this.address = this.data.address;
      this.role = this.data.role;
      this.listSelect = this.data.shop ? this.data.shop.split(',') : [];
    }
  }
  async loadData() {
    await this.isLoading();
    return new Promise((resolve, reject) => {
      this.dmService.getOption(null, '/api/v1/shop', '?status=1').subscribe(
        (res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.loading.dismiss();
            resolve(res);
            this.listShop = res.body.RESULT;
          } else {
            this.listShop = [];
            this.loading.dismiss();
          }
        },
        () => {
          reject();
          this.loading.dismiss();
          console.error();
        }
      );
    });
  }

  showPassword() {
    this.isShowPassword = !this.isShowPassword;
  }
  async saveInfo() {
    if (this.validData()) {
      let entity = {
        userName: this.userName,
        passWord: this.passWord,
        email: this.email,
        phone: this.phone,
        address: this.address,
        fullName: this.fullName,
        role: this.role,
        shop: this.listSelect.toString(),
      };
      if (this.type === 'add') {
        if (entity.role == 'user' && entity.shop == '') {
          this.isToastOpen = true;
          this.messageToast = 'Vui lòng lựa chọn Cửa hàng';
        } else {
          await this.isLoading();
          this.dmService
            .postOption(entity, '/api/v1/account/create', '')
            .subscribe(
              (res: HttpResponse<any>) => {
                if (res.body.CODE === 200) {
                  this.isToastOpen = true;
                  this.messageToast = 'Tạo tài khoản thành công';
                  this.confirm();
                  this.loading.dismiss();
                } else {
                  this.loading.dismiss();
                  this.isToastOpen = true;
                  this.messageToast = 'Tạo tài khoản thành công';
                  this.cancel();
                }
              },
              () => {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Tạo tài khoản thành công';
                this.cancel();
                console.error();
              }
            );
        }
      } else {
        const id = this.data.id;
        if (entity.role == 'user' && entity.shop == '') {
          this.isToastOpen = true;
          this.messageToast = 'Vui lòng lựa chọn Cửa hàng';
        } else {
          await this.isLoading();
          this.dmService
            .putOption(
              {
                ...entity,
                id,
              },
              '/api/v1/account/update?id=' + id,
              ''
            )
            .subscribe(
              (res: HttpResponse<any>) => {
                if (res.body.CODE === 200) {
                  this.isToastOpen = true;
                  this.messageToast = 'Cập nhật tài khoản thành công';
                  this.loading.dismiss();
                  this.confirm();
                } else {
                  this.isToastOpen = true;
                  this.messageToast = 'Cập nhật tài khoản thất bại';
                  this.loading.dismiss();
                  this.cancel();
                }
              },
              () => {
                this.isToastOpen = true;
                this.messageToast = 'Cập nhật tài khoản thất bại';
                this.loading.dismiss();
                console.error();
              }
            );
        }
      }
    }
  }
  validData() {
    if (!this.role) {
      this.isToastOpen = true;
      this.messageToast = 'Vui lòng phân quyền tài khoản';
      return false;
    }
    if (this.type === 'add') {
      if (!this.passWord) {
        this.isToastOpen = true;
        this.messageToast = 'Vui lòng nhập mật khẩu!';
        return false;
      } else if (this.passWord && !this.confirmPassword) {
        this.isToastOpen = true;
        this.messageToast = 'Vui lòng Xác nhận mật khẩu!';
        return false;
      }
    }
    if (this.passWord !== this.confirmPassword) {
      this.isToastOpen = true;
      this.messageToast = 'Mật khẩu không khớp';
      return false;
    }
    return true;
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
