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
  @Input() isModalOpen: any;
  @Input() price: any;
  @Input() products: any;
  @Input() productName: any;
  @Input() cogs: any;
  @Input() shopCode: any;
  @Input() status: any;
  listProduct: any;
  productOption: any;
  cogsField = 0;
  discount = 0;
  deliveryFee = 0;
  selectedProduct: any;
  info: any;
  configInfo: any;
  plugins = new Plugin();
  REQUEST_SUB_PRODUCT_URL = '/api/v1/sub-product';
  REQUEST_CONFIG_URL = '/api/v1/config';
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
    this.productOption = [...this.products];
    if (this.cogs) {
      this.cogsField = this.cogs;
    }
  }
  get disableInput() {
    return this.info.role === 'admin' && this.status === 8;
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
  setOpenToast(open: boolean) {
    this.isToastOpen = open;
  }
  setOpen(open: boolean) {
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
    this.isToastOpen = false;
  }
  saveInfo() {
    const value = {
      products: this.productOption,
      deliveryFee: this.deliveryFee,
      discount: this.discount,
      config: this.configInfo,
    };
    this.editValue.emit(value);
    this.setOpen(false);
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
