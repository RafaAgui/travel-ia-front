import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Travels } from './travels/travels';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Travels],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('mi-proyecto-angular');
}
