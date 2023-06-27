import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';

@Component({
  selector: 'checkin-cmp',
  templateUrl: './check-in.component.html',
})
export class CheckInComponent implements OnInit {
  data: any;
  shopCode = '';
  shopList: any;
  line = 0;
  lineList: any;
  ACCOUNT_URL = '/api/v1/account';
  SHOP_URL = '/api/v1/shop';
  REQUEST_URL = '/api/v1/work/';
  CALL_URL = '/api/v1/call/';
  time: any;
  info: any;
  isToastOpen = false;
  messageToast = '';
  constructor(
    private modalCtrl: ModalController,
    private dmService: DanhMucService,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
  }
  get isValid() {
    if (this.line == 0 && this.lineList.length > 0) {
      this.isToastOpen = true;
      this.messageToast =
        'Không được để trống line khi vẫn còn line có thể chọn!';
      return false;
    }
    return true;
  }
  ngOnInit(): void {
    moment.locale('vi');
    this.time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY');
    this.loadShopList();
    this.loadLineList();
  }
  public loadShopList() {
    this.dmService
      .getOption(null, this.ACCOUNT_URL, '/details?id=' + this.info.id)
      .subscribe((res: HttpResponse<any>) => {
        this.dmService
          .getOption(
            null,
            this.SHOP_URL,
            '/search?filter=id>0;status==1;code=in=(' +
              res.body.RESULT.shop +
              ')&sort=id,asc&size=1000&page=0'
          )
          .subscribe(
            (res: HttpResponse<any>) => {
              this.shopList = res.body.RESULT.content;
              this.shopCode = this.shopList[0].code;
            },
            () => {
              console.error();
            }
          );
      });
  }
  public loadLineList() {
    this.line = 0;
    this.dmService
      .getOption(
        null,
        this.CALL_URL,
        'search?filter=id>0;isActive==1;account==%23NULL%23&sort=id,asc&size=10000&page=0'
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          this.lineList = res.body.RESULT.content;
        },
        () => {
          console.error();
        }
      );
  }
  handleCheckIn() {
    moment.locale('vi');
    let checkInEntity = {
      timeIn: moment(this.time, 'HH:mm:ss DD/MM/YYYY').format('YYYYMMDDHHmmss'),
      nhanVienId: this.localStorage.retrieve('authenticationToken').id,
      shopCode: this.shopCode,
      line: this.line,
    };
    if (this.isValid) {
      this.dmService.postOption(checkInEntity, this.REQUEST_URL, '').subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.isToastOpen = true;
            this.messageToast = 'Check in thành công';
            this.localStorage.store('check_work_active', true);
            this.localStorage.store('shopcode', this.shopCode);
            this.localStorage.store('call_info', res.body.RESULT.callInfo);
            this.confirm();
          } else {
            this.isToastOpen = true;
            this.messageToast = res.body.MESSAGE;
            this.loadLineList();
          }
        },
        () => {
          console.error();
        }
      );
    }
  }
  setOpen(open: boolean) {
    this.isToastOpen = open;
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }
}
