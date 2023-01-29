import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EChartsOption } from "echarts";

@Component({
  selector: 'app-tons-waste-chart',
  templateUrl: './tons-waste-chart.component.html',
  styleUrls: ['./tons-waste-chart.component.css']
})
export class TonsWasteChartComponent implements OnInit, OnChanges {
  @Input() selectedCountryData?: any;
  @Input() comparedCountryData?: any;

  chartOptions: EChartsOption|null = null;

  constructor() { }

  ngOnInit() {
    this.loadChartOptions();
  }

  private loadChartOptions() {
    this.chartOptions = {
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
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        data: [
          this.selectedCountryData?.countryName ? this.selectedCountryData?.countryName : 'Pays 1 à comparer avec',
          this.comparedCountryData?.countryName ? this.comparedCountryData?.countryName : 'Pays 2 à sélectionner'
        ]
      },
      xAxis: [
        {
          type: 'category',
          data: ['Organique', 'Papier', 'Plastique', 'Verre', 'Metal', 'Autres', 'Total'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Quantité de déchets (en tonnes)',
          axisLabel: {
            formatter: function (value: number) {
              if (value >= 1000000) {
                return (value as number / 1000000).toFixed(1) + 'M';
              } else if (value >= 1000) {
                return (value as number / 1000).toFixed(1) + 'K';
              } else {
                return value + '';
              }
            }
          }
        }
      ],
      series: [
        {
          name: this.selectedCountryData?.countryName ? this.selectedCountryData?.countryName : 'Pays 1 à comparer avec',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              if (value >= 1000000) {
                return (value as number / 1000000).toFixed(1) + 'M tonnes';
              } else if (value >= 1000) {
                return (value as number / 1000).toFixed(1) + 'K tonnes';
              } else {
                return value  + ' tonnes';
              }
            }
          },
          data: [
            this.selectedCountryData?.organicWaste,
            this.selectedCountryData?.paperWaste,
            this.selectedCountryData?.plasticWaste,
            this.selectedCountryData?.glassWaste,
            this.selectedCountryData?.metalWaste,
            this.selectedCountryData?.otherWaste,
            this.selectedCountryData?.totalWastePerYear
          ]
        },
        {
          name: this.comparedCountryData?.countryName ? this.comparedCountryData?.countryName : 'Pays 2 à sélectionner',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              if (value >= 1000000) {
                return (value as number / 1000000).toFixed(1) + 'M tonnes';
              } else if (value >= 1000) {
                return (value as number / 1000).toFixed(1) + 'K tonnes';
              } else {
                return value  + ' tonnes';
              }
            }
          },
          data: [
            this.comparedCountryData?.organicWaste ? this.comparedCountryData?.organicWaste : 0,
            this.comparedCountryData?.paperWaste ? this.comparedCountryData?.paperWaste : 0,
            this.comparedCountryData?.plasticWaste ? this.comparedCountryData?.plasticWaste : 0,
            this.comparedCountryData?.glassWaste ? this.comparedCountryData?.glassWaste : 0,
            this.comparedCountryData?.metalWaste ? this.comparedCountryData?.metalWaste : 0,
            this.comparedCountryData?.otherWaste ? this.comparedCountryData?.otherWaste : 0,
            this.comparedCountryData?.totalWastePerYear ? this.comparedCountryData?.totalWastePerYear : 0
          ]
        }
      ]
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadChartOptions();
  }
}
