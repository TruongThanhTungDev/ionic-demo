import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import { ROLE } from 'src/app/app.constant';
@Component({
  selector: 'account-component',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, AfterViewInit {
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  previousPage = 1;
  sort = 'id';
  sortType = true;
  REQUEST_URL = '/api/v1/account';

  listEntity: any;
  info: any;
  selectedEntity: any = null;
  selectedId = 0;

  FtTaiKhoan = '';
  FtHoTen = '';
  FtEmail = '';
  FtSdt = '';
  FtDiaChi = '';
  FtPhanQuyen = '';
  FtGhiChu = '';
  shopCode = '';
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
    this.shopCode = this.localStorage.retrieve('shop').code;
  }
  ngOnInit(): void {
    if (this.shopCode) {
      this.loadData();
    }
  }
  get roleUser() {
    return ROLE;
  }
  ngAfterViewInit(): void {}
  public loadData() {
    if (this.info.role !== 'admin') return;
    const params = {
      sort: [this.sort, this.sortType ? 'desc' : 'asc'],
      page: this.page - 1,
      size: this.itemsPerPage,
      filter: this.filter(),
    };
    this.dmService.query(params, this.REQUEST_URL).subscribe(
      (res: HttpResponse<any>) => {
        if (res.body) {
          if (res.body.CODE === 200) {
            this.page = res.body ? res.body.RESULT.number + 1 : 1;
            this.totalItems = res.body ? res.body.RESULT.totalElements : 0;
            this.listEntity = res.body.RESULT.content;
            // load page
            if (this.listEntity.length === 0 && this.page > 1) {
              this.page = 1;
              this.loadData();
            }
          } else {
          }
        } else {
        }
      },
      () => {
        console.error();
      }
    );
  }

  private filter(): string {
    const comparesArray: string[] = [];
    const {
      FtTaiKhoan,
      FtHoTen,
      FtDiaChi,
      FtEmail,
      FtGhiChu,
      FtPhanQuyen,
      FtSdt,
      shopCode,
    } = this;
    comparesArray.push(`id>0;shop=="*` + shopCode + '*"');
    if (FtHoTen) comparesArray.push(`fullName=="*${FtHoTen.trim()}*"`);
    if (FtTaiKhoan) comparesArray.push(`userName=="*${FtTaiKhoan.trim()}*"`);
    if (FtDiaChi) comparesArray.push(`address=="*${FtDiaChi.trim()}*"`);
    if (FtEmail) comparesArray.push(`email=="*${FtEmail.trim()}*"`);
    if (FtGhiChu) comparesArray.push(`note=="*${FtGhiChu.trim()}*"`);
    if (FtPhanQuyen) comparesArray.push(`role=="*${FtPhanQuyen.trim()}*"`);
    if (FtSdt) comparesArray.push(`phone=="*${FtSdt.trim()}*"`);
    return comparesArray.join(';');
  }
}
