import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { OPERATIONS } from 'src/app/app.constant';
import { DanhMucService } from 'src/app/danhmuc.services';
@Component({
  selector: 'thong-tin-san-pham',
  templateUrl: './them-san-pham.component.html',
  
})
export class ThemSanPhamComponent implements OnInit {
  @Output() handleOpenModal = new EventEmitter<any>();
  @Output() editValue = new EventEmitter<any>();
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  @Input() shopCode: any;
  @Input() isModalOpen: any;
  @Input() product: any;
  @Input() subProductCode: any;
  @Input() subProductProperties: any;
  @Input() warehouse: any;
  @Input() totalQuantity: any;
  @Input() availableQuantity: any;
  @Input() totalPrice: any;
  @Input() nhaCungCap: any;
  @Input() price: any;
  listSanPham: any[] = [];
  listSanPhamCT: any[] = [];
  listKho: any[] = [];
  isToastOpen: any;
  messageToast: any;
  info: any;
  shop: any;
  khoId: any;
  kho: any;
  status: any;

  ngOnInit(): void {
    this.getKho();
    if (this.data) {
      this.khoId = this.data.warehouse.id;
      this.status = this.data.status;
      this.nhaCungCap=this.data.supplierInfo;
    } else {
      this.status = 0;
    }
    if (this.khoId) {
      this.getSanPham(this.khoId);
    }
  }

  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
    this.shop = this.localStorage.retrieve('shop');
  }

  setOpen(open: boolean) {
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
  }

  saveInfo() {
    const value = {
      product: this.product,
      subProductCode: this.subProductCode,
      totalQuantity: this.totalQuantity,
      availableQuantity: this.availableQuantity,
      nhaCungCap: this.nhaCungCap,
      price: this.price,
      khoId: this.khoId,
      isOpen: false,
    };
    this.listSanPhamCT = [];
    this.editValue.emit(value);
    this.resetInfo();
    this.setOpen(false);
  }
  resetInfo() {
    this.product = {};
    this.subProductCode = {};
    this.totalQuantity = '';
    this.availableQuantity = '';
    this.price = '';
  }
  getSanPham(khoId: any): void {
    const params = {
      sort: ['id', 'desc'],
      page: 0,
      size: 10000,
      filter:
        'status==1;shopcode==' + this.shop.code + ';warehouseId==' + this.khoId,
    };
    this.dmService.query(params, '/api/v1/product').subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.listSanPham = res.body.RESULT.content;
        } else {
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
          console.error();
        }
      },
      () => {
        this.isToastOpen = true;
        this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
        console.error();
      }
    );
  }
  getKho(): void {
    const params = {
      sort: ['id', 'asc'],
      page: 0,
      size: 1000,
      filter: 'id>0;staus>=0;shop.code==' + this.shop.code,
    };
    this.dmService.query(params, '/api/v1/warehouse').subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.listKho = res.body.RESULT.content;
        } else {
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
          console.error();
        }
      },
      () => {
        this.isToastOpen = true;
        this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
        console.error();
      }
    );
  }
  changeKho(e: any) {
    this.khoId = e.target.value;
    this.getSanPham(this.khoId);
  }

  getSanPhamCT(e: any) {
    if (e) {
      const params = {
        sort: ['id', 'asc'],
        page: 0,
        size: 1000,
        filter: 'product.id==' + e.id,
      };
      this.dmService.query(params, '/api/v1/sub-product').subscribe(
        (res: HttpResponse<any>) => {
          if (res.body) {
            if (res.body.CODE === 200) {
              this.listSanPhamCT = this.customListSPCT(res.body.RESULT.content);
            } else {
              this.isToastOpen = true;
              this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
            }
          }
        },
        () => {
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
          console.error();
        }
      );
    } else {
      this.listSanPhamCT = [];
    }
  }

  customListSPCT(list: any) {
    list.forEach((e: any) => (e.ten = e.code + ' | ' + e.properties));
    return list;
  }
}
