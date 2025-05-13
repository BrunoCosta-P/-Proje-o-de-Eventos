import {
  Component,
  ViewChild,
  OnInit,
  inject,
  effect,
  ChangeDetectionStrategy,
  untracked,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkdaysService } from '../../services/workdays.service';
import { EventsStateService } from '../../services/events-state.service';
import { DailyEvent, EventActivity } from '../../models/event.model'; // Importe DailyEvent e EventActivity

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
  NgApexchartsModule,
  ApexNoData, // Importar ApexNoData
} from 'ng-apexcharts';

// Sua definição de ChartOptions (certifique-se que inclui noData opcional)
export type ChartOptions = {
  series?: ApexAxisChartSeries; // Tornando opcional para Partial<> funcionar bem
  chart?: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  legend?: ApexLegend;
  fill?: ApexFill;
  noData?: ApexNoData; // Adicionado aqui
};

@Component({
  selector: 'app-events-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './events-chart.component.html',
  styleUrl: './events-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>; // Partial é bom para construção gradual

  private readonly workdaysService = inject(WorkdaysService);
  private readonly eventsState = inject(EventsStateService);

  private displayWorkdays: string[] = [];
  private orderedWorkdayNumbers: number[] = [];
  private chartReady = false;

  constructor() {
    // Inicialização base de chartOptions
    this.chartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: { show: true },
        zoom: { enabled: true },
      },
      plotOptions: { bar: { horizontal: false } },
      dataLabels: { enabled: false },
      xaxis: { type: 'category', categories: [] },
      yaxis: { show: true, title: { text: 'Quantidade de Eventos' } },
      legend: { position: 'bottom', offsetY: 10 },
      fill: { opacity: 1 },
      responsive: [
        {
          breakpoint: 480,
          options: { legend: { position: 'bottom', offsetX: -10, offsetY: 0 } },
        },
      ],
      noData: {
        // <<< noData no nível correto
        text: 'Carregando gráfico...',
        align: 'center',
        verticalAlign: 'middle',
      },
    };

    effect(() => {
      const activities = this.eventsState.existingEventsProjection();
      const isLoading = this.eventsState.isLoading();
      const error = this.eventsState.error();

      untracked(() => {
        let newSeries: ApexAxisChartSeries = [];
        let currentCategories: string[] =
          this.displayWorkdays?.length > 0 ? this.displayWorkdays : [];
        let currentNoDataText =
          this.chartOptions.noData?.text || 'Carregando...';

        if (isLoading) {
          currentNoDataText = 'Carregando dados...';
          newSeries = [];
          currentCategories = ['Carregando...'];
        } else if (error) {
          currentNoDataText = `Erro ao carregar: ${error.substring(0, 40)}...`;
          newSeries = [];
          currentCategories = ['Erro'];
        } else if (!activities || activities.length === 0) {
          currentNoDataText = 'Sem dados para exibir.';
          newSeries = [];
          currentCategories =
            this.displayWorkdays?.length > 0
              ? this.displayWorkdays
              : ['Sem dados'];
        } else {
          if (
            this.orderedWorkdayNumbers?.length > 0 &&
            this.displayWorkdays?.length > 0
          ) {
            const meetingsData = this.orderedWorkdayNumbers.map(
              (dayNum) =>
                activities.find((a) => a.day === dayNum)?.events.meetings || 0
            );
            const emailsData = this.orderedWorkdayNumbers.map(
              (dayNum) =>
                activities.find((a) => a.day === dayNum)?.events.emails || 0
            );
            const callsData = this.orderedWorkdayNumbers.map(
              (dayNum) =>
                activities.find((a) => a.day === dayNum)?.events.calls || 0
            );
            const followsData = this.orderedWorkdayNumbers.map(
              (dayNum) =>
                activities.find((a) => a.day === dayNum)?.events.follows || 0
            );

            newSeries = [
              { name: 'Reuniões', data: meetingsData },
              { name: 'Emails', data: emailsData },
              { name: 'Chamadas', data: callsData },
              { name: 'Follow-ups', data: followsData },
            ];

            currentNoDataText = 'Sem dados para exibir.';
          } else {
            currentNoDataText = 'Aguardando configuração dos dias...';
            newSeries = [];
            currentCategories = ['Aguardando...'];
          }
        }

        this.chartOptions = {
          ...this.chartOptions,
          series: newSeries,
          xaxis: {
            ...(this.chartOptions.xaxis || { type: 'category' }),
            categories: currentCategories,
          },
          noData: {
            ...(this.chartOptions.noData || {}),
            text: currentNoDataText,
          },
          chart: {
            ...(this.chartOptions.chart || { type: 'bar', height: 350 }),
          },
        };

        if (this.chartReady && this.chart) {
          this.chart.updateOptions({
            series: newSeries,
            xaxis: { categories: currentCategories },
            noData: { text: currentNoDataText },
          });
        }
      });
    });
  }

  ngOnInit(): void {
    this.displayWorkdays = this.workdaysService.getOrderedWorkdays();
    this.orderedWorkdayNumbers =
      this.workdaysService.getOrderedWorkdayNumbers();

    this.chartOptions = {
      ...this.chartOptions,
      xaxis: {
        ...(this.chartOptions.xaxis || { type: 'category' }),
        categories:
          this.displayWorkdays?.length > 0 ? this.displayWorkdays : [],
      },
    };
    this.eventsState.loadEventsData();
  }

  ngAfterViewInit(): void {
    this.chartReady = true;

    if (this.chart) {
      this.chart.updateOptions({
        series: this.chartOptions.series || [],
        xaxis: {
          categories: (this.chartOptions.xaxis as ApexXAxis)?.categories || [],
        },
        noData: { text: this.chartOptions.noData?.text || 'Carregando...' },
      });
    }
  }

  ngOnDestroy(): void {
    /* Effects são limpos automaticamente */
  }
}
