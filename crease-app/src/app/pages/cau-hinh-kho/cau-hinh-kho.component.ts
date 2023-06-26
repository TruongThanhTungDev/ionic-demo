import { HttpResponse } from '@angular/common/http';
import { OnInit, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { OPERATIONS, ROLE } from 'src/app/app.constant';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ThemSuaKhoComponent } from 'src/app/shared/popup/them-sua-kho/them-sua-kho.component';
@Component({
  selector: 'cauhinhkho-component',
  templateUrl: './cau-hinh-kho.component.html',
})
export class CauhinhKhoComponent implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  REQUEST_URL = '/api/v1/warehouse';
  REQUEST_URL_SHOP = '/api/v1/shop';
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
  isOpenStatisticKho = false;
  isOpenModalOpen = false;
  isBackHeader: any;
  name = '';
  phone = '';
  address = '';
  shopCode: any;
  isOpenAddModal = false;
  listShop: any = [];
  totalImportProduct: any;
  totalInventoryQuantity: any;
  totalAwaitingProduct: any;
  price: any;
  localData: any;

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
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private store: Store<any>,
    private spinner: NgxSpinnerService,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
    this.store.subscribe((state) => {
      this.isBackHeader = state.common.isBackHeader;
      this.selectedItem = null;
    });
    this.shopCode = this.localStorage.retrieve('shopCode');
  }
  ngOnInit(): void {
    this.loadData();
    this.dmService
      .getOption(null, this.REQUEST_URL_SHOP, '?status=1')
      .subscribe(
        (res: HttpResponse<any>) => {
          this.listShop = res.body.RESULT;
        },
        () => {
          console.error();
        }
      );
    if (this.data) {
      this.name = this.data.name;
      this.phone = this.data.phone;
      this.address = this.data.address;
    }
    // if (this.type === 'edit') {
    //   this.getWareHouseData();
    // }
  }

  filterSearch() {
    let filter = [];
    filter.push(
      `id>0;staus>=0;shop.code=="${this.shopCode ? this.shopCode : ''}"`
    );
    if (this.phone) filter.push(`phone==*${this.phone}*`);
    if (this.name) filter.push(`name==*${this.name}*`);
    if (this.address) filter.push(`address==*${this.address}*`);

    return filter.join(';');
  }
  get validData() {
    this.data = this.data;
    if (this.name == '') {
      this.isToastOpen = true;
      this.messageToast = 'Tên Không được để trống';
      return false;
    }
    if (this.phone == '') {
      this.isToastOpen = true;
      this.messageToast = 'Số điện thoại không được để trống';
      return false;
    }
    return true;
  }
  async loadData() {
    if (this.info.role !== 'admin') return;
    const params = {
      sort: ['id', 'desc'],
      page: this.page - 1,
      size: this.itemsPerPage,
      filter: this.filterSearch(),
    };

    await this.isLoading();
    this.dmService.getOption(params, this.REQUEST_URL, '/search').subscribe(
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
  async getWareHouseData() {
    // if (!this.data || !this.data.id) {
    //   // Handle the case where this.data or this.data.id is undefined
    //   return;
    // }
    // await this.isLoading();
    this.dmService
      .getOption(
        null,
        this.REQUEST_URL,
        '/stc-warehouse?warehouseId=' + this.selectedItem.id
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.localData = res.body.RESULT;
            // this.loading.dismiss();
          } else {
            // this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
          }
        },
        () => {
          // this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
          console.error();
        }
      );
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
  async saveInfo() {
    if (this.validData) {
      let entity = {
        id: '',
        name: this.name,
        phone: this.phone,
        address: this.address,
      };
      await this.isLoading();
      if (this.type === 'add') {
        this.dmService
          .postOption(entity, this.REQUEST_URL, OPERATIONS.CREATE)
          .subscribe(
            (res: HttpResponse<any>) => {
              if (res.body.CODE === 200) {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Tạo kho thành công';
                this.confirm();
              } else {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Tạo kho thất bại';
                this.cancel();
              }
            },
            () => {
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = 'Tạo kho thất bại';
              console.error();
            }
          );
      } else {
        entity.id = this.data.id;
        this.dmService
          .putOption(entity, this.REQUEST_URL, '/update?id=' + entity.id)
          .subscribe(
            (res: HttpResponse<any>) => {
              if (res.body.CODE === 200) {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Cập nhật kho thành công';
                this.confirm();
              } else {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Cập nhật kho thất bại';
                this.cancel();
              }
            },
            () => {
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = 'Cập nhật kho thất bại';
              console.error();
            }
          );
      }
    }
  }
  confirm() {
    this.modalCtrl.dismiss(null, 'confirm');
  }
  async cancel() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Bạn có chắc muốn thoát không?',
      buttons: [
        {
          text: 'Đồng ý',
          role: 'confirm',
        },
        {
          text: 'Hủy',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();
    if (role === 'confirm') {
      this.modalCtrl.dismiss();
    }
  }
  async addKho() {
    const modal = await this.modalCtrl.create({
      component: CauhinhKhoComponent,
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
      if (data && data.id) {
        this.getWareHouseData();
      }
    }
  }
  async editInfoKho(item: any) {
    const modal = await this.modalCtrl.create({
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
      if (data && data.id) {
        this.getWareHouseData();
      }
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
            this.selectedItem = null;
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
  setOpenStatisticKho(open: boolean, item: any) {
    this.selectedItem = item;
    this.isOpenStatisticKho = open;
    this.getWareHouseData();
  }
}
