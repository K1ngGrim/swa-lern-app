
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(TranslateModule.forRoot()),
    ...provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
    {
      provide: 'APP_STARTUP_TRANSLATE',
      useFactory: (translate: TranslateService) => {
        const supported = ['en', 'de'];
        translate.addLangs(supported);
        const browser = translate.getBrowserLang() || 'en';
        const chosen = supported.includes(browser) ? browser : 'en';
        translate.setFallbackLang('en');
        return firstValueFrom(translate.use(chosen));
      },
      deps: [TranslateService],
      multi: true,
    },
  ],
};
