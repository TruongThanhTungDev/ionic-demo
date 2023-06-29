import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'thong-tin-dia-chi',
  templateUrl: './thong-tin-dia-chi.component.html',
})
export class ThongTinDiaChiOrder implements OnInit {
  @Output() handleOpenModal = new EventEmitter<any>();
  @Output() editValue = new EventEmitter<any>();
  @Input() isModalOpen: any;
  @Input() street: any;
  @Input() ward: any;
  @Input() province: any;
  @Input() district: any;
  constructor(private modal: ModalController) {}
  ngOnInit(): void {}
  setOpen(open: boolean) {
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
  }
  saveInfo() {
    const value = {
      street: this.street,
      ward: this.ward,
      district: this.district,
      province: this.province,
    };
    this.editValue.emit(value);
    this.setOpen(false);
  }
}
