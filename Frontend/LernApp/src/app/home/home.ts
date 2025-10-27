import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";

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
export class Home {}
