import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'thong-tin-ghi-chut',
  templateUrl: './thong-tin-ghi-chu.component.html',
})
export class ThongTinGhiChuOrderComponent implements OnInit {
  ngOnInit(): void {
    if (this.note) {
      this.noteInfo = this.note;
    }
  }
  @Output() handleOpenModal = new EventEmitter<any>();
  @Output() editValue = new EventEmitter<any>();
  @Input() isModalOpen: any;
  @Input() note: any;
  noteInfo: any;
  setOpen(open: boolean) {
    this.isModalOpen = open;
    this.handleOpenModal.emit(open);
  }
  saveInfo() {
    const value = {
      note: this.note,
    };
    this.editValue.emit(value);
    this.setOpen(false);
  }
}
