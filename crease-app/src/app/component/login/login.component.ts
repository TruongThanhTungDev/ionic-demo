import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DanhMucService } from 'src/app/danhmuc.services';

@Component({
  selector: 'login-page',
  templateUrl: 'login.component.html',
  styleUrls: [],
})
export class Login {
  username: any;
  password: any;
  language = 'vi';
  constructor(private baseApi: DanhMucService, private router: Router) {}

  login() {
    const payload = {
      userName: this.username,
      passWord: this.password,
    };
    this.baseApi
      .postOption('/api/v1/account/login', payload, '')
      .subscribe((res: HttpResponse<any>) => {
        if (res.status === 200) {
          if (res.body.CODE === 200) {
            localStorage.setItem('authenticationToken', res.body.RESULT);
            this.router.navigate(['/']);
          }
        }
      });
  }
  changeLanguage(e: any): void {
    this.language = e;
  }
}
