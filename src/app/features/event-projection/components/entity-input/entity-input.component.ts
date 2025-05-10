import { Component, input, output } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-entity-input',
  imports: [MaterialModule, SharedModule],
  templateUrl: './entity-input.component.html',
  styleUrl: './entity-input.component.scss',
})
export class EntityInputComponent {
  entitiesModel: number = 1;

  outputEntities = output<number>();

  todayEvents = input<number>();
  
  constructor() {}

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

  emitEntities() {
    this.outputEntities.emit(this.entitiesModel);
  }
}
