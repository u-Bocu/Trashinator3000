import { Component, OnInit } from '@angular/core';
import { EChartsOption } from "echarts";
import { ScansService } from "../../../services/scans.service";

@Component({
  selector: 'app-nb-scans-chart',
  templateUrl: './nb-scans-chart.component.html',
  styleUrls: ['./nb-scans-chart.component.css']
})
export class NbScansChartComponent implements OnInit {
  chartOptions: EChartsOption|null = null;
  nbScansByDay: Array<number> = [0, 0, 0, 0, 0, 0, 0];
  days: Array<string> = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  currentDayNumber = new Date().getDay();

  constructor(private scansService: ScansService) {}

  ngOnInit() {
    this.loadChartOptions();

    this.scansService.getNbScansByDay('True').subscribe(response => {
      response.data.rows.forEach((day: any[]) => {
          this.nbScansByDay[day[1]] = day[2];
        });
      this.nbScansByDay.push(this.nbScansByDay.shift()!); // Règle le décalage des jours (0 = dimanche pour SQLite)
      this.moveDaysInWeek();
      this.loadChartOptions();
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
          dataView: { show: true, readOnly: true },
          magicType: { show: true, type: ['line', 'bar'] },
          saveAsImage: { show: true }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      legend: {
        data: ['Scans généraux', 'Vos Scans']
      },
      xAxis: {
        type: 'category',
        data: this.days
      },
      yAxis: {
        type: 'value',
        name: 'Scans'
      },
      series: [
        {
          data: this.nbScansByDay,
          type: 'bar',
          name: 'Scans généraux',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          tooltip: {
            valueFormatter: function (value) {
              return value + ' Scans';
            }
          }
        }
      ]
    };
  }

  // Déplace les jours de la semaine ainsi que le nombre de scans associé à chaque jour
  // Example : On est mercredi, on déplace les jours pour avoir un graphique de jeudi dernier à aujourd'hui (mercredi)
  private moveDaysInWeek() {
    for (let i = 0; i < this.currentDayNumber; i++) {
      this.nbScansByDay.push(this.nbScansByDay.shift()!);
      this.days.push(this.days.shift()!);
    }
  }
}
