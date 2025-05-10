import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { MaterialModule } from '../../../../shared/material.module';

export interface Ciclo {
  selecionado: boolean;
  statusIcone: string; // 'arrow_upward' ou 'arrow_downward'
  statusCor: string; // 'green', 'orange', 'red', ou outra cor CSS válida
  nome: string;
  selecionadosDisponiveis: string; // Ex: '1/1', '6/195'
  eventosHoje: number;
  ativo?: boolean; // Para distinguir os checkboxes preenchidos dos vazios mas clicáveis
}
@Component({
  selector: 'app-cycle-selector',
  imports: [SharedModule, MaterialModule],
  templateUrl: './cycle-selector.component.html',
  styleUrl: './cycle-selector.component.scss',
})
export class CycleSelectorComponent {
  displayedColumnsComEntidades: string[] = [
    'selecionar',
    'status',
    'nome',
    'selecionadosDisponiveis',
    'eventosHoje',
  ];
  displayedColumnsSemEntidades: string[] = [
    'status',
    'nome',
    'selecionadosDisponiveis',
    'eventosHoje',
  ]; // Sem a coluna 'selecionar'

  ciclosComEntidades: Ciclo[] = [
    {
      selecionado: true,
      ativo: true,
      statusIcone: 'arrow_upward',
      statusCor: 'rgb(76, 175, 80)',
      nome: 'Prospecção outbound',
      selecionadosDisponiveis: '1/1',
      eventosHoje: 4,
    },
    {
      selecionado: true,
      ativo: true,
      statusIcone: 'arrow_upward',
      statusCor: 'orange',
      nome: 'Credenciamento',
      selecionadosDisponiveis: '3/1',
      eventosHoje: 12,
    },
    {
      selecionado: true,
      ativo: true,
      statusIcone: 'arrow_upward',
      statusCor: 'rgb(76, 175, 80)',
      nome: 'Outbound Geral',
      selecionadosDisponiveis: '6/195',
      eventosHoje: 18,
    },
    {
      selecionado: false,
      ativo: false,
      statusIcone: 'arrow_downward',
      statusCor: 'rgb(33, 150, 243)',
      nome: 'ciclo teste de exclusão',
      selecionadosDisponiveis: '0/2',
      eventosHoje: 0,
    },
  ];

  ciclosSemEntidades: Ciclo[] = [
    {
      selecionado: false,
      statusIcone: 'arrow_upward',
      statusCor: 'red',
      nome: 'Dúvidas LGPD',
      selecionadosDisponiveis: '',
      eventosHoje: NaN,
    }, // Usando NaN para não mostrar '0' se a coluna for numérica
    {
      selecionado: false,
      statusIcone: 'arrow_upward',
      statusCor: 'orange',
      nome: 'Ciclo Inbound',
      selecionadosDisponiveis: '',
      eventosHoje: NaN,
    },
    {
      selecionado: false,
      statusIcone: 'arrow_upward',
      statusCor: 'orange',
      nome: 'Ciclo Salesforce',
      selecionadosDisponiveis: '',
      eventosHoje: NaN,
    },
    {
      selecionado: false,
      statusIcone: 'arrow_upward',
      statusCor: 'orange',
      nome: 'Indústria Outbound',
      selecionadosDisponiveis: '',
      eventosHoje: NaN,
    },
    {
      selecionado: false,
      statusIcone: 'arrow_upward',
      statusCor: 'orange',
      nome: 'Ciclo automático',
      selecionadosDisponiveis: '',
      eventosHoje: NaN,
    },
    {
      selecionado: false,
      statusIcone: 'arrow_upward',
      statusCor: 'orange',
      nome: 'Midsize',
      selecionadosDisponiveis: '',
      eventosHoje: NaN,
    },
  ];

  public isNaN = isNaN;

  constructor() {}

  getTotalCiclosComEntidades(): number {
    return this.ciclosComEntidades.length;
  }

  getTotalCiclosSemEntidades(): number {
    return this.ciclosSemEntidades.length;
  }

  // Função para lidar com a mudança de estado do checkbox (opcional, para interatividade)
  toggleSelecao(ciclo: Ciclo): void {
    ciclo.selecionado = !ciclo.selecionado;
    // Adicione qualquer lógica adicional aqui, como atualizar o backend
  }
}
