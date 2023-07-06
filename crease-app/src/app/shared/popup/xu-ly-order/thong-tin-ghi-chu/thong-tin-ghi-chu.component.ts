import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'thong-tin-ghi-chu',
  templateUrl: './thong-tin-ghi-chu.component.html',
})
export class ThongTinGhiChuOrderComponent implements OnInit {
  ngOnInit(): void {
    this.noteInfo = this.note;
  }
  @Output() editValue = new EventEmitter<any>();
  @Input() note: any;
  noteInfo: any;
  isModalOpen = false;
  setOpen(open: boolean) {
    this.isModalOpen = open;
    if (!open) {
      this.noteInfo = '';
    } else {
      this.noteInfo = this.note;
    }
  }
  editNoteCustomer(open: any) {
    this.isModalOpen = open;
  }
  saveInfo() {
    const value = {
      note: this.noteInfo,
    };
    this.editValue.emit(value);
    this.setOpen(false);
  }
}
