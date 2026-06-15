import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Travels } from './travels/travels';
import { History } from './history/history';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Travels, History],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('mi-proyecto-angular');
}
