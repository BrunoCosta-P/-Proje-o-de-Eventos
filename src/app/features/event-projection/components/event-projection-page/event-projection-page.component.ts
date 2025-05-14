import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { MaterialModule } from '../../../../shared/material.module';
import { EntityInputComponent } from '../entity-input/entity-input.component';
import { CycleSelectorComponent } from '../cycle-selector/cycle-selector.component';
import { EventsChartComponent } from '../events-chart/events-chart.component';
import { EventsStateService } from '../../services/events-state.service';
import {
  EventsProjectionData,
  DailyEvent,
  Cycle,
} from '../../models/event.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-projection-page',
  imports: [
    SharedModule,
    MaterialModule,
    EntityInputComponent,
    CycleSelectorComponent,
    EventsChartComponent,
  ],
  templateUrl: './event-projection-page.component.html',
  styleUrl: './event-projection-page.component.scss',
})
export class EventProjectionPageComponent {
  public readonly eventsState!: EventsStateService;
  public eventsData$?: Observable<EventsProjectionData>;
  public existingEventsProjectio?: DailyEvent[];
  public cycles?: Cycle[];
  public categorizedCycles: {
    withEntities: Cycle[];
    withoutEntities: Cycle[];
  } = {
    withEntities: [],
    withoutEntities: [],
  };

  constructor(eventsState: EventsStateService) {
    this.eventsState = eventsState;
  }
}
