import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Plugin } from '../../utils/plugins';

@Component({
  selector: 'xu-ly-product',
  templateUrl: './xu-ly-product.component.html',
})
export class XuLyProduct implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  @Input() shopCode: any;
  REQUEST_URL = '/api/v1/product';
  REQUEST_URL_SUB = '/api/v1/sub-product';
  info: any;
  shop: any;
  name: any;
  code: any;
  image: any;
  warehouseId: any;
  warehouseName: any;
  note: any;
  productCategoryId: any;
  productCategoryName: any;
  productModelProp: any;
  productModelSize: any;
  productModelWeight: any;
  productModelPrice = 0;
  productModelFinalPrice = 0;
  properties: any[] = [];
  listAddProperties: any[] = [];
  listThuocTinhMau: any[] = [];
  isToastOpen = false;
  messageToast: any;
  plugins = new Plugin();
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
    this.shop = this.localStorage.retrieve('shop');
  }
  ngOnInit() {
    if (this.type === 'edit') {
      this.name = this.data.name;
      this.code = this.data.code;
      this.image = this.data.image;
      this.note = this.data.note;
      this.warehouseId = this.data.warehouseId;
      this.warehouseName = this.data.subProductList[0].warehouse.name;
      this.productModelProp = this.data.subProductList;
      this.productCategoryId = this.data.productCategory.id;
      this.productCategoryName = this.data.productCategory.name;
      this.properties = JSON.parse(this.data.properties);
    }
    this.getThuocTinhMau();
  }
  getValueInfo(value: any) {
    this.name = value.name;
    this.code = value.code;
    this.image = value.image;
    this.note = value.note;
    this.warehouseId = value.warehouseId;
    this.productCategoryId = value.productCategoryId;
    this.productCategoryName = value.productCategoryName;
  }
  getValueInventory(value: any) {
    // this.productModelProp = value.props;
  }
  addNewProperties() {
    const value = {
      thuocTinh: '',
      giaTri: '',
      isEdit: false,
    };
    this.listAddProperties.push(value);
  }
  handleAddProp(index: any, prop: any) {
    if (!prop.thuocTinh && !prop.giaTri) {
      this.listAddProperties.splice(index, 1);
      return;
    }
    this.listAddProperties[index].thuocTinh = prop.thuocTinh;
    this.listAddProperties[index].giaTri = prop.giaTri;
    if (this.listAddProperties[index].index >= 0) {
      this.properties.splice(
        this.listAddProperties[index].index,
        1,
        this.listAddProperties[index]
      );
    } else {
      this.properties.push(this.listAddProperties[index]);
    }
    if (index !== -1) {
      this.listAddProperties.splice(index, 1);
    }
    this.getThuocTinhMau();
  }
  editProperties(item: any, index: any) {
    const newItem = {
      ...item,
      index,
    };
    if (this.listAddProperties.includes(item)) return;
    this.listAddProperties.push(newItem);
  }
  removeProperties(i: any, prop: any) {
    const index = this.listAddProperties.findIndex(
      (item: any, index: any) => i == index
    );
    const item = this.properties.findIndex(
      (el: any) => el.thuocTinh.toUpperCase() === prop.thuocTinh.toUpperCase()
    );
    if (index !== -1) {
      this.listAddProperties.splice(index, 1);
    }
    if (item !== -1) {
      this.properties.splice(item, 1);
    }
    this.getThuocTinhMau();
  }
  getThuocTinhMau() {
    this.listThuocTinhMau = this.properties.reduce((acc: any, item: any) => {
      const giaTriArr = item.giaTri.split(',');
      if (!acc.length) {
        acc.push(
          ...giaTriArr.map((giaTri: any) => `${item.thuocTinh}:${giaTri}`)
        );
      } else {
        const newArray: string[] = [];
        acc.forEach((el: any) => {
          giaTriArr.forEach((giaTri: any) => {
            newArray.push(`${el},${item.thuocTinh}:${giaTri}`);
          });
        });
        acc = newArray;
      }
      return acc;
    }, []);
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
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
      this.modal.dismiss();
    }
  }
  confirm() {
    this.modal.dismiss(null, 'confirm');
  }
  public async isLoading() {
    const isLoading = await this.loading.create({
      spinner: 'circles',
      keyboardClose: true,
      message: 'Đang tải',
      translucent: true,
    });
    return await isLoading.present();
  }
}
