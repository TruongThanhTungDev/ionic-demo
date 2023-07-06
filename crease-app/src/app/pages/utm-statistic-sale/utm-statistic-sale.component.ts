import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Plugin } from 'src/app/plugins/plugins';

@Component({
  selector: 'utm-statistic-sale',
  templateUrl: './utm-statistic-sale.component.html',
  styleUrls: ['./utm-statistic-sale.component.scss'],
})
export class UtmStatisticSaleComponent implements OnInit {
  REQUEST_URL = '/api/v1/data';
  SHOP_URL = '/api/v1/shop';
  total = 0;
  shopCode = '';
  info: any;
  shopList: any;
  plugins = new Plugin();
  listData: any;
  listMvp: any;
  dateRange = {
    startDate: moment().utc().format('YYYY-MM-DD'),
    endDate: moment().utc().format('YYYY-MM-DD'),
  };
  activeSlide = 'active';
  inactiveSlide = 'inactive';
  isShowMvp = false;
  constructor(
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService,
    private store: Store<any>,
    private modal: ModalController
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
  }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    if (this.info.role === 'admin') {
      this.shopCode = this.localStorage.retrieve('shop')
        ? this.localStorage.retrieve('shop').code
        : '';
      this.loadData();
    } else {
      this.detailUser();
    }
  }
  async loadData() {
    if (this.shopCode === '') {
      return;
    }
    this.loadDataTopMonth();
    await this.isLoading();
    const date = JSON.parse(JSON.stringify(this.dateRange));
    date.endDate = date.endDate.replace('23:59:59', '00:00:00');
    let startDate = moment(date.startDate).format('YYYYMMDD') + '000000';
    let endDate = moment(date.endDate).format('YYYYMMDD') + '235959';
    this.total = 0;
    this.dmService
      .get(
        '/api/v1/SalePerformance/SalerKpiStatistic?endDate=' +
          endDate +
          '&shopCode=' +
          this.shopCode +
          '&startDate=' +
          startDate
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          this.listData = res.body.RESULT;
          this.loading.dismiss();
        },
        () => {
          console.error();
          this.loading.dismiss();
        }
      );
  }
  mathNumber(number: any): any {
    return Math.round(number * 100) / 100;
  }

  mathPercent(number: any): any {
    return Math.round(number * 10000) / 100;
  }
  public loadDataTopMonth() {
    var date = JSON.parse(JSON.stringify(this.dateRange));
    let startDate = moment(date.startDate).format('YYYYMMDD') + '000000';
    let endDate = moment(date.endDate).format('YYYYMMDD') + '235959';
    this.dmService
      .getOption(
        null,
        this.REQUEST_URL,
        '/thongKeTopUtm?startDate=' +
          startDate +
          '&endDate=' +
          endDate +
          '&shopCode=' +
          this.shopCode
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          this.listMvp = res.body.RESULT;
        },
        () => {
          console.error();
        }
      );
  }

  async detailUser() {
    await this.isLoading();
    this.dmService.get('/api/v1/account/details?id=' + this.info.id).subscribe(
      (res: HttpResponse<any>) => {
        const user = res.body.RESULT;
        this.loading.dismiss();
        if (user) {
          this.loadShopList(user.shop);
        }
      },
      () => {
        this.loading.dismiss();
        console.error();
      }
    );
  }
  public loadShopList(shop: any) {
    const params = {
      sort: ['id', 'desc'],
      page: 0,
      size: 1000,
      filter: 'code=in=(' + shop + ')',
    };
    this.dmService.query(params, this.SHOP_URL).subscribe(
      (res: HttpResponse<any>) => {
        this.shopList = res.body.RESULT.content;
        this.shopCode = this.shopList[0].code;
        this.loadData();
      },
      () => {
        this.loading.dismiss();
        console.error();
      }
    );
  }
  filterDate(e: any) {
    this.dateRange.startDate = moment(e.startDate, 'YYYY-MM-DD').format(
      'YYYY-MM-DD'
    );
    this.dateRange.endDate = moment(e.endDate, 'YYYY-MM-DD').format(
      'YYYY-MM-DD'
    );
    this.getAllData();
  }

  async isLoading() {
    const isLoading = await this.loading.create({
      spinner: 'circles',
      keyboardClose: true,
      message: 'Đang tải',
      translucent: true,
    });
    return await isLoading.present();
  }
  changeView() {
    this.isShowMvp = !this.isShowMvp;
  }
  resetData(event: any) {
    this.dateRange = {
      startDate: moment().utc().startOf('month').format('YYYY-MM-DD'),
      endDate: moment().utc().endOf('month').format('YYYY-MM-DD'),
    };
    this.getAllData();
    event.target.complete();
  }
}