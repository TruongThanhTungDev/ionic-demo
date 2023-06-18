import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Plugin } from 'src/app/shared/utils/plugins';

@Component({
  selector: 'costRecord-component',
  templateUrl: './ban-ghi-chi-phi.component.html',
})
export class CostRecordComponent implements OnInit {
  REQUEST_URL = '/api/v1/cost';
  costType: any;
  shopCode = '';
  listData: any;
  info: any;
  selectedItem: any;
  isToastOpen: any;
  isShowSelectDelete = false;
  messageToast: any;
  isOpenDeleteModal = false;
  isOpenFilterModal = false;
  isBackHeader: any;
  plugins = new Plugin();
  dateRange = {
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month'),
  };
  public actionDeleteAccount = [
    {
      text: 'Hủy',
      role: 'cancel',
      handler: () => {},
    },
    {
      text: 'Đồng ý',
      role: 'confirm',
      handler: () => {
        this.deleteItem(this.selectedItem);
      },
    },
  ];
  constructor(
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService,
    private store: Store<any>,
    private modal: ModalController
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
    this.store.subscribe((state) => {
      this.isBackHeader = state.common.isBackHeader;
      this.selectedItem = null;
    });
  }
  ngOnInit() {
    if (this.info.role === 'admin') {
      this.shopCode = this.localStorage.retrieve('shop').code;
    }
    this.loadData();
  }
  async loadData() {
    var date = JSON.parse(JSON.stringify(this.dateRange));
    date.endDate = date.endDate.replace('23:59:59', '00:00:00');
    const payload = {
      page: 0,
      size: 10000,
      filter: this.searchData(),
      sort: ['id', 'asc'],
    };
    await this.isLoading();
    this.dmService.query(payload, `${this.REQUEST_URL}`).subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.loading.dismiss();
          this.listData = res.body.RESULT.content
            .map((item: any) => {
              return {
                ...item,
                costName: item.costType ? item.costType.name : '',
                costId: item.costType ? item.costType.id : '',
                fromDate: moment(item.fromDate, 'YYYYMMDD').format(
                  'DD/MM/YYYY'
                ),
                toDate: moment(item.toDate, 'YYYYMMDD').format('DD/MM/YYYY'),
              };
            })
            .sort((a: any, b: any) => b.id - a.id);
        } else {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = res.body.MESSAGE
            ? res.body.MESSAGE
            : 'Có lỗi xảy ra vui lòng thử lại';
        }
      },
      () => {
        this.isToastOpen = true;
        this.messageToast = 'Có lỗi xảy ra vui lòng thử lại';
        this.loading.dismiss();
      }
    );
  }
  searchData() {
    // this.spinner.show();
    var date = JSON.parse(JSON.stringify(this.dateRange));
    let startDate = moment(date.startDate, 'YYYYMMDD').format('YYYYMMDD');
    let endDate = moment(date.endDate, 'YYYYMMDD').format('YYYYMMDD');
    const filter = [];
    filter.push('id>0');
    filter.push(`shopCode==${this.shopCode}`);
    if (this.costType) {
      filter.push(`costType.id==${this.costType}`);
    }
    if (startDate) filter.push(`fromDate>=${startDate}`);
    if (endDate) filter.push(`toDate<=${endDate}`);
    return filter.join(';');
  }
  filterDate(e: any) {}

  addCostRecord() {}

  deleteItem(item: any) {}

  editInfoCost(item: any) {}
  showListDelete() {
    if (!this.isShowSelectDelete) this.selectedItem = null;
    this.store.dispatch({
      type: 'CHANGE_HEADER',
      payload: {
        title: 'Chọn mục',
        state: true,
      },
    });
  }
  openDeleteModal(open: boolean) {
    this.isOpenDeleteModal = open;
  }
  selectItem(item: any) {
    if (this.selectedItem && this.selectedItem.id === item.id) {
      this.selectedItem = null;
    } else {
      this.selectedItem = item;
    }
  }
  openModalFilter(open: boolean) {}

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
