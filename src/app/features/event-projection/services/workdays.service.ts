import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkdaysService {
  constructor() {}

  getOrderedWorkdays(): string[] {
    const daysOfWeek: string[] = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];
    const workdayNames: string[] = [
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
    ];
    const todayDate = new Date();
    const currentDayIndex = todayDate.getDay();

    let orderedDays: string[] = [];

    if (currentDayIndex >= 1 && currentDayIndex <= 5) {
      orderedDays = [
      'Hoje',
      ...workdayNames
        .slice(currentDayIndex - 1 + 1)
        .concat(workdayNames.slice(0, currentDayIndex - 1))
      ];
    } else {
      orderedDays = [...workdayNames];
    }

    return orderedDays;
  }
 // excluir
  getOrderedWorkdaysForSpecificDate(specificDate: Date): string[] {
    const daysOfWeek: string[] = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];
    const workdayNames: string[] = [
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
    ];
    const currentDayIndex = specificDate.getDay();

    let orderedDays: string[] = [];

    if (currentDayIndex >= 1 && currentDayIndex <= 5) {
      const currentDayName = daysOfWeek[currentDayIndex];
      const currentWorkdayIndex = workdayNames.indexOf(currentDayName);

      orderedDays.push('Hoje');

      for (let i = 1; i < workdayNames.length; i++) {
        const nextDayIndex = (currentWorkdayIndex + i) % workdayNames.length;
        orderedDays.push(workdayNames[nextDayIndex]);
      }
    } else {
      orderedDays = [...workdayNames];
    }
    return orderedDays;
  }
}
