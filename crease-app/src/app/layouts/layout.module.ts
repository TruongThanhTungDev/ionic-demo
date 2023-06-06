import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutRoutes } from './layout.routing';
import { ShopComponent } from '../pages/shop/shop.component';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(LayoutRoutes)],
  declarations: [ShopComponent],
})
export class LayoutModule {}
