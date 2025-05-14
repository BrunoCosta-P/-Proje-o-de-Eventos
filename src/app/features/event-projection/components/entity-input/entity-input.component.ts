import { Component } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { MaterialModule } from '../../../../shared/material.module';
import { EventsStateService } from '../../services/events-state.service';

@Component({
  selector: 'app-entity-input',
  standalone: true,
  imports: [MaterialModule, SharedModule, FormsModule],
  templateUrl: './entity-input.component.html',
  styleUrl: './entity-input.component.scss',
})
export class EntityInputComponent {
  public readonly eventsState: EventsStateService;

  constructor(eventsState: EventsStateService) {
    this.eventsState = eventsState;
  }

  onKeyDown(event: KeyboardEvent): void {
    const DIT_ALLOWED_KEYS = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];
    if (
      DIT_ALLOWED_KEYS.indexOf(event.key) !== -1 ||
      (event.key === 'a' && (event.ctrlKey || event.metaKey)) ||
      (event.key === 'c' && (event.ctrlKey || event.metaKey)) ||
      (event.key === 'v' && (event.ctrlKey || event.metaKey)) ||
      (event.key === 'x' && (event.ctrlKey || event.metaKey))
    ) {
      return;
    }
    if (event.key < '0' || event.key > '9') {
      event.preventDefault();
    }
  }

  onEntitiesChange(newValue: string | number): void {
    const numericValue = Number(newValue);
    this.eventsState.updateEntitiesModel(numericValue);
  }
}
