import { Component, OnInit } from '@angular/core';
import { EChartsOption } from "echarts";
import { NbScansChartService } from "../../../services/nb-scans-chart.service";

@Component({
  selector: 'app-nb-scans-chart',
  templateUrl: './nb-scans-chart.component.html',
  styleUrls: ['./nb-scans-chart.component.css']
})
export class NbScansChartComponent implements OnInit {
  chartOptions: EChartsOption|null = null;

  constructor(private nbScansChartService: NbScansChartService) {}

  ngOnInit() {
    const data = this.nbScansChartService.getData();

    this.chartOptions = {
      title: {
        text: 'Scans de la semaine',
        subtext: ''
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    };
  }
}
