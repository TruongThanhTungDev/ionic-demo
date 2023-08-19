import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layouts/layout.component';
import { HeadersInterceptor } from './header.intercepter';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemSuaShop } from './shared/popup/them-sua-shop/them-sua-shop.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ThemSuaAccount } from './shared/popup/them-sua-account/them-sua-account.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { commonReducer } from './shared/store/common/common.reducers';
import { ThemSuaCostTypeComponent } from './shared/popup/them-sua-loai-chi-phi/them-sua-loai-chi-phi.component';
import { ThemSuaCostRecord } from './shared/popup/them-sua-ban-ghi-chi-phi/them-sua-ban-ghi-chi-phi-component';
import { ThemSuaUtmComponent } from './shared/popup/them-sua-utm/them-sua-utm.component';
import { ThemSuaCostMarketing } from './shared/popup/them-sua-cost-marketing/them-sua-cost-marketing.component';
import { ThemSuaKhoComponent } from './shared/popup/them-sua-kho/them-sua-kho/them-sua-kho.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CheckInComponent } from './shared/popup/check-in/check-in.component';
import { CheckOutComponent } from './shared/popup/check-out/check-out.component';
import { XuLyOrderComponent } from './shared/popup/xu-ly-order/xu-ly-order.component';
import { ThongTinKhachHangOrder } from './shared/popup/xu-ly-order/thong-tin-khach-hang/thong-tin-khach-hang.component';
import { OnlyNumberDirective } from './plugins/only-number.directive';
import { ThongTinDiaChiOrder } from './shared/popup/xu-ly-order/thong-tin-dia-chi/thong-tin-dia-chi.component';
import { PhanQuyenKhoComponent } from './shared/popup/them-sua-kho/phan-quyen-kho/phan-quyen-kho.component';
import { ThongTinGhiChuOrderComponent } from './shared/popup/xu-ly-order/thong-tin-ghi-chu/thong-tin-ghi-chu.component';
import { ThongTinDonHangOrder } from './shared/popup/xu-ly-order/thong-tin-don-hang/thong-tin-don-hang.component';
import { XulyPhieuNhapComponent } from './shared/popup/them-sua-kho/them-sua-phieu-nhap/xu-ly-phieu-nhap.component';
import { GiaoViecOrder } from './shared/popup/giao-viec/giao-viec.component';
import { GiaoViecNhanhPopup } from './shared/popup/giao-viec-nhanh/giao-viec-nhanh.component';
import { ThemThongTinPhieuNhapComponent } from './shared/popup/them-sua-kho/them-sua-phieu-nhap/them-thong-tin-phieu-nhap/them-thong-tin-phieu-nhap.component';
import { ThemSanPhamNhapComponent } from './shared/popup/them-sua-kho/them-sua-phieu-nhap/them-san-pham-nhap/them-san-pham-nhap.component';
import { ThaoTacOrder } from './shared/popup/thao-tac-order/thao-tac-order.component';
import { XulyPhieuXuatComponent } from './shared/popup/them-sua-kho/them-sua-phieu-xuat/xu-ly-phieu-xuat.component';
import { ThemSanPhamXuatComponent } from './shared/popup/them-sua-kho/them-sua-phieu-xuat/them-san-pham-xuat/them-san-pham-xuat.component';
import { ThemThongTinPhieuXuatComponent } from './shared/popup/them-sua-kho/them-sua-phieu-xuat/them-thong-tin-phieu-xuat/them-thong-tin-phieu-xuat.component';
import { XulyPhieuHangLoiComponent } from './shared/popup/them-sua-kho/them-sua-phieu-hang-loi/xu-ly-phieu-hang-loi.component';
import { ThemThongTinPhieuHangLoiComponent } from './shared/popup/them-sua-kho/them-sua-phieu-hang-loi/them-thong-tin-phieu-hang-loi/them-thong-tin-phieu-hang-loi.component';
import { ThemSanPhamHangLoiComponent } from './shared/popup/them-sua-kho/them-sua-phieu-hang-loi/them-san-pham-loi/them-san-pham-loi.component';
import { XuLyProduct } from './shared/popup/xu-ly-product/xu-ly-product.component';
import { ThongTinSanPhamComponent } from './shared/popup/xu-ly-product/thong-tin-san-pham/thong-tin-san-pham.component';
import { MauMaSanPhamComponent } from './shared/popup/xu-ly-product/mau-ma-san-pham/mau-ma-san-pham';
import { DanhMucProductComponent } from './shared/popup/danh-muc-san-pham/danh-muc-san-pham.component';
import { SwiperModule } from 'swiper/angular';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
@NgModule({
  declarations: [
    OnlyNumberDirective,
    AppComponent,
    LayoutComponent,
    ThemSuaShop,
    ThemSuaAccount,
    ThemSuaCostTypeComponent,
    ThemSuaCostRecord,
    ThemSuaUtmComponent,
    ThemSuaCostMarketing,
    ThemSuaKhoComponent,
    CheckInComponent,
    CheckOutComponent,
    XuLyOrderComponent,
    ThongTinKhachHangOrder,
    ThongTinDiaChiOrder,
    PhanQuyenKhoComponent,
    ThongTinGhiChuOrderComponent,
    ThongTinDonHangOrder,
    XulyPhieuNhapComponent,
    ThemThongTinPhieuNhapComponent,
    ThemSanPhamNhapComponent,
    GiaoViecOrder,
    GiaoViecNhanhPopup,
    XulyPhieuXuatComponent,
    ThemSanPhamXuatComponent,
    ThemThongTinPhieuXuatComponent,
    ThaoTacOrder,
    XulyPhieuHangLoiComponent,
    ThemSanPhamHangLoiComponent,
    ThemThongTinPhieuHangLoiComponent,
    XuLyProduct,
    ThongTinSanPhamComponent,
    MauMaSanPhamComponent,
    DanhMucProductComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    ToastrModule.forRoot(),
    AppRoutingModule,
    NgxWebstorageModule.forRoot({ prefix: '', separator: '' }),
    NgxSpinnerModule,
    NgxPaginationModule,
    NgSelectModule,
    StoreModule.forRoot({
      common: commonReducer,
    }),
    StoreModule.forFeature('common', commonReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    BrowserAnimationsModule,
    HighchartsChartModule,
    SwiperModule,
    TooltipModule.forRoot(),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
