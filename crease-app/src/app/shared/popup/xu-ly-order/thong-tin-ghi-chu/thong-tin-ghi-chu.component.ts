import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

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
  @Input() status: any;
  noteInfo: any;
  isModalOpen = false;
  info: any;
  constructor(private localStorage: LocalStorageService) {
    this.info = this.localStorage.retrieve('authenticationToken');
  }
  get disableEdit() {
    return (
      (this.info.role === 'admin' &&
        (this.status === 8 ||
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
          this.status === 20)) ||
      (this.info.role === 'user' &&
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
          this.status === 20))
    );
  }
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
