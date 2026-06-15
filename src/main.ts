import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';


bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig as any)?.providers ?? [],
    provideHttpClient(), // <-- añadir aquí
  ],
})
  .catch((err) => console.error(err));
