import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';

@Component({
  selector: 'costRecord-component',
  templateUrl: './ban-ghi-chi-phi.component.html',
})
export class CostRecordComponent implements OnInit {
  listData: any;
  selectedItem: any;
  isToastOpen: any;
  isShowSelectDelete = false;
  messageToast: any;
  isOpenDeleteModal = false;
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
        this.deleteItem(this.selectedItem);
      },
    },
  ];
  constructor(
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService,
    private store: Store<any>,
    private modal: ModalController
  ) {
    this.store.subscribe((state) => {
      this.isBackHeader = state.common.isBackHeader;
      this.selectedItem = null;
    });
  }
  ngOnInit() {
    this.loadData();
  }
  async loadData() {}

  addCostRecord() {}

  deleteItem(item: any) {}
  showListDelete() {
    if (!this.isShowSelectDelete) this.selectedItem = null;
    this.store.dispatch({
      type: 'CHANGE_HEADER',
      payload: {
        title: 'Chọn mục',
        state: true,
      },
    });
  }
  openDeleteModal(open: boolean) {
    this.isOpenDeleteModal = open;
  }
  selectItem(item: any) {
    if (this.selectedItem && this.selectedItem.id === item.id) {
      this.selectedItem = null;
    } else {
      this.selectedItem = item;
    }
  }
}
