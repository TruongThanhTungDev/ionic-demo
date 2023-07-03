import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  info: any;
  plugins = new Plugin();
  REQUEST_SUB_PRODUCT_URL = '/api/v1/sub-product';
  isToastOpen = false;
  messageToast: any;
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService
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
  public loadDataProduct() {
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
          this.listProduct = res.body.RESULT.content;
        },
        () => {
          console.error();
        }
      );
  }
  onChangeQuantityClick(index: number, isPlus: any) {
    if (this.disableInput) return;
    if (isPlus) {
      this.productOption[index].quantity += 1;
      this.productOption[index].price +=
        this.productOption[index].product.price *
        this.productOption[index].quantity;
    } else {
      if (this.productOption[index].quantity == 1) {
        this.isToastOpen = true;
        this.messageToast = 'Số lượng phải lớn hơn 0';
        return;
      }
      this.productOption[index].quantity -= 1;
      this.productOption[index].price =
        this.productOption[index].product.price *
        this.productOption[index].quantity;
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
      cogs: this.cogsField,
    };
    this.editValue.emit(value);
    this.setOpen(false);
  }
}
