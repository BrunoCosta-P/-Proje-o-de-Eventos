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

  constructor() {}

  private _autoSelectHighPriorityCycles(): void {
    const currentCycles = this.cyclesSignal();
    if (!Array.isArray(currentCycles) || currentCycles.length === 0) {
      return;
    }

    let cyclesWereModified = false;
    const updatedCycles = currentCycles.map((cycle) => {
      if (
        cycle.availableEntities > 0 &&
        cycle.priority === 'HIGH' &&
        !cycle.selected
      ) {
        cyclesWereModified = true;
        return { ...cycle, selected: true };
      }
      return cycle;
    });

    if (cyclesWereModified) {
      this.cyclesSignal.set(updatedCycles);
    }
  }

  public readonly categorizedCycles: Signal<CategorizedCycles> = computed(
    () => {
      const priorityOrder: Record<string, number> = {
        HIGH: 1,
        MEDIUM: 2,
        LOW: 3,
      };
      const currentCycles = this.cyclesSignal();

      if (!Array.isArray(currentCycles)) {
        console.warn(
          'EventsStateService: currentCycles não é um array em categorizedCycles.'
        );
        return { withEntities: [], withoutEntities: [] };
      }

      const categorized: CategorizedCycles = {
        withEntities: [],
        withoutEntities: [],
      };

      currentCycles.forEach((cycle) => {
        if (cycle.availableEntities > 0) {
          categorized.withEntities.push(cycle);
        } else {
          categorized.withoutEntities.push(cycle);
        }
      });

      categorized.withEntities.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
      categorized.withoutEntities.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );

      return categorized;
    }
  );

  public readonly eventsForTodayCount: Signal<number> = computed(() => {
    const structure = this.existingEventsProjectionSignal();
    const today = new Date();
    const todayDay = today.getDay();
    const eventsTodayArray = structure.filter(
      (event) => event.day === todayDay
    );

    if (eventsTodayArray.length > 0 && eventsTodayArray[0].events) {
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

  public onCheckboxChange(changedCycleFromTemplate: Cycle): void {
    this.cyclesSignal.update((currentCyclesInSignal) => {
      const cycleIndex = currentCyclesInSignal.findIndex(
        (c) => c.name === changedCycleFromTemplate.name
      );

      if (cycleIndex !== -1) {
        const newCyclesArray = [...currentCyclesInSignal];
        newCyclesArray[cycleIndex] = {
          ...currentCyclesInSignal[cycleIndex],
          selected: changedCycleFromTemplate.selected,
        };
        return newCyclesArray;
      }
      return currentCyclesInSignal;
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
    if (entitiesToSubtract <= 0) return;

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
    this.deselectAllCycles();
  }

  public deselectAllCycles(): void {
    this.cyclesSignal.update((cycles) =>
      cycles.map((cycle) =>
        cycle.selected ? { ...cycle, selected: false } : cycle
      )
    );
  }

  public loadEventsData(): void {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    this.eventsService.getEventsData().subscribe({
      next: (data: EventsProjectionData) => {
        const activities: DailyEvent[] = data.eventsProjection
          ? data.eventsProjection.map((dailyEvent) => ({ ...dailyEvent }))
          : [];

        this.existingEventsProjectionSignal.set(activities);
        this.cyclesSignal.set(
          data.cycles ? data.cycles.map((cycle) => ({ ...cycle })) : []
        );

        this._autoSelectHighPriorityCycles();

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
    const selectedCycles = this.cyclesSignal().filter(
      (cycle) => cycle.selected
    );

    if (selectedCycles.length === 0) {
      return;
    }

    this.existingEventsProjectionSignal.update((existingProjection) => {
      const updatedMap = new Map<number, DailyEvent>();
      existingProjection.forEach((ev) =>
        updatedMap.set(ev.day, JSON.parse(JSON.stringify(ev)))
      );

      selectedCycles.forEach((cycle) => {
        if (cycle.structure && Array.isArray(cycle.structure)) {
          cycle.structure.forEach((dayEvent) => {
            const existingDayData = updatedMap.get(dayEvent.day);
            if (existingDayData) {
              existingDayData.events.meetings =
                (existingDayData.events.meetings || 0) +
                (dayEvent.meetings || 0);
              existingDayData.events.emails =
                (existingDayData.events.emails || 0) + (dayEvent.emails || 0);
              existingDayData.events.calls =
                (existingDayData.events.calls || 0) + (dayEvent.calls || 0);
              existingDayData.events.follows =
                (existingDayData.events.follows || 0) + (dayEvent.follows || 0);
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
        }
      });
      return Array.from(updatedMap.values()).sort((a, b) => a.day - b.day);
    });
  }

  public getEventsCountForToday(): number {
    const today = new Date();
    const todayDay = today.getDay();
    return this.existingEventsProjectionSignal()
      .filter((event) => event.day === todayDay)
      .reduce((total, event) => {
        const ev = event.events;
        return (
          total +
          (ev.meetings || 0) +
          (ev.emails || 0) +
          (ev.calls || 0) +
          (ev.follows || 0)
        );
      }, 0);
  }
}
