import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(
    private baseApi: DanhMucService,
    private router: Router,
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.username = '';
    this.password = '';
    this.localStorage.clear();
  }

  login() {
    const payload = {
      userName: this.username,
      passWord: this.password,
    };
    this.spinner.show();
    this.baseApi.postOption(payload, '/api/v1/account/login', '').subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          if (res.body.CODE === 200) {
            this.localStorage.store('authenticationToken', res.body.RESULT);
            this.localStorage.store('check_work_active', false);
            if (res.body.RESULT.role === 'admin') {
              this.router.navigate(['/shop']);
            }
            this.spinner.hide();
          }
        }
      },
      () => {
        this.spinner.hide();
      }
    );
  }
  changeLanguage(e: any): void {
    this.language = e;
  }
}
