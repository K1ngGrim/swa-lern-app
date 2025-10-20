import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewDeckPage } from './create-new-deck-page';

describe('CreateNewDeckPage', () => {
  let component: CreateNewDeckPage;
  let fixture: ComponentFixture<CreateNewDeckPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewDeckPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewDeckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
