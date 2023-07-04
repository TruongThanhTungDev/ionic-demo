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

  info:any;
  id:any;
  creatorName:any;
  createAt:any;
  estimatedReturnDate:any;
  tranportFee:any;
  discount:any;
  note:any;
  status:any;


  ngOnInit(): void {
    if(this.data)
    {
      this.id=this.data.id;
      this.creatorName=this.data.creatorName;
      this.createAt=this.data.createAt;
      this.estimatedReturnDate=this.data.estimatedReturnDate;
      this.tranportFee=this.data.tranportFee;
      this.discount=this.data.discount;
      this.note=this.data.note;
      this.status=this.data.status;
    }
  }
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
  }
  cancel() {
    this.modal.dismiss();
  }
}