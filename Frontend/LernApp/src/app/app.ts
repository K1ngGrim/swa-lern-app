import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('LernApp');

  constructor(private translate: TranslateService) {
    const supported = ['en', 'de'];
    translate.addLangs(supported);
    const browser = translate.getBrowserLang() || 'en';
    const chosen = supported.includes(browser) ? browser : 'en';
    translate.setFallbackLang('en');
    translate.use(chosen);
  }
}
