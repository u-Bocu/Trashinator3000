import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Card } from "../../models/card.model";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map } from "rxjs/operators";
import { WorldBankService } from "../../services/world-bank.service";

@Component({
  selector: 'app-statistic-dashboard',
  templateUrl: './statistic-dashboard.component.html',
  styleUrls: ['./statistic-dashboard.component.css']
})
export class StatisticDashboardComponent implements OnInit {
  nbColonnes?: number = 5;
  cards?: Observable<Array<Card>>;
  metric1: number = 0;
  metric2: number = 0;
  metric3: number = 0;
  metric4: number = 0;
  metric5: number = 0;

  filePath: string = 'src/assets/waste_dataset_world_bank/country_level_data_0.csv';
  data: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private worldBankService: WorldBankService
  ) {}

  ngOnInit() {
    /* Si l'écran est petit, passes les 'cards' de la taille standard vers une colonne */
    this.cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        if (matches) {
          // Taille sur colonne
          this.nbColonnes = 1;
          return [
            { title: 'Metric 1', cols: 1, rows: 1 },
            { title: 'Metric 2', cols: 1, rows: 1 },
            { title: 'Metric 3', cols: 1, rows: 1 },
            { title: 'Metric 4', cols: 1, rows: 1 },
            { title: 'Metric 5', cols: 1, rows: 1 },
            { title: '', cols: 1, rows: 2, content: '' }
          ];
        }

        // Taille standard
        this.nbColonnes = 5;
        return [
          { title: 'Metric 1', cols: 1, rows: 1 },
          { title: 'Metric 2', cols: 1, rows: 1 },
          { title: 'Metric 3', cols: 1, rows: 1 },
          { title: 'Metric 4', cols: 1, rows: 1 },
          { title: 'Metric 5', cols: 1, rows: 1 },
          { title: '', cols: 5, rows: 2, content: '' }
        ];
      })
    );

    this.worldBankService.getWorldStatistics(this.filePath).subscribe((response: any) => {
      this.data = response;
    });
  }
}
