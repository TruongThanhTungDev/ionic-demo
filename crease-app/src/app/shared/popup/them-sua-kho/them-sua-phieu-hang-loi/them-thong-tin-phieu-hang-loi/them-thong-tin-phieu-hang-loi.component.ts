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
  @Input() updateAt: any;
  @Input() estimatedReturnDate:any;
  @Input() FtType: any;
  @Input() note: any;
  @Input() data: any;
  status: any;
  isToastOpen=false;
  messageToast: any;
  estimatedReturnDateInfo:any;
  tenLoaiPhieu: any
  ftUpdateAt:any;
  loaiPhieu=[
    {
      value: 4,
      name: 'Xuất hàng lỗi'
    },
    {
      value: 5,
      name: 'Nhập hàng đổi trả'
    }
  ]
  ngOnInit(): void {
    this.createAt = moment(this.createAt, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.ftUpdateAt =this.updateAt ? moment(this.updateAt, 'DD/MM/YYYY').format('YYYY-MM-DD'):'';
    this.estimatedReturnDateInfo = this.estimatedReturnDate ? moment(this.estimatedReturnDate, 'DD/MM/YYYY').format('YYYY-MM-DD'): '';
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
  validInfo(){
    if (!this.FtType) {
      this.isToastOpen = true;
      this.messageToast = 'Loại phiếu không được để trống';
      return;
    }
    if (!this.createAt) {
      this.isToastOpen = true;
      this.messageToast = 'Ngày tạo phiếu không được để trống';
      return;
    }
   
    return true;
  }
  setOpen(open: boolean) {
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
    if (open) {
      this.createAt = this.createAt;
      this.updateAt = this.ftUpdateAt ? moment(this.ftUpdateAt,
        'YYYY-MM-DD'
      ).format('DD/MM/YYYY'):"";
      this.estimatedReturnDateInfo = this.estimatedReturnDate;
      this.note= this.note;
    } 

  }
  setToastOpen(open: boolean) { 
    this.isToastOpen = open; 
  }
  onInputDateBlur() {
    if (moment(this.updateAt, 'YYYY-MM-DD', true).isValid()) {
      this.updateAt = this.updateAt;
    } else {
      this.updateAt = '';
    }
  }
  changeLoaiPhieu(e:any){
  const result = this.loaiPhieu.find((item: any) => item.value == e.target.value);
    if(result) {
      this.tenLoaiPhieu = result.name
    } else {
      this.tenLoaiPhieu = ''
    }
  }
  saveInfo() {
    if(this.validInfo()){
      const value = {
        createAt: moment(this.createAt, 'YYYY-MM-DD').format('DD/MM/YYYY'),
        updateAt: this.ftUpdateAt ? moment(this.ftUpdateAt,
          'YYYY-MM-DD'
        ).format('DD/MM/YYYY'):"",
        estimatedReturnDate: this.estimatedReturnDateInfo ? moment(this.estimatedReturnDateInfo,
          'YYYY-MM-DD'
        ).format('DD/MM/YYYY'):"",
        FtType:this.FtType,
        note: this.note,
        tenLoaiPhieu: this.tenLoaiPhieu,
        isOpen: false,
      };
      this.editValue.emit(value);
      this.setOpen(false);
    }
    }   
    public convertType(Ftype: any) {
      if (Ftype === 4) {
        return 'Xuất hàng lỗi';
      } else if (Ftype === 5) {
        return 'Nhập hàng đổi trả';
      } 
      return Ftype;
    }
}
