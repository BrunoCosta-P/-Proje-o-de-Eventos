import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { MaterialModule } from '../../../../shared/material.module';
import { EventActivity } from '../../models/event.model';
import { EventsStateService } from '../../services/events-state.service';

@Component({
  selector: 'app-cycle-selector',
  imports: [SharedModule, MaterialModule],
  templateUrl: './cycle-selector.component.html',
  styleUrl: './cycle-selector.component.scss',
})
export class CycleSelectorComponent {
  public readonly eventsState: EventsStateService;

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
  ];

  public isNaN = isNaN;

  constructor(eventsState: EventsStateService) {
    this.eventsState = eventsState;
  }



  getTotalCyclesWithEntities(): number {
    return this.eventsState.categorizedCycles().withEntities.length;
  }

  getTotalCyclesWithoutEntities(): number {
    return this.eventsState.categorizedCycles().withoutEntities.length;
  }

  get entitiesModelSignalValue() {
    return this.eventsState.entitiesModel();
  }

  getEventsForToday(structure: EventActivity[]): number {
    const today = new Date();
    const todayDay = today.getDay();
    const eventsToday = structure.filter((event) => event.day === todayDay);
    if (eventsToday.length > 0) {
      return (
        eventsToday[0].meetings +
        eventsToday[0].emails +
        eventsToday[0].calls +
        eventsToday[0].follows
      );
    }

    return 0;
  }
}
