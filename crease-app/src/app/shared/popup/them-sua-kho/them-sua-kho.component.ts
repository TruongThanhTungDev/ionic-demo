import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { OPERATIONS } from 'src/app/app.constant';
import { DanhMucService } from 'src/app/danhmuc.services';
@Component({
  selector: 'them-sua-kho',
  templateUrl: './them-sua-kho.component.html',
  styleUrls: ['./them-sua-kho.component.scss'],
})
export class ThemSuaKhoComponent implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  name='';
  phone='';
  address='';
  shopCode :any;
  isToastOpen = false;
  isOpenAddModal=false;
  listShop:any = [];
  messageToast: any;
  totalImportProduct:any;
  totalInventoryQuantity:any;
  totalAwaitingProduct:any;
  price:any;
  info: any;
  localData:any;
  REQUEST_URL = '/api/v1/warehouse';
  REQUEST_URL_SHOP = '/api/v1/shop';
  constructor(
    private modalCtrl: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService,
    private actionSheetCtrl: ActionSheetController
    
  ) { 
    }
  ngOnInit(): void {
    this.dmService.getOption(null, this.REQUEST_URL_SHOP, "?status=1").subscribe(
      (res: HttpResponse<any>) => {
          this.listShop = res.body.RESULT;
      },
      () => {
          console.error();
      });
    if (this.data) {
      this.name = this.data.name;
      this.phone = this.data.phone;
      this.address = this.data.address;
    } 
    if(this.type==='edit'){
      console.log(this.type)
      this.loadData();
      console.log(this.localData)
    }
  }

  public filterData() {
    let filter = [];
    if (this.phone) {
      filter.push(`phone=="*${this.phone.trim()}*"`);
    }
    if (this.name) {
      filter.push(`name=="*${this.name.trim()}*"`);
    }
    if (this.address) {
      filter.push(`address=="*${this.address.trim()}s*"`);
    }
    if (this.totalImportProduct) {
      filter.push(`totalImportProduct==${this.totalImportProduct}`);
    }
    if (this.totalAwaitingProduct) {
      filter.push(`totalAwaitingProduct==${this.totalAwaitingProduct}`);
    }
    if (this.totalInventoryQuantity) {
      filter.push(`totalInventoryQuantity==${this.totalInventoryQuantity}`);
    }
    if (this.price) {
      filter.push(`price==${this.price}`);
    }
    return filter.join(";");
  }
  async loadData() {
  
    await this.isLoading();
    this.dmService.getOption(null,this.REQUEST_URL,'/stc-warehouse?warehouseId='+this.data.id).subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.localData = res.body.RESULT;          
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
  get validData() {
    this.data= this.data;
    if (this.name == '') {
      this.isToastOpen = true;
      this.messageToast = 'Tên Không được để trống';
      return false;
    }
    if (this.phone == '') {
      this.isToastOpen = true;
      this.messageToast = 'Số điện thoại không được để trống';
      return false;
    }
    return true;
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
    }
  }
  async saveInfo() {
      if(this.validData){
        let entity={
          id: '',
          name: this.name,
          phone:this.phone,
          address: this.address,
        };
        await this.isLoading();
        if (this.type === 'add') {
        this.dmService
          .postOption(entity, this.REQUEST_URL,OPERATIONS.CREATE)
          .subscribe(
            (res: HttpResponse<any>) => {
              if (res.body.CODE === 200) {
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
      else{
        entity.id = this.data.id;
        this.dmService
          .putOption(entity,  this.REQUEST_URL, '/update?id='+entity.id)
          .subscribe(
            (res: HttpResponse<any>) => {
              if (res.body.CODE === 200) {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Cập nhật kho thành công';
                this.confirm();
              } else {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Cập nhật kho thất bại';
                this.cancel();
              }
            },
            () => {
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = 'Cập nhật kho thất bại';
              console.error();
            }
      )};
    } 
  }
  confirm() {
    this.modalCtrl.dismiss(null, 'confirm');
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
  
  openModalAdd(isOpen: boolean) {
    this.isOpenAddModal = isOpen;
  }
  async save(){       
        this.name= this.name
        this.phone=this.phone
        this.address= this.address   
  } 
}