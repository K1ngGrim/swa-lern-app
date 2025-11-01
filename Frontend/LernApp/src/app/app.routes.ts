import { Routes } from "@angular/router";
import { Home } from "./home/home";
import { CreateNewDeckPage } from "./create-new-deck-page/create-new-deck-page";
import { DeckPage } from "./deck-page/deck-page";
import { StatisticsPage } from "./statistics-page/statistics-page";
import { LoginPage } from "./login-page/login-page";
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "login", component: LoginPage },
  { path: "home", component: Home, canActivate: [AuthGuard] },
  { path: "new-deck", component: CreateNewDeckPage, canActivate: [AuthGuard] },
  { path: "decks", component: DeckPage, canActivate: [AuthGuard] },
  { path: "statistics", component: StatisticsPage, canActivate: [AuthGuard] },
];
