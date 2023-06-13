import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import * as dayjs from 'dayjs';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Plugin } from 'src/app/shared/utils/plugins';
@Component({
  selector: 'work-component',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
})
export class WorkComponent implements OnInit {
  shopCode: any = '';
  info: any = null;
  listData: any;
  itemsPerPage = 10;
  page = 1;
  totalItems = '';
  fullName = '';
  userName = '';
  totalOrder = '';
  successOrder = '';
  processedOrder = '';
  messageToast = '';
  isToastOpen = false;
  isOpenDatePicker = false;
  REQUEST_URL = '/api/v1/work';
  plugins = new Plugin();
  isOpenFilterModal = false;
  dateRange = {
    startDate: dayjs().startOf('month'),
    endDate: dayjs().endOf('month'),
  };
  constructor(
    private route: ActivatedRoute,
    private localStorage: LocalStorageService,
    private dmService: DanhMucService,
    private loading: LoadingController
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
    this.shopCode = localStorage.retrieve('shop')
      ? localStorage.retrieve('shop').code
      : '';
  }
  get isAdmin() {
    return this.info.role === 'admin';
  }
  ngOnInit() {
    this.checkLoadData();
  }

  checkLoadData() {
    if (this.info.role === 'admin') {
      this.loadDataAdmin();
    } else {
      this.loadData();
    }
  }

  public loadData() {
    var date = JSON.parse(JSON.stringify(this.dateRange));
    let startDate = moment(date.startDate).format('YYYYMMDD') + '000000';
    let endDate = moment(date.endDate).format('YYYYMMDD') + '235959';
    this.dmService
      .getOption(
        null,
        this.REQUEST_URL,
        '?startDate=' + startDate + '&endDate=' + endDate
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.listData = res.body.RESULT;
            this.loading.dismiss();
          } else {
            this.isToastOpen = true;
            this.loading.dismiss();
            this.messageToast = 'Không có dữ liệu!';
          }
        },
        () => {
          console.error();
          this.isToastOpen = true;
          this.loading.dismiss();
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
        }
      );
  }
  async loadDataAdmin() {
    const params = {
      sort: ['id', 'desc'],
      page: 0,
      size: 100000,
      filter: this.filterData(),
    };
    await this.isLoading();
    this.dmService.query(params, this.REQUEST_URL).subscribe(
      (res: HttpResponse<any>) => {
        if (res.body) {
          if (res.body.CODE === 200) {
            this.listData = res.body.RESULT.content;
            this.totalItems = res.body.RESULT.totalPages;
            this.loading.dismiss();
          } else {
            this.listData = [];
            this.isToastOpen = true;
            this.loading.dismiss();
            this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
          }
        } else {
          this.listData = [];
          this.isToastOpen = true;
          this.loading.dismiss();
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
        }
      },
      () => {
        this.listData = [];
        console.error();
        this.isToastOpen = true;
        this.loading.dismiss();
        this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
      }
    );
  }
  filterData() {
    var date = JSON.parse(JSON.stringify(this.dateRange));
    let startDate = moment(date.startDate).format('YYYYMMDD') + '000000';
    let endDate = moment(date.endDate).format('YYYYMMDD') + '235959';
    const filter = [];
    filter.push(
      `shopCode==${this.shopCode};timeIn>=${startDate};timeIn<=${endDate}`
    );
    if (this.fullName)
      filter.push(`account.fullName=='*${this.fullName.trim()}*'`);
    if (this.userName)
      filter.push(`account.userName=='*${this.userName.trim()}*'`);
    if (this.totalOrder) filter.push(`totalOrder=='${this.totalOrder}'`);
    if (this.successOrder) filter.push(`successOrder=='${this.successOrder}'`);
    if (this.processedOrder)
      filter.push(`processedOrder=='${this.processedOrder}'`);
    return filter.join(';');
  }
  changePagination(e: any) {
    this.page = e;
    this.checkLoadData();
  }
  openModalFilter(isOpen: boolean) {
    this.isOpenFilterModal = isOpen;
  }
  async getFilter() {
    await this.loadDataAdmin();
    this.isOpenFilterModal = false;
  }
  async handleRefresh(event: any) {
    this.resetData();
    await this.checkLoadData();
    event.target.complete();
  }
  refreshData() {
    this.resetData();
    this.checkLoadData();
  }
  resetData() {
    this.fullName = '';
    this.userName = '';
    this.totalOrder = '';
    this.successOrder = '';
    this.processedOrder = '';
  }
  setOpenToast(open: boolean) {
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
  showDatePicker() {
    this.isOpenDatePicker = true;
  }
}
