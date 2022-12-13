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

  constructor(private scansService: ScansService) {}

  ngOnInit() {
    const data = this.scansService.getNbScansByDay();

    this.chartOptions = {
      title: {
        text: 'Scans de la semaine',
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
          data: data,
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
