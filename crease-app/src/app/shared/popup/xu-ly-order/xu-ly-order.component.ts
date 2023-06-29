import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { ThongTinKhachHangOrder } from './thong-tin-khach-hang/thong-tin-khach-hang.component';

@Component({
  selector: 'xuLyOder-cmp',
  templateUrl: './xu-ly-order.component.html',
})
export class XuLyOrderComponent implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  isShowEditInfoCustomer = false;
  isShowEditAddressCustomer = false;
  statusOrder = '0,1,2,3,4,5,6,9';
  info: any;
  name: any;
  phone: any;
  ward: any;

  isToastOpen = false;
  messageToast: any;
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
  }
  get isUser() {
    return this.info.role === 'user';
  }
  ngOnInit() {
    if (this.type === 'edit') {
      this.name = this.data.name;
      this.phone = this.data.phone;
      this.statusOrder = this.data.status;
    }
  }

  async showEditInfoCustomer(open: any) {
    this.isShowEditInfoCustomer = open;
  }
  handleEditInfo(value: any) {
    this.name = value.name;
    this.phone = value.phone;
  }

  async editAddressCustomer(open: any) {
    this.isShowEditAddressCustomer = open;
  }
  cancel() {
    this.modal.dismiss();
  }
  confirm() {
    this.modal.dismiss(null, 'confirm');
  }
  public async isLoading() {
    const isLoading = await this.loading.create({
      spinner: 'circles',
      keyboardClose: true,
      message: 'Đang tải',
      translucent: true,
    });
    return await isLoading.present();
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
