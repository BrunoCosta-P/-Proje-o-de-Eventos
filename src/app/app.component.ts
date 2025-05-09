import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventProjectionPageComponent } from '../app/features/event-projection/components/event-projection-page/event-projection-page.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EventProjectionPageComponent],
  standalone: true, 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ProjecaoDeEventos';
}
