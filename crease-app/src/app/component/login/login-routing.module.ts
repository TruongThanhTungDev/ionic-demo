import { RouterModule, Routes } from '@angular/router';
import { Login } from './login.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: Login,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class LoginRoutingModule {}
