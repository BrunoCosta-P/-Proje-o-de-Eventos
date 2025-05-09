import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { MaterialModule } from '../../../../shared/material.module';
import { EntityInputComponent } from '../entity-input/entity-input.component';
import { CycleSelectorComponent } from '../cycle-selector/cycle-selector.component';
import { EventsChartComponent } from '../events-chart/events-chart.component';

@Component({
  selector: 'app-event-projection-page',
  imports: [
    SharedModule,
    MaterialModule,
    EntityInputComponent,
    CycleSelectorComponent,
    EventsChartComponent
  ],
  templateUrl: './event-projection-page.component.html',
  styleUrl: './event-projection-page.component.scss',
})
export class EventProjectionPageComponent {}
