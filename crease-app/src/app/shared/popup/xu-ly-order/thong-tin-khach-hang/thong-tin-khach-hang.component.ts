import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'thong-tin-khach-hang',
  templateUrl: './thong-tin-khach-hang.component.html',
})
export class ThongTinKhachHangOrder implements OnInit {
  @Output() handleOpenModal = new EventEmitter<any>();
  @Output() editValue = new EventEmitter<any>();
  @Input() name: any;
  @Input() phone: any;
  isModalOpen = false;
  nameInfo: any;
  phoneInfo: any;
  constructor(private modal: ModalController) {}
  ngOnInit(): void {
    this.nameInfo = this.name;
    this.phoneInfo = this.phone;
  }
  setOpen(open: boolean) {
    this.isModalOpen = open;
    if (open) {
      this.nameInfo = this.name;
      this.phoneInfo = this.phone;
    } else {
      this.nameInfo = '';
      this.phoneInfo = '';
    }
  }
  saveInfo() {
    const value = {
      name: this.nameInfo,
      phone: this.phoneInfo,
    };
    this.editValue.emit(value);
    this.setOpen(false);
  }
}
