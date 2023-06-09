import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'work-component',
  templateUrl: './work.component.html',
  styleUrls: [],
})
export class WorkComponent {
  routerCode: any;
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data) => {
      this.routerCode = data;
    });
  }
}
