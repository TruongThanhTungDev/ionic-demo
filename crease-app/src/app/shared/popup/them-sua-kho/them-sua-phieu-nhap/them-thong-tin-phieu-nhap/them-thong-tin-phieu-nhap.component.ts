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
  templateUrl: './them-thong-tin-phieu-nhap.component.html',
  
})
export class ThemThongTinPhieuNhapComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  @Input() shopCode: any;
}