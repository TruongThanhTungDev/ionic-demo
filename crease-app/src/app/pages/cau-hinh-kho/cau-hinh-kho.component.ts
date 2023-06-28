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
  styleUrls: ['./cau-hinh-kho.component.scss'],

})
export class CauhinhKhoComponent implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  REQUEST_URL = '/api/v1/warehouse';
  REQUEST_URL_SHOP = '/api/v1/shop';
  REQUEST_URL_ACCOUNT = '/api/v1/account';
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  previousPage = 1;
  sort = 'id';
  sortType = true;
  typeModal = 'add'
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
  shop:any;
  tentaikhoan:any;
  phoneNumber : any;
  listSelect:any = [];
  isOpenAddModal = false;
  listShop: any = [];
  listTaiKhoan: { userName: string }[] = [];
  listAccountData: { userName: string }[] = [];
  totalImportProduct: any;
  totalInventoryQuantity: any;
  totalAwaitingProduct: any;
  price: any;
  localData: any;
  userName:any; 

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
    this.shopCode=this.localStorage.retrieve('shopCode');
    this.shop = this.localStorage.retrieve('shop');
  }
  ngOnInit(): void {
    this.loadData();
     
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
    // this.resetData(this.data)
    console.log(this.selectedItem)
    if (this.selectedItem.name === '') {
      this.isToastOpen = true;
      this.messageToast = 'Tên Không được để trống';
      return false;
    }
    if (this.selectedItem.phone === '') {      
      const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
      if (vnf_regex.test(this.selectedItem.phone.trim()) == false) {
        console.log(1)
        this.isToastOpen = true;
        this.messageToast = 'Số điện thoại không đúng định dạng';
        return false;
      }else{
        console.log(2)
        this.isToastOpen = true;
        this.messageToast = 'Số điện thoại không được để trống';
        return false;
      }
    }
    console.log(3)
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
  async getTaiKhoan() {
    console.log(1)
  const params = {
    sort: ['id', 'asc'],
    page: 0,
    size: 10,
    filter: 'id>0;userName=="*'+ this.tentaikhoan + '*"',
  };
    await this.isLoading();
    this.dmService.query(params, '/api/v1/account').subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.listTaiKhoan = res.body.RESULT.content;
          this.loading.dismiss();
        } else {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
        }
      },
      (error) => {
        this.loading.dismiss();
        this.isToastOpen = true;
        this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại sau!';
        console.error(error);
      }
    );
}
async getAccountData() {
  if (this.info.role !== 'admin') return;
  if(!this.selectedItem) return;
  if (!this.tentaikhoan) {
    this.tentaikhoan = ""; 
  }
  const params = {
    sort: ['id','desc'],
    page: this.page - 1,
    size: this.itemsPerPage,
    filter: 'id>0;userName=="*'+ this.tentaikhoan +'*"',
  };
 
  await this.isLoading();
  this.dmService.getOption(params, this.REQUEST_URL_ACCOUNT,'/search').subscribe(
    (res: HttpResponse<any>) => {
      if (res.status === 200) {
        this.listAccountData = res.body.RESULT.content;
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
  async getWareHouseData() {
    if(!this.selectedItem) return
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
    if(this.typeModal='add' ){
      console.log(9)
      if (this.validData) {
        let entity = {
         staffIdList: [],
          warehouse:{
          address: this.selectedItem.address,
          name: this.selectedItem.name,
          phone: this.selectedItem.phone,
          staus: 1,
          shop:this.shop,
          flag: -1
        }
      }       
        this.dmService
          .postOption(entity, this.REQUEST_URL, OPERATIONS.CREATE)
          .subscribe(
            (res: HttpResponse<any>) => {
              if (res.body.CODE === 200) {
                this.loadData();
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
      }
    }else{
      console.log(9)
      const entity = {
        staffIdList: [],
        warehouse:{
          address: this.selectedItem.address,
          name: this.selectedItem.name,
          phone: this.selectedItem.phone,
          staus: this.selectedItem.staus,
          shop:this.selectedItem.shop,
          id: this.selectedItem.id,
          createAt: this.selectedItem.createAt,
          flag: this.selectedItem.flag,
          updateAt: this.selectedItem.updateAt,
          code: this.selectedItem.code
        }
      }
      this.dmService
      .postOption(entity, this.REQUEST_URL, OPERATIONS.CREATE)
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.loadData();
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Update kho thành công';
            this.confirm();
          } else {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Update kho thất bại';
            this.cancel();
          }
        },
        () => {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Update kho thất bại';
          console.error();
        }
      );
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
      this.localData = null;
      this.listAccountData=[];
    }
  }
  async addKho() {
    
    const modal = await this.modalCtrl.create({
      component: ThemSuaKhoComponent,
      componentProps: {
        title: this.typeModal === 'add' ? 'Tạo cấu hình kho' : 'Chỉnh sửa thông tin kho',
        data: this.typeModal === 'edit' ? this.selectedItem : null,
        type: this.typeModal
      },
      backdropDismiss: false,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if(role === 'confirm'){
      this.selectedItem = data
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
  // resetData(data:any){
  //   if (data) {
  //     this.name = data.name;
  //     this.phone = data.phone;
  //     this.address = data.address;
  //   }
  //   console.log(this.name)
  // }
  changePagination(e: any) {
    this.page = e;
    this.loadData();
  }
  searchKho(e: any) {
    this.name = e.target.value;
    this.loadData();
  }
  setOpenStatisticKho(open: boolean, item: any,type:any) {
    // this.selectedItem = item;
    this.typeModal = type
    this.isOpenStatisticKho = open;
      this.selectedItem = item;
      if(type !=='add' && item){
        this.getWareHouseData();
        // this.getTaiKhoan();
        this.getAccountData();

      } else {
        this.selectedItem = null;
      }
  }
}
