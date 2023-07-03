import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { ThongTinKhachHangOrder } from './thong-tin-khach-hang/thong-tin-khach-hang.component';
import { HttpResponse } from '@angular/common/http';
import { Plugin } from '../../utils/plugins';

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
  isShowEditNoteCustomer = false;
  isShowEditInfoOrder = false;
  statusOrder = '0,1,2,3,4,5,6,9';
  info: any;
  name: any;
  phone: any;
  ward: any;
  district: any;
  province: any;
  street: any;
  product: any;
  note: any;
  date: any;
  price: any;
  cogs: any;
  dataOrder: any;
  status: any;
  listProduct: any;
  totalMoney = 0;
  totalCost = 0;
  discount = 0;
  deliveryFee = 0;
  cauHinhDonhang: any;
  plugins = new Plugin();
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
    if (this.data) {
      this.name = this.data.name;
      this.phone = this.data.phone;
      this.statusOrder = this.data.status;
      this.product = this.data.product;
      this.date = this.data.date;
      this.price = this.data.price;
      this.cogs = this.data.cogs;
      this.status = this.data.status;
      this.discount = this.discount;
      this.deliveryFee = this.deliveryFee;
      if (this.data.dataInfo) {
        this.street = this.data.dataInfo.street;
        this.ward = this.data.dataInfo.ward;
        this.province = this.data.dataInfo.province;
        this.district = this.data.dataInfo.district;
        this.note = this.data.dataInfo.note;
      }
      if (this.data.productIds && this.data.productIds.length) {
        this.listProduct = this.data.productIds;
      }
      this.getTotalMoney();
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
  editNoteCustomer(open: any) {
    this.isShowEditNoteCustomer = open;
  }
  handleEditNote(value: any) {
    this.note = value.note;
  }
  editOrder(open: any) {
    this.isShowEditInfoOrder = open;
  }
  handleEditOrder(value: any) {
    this.listProduct = value.products;
    this.deliveryFee = parseInt(value.deliveryFee);
    this.discount = parseInt(value.discount);
    this.cogs = parseInt(value.cogs);
    this.getTotalMoney();
    this.getPrice();
  }
  getTotalMoney() {
    this.totalMoney = this.listProduct.reduce(
      (sum: any, item: any) => sum + item.price,
      0
    );
  }
  getPrice() {
    this.price = this.totalMoney - this.discount + this.deliveryFee;
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
