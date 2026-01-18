import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {DeckService, DeckResponseModel, CardService, StatisticService} from 'api';
import { Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../auth.service';
import { TranslateModule } from '@ngx-translate/core';
import {lastValueFrom} from "rxjs";
import {Exception} from "sass";
import {ContributionHeatmapComponent} from "../learning-heatmap/learning-heatmap";

@Component({
  selector: 'app-deck-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatTooltipModule, ContributionHeatmapComponent],
  templateUrl: './deck-page.html',
  styleUrl: './deck-page.scss',
})
export class DeckPage implements OnInit {
  private deckService = inject(DeckService);
  private router = inject(Router);
  private statsService = inject(StatisticService);

  decks = signal<DeckResponseModel[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  heatmapData = computed(async () => {

    const statsMap = new Map();

    for (const deck of this.decks()) {
      const deckId = deck.deckId;

      const data = (await lastValueFrom(this.statsService.apiStatisticGet(
        {
          deckId,
        }
      ))).data??[];

      statsMap.set(deckId, data);
    }


    return statsMap;
  });

  constructor() {

  }

  async ngOnInit() {
    await this.loadDecks();
  }

  private async loadDecks() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      this.decks.set(
        (await lastValueFrom(this.deckService.apiDecksGet())).data
      )
    }catch (err) {
      this.error.set('DECK_LIST.ERROR_LOADING');
      console.error('Error loading decks:', err);
    }finally {
      this.isLoading.set(false);
    }
  }

  async startLearning(deckId: string | undefined) {
    if (deckId) {
      await this.router.navigate(['/learn', deckId]);
    }
  }

  async editDeck(deckId: string | undefined) {
    if (deckId) {
      await this.router.navigate(['/deck', deckId, 'edit']);
    }
  }

  async createNewDeck() {
    await this.router.navigate(['/new-deck']);
  }

  getLastLearned(dateString: string |null): string | null {

    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null;
      }

      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });


    } catch (err) {
      console.error('Error reading last learned timestamp', err);
      return null;
    }
  }
}
