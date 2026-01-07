import { Component, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AuthService } from "../auth.service";
import { TranslateModule } from "@ngx-translate/core";
import { DeckService } from "../../../projects/api/src/lib/api/deck.service";
import { DeckCreateModel, CreateRequestOfDeckCreateModel } from "../../../projects/api/src/lib/model/models";

@Component({
  selector: "app-create-new-deck-page",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./create-new-deck-page.html",
  styleUrl: "./create-new-deck-page.scss",
})
export class CreateNewDeckPage {
  form!: FormGroup;
  isSubmitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private auth: AuthService,
    private deckService: DeckService
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      description: [''],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formValue = this.form.value;
    const deckCreateModel: DeckCreateModel = {
      name: formValue.name.trim(),
      description: formValue.description?.trim() || undefined,
    };

    const request: CreateRequestOfDeckCreateModel = {
      entityId: null,
      data: deckCreateModel,
    };

    this.deckService.apiDecksPost({ createRequestOfDeckCreateModel: request }).subscribe({
      next: () => {
        this.successMessage.set('DECK_CREATE.SUCCESS_MESSAGE');
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error creating deck:', err);
        this.errorMessage.set('DECK_CREATE.ERROR_MESSAGE');
        this.isSubmitting.set(false);
      },
    });
  }

  goBack() {
    this.location.back();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
