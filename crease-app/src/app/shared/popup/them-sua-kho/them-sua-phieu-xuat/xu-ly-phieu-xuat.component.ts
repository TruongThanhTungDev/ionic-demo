import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { OPERATIONS } from 'src/app/app.constant';
import { DanhMucService } from 'src/app/danhmuc.services';
import { Plugin } from 'src/app/shared/utils/plugins';
@Component({
  selector: 'xu-ly-phieu-xuat',
  templateUrl: './xu-ly-phieu-xuat.component.html',
  styleUrls: ['./xu-ly-phieu-xuat.component.scss'],
})
export class XulyPhieuXuatComponent implements OnInit {
  REQUEST_URL = '/api/v1/bol';
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  @Input() shopCode: any;
  @Input() kho: any;
  plugins = new Plugin();
  messageToast: any;
  subProductList: any[] = [];
  listSanPham = [];
  isToastOpen= false;
  isShowPhieuXuat = false;
  isShowSanPham = false;
  shop: any;
  khoId: any;
  info: any;
  id: any;
  creatorName: any;
  createAt: any;
  estimatedReturnDate: any;
  note: any;
  status: any;
  product: any;
  subProductCode: any;
  warehouse: any;
  totalQuantity: any;
  availableQuantity: any;
  nhaCungCap: any;
  price: any;
  totalPrice: any;
  selectedCT: any;
  tongSLCTB: any;
  tongSLSP: any;
  tongTT: any;
  ngOnInit(): void {
    this.info = this.localStorage.retrieve('authenticationtoken');
    if (this.data) {
      this.id = this.data.id;
      this.creatorName = this.data.creatorName;
      this.createAt = this.data.createAt;
      this.estimatedReturnDate = this.data.estimatedReturnDate ? moment(this.data.estimatedReturnDate, 'YYYYMMDD').format('DD/MM/YYYY') :'';
      this.note = this.data.note;
      this.status = this.data.status;
      this.warehouse = this.data.warehouse;
    } else {
      this.status = 0;
      this.createAt = moment(new Date()).format('DD/MM/YYYY');
    }
    if (this.data && this.data.boLDetailList) {
      this.loadDataSub(this.data.boLDetailList);
    }
    
  }
  constructor(
    private modalXuat: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
    this.shop = this.localStorage.retrieve('shop');
    this.khoId = this.localStorage.retrieve('warehouseId');
  }
  loadDataSub(list: any) {
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      a.warehouse = this.warehouse;
      this.subProductList.push(a);
    }
    for (let i = 0; i < this.subProductList.length; i++) {
      this.changeThanhTien(i);
    }
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
      this.modalXuat.dismiss();
    }
  }
  confirm() {
    this.modalXuat.dismiss(null, 'confirm');
  }

  async editPhieuXuat(open: any) {
    this.isShowPhieuXuat = open;
  }
  handleEditPhieuXuat(value: any) {
    this.createAt = value.createAt;
    this.estimatedReturnDate = value.estimatedReturnDate;
    this.note = value.note;
    this.isShowPhieuXuat = value.isOpen;
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
  async editSanPham(open: any) {
    this.isShowSanPham = open;
  }
  handleEditSanPham(value: any) {
    this.product = value.product;
    this.subProductCode = value.subProductCode;
    this.totalQuantity = value.totalQuantity;
    this.availableQuantity = value.availableQuantity;
    this.price = value.price;
    this.nhaCungCap = value.nhaCungCap;
    this.khoId = value.khoId;
    this.isShowSanPham = value.isOpen;
    this.addSanPhamPhieuXuat();
  }
  addSanPhamPhieuXuat() {
    this.subProductList.forEach((e) => {
      e.edit = false;
    });
    const entity = {
      availableQuantity: 0,
      price: this.price ? this.price : 0,
      totalQuantity: this.totalQuantity ? this.totalQuantity : 0,
      subProduct: this.subProductCode,
      warehouse: this.warehouse,
      totalPrice:
        Number(this.price) && Number(this.totalQuantity)
          ? Number(this.price) * Number(this.totalQuantity)
          : 0,
      edit: false,
    };

    this.subProductList.push(entity);
    this.selectedCT = this.subProductList.length - 1;
    this.resetForm();
    this.changeTong();
  }
  resetForm() {
    this.price = '';
    this.totalQuantity = '';
    this.subProductCode = null;
    this.product = null;
  }
  changeThanhTien(e: any) {
    if (
      Number(this.subProductList[e].price) < 0 ||
      Number(this.subProductList[e].totalQuantity) <= 0
    ) {
      this.isToastOpen = true;
      this.messageToast = 'Số lượng, giá tiền phải lớn hơn 0';
    }
    this.subProductList[e].totalPrice =
      Number(this.subProductList[e].price) &&
      Number(this.subProductList[e].totalQuantity)
        ? Number(this.subProductList[e].price) *
          Number(this.subProductList[e].totalQuantity)
        : 0;
    this.changeTong();
  }

  onCreate() {
    
    if (this.subProductList.length === 0) {
      this.isToastOpen = true;
      this.messageToast = 'Danh sách hàng xuất không được để trống';
      return;
    }
    

    const bol = {
      createAt: this.createAt
        ? moment(this.createAt, 'DD/MM/YYYY').format('YYYYMMDD')
        : null,
      creator: this.data
        ? this.data.creator
          ? this.data.creator
          : { id: this.info.id }
        : this.info
        ? { id: this.info.id }
        : null,
      estimatedReturnDate: this.estimatedReturnDate
        ? moment(this.estimatedReturnDate, 'DD/MM/YYYY').format('YYYYMMDD')
        : '',
      status: this.status,
      supplierInfo: this.nhaCungCap ? this.nhaCungCap : (this.data?.supplierInfo ?? null),
      type: 2,
      shop: this.data ? this.data.shop : this.shop,
      warehouse: this.khoId ? { id: this.khoId } : {id: this.data.warehouse.id},
      note: this.note,
      id: this.data ? this.data.id : 0,
    };

    const subBol: any = [];
    for (let i = 0; i < this.subProductList.length; i++) {
      const a = {
        availableQuantity: this.subProductList[i].availableQuantity,
        price: this.subProductList[i].price,
        totalQuantity: this.subProductList[i].totalQuantity,
        subProduct: this.subProductList[i].subProduct,
        createAt: this.subProductList[i].createAt
          ? this.subProductList[i].createAt
          : null,
        id: this.subProductList[i].id ? this.subProductList[i].id : 0,
        note: this.note ? this.note : null,
        totalImport: this.subProductList[i].totalImport
          ? this.subProductList[i].totalImport
          : null,
      };
      if (
        Number(a.availableQuantity) < 0 ||
        Number(a.price) < 0 ||
        Number(a.totalQuantity) <= 0
      ) {
        this.isToastOpen = true;
        this.messageToast = 'Số lượng không <=0; giá xuất,tồn kho < 0';
        return;
      } 
      if (a.totalQuantity > a.subProduct.inventoryQuantity) {
        console.log(a.subProduct.inventoryQuantity)
        this.isToastOpen = true;
        this.messageToast = 'Số lượng không được lớn hơn tồn kho';
        return;
      }
      if (!a.id) {
        delete a.id;
      }
      subBol.push(a);
    }

    const entity = {
      boL: bol,
      boLDetailList: subBol,
    };
    this.create(entity);
  }
  onEditCT(e: any) {
    if (this.status !== 0) {
      return;
    }
    this.subProductList.forEach((e) => {
      e.edit = false;
    });
    e.edit = true;
  }
  removeRowCT(e: any) {
    this.subProductList.splice(e, 1);
    this.changeTong();
  }
  onSelectedCT(e: any) {
    this.selectedCT = e;
  }
  changeTong() {
    let a = 0;
    let b = 0;
    let c = 0;
    for (let i = 0; i < this.subProductList.length; i++) {
      a += this.subProductList[i].availableQuantity
        ? Number(this.subProductList[i].availableQuantity)
        : 0;
      b += this.subProductList[i].totalQuantity
        ? Number(this.subProductList[i].totalQuantity)
        : 0;
      c += this.subProductList[i].totalPrice
        ? Number(this.subProductList[i].totalPrice)
        : 0;
    }
    this.tongSLCTB = a;
    this.tongSLSP = b;
    this.tongTT = c;
  }
  create(entity: any) {
    if (!this.data) {
      delete entity.boL.id;
      this.dmService.postOption(entity, this.REQUEST_URL, '').subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.isToastOpen = true;
            this.messageToast = 'Tạo phiếu thành công';
            this.confirm();
          } else {
            this.isToastOpen = true;
            this.messageToast = 'Tạo phiếu thất bại';
            this.cancel();
          }
        },
        () => {
          this.isToastOpen = true;
          this.messageToast = 'Tạo phiếu thất bại';
          console.error();
        }
      );
    } else {
      this.dmService.postOption(entity, this.REQUEST_URL, '').subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.isToastOpen = true;
            this.messageToast = 'Cập nhật phiếu thành công';
            this.confirm();
          } else {
            this.isToastOpen = true;
            this.messageToast = 'Cập nhật phiếu thất bại';
            this.cancel();
          }
        },
        () => {
          this.isToastOpen = true;
          this.messageToast = 'Cập nhật phiếu thất bại';
        }
      );
    }
  }
  capNhatTrangThai() {
    
    this.data.status = this.status;
    this.data.createAt = this.data.createAt
      ? moment(this.data.createAt, 'DD/MM/YYYY').format('YYYYMMDD')
      : null;
    const entity = {
      boL: this.data,
      boLDetailList: this.data.boLDetailList,
    };
    this.dmService.postOption(entity, this.REQUEST_URL, '').subscribe(
      (res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.isToastOpen = true;
          this.messageToast = 'Cập nhật phiếu thành công';
          this.confirm();
        } else {
          this.isToastOpen = true;
          this.messageToast = 'Cập nhật phiếu thất bại';
          this.cancel();
        }
      },
      () => {
        this.isToastOpen = true;
        this.messageToast = 'Cập nhật phiếu thất bại';
        console.error();
      }
    );
  }
}
