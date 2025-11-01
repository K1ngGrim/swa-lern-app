import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { AuthService } from "../auth.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-create-new-deck-page",
  imports: [TranslateModule],
  templateUrl: "./create-new-deck-page.html",
  styleUrl: "./create-new-deck-page.scss",
})
export class CreateNewDeckPage {
  constructor(
    private router: Router,
    private location: Location,
    private auth: AuthService
  ) {}

  goBack() {
    this.location.back();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
