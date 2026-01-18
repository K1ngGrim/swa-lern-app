import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('LernApp');
  readonly languages = ['en', 'de'];
  currentLang = signal<string>('de');

  constructor(
    private translate: TranslateService,
    public auth: AuthService,
    private router: Router
  ) {
    const supported = this.languages;
    translate.addLangs(supported);

    let initial = 'de';
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem('lernapp_lang');
        if (stored && supported.includes(stored)) {
          initial = stored;
        } else {
          const browser = translate.getBrowserLang() || 'en';
          initial = supported.includes(browser) ? browser : 'en';
        }
      }
    } catch {
      const browser = translate.getBrowserLang() || 'en';
      initial = supported.includes(browser) ? browser : 'en';
    }

    translate.setFallbackLang('en');
    translate.use(initial);
    this.currentLang.set(initial);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  onLanguageChange(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    const lang = target?.value;
    if (!lang || !this.languages.includes(lang)) {
      return;
    }
    this.translate.use(lang);
    this.currentLang.set(lang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('lernapp_lang', lang);
      }
    } catch {
      // ignore storage errors
    }
  }

  showHeader(): boolean {
    const url = this.router.url;
    // Hide header on login route or when no authenticated user
    if (!this.auth.currentUserValue || url.startsWith('/login')) {
      return false;
    }
    return true;
  }

  showBackButton(): boolean {
    const url = this.router.url;
    // No back button on home route
    return !url.startsWith('/home');
  }

  onBack() {
    const url = this.router.url;

    if (url.startsWith('/decks')) {
      this.router.navigate(['/home']);
      return;
    }

    if (url.startsWith('/deck/')) {
      this.router.navigate(['/decks']);
      return;
    }

    if (url.startsWith('/learn/')) {
      this.router.navigate(['/decks']);
      return;
    }

    if (url.startsWith('/new-deck')) {
      this.router.navigate(['/home']);
      return;
    }

    if (url.startsWith('/statistics')) {
      this.router.navigate(['/home']);
      return;
    }

    // Fallback
    this.router.navigate(['/home']);
  }
}
