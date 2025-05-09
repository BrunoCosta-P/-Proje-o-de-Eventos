import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-entity-input',
  imports: [MaterialModule, SharedModule],
  templateUrl: './entity-input.component.html',
  styleUrl: './entity-input.component.scss',
})
export class EntityInputComponent {}
