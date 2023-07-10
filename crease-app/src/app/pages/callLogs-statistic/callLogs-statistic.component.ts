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
  selector: 'callLog-statistic-component',
  templateUrl: './callLogs-statistic.component.html',
  styleUrls: ['./callLogs-statistic.component.scss'],
})
export class CallLogsStatisticComponent implements OnInit {
  REQUEST_URL = "/api/v1/call-logs";
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  previousPage = 1;
  sort = 'calldate';
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
  phone: any;
  calldate: any;
  duration: any;
  status: any;
  recording: any;
  blacklist: any;
  
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
  }
  ngOnInit(): void {
    this.loadData();
  }
  public filterData() {
    var date = JSON.parse(JSON.stringify(this.dateRange));
    let startDate = moment(date.startDate).format('YYYYMMDD') + '000000';
    let endDate = moment(date.endDate).format('YYYYMMDD') + '235959';
    let filter = [];
    filter.push(
      `calldate>=${startDate};calldate<=${endDate}`
    );
    if (this.phone) {
      filter.push(`phone=="*${this.phone.trim()}*"`);
    }
    if (this.calldate) {
      filter.push(`calldate=="*${this.calldate.trim()}*"`);
    }
    if (this.duration) {
      filter.push(`duration=="*${this.duration.trim()}s*"`);
    }
    if (this.status) {
      filter.push(`status=="*${this.status}*"`);
    }
    if (this.blacklist) {
      filter.push(`blacklist==${this.blacklist}`);
    }
    if (this.recording) {
      filter.push(`recording==${this.recording}`);
    }
    return filter.join(";");
  }
  async loadData() {
    
    if (this.info.role !== 'admin') return;
    var date = JSON.parse(JSON.stringify(this.dateRange));
    let startDate = moment(date.startDate).format('YYYYMMDD') + '000000';
    let endDate = moment(date.endDate).format('YYYYMMDD') + '235959';
    const params = {
      sort: ["calldate", "desc"],
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
  refreshData() {
    this.dateRange = {
      startDate: dayjs().startOf('month'),
      endDate: dayjs().endOf('month'),
    };
    this.loadData();
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
  async handleRefresh(event: any) {
    await this.loadData();
    event.target.complete();
  }
  
  public convertDateTime(date: any) {
  
    return date ? moment(date, 'YYYYMMDDHHmmss').format('HH giờ mm - DD/MM/YYYY') : '';
  }
  public convertStatus(status: any) {
    if(status==='ANSWERED') {
        return 'Trả lời';
    }
    else if(status==='NO ANSWER'){
        return 'Không trả lời';
    }
    else if(status==='BUSY'){
        return 'Máy bận';
    }
    else if(status==='CONGESTION'){
        return 'Ngoài vùng phủ sóng';
    }
    return status;
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
}