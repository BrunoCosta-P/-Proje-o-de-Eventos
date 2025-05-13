import {
  Injectable,
  signal,
  computed,
  WritableSignal,
  Signal,
  inject,
} from '@angular/core';
import {
  EventsProjectionData,
  DailyEvent,
  Cycle,
  CategorizedCycles,
} from '../models/event.model';
import { EventsService } from '../../../core/services/events.service';

@Injectable({
  providedIn: 'root',
})
export class EventsStateService {
  private readonly eventsService = inject(EventsService);

  private readonly existingEventsProjectionSignal: WritableSignal<
    DailyEvent[]
  > = signal([]);
  private readonly cyclesSignal: WritableSignal<Cycle[]> = signal([]);
  private readonly isLoadingSignal: WritableSignal<boolean> = signal(false);
  private readonly errorSignal: WritableSignal<string | null> = signal(null);
  private readonly entitiesModelSignal: WritableSignal<number> = signal(1);

  public readonly existingEventsProjection: Signal<DailyEvent[]> =
    this.existingEventsProjectionSignal.asReadonly();
  public readonly cycles: Signal<Cycle[]> = this.cyclesSignal.asReadonly();
  public readonly isLoading: Signal<boolean> =
    this.isLoadingSignal.asReadonly();
  public readonly error: Signal<string | null> = this.errorSignal.asReadonly();
  public readonly entitiesModel: Signal<number> =
    this.entitiesModelSignal.asReadonly();

  public readonly categorizedCycles: Signal<CategorizedCycles> = computed(
    () => {
      const currentCycles = this.cyclesSignal();
      if (!Array.isArray(currentCycles)) {
        return { withEntities: [], withoutEntities: [] };
      }
      return currentCycles.reduce(
        (acc, cycle) => {
          if (cycle.availableEntities > 0) {
            acc.withEntities.push(cycle);
          } else {
            acc.withoutEntities.push(cycle);
          }
          return acc;
        },
        { withEntities: [] as Cycle[], withoutEntities: [] as Cycle[] }
      );
    }
  );

  public readonly eventsForTodayCount: Signal<number> = computed(() => {
    const structure = this.existingEventsProjectionSignal();
    const today = new Date();
    const todayDay = today.getDay();
    const eventsTodayArray = structure.filter(
      (event) => event.day === todayDay
    );

    if (eventsTodayArray.length > 0) {
      const todayEvent = eventsTodayArray[0].events;
      return (
        (todayEvent.meetings || 0) +
        (todayEvent.emails || 0) +
        (todayEvent.calls || 0) +
        (todayEvent.follows || 0)
      );
    }
    return 0;
  });

  public onCheckboxChange(cycle: any): void {
    this.cyclesSignal.update((cycles) => {
      const cycleIndex = cycles.findIndex((c) => c.name === cycle.name);
      if (cycleIndex !== -1) {
        const updatedCycles = [...cycles];
        updatedCycles[cycleIndex] = {
          ...updatedCycles[cycleIndex],
          selected: !updatedCycles[cycleIndex].selected,
        };
        return updatedCycles;
      }
      return cycles;
    });
  }

  public updateEntitiesModel(newValue: number): void {
    const numValue = Number(newValue);
    if (!isNaN(numValue) && numValue >= 0) {
      this.entitiesModelSignal.set(numValue);
    } else {
      console.warn(
        'EventsStateService: Valor inválido fornecido para entitiesModel:',
        newValue,
        '. Mantendo o valor atual:',
        this.entitiesModelSignal()
      );
    }
  }

  public subtractEntitiesFromSelectedCycles(): void {
    const entitiesToSubtract = this.entitiesModelSignal();
    this.cyclesSignal.update((cycles) =>
      cycles.map((cycle) =>
        cycle.selected
          ? {
              ...cycle,
              availableEntities: Math.max(
                0,
                (cycle.availableEntities || 0) - entitiesToSubtract
              ),
            }
          : cycle
      )
    );
  }

  public startNewEntity(): void {
    this.subtractEntitiesFromSelectedCycles();
    this.addSelectedCyclesToEventsProjection();
  }

  public loadEventsData(): void {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    this.eventsService.getEventsData().subscribe({
      next: (data: EventsProjectionData) => {
        const activities: DailyEvent[] = data.eventsProjection
          ? data.eventsProjection.map((dailyEvent) => dailyEvent)
          : [];

        this.existingEventsProjectionSignal.set(activities);
        this.cyclesSignal.set(data.cycles || []);
        this.isLoadingSignal.set(false);
      },
      error: (err) => {
        console.error(
          'EventsStateService: Erro ao carregar dados dos eventos:',
          err
        );
        this.errorSignal.set(
          'Falha ao carregar dados dos eventos. Verifique o console.'
        );
        this.isLoadingSignal.set(false);
      },
    });
  }

  public addSelectedCyclesToEventsProjection(): void {
    const selectedCycles = this.cyclesSignal().filter(cycle => cycle.selected);

    if (selectedCycles.length === 0) {
      return;
    }

    this.existingEventsProjectionSignal.update(existing => {
      const updatedMap = new Map<number, DailyEvent>();
      existing.forEach(ev => updatedMap.set(ev.day, { ...ev, events: { ...ev.events } }));

      selectedCycles.forEach(cycle => {
        cycle.structure.forEach(dayEvent => {
          const existingEvent = updatedMap.get(dayEvent.day);
          if (existingEvent) {
            updatedMap.set(dayEvent.day, {
              ...existingEvent,
              events: {
                meetings: (existingEvent.events.meetings || 0) + (dayEvent.meetings || 0),
                emails: (existingEvent.events.emails || 0) + (dayEvent.emails || 0),
                calls: (existingEvent.events.calls || 0) + (dayEvent.calls || 0),
                follows: (existingEvent.events.follows || 0) + (dayEvent.follows || 0),
                day: dayEvent.day,
              },
            });
          } else {
            updatedMap.set(dayEvent.day, {
              day: dayEvent.day,
              events: {
                meetings: dayEvent.meetings || 0,
                emails: dayEvent.emails || 0,
                calls: dayEvent.calls || 0,
                follows: dayEvent.follows || 0,
                day: dayEvent.day,
              },
            });
          }
        });
      });

      return Array.from(updatedMap.values()).sort((a, b) => a.day - b.day);
    });
  }
}
