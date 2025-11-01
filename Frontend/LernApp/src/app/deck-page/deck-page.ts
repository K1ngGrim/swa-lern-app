import { Component, inject, OnInit } from '@angular/core';
import { DeckService, ListResponseOfDeckResponseModel } from 'api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-deck-page',
  imports: [],
  templateUrl: './deck-page.html',
  styleUrl: './deck-page.scss',
})
export class DeckPage implements OnInit {
  decks = inject(DeckService);

  decks$: Observable<ListResponseOfDeckResponseModel>;
  constructor() {
    this.decks$ = this.decks.apiDecksGet();
  }

  ngOnInit(): void {
    this.decks$.subscribe((decks)=>console.log(decks))
  }
}
