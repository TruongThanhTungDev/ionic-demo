import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dashboard-page',
  templateUrl: 'dashboard.component.html',
  styleUrls: [],
})
export class Dashboard {
  constructor(private router: Router) {}
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
