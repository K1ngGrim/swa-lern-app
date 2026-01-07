import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule } from "@ngx-translate/core";
import { of, throwError } from "rxjs";

import { CreateNewDeckPage } from "./create-new-deck-page";
import { AuthService } from "../auth.service";
import { DeckService } from "../../../projects/api/src/lib/api/deck.service";

describe("CreateNewDeckPage", () => {
  let component: CreateNewDeckPage;
  let fixture: ComponentFixture<CreateNewDeckPage>;
  let mockDeckService: jasmine.SpyObj<DeckService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    mockDeckService = jasmine.createSpyObj("DeckService", ["apiDecksPost"]);
    mockAuthService = jasmine.createSpyObj("AuthService", ["logout"]);
    mockRouter = jasmine.createSpyObj("Router", ["navigate"]);
    mockLocation = jasmine.createSpyObj("Location", ["back"]);

    await TestBed.configureTestingModule({
      imports: [
        CreateNewDeckPage,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: DeckService, useValue: mockDeckService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewDeckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form with empty name and description", () => {
    expect(component.form.get("name")?.value).toBe("");
    expect(component.form.get("description")?.value).toBe("");
  });

  it("should mark form as invalid when name is empty", () => {
    expect(component.form.invalid).toBe(true);
  });

  it("should mark form as valid when name is filled", () => {
    component.form.patchValue({ name: "My Deck" });
    expect(component.form.valid).toBe(true);
  });

  it("should submit form and create deck on success", (done) => {
    mockDeckService.apiDecksPost.and.returnValue(of({}));

    component.form.patchValue({ name: "Test Deck", description: "Test Description" });
    component.onSubmit();

    expect(mockDeckService.apiDecksPost).toHaveBeenCalled();
    expect(component.successMessage()).toBe("DECK_CREATE.SUCCESS_MESSAGE");

    setTimeout(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(["/home"]);
      done();
    }, 1600);
  });

  it("should handle error when creating deck fails", () => {
    mockDeckService.apiDecksPost.and.returnValue(
      throwError(() => new Error("API Error"))
    );

    component.form.patchValue({ name: "Test Deck" });
    component.onSubmit();

    expect(component.errorMessage()).toBe("DECK_CREATE.ERROR_MESSAGE");
    expect(component.isSubmitting()).toBe(false);
  });

  it("should not submit when form is invalid", () => {
    component.onSubmit();

    expect(mockDeckService.apiDecksPost).not.toHaveBeenCalled();
  });

  it("should call location.back() on goBack", () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it("should logout and navigate to login on logout", () => {
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"]);
  });
});
