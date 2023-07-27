import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Plugin } from 'src/app/plugins/plugins';

@Component({
  selector: 'thong-tin-don-hang',
  templateUrl: './thong-tin-don-hang.component.html',
  styleUrls: ['./thong-tin-don-hang.component.scss'],
})
export class ThongTinDonHangOrder implements OnInit {
  @Output() handleOpenModal = new EventEmitter<any>();
  @Output() editValue = new EventEmitter<any>();
  @Input() price: any;
  @Input() deliveryFeeCost: any;
  @Input() discountCost: any;
  @Input() products: any;
  @Input() productName: any;
  @Input() cogs: any;
  @Input() shopCode: any;
  @Input() status: any;
  @Input() date: any;
  listProduct: any;
  productOption: any[] = [];
  cogsField = 0;
  discount = 0;
  deliveryFee = 0;
  totalMoney = 0;
  totalCost = 0;
  selectedProduct: any;
  info: any;
  configInfo: any;
  plugins = new Plugin();
  REQUEST_SUB_PRODUCT_URL = '/api/v1/sub-product';
  REQUEST_CONFIG_URL = '/api/v1/config';
  isModalOpen = false;
  isToastOpen = false;
  messageToast: any;
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
  }
  ngOnInit() {
    this.loadDataProduct();
    this.productOption = this.deepClone(this.products);
    if (this.deliveryFeeCost) {
      this.deliveryFee = this.deliveryFeeCost;
    }
    if (this.discountCost) {
      this.discount = this.discountCost;
    }
    if (this.cogs) {
      this.cogsField = this.cogs;
    }
    this.getTotalMoney();
    this.getPrice();
  }
  get disableInput() {
    return this.info.role === 'admin' && this.status === 8;
  }
  get disableEdit() {
    return (
      (this.info.role === 'admin' &&
        (this.status === 8 ||
          this.status === 10 ||
          this.status === 11 ||
          this.status === 12 ||
          this.status === 13 ||
          this.status === 14 ||
          this.status === 15 ||
          this.status === 16 ||
          this.status === 17 ||
          this.status === 18 ||
          this.status === 19 ||
          this.status === 20)) ||
      (this.info.role === 'user' &&
        (this.status === 7 ||
          this.status === 8 ||
          this.status === 10 ||
          this.status === 11 ||
          this.status === 12 ||
          this.status === 13 ||
          this.status === 14 ||
          this.status === 15 ||
          this.status === 16 ||
          this.status === 17 ||
          this.status === 18 ||
          this.status === 19 ||
          this.status === 20))
    );
  }
  public async loadDataProduct() {
    await this.isLoading();
    this.dmService
      .getOption(
        null,
        this.REQUEST_SUB_PRODUCT_URL,
        '/search?filter=product.shopcode==' +
          this.shopCode +
          ';status==1&sort=id,asc&size=1000&page=0'
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          this.loading.dismiss();
          this.listProduct = res.body.RESULT.content;
        },
        () => {
          this.loading.dismiss();
          console.error();
        }
      );
  }
  onChangeQuantityClick(index: number, isPlus: any) {
    if (this.disableInput) return;
    if (isPlus) {
      this.productOption[index].quantity++;
      this.productOption[index].price =
        this.productOption[index].product.price *
        this.productOption[index].quantity;
      this.getCost();
    } else {
      this.productOption[index].quantity--;
      if (this.productOption[index].quantity == 0) {
        this.productOption.splice(index, 1);
        return;
      }
      this.productOption[index].price =
        this.productOption[index].product.price *
        this.productOption[index].quantity;
      this.getCost();
    }
  }
  onChangeQuantity(index: number) {
    if (this.productOption[index].quantity <= 0) {
      this.isToastOpen = true;
      this.messageToast = 'Số lượng phải lớn hơn 0';
      return;
    }
    this.productOption[index].price =
      this.productOption[index].product.price *
      this.productOption[index].quantity;
    this.getCost();
  }
  onChangeProduct(event: any) {
    this.selectedProduct = event;
    const item = {
      price: event.price,
      product: event,
      quantity: 1,
    };
    this.productOption.push(item);
    setTimeout(() => {
      this.selectedProduct = null;
    }, 200);
  }
  public getCost() {
    let entity = { code: 'CPVC' + this.shopCode };
    this.dmService
      .getOption(
        null,
        this.REQUEST_CONFIG_URL,
        '/search?filter=code==' +
          entity.code +
          ';status==1&sort=id,asc&size=1&page=0'
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          this.configInfo = res.body.RESULT.content[0];
        },
        () => {
          console.error();
        }
      );
  }
  getTotalMoney() {
    if (this.productOption && !this.productOption.length) return;
    this.totalMoney = this.productOption.reduce(
      (sum: any, item: any) => sum + item.price,
      0
    );
  }
  setOpenToast(open: boolean) {
    this.isToastOpen = open;
  }
  setOpen(open: boolean) {
    this.isModalOpen = open;
    if (open) {
      this.loadDataProduct();
      this.productOption = this.deepClone(this.products);
      if (this.deliveryFeeCost) {
        this.deliveryFee = this.deliveryFeeCost;
      }
      if (this.discountCost) {
        this.discount = this.discountCost;
      }
      if (this.cogs) {
        this.cogsField = this.cogs;
      }
      if (this.cogs) {
        this.cogsField = this.cogs;
      }
      this.getTotalMoney();
      this.getPrice();
    }
  }
  saveInfo() {
    const value = {
      products: this.productOption,
      deliveryFee: this.deliveryFee,
      discount: this.discount,
      config: this.configInfo,
    };
    this.products = this.productOption;
    console.log('this.products :>> ', this.products);
    this.editValue.emit(value);
    this.setOpen(false);
    this.getTotalMoney();
    this.getPrice();
  }
  getPrice() {
    this.price = this.totalMoney - this.discount + this.deliveryFee;
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
  deepClone(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    let clone: any = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = this.deepClone(obj[key]);
      }
    }

    return clone;
  }
}
