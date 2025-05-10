// src/app/core/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventsProjectionData } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly MOCK_DATA_URL = '../../../../assets/data/eventsAPIResponse.json';

  constructor(private readonly http: HttpClient) { }

  getEventsData(): Observable<EventsProjectionData> {
    return this.http.get<EventsProjectionData>(this.MOCK_DATA_URL);
  }


}