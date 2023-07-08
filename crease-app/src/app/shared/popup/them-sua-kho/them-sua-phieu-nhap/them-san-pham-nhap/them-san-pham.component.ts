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
  @Input() subProductName : any;
  @Input() subProductCode: any;
  @Input() subProductProperties : any;
  @Input() wareHouseName : any;
  @Input() totalQuantity : any;
  @Input() availableQuantity: any;
  @Input() totalPrice: any;
  @Input() nhaCungCap:any;
  @Input() price:any;
  listSanPham = [];
  listSanPhamCT = [];
  listKho=[];
  isToastOpen:any;
  messageToast:any;
  info:any;
  shop:any;
  khoId:any;
  khoName:any;
  kho=null;


  ngOnInit(): void {
    this.getKho();
   
  }

  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
    this.shop = this.localStorage.retrieve('shop');
    this.khoId = this.localStorage.retrieve('warehouseId');
  }

  setOpen(open: boolean) {
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
  }

  saveInfo() {
    const value = {
    subProductName : this.subProductName,
    subProductCode : this.subProductCode,
    subProductProperties : this.subProductProperties,
    wareHouseName : this.wareHouseName,
    totalQuantity : this.totalQuantity,
    availableQuantity: this.availableQuantity,
    totalPrice : this.totalPrice,
    isOpen: false,
    };
    this.editValue.emit(value);
    this.setOpen(false);
  }
  getSanPham(khoId: any): void {
    const params = {
      sort: ["id", "desc"],
      page: 0,
      size: 10000,
      filter: "status==1;shopcode==" + this.shop.code + ';warehouseId==' + khoId,
    };
    this.dmService.query(params, "/api/v1/product").subscribe(
        (res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.listSanPham = res.body.RESULT.content;
          } else {
            this.isToastOpen = true;
            this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
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
      sort: ["id", "asc"],
      page: 0,
      size: 1000,
      filter: "id>0;staus>=0;shop.code==" + this.shop.code,
    };
    this.dmService.query(params, "/api/v1/warehouse").subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.listKho = res.body.RESULT.content;
        } else {
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
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
    this.kho = e;
    this.getSanPham(e.id);
  }
  
  
  getSanPhamCT(e: any) {
    if (e) {
      const params = {
        sort: ["id", "asc"],
        page: 0,
        size: 1000,
        filter: "product.id==" + e.id,
      };
      this.dmService.query(params, "/api/v1/sub-product").subscribe(
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
    list.forEach((e: any) => (e.ten = e.code + " | " + e.properties));
    return list;
  }
  
}
