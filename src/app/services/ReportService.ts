import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum ReportType {
  EMPLOYE = 'EMPLOYE',
  DEPARTEMENT = 'DEPARTEMENT',
  REGION = 'REGION'
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/api/reports/pdf';

  downloadReport(
    type: ReportType,
    regionId?: number | null,
    departementId?: number | null
  ): Observable<Blob> {
    const params: any = { type };
    if (regionId != null) params.regionId = regionId;
    if (departementId != null) params.departementId = departementId;

    return this.http.get(this.apiUrl, {
      responseType: 'blob',
      params,
      headers: { Accept: 'application/pdf' }
    });
  }
}
