import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
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
  name = '';
  phone = '';
  address = '';
  staus: any;
  shop: any;
  id: any;
  createAt: any;
  flag: any;
  updateAt: any;
  code: any;

  shopCode: any;
  isToastOpen = false;
  isOpenAddModal = false;
  listShop: any[] = [];
  messageToast: any;
  totalImportProduct: any;
  totalInventoryQuantity: any;
  totalAwaitingProduct: any;
  price: any;
  info: any;
  localData: any;
  inputData: any;
  newData: any;
  REQUEST_URL = '/api/v1/warehouse';
  REQUEST_URL_SHOP = '/api/v1/shop';

  constructor(
    private modalCtrl: ModalController,
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit(): void {
    if (this.type === 'edit') {
      this.name = this.data.name;
      this.phone = this.data.phone;
      this.address = this.data.address;
      this.staus = this.data.staus;
      this.shop = this.data.shop;
      this.id = this.data.id;
      this.createAt = this.data.createAt;
      this.flag = this.data.flag;
      this.updateAt = this.data.updateAt;
      this.code = this.data.code;
      console.log(this.name, this.id, this.createAt, this.flag, this.code,this.shop)
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

    const { role } = await actionSheet.onWillDismiss();
    if (role === 'confirm') {
      this.modalCtrl.dismiss();
    }
  }

  async save() {
    const newData = {
        address: this.address,
        name: this.name,
        phone: this.phone,
        staus: this.staus,
        shop: this.shop,
        id: this.id,
        createAt: this.createAt,
        flag: this.flag,
        updateAt: this.updateAt,
        code: this.code,
      
    };
    this.modalCtrl.dismiss(newData, 'confirm');
  }
}
