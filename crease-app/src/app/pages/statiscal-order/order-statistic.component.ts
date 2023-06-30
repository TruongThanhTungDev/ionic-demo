import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { Store } from "@ngrx/store";
import * as dayjs from "dayjs";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { LocalStorageService } from "ngx-webstorage";
import { OPERATIONS } from "src/app/app.constant";
import { DanhMucService } from "src/app/danhmuc.services";
import { Plugin } from 'src/app/shared/utils/plugins';
@Component({
  selector: 'order-statistic-component',
  templateUrl: './order-statistic.component.html',
  
})
export class OrderStatisticComponent implements OnInit {
  REQUEST_URL="/api/v1/order-shipping";
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  previousPage = 1;
  sort = 'id';
  sortType = true;

  listData: any;
  info: any;
  isToastOpen: any;
  messageToast: any;
  isBackHeader: any;
  isOpenFilterModal:any;
  orderCode:any;
  name:any;
  toPhone:any;
  productNames:any;
  totalOrderValue:any;
  toAddress:any;
  toWard:any;
  toDistrict:any;
  toProvince:any;

  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController,
    private route: ActivatedRoute,
    private store: Store<any>,
    private spinner: NgxSpinnerService
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
    this.store.subscribe((state) => {
      this.isBackHeader = state.common.isBackHeader;
    });
  }
  ngOnInit(): void {
    this.loadData();
  }
  public filterData() {
    let filter = [];
    filter.push("id>=0");
    if (this.orderCode) {
      filter.push(`orderCode=="*${this.orderCode.trim()}*"`);
    }
    if (this.name) {
      filter.push(`toName=="*${this.name.trim()}*"`);
    }
    if (this.toPhone) {
      filter.push(`toPhone=="*${this.toPhone.trim()}*"`);
    }
    if (this.productNames) {
      filter.push(`productNames=="*${this.productNames.trim()}*"`);
    }
    if (this.totalOrderValue) {
      filter.push(`totalOrderValue==${parseInt(this.totalOrderValue)}`);
    }
    if (this.toAddress) {
      filter.push(`toAddress=="*${this.toAddress.trim()}*"`);
    }
    if (this.toWard) {
      filter.push(`toWard=="*${this.toWard.trim()}*"`);
    }
    if (this.toDistrict) {
      filter.push(`toDistrict=="*${this.toDistrict.trim()}*"`);
    }
    if (this.toProvince) {
      filter.push(`toProvince=="*${this.toProvince.trim()}*"`);
    }
    return filter.join(";");
  }

  async loadData() {  
    if (this.info.role !== 'admin') return;
    const params = {
      sort: ["id", "asc"],
      page: this.page - 1,
      size: this.itemsPerPage,
      filter:this.filterData(),
    };
    await this.isLoading();
    this.dmService.getOption(params,this.REQUEST_URL,'/search').subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.totalItems = res.body ? res.body.RESULT.totalElements : 0;
          this.listData = res.body.RESULT.content;
          this.loading.dismiss();
        } else {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
        }
      },
      () => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
        console.error();
      }
    );
    
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
  changePagination(e: any) {
    this.page = e;
    this.loadData();
  }
  async getFilter() {
    await this.loadData();
    this.isOpenFilterModal = false;
  }
  openModalFilter(isOpen: boolean) {
    this.isOpenFilterModal = isOpen;
    if (!isOpen) {
      this.loadData();
    }    
  }
  public formatPhone(number:any) {
    return number ? number.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3") : "";
  }
  formatTotalOrderValue(amount: any): string {
    if(amount === null){
      amount = 0;
    }
    return amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
    
  }
}