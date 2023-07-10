import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';

@Component({
  selector: 'thong-tin-dia-chi',
  templateUrl: './thong-tin-dia-chi.component.html',
})
export class ThongTinDiaChiOrder implements OnInit {
  @Output() handleOpenModal = new EventEmitter<any>();
  @Output() editValue = new EventEmitter<any>();
  @Input() street: any;
  @Input() ward: any;
  @Input() province: any;
  @Input() district: any;
  @Input() status: any;
  REQUEST_ADDRESS_URL = '/api/v1/address';
  isModalOpen = false;
  listProvince: any;
  listDistrict: any;
  listWard: any;
  provinceId = '';
  districtId = '';
  wardId = '';
  provinceName = '';
  districtName = '';
  wardName = '';
  streetName = '';
  info: any;
  constructor(
    private modal: ModalController,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private localStorage: LocalStorageService
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
  }
  get disableEdit() {
    return (
      (this.info.role === 'admin' &&
        (this.status === 8 ||
          this.status === 10 ||
          this.status === 11 ||
          this.status === 12 ||
          this.status === 13 ||
          this.status === 14 ||
          this.status === 15 ||
          this.status === 16 ||
          this.status === 17 ||
          this.status === 18 ||
          this.status === 19 ||
          this.status === 20)) ||
      (this.info.role === 'user' &&
        (this.status === 7 ||
          this.status === 8 ||
          this.status === 10 ||
          this.status === 11 ||
          this.status === 12 ||
          this.status === 13 ||
          this.status === 14 ||
          this.status === 15 ||
          this.status === 16 ||
          this.status === 17 ||
          this.status === 18 ||
          this.status === 19 ||
          this.status === 20))
    );
  }
  async ngOnInit() {
    await this.getProvince();
    if (this.province) {
      this.findProvince(this.province);
    }
    if (this.district) {
      await this.getDistrict();
      this.findDistrict(this.district);
    }
    if (this.ward) {
      await this.getWard();
      this.findWard(this.ward);
    }
  }
  async setOpen(open: boolean) {
    this.isModalOpen = open;
    if (open) {
      if (this.province) {
        this.findProvince(this.province);
      }
      if (this.district) {
        // await this.getDistrict();
        this.findDistrict(this.district);
      }
      if (this.ward) {
        // await this.getWard();
        this.findWard(this.ward);
      }
      if (this.street) {
        this.streetName = this.street;
      }
    }
  }
  getProvince() {
    return new Promise((resolve, reject) => {
      this.dmService
        .getOption(null, this.REQUEST_ADDRESS_URL, '/provinces')
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.body.CODE === 200) {
              this.listProvince = res.body.RESULT;
              resolve(res);
            } else {
              reject(res);
            }
          },
          () => {
            reject();
            console.error();
          }
        );
    });
  }
  findProvince(province: any) {
    const result = this.listProvince.find((item: any) =>
      item.name.toLowerCase().includes(province.toLowerCase())
    );
    if (result) {
      this.provinceId = result.id;
      this.provinceName = result.name;
    }
  }
  findProvinceWithId(id: any) {
    const result = this.listProvince.find((item: any) => item.id == id);
    if (result) {
      this.provinceName = result.name;
    }
  }
  changeProvince(event: any) {
    this.listWard = [];
    this.wardName = '';
    this.districtName = '';
    this.provinceId = event.target.value;
    this.findProvinceWithId(this.provinceId);
    this.districtId = '';
    this.wardId = '';
    this.getDistrict();
  }
  changeDistrict(event: any) {
    this.wardName = '';
    this.districtId = event.target.value;
    this.findDistrictWithId(this.districtId);
    this.wardId = '';
    this.getWard();
  }
  getDistrict() {
    return new Promise((resolve, reject) => {
      this.dmService
        .getOption(
          null,
          this.REQUEST_ADDRESS_URL,
          '/districts?provinceId=' + this.provinceId
        )
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.body.CODE === 200) {
              resolve(res);
              this.listDistrict = res.body.RESULT;
            } else {
              reject(res);
            }
          },
          () => {
            reject();
            console.error();
          }
        );
    });
  }
  findDistrict(district: any) {
    const result = this.listDistrict.find((item: any) =>
      item.name.toLowerCase().includes(district.toLowerCase())
    );
    if (result) {
      this.districtId = result.id;
      this.districtName = result.name;
    }
  }
  findDistrictWithId(id: any) {
    const result = this.listDistrict.find((item: any) => item.id == id);
    if (result) {
      this.districtName = result.name;
    }
  }
  getWard() {
    return new Promise((resolve, reject) => {
      this.dmService
        .getOption(
          null,
          this.REQUEST_ADDRESS_URL,
          '/wards?provinceId=' +
            this.provinceId +
            '&districtId=' +
            this.districtId
        )
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.body.CODE === 200) {
              resolve(res);
              this.listWard = res.body.RESULT;
              this.findWardWithId(this.districtId);
            } else {
              reject(res);
            }
          },
          () => {
            reject();
            console.error();
          }
        );
    });
  }
  changeWard(event: any) {
    this.findWardWithId(event.target.value);
  }
  findWard(ward: any) {
    const result = this.listWard.find((item: any) =>
      item.name.toLowerCase().includes(ward.toLowerCase())
    );
    if (result) {
      this.wardId = result.id;
      this.wardName = result.name;
    }
  }
  findWardWithId(id: any) {
    const result = this.listWard.find((item: any) => item.id == id);
    if (result) {
      this.wardName = result.name;
    }
  }
  saveInfo() {
    const value = {
      street: this.streetName,
      ward: this.wardName,
      district: this.districtName,
      province: this.provinceName,
      isOpen: false,
    };
    this.province = this.provinceName;
    this.district = this.districtName;
    this.ward = this.wardName;
    this.street = this.streetName;
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
}
