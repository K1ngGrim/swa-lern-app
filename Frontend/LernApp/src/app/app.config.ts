import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(HttpClientModule, TranslateModule.forRoot()),
    // Register the HTTP loader to load translations from assets/i18n/*.json
    ...provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
    // Configure the TranslateService at app startup
    {
      provide: APP_INITIALIZER,
      useFactory: (translate: TranslateService) => {
        return () => {
          const supported = ['en', 'de'];
          translate.addLangs(supported);
          const browser = translate.getBrowserLang() || 'en';
          const chosen = supported.includes(browser) ? browser : 'en';
          translate.setFallbackLang('en');
          return translate.use(chosen).toPromise();
        };
      },
      deps: [TranslateService],
      multi: true,
    },
  ],
};
