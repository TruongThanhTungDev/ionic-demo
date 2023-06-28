import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Plugin } from 'src/app/plugins/plugins';

@Component({
  selector: 'order-component',
  templateUrl: './order.component.html',
})
export class OrderComponent implements OnInit {
  dateRange = {
    startDate: moment().utc().format('YYYY-MM-DD'),
    endDate: moment().utc().format('YYYY-MM-DD'),
  };
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  ftTrangThai: any = '0,1,2,3,4,5,6,9';
  shopCode = '';
  info: any;
  listData: any;
  messageToast: any;
  isToastOpen = false;
  isBackHeader = false;
  REQUEST_URL = '/api/v1/data';
  plugins = new Plugin();
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController,
    private store: Store<any>
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
    this.shopCode = this.localStorage.retrieve('shopCode');
    if (this.info && this.info.role === 'user') {
      this.dateRange = {
        startDate: moment().subtract(6, 'days').format('YYYY-MM-DD'),
        endDate: moment().add(1, 'days').format('YYYY-MM-DD'),
      };
    }
  }

  ngOnInit() {
    this.loadData();
    this.store.subscribe((state) => {
      this.isBackHeader = state.common.isBackHeader;
    });
  }

  async loadData() {
    if (!this.shopCode) return;
    var date = JSON.parse(JSON.stringify(this.dateRange));
    date.endDate = date.endDate.replace('23:59:59', '00:00:00');
    let startDate = moment(date.startDate).format('YYYYMMDD') + '000000';
    let endDate = moment(date.endDate).format('YYYYMMDD') + '235959';
    const params = {
      sort: ['id', 'desc'],
      page: this.page - 1,
      size: this.itemsPerPage,
      filter: this.filter(startDate, endDate),
    };
    await this.isLoading();
    this.dmService.query(params, this.REQUEST_URL).subscribe(
      (res: HttpResponse<any>) => {
        if (res.body) {
          if (res.body.CODE === 200) {
            this.loading.dismiss();
            this.totalItems = res.body.RESULT.totalElements || 0;
            this.listData = res.body.RESULT.content.map((item: any) => {
              return {
                ...item,
                date: moment(item.date).format('HH:mm:ss DD/MM/YYYY'),
              };
            });
          } else {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = res.body.MESSAGE
              ? res.body.MESSAGE
              : 'Lấy danh sách thất bại!';
          }
        }
      },
      () => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau';
      }
    );
  }
  filter(startDate: any, endDate: any) {
    const comparesArray: string[] = [];
    comparesArray.push(`id>0`);
    if (this.shopCode) comparesArray.push(`shopCode=="${this.shopCode}"`);
    if (startDate) comparesArray.push(`date >= ${startDate} `);
    if (endDate) comparesArray.push(`date <= ${endDate} `);
    if (this.ftTrangThai || this.ftTrangThai >= 0)
      comparesArray.push(`status=in=(${this.ftTrangThai})`);
    return comparesArray.join(';');
  }
  handleSelect() {
    this.store.dispatch({
      type: 'CHANGE_HEADER',
      payload: {
        title: 'Hủy',
        state: true,
      },
    });
  }
  filterDate(event: any) {
    this.dateRange.startDate = event.startDate;
    this.dateRange.endDate = event.endDate;
    this.loadData();
  }
  changePagination(e: any) {
    this.page = e;
    this.loadData();
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
