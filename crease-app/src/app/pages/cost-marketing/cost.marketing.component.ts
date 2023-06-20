import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { OPERATIONS } from 'src/app/app.constant';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Plugin } from 'src/app/plugins/plugins';
import { ThemSuaCostMarketing } from 'src/app/shared/popup/them-sua-cost-marketing/them-sua-cost-marketing.component';

@Component({
  selector: 'costMarketing-cmp',
  templateUrl: './cost-marketing.component.html',
})
export class CostMarketingComponent implements OnInit {
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  shopCode = '';
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
      handler: () => {
        this.deleteItem();
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
    this.loadShopList();
  }
  async loadData() {
    if (!this.shopCode) return;
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
          this.resetData();
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

  async addCostMarketing() {
    const modal = await this.modal.create({
      component: ThemSuaCostMarketing,
      componentProps: {
        title: 'Thêm mới Chi phí marketing',
        data: null,
        type: 'add',
        shopCode: this.shopCode,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
  }

  async editCostMarketing(item: any) {
    const modal = await this.modal.create({
      component: ThemSuaCostMarketing,
      componentProps: {
        title: 'Xử lý chi phí marketing',
        data: item,
        type: 'edit',
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
  }

  async deleteItem() {
    await this.isLoading();
    this.dmService
      .delete(this.selectedItem.id, this.REQUEST_URL + OPERATIONS.DELETE)
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Xóa thành công';
            this.loadData();
          } else {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Xóa thất bại';
          }
        },
        () => {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Xóa thất bại';
          console.error();
        }
      );
  }

  searchData() {
    // this.spinner.show();
    var date = this.dateRange;
    let startDate = moment(date.startDate, 'YYYYMMDD').format('YYYYMMDD');
    let endDate = moment(date.endDate, 'YYYYMMDD').format('YYYYMMDD');
    const filter = [];
    filter.push("id>0;costType.code=='CPMKT'");
    if (this.shopCode) filter.push(`shopCode==${this.shopCode}`);
    if (this.name) filter.push(`name==${this.name}`);
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
