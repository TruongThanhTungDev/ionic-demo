import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { HttpResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/plugins/notification.service';

@Component({
  selector: 'shop-component',
  templateUrl: 'shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  data: any;
  REQUEST_URL = '/api/v1/shop';
  shopcode = '';
  ftTen = '';
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadData();
  }
  public loadData() {
    const payload = {
      page: 0,
      size: 1000,
      filter: this.filterData(),
      sort: ['id', 'asc'],
    };
    this.dmService.query(payload, this.REQUEST_URL).subscribe(
      (res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.data = res.body.RESULT.content;
        } else {
          this.notificationService.showError(res.body.MESSAGE, 'Fail');
        }
      },
      () => {
        this.notificationService.showError('Đã có lỗi xảy ra', 'Fail');
        console.error();
      }
    );
  }

  public filterData() {
    const filter = [];
    filter.push('id>0');
    if (this.ftTen) {
      filter.push(`name=="*${this.ftTen.trim()}*"`);
    }
    return filter.join(';');
  }
  public selectRow(item: any) {
    this.localStorage.store('shop', item);
    this.router.navigate(['/dashboard']);
    this.dmService.sendClickEvent();
  }
}
