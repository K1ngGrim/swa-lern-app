import { Routes } from "@angular/router";
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "login", loadComponent: () => import("./login-page/login-page").then(m => m.LoginPage) },
  { path: "home", loadComponent: () => import("./home/home").then(m => m.Home), canActivate: [AuthGuard] },
  { path: "new-deck", loadComponent: () => import("./create-new-deck-page/create-new-deck-page").then(m => m.CreateNewDeckPage), canActivate: [AuthGuard] },
  { path: "decks", loadComponent: () => import("./deck-page/deck-page").then(m => m.DeckPage), canActivate: [AuthGuard] },
  { path: "deck/:id/edit", loadComponent: () => import("./deck-edit-page/deck-edit-page").then(m => m.DeckEditPage), canActivate: [AuthGuard] },
  { path: "learn/:id", loadComponent: () => import("./deck-learn-page/deck-learn-page").then(m => m.DeckLearnPage), canActivate: [AuthGuard] },
  { path: "statistics", loadComponent: () => import("./statistics-page/statistics-page").then(m => m.StatisticsPage), canActivate: [AuthGuard] },
];
