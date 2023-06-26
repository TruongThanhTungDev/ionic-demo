import { HttpResponse } from '@angular/common/http';
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { OPERATIONS, ROLE } from 'src/app/app.constant';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ThemSuaKhoComponent } from 'src/app/shared/popup/them-sua-kho/them-sua-kho.component';
@Component({
  selector: 'cauhinhkho-component',
  templateUrl: './cau-hinh-kho.component.html',
})
export class CauhinhKhoComponent implements OnInit {
  REQUEST_URL = '/api/v1/warehouse';
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
  isOpenModalOpen=false;
  isBackHeader: any;
  name='';
  phone='';
  address='';
  shopCode :any;

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
        this.deleteKho(this.selectedItem);
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
    this.shopCode=this.localStorage.retrieve("shopCode");
  }
  ngOnInit(): void {
    this.loadData();
  }
  filterSearch() {
    let filter = []; 
    filter.push(`id>0;staus>=0;shop.code=="${this.shopCode ? this.shopCode : ''}"`);
    if (this.phone) filter.push(`phone==*${this.phone}*`);
    if(this.name) filter.push(`name==*${this.name}*`);
    if(this.address) filter.push(`address==*${this.address}*`);
   
    return filter.join(';');
  }
  async loadData() {
    if (this.info.role !== 'admin') return;
    const params = {
      sort: ['id','desc'],
      page: this.page - 1,
      size: this.itemsPerPage,
      filter: this.filterSearch(),
    };
   
    await this.isLoading();
    this.dmService.getOption(params, this.REQUEST_URL,'/search').subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.totalItems = res.body ? res.body.RESULT.totalElements : 0;
          this.listData = res.body.RESULT.content;
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
  async addKho() {
    const modal = await this.modal.create({
      component: ThemSuaKhoComponent,
      componentProps: {
        title: 'Tạo cấu hình kho',
        data: null,
        type: 'add',
      },
      backdropDismiss: false,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
  }
  async editInfoKho(item: any) {
    const modal = await this.modal.create({
      component: ThemSuaKhoComponent,
      componentProps: {
        title: 'Xử lý thông tin kho',
        data: item,
        type: 'edit',
      },

      backdropDismiss: false,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
  }
  async deleteKho(item: any) {
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
              : 'Xóa kho thành công';
            this.selectedItem=null;
            this.loadData();
          } else {
            this.messageToast = res.body.MESSAGE
              ? res.body.MESSAGE
              : 'Xóa kho thất bại';
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
  reset() {
    this.name = '';
    this.loadData();
  }
  changePagination(e: any) {
    this.page = e;
    this.loadData();
  }
  searchKho(e: any) {
    this.name = e.target.value;
    this.loadData();
  }

}