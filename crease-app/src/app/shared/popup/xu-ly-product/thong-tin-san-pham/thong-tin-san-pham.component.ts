import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';

@Component({
  selector: 'thong-tin-san-pham',
  templateUrl: 'thong-tin-san-pham.component.html',
})
export class ThongTinSanPhamComponent implements OnInit {
  @Output() editValue = new EventEmitter<any>();
  @Input() type: any;
  @Input() name: any;
  @Input() code: any;
  @Input() image: any;
  @Input() note: any;
  @Input() warehouseId: any;
  @Input() warehouseName: any;
  @Input() productCategoryId: any;
  @Input() productCategoryName: any;
  nameInfo: any;
  codeInfo: any;
  imageInfo: any;
  noteInfo: any;
  info: any;
  shopCode: any;
  listKhoThaoTac: any[] = [];
  listDanhMuc: any[] = [];
  khoThaoTac: any;
  tenKhoThaoTac: any;
  isModalOpen = false;
  isToastOpen = false;
  messageToast: any;
  productCategory = {
    productCategoryId: '',
    productCategoryName: '',
  };
  constructor(
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
    this.shopCode = this.localStorage.retrieve('shopCode');
  }
  ngOnInit() {
    this.nameInfo = this.name;
    this.codeInfo = this.code;
    this.imageInfo = this.image;
    this.noteInfo = this.note;
    this.khoThaoTac = this.warehouseId;
    this.tenKhoThaoTac = this.warehouseName;
    this.productCategory.productCategoryId = this.productCategoryId;
    this.productCategory.productCategoryName = this.productCategoryName;
    this.getKhoThaoTac();
    this.getDanhMuc();
  }
  async setOpen(open: boolean) {
    this.isModalOpen = open;
    if (open && this.type === 'edit') {
      this.nameInfo = this.name;
      this.codeInfo = this.code;
      this.imageInfo = this.image;
      this.noteInfo = this.note;
      this.khoThaoTac = this.warehouseId;
      this.tenKhoThaoTac = this.warehouseName;
      this.productCategory.productCategoryId = this.productCategoryId;
      this.productCategory.productCategoryName = this.productCategoryName;
      this.findKho();
    }
  }
  async getKhoThaoTac() {
    await this.isLoading();
    const params = {
      sort: ['id', 'asc'],
      page: 0,
      size: 1000,
      filter: 'id>0;staus>=0;shop.code==' + this.shopCode,
    };
    this.dmService.query(params, '/api/v1/warehouse').subscribe(
      (res: HttpResponse<any>) => {
        if (res.body) {
          if (res.body.CODE === 200) {
            this.findKho();
            this.loading.dismiss();
            this.listKhoThaoTac = res.body.RESULT.content;
          } else {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = res.body.MESSAGE
              ? res.body.MESSAGE
              : 'Lấy danh sách kho thất bại';
          }
        } else {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
        }
      },
      () => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
        console.error();
      }
    );
  }
  async getDanhMuc() {
    this.dmService
      .getOption(null, '/api/v1/product_category', '/getAll')
      .subscribe(
        (res: HttpResponse<any>) => {
          this.listDanhMuc = res.body.RESULT;
        },
        () => {
          console.error();
        }
      );
  }
  findKho() {
    const result = this.listKhoThaoTac.find(
      (item: any) => item.id == this.warehouseId
    );
    if (result) {
      this.tenKhoThaoTac = result.name;
    } else {
      this.tenKhoThaoTac = '';
    }
  }
  changeKho(kho: any) {
    const result = this.listKhoThaoTac.find(
      (item: any) => item.id == kho.target.value
    );
    if (result) {
      this.tenKhoThaoTac = result.name;
    } else {
      this.tenKhoThaoTac = '';
    }
  }
  findDanhMuc(id: any) {
    const result = this.listDanhMuc.find((item: any) => item.id == id);
    if (result) {
      this.productCategory.productCategoryName = result.name;
    } else {
      this.productCategory.productCategoryName = '';
    }
  }
  changeDanhMuc(event: any) {
    this.findDanhMuc(event.target.value);
  }
  uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageInfo = reader.result as string;
      };
      reader.readAsDataURL(e.target.files[0]);
    };
    input.click();
  }
  saveInfo() {
    const value = {
      name: this.nameInfo,
      code: this.codeInfo,
      image: this.imageInfo,
      note: this.noteInfo,
      warehouseId: this.khoThaoTac,
      productCategoryId: this.productCategory.productCategoryId,
      productCategoryName: this.productCategory.productCategoryName,
    };
    this.name = this.nameInfo;
    this.code = this.codeInfo;
    this.image = this.imageInfo;
    this.note = this.noteInfo;
    this.warehouseName = this.tenKhoThaoTac;
    this.productCategoryName = this.productCategory.productCategoryName;
    this.editValue.emit(value);
    this.setOpen(false);
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
  setOpenToast(open: boolean) {
    this.isToastOpen = open;
  }
}
