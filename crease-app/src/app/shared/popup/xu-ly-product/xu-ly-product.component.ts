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
import { HttpResponse } from '@angular/common/http';

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
  status = 1;
  productModelProp: any[] = [];
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
    this.shopCode = this.localStorage.retrieve('shopCode');
  }
  ngOnInit() {
    if (this.type === 'edit') {
      this.name = this.data.name;
      this.code = this.data.code;
      this.image = this.data.image;
      this.note = this.data.note;
      this.status = this.data.status;
      this.warehouseId = this.data.warehouseId;
      this.warehouseName = this.data.subProductList[0].warehouse.name;
      this.productModelProp = this.data.subProductList;
      this.productCategoryId = this.data.productCategory.id;
      this.productCategoryName = this.data.productCategory.name;
      this.properties = JSON.parse(this.data.properties);
    }
    this.getThuocTinhMau();
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
  getValueInfo(value: any) {
    this.name = value.name;
    this.code = value.code;
    this.image = value.image;
    this.note = value.note;
    this.warehouseId = value.warehouseId;
    this.productCategoryId = value.productCategoryId;
    this.productCategoryName = value.productCategoryName;
  }
  changeImage(value: any) {
    this.image = value;
  }
  getValueInventory(value: any) {
    this.productModelProp = value;
  }
  saveInfo() {
    const properties = this.properties.filter(
      (item: any) => item.giaTri && item.thuocTinh
    );
    const product = {
      productCategory: {
        id: this.productCategoryId,
      },
      code: this.code.trim().toUpperCase(),
      shopcode: this.shopCode,
      warehouseId: this.warehouseId,
      image: this.image,
      name: this.name.trim(),
      note: this.note,
      status: this.status,
      id: this.data ? this.data.id : 0,
      shop: this.shop,
      createAt: this.data ? this.data.createAt : null,
      description: this.data ? this.data.description : null,
      giaBan: this.data ? this.data.giaBan : null,
      giaNhap: this.data ? this.data.giaNhap : null,
      properties: JSON.stringify(properties),
    };
    const subProductList: any[] = [];
    this.productModelProp.forEach((item: any) => {
      console.log('item :>> ', item);
      const value = {
        availableQuantity: item.availableQuantity ? item.availableQuantity : 0,
        awaitingProductQuantity: item.awaitingProductQuantity
          ? item.awaitingProductQuantity
          : 0,
        code: item.code,
        defectiveProductQuantity: item.defectiveProductQuantity
          ? item.defectiveProductQuantity
          : 0,
        image: item.image,
        inventoryQuantity: item.inventoryQuantity ? item.inventoryQuantity : 0,
        lastImportedPrice: item.lastImportedPrice ? item.lastImportedPrice : 0,
        name: item.name,
        price: item.price ? item.price : 0,
        properties: item.properties,
        status: item.status,
        totalQuantity: item.totalQuantity ? item.totalQuantity : 0,
        warehouse: item.warehouse ? item.warehouse : null,
        high: item.high,
        length: item.length,
        wide: item.wide,
        weight: item.weight,
        id: item.id,
      };
      if (item.id) {
        value.id = item.id;
      } else {
        delete value.id;
      }
      subProductList.push(value);
    });
    const entity = {
      product,
      subProductList,
    };
    this.createData(entity);
  }
  async createData(data: any) {
    await this.isLoading();
    if (this.type === 'add') {
      delete data.product.id;
      this.dmService.postOption(data, this.REQUEST_URL, '/create').subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Tạo sản phẩm thành công';
            this.confirm();
          } else {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Tạo sản phẩm thất bại';
          }
        },
        () => {
          this.loading.dismiss();
          this.messageToast = 'Tạo sản phẩm thất bại';
          console.error();
        }
      );
    } else {
      this.dmService.postOption(data, this.REQUEST_URL, '/create').subscribe(
        (res: HttpResponse<any>) => {
          console.log('res :>> ', res);
          if (res.body.CODE === 200) {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Cập nhật sản phẩm thành công';
            this.confirm();
          } else {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Cập nhật sản phẩm thất bại';
          }
        },
        () => {
          this.loading.dismiss();
          this.messageToast = 'Cập nhật sản phẩm thất bại';
          console.error();
        }
      );
    }
    this.isToastOpen = false;
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
      this.isToastOpen = false;
    }
  }
  confirm() {
    this.modal.dismiss(null, 'confirm');
    this.isToastOpen = false;
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
