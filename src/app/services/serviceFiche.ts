import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class serviceFiche {

  private baseUrl = 'http://localhost:8081/api/fiche';

  constructor(private http: HttpClient) {}

  getFiches(body?: any, params?: any): Observable<Blob> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] != null) 
            httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.post(`${this.baseUrl}/fiches`, body || {}, {
      params: httpParams,
      responseType: 'blob'
    });
  }
}
