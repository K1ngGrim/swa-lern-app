import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule, Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    TranslateModule,
    RouterModule,
  ],
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
})
export class Home {
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
