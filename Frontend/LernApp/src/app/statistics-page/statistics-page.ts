import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthService } from '../auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { DeckService, DeckResponseModel, CardService } from 'api';

interface DeckStats {
  deck: DeckResponseModel;
  cardCount: number;
  lastLearned: string | null;
}

@Component({
  selector: 'app-statistics-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './statistics-page.html',
  styleUrl: './statistics-page.scss',
})
export class StatisticsPage {
  private router = inject(Router);
  private auth = inject(AuthService);
  private deckService = inject(DeckService);
  private cardService = inject(CardService);
  private document = inject(DOCUMENT);

  decks = signal<DeckResponseModel[]>([]);
  deckStats = signal<DeckStats[]>([]);
  totalCards = signal(0);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.loadStatistics();
  }

  private loadStatistics() {
    this.isLoading.set(true);
    this.error.set(null);

    this.deckService.apiDecksGet().subscribe({
      next: (response) => {
        const decks = response.data || [];
        this.decks.set(decks);
        this.loadDeckStats(decks);
      },
      error: (err) => {
        console.error('Error loading decks:', err);
        this.error.set('STATISTICS.ERROR_LOADING');
        this.isLoading.set(false);
      },
    });
  }

  private loadDeckStats(decks: DeckResponseModel[]) {
    let completed = 0;
    let totalCards = 0;
    const stats: DeckStats[] = [];

    if (!decks.length) {
      this.deckStats.set([]);
      this.totalCards.set(0);
      this.isLoading.set(false);
      return;
    }

    decks.forEach((deck) => {
      const deckId = deck.deckId;
      if (!deckId) {
        completed++;
        return;
      }

      this.cardService.apiCardsDeckIdGet({ deckId }).subscribe({
        next: (cards) => {
          totalCards += cards.length;
          const lastLearned = this.getLastLearned(deckId);
          stats.push({
            deck,
            cardCount: cards.length,
            lastLearned,
          });
          completed++;

          if (completed === decks.length) {
            this.deckStats.set(stats.sort((a, b) => {
              const aTime = a.lastLearned ? new Date(a.lastLearned).getTime() : 0;
              const bTime = b.lastLearned ? new Date(b.lastLearned).getTime() : 0;
              return bTime - aTime;
            }));
            this.totalCards.set(totalCards);
            this.isLoading.set(false);
          }
        },
        error: (err) => {
          console.error('Error loading cards for deck', deckId, err);
          completed++;
          if (completed === decks.length) {
            this.deckStats.set(stats);
            this.totalCards.set(totalCards);
            this.isLoading.set(false);
          }
        },
      });
    });
  }

  private getLastLearned(deckId: string): string | null {
    try {
      const key = `lernapp_lastLearned_${deckId}`;
      const stored = this.document.defaultView?.localStorage.getItem(key);
      return stored || null;
    } catch {
      return null;
    }
  }

  getDaysAgo(isoString: string | null): number | null {
    if (!isoString) return null;
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return null;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  getLastStudiedTranslationKey(isoString: string | null): string {
    const days = this.getDaysAgo(isoString);
    if (days === 0) {
      return 'STATISTICS.STUDIED_TODAY_LABEL';
    }
    return 'STATISTICS.LAST_STUDIED';
  }

  getStudiedToday(): number {
    const today = new Date().toDateString();
    return this.deckStats().filter((stat) => {
      if (!stat.lastLearned) return false;
      const date = new Date(stat.lastLearned).toDateString();
      return date === today;
    }).length;
  }

  getStudiedThisWeek(): number {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.deckStats().filter((stat) => {
      if (!stat.lastLearned) return false;
      const date = new Date(stat.lastLearned);
      return date >= weekAgo;
    }).length;
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
