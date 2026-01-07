import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-deck-detail-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './deck-detail-page.html',
  styleUrl: './deck-detail-page.scss',
})
export class DeckDetailPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private auth = inject(AuthService);

  deckId = this.route.snapshot.paramMap.get('id');

  goBack() {
    this.router.navigate(['/decks']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
