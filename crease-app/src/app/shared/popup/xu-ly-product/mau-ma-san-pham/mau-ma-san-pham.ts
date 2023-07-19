import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  plugins = new Plugin();
  isModalOpen = false;
  isToastOpen = false;
  productProperties: any[] = [];
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
  ngOnInit() {
    if (this.type === 'edit') {
      this.productProperties = this.data;
      this.findRemainingProps();
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
  fastAddProps() {}
  saveInfo(productCode: any) {
    if (this.typeModal === 'edit') {
      const index = this.data.findIndex(
        (item: any) => item.code === productCode
      );
      if (index !== -1) {
        this.data[index].code = this.productCode;
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
      const value = {
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
      const index = this.listThuocTinhMau.findIndex(
        (item: any) => item === this.productModelProp
      );
      if (index !== -1) {
        this.listThuocTinhMau.splice(index, 1);
      }
      this.data.push(value);
    }
    this.editValue.emit(this.data);
    this.setOpen(false, '', null);
  }
  deleteProps(item: any) {
    const index = this.data.findIndex((el: any) => item.code == el.code);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
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
        this.productCode = '';
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
  }
  setOpenToast(open: boolean) {
    this.isToastOpen = open;
  }
}
