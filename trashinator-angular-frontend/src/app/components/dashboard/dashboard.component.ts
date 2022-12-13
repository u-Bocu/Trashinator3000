import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from "rxjs";
import { Card } from "../../models/card.model";
import { ScansService } from "../../services/scans.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  nbColonnes?: number = 5;
  cards?: Observable<Array<Card>>;
  organic: number = 0;
  paper: number = 0;
  plastic: number = 0;
  glassMetal: number = 0;
  other: number = 0;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private scansService: ScansService
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
            { title: '', cols: 1, rows: 2, content: 'nbScansChartComponent' }
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
          { title: '', cols: 5, rows: 2, content: 'nbScansChartComponent' }
        ];
      })
    );

    this.scansService.getNbScansByPrediction().subscribe(response => {
      response.data.rows.forEach((prediction: any[]) => {
        switch (prediction[0]) {
          case 'organic':
            this.organic = prediction[1]; break;
          case 'paper':
            this.paper = prediction[1]; break;
          case 'plastic':
            this.plastic = prediction[1]; break;
          case 'g&m':
            this.glassMetal = prediction[1]; break;
          case 'other':
            this.other = prediction[1]; break;
        }
      });
    });
  }
}
