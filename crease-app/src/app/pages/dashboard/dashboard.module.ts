import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Dashboard } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, DashboardRoutingModule],
  declarations: [Dashboard],
})
export class DashboardModule {}
