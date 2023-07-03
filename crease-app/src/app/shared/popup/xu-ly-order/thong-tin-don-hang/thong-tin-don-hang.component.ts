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
      this.products[index].quantity += 1;
      this.products[index].price =
        this.products[index].price * this.products[index].quantity;
    } else {
      if (this.products[index].quantity == 1) {
        this.isToastOpen = true;
        this.messageToast = 'Số lượng phải lớn hơn 0';
        return;
      }
      this.products[index].quantity -= 1;
      this.products[index].price =
        this.products[index].price / this.products[index].quantity;
    }
  }
  onChangeQuantity(index: number) {
    if (this.products[index].quantity <= 0) {
      this.isToastOpen = true;
      this.messageToast = 'Số lượng phải lớn hơn 0';
      return;
    }
  }
  setOpenToast(open: boolean) {
    this.isToastOpen = open;
  }
  setOpen(open: boolean) {
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
  }
  saveInfo() {
    const value = {};
    this.editValue.emit(value);
    this.setOpen(false);
  }
}
