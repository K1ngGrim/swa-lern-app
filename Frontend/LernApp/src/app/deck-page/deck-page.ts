import { Component, inject, signal } from '@angular/core';
import { DeckService, DeckResponseModel, CardService } from 'api';
import { Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-deck-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatTooltipModule],
  templateUrl: './deck-page.html',
  styleUrl: './deck-page.scss',
})
export class DeckPage {
  private deckService = inject(DeckService);
  private cardService = inject(CardService);
  private router = inject(Router);
  private location = inject(Location);
  private auth = inject(AuthService);

  decks = signal<DeckResponseModel[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  cardCounts = signal<Record<string, number>>({});

  constructor() {
    this.loadDecks();
  }

  private loadDecks() {
    this.isLoading.set(true);
    this.error.set(null);

    this.deckService.apiDecksGet().subscribe({
      next: (response) => {
        const decks = response.data || [];
        this.decks.set(decks);
        this.loadCardCountsForDecks(decks);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading decks:', err);
        this.error.set('DECK_LIST.ERROR_LOADING');
        this.isLoading.set(false);
      },
    });
  }

  private loadCardCountsForDecks(decks: DeckResponseModel[]) {
    decks.forEach((deck) => {
      const deckId = deck.deckId;
      if (!deckId) {
        return;
      }

      this.cardService.apiCardsDeckIdGet({ deckId }).subscribe({
        next: (cards) => {
          const current = this.cardCounts();
          this.cardCounts.set({ ...current, [deckId]: cards.length });
        },
        error: (err) => {
          console.error('Error loading card count for deck', deckId, err);
        },
      });
    });
  }

  startLearning(deckId: string | undefined) {
    if (deckId) {
      this.router.navigate(['/learn', deckId]);
    }
  }

  editDeck(deckId: string | undefined) {
    if (deckId) {
      this.router.navigate(['/deck', deckId, 'edit']);
    }
  }

  createNewDeck() {
    this.router.navigate(['/new-deck']);
  }

  getCardCount(deckId: string | undefined): number {
    if (!deckId) {
      return 0;
    }
    const map = this.cardCounts();
    return Object.prototype.hasOwnProperty.call(map, deckId) ? map[deckId] : 0;
  }

  getLastLearned(deckId: string | undefined): string | null {
    if (!deckId) {
      return null;
    }

    try {
      const key = `lernapp_lastLearned_${deckId}`;
      const stored = localStorage.getItem(key);
      if (!stored) {
        return null;
      }

      const date = new Date(stored);
      if (isNaN(date.getTime())) {
        return null;
      }

      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (err) {
      console.error('Error reading last learned timestamp for deck', deckId, err);
      return null;
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
