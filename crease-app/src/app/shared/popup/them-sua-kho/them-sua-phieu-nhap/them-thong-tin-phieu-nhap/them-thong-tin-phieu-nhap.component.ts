import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() estimatedReturnDate: any;
  @Input() tranportFee: any;
  @Input() discount: any;
  @Input() note: any;
  @Input() data: any;
  status: any;

  ngOnInit(): void {
    this.createAt = moment(this.createAt, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.estimatedReturnDate = moment(
      this.estimatedReturnDate,
      'DD/MM/YYYY'
    ).format('YYYY-MM-DD');
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
    private loading: LoadingController
  ) {}

  setOpen(open: boolean) {
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
  }

  saveInfo() {
    const value = {
      createAt: moment(this.createAt, 'YYYY-MM-DD').format('DD/MM/YYYY'),
      estimatedReturnDate: moment(
        this.estimatedReturnDate,
        'YYYY-MM-DD'
      ).format('DD/MM/YYYY'),
      tranportFee: this.tranportFee,
      discount: this.discount,
      note: this.note,
      isOpen: false,
    };
    this.editValue.emit(value);
    this.setOpen(false);
  }
}
