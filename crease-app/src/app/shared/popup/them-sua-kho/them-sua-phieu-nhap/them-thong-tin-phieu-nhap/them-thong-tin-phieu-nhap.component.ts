import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { OPERATIONS } from 'src/app/app.constant';
import { DanhMucService } from 'src/app/danhmuc.services';
@Component({
  selector: 'thong-tin-phieu-nhap',
  templateUrl: './them-thong-tin-phieu-nhap.component.html',
})
export class ThemThongTinPhieuNhapComponent implements OnInit {
  @Output() handleOpenModal = new EventEmitter<any>();
  @Output() editValue = new EventEmitter<any>();
  @Input() shopCode: any;
  @Input() isModalOpen: any;
  @Input() createAt: any;
  @Input() estimatedReturnDate= '';
  @Input() tranportFee: any;
  @Input() discount: any;
  @Input() note: any;
  @Input() data: any;
  status: any;
  isToastOpen=false;
  messageToast:any;
  

  ngOnInit(): void {
    this.createAt = moment(this.createAt, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.estimatedReturnDate = this.estimatedReturnDate ? moment(this.estimatedReturnDate, 'DD/MM/YYYY').format('YYYY-MM-DD'): '';
    if (this.data) {
      this.status=this.data.status
    }
    else{
      this.status=0
    }
  }
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private elementRef: ElementRef, 
    private renderer: Renderer2,
  ) {}

  setOpen(open: boolean) {
    this.isToastOpen = open;
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
    if (open) {
      this.createAt = this.createAt;
      this.estimatedReturnDate = this.estimatedReturnDate;
      this.tranportFee= this.tranportFee;
      this.discount=this.discount;
      this.note= this.note;
    } 
  }
  onInputDateBlur() {
    if (moment(this.estimatedReturnDate, 'YYYY-MM-DD', true).isValid()) {
      this.estimatedReturnDate = this.estimatedReturnDate;
    } else {
      this.estimatedReturnDate = '';
    }
  }
  validInfo() {
    if (!this.createAt) {
      this.isToastOpen = true;
      this.messageToast = 'Ngày tạo phiếu không được để trống';
      return false;
    }
    if (this.estimatedReturnDate && this.createAt > this.estimatedReturnDate) {
      this.isToastOpen = true;
      this.messageToast = 'Ngày về dự kiến không cho phép nhỏ hơn ngày tạo phiếu';
      return false;
    }
    if(this.tranportFee < 0 ){  
      this.isToastOpen = true;
      this.messageToast = 'Phí ship không được nhỏ hơn 0';   
      return false;  
    }
    if(this.discount < 0 ){  
      this.isToastOpen = true;
      this.messageToast = 'Chiết khấu không được nhỏ hơn 0';   
      return false;  
    }
    return true;
  }
  saveInfo() {
    if(this.validInfo()){
      const value = {
        createAt: moment(this.createAt, 'YYYY-MM-DD').format('DD/MM/YYYY'),
        estimatedReturnDate: this.estimatedReturnDate ? moment(this.estimatedReturnDate,
          'YYYY-MM-DD'
        ).format('DD/MM/YYYY'):"",
        tranportFee: this.tranportFee,
        discount: this.discount,
        note: this.note,
        isOpen: false,
      };
      this.editValue.emit(value);
      this.setOpen(false);
    }
    }  
}
