import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Store } from '@ngrx/store';
import { ThemSuaCostTypeComponent } from 'src/app/shared/popup/them-sua-loai-chi-phi/them-sua-loai-chi-phi.component';
import { OPERATIONS } from 'src/app/app.constant';
@Component({
  selector: 'loai-chi-phi-cmp',
  templateUrl: './loai-chi-phi.component.html',
  styleUrls: ['./loai-chi-phi.component.scss'],
})
export class LoaiChiPhiComponent implements OnInit {
  REQUEST_URL = '/api/v1/costtype';
  listData: any;
  info: any;
  selectedItem: any;
  isToastOpen: any;
  messageToast: any;
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
        this.deleteCostType(this.selectedItem);
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
    this.info = this.localStorage.retrieve('authenticationtoken');
    this.store.subscribe((state) => {
      this.isBackHeader = state.common.isBackHeader;
      this.selectedItem = null;
    });
  }
  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    await this.isLoading();
    this.dmService.getOption(null, this.REQUEST_URL, '/getAll').subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.listData = res.body.RESULT.map((item: any) => {
            return {
              ...item,
              priodName:
                item.priod === 1 ? 'Ngày' : item.priod === 2 ? 'Tháng' : 'Năm',
              isCountOrderName: item.isCountOrder === 0 ? 'Không' : 'Có',
            };
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
  openDeleteAccount(isOpen: boolean) {
    this.isOpenDeleteAccount = isOpen;
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
  async addCost() {
    const modal = await this.modal.create({
      component: ThemSuaCostTypeComponent,
      componentProps: {
        title: 'Tạo Loại chi phí',
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
  async editInfoCost(item: any) {
    const modal = await this.modal.create({
      component: ThemSuaCostTypeComponent,
      componentProps: {
        title: 'Xử lý thông tin loại chi phí',
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
  async deleteCostType(item: any) {
    await this.isLoading();
    this.dmService
      .delete(item.id, this.REQUEST_URL + OPERATIONS.DELETE)
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.selectedItem = null;
            this.messageToast = res.body.MESSAGE
              ? res.body.MESSAGE
              : 'Xóa Loại chi phí thành công';
            this.loadData();
          } else {
            this.messageToast = res.body.MESSAGE
              ? res.body.MESSAGE
              : 'Xóa Loại chi phí thất bại';
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
  handleRefresh(event: any) {
    this.loadData();
    event.target.complete();
  }
}
