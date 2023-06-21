import { HttpResponse } from '@angular/common/http';
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { OPERATIONS, ROLE } from 'src/app/app.constant';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ThemSuaUtmComponent } from 'src/app/shared/popup/them-sua-utm/them-sua-utm.component';
@Component({
  selector: 'cauhinhutm-component',
  templateUrl: './cau-hinh-utm.component.html',
  styleUrls: ['./cau-hinh-utm.component.scss'],
})
export class CauHinhUtmComponent implements OnInit {
  REQUEST_URL = '/api/v1/utmmedium';
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  previousPage = 1;
  sort = 'id';
  sortType = true;

  source: any;
  dataAdapter: any;
  listData: any;
  info: any;
  selectedItem: any;
  isToastOpen: any;
  messageToast: any;
  isOpenDeleteModal = false;
  isOpenFilterModal = false;
  isBackHeader: any;
  nhanvienid = '';
  nhanvien = '';
  code: any;
  note: any;
  name:any;
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
        this.deleteUtm(this.selectedItem);
      },
    },
  ];
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController,
    private modal: ModalController,
    private route: ActivatedRoute,
    private store: Store<any>,
    private spinner: NgxSpinnerService
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
    this.store.subscribe((state) => {
      this.isBackHeader = state.common.isBackHeader;
      this.selectedItem = null;
    });
  }

  ngOnInit() {
    this.loadData();
  }
  filterSearch() {
    let filter = [];
    filter.push('id>0');
    if (this.code) filter.push(`code==*${this.code}*`);
    if(this.name) filter.push(`account.fullName==*${this.name}*`);
    return filter.join(';');
  }
  async loadData() {
    if (this.info.role !== 'admin'&& this.info.role !== 'marketing') return;
    const params = {
      sort: [this.sort, this.sortType ? 'desc' : 'asc'],
      page: this.page - 1,
      size: this.itemsPerPage,
      filter: this.filterSearch(),
    };
   
    await this.isLoading();
    this.dmService.getOption(params, this.REQUEST_URL,'').subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.totalItems = res.body ? res.body.RESULT.totalElements : 0;
          this.listData = res.body.RESULT;
          this.listData.forEach((unitItem: any) => {
            unitItem.nhanvien = unitItem.account
              ? unitItem.account.fullName +
                ' (' +
                unitItem.account.userName +
                ')'
              : '';
            this.note = unitItem.note;
          });
          this.loading.dismiss();
        } else {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
        }
      },
      () => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
        console.error();
      }
    );
  }
  async isLoading() {
    const isLoading = await this.loading.create({
      spinner: 'circles',
      keyboardClose: true,
      message: 'Đang tải',
      translucent: true,
    });
    return await isLoading.present();
  }
  openDeleteModal(open: boolean) {
    this.isOpenDeleteModal = open;
  }
  showListDelete() {
    this.store.dispatch({
      type: 'CHANGE_HEADER',
      payload: {
        title: 'Chọn mục',
        state: true,
      },
    });
  }
  async addUtm() {
    const modal = await this.modal.create({
      component: ThemSuaUtmComponent,
      componentProps: {
        title: 'Tạo cấu hình UTM',
        data: null,
        type: 'add',
      },
      cssClass: 'modal-filter-lg',
      backdropDismiss: false,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
  }
  async editInfoUtm(item: any) {
    const modal = await this.modal.create({
      component: ThemSuaUtmComponent,
      componentProps: {
        title: 'Xử lý thông tin UTM',
        data: item,
        type: 'edit',
      },
      cssClass: 'modal-filter-lg',
      backdropDismiss: false,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
  }
  async deleteUtm(item: any) {
    await this.isLoading();
    this.dmService
      .delete(item.id, this.REQUEST_URL + OPERATIONS.DELETE)
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = res.body.MESSAGE
              ? res.body.MESSAGE
              : 'Xóa thông tin UTM thành công';
            this.loadData();
          } else {
            this.messageToast = res.body.MESSAGE
              ? res.body.MESSAGE
              : 'Xóa thông tin UTM thất bại';
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
  selectItem(item: any) {
    if (this.selectedItem && this.selectedItem.id === item.id) {
      this.selectedItem = null;
    } else {
      this.selectedItem = item;
    }
  }
  setOpen(open: boolean) {
    this.isToastOpen = open;
  }
  changePagination(e: any) {
    this.page = e;
    this.loadData();
  }
  searchUtm(e: any) {
    this.name = e.target.value;
    this.loadData();
  }
}
