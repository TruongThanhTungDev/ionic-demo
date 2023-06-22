import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';

@Component({
  selector: 'statiscal-revenue-component',
  templateUrl: './statiscal-revenue.component.html',
})
export class StatiscalRevenue implements OnInit {
  SHOP_URL = '/api/v1/shop';
  REQUEST_URL = '/api/v1/data';
  typeShow = 1;
  optionChart = 1;
  startDate: any;
  endDate: any;
  today = new Date();
  month = this.today.getMonth() + 1;
  year = this.today.getFullYear();
  info: any;
  shopCode = '';
  shopList: any;
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
  }
  ngOnInit() {
    if (this.info.role === 'admin') {
      this.shopCode = this.localStorage.retrieve('shop')
        ? this.localStorage.retrieve('shop').code
        : '';
      this.statistic();
    } else {
      this.loadShopList();
    }
  }
  async loadData() {}
  public loadShopList() {
    this.dmService
      .getOption(
        null,
        this.SHOP_URL,
        '/search?filter=id>0;status==1&sort=id,asc&size=1000&page=0'
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          this.shopList = res.body.RESULT.content;
          this.shopCode = this.shopList[0].code;
          this.statistic();
        },
        () => {
          console.error();
        }
      );
  }
  statistic() {
    if (this.typeShow == 1) {
      let date = moment().format('YYYY') + '/' + this.month;
      this.startDate = moment(date).startOf('month').format('YYYYMMDD');
      this.endDate = moment(date).endOf('month').format('YYYYMMDD');
    } else if (this.typeShow == 2) {
      this.startDate = moment(this.year.toString())
        .startOf('year')
        .format('YYYYMMDD');
      this.endDate = moment(this.year.toString())
        .endOf('year')
        .format('YYYYMMDD');
    } else {
      this.startDate = moment('2021').startOf('year').format('YYYYDDMM');
      this.endDate = moment().format('YYYYDDMM');
    }
    this.loadData();
  }
}
