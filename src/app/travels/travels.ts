import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { Router } from '@angular/router';
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
  travelId = signal<string | null>(null);
  shareMessage = signal<string | null>(null);

  #router = inject(Router);

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

          const idRecibido = res.id;
          if (!idRecibido) {
            console.error('No se recibió travelId en la respuesta.');
            return;
          }

          this.travelId.set(idRecibido);
          this.shareMessage.set(null);

          this.travelsRsponseService.getActivities$(idRecibido)
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

  copyShareLink() {
    const id = this.travelId();
    if (!id) {
      this.shareMessage.set('Error: No hay plan para compartir');
      return;
    }

    const shareUrl = `${window.location.origin}/plan-viaje/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      this.shareMessage.set('✓ Enlace copiado al portapapeles');
      setTimeout(() => this.shareMessage.set(null), 3000);
    }).catch((err) => {
      console.error('Error al copiar:', err);
      this.shareMessage.set('Error al copiar el enlace');
    });
  }

  navigateToPlan() {
    const id = this.travelId();
    if (id) {
      this.#router.navigate(['/plan-viaje', id]);
    }
  }
}
