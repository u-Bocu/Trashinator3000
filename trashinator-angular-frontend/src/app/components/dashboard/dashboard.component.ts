import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  nbColonnes?: number = 5;
  cards?: Observable<Array<any>>;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    /* Si l'écran est petit, passes les 'cards' de la taille standard vers une colonne */
    this.cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        if (matches) {
          // Taille sur colonne
          this.nbColonnes = 1;
          return [
            { title: 'Organique', cols: 1, rows: 1 },
            { title: 'Paper', cols: 1, rows: 1 },
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
          { title: 'Paper', cols: 1, rows: 1 },
          { title: 'Plastique', cols: 1, rows: 1 },
          { title: 'Verre/Métal', cols: 1, rows: 1 },
          { title: 'Autres', cols: 1, rows: 1 },
          { title: '', cols: 5, rows: 2, content: 'nbScansChartComponent' }
        ];
      })
    );
  }
}
