import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'thong-tin-san-pham',
  templateUrl: 'thong-tin-san-pham.component.html',
})
export class ThongTinSanPhamComponent implements OnInit {
  isModalOpen = false;
  ngOnInit() {}
  async setOpen(open: boolean) {
    this.isModalOpen = open;
  }
}
