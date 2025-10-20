import { Routes } from '@angular/router';
import { Home } from './home/home';
import { CreateNewDeckPage } from './create-new-deck-page/create-new-deck-page';
import { DeckPage } from './deck-page/deck-page';
import { StatisticsPage } from './statistics-page/statistics-page';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: Home },
	{ path: 'new-deck', component: CreateNewDeckPage },
	{ path: 'decks', component: DeckPage },
	{ path: 'statistics', component: StatisticsPage }
];
