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

  constructor(private baseApi: DanhMucService, private router: Router) {}

  login() {
    const payload = {
      username: this.username,
      password: this.password,
    };
    this.baseApi
      .postOption('/api/v1/account/login', payload, '')
      .subscribe((res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.router.navigate(['/']);
        }
      });
  }
}
