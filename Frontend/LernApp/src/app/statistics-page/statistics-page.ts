import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { AuthService } from "../auth.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-statistics-page",
  imports: [TranslateModule],
  templateUrl: "./statistics-page.html",
  styleUrl: "./statistics-page.scss",
})
export class StatisticsPage {
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
