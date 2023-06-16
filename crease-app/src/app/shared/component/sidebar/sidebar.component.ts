import { Component, Input } from '@angular/core';
import { ROUTES } from '../../utils/data';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'sidebar-component',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SideBarComponent {
  @Input() listMenu: any[] = [];
  constructor(private local: LocalStorageService) {}
  get info() {
    return this.local.retrieve('authenticationToken');
  }
  get infoShop() {
    return this.local.retrieve('shop');
  }
  get isShowMenu() {
    return this.info.role === 'admin' && this.infoShop;
  }
}
