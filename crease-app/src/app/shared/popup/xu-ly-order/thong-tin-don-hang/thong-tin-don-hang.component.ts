import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'thong-tin-don-hang',
  templateUrl: './thong-tin-don-hang.component.html',
})
export class ThongTinDonHangOrder implements OnInit {
  @Output() handleOpenModal = new EventEmitter<any>();
  @Output() editValue = new EventEmitter<any>();
  @Input() isModalOpen: any;
  @Input() price: any;
  @Input() product: any;
  ngOnInit(): void {
    console.log('this.data :>> ', this.product);
  }

  setOpen(open: boolean) {
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
  }
  saveInfo() {
    const value = {};
    this.editValue.emit(value);
    this.setOpen(false);
  }
}
