import { Injectable, inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Travel } from '../domain/response.type';

@Injectable({
  providedIn: 'root',
})

export class TravelsRsponseService {
  #baseUrl = 'http://localhost:8000/plan-viaje';

  /** The HTTP client to make requests to the API */
  #http = inject(HttpClient);

  /** Obtiene todos los planes de viaje almacenados */
  getAllTravels$(): Observable<Travel[]> {
    const outputsUrl = 'http://localhost:8000/outputs';
    return this.#http
      .get<Travel[]>(outputsUrl)
      .pipe(
        tap((response) => {
          console.log('Historial de viajes:', response);
        }),
        map((response) => {
          if (!Array.isArray(response)) {
            console.warn('La respuesta no es un array:', response);
            return [];
          }
          return response;
        }),
        catchError((err) => {
          console.error('Error al cargar el historial:', err);
          return of([])
        })
      );
  }

  getActivities$(id: string): Observable<{ id: string; post: Travel['post'] }> {
    const url = `${this.#baseUrl}/${id}`;
    return this.#http
      .get<{ id: string; post: Travel['post'] }>(url)
      .pipe(
        tap((response) => {
          console.log('API URL:', url);
          console.log('API full response:', response);
        }),
        map((response) => response)
      );
  }
}
