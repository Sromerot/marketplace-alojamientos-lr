import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeEsCo from '@angular/common/locales/es-CO';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

/**
 * Registra los datos del idioma es-CO (formato de números y fechas colombiano).
 * Analogía Java: `Locale.of("es", "CO")`; sin esto, CurrencyPipe usaría en-US.
 */
registerLocaleData(localeEsCo);

/**
 * Configuración global de la app (los "beans" del contenedor de inyección).
 * Analogía Java: la clase @Configuration de Spring.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Habilita HttpClient para poder inyectarlo en los servicios.
    provideHttpClient(),
    // Locale por defecto de pipes (moneda, fechas): es-CO.
    { provide: LOCALE_ID, useValue: 'es-CO' },
  ],
};
