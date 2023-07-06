import { HttpResponse } from '@angular/common/http';
import { OnInit, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { OPERATIONS, ROLE } from 'src/app/app.constant';
import { Plugin } from 'src/app/shared/utils/plugins';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import * as moment from 'moment';

@Component({
  selector: 'lichsunhapxuat-component',
  templateUrl: './lich-su-nhap-xuat.component.html',
})
export class lichsunhapxuatComponent implements OnInit {
  REQUEST_URL = "/api/v1/bol";
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  previousPage = 1;
  sort = 'id';
  sortType = true;

  source: any;
  dataAdapter: any;
  listData: any;
  info: any;
  isToastOpen: any;
  messageToast: any;
  isBackHeader: any;
  isOpenDatePicker:any;
  isOpenFilterModal:any;
  plugins = new Plugin();
  shop:any;
  khoId:any;
  tenKho:any;
  kho:any;
  nhaCungCap:any;
  nguoiTao:any;
  trangThai:any;
  type:any;
  tonghang:any;
  thongKe: any = {
    nhap: 0,
    xuat: 0,
  };
  dateRange = {
    startDate: dayjs().startOf('month'),
    endDate: dayjs().endOf('month'),
  };
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
    this.shop = this.localStorage.retrieve("shop");
    this.khoId = this.localStorage.retrieve("warehouseId");
   
  }
  ngOnInit(): void {
    this.loadData();
  }
  
  public filterData() {
    var date = JSON.parse(JSON.stringify(this.dateRange));
    let startDate = moment(date.startDate).format('YYYYMMDD') ;
    let endDate = moment(date.endDate).format('YYYYMMDD') ;
    let filter = [];
    filter.push(
      `createAt>=${startDate};createAt<=${endDate};shop.code==`+
      this.shop.code
    );
    if (this.tenKho) {
      filter.push(`warehouse.name=="*${this.tenKho.trim()}*"`);
    }
    if (this.khoId) {
      filter.push(`warehouse.id==${this.khoId}`);
    }
    if (this.nhaCungCap) {
      filter.push(`supplierInfo=="*${this.nhaCungCap.trim()}*"`);
    }
    if (this.nguoiTao) {
      filter.push(`creator.fullName=="*${this.nguoiTao.trim()}*"`);
    }
    if (this.trangThai) {
      filter.push(`status==${this.trangThai}`);
    }
    if(this.type){
      filter.push(`type==${this.type}`)
    }else{
      filter.push(`(type==2,type==1)`)
    }    
    return filter.join(";");
  }

  async loadData() {
    
    if (this.info.role !== 'admin') return;
    var date = JSON.parse(JSON.stringify(this.dateRange));
    let startDate = moment(date.startDate).format('YYYYMMDD') + '000000';
    let endDate = moment(date.endDate).format('YYYYMMDD') + '235959';
    const params = {
      sort: ["id", "desc"],
      page: this.page - 1,
      size: this.itemsPerPage,
      filter:this.filterData(),
    };
    await this.isLoading();
    this.dmService.getOption(params,this.REQUEST_URL,'/search').subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.page = res.body ? res.body.RESULT.number + 1 : 1;
          this.totalItems = res.body ? res.body.RESULT.totalElements : 0;
          this.listData = res.body.RESULT.content.map((item: any) => {
            return {
              ...item,
              warehouseName: item.warehouse ? item.warehouse.name:'',
              creatorName: item.creator ? item.creator.fullName :'',
            };
          });
          this.customListData();
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
  customListData(): any {
    for (let i = 0; i < this.listData.length; i++) {
      this.listData[i].createAt = this.listData[i].createAt
        ? moment(this.listData[i].createAt, "YYYYMMDD").format("DD/MM/YYYY")
        : "";
      this.loadDataSub(this.listData[i].boLDetailList, i);
    }
  }

  loadDataSub(list: any, i: any): void {
    this.listData[i].soMauMa = list.length;
    let tongSoHang = 0;
    let conTrongKho = 0;
    let tongSoTien = 0;
    for (let i = 0; i < list.length; i++) {
      tongSoHang += list[i].totalQuantity ? list[i].totalQuantity : 0;
      conTrongKho += list[i].availableQuantity ? list[i].availableQuantity : 0;
      tongSoTien +=
        list[i].totalQuantity && list[i].price
          ? list[i].totalQuantity * list[i].price
          : 0;
    }
    this.listData[i].tongSoHang = tongSoHang;
    this.listData[i].conTrongKho = conTrongKho;
    this.listData[i].tongSoTien = tongSoTien;
  }
  refreshData() {
    this.dateRange = {
      startDate: dayjs().startOf('month'),
      endDate: dayjs().endOf('month'),
    };
    this.loadData();
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
  showDatePicker() {
    this.isOpenDatePicker = true;
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
  openModalFilter(isOpen: boolean) {
    this.isOpenFilterModal = isOpen;
    if (!isOpen) {
      this.loadData();
    }
    
  }
  async getFilter() {
    await this.loadData();
    this.isOpenFilterModal = false;
  }
  
  public convertStatus(status: any) {
    if(status===0) {
        return 'Mới';
    }
    else if(status===1){
        return 'Đã xác nhận';
    }
    else if(status===2){
        return 'Đang vận chuyển';
    }
    else if(status===3){
        return 'Đã hoàn thành';
    }
    else if(status===10){
      return 'Đã hủy';
  }
    return status;
  }
  public convertType(type: any) {
    if(type===1) {
        return 'Nhập hàng';
    }
    else if(type===2){
        return 'Xuất hàng';
    }
    return type;
  }
  
  
}