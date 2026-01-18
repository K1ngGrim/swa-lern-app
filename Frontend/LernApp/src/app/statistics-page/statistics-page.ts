import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthService } from '../auth.service';
import { TranslateModule } from '@ngx-translate/core';
import {DeckService, DeckResponseModel, CardService, StatisticService, StatisticSummaryResponseModel} from 'api';
import {lastValueFrom} from "rxjs";

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
export class StatisticsPage implements OnInit{
  private router = inject(Router);
  private auth = inject(AuthService);
  private deckService = inject(DeckService);
  private cardService = inject(CardService);
  private statsService = inject(StatisticService);


  private document = inject(DOCUMENT);

  statsSummary = signal<StatisticSummaryResponseModel | null>(null);
  decks = signal<DeckResponseModel[]>([]);
  totalCards = computed(() => {
    const decks = this.decks();

    return decks.reduce((acc, item) => acc + (item.cardCount??0), 0)

  });
  isLoading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    await this.loadStatistics();
  }

  private async loadStatistics() {
    this.isLoading.set(true);
    this.error.set(null);

    let decks = await lastValueFrom(this.deckService.apiDecksGet())
    this.decks.set(decks.data);

    const stats = await lastValueFrom(this.statsService.apiStatisticSummaryGet());
    this.statsSummary.set(stats);

    this.isLoading.set(false);
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
    return this.decks().filter((stat) => {
      if (!stat.lastLearned) return false;
      const date = new Date(stat.lastLearned).toDateString();
      return date === today;
    }).length;
  }

  getStudiedThisWeek(): number {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.decks().filter((stat) => {
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
