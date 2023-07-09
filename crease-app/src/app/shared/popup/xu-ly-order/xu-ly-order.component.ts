import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { ThongTinKhachHangOrder } from './thong-tin-khach-hang/thong-tin-khach-hang.component';
import { HttpResponse } from '@angular/common/http';
import { Plugin } from '../../utils/plugins';
import * as moment from 'moment';

@Component({
  selector: 'xuLyOder-cmp',
  templateUrl: './xu-ly-order.component.html',
  styleUrls: ['./xu-ly-order.component.scss'],
})
export class XuLyOrderComponent implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  @Input() shopCode: any;
  REQUEST_URL_DATA_CONFIG = '/api/v1/dataconfig';
  REQUEST_PRODUCT_URL = '/api/v1/product';
  REQUEST_DATA_URL = '/api/v1/data';
  isShowEditInfoCustomer = false;
  isShowEditAddressCustomer = false;
  isShowEditNoteCustomer = false;
  isShowEditInfoOrder = false;
  isShowTracking = false;
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
  listProduct: any[] = [];
  shippingCode: any;
  listTracking: any[] = [];
  totalMoney = 0;
  totalCost = 0;
  discount = 0;
  deliveryFee = 0;
  config: any;
  cauHinhDonhang: any;
  plugins = new Plugin();
  isToastOpen = false;
  messageToast: any;
  listDropDownOrder = [
    {
      name: 'Mới',
      value: 0,
      className: 'btn-primary',
    },
    {
      name: 'Đã tiếp nhận',
      value: 1,
      className: 'btn-blue',
    },
    {
      name: 'Đang xử lý',
      value: 2,
      className: 'btn-orange',
    },
    {
      name: 'KNM L1',
      value: 3,
      className: 'btn-warning',
    },
    {
      name: 'KNM L2',
      value: 4,
      className: 'btn-warning',
    },
    {
      name: 'KNM L3',
      value: 5,
      className: 'btn-warning',
    },
    {
      name: 'Thất bại',
      value: 6,
      className: 'btn-danger',
    },
    {
      name: 'Thành công',
      value: 7,
      className: 'btn-green',
    },
    {
      name: 'Trùng',
      value: 9,
      className: 'btn-gray',
    },
  ];
  listDropDownDataOrder = [
    {
      name: 'Thành công',
      value: 7,
      className: 'btn-success',
      styleName: '',
    },
    {
      name: 'Hủy đơn',
      value: 20,
      className: 'bg-danger text-white',
      styleName: '',
    },
  ];
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
  }
  get showChangeStatus() {
    return (
      this.type === 'after-order' &&
      (this.status === 7 || this.status === 11 || this.status === 20)
    );
  }
  get isUser() {
    return this.info.role === 'user';
  }
  get validSuccess() {
    if (this.listProduct.length == 0) {
      this.isToastOpen = true;
      this.messageToast =
        'Phải chọn sản phẩm trước khi chuyển sang trạng thái thành công!';
      return false;
    }
    if (!this.province) {
      this.isToastOpen = true;
      this.messageToast = 'Bạn chưa chọn thông tin Tỉnh/Thành phố';
      return false;
    } else if (!this.district) {
      this.isToastOpen = true;
      this.messageToast = 'Bạn chưa chọn thông tin Quận/Huyện';
      return false;
    } else if (!this.ward) {
      this.isToastOpen = true;
      this.messageToast = 'Bạn chưa chọn thông tin Xã/Phường';
      return false;
    } else if (!this.street) {
      this.isToastOpen = true;
      this.messageToast = 'Bạn chưa nhập thông tin địa chỉ';
      return false;
    }
    return true;
  }
  get valid() {
    if (
      this.discount &&
      (parseInt(this.discount.toString()) < 0 ||
        this.discount.toString().length > 15)
    ) {
      this.isToastOpen = true;
      this.messageToast =
        'Giá tiền phải là số dương và không được lớn hơn 15 kí tự!';
      this.discount = 0;
      return false;
    }

    if (
      this.deliveryFee &&
      (this.deliveryFee < 0 || this.deliveryFee.toString().length > 15)
    ) {
      this.isToastOpen = true;
      this.messageToast =
        'Giá tiền phải là số dương và không được lớn hơn 15 kí tự!';
      this.deliveryFee = 0;
      return false;
    }
    return true;
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
      this.discount = this.data.discount;
      this.deliveryFee = this.data.deliveryFee;
      this.shippingCode = this.data.shippingCode;
      this.note = this.data.note;
      if (this.data.dataInfo) {
        this.street = this.data.dataInfo.street;
        this.ward = this.data.dataInfo.ward;
        this.province = this.data.dataInfo.province;
        this.district = this.data.dataInfo.district;
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
  handleEditNote(value: any) {
    this.note = value.note;
    this.isShowEditNoteCustomer = false;
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
    if (this.listProduct && !this.listProduct.length) return;
    this.totalMoney = this.listProduct.reduce(
      (sum: any, item: any) => sum + item.price,
      0
    );
  }
  getPrice() {
    this.price = this.totalMoney - this.discount + this.deliveryFee;
  }
  async saveInfo(status: any) {
    if (!this.valid) return;
    if (
      status === 7 ||
      status === 6 ||
      status === 8 ||
      status === 9 ||
      status === 10 ||
      status === 11 ||
      status === 12
    ) {
      this.data.saleId = this.data.saleAccount
        ? this.data.saleAccount.id
        : this.info.id;
    }
    const dateChanged = parseInt(moment(new Date()).format('YYYYMMDDHHmmss'));
    const dataInfo = {
      ...this.data.dataInfo,
      ward: this.ward,
      district: this.district,
      province: this.province,
      street: this.street,
    };
    if (status === 6) {
      this.data.price = 0;
    } else if (status === 7 || status === 8 || status === 11) {
      if (this.validSuccess) {
        if (!this.data.cost) {
          if (!this.config) {
            this.data.cost = 0;
          } else if (
            this.data.dateOnly < this.config.fromDate ||
            this.data.dateOnly > this.config.toDate
          ) {
            this.data.cost = this.config.defaultValue;
          } else {
            this.data.cost = this.config.value;
          }
        }
        const arr = this.listProduct.map((item: any) => {
          return {
            id: item.product.id,
            quantity: item.quantity,
          };
        });
        const body = { list: arr };
        await this.isLoading();
        this.dmService
          .postOption(body, this.REQUEST_PRODUCT_URL, '/price-import')
          .subscribe(
            (res: HttpResponse<any>) => {
              if (res.body.CODE == 200) {
                this.data.totalProductValue = res.body.RESULT.costImport;
                const payload = {
                  dataList: [
                    {
                      ...this.data,
                      date: parseInt(
                        moment(this.data.date, 'HH:mm:ss DD/MM/YYYY').format(
                          'YYYYMMDDHHmmss'
                        )
                      ),
                      dateChanged,
                      name: this.name,
                      phone: this.phone,
                      product: this.product,
                      note: this.note,
                      dataInfo: JSON.stringify(dataInfo),
                      productIds: JSON.stringify(this.listProduct),
                      status,
                      price: this.price,
                      deliveryFee: this.deliveryFee,
                      discount: this.discount,
                    },
                  ],
                };
                this.dmService
                  .postOption(payload, this.REQUEST_DATA_URL, '/assignWork')
                  .subscribe(
                    (res: HttpResponse<any>) => {
                      this.loading.dismiss();
                      if (res.status === 200) {
                        this.isToastOpen = true;
                        this.messageToast = 'Lưu thông tin thành công';
                        this.modal.dismiss(null, 'confirm');
                      } else {
                        this.isToastOpen = true;
                        this.messageToast = res.body.MESSAGE
                          ? res.body.MESSAGE
                          : 'Có lỗi xảy ra, vui lòng thử lại';
                      }
                    },
                    () => {
                      this.isToastOpen = true;
                      this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
                    }
                  );
              } else {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = res.body.MESSAGE
                  ? res.body.MESSAGE
                  : 'Có lỗi xảy ra, vui lòng thử lại';
              }
            },
            () => {
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
              console.error();
            }
          );
      }
      return;
    } else if (status === 10) {
      if (this.data.cost == null || this.data.cost == 0) {
        if (!this.config) {
          this.data.cost = 0;
        } else if (
          this.data.dateOnly < this.config.fromDate ||
          this.data.dateOnly > this.config.toDate
        ) {
          this.data.cost = this.config.defaultValue;
        } else {
          this.data.cost = this.config.value;
        }
      }
      this.data.cost;
      this.data.deliveryFee = 0;
      this.data.discount = 0;
    } else {
      this.data.cost = 0;
    }
    const payload = {
      dataList: [
        {
          ...this.data,
          dateChanged,
          date: parseInt(
            moment(this.data.date, 'HH:mm:ss DD/MM/YYYY').format(
              'YYYYMMDDHHmmss'
            )
          ),
          ngay: this.data.date,
          name: this.name,
          phone: this.phone,
          product: this.product,
          note: this.note,
          dataInfo: JSON.stringify(dataInfo),
          productIds: JSON.stringify(this.listProduct),
          status,
          price: this.price,
          deliveryFee: this.deliveryFee,
          discount: this.discount,
        },
      ],
    };
    await this.isLoading();
    this.dmService
      .postOption(payload, this.REQUEST_DATA_URL, '/assignWork')
      .subscribe(
        (res: HttpResponse<any>) => {
          this.loading.dismiss();
          if (status !== -1) {
            this.modal.dismiss(null, 'confirm');
          }
          this.isToastOpen = true;
          this.messageToast = res.body.MESSAGE
            ? res.body.MESSAGE
            : 'Lưu thông tin thành công';
        },
        () => {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
        }
      );
  }
  async getTracking() {
    await this.isLoading();
    this.dmService
      .get('/api/v1/data/tracking?code=' + this.data.shippingCode)
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body) {
            if (res.body.CODE === 200) {
              this.loading.dismiss();
              this.listTracking = res.body.RESULT;
            } else {
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = res.body.MESSAGE
                ? res.body.MESSAGE
                : 'Có lỗi xảy ra, vui lòng thử lại';
            }
          }
        },
        () => {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
          console.error();
        }
      );
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
  setShowTracking(show: boolean) {
    this.isShowTracking = show;
    if (show) {
      this.getTracking();
    }
  }
}
