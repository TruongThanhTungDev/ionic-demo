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
  selector: 'thong-tin-phieu-xuat',
  templateUrl: './them-thong-tin-phieu-xuat.component.html',
})
export class ThemThongTinPhieuXuatComponent implements OnInit {
  @Output() handleOpenModal = new EventEmitter<any>();
  @Output() editValue = new EventEmitter<any>();
  @Input() shopCode: any;
  @Input() isModalOpen: any;
  @Input() createAt: any;
  @Input() updateAt: any;
  @Input() estimatedReturnDate= '';
  @Input() note: any;
  @Input() data: any;
  status: any;
  isToastOpen=false;
  messageToast: any;
  estimatedReturnDateInfo:any
  ngOnInit(): void {
    this.createAt = moment(this.createAt, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.updateAt = moment(this.updateAt, 'DD/MM/YYYY').format('YYYY-MM-DD');
    // this.estimatedReturnDateInfo = this.estimatedReturnDate ? moment(this.estimatedReturnDate, 'DD/MM/YYYY').format('YYYY-MM-DD'): '';
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
      this.updateAt = this.updateAt;
      this.estimatedReturnDateInfo = this.estimatedReturnDate;
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
      return;
    }
    return true;
  }
  saveInfo() {
    const value = {
      createAt: moment(this.createAt, 'YYYY-MM-DD').format('DD/MM/YYYY'),
      updateAt: moment(this.updateAt, 'YYYY-MM-DD').format('DD/MM/YYYY'),
      estimatedReturnDate: this.estimatedReturnDateInfo ? moment(this.estimatedReturnDateInfo,
        'YYYY-MM-DD'
      ).format('DD/MM/YYYY'):"",
      note: this.note,
      isOpen: false,
    };
    this.editValue.emit(value);
    this.setOpen(false);
  }
}
