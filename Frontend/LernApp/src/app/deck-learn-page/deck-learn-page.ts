import {Component, HostListener, inject, signal} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../auth.service';
import { ProgressService, LearningSessionResponse, CardResponseModel, DeckService, DeckDetailResponseModel } from 'api';

@Component({
  selector: 'app-deck-learn-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './deck-learn-page.html',
  styleUrl: './deck-learn-page.scss',
})
export class DeckLearnPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private auth = inject(AuthService);
  private progressService = inject(ProgressService);
  private deckService = inject(DeckService);

  deckId = this.route.snapshot.paramMap.get('id');

  session = signal<LearningSessionResponse | null>(null);
  currentIndex = signal(0);
  showBack = signal(false);
  isLoading = signal(false);
  error = signal<string | null>(null);
  isSubmittingRating = signal(false);
  deck = signal<DeckDetailResponseModel | null>(null);
  sessionCompleted = signal(false);

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.keyCode == KEY_CODE.SPACE_BAR) {
      if (this.showBack()) {
        this.rateCard(2);
        return;
      }else {
        this.onCardClick();
        return;
      }
    }

    if (this.showBack()) {
      if (event.keyCode == KEY_CODE.NUM_1) {
        this.rateCard(0);
      }else if (event.keyCode == KEY_CODE.NUM_2) {
        this.rateCard(1);
      }else if (event.keyCode == KEY_CODE.NUM_3) {
        this.rateCard(2);
      }else if (event.keyCode == KEY_CODE.NUM_4) {
        this.rateCard(3);
      }
    }
  }

  constructor() {
    if (this.deckId) {
      this.loadDeck();
      this.loadSession();
    }
  }

  goBack() {
    this.router.navigate(['/decks']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  get currentCard(): CardResponseModel | null {
    const cards = this.session()?.cards || [];
    const index = this.currentIndex();
    if (!cards.length || index < 0 || index >= cards.length) {
      return null;
    }
    return cards[index];
  }

  private loadSession() {
    if (!this.deckId) {
      return;
    }

    this.isLoading.set(true);
    this.sessionCompleted.set(false);
    this.error.set(null);

    this.progressService.apiLearningSessionDeckIdGet({ deckId: this.deckId }).subscribe({
      next: (response) => {
        this.session.set(response);
        this.currentIndex.set(0);
        this.showBack.set(false);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading learning session:', err);
        this.error.set('DECK_LEARN.ERROR_LOADING');
        this.isLoading.set(false);
      },
    });
  }

  private loadDeck() {
    if (!this.deckId) {
      return;
    }

    this.deckService.apiDecksDeckIdGet({ deckId: this.deckId }).subscribe({
      next: (response) => {
        this.deck.set(response);
      },
      error: (err) => {
        console.error('Error loading deck details for learn view:', err);
      },
    });
  }

  onCardClick() {
    if (!this.currentCard || this.isSubmittingRating()) {
      return;
    }
    this.showBack.update((prev) => !prev);
  }



  rateCard(rating: number) {
    const card = this.currentCard;
    if (!card || !card.cardId || this.isSubmittingRating()) {
      return;
    }

    this.isSubmittingRating.set(true);

    this.progressService
      .apiLearningUpdateCardIdPost({ cardId: card.cardId, rating })
      .subscribe({
        next: () => {
          this.isSubmittingRating.set(false);
          this.showBack.set(false);
          this.updateLastLearned();
          this.moveToNextCard();
        },
        error: (err) => {
          console.error('Error updating card rating:', err);
          this.isSubmittingRating.set(false);
          this.showBack.set(false);
          this.updateLastLearned();
          this.moveToNextCard();
        },
      });
  }

  private moveToNextCard() {
    const cards = this.session()?.cards || [];
    if (!cards.length) {
      this.sessionCompleted.set(true);
      return;
    }

    const nextIndex = this.currentIndex() + 1;
    if (nextIndex < cards.length) {
      this.currentIndex.set(nextIndex);
      this.showBack.set(false);
    } else {
      this.sessionCompleted.set(true);
      this.showBack.set(false);
    }
  }

  restartSession() {
    if (!this.deckId) {
      return;
    }
    this.currentIndex.set(0);
    this.showBack.set(false);
    this.sessionCompleted.set(false);
    this.loadSession();
  }

  goToDeck() {
    this.router.navigate(['/decks']);
  }

  private updateLastLearned() {
    if (!this.deckId) {
      return;
    }

    try {
      const key = `lernapp_lastLearned_${this.deckId}`;
      const now = new Date().toISOString();
      localStorage.setItem(key, now);
    } catch (err) {
      console.error('Error storing last learned timestamp:', err);
    }
  }
}

export enum KEY_CODE {
  NUM_1 = 49,
  NUM_2 = 50,
  NUM_3 = 51,
  NUM_4 = 52,
  SPACE_BAR= 32
}
