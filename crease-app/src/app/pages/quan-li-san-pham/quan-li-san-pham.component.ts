import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { XuLyProduct } from 'src/app/shared/popup/xu-ly-product/xu-ly-product.component';

@Component({
  selector: 'quan-li-san-pham',
  templateUrl: './quan-li-san-pham.component.html',
  styleUrls: ['./quan-li-san-pham.component.scss'],
})
export class QuanLiSanPhamComponent implements OnInit {
  selectedProduct: any;
  listProducts: any[] = [
    {
      id: 1,
    },
  ];
  page = 1;
  totalItems = 0;
  itemsPerPage = 10;
  messageToast: any;
  isBackHeader = false;
  isToastOpen = false;
  isOpenFilterModal = false;
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController,
    private modal: ModalController,
    private store: Store<any>
  ) {}
  ngOnInit() {
    this.store.subscribe((state) => {
      this.isBackHeader = state.common.isBackHeader;
      this.selectedProduct = null;
    });
  }
  loadData() {}
  async editProductInfo(item: any) {
    const modal = await this.modal.create({
      component: XuLyProduct,
      componentProps: {
        title: 'Xử lý thông tin sản phẩm',
        data: item,
        type: 'edit',
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.loadData();
    }
  }
  changePagination(e: any) {
    this.page = e;
    this.loadData();
  }
  showListDelete() {
    this.store.dispatch({
      type: 'CHANGE_HEADER',
      payload: {
        title: 'Hủy',
        state: true,
      },
    });
  }
  selectItem(item: any) {
    if (this.selectedProduct && this.selectedProduct.id === item.id) {
      this.selectedProduct = null;
    } else {
      this.selectedProduct = item;
    }
  }
  resetData() {}
  async handleRefresh(event: any) {
    event.target.complete();
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
  openModalFilter(isOpen: boolean) {
    this.isOpenFilterModal = isOpen;
    if (!isOpen) {
      this.resetData();
    }
  }
}
