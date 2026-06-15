import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { TravelsRsponseService } from '../services/travels-response.service';
import { Travel } from '../domain/response.type';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History implements OnInit {
  private travelsService = inject(TravelsRsponseService);
  private sanitizer = inject(DomSanitizer);

  travels = signal<Travel[]>([]);
  selectedTravel = signal<Travel | null>(null);
  selectedHtml = signal<SafeHtml | string>('');
  loading = signal(true);
  error = signal(false);
  isOpen = signal(false);

  ngOnInit(): void {
    this.loadHistory();
  }

  togglePanel(): void {
    this.isOpen.update(v => !v);
    if (this.isOpen() && this.travels().length === 0 && !this.loading()) {
      this.loadHistory();
    }
  }

  loadHistory(): void {
    this.loading.set(true);
    this.error.set(false);
    this.travelsService.getAllTravels$().subscribe({
      next: (data) => {
        this.travels.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  selectTravel(travel: Travel): void {
    this.selectedTravel.set(travel);
    const markdown = travel.post ?? '';
    const html = marked.parse(markdown) as string;
    this.selectedHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
  }

  clearSelection(): void {
    this.selectedTravel.set(null);
    this.selectedHtml.set('');
  }
}
