import { Component, OnInit } from '@angular/core';
import { EChartsOption } from "echarts";
import { ScansService } from "../../../services/scans.service";
import {LocalStorageService} from "../../../services/local-storage.service";
import {EventService} from "../../../services/event.service";

@Component({
  selector: 'app-nb-scans-chart',
  templateUrl: './nb-scans-chart.component.html',
  styleUrls: ['./nb-scans-chart.component.css']
})
export class NbScansChartComponent implements OnInit {
  chartOptions: EChartsOption|null = null;
  nbScansByDay: Array<number> = [0, 0, 0, 0, 0, 0, 0];
  nbScansByDayByUser: Array<number> = [0, 0, 0, 0, 0, 0, 0];
  days: Array<string> = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  currentDayNumber = new Date().getDay();
  isLogged: boolean = false;

  constructor(
    private scansService: ScansService,
    private localStorageService: LocalStorageService,
    private eventService: EventService
  ) {
    this.isLogged = this.localStorageService.isLogged();
    this.eventService.getRefreshDashboardEvent().subscribe(() => {
      this.isLogged = this.localStorageService.isLogged();
      this.loadChartOptions();
    });
  }

  ngOnInit() {
    this.loadChartOptions();

    this.scansService.getNbScansByDay('True').subscribe(response => {
      response.data.rows.forEach((day: any[]) => {
          this.nbScansByDay[day[1]] = day[2];
        });
      this.nbScansByDay.push(this.nbScansByDay.shift()!); // Règle le décalage des jours (0 = dimanche pour SQLite)

      this.scansService.getNbScansByDayByUser('True', parseInt(this.localStorageService.getData('user_id'))).subscribe(response => {
        response.data.rows.forEach((day: any[]) => {
          this.nbScansByDayByUser[day[1]] = day[2];
        });
        this.nbScansByDayByUser.push(this.nbScansByDayByUser.shift()!); // Règle le décalage des jours (0 = dimanche pour SQLite)

        this.moveDaysInWeek();
        this.loadChartOptions();
      });
    });
  }

  private loadChartOptions() {
    this.chartOptions = {
      title: {
        text: 'Scans des 7 derniers jours',
        subtext: '',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        feature: {
          dataView: {show: true, readOnly: true},
          magicType: {show: true, type: ['line', 'bar']},
          saveAsImage: {show: true}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      legend: {
        data: ['Scans généraux', 'Vos scans']
      },
      xAxis: {
        type: 'category',
        data: this.days
      },
      yAxis: {
        type: 'value',
        name: 'Scans'
      },
      series: this.getSeries()
    };
  }

  // Déplace les jours de la semaine ainsi que le nombre de scans associé à chaque jour
  // Example : On est mercredi, on déplace les jours pour avoir un graphique de jeudi dernier à aujourd'hui (mercredi)
  private moveDaysInWeek() {
    for (let i = 0; i < this.currentDayNumber; i++) {
      this.nbScansByDay.push(this.nbScansByDay.shift()!);
      this.days.push(this.days.shift()!);
      if (this.isLogged)
        this.nbScansByDayByUser.push(this.nbScansByDayByUser.shift()!);
    }
  }

  private getSeries(): Array<any> {
    if (!this.isLogged) {
      return [
        {
          data: this.nbScansByDay,
          type: 'bar',
          name: 'Scans généraux',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          tooltip: {
            valueFormatter: function (value:any) {
              return value + ' Scans';
            }
          }
        }
      ];
    } else {
      return [
        {
          data: this.nbScansByDay,
          type: 'bar',
          name: 'Scans généraux',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          tooltip: {
            valueFormatter: function (value:any) {
              return value + ' Scans';
            }
          }
        },
        {
          data: this.nbScansByDayByUser,
          type: 'bar',
          name: 'Vos scans',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          tooltip: {
            valueFormatter: function (value:any) {
              return value + ' Scans';
            }
          }
        }
      ]
    }
  }
}
