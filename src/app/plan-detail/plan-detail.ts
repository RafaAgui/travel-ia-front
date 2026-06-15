import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { TravelsRsponseService } from '../services/travels-response.service';
import { Travel } from '../domain/response.type';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-detail.html',
  styleUrls: ['./plan-detail.scss'],
})
export class PlanDetailComponent implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #service = inject(TravelsRsponseService);
  #sanitizer = inject(DomSanitizer);

  plan = signal<Travel | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  sanitizedContent = signal<SafeHtml | null>(null);

  ngOnInit() {
    this.loadPlan();
  }

  loadPlan() {
    this.loading.set(true);
    this.error.set(null);

    this.#route.params.subscribe((params) => {
      const id = params['id'];

      if (!id) {
        this.error.set('ID no proporcionado');
        this.loading.set(false);
        return;
      }

      this.#service.getActivities$(id).subscribe({
        next: (response: any) => {
          if (!response) {
            this.error.set('Plan no encontrado');
          } else {
            this.plan.set(response);
            if (response.post) {
              this.sanitizedContent.set(
                this.#sanitizer.bypassSecurityTrustHtml(marked(response.post) as string)
              );
            }
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar el plan:', err);
          this.error.set('Error al cargar el plan. Por favor, intenta más tarde.');
          this.loading.set(false);
        },
      });
    });
  }

  goBack() {
    this.#router.navigate(['/']);
  }

  copyToClipboard() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Enlace copiado al portapapeles');
    }).catch((err) => {
      console.error('Error al copiar:', err);
      alert('Error al copiar el enlace');
    });
  }
}
