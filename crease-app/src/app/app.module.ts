import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layouts/layout.component';
import { HeadersInterceptor } from './header.intercepter';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemSuaShop } from './shared/popup/them-sua-shop/them-sua-shop.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ThemSuaAccount } from './shared/popup/them-sua-account/them-sua-account.component';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [AppComponent, LayoutComponent, ThemSuaShop, ThemSuaAccount],
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    ToastrModule.forRoot(),
    AppRoutingModule,
    NgxWebstorageModule.forRoot({ prefix: '', separator: '' }),
    NgxSpinnerModule,
    NgxPaginationModule,
    NgSelectModule,
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
