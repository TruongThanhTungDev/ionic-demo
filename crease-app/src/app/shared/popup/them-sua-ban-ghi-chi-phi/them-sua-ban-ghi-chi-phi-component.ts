import { Component, Input } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { DanhMucService } from 'src/app/danhmuc.services';

@Component({
  selector: 'costRecord-cmp',
  templateUrl: './them-sua-ban-ghi-chi-phi.component.html',
})
export class ThemSuaCostRecord {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  isToastOpen = false;
  messageToast: any;
  costPerDay: any;
  numOfDay: any;
  numOfOrder: any;
  shopCode: any;
  totalCost: any;

  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private actionSheetCtrl: ActionSheetController
  ) {}

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
      this.modal.dismiss();
    }
  }
  saveInfo() {}
  confirm() {
    this.modal.dismiss(null, 'confirm');
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
}
