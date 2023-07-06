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

  info:any;
  id:any;
  creatorName:any;
  createAt:any;
  estimatedReturnDate:any;
  tranportFee:any;
  discount:any;
  note:any;
  status:any;
  subProductList:any[]=[]
  item:any
  listSanPham=[]
  isToastOpen: any;
  shop:any;
  khoId:any;
  
  ngOnInit(): void {
    this.info = this.localStorage.retrieve('authenticationtoken');
    console.log(this.info)
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
    console.log(this.data)
    if (this.data && this.data.boLDetailList) {
      const subProductList: any[] = [];
      this.data.boLDetailList.forEach((item: any) => {
        const subProduct = item;
        if (subProduct) {
          subProductList.push(subProduct);
        }
      });
      this.subProductList = subProductList;
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
    this.khoId = this.localStorage.retrieve("warehouseId");
  }
  cancel() {
    this.modalNhap.dismiss();
  }
  getSanPham(khoId: any): void {
    const params = {
      sort: ["id", "desc"],
      page: 0,
      size: 10000,
      filter: "status==1;shopcode==" + this.shopCode + ';warehouseId==' + khoId,
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
}