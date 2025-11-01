import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('LernApp');

  constructor(private translate: TranslateService, public auth: AuthService, private router: Router) {
    const supported = ['en', 'de'];
    translate.addLangs(supported);
    const browser = translate.getBrowserLang() || 'en';
    const chosen = supported.includes(browser) ? browser : 'en';
    translate.setFallbackLang('en');
    translate.use(chosen);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
