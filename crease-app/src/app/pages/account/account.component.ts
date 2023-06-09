import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { ROLE } from 'src/app/app.constant';
import { LoadingController, ModalController } from '@ionic/angular';
import { ThemSuaAccount } from 'src/app/shared/popup/them-sua-account/them-sua-account.component';
@Component({
  selector: 'account-component',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, AfterViewInit {
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  previousPage = 1;
  sort = 'id';
  sortType = true;
  REQUEST_URL = '/api/v1/account';

  listEntity: any;
  info: any;
  selectedEntity: any = null;
  selectedId = 0;

  FtTaiKhoan = '';
  FtHoTen = '';
  FtEmail = '';
  FtSdt = '';
  FtDiaChi = '';
  FtPhanQuyen = '';
  FtGhiChu = '';
  shopCode = '';
  isToastOpen: any;
  isShowSelectDelete = false;
  messageToast: any;
  selectedAccount: any;
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController,
    private modal: ModalController
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
    this.shopCode = this.localStorage.retrieve('shop').code;
  }
  ngOnInit(): void {
    if (this.shopCode) {
      this.loadData();
    }
  }
  get roleUser() {
    return ROLE;
  }
  ngAfterViewInit(): void {}
  public async loadData() {
    if (this.info.role !== 'admin') return;
    const params = {
      sort: [this.sort, this.sortType ? 'desc' : 'asc'],
      page: this.page - 1,
      size: this.itemsPerPage,
      filter: this.filter(),
    };
    await this.isLoading();
    this.dmService.query(params, this.REQUEST_URL).subscribe(
      (res: HttpResponse<any>) => {
        if (res.body) {
          if (res.body.CODE === 200) {
            this.page = res.body ? res.body.RESULT.number + 1 : 1;
            this.totalItems = res.body ? res.body.RESULT.totalElements : 0;
            this.listEntity = res.body.RESULT.content;
            // load page
            if (this.listEntity.length === 0 && this.page > 1) {
              this.page = 1;
              this.loadData();
            }
            this.loading.dismiss();
          } else {
            this.loading.dismiss();
          }
        } else {
          this.listEntity = [];
          this.loading.dismiss();
        }
      },
      () => {
        this.loading.dismiss();
        console.error();
      }
    );
  }

  private filter(): string {
    const comparesArray: string[] = [];
    const {
      FtTaiKhoan,
      FtHoTen,
      FtDiaChi,
      FtEmail,
      FtGhiChu,
      FtPhanQuyen,
      FtSdt,
      shopCode,
    } = this;
    comparesArray.push(`id>0;shop=="*` + shopCode + '*"');
    if (FtHoTen) comparesArray.push(`fullName=="*${FtHoTen.trim()}*"`);
    if (FtTaiKhoan) comparesArray.push(`userName=="*${FtTaiKhoan.trim()}*"`);
    if (FtDiaChi) comparesArray.push(`address=="*${FtDiaChi.trim()}*"`);
    if (FtEmail) comparesArray.push(`email=="*${FtEmail.trim()}*"`);
    if (FtGhiChu) comparesArray.push(`note=="*${FtGhiChu.trim()}*"`);
    if (FtPhanQuyen) comparesArray.push(`role=="*${FtPhanQuyen.trim()}*"`);
    if (FtSdt) comparesArray.push(`phone=="*${FtSdt.trim()}*"`);
    return comparesArray.join(';');
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
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
  async addUser() {
    const modal = await this.modal.create({
      component: ThemSuaAccount,
      componentProps: {
        title: 'Tạo tài khoản',
        data: null,
        type: 'add',
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
  }
  async editInfoUser(info: any) {
    const modal = await this.modal.create({
      component: ThemSuaAccount,
      componentProps: {
        title: 'Xử lý thông tin tài khoản',
        data: info,
        type: 'edit',
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
  }
  showListDelete() {
    this.isShowSelectDelete = !this.isShowSelectDelete;
  }
  selecteItem(item: any) {
    if (this.selectedAccount) {
      this.selectedAccount = null;
    } else {
      this.selectedAccount = item;
    }
  }
}
