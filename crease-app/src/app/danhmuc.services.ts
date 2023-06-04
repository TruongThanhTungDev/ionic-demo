import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV, OPERATIONS } from './app.constant';
import { createRequestOption } from './shared/utils/request';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DanhMucService {
  public baseAPI = ENV.domainTest;

  constructor(protected http: HttpClient) {}

  create(url: any, payload: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      this.baseAPI + url + OPERATIONS.CREATE,
      payload,
      {
        observe: 'response',
      }
    );
  }

  postOption(
    url: any,
    entity: any,
    option: any
  ): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.baseAPI + url + option, entity, {
      observe: 'response',
    });
  }
}
