import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DanhMucService } from 'src/app/danhmuc.services';

@Component({
  selector: 'danhmuc-sp',
  templateUrl: 'danh-muc-san-pham.component.html',
})
export class DanhMucProductComponent implements OnInit {
  ma = '';
  ten = '';
  trangThai = 1;
  url = '';
  ghiChu = '';
  selectedId: any;
  listData: any[] = [];
  ftTen = '';
  REQUEST_URL = '/api/v1/product_category/';
  isToastOpen = false;
  messageToast: any;
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController
  ) {}
  ngOnInit(): void {
    this.loadData();
  }
  async loadData() {
    const params = {
      sort: ['id', 'asc'],
      page: 0,
      size: 10000,
      filter: 'id>0;name=="*' + this.ftTen + '*"',
    };
    await this.isLoading();
    this.dmService.query(params, '/api/v1/product_category').subscribe(
      (res: HttpResponse<any>) => {
        if (res.body) {
          if (res.body.CODE === 200) {
            this.loading.dismiss();
            this.listData = res.body.RESULT.content;
            this.selectedId = null;
          } else {
            this.loading.dismiss();
            this.isToastOpen = false;
            this.messageToast = res.body.MESSAGE;
          }
        } else {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Đã có lỗi xảy ra';
        }
      },
      () => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.messageToast = 'Đã có lỗi xảy ra';
        console.error();
      }
    );
  }
  onEdit(e: any) {
    this.listData.forEach((e) => {
      e.edit = false;
    });
    e.edit = true;
  }

  selected(e: any) {
    this.selectedId = e;
  }

  addRow() {
    if (this.selectedId || this.selectedId === 0) {
      if (!this.listData[this.selectedId].name) {
        this.isToastOpen = true;
        this.messageToast = 'Danh mục không được để trống';
        return;
      } else {
        if (this.listData[this.selectedId].edit) {
          this.isToastOpen = true;
          this.messageToast = 'Lưu danh mục trước khi thêm mới';
          return;
        }
      }
    }
    const entity = {
      name: '',
      edit: true,
    };
    this.listData.push(entity);
    this.selectedId = this.listData.length - 1;
  }

  checkNull(e: any) {
    if (!this.listData[e].name) {
      this.isToastOpen = true;
      this.messageToast = 'Danh mục không được để trống';
      return;
    } else {
      this.create(this.listData[e]);
    }
  }

  removeRow(e: any) {
    if (this.listData[e].id) {
      this.dmService
        .delete(this.listData[e].id, this.REQUEST_URL + 'delete')
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.body.CODE === 200) {
              this.isToastOpen = true;
              this.messageToast = 'Xóa thành công';
              this.loadData();
            } else {
              this.isToastOpen = true;
              this.messageToast = 'Xóa thất bại';
            }
          },
          () => {
            this.isToastOpen = true;
            this.messageToast = 'Xóa thất bại';
            console.error();
          }
        );
    } else {
      this.listData.splice(e, 1);
      this.isToastOpen = true;
      this.messageToast = 'Xóa thành công';
      this.selectedId = null;
    }
  }
  create(entity: any) {
    if (!entity.name.trim()) {
      this.isToastOpen = true;
      this.messageToast = 'Danh mục không được để trống';
      return;
    }
    if (!entity.id) {
      this.dmService.postOption(entity, this.REQUEST_URL, 'create').subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.isToastOpen = true;
            this.messageToast = 'Thêm thành công';
            this.loadData();
          } else {
            this.isToastOpen = true;
            this.messageToast = 'Thêm thất bại';
          }
        },
        () => {
          this.isToastOpen = true;
          this.messageToast = 'Thêm thất bại';
          console.error();
        }
      );
    } else {
      this.dmService
        .putOption(entity, this.REQUEST_URL, 'update?id=' + entity.id)
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.body.CODE === 200) {
              this.isToastOpen = true;
              this.messageToast = 'Cập nhật thành công';
              this.loadData();
            } else {
              this.isToastOpen = true;
              this.messageToast = 'Cập nhật thất bại';
            }
          },
          () => {
            this.isToastOpen = true;
            this.messageToast = 'Cập nhật thất bại';
            console.error();
          }
        );
    }
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
  async cancel() {
    this.modal.dismiss();
  }
  setOpen(open: boolean) {
    this.isToastOpen = open;
  }
}
