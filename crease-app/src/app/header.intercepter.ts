import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class HeadersInterceptor implements HttpInterceptor {
  constructor(private localStorage: LocalStorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.localStorage.retrieve('authenticationToken');
    if (token) {
      var header = 'Bearer ' + token.object;
      request = request.clone({
        setHeaders: {
          Authorization: header,
          'Accept-Language': 'vi',
          'Content-Type' : 'application/json'
        },
      });
      
    }

    return next.handle(request);
  }
}
