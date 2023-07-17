import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  REQUEST_URL = '/api/v1/product';
  REQUEST_URL_SUB = '/api/v1/sub-product';
  selectedProduct: any;
  listProducts: any[] = [];
  page = 1;
  totalItems = 0;
  itemsPerPage = 10;
  ftTrangThai = '';
  ftMa = '';
  ftTen = '';
  ftDanhMuc = '';
  ftKho: any;
  info: any;
  shop: any;
  listKho: any[] = [];
  messageToast: any;
  isBackHeader = false;
  isToastOpen = false;
  isOpenFilterModal = false;
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController,
    private modal: ModalController,
    private store: Store<any>,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.store.subscribe((state) => {
      this.isBackHeader = state.common.isBackHeader;
      this.selectedProduct = null;
    });
    this.route.queryParams.subscribe((params: any) => {
      this.ftKho = params.khoId ? Number(params.khoId) : null;
    });
    this.info = this.localStorage.retrieve('authenticationToken');
    this.shop = this.localStorage.retrieve('shop');
    this.loadData();
  }
  async editProductInfo(item: any) {
    const modal = await this.modal.create({
      component: XuLyProduct,
      componentProps: {
        title: 'Xử lý thông tin sản phẩm',
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
  async addProduct() {
    const modal = await this.modal.create({
      component: XuLyProduct,
      componentProps: {
        title: 'Thêm mới sản phẩm',
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
  public async loadData() {
    const params = {
      sort: ['id', 'desc'],
      page: this.page - 1,
      size: this.itemsPerPage,
      filter: this.filter(),
    };
    await this.isLoading();
    this.dmService.query(params, this.REQUEST_URL).subscribe(
      (res: HttpResponse<any>) => {
        if (res.body) {
          if (res.body.CODE === 200) {
            this.loading.dismiss();
            this.page = res.body ? res.body.RESULT.number + 1 : 1;
            this.totalItems = res.body ? res.body.RESULT.totalElements : 0;
            this.listProducts = res.body.RESULT.content;
            this.customListEntity();
            // load page
            console.log('this.listProducts :>> ', this.listProducts);
          } else {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = res.body.MESSAGE
              ? res.body.MESSAGE
              : 'Lấy danh sách sản phẩm thất bại';
          }
        } else {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = res.body.MESSAGE
            ? res.body.MESSAGE
            : 'Lấy danh sách sản phẩm thất bại';
        }
      },
      () => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại!';
        console.error();
      }
    );
  }

  private filter(): string {
    const comparesArray: string[] = [];
    const { ftDanhMuc, ftMa, ftTen, ftTrangThai, ftKho } = this;
    comparesArray.push(`id>0;shopcode=="${this.shop ? this.shop.code : ''}"`);
    if (ftDanhMuc)
      comparesArray.push(`productCategory.name=="*${ftDanhMuc.trim()}*"`);
    if (ftMa) comparesArray.push(`code=="*${ftMa.trim()}*"`);
    if (ftTen) comparesArray.push(`name=="*${ftTen.trim()}*"`);
    if (ftTrangThai) comparesArray.push(`status==${ftTrangThai}`);
    if (ftKho) comparesArray.push(`warehouseId==${ftKho}`);
    return comparesArray.join(';');
  }
  customListEntity(): any {
    for (let i = 0; i < this.listProducts.length; i++) {
      this.listProducts[i].isExpand = false;
      this.loadDataSub(this.listProducts[i].subProductList, i);
    }
  }

  loadDataSub(list: any, i: any): void {
    this.listProducts[i].soMauMa = list.length;
    let tongNhap = 0;
    let coTheBan = 0;
    let choVanChuyen = 0;
    let tongTonKho = 0;
    let sanPhamLoi = 0;
    let giaNhapCuoi = 0;
    let giaBan = 0;
    let sapVe = 0;
    let tongTienConLai = 0;
    for (let i = 0; i < list.length; i++) {
      tongNhap += list[i].totalQuantity ? list[i].totalQuantity : 0;
      coTheBan += list[i].availableQuantity ? list[i].availableQuantity : 0;
      choVanChuyen += list[i].awaitingProductQuantity
        ? list[i].awaitingProductQuantity
        : 0;
      tongTonKho += list[i].inventoryQuantity ? list[i].inventoryQuantity : 0;
      sanPhamLoi += list[i].defectiveProductQuantity
        ? list[i].defectiveProductQuantity
        : 0;
      giaNhapCuoi += list[i].lastImportedPrice ? list[i].lastImportedPrice : 0;
      giaBan += list[i].price ? list[i].price : 0;
      sapVe += list[i].awaitingProductQuantity
        ? list[i].awaitingProductQuantity
        : 0;
      tongTienConLai +=
        (list[i].inventoryQuantity ? list[i].inventoryQuantity : 0) *
        (list[i].lastImportedPrice ? list[i].lastImportedPrice : 0);
    }
    this.listProducts[i].tongNhap = tongNhap;
    this.listProducts[i].coTheBan = coTheBan;
    this.listProducts[i].choVanChuyen = choVanChuyen;
    this.listProducts[i].tongTonKho = tongTonKho;
    this.listProducts[i].sanPhamLoi = sanPhamLoi;
    this.listProducts[i].giaNhapCuoi = giaNhapCuoi
      ? giaNhapCuoi / list.length
      : 0;
    this.listProducts[i].giaBan = giaBan ? giaBan / list.length : 0;
    this.listProducts[i].sapVe = sapVe;
    this.listProducts[i].tongTienConLai = tongTienConLai;
  }
  getKho(): void {
    const params = {
      sort: ['id', 'asc'],
      page: 0,
      size: 1000,
      filter: 'id>0;staus>=0;shop.code==' + (this.shop ? this.shop.code : ''),
    };
    this.dmService.query(params, '/api/v1/warehouse').subscribe(
      (res: HttpResponse<any>) => {
        if (res.body) {
          if (res.body.CODE === 200) {
            this.listKho = res.body.RESULT.content;
          } else {
            this.isToastOpen = true;
            this.messageToast = res.body.MESSAGE
              ? res.body.MESSAGE
              : 'Lấy danh sách kho thất bại';
          }
        } else {
          this.isToastOpen = true;
          this.messageToast = res.body.MESSAGE
            ? res.body.MESSAGE
            : 'Lấy danh sách kho thất bại';
        }
      },
      () => {
        this.isToastOpen = true;
        this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
        console.error();
      }
    );
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
    this.loadData();
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
