import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { Plugin } from 'src/app/plugins/plugins';

@Component({
  selector: 'mau-ma-san-pham',
  templateUrl: 'mau-ma-san-pham.component.html',
})
export class MauMaSanPhamComponent implements OnInit {
  @Output() editValue = new EventEmitter<any>();
  @Input() data: any;
  @Input() type: any;
  @Input() listThuocTinhMau: any[] = [];
  @Input() code: any;
  plugins = new Plugin();
  isModalOpen = false;
  isToastOpen = false;
  productPropertiesSelected: any[] = [];

  productModelProp: any;
  productModelSize: any;
  productModelWeight: any;
  productModelPrice = 0;
  productModelFinalPrice = 0;
  productModelTotalImport = 0;
  productTotalAvailable = 0;
  productTotalInventory = 0;
  productTotalError = 0;
  productTotalIncoming = 0;
  productCode: any;
  isNewItem = false;
  selectedModel: any;
  typeModal = 'add';
  messageToast: any;
  productStatus=1;
  ngOnInit() {
    if (this.type === 'edit') {
      this.findRemainingProps();
      this.getListPropsSelected();
    }
    
  }
  findRemainingProps() {
    this.data.forEach((item: any) => {
      const index = this.listThuocTinhMau.findIndex(
        (el: any) => el === item.properties
      );
      if (index !== -1) {
        this.listThuocTinhMau.splice(index, 1);
      }
    });
  }
  getListPropsSelected() {
    this.productPropertiesSelected = this.data.map(
      (item: any) => item.properties
    );
  }
  fastAddProps() {
    this.listThuocTinhMau.forEach((item: any, index: any) => {
      const value = {
        code: this.code + moment().format('mss') + index + 1,
        length: 1,
        properties: item,
        wide: 1,
        high: 1,
        weight: 1,
        price: 0,
        lastImportedPrice: 0,
        totalQuantity: 0,
        availableQuantity: 0,
        inventoryQuantity: 0,
        defectiveProductQuantity: 0,
        awaitingProductQuantity: 0,
        isNewItem: true,
      };
      this.data.push(value);
    });
    this.findRemainingProps();
  }
  saveInfo(productCode: any) {
    if (this.typeModal === 'edit') {
      const index = this.data.findIndex(
        (item: any) => item.code === productCode
      );
      if (index !== -1) {

        this.data[index].status =this.productStatus;
        this.data[index].code = this.productCode;
        this.data[index].properties=this.productModelProp;
        this.data[index].length = this.dimensionLength(this.productModelSize);
        this.data[index].wide = this.dimensionWide(this.productModelSize);
        this.data[index].high = this.dimensionHeight(this.productModelSize);
        this.data[index].weight = this.productModelWeight;
        this.data[index].price = parseInt(this.productModelPrice.toString());
        this.data[index].lastImportedPrice = parseInt(
          this.productModelFinalPrice.toString()
        );
        this.data[index].totalQuantity = this.productModelTotalImport;
        this.data[index].availableQuantity = this.productTotalAvailable;
        this.data[index].inventoryQuantity = this.productTotalInventory;
        this.data[index].defectiveProductQuantity = this.productTotalError;
        this.data[index].awaitingProductQuantity = this.productTotalIncoming;
      }
    } else {
      if (
        !this.productModelSize ||
        !this.dimensionLength(this.productModelSize) ||
        !this.dimensionWide(this.productModelSize) ||
        !this.dimensionHeight(this.productModelSize)
      ) {
        this.isToastOpen = true;
        this.messageToast =
          'Kích thước phải đúng định dạng hoặc không được để trống';
        return;
      }
      if (!this.productModelWeight) {
        this.isToastOpen = true;
        this.messageToast = 'Vui lòng nhập trọng lượng';
        return;
      }
      if (this.productModelTotalImport <= 0) {
        this.isToastOpen = true;
        this.messageToast = 'Tổng nhập phải lớn hơn 0';
        return;
      }
      if (!this.productModelProp) {
        this.isToastOpen = true;
        this.messageToast = 'Thuộc tính không được để trống';
        return;
      }
      if (this.productTotalAvailable <= 0) {
        this.isToastOpen = true;
        this.messageToast = 'Số lượng Có thể bán phải lớn hơn 0';
        return;
      }
      if (this.productCode.length <5 || this.productCode.length >20) {
        this.isToastOpen = true;
        this.messageToast = 'Mã sản phẩm phải lớn hơn 5 và nhỏ hơn 20 ký tự';
        return;
      }
      const value = {
        status:this.productStatus,
        code: this.productCode,
        length: this.dimensionLength(this.productModelSize),
        properties: this.productModelProp,
        wide: this.dimensionWide(this.productModelSize),
        high: this.dimensionHeight(this.productModelSize),
        weight: this.productModelWeight,
        price: parseInt(this.productModelPrice.toString()),
        lastImportedPrice: parseInt(this.productModelFinalPrice.toString()),
        totalQuantity: this.productModelTotalImport,
        availableQuantity: this.productTotalAvailable,
        inventoryQuantity: this.productTotalInventory,
        defectiveProductQuantity: this.productTotalError,
        awaitingProductQuantity: this.productTotalIncoming,
        isNewItem: true,
      };
      this.data.push(value);
    }
    this.getListPropsSelected();
    this.findRemainingProps();
    this.editValue.emit(this.data);
    this.setOpen(false, '', null);
    this.isToastOpen = false;
  }
  deleteProps(item: any) {
    const index = this.data.findIndex((el: any) => item.code == el.code);
    const deleteItem = this.data.find((el: any) => item.code == el.code);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
    this.listThuocTinhMau.push(deleteItem.properties);
    this.getListPropsSelected();
    this.findRemainingProps();
  }
  dimensionLength(char: any) {
    return char.match(/\d+/g)[0] || '';
  }
  dimensionWide(char: any) {
    return char.match(/\d+/g)[1] || '';
  }
  dimensionHeight(char: any) {
    return char.match(/\d+/g)[2] || '';
  }

  setOpen(open: boolean, type: string, item: any) {
    this.isModalOpen = open;
    this.typeModal = type;
    if (open) {
      if (this.typeModal === 'edit') {
        this.productStatus=item.status;
        this.productCode = item.code;
        this.productModelProp = item.properties;
        this.productModelSize = item.length + 'x' + item.wide + 'x' + item.high;
        this.productModelWeight = item.weight;
        this.productModelPrice = item.price;
        this.productModelFinalPrice = item.lastImportedPrice;
        this.productModelTotalImport = item.totalQuantity;
        this.productTotalAvailable = item.availableQuantity;
        this.productTotalInventory = item.inventoryQuantity;
        this.productTotalError = item.defectiveProductQuantity;
        this.productTotalIncoming = item.awaitingProductQuantity;
        this.isNewItem = item.isNewItem;
      } else {
        this.productStatus=1;
        this.productCode ='';
        this.productModelProp = '';
        this.productModelSize = '';
        this.productModelWeight = '';
        this.productModelPrice = 0;
        this.productModelFinalPrice = 0;
        this.productModelTotalImport = 0;
        this.productTotalAvailable = 0;
        this.productTotalInventory = 0;
        this.productTotalError = 0;
        this.productTotalIncoming = 0;
        this.isNewItem = true;
      }
    }
    this.getListPropsSelected();
  }
  setOpenToast(open: boolean) {
    this.isToastOpen = open;
  }
  
}
