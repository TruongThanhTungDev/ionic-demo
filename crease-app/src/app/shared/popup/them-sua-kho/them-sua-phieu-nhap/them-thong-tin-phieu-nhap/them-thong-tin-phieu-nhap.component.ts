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
  selector: 'xu-ly-phieu-nhap',
  templateUrl: './them-thong-tin-phieu-nhap.component.html',
  
})
export class ThemThongTinPhieuNhapComponent implements OnInit {
 
  @Output() handleOpenModal = new EventEmitter<any>();
  @Output() editValue = new EventEmitter<any>();
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  @Input() shopCode: any;
  @Input() isModalOpen: any;
  @Input() createAt:any;
  @Input() estimatedReturnDate:any;
  @Input() tranportFee:any;
  @Input() discount:any;
  @Input() note:any;
  ftCreateAt:any;
  ftEstimatedReturnDate:any;
  ftTranportFee:any;
  ftDiscount:any;
  ftNote:any;

  
  ngOnInit(): void {
  
  }
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController
  ) {}

  setOpen(open: boolean) {
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
   
  }

  saveInfo() {
    const value = {
      createAt: this.ftCreateAt,
      estimatedReturnDate: this.ftEstimatedReturnDate,
      tranportFee: this.ftTranportFee,
      discount: this.ftDiscount,
      note: this.ftNote,
      isOpen: false,
    };
    this.editValue.emit(value);
    this.setOpen(false);
  }
  // getSanPham(khoId: any): void {
  //   const params = {
  //     sort: ["id", "desc"],
  //     page: 0,
  //     size: 10000,
  //     filter: "status==1;shopcode==" + this.shopCode + ';warehouseId==' + khoId,
  //   };
  //   this.dmService.query(params, "/api/v1/product").subscribe(
  //       (res: HttpResponse<any>) => {
  //         if (res.status === 200) {
  //           this.listSanPham = res.body.RESULT.content;           
  //         } else {        
  //           this.isToastOpen = true;
  //           this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
  //         }
  //       },
  //       () => {
  //         this.isToastOpen = true;
  //         this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
  //         console.error();
  //       }
  //     );
  // }
}