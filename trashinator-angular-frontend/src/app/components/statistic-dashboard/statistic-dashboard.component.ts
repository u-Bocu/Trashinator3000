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
  organic: number = 0;
  paper: number = 0;
  plastic: number = 0;
  glassMetal: number = 0;
  other: number = 0;

  data: any;
  selectedCountry: string = "France";
  countries: string[] = [];

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
            { title: 'Organique', cols: 1, rows: 1 },
            { title: 'Papier', cols: 1, rows: 1 },
            { title: 'Plastique', cols: 1, rows: 1 },
            { title: 'Verre/Métal', cols: 1, rows: 1 },
            { title: 'Autres', cols: 1, rows: 1 },
            { title: '', cols: 1, rows: 2, content: '' }
          ];
        }

        // Taille standard
        this.nbColonnes = 5;
        return [
          { title: 'Organique', cols: 1, rows: 1 },
          { title: 'Papier', cols: 1, rows: 1 },
          { title: 'Plastique', cols: 1, rows: 1 },
          { title: 'Verre/Métal', cols: 1, rows: 1 },
          { title: 'Autres', cols: 1, rows: 1 },
          { title: '', cols: 5, rows: 2, content: '' }
        ];
      })
    );

    this.getWorldData();
    this.worldBankService.getListOfCountry().subscribe(response => {
      this.countries = response.data;
    });
  }

  public getWorldData(): void {
    this.worldBankService.getWorldStatistics(this.selectedCountry).subscribe(response => {
      this.data = response.data;

      this.organic = this.data.organicWaste;
      this.paper = this.data.paperWaste;
      this.plastic = this.data.plasticWaste;
      this.glassMetal = this.data.glassWaste + this.data.metalWaste;
      this.other = this.data.otherWaste;
    });
  }
}
