import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { TravelsRsponseService } from '../services/travels-response.service'; // import del servicio (usa el nombre exacto que está en el archivo)

@Component({
  selector: 'app-travels',
  imports: [],
  templateUrl: './travels.html',
  styleUrl: './travels.scss',
})
export class Travels {
// Signals para los campos del formulario
  lugar = signal('rumania');
  transporte = signal('publico');
  dias = signal(1);

    // Signal para la respuesta
  respuesta = signal('');
  respuestaHtml = signal<SafeHtml | string>('');

  constructor(
    private travelsRsponseService: TravelsRsponseService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) {}


  // Computed para agrupar los datos
  // datos = computed(() => ({
  //   lugar: this.lugar(),
  //   transporte: this.transporte(),
  //   dias: this.dias()
  // }));


  private renderMarkdown(markdown: string): SafeHtml {
    const html = marked.parse(markdown || '') as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  enviarFormulario(event?: Event) {
    event?.preventDefault();
    const payload = { lugar: this.lugar(), transporte: this.transporte(), dias: this.dias() };

    this.http.post<{ id: string }>('http://localhost:8000/plan-viaje', payload)
      .subscribe({
        next: (res) => {
          console.log('Respuesta API', res);

          const travelId = res.id;
          if (!travelId) {
            console.error('No se recibió travelId en la respuesta.');
            return;
          }

          this.travelsRsponseService.getActivities$(travelId)
            .subscribe({
              next: (post) => {
                const rawText = post.post ?? '';
                this.respuesta.set(rawText);
                this.respuestaHtml.set(this.renderMarkdown(rawText));
                console.log('Llegó post:', post);
              },
              error: (err) => {
                console.error('Error en la petición:', err);
              },
              complete: () => console.log('Petición completada')
            });
        },
        error: (err) => console.error('Error API', err)
      });
  }
}
