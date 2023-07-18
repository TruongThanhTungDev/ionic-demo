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
  selectedModel: any;
  typeModal = 'add';
  messageToast: any;
  ngOnInit() {
    if (this.type === 'edit') {
      this.productProperties = this.data;
    }
  }
  saveInfo(productCode: any) {
    if (this.typeModal === 'edit') {
      const index = this.data.findIndex(
        (item: any) => item.code == productCode
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
      };
      this.data.push(value);
    }
    this.editValue.emit(this.data);
    this.setOpen(false, '', null);
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
      }
    }
  }
  setOpenToast(open: boolean) {
    this.isToastOpen = open;
  }
}
