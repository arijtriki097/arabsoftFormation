import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {

  private baseUrl = 'http://localhost:8081/api/departements';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getById(id: number): Observable<any> { 
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Accepte regionId mais récupère le nom de la région
  add(departement: any, regionId: number, regions: any[]): Observable<any> {
    // Trouver le nom de la région à partir de l'ID
    const selectedRegion = regions.find(r => r.id === regionId);
    
    if (!selectedRegion) {
      throw new Error('Région non trouvée');
    }

    const body = {
      name: departement.name,
      region: {
        name: selectedRegion.name  // Envoyer le nom de la région
      }
    };
    return this.http.post(this.baseUrl, body);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  updateDepartement(id: number, departement: any): Observable<any> {
    const body = {
      name: departement.name,
      region: {
        id: departement.regionId 
      }
    };
    return this.http.put(`${this.baseUrl}/${id}`, body);
  }


}