import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'thong-tin-khach-hang',
  templateUrl: './thong-tin-khach-hang.component.html',
})
export class ThongTinKhachHangOrder implements OnInit {
  @Output() handleOpenModal = new EventEmitter<any>();
  @Output() editValue = new EventEmitter<any>();
  @Input() isModalOpen: any;
  @Input() name: any;
  @Input() phone: any;
  constructor(private modal: ModalController) {}
  ngOnInit(): void {}
  setOpen(open: boolean) {
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
  }
  saveInfo() {
    const value = {
      name: this.name,
      phone: this.phone,
    };
    this.editValue.emit(value);
    this.setOpen(false);
  }
}