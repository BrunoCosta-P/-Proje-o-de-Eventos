import { Component, ViewChild, OnInit } from '@angular/core';
import { WorkdaysService } from '../../services/workdays.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexFill,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

@Component({
  selector: 'app-events-chart',
  imports: [ChartComponent],
  templateUrl: './events-chart.component.html',
  styleUrl: './events-chart.component.scss',
})

export class EventsChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  displayWorkdays: string[] = [];

  constructor(private readonly workdaysService: WorkdaysService) {
    this.chartOptions = {
      series: [
        {
          name: 'PRODUCT A',
          data: [44, 55, 41, 67, 22],
        },
        {
          name: 'PRODUCT B',
          data: [13, 23, 20, 8, 13],
        },
        {
          name: 'PRODUCT C',
          data: [11, 17, 15, 15, 21],
        },
        {
          name: 'PRODUCT D',
          data: [21, 7, 25, 13, 22],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        type: 'category',
        categories: this.displayWorkdays,
      },
      yaxis: {
        show: true,
        showAlways: true,
        title: {
          text: 'Quantidade de Eventos',
          rotate: -90,
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-yaxis-title',
          },
        },
      },
      legend: {
        position: 'bottom',
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    };
  }
  ngOnInit(): void {
    this.displayWorkdays = this.workdaysService.getOrderedWorkdays();
    if (this.chartOptions.xaxis) {
      this.chartOptions.xaxis.categories = this.displayWorkdays;
    }
  }
}
