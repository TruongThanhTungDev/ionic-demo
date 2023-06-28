import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'thong-tin-khach-hang',
  templateUrl: './thong-tin-khach-hang.component.html',
})
export class ThongTinKhachHangOrder {
  @Output() handleOpenModal = new EventEmitter<any>();
  @Input() isModalOpen: any;
  constructor(private modal: ModalController) {}
  setOpen(open: boolean) {
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
  }
}
