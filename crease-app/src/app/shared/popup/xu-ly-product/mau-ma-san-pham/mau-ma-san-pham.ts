import { Component, OnInit } from '@angular/core';
import { Plugin } from 'src/app/plugins/plugins';

@Component({
  selector: 'mau-ma-san-pham',
  templateUrl: 'mau-ma-san-pham.component.html',
})
export class MauMaSanPhamComponent implements OnInit {
  plugins = new Plugin();
  isModalOpen = false;
  isToastOpen = false;
  typeModal = 'add';
  messageToast: any;
  ngOnInit() {}
  saveInfo() {}
  setOpen(open: boolean, type: string) {
    this.isModalOpen = open;
    this.typeModal = type;
  }
  setOpenToast(open: boolean) {
    this.isToastOpen = open;
  }
}
