import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import * as dayjs from 'dayjs';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { OPERATIONS } from 'src/app/app.constant';
import { DanhMucService } from 'src/app/danhmuc.services';

@Component({
  selector: 'costRecord-cmp',
  templateUrl: './them-sua-ban-ghi-chi-phi.component.html',
})
export class ThemSuaCostRecord implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  @Input() currentCodeType?: any;
  isToastOpen = false;
  messageToast: any;
  costPerDay: any;
  numOfDay: any;
  numOfOrder: any;
  shopCode: any;
  totalCost: any;
  costPerOrderValue: any;
  checkMakerting = false;
  costPerOrder = false;
  fromDate = '';
  toDate = '';
  code = '';
  name = '';
  status = 1;
  timeValue = 1;
  shopList: any;
  info: any;
  updateValue = false;
  dateRange = {
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  };
  listCostType: any;
  costType = 0;
  SHOP_URL = '/api/v1/shop';
  REQUEST_URL = '/api/v1/cost';
  REQUEST_URL_COSTTYPE = '/api/v1/costtype';
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
  }
  get validData() {
    if (!this.costType) {
      this.isToastOpen = true;
      this.messageToast = 'Loại chi phí không được để trống';
      return false;
    }
    if (!this.fromDate.length || !this.toDate.length) {
      this.isToastOpen = true;
      this.messageToast = 'Vui lòng chọn Từ ngày - Đến ngày';
      return false;
    }
    if (this.costType === 7 && this.fromDate !== this.toDate) {
      this.isToastOpen = true;
      this.messageToast = 'Bạn đang nhập khoảng thời gian nhiều hơn 1 ngày';
      return false;
    }
    if (moment(this.fromDate).isAfter(moment(this.toDate))) {
      this.isToastOpen = true;
      this.messageToast = 'Từ ngày không được lớn hơn Đến ngày';
      return false;
    }
    if (this.code == '') {
      this.isToastOpen = true;
      this.messageToast = 'code Không được để trống';
      return false;
    }

    if (this.code == '') {
      this.isToastOpen = true;
      this.messageToast = 'Tên không được để trống';
      return false;
    }
    if (this.shopCode == '') {
      this.isToastOpen = true;
      this.messageToast = 'Shop code không được để trống';
      return false;
    }
    if (!this.numOfDay) {
      this.isToastOpen = true;
      this.messageToast = 'Vui lòng nhập Số ngày';
      return false;
    }
    if (!this.totalCost) {
      this.isToastOpen = true;
      this.messageToast = 'Vui lòng nhập Tổng chi phí';
      return false;
    }
    return true;
  }
  ngOnInit() {
    this.loadShopList();
    this.findCostType();
    if (this.type === 'edit') {
      this.code = this.data.code;
      this.name = this.data.name;
      this.status = this.data.status;
      this.costPerDay = this.data.costPerDay;
      this.numOfDay = this.data.numOfDay;
      this.totalCost = this.data.totalCost;
      this.fromDate = moment(this.data.fromDate, 'DD/MM/YYYY').format(
        'YYYYMMDD'
      );
      this.toDate = moment(this.data.toDate, 'DD/MM/YYYY').format('YYYYMMDD');
      this.numOfOrder = this.data.numOfOrder;
      this.shopCode = this.data.shopCode;
      this.costType = this.data.costTypeId;
      this.dateRange.startDate = moment(
        this.data.fromDate,
        'DD/MM/YYYY'
      ).format('YYYY-MM-DD');
      this.dateRange.endDate = moment(this.data.toDate, 'DD/MM/YYYY').format(
        'YYYY-MM-DD'
      );
    }
    if (this.type === 'add') {
      this.costType = this.currentCodeType;
      this.updateValue = false;
    } else {
      this.updateValue = true;
    }
  }

  async saveInfo() {
    this.code =
      this.fromDate.toString().slice(6) +
      '/' +
      this.fromDate.toString().slice(4, 6) +
      '/' +
      this.fromDate.toString().slice(0, 4) +
      '-' +
      this.toDate.toString().slice(6) +
      '/' +
      this.toDate.toString().slice(4, 6) +
      '/' +
      this.toDate.toString().slice(0, 4);
    this.name = this.localStorage.retrieve('authenticationtoken').userName;
    let entity = {
      id: '',
      code: this.code.trim(),
      name: this.name.trim(),
      status: this.status,
      costPerDay: this.costPerDay,
      numOfDay: this.numOfDay,
      totalCost: this.totalCost,
      fromDate: parseInt(this.fromDate),
      toDate: parseInt(this.toDate),
      numOfOrder: this.numOfOrder,
      costTypeId: this.costType,
      shopCode: this.shopCode,
    };
    if (this.validData) {
      await this.isLoading();
      if (this.type === 'add') {
        this.dmService
          .postOption(entity, '/api/v1/cost/postcost', '')
          .subscribe(
            (res: HttpResponse<any>) => {
              if (res.body.CODE === 200) {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Tạo bản ghi chi phí thành công';
                this.confirm();
              } else {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Tạo bản ghi chi phí thất bại';
                this.cancel();
              }
            },
            () => {
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = 'Tạo bản ghi chi phí thất bại';
              console.error();
            }
          );
      } else {
        entity.id = this.data.id;
        this.dmService
          .postOption(entity, '/api/v1/cost/postcost', ``)
          .subscribe(
            (res: HttpResponse<any>) => {
              if (res.body.CODE === 200) {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Cập nhật bản ghi chi phí thành công';
                this.confirm();
              } else {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Cập nhật bản ghi chi phí thất bại';
                this.cancel();
              }
            },
            () => {
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = 'Cập nhật bản ghi chi phí thất bại';
              console.error();
            }
          );
      }
    }
  }

  checkDate() {
    var date = JSON.parse(JSON.stringify(this.dateRange));
    date.endDate = date.endDate.replace('23:59:59', '00:00:00');
    if (this.type === 'add') {
      this.fromDate = moment(date.startDate).format('YYYYMMDD');
      this.toDate = moment(date.endDate).format('YYYYMMDD');
    }
    this.checkMakerting = true;
    if (this.costType == 7) {
      this.numOfDay = 1;
      if (moment(this.fromDate).isAfter(moment(this.toDate))) {
        this.isToastOpen = true;
        this.messageToast = 'Từ ngày không được lớn hơn Đến ngày';
      }
      if (this.fromDate !== this.toDate) {
        this.isToastOpen = true;
        this.messageToast = 'Bạn đang nhập khoảng thời gian nhiều hơn 1 ngày';
      }
    } else {
      if (moment(this.fromDate).isAfter(moment(this.toDate))) {
        this.isToastOpen = true;
        this.messageToast = 'Từ ngày không được lớn hơn Đến ngày';
      }
      const duration = moment.duration(
        moment(this.fromDate).diff(moment(this.toDate))
      );
      this.numOfDay = Math.abs(duration.asDays()) + 1;
    }
  }
  cost(): void {
    this.totalCost = this.costPerOrderValue * this.numOfOrder;
    this.totalCost = this.totalCost ? this.totalCost : 0;
    this.getCostByDay();
  }
  getCostByDay(): void {
    this.costPerDay = this.totalCost / this.numOfDay;
    this.costPerDay = this.costPerDay
      ? parseFloat(this.costPerDay.toFixed(0))
      : 0;
  }

  loadDataByCostPerOerDer(): void {
    this.getByIdCostType();
  }
  getByIdCostType() {
    this.dmService
      .getOption(
        null,
        this.REQUEST_URL_COSTTYPE,
        OPERATIONS.DETAILS + '?id=' + this.costType
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.RESULT.isCountOrder == 1) {
            this.fromDate = moment().startOf('month').format('YYYYMMDD');
            this.toDate = moment().endOf('month').format('YYYYMMDD');
            this.numOfDay = parseInt(moment().endOf('month').format('DD'));
            this.costPerOrder = true;
            this.timeValue = 1;
            this.getData();
          } else {
            this.costPerOrder = false;
          }
          if (res.body.RESULT.priod == 1) {
            this.checkDate();
          } else {
            this.checkMakerting = false;
            this.fromDate = moment().startOf('month').format('YYYYMMDD');
            this.toDate = moment().endOf('month').format('YYYYMMDD');
            this.numOfDay = parseInt(moment().endOf('month').format('DD'));
          }
        },
        () => {
          console.error();
        }
      );
  }
  getData() {
    if (this.costPerOrder) {
      const payload = {
        page: 0,
        size: 9999,
        filter: "id>0;code=='CPVC'",
        sort: ['id', 'desc'],
      };
      this.dmService.getOption(payload, '/api/v1/config', '/search').subscribe(
        (res: HttpResponse<any>) => {
          if (
            this.fromDate >= res.body.RESULT.fromDate &&
            this.toDate <= res.body.RESULT.toDate
          ) {
            this.costPerOrderValue = res.body.RESULT.value;
          } else {
            this.costPerOrderValue = res.body.RESULT.defaultValue;
          }
          this.dmService
            .getOption(
              null,
              '/api/v1/data',
              '/thongkeutm?startDate=' +
                this.fromDate +
                '&endDate=' +
                this.toDate +
                '&shopCode=KHBOM'
            )
            .subscribe(
              (res1: HttpResponse<any>) => {
                let count = 0;
                for (let item of res1.body.RESULT) {
                  count = count + item.count;
                }
                this.numOfOrder = count;
                this.totalCost =
                  this.numOfOrder * this.costPerOrderValue
                    ? this.numOfOrder * this.costPerOrderValue
                    : 0;
                this.costPerDay = (this.totalCost / this.numOfDay).toFixed(0);
              },
              () => {
                console.error();
              }
            );
        },
        () => {
          console.error();
        }
      );
    }
  }
  public async loadShopList() {
    await this.isLoading();
    this.dmService
      .getOption(
        null,
        this.SHOP_URL,
        '/search?filter=id>0;status==1&sort=id,asc&size=10000&page=0'
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          this.shopList = res.body.RESULT.content;
          this.loading.dismiss();
        },
        () => {
          this.loading.dismiss();
          console.error();
        }
      );
  }
  findCostType() {
    this.dmService
      .getOption(null, this.REQUEST_URL_COSTTYPE, '/getAll')
      .subscribe(
        (res: HttpResponse<any>) => {
          this.listCostType = res.body.RESULT;
          if (this.data) {
            const rs = this.listCostType.find(
              (item: any) => item.name === this.data.costName
            );
            // this.costType = rs.id;
          }
        },
        () => {
          console.error();
        }
      );
  }
  async cancel() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Bạn có chắc muốn thoát không?',
      buttons: [
        {
          text: 'Đồng ý',
          role: 'confirm',
        },
        {
          text: 'Hủy',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();
    if (role === 'confirm') {
      this.modal.dismiss();
    }
  }
  confirm() {
    this.modal.dismiss(null, 'confirm');
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
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
