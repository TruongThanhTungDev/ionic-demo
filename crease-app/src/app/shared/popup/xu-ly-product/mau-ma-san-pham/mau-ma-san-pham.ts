import { Component, Input, OnInit } from '@angular/core';
import { Plugin } from 'src/app/plugins/plugins';

@Component({
  selector: 'mau-ma-san-pham',
  templateUrl: 'mau-ma-san-pham.component.html',
})
export class MauMaSanPhamComponent implements OnInit {
  @Input() data: any;
  @Input() type: any;
  plugins = new Plugin();
  isModalOpen = false;
  isToastOpen = false;
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
  typeModal = 'add';
  messageToast: any;
  ngOnInit() {
    if (this.type === 'edit') {
      this.productCode = this.data.code;
      this.productModelProp = this.data.properties;
      this.productModelSize =
        this.data.length + 'x' + this.data.wide + 'x' + this.data.high;
      this.productModelWeight = this.data.weight;
      this.productModelPrice = this.data.price;
      this.productModelFinalPrice = this.data.lastImportedPrice;
      this.productModelTotalImport = this.data.totalQuantity;
      this.productTotalAvailable = this.data.availableQuantity;
      this.productTotalInventory = this.data.inventoryQuantity;
      this.productTotalError = this.data.defectiveProductQuantity;
      this.productTotalIncoming = this.data.awaitingProductQuantity;
    }
  }
  saveInfo() {}
  setOpen(open: boolean, type: string) {
    this.isModalOpen = open;
    this.typeModal = type;
  }
  setOpenToast(open: boolean) {
    this.isToastOpen = open;
  }
}
