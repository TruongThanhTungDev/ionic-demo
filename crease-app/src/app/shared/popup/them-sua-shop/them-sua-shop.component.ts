import { Component, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'them-sua-shop',
  templateUrl: 'them-sua-shop.component.html',
})
export class ThemSuaShop {
  name: any;

  constructor(private modal: ModalController) {}

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }
}
