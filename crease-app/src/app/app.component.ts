import { Component } from '@angular/core';
import { StatusBar, StatusBarStyle } from '@capacitor/status-bar';
import { isPlatform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    StatusBar.setBackgroundColor({
      color: '#006eb9e6',
    });
  }
}
