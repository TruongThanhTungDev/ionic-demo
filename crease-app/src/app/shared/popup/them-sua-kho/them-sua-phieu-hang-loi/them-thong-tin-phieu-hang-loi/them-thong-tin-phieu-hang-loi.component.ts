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
  selector: 'thong-tin-phieu-hang-loi',
  templateUrl: './them-thong-tin-phieu-hang-loi.component.html',
})
export class ThemThongTinPhieuHangLoiComponent implements OnInit {
  @Output() handleOpenModal = new EventEmitter<any>();
  @Output() editValue = new EventEmitter<any>();
  @Input() shopCode: any;
  @Input() isModalOpen: any;
  @Input() createAt: any;
  @Input() estimatedReturnDate:any;
  @Input() FtType: any;
  @Input() note: any;
  @Input() data: any;
  status: any;
  

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
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
  }
  onInputDateBlur() {
    if (moment(this.estimatedReturnDate, 'YYYY-MM-DD', true).isValid()) {
      this.estimatedReturnDate = this.estimatedReturnDate;
    } else {
      this.estimatedReturnDate = '';
    }
  }
  
  saveInfo() {
    const value = {
      createAt: moment(this.createAt, 'YYYY-MM-DD').format('DD/MM/YYYY'),
      estimatedReturnDate: this.estimatedReturnDate ? moment(this.estimatedReturnDate,
        'YYYY-MM-DD'
      ).format('DD/MM/YYYY'):"",
      FtType:this.FtType,
      note: this.note,
      isOpen: false,
    };
    this.editValue.emit(value);
    this.setOpen(false);
  }
}
