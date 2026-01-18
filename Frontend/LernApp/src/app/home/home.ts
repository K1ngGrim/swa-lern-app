import {Component, inject, OnInit, signal} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule, Router } from "@angular/router";
import { AuthService } from "../auth.service";
import {ContributionHeatmapComponent} from "../learning-heatmap/learning-heatmap";
import {StatisticModel, StatisticService} from "api";
import {lastValueFrom} from "rxjs";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    TranslateModule,
    RouterModule,
    ContributionHeatmapComponent,
  ],
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
})
export class Home implements OnInit {

  public readonly statisticData = signal<StatisticModel[]>([]);

  private authService = inject(AuthService);
  private router = inject(Router);
  private statisticService = inject(StatisticService);

  async ngOnInit() {

    let data = await lastValueFrom(this.statisticService.apiStatisticGet({}));
    console.log(data);


    if (this.statisticData().length === 0) {
      let data = await lastValueFrom(this.statisticService.apiStatisticGet({}));

      this.statisticData.set(data.data??[]);


    }
  }

  async logout() {
    this.authService.logout();
    await this.router.navigate(['/login']);
  }
}
