import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { ThongTinKhachHangOrder } from './thong-tin-khach-hang/thong-tin-khach-hang.component';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'xuLyOder-cmp',
  templateUrl: './xu-ly-order.component.html',
})
export class XuLyOrderComponent implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  @Input() shopCode: any;
  REQUEST_URL_DATA_CONFIG = '/api/v1/dataconfig';
  isShowEditInfoCustomer = false;
  isShowEditAddressCustomer = false;
  statusOrder = '0,1,2,3,4,5,6,9';
  info: any;
  name: any;
  phone: any;
  ward: any;
  district: any;
  province: any;
  street: any;
  cauHinhDonhang: any;
  isToastOpen = false;
  messageToast: any;
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
  }
  get isUser() {
    return this.info.role === 'user';
  }
  ngOnInit() {
    if (this.type === 'edit') {
      this.name = this.data.name;
      this.phone = this.data.phone;
      this.statusOrder = this.data.status;
      this.street = this.data.dataInfo.street;
      this.ward = this.data.dataInfo.ward;
      this.province = this.data.dataInfo.province;
      this.district = this.data.dataInfo.district;
    }
    // this.loadCauHinhDonHang();
  }

  loadCauHinhDonHang() {
    if (!this.shopCode) return;
    const entity = {
      page: 0,
      size: 5,
      filter: 'shop.code==' + this.shopCode,
      sort: ['id', 'desc'],
    };
    this.dmService.query(entity, this.REQUEST_URL_DATA_CONFIG).subscribe(
      (res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.cauHinhDonhang = {
            addressInfo: JSON.parse(res.body.RESULT.content[0].addressInfo),
            customerInfo: JSON.parse(res.body.RESULT.content[0].customerInfo),
            noteInfo: JSON.parse(res.body.RESULT.content[0].noteInfo),
            productInfo: JSON.parse(res.body.RESULT.content[0].productInfo),
            shop: JSON.parse(res.body.RESULT.content[0].shop),
          };
        }
      },
      () => {
        console.error();
      }
    );
  }

  async showEditInfoCustomer(open: any) {
    this.isShowEditInfoCustomer = open;
  }
  handleEditInfo(value: any) {
    this.name = value.name;
    this.phone = value.phone;
  }

  async editAddressCustomer(open: any) {
    this.isShowEditAddressCustomer = open;
  }
  handleEditAddress(value: any) {
    this.street = value.street;
    this.ward = value.ward;
    this.province = value.province;
    this.district = value.district;
    this.isShowEditAddressCustomer = value.isOpen;
  }
  cancel() {
    this.modal.dismiss();
  }
  confirm() {
    this.modal.dismiss(null, 'confirm');
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
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
