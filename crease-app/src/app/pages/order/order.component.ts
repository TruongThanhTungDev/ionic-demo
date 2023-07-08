import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Plugin } from 'src/app/plugins/plugins';
import { GiaoViecNhanhPopup } from 'src/app/shared/popup/giao-viec-nhanh/giao-viec-nhanh.component';
import { GiaoViecOrder } from 'src/app/shared/popup/giao-viec/giao-viec.component';
import { ThaoTacOrder } from 'src/app/shared/popup/thao-tac-order/thao-tac-order.component';
import { XuLyOrderComponent } from 'src/app/shared/popup/xu-ly-order/xu-ly-order.component';

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
  ftKhachHang: any;
  ftSdt = '';
  shopCode = '';
  ftThoiGian = '';
  ftNhanVien = '';
  ftSanPham = '';
  info: any;
  listData: any;
  messageToast: any;
  listCheck: any[] = [];
  isToastOpen = false;
  isBackHeader = false;
  isOpenFilterModal = false;
  REQUEST_URL = '/api/v1/data';
  plugins = new Plugin();
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController,
    private store: Store<any>,
    private modal: ModalController
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
  get isAdmin() {
    return this.info.role === 'admin';
  }
  get isUser() {
    return this.info.role === 'user';
  }
  get disableAssignButton() {
    const result = this.listCheck.every((item) => item.status == 0);
    return !this.listCheck.length || (this.listCheck.length && !result);
  }
  ngOnInit() {
    this.loadData();
    this.store.subscribe((state) => {
      this.isBackHeader = state.common.isBackHeader;
      if (!this.isBackHeader) {
        this.listCheck = [];
      }
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
                date: moment(item.date, 'YYYYMMDDHHmmss').format(
                  'HH:mm:ss DD/MM/YYYY'
                ),
                dataInfo: item.dataInfo ? JSON.parse(item.dataInfo) : null,
                productIds: JSON.parse(item.productIds),
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
    if (this.ftKhachHang)
      comparesArray.push(`name=="*${this.ftKhachHang.trim()}*"`);
    if (this.ftSdt) comparesArray.push(`phone=="*${this.ftSdt.trim()}*"`);
    if (this.ftNhanVien)
      comparesArray.push(`account.userName=="*${this.ftNhanVien.trim()}*"`);
    if (this.ftSanPham)
      comparesArray.push(`product=="*${this.ftSanPham.trim()}*"`);
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
  async handleViewInfoOrder(item: any) {
    const modal = await this.modal.create({
      component: XuLyOrderComponent,
      componentProps: {
        title: 'Tất cả đơn hàng',
        data: item,
        shopCode: this.shopCode,
        type: 'edit',
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
      this.listCheck = [];
    }
  }

  async handleFastAssginWork() {
    const modal = await this.modal.create({
      component: GiaoViecNhanhPopup,
      componentProps: {
        shopCode: this.shopCode,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
  }
  async handleAction() {
    const modal = await this.modal.create({
      component: ThaoTacOrder,
      componentProps: {
        shopCode: this.shopCode,
        listWork: this.listCheck,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
  }
  async handleAssginWork() {
    const modal = await this.modal.create({
      component: GiaoViecOrder,
      componentProps: {
        shopCode: this.shopCode,
        listWork: this.listCheck,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
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
  handleSelectItem(item: any) {
    const index = this.listCheck.findIndex((el: any) => el.id === item.id);
    if (index !== -1) {
      this.listCheck.splice(index, 1);
    } else {
      this.listCheck.push(item);
    }
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
  handleRefresh(event: any) {
    this.dateRange = {
      startDate: moment().utc().format('YYYY-MM-DD'),
      endDate: moment().utc().format('YYYY-MM-DD'),
    };
    this.loadData();
    event.target.complete();
  }
  refreshData() {
    this.loadData();
  }
  openModalFilter(open: boolean) {
    this.isOpenFilterModal = open;
  }
  getFilter() {
    if (
      moment(this.ftThoiGian).isBefore(moment(this.dateRange.startDate)) ||
      moment(this.ftThoiGian).isAfter(moment(this.dateRange.endDate))
    ) {
      this.isToastOpen = true;
      this.messageToast =
        'Thời gian không được bé hơn hoặc lớn hơn khoảng thời gian được chọn!';
      return;
    }
    this.dateRange.startDate = this.ftThoiGian;
    this.dateRange.endDate = this.ftThoiGian;
    this.loadData();
    this.isOpenFilterModal = false;
  }
  isHideRevenue(item: any) {
    if (
      item === 0 ||
      item === 1 ||
      item === 2 ||
      item === 3 ||
      item === 4 ||
      item === 5 ||
      item === 6 ||
      item === 9
    ) {
      return true;
    }
    return false;
  }
}
