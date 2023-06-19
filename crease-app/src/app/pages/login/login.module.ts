import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Login } from './login.component';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    LoginRoutingModule,
  ],
  declarations: [Login],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginModule {}
