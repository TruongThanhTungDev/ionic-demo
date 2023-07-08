import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'thong-tin-khach-hang',
  templateUrl: './thong-tin-khach-hang.component.html',
})
export class ThongTinKhachHangOrder implements OnInit {
  @Output() handleOpenModal = new EventEmitter<any>();
  @Output() editValue = new EventEmitter<any>();
  @Input() name: any;
  @Input() phone: any;
  @Input() status: any;
  isModalOpen = false;
  nameInfo: any;
  phoneInfo: any;
  info: any;
  constructor(
    private modal: ModalController,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
  }
  get disableEdit() {
    return (
      this.info.role === 'user' &&
      (this.status === 7 ||
        this.status === 8 ||
        this.status === 10 ||
        this.status === 11 ||
        this.status === 12 ||
        this.status === 13 ||
        this.status === 14 ||
        this.status === 15 ||
        this.status === 16 ||
        this.status === 17 ||
        this.status === 18 ||
        this.status === 19 ||
        this.status === 20)
    );
  }
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
