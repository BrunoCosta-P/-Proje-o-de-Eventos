export interface EventActivity {
  meetings: number;
  emails: number;
  calls: number;
  follows: number;
  day: number;
}

export interface DailyEvent {
  day: number;
  events: EventActivity;
}

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CycleActivityDetail extends EventActivity {
  day: number;
}

export interface Cycle {
  name: string;
  availableEntities: number;
  priority: Priority;
  structure: CycleActivityDetail[];
  selected?: boolean;
}

export interface EventsProjectionData {
  eventsProjection: DailyEvent[];
  cycles: Cycle[];
}

export interface EventsAPIResponse {
  eventsProjection: DailyEvent[];
  cycles: Cycle[];
}

export interface CategorizedCycles {
  withEntities: Cycle[];
  withoutEntities: Cycle[];
}