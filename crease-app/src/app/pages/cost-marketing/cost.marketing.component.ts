import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Plugin } from 'src/app/plugins/plugins';

@Component({
  selector: 'costMarketing-cmp',
  templateUrl: './cost-marketing.component.html',
})
export class CostMarketingComponent implements OnInit {
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  shopCode = '';
  costType: any;
  name = '';
  code = '';
  info: any;
  listData: any;
  shopList: any;
  listCostType: any;
  selectedItem: any;
  isToastOpen: any;
  isShowSelectDelete = false;
  messageToast: any;
  isOpenDeleteModal = false;
  isOpenFilterModal = false;
  isBackHeader: any;
  plugins = new Plugin();
  SHOP_URL = '/api/v1/shop';
  REQUEST_URL = '/api/v1/cost';
  dateRange = {
    startDate: moment().utc().startOf('month'),
    endDate: moment().utc().endOf('month'),
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
      handler: () => {},
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
    this.getListCostType();
    this.loadData();
    this.loadShopList();
  }
  async loadData() {
    var date = JSON.parse(JSON.stringify(this.dateRange));
    date.endDate = date.endDate.replace('23:59:59', '00:00:00');
    const payload = {
      page: this.page - 1,
      size: this.itemsPerPage,
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
          this.totalItems = res.body ? res.body.RESULT.totalElements : 0;
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
  loadShopList() {
    this.dmService.getOption(null, this.SHOP_URL, '/getAll').subscribe(
      (res: HttpResponse<any>) => {
        this.shopList = res.body.RESULT;
      },
      () => {
        console.error();
      }
    );
  }
  getListCostType() {
    this.dmService.getOption(null, '/api/v1/costtype', '/getAll').subscribe(
      (res: HttpResponse<any>) => {
        this.listCostType = res.body.RESULT;
      },
      () => {
        console.error();
      }
    );
  }

  async addCostMarketing() {}

  async editCostMarketing(item: any) {}

  async deleteItem() {}

  searchData() {
    // this.spinner.show();
    var date = this.dateRange;
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

  filterDate(e: any) {
    this.dateRange.startDate = moment(e.startDate, 'YYYY-MM-DD');
    this.dateRange.endDate = moment(e.endDate, 'YYYY-MM-DD');
    this.loadData();
  }
  getFilter() {
    this.isOpenFilterModal = false;
    this.loadData();
  }
  showListDelete() {
    if (!this.isShowSelectDelete) this.selectedItem = null;
    this.store.dispatch({
      type: 'CHANGE_HEADER',
      payload: {
        title: 'Hủy',
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
  openModalFilter(open: boolean) {
    this.isOpenFilterModal = open;
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
  changePagination(e: any) {
    this.page = e;
    this.loadData();
  }
  setOpen(open: boolean) {
    this.isToastOpen = open;
  }
  resetData() {
    this.name = '';
    this.code = '';
    this.costType = '';
  }
  async handleRefresh(event: any) {
    this.resetData();
    await this.loadData();
    event.target.complete();
  }
  changeShop(shop: any) {
    this.shopCode = shop.code;
    this.loadData();
  }
}
