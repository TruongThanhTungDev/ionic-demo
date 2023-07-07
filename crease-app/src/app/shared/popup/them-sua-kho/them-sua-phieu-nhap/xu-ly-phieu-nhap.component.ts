import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { OPERATIONS } from 'src/app/app.constant';
import { DanhMucService } from 'src/app/danhmuc.services';
@Component({
  selector: 'xu-ly-phieu-nhap',
  templateUrl: './xu-ly-phieu-nhap.component.html',
})
export class XulyPhieuNhapComponent implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  @Input() shopCode: any;

  messageToast: any;
  subProductList: any[] = [];
  listSanPham = [];
  isToastOpen: any;
  isShowPhieuNhap = false;
  isShowSanPham=false;
  shop: any;
  khoId: any;
  info: any;
  id: any;
  creatorName: any;
  createAt: any;
  estimatedReturnDate: any;
  tranportFee: any;
  discount: any;
  note: any;
  status: any;
  subproductName:any;
  subproductCode:any; 
  subproductProperties:any ;
  wareHouseName:any;
  totalQuantity:any ;
  availableQuantity:any ;
  totalPrice:any ;
  ngOnInit(): void {
    this.info = this.localStorage.retrieve('authenticationtoken');
    if (this.data) {
      this.id = this.data.id;
      this.creatorName = this.data.creatorName;
      this.createAt = this.data.createAt;
      this.estimatedReturnDate = this.data.estimatedReturnDate;
      this.tranportFee = this.data.tranportFee;
      this.discount = this.data.discount;
      this.note = this.data.note;
      this.status = this.data.status;
    }
    if (this.data && this.data.boLDetailList) {
      const subProductList: any[] = [];
      this.data.boLDetailList.forEach((item: any) => {
        const subProduct = item;
        if (subProduct) {
          subProductList.push(subProduct);
        }
      });
      this.subProductList = subProductList;
      console.log('this.subProductList :>> ', this.subProductList);
    }
  }
  constructor(
    private modalNhap: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
    this.shop = this.localStorage.retrieve('shop');
    this.khoId = this.localStorage.retrieve('warehouseId');
  }
  cancel() {
    this.modalNhap.dismiss();
  }

  async editPhieuNhap(open: any) {
    this.isShowPhieuNhap = open;
  }
  handleEditPhieuNhap(value: any) {
    this.createAt = value.createAt;
    this.estimatedReturnDate = value.estimatedReturnDate;
    this.tranportFee = value.tranportFee;
    this.discount = value.discount;
    this.note = value.note;
    this.isShowPhieuNhap = value.isOpen;
    console.log(this.isShowPhieuNhap);
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
  async editSanPham(open: any) {
    this.isShowSanPham = open;
  }
  handleEditSanPham(value: any) {
    this.subproductName = value.subproductName;
    this.subproductCode = value.subproductCode;
    this.subproductProperties = value.subproductProperties;
    this.wareHouseName = value.wareHouseName;
    this.totalQuantity = value.totalQuantity;
    this.availableQuantity = value.availableQuantity;
    this.totalPrice = value.totalPrice;
    this.isShowSanPham = value.isOpen;
  }
}
