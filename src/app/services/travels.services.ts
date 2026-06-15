import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TravelService {
  constructor(private http: HttpClient) {}

  generarPlan(datos: { lugar: string; transporte: string; dias: number }) {
    const formData = new FormData();
    formData.append('lugar', datos.lugar);
    formData.append('transporte', datos.transporte);
    formData.append('dias', datos.dias.toString());

    return this.http.post<{ respuesta: string }>('http://localhost:8000/plan-viaje', formData);
  }
}
