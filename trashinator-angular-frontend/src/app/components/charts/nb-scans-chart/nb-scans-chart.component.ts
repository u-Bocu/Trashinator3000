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
  data: Array<number> = [0, 0, 0, 0, 0, 0, 0];

  constructor(private scansService: ScansService) {}

  ngOnInit() {
    this.loadChartOptions();

    this.scansService.getNbScansByDay('True').subscribe(response => {
      response.data.rows.forEach((day: any[]) => {
          this.data[day[1]] = day[2];
        });
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
        data: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      },
      yAxis: {
        type: 'value',
        name: 'Scans'
      },
      series: [
        {
          data: this.data,
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
}
