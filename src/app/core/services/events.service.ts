import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { EventsProjectionData } from '../../features/event-projection/models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly MOCK_DATA_URL = 'assets/data/eventsAPIResponse.json';

  constructor(private readonly http: HttpClient) {}

  getEventsData(): Observable<EventsProjectionData> {
     return this.http.get<EventsProjectionData>(this.MOCK_DATA_URL);
  }
}
