import { HttpResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { OPERATIONS, ROLE } from 'src/app/app.constant';
import { LoadingController, ModalController } from '@ionic/angular';
import { ThemSuaAccount } from 'src/app/shared/popup/them-sua-account/them-sua-account.component';
import { Store, select } from '@ngrx/store';
@Component({
  selector: 'account-component',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, AfterViewInit, OnChanges {
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
  isOpenDeleteAccount = false;
  isOpenFilterModal = false;
  isBackHeader: any;
  public actionDeleteAccount = [
    {
      text: 'Hủy',
      role: 'cancel',
      handler: () => {},
    },
    {
      text: 'Đồng ý',
      role: 'confirm',
      handler: () => {
        this.deleteAccount(this.selectedAccount);
      },
    },
  ];
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController,
    private modal: ModalController,
    private store: Store<any>
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
    this.shopCode = this.localStorage.retrieve('shop').code;
  }
  ngOnInit(): void {
    if (this.shopCode) {
      this.loadData();
    }
    this.store.subscribe((state) => {
      this.isBackHeader = state.common.isBackHeader;
      this.selectedAccount = null;
    });
  }
  // get isBackHeader() {
  //   const rs = this.store.select(isBackHeader);
  //   console.log('rs :>> ', rs);
  //   return this.store.select(isBackHeader);
  // }
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
  ngOnChanges(changes: SimpleChanges) {
    if (changes['isBackHeader']) {
      // Xử lý khi giá trị 'value' thay đổi
      console.log('1 :>> ', 1);
    }
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
    if (!this.isShowSelectDelete) this.selectedAccount = null;
    this.store.dispatch({
      type: 'CHANGE_HEADER',
      payload: {
        title: 'Hủy',
        state: true,
      },
    });
  }
  selectItem(item: any) {
    if (this.selectedAccount && this.selectedAccount.id === item.id) {
      this.selectedAccount = null;
    } else {
      this.selectedAccount = item;
    }
  }
  openDeleteAccount(isOpen: boolean) {
    this.isOpenDeleteAccount = isOpen;
  }
  async deleteAccount(entity: any) {
    await this.isLoading();
    this.dmService
      .delete(entity.id, this.REQUEST_URL + OPERATIONS.DELETE)
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Xóa tài khoản thành công';
            this.loadData();
            this.selectedAccount = null;
          } else {
            this.messageToast = 'Xóa tài khoản thất bại';
            this.isToastOpen = true;
            this.loading.dismiss();
          }
        },
        () => {
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
          this.isToastOpen = true;
          this.loading.dismiss();
          console.error();
        }
      );
  }
  openModalFilter(isOpen: boolean) {
    this.isOpenFilterModal = isOpen;
    if (!isOpen) {
      this.resetData();
    }
  }
  async getFilter() {
    await this.loadData();
    this.isOpenFilterModal = false;
  }
  resetData() {
    this.FtDiaChi = '';
    this.FtEmail = '';
    this.FtGhiChu = '';
    this.FtHoTen = '';
    this.FtPhanQuyen = '';
    this.FtSdt = '';
    this.FtTaiKhoan = '';
  }
  changePagination(e: any) {
    this.page = e;
    this.loadData();
  }
  searchUser(e: any) {
    console.log('1 :>> ', 1);
    this.FtHoTen = e.target.value;
    this.debounce(() => {
      this.loadData();
    }, 1000);
  }
  reset() {
    this.FtHoTen = '';
    this.loadData();
  }
  async handleRefresh(event: any) {
    this.resetData();
    await this.loadData();
    event.target.complete();
  }
  debounce(fn: any, ms: any) {
    let timer: any;
    return () => {
      const args = arguments;
      const context = this;

      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        fn.apply(context, args);
      }, ms);
    };
  }
}
