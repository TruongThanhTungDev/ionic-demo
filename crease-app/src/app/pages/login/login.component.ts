import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { MENU_MKT, MENU_USER } from 'src/app/shared/utils/data';

@Component({
  selector: 'login-page',
  templateUrl: 'login.component.html',
  styleUrls: [],
})
export class Login implements OnInit {
  username: any;
  password: any;
  language = 'vi';
  isShowPassword = false;
  isValidUsername = false;
  isValidPassword = false;
  isToastOpen: any;
  messageToast: any;
  constructor(
    private baseApi: DanhMucService,
    private router: Router,
    private localStorage: LocalStorageService,
    private loading: LoadingController,
    private store: Store<any>
  ) {}
  get isValid() {
    const pattern = /[^\w\s]/;
    if (!this.username.trim() && !this.password) {
      this.isToastOpen = true;
      this.messageToast = 'Vui lòng nhập thông tin đăng nhập';
      this.isValidUsername = true;
      this.isValidPassword = true;
      return false;
    } else if (!this.username.trim()) {
      this.isToastOpen = true;
      this.messageToast = 'Vui lòng nhập Tên đăng nhập';
      this.isValidUsername = true;
      return false;
    } else if (pattern.test(this.username.trim())) {
      this.isToastOpen = true;
      this.messageToast = 'Tên đăng nhập không hợp lệ';
      this.isValidUsername = true;
      return false;
    } else if (!this.password) {
      this.isToastOpen = true;
      this.messageToast = 'Vui lòng nhập Mật khẩu';
      this.isValidPassword = true;
      return false;
    }
    this.isValidUsername = false;
    this.isValidPassword = false;
    return true;
  }
  ngOnInit() {
    this.username = '';
    this.password = '';
    this.localStorage.clear();
    this.store.dispatch({
      type: 'RESET_DATA',
      payload: {
        shop: null,
        listMenu: null,
      },
    });
  }

  async login() {
    if (this.isValid) {
      const payload = {
        userName: this.username,
        passWord: this.password,
      };
      await this.isLoading();
      this.baseApi.postOption(payload, '/api/v1/account/login', '').subscribe(
        (res: HttpResponse<any>) => {
          if (res.status === 200) {
            if (res.body.CODE === 200) {
              this.localStorage.store('authenticationToken', res.body.RESULT);
              this.localStorage.store('check_work_active', false);
              if (res.body.RESULT.role === 'admin') {
                this.router.navigate(['/shop']);
              } else if (res.body.RESULT.role === 'marketing') {
                this.store.dispatch({
                  type: 'SET_MENU',
                  payload: MENU_MKT,
                });
                this.router.navigate(['/utm-medium']);
              } else {
                this.store.dispatch({
                  type: 'SET_MENU',
                  payload: MENU_USER,
                });
                this.router.navigate(['/work']);
              }
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = `Đăng nhập thành công với quyền ${res.body.RESULT.role}`;
            } else {
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = res.body.MESSAGE
                ? res.body.MESSAGE
                : 'Đăng nhập thất bại';
            }
          }
        },
        () => {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Đăng nhập thất bại';
        }
      );
    }
  }
  changeLanguage(e: any): void {
    this.language = e;
    this.isToastOpen = true;
    this.messageToast = 'Tính năng chưa được phát triển';
  }
  setOpen(open: boolean) {
    this.isToastOpen = open;
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
  showPassword() {
    this.isShowPassword = !this.isShowPassword;
  }
  forgotPassword() {
    this.isToastOpen = true;
    this.messageToast = 'Tính năng này chưa được phát triển';
  }
}
