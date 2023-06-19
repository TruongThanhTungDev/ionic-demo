import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';

@Component({
  selector: 'login-page',
  templateUrl: 'login.component.html',
  styleUrls: [],
})
export class Login implements OnInit {
  username: any;
  password: any;
  language = 'vi';
  isToastOpen: any;
  messageToast: any;
  constructor(
    private baseApi: DanhMucService,
    private router: Router,
    private localStorage: LocalStorageService,
    private loading: LoadingController
  ) {}

  ngOnInit() {
    this.username = '';
    this.password = '';
    this.localStorage.clear();
  }

  async login() {
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
              this.router.navigate(['/utm-medium']);
            } else {
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
}
