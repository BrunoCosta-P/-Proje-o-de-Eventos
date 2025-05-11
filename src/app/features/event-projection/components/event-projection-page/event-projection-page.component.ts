import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { MaterialModule } from '../../../../shared/material.module';
import { EntityInputComponent } from '../entity-input/entity-input.component';
import { CycleSelectorComponent } from '../cycle-selector/cycle-selector.component';
import { EventsChartComponent } from '../events-chart/events-chart.component';
import { EventsService } from '../../../../core/services/events.service'; 
import { EventsProjectionData } from '../../models/event.model'; 
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
export class EventProjectionPageComponent implements OnInit {
  public eventsData$?: Observable<EventsProjectionData>;
  public resolvedEventsData?: EventsProjectionData;

  constructor(private readonly eventsService: EventsService) {}

  ngOnInit(): void {
    this.loadEventsData();
  }

  loadEventsData(): void {
    this.eventsService.getEventsData().subscribe((data) => {
      console.log("data", data);
  })
}

  returnTodayEvents() {
    return 3;
  }

  setEntities(entities: number) {
    console.log('Entities set to:', entities);
  }
}
