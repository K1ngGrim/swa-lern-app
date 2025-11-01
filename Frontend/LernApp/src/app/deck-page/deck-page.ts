import { Component, inject, OnInit } from '@angular/core';
import { DeckService, ListResponseOfDeckResponseModel } from 'api';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-deck-page',
  imports: [TranslateModule],
  templateUrl: './deck-page.html',
  styleUrl: './deck-page.scss',
})
export class DeckPage implements OnInit {
  decks = inject(DeckService);
  private router = inject(Router);
  private location = inject(Location);
  private auth = inject(AuthService);

  decks$: Observable<ListResponseOfDeckResponseModel>;
  constructor() {
    this.decks$ = this.decks.apiDecksGet();
  }

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
