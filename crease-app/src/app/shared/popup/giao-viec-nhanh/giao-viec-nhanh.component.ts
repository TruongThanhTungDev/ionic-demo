import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Plugin } from '../../utils/plugins';
import * as moment from 'moment';

@Component({
  selector: 'giao-viec-nhanh',
  templateUrl: './giao-viec-nhanh.component.html',
  styleUrls: ['./giao-viec-nhanh.component.scss'],
})
export class GiaoViecNhanhPopup implements OnInit {
  @Input() shopCode: any;
  REQUEST_DATA_URL = '/api/v1/data';
  REQUEST_WORK_URL = '/api/v1/work';
  listWork: any[] = [];
  listEmployee: any[] = [];
  listUserSelect: any[] = [];
  listWorkSelected: any[] = [];
  selectedUser: any;
  totalWork = 0;
  isCheckAll = false;
  isToastOpen = false;
  messageToast: any;
  plugins = new Plugin();
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService
  ) {}
  get checkAll() {
    return (
      this.listWork && this.listWork.length === this.listWorkSelected.length
    );
  }
  get isValid() {
    if (!this.listWorkSelected.length) {
      this.isToastOpen = true;
      this.messageToast = 'Phải chọn ít nhất một đơn hàng';
      return false;
    }
    if (!this.listUserSelect.length) {
      this.isToastOpen = true;
      this.messageToast = 'Phải chọn ít nhất một nhân viên';
      return false;
    }
    return true;
  }
  ngOnInit() {
    this.getDataWork();
  }
  async getDataWork() {
    await this.isLoading();
    this.dmService
      .getOption(
        null,
        this.REQUEST_DATA_URL,
        `/getAllDataAccountNull?status=0&shopCode=` + this.shopCode
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.listWork = res.body.RESULT;
            this.totalWork = res.body.RESULT.length;
            if (this.listWork.length === 0) {
              this.isToastOpen = true;
              this.messageToast = 'Danh sách công việc trống';
              this.loading.dismiss();
            } else {
              this.getUserActive();
              this.getCheckAll();
              this.loading.dismiss();
            }
          }
        },
        (error: HttpResponse<any>) => {
          this.isToastOpen = true;
          this.messageToast = error.body.RESULT.message
            ? error.body.RESULT.message
            : 'Có lỗi xảy ra, vui lòng thử lại sau';
          this.loading.dismiss();
        }
      );
  }
  async getUserActive() {
    await this.isLoading();
    const params = {
      sort: ['id', 'asc'],
      page: 0,
      size: 1000,
      filter: this.filter(),
    };
    this.dmService.query(params, this.REQUEST_WORK_URL).subscribe(
      (res: HttpResponse<any>) => {
        if (res.body) {
          if (res.body.CODE === 200) {
            this.listEmployee = res.body.RESULT.content;
          } else {
            this.isToastOpen = true;
            this.messageToast = res.body.MESSAGE
              ? res.body.MESSAGE
              : 'Đã có lỗi xảy ra';
          }
        } else {
          this.isToastOpen = true;
          this.messageToast = 'Đã có lỗi xảy ra';
        }
        this.loading.dismiss();
      },
      () => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.messageToast = 'Đã có lỗi xảy ra';
        console.error();
      }
    );
  }
  private filter(): string {
    const comparesArray: string[] = [];
    comparesArray.push(`isActive==0`);
    if (this.shopCode) comparesArray.push(`shopCode=="${this.shopCode}"`);
    return comparesArray.join(';');
  }
  onChangeProduct(event: any) {
    const index = this.listEmployee.findIndex(
      (item: any) => item.id === event.id
    );
    if (index !== -1) {
      this.listUserSelect.push(event);
      this.customDataSelect();
      this.listEmployee.splice(index, 1);
      this.listEmployee = this.listEmployee.map((item: any) => item);
    }
    setTimeout(() => {
      this.selectedUser = null;
    }, 200);
  }
  removeUser(user: any) {
    const index = this.listUserSelect.findIndex(
      (item: any) => item.id === user.id
    );
    if (index !== -1) {
      this.listUserSelect.splice(index, 1);
      this.customDataSelect();
      this.listEmployee.push(user);
    }
  }
  customDataSelect() {
    const phanNguyen = Math.floor(
      this.listWorkSelected.length / this.listUserSelect.length
    );
    const phanDu = this.listWorkSelected.length % this.listUserSelect.length;
    this.listUserSelect = this.listUserSelect.map(
      (item: any, index: number) => {
        let soLuong = phanNguyen;
        if (index < phanDu) {
          soLuong++;
        }
        return {
          ...item,
          totalWork: soLuong ? soLuong : 0,
        };
      }
    );
  }
  getCheckAll() {
    if (!this.checkAll) {
      this.listWorkSelected = [...this.listWork];
    } else {
      this.listWorkSelected = [];
    }
    this.customDataSelect();
  }
  selectWork(work: any) {
    const index = this.listWorkSelected.findIndex(
      (item: any) => work.id === item.id
    );
    if (index !== -1) {
      this.listWorkSelected.splice(index, 1);
    } else {
      this.listWorkSelected.push(work);
    }
    this.customDataSelect();
  }
  assignWork() {
    if (this.isValid) {
      let index = 0;
      const listAssign = [...this.listWorkSelected];
      this.listUserSelect.forEach((employee: any) => {
        const totalWork = employee.totalWork;
        const nhanVienId = employee.account.id;
        for (let i = index; i < index + totalWork; i++) {
          if (i >= listAssign.length) break;
          listAssign[i].nhanVienId = nhanVienId;
          listAssign[i].dateChanged = moment(new Date()).format(
            'YYYYMMDDHHmmss'
          );
          listAssign[i].dateChangedOnly = moment(new Date()).format('YYYYMMDD');
          listAssign[i].status =
            listAssign[i].status === 0 ? 1 : listAssign[i].status;
        }
        index += totalWork;
      });
      this.saveInfo(listAssign);
    }
  }
  saveInfo(list: any) {
    const entity = {
      dataList: list,
    };
    this.dmService
      .postOption(entity, this.REQUEST_DATA_URL, '/assignWork')
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.isToastOpen = true;
            this.messageToast = 'Giao việc thành công!';
            this.confirm();
          } else {
            this.isToastOpen = true;
            this.messageToast = 'Giao việc thất bại!';
          }
        },
        (error: any) => {
          this.isToastOpen = true;
          this.messageToast = 'Đã có lỗi xảy ra!';
        }
      );
  }
  setOpen(open: boolean) {
    this.isToastOpen = open;
  }
  async cancel() {
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
}
