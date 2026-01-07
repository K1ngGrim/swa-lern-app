import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardService, CardResponseModel, CreateRequestOfCardCreateModel, DeckService, DeckDetailResponseModel } from 'api';

@Component({
  selector: 'app-deck-edit-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './deck-edit-page.html',
  styleUrl: './deck-edit-page.scss',
})
export class DeckEditPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private cardService = inject(CardService);
  private deckService = inject(DeckService);

  deckId = this.route.snapshot.paramMap.get('id');
  deck = signal<DeckDetailResponseModel | null>(null);

  addCardForm: FormGroup = this.fb.group({
    front: ['', [Validators.required, Validators.minLength(1)]],
    back: ['', [Validators.required, Validators.minLength(1)]],
  });

  cards = signal<CardResponseModel[]>([]);
  isLoadingCards = signal(false);
  cardError = signal<string | null>(null);
  isAddingCard = signal(false);

  constructor() {
    if (this.deckId) {
      this.loadDeck();
      this.loadCards();
    }
  }

  goBack() {
    this.router.navigate(['/decks']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
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
        console.error('Error loading deck details:', err);
      },
    });
  }

  private loadCards() {
    if (!this.deckId) {
      return;
    }

    this.isLoadingCards.set(true);
    this.cardError.set(null);

    this.cardService.apiCardsDeckIdGet({ deckId: this.deckId }).subscribe({
      next: (response) => {
        this.cards.set(response || []);
        this.isLoadingCards.set(false);
      },
      error: (err) => {
        console.error('Error loading cards:', err);
        this.cardError.set('DECK_EDIT.CARDS_ERROR');
        this.isLoadingCards.set(false);
      },
    });
  }

  onAddCard() {
    if (!this.deckId || this.addCardForm.invalid) {
      return;
    }

    this.isAddingCard.set(true);
    this.cardError.set(null);

    const formValue = this.addCardForm.value;

    const request: CreateRequestOfCardCreateModel = {
      entityId: null,
      data: {
        title: (formValue.front || '').toString(),
        front: (formValue.front || '').toString(),
        back: (formValue.back || '').toString(),
        deckId: this.deckId,
      },
    };

    this.cardService.apiCardsPost({ createRequestOfCardCreateModel: request }).subscribe({
      next: () => {
        this.addCardForm.reset();
        this.isAddingCard.set(false);
        this.loadCards();
      },
      error: (err) => {
        console.error('Error adding card:', err);
        this.cardError.set('DECK_EDIT.CARD_ADD_ERROR');
        this.isAddingCard.set(false);
      },
    });
  }
}
