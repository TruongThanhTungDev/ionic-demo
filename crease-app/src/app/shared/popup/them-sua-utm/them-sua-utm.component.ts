import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
@Component({
  selector: 'them-sua-utm',
  templateUrl: './them-sua-utm.component.html',
})
export class ThemSuaUtmComponent implements OnInit {
  @Input() data: any;
  @Input() title: any;
  @Input() type: any;
  isToastOpen = false;
  messageToast: any;
  code:any;
  note:any;
  nhanVien:any;
  name:any;
  id:any;
  nhanvienid:any;


  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService,
    private actionSheetCtrl: ActionSheetController
    
  ) { 
    }
  ngOnInit(): void {
    if (this.data) {
      this.code = this.data.code;
      this.note = this.data.note;
      this.name = this.data.account
        ? this.data.account.fullName + " (" + this.data.account.userName + ")"
        : "";
      this.nhanvienid = this.data.account.id;
    } else {
      const info = this.localStorage.retrieve("authenticationtoken");
      this.name = info ? info.fullName + " (" + info.userName + ")" : "";
      this.nhanvienid = info ? info.id : "";
    }
  }
  get validData() {
    this.code=this.code ? this.code.trim().toUpperCase() : "";
    this.name = this.localStorage.retrieve('authenticationtoken').userName;
    if (this.code == '') {
      this.isToastOpen = true;
      this.messageToast = 'code Không được để trống';
      return false;
    }
    if (this.name == '') {
      this.isToastOpen = true;
      this.messageToast = 'Tên không được để trống';
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
      this.modal.dismiss();
    }
  }
  async saveInfo() {
      if(this.validData){
        let entity={
          id: '',
          code: this.code,
          account:{ id: this.nhanvienid },
        
          note:this.note,
        };
        await this.isLoading();
        if (this.type === 'add') {
        this.dmService
          .postOption(entity, '/api/v1/utmmedium/create', '')
          .subscribe(
            (res: HttpResponse<any>) => {
              if (res.body.CODE === 200) {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Tạo UTM thành công';
                this.confirm();
              } else {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Tạo UTM thất bại';
                this.cancel();
              }
            },
            () => {
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = 'Tạo UTM thất bại';
              console.error();
            }
          );
      }
      else{
        entity.id = this.data.id;
        this.dmService
          .postOption(entity, '/api/v1/utmmedium/update', '')
          .subscribe(
            (res: HttpResponse<any>) => {
              if (res.body.CODE === 200) {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Cập nhật UTM thành công';
                this.confirm();
              } else {
                this.loading.dismiss();
                this.isToastOpen = true;
                this.messageToast = 'Cập nhật UTM thất bại';
                this.cancel();
              }
            },
            () => {
              this.loading.dismiss();
              this.isToastOpen = true;
              this.messageToast = 'Cập nhật UTM thất bại';
              console.error();
            }
      )};
    } 
  }
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