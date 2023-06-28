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
  selector: 'them-sua-kho',
  templateUrl: './them-sua-kho.component.html',
  styleUrls: ['./them-sua-kho.component.scss'],
})
export class ThemSuaKhoComponent implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  name='';
  phone='';
  address='';
  shopCode :any;
  isToastOpen = false;
  isOpenAddModal=false;
  listShop:any = [];
  messageToast: any;
  totalImportProduct:any;
  totalInventoryQuantity:any;
  totalAwaitingProduct:any;
  price:any;
  info: any;
  localData:any;
  inputData:any
  REQUEST_URL = '/api/v1/warehouse';
  REQUEST_URL_SHOP = '/api/v1/shop';
  constructor(
    private modalCtrl: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService,
    private actionSheetCtrl: ActionSheetController
    
  ) { 
    }
  ngOnInit(): void {
    if(this.type === 'edit') {
      this.name=this.data.name;
      this.phone=this.data.phone;
      this.address=this.data.address;         
    }
    
  }
  async cancel() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Bạn có chắc muốn thoát không?',
      buttons: [
        {
          text: 'Đồng ý',
          role: 'confirm',
        },
        {
          text: 'Hủy',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const {data, role } = await actionSheet.onWillDismiss();
    if (role === 'confirm') {
      this.modalCtrl.dismiss();
    }
  }
  async save(){       
        const newData = {
          name: this.name,
          phone: this.phone,
          address: this.address
        };
        this.modalCtrl.dismiss(newData, 'confirm');
        
        
  } 
}