import { Injectable, inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Travel } from '../domain/response.type';

@Injectable({
  providedIn: 'root',
})

export class TravelsRsponseService {
  #baseUrl = 'http://localhost:8000/plan-viaje';

  /** The HTTP client to make requests to the API */
  #http = inject(HttpClient);


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
