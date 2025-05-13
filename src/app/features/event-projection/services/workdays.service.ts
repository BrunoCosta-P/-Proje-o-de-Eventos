import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkdaysService {
  private readonly allDayNames: string[] = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];

  private readonly workdayNamesList: string[] = [
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
  ];

  private readonly dayNameToNumberMap: { [key: string]: number } = {
    Domingo: 0,
    Segunda: 1,
    Terça: 2,
    Quarta: 3,
    Quinta: 4,
    Sexta: 5,
    Sábado: 6,
  };

  constructor() {}

  getOrderedWorkdays(): string[] {
    const todayDate = new Date();
    const currentDayNumeric = todayDate.getDay(); 
    let orderedDays: string[] = [];

    if (currentDayNumeric >= 1 && currentDayNumeric <= 5) {
      orderedDays.push('Hoje');


      const currentWorkdayListIndex = currentDayNumeric - 1;

      orderedDays.push(
        ...this.workdayNamesList.slice(currentWorkdayListIndex + 1)
      );
      orderedDays.push(
        ...this.workdayNamesList.slice(0, currentWorkdayListIndex)
      );
    } else {
      orderedDays = [...this.workdayNamesList];
    }
    return orderedDays;
  }

   getOrderedWorkdayNumbers(): number[] {
    const todayDate = new Date();
    const currentDayNumeric = todayDate.getDay(); 

    let orderedNumbers: number[] = [];

    if (currentDayNumeric >= 1 && currentDayNumeric <= 5) {
      orderedNumbers.push(currentDayNumeric); 

      const currentWorkdayListIndex = currentDayNumeric - 1;

      const followingWorkdayNames = [
        ...this.workdayNamesList.slice(currentWorkdayListIndex + 1),
        ...this.workdayNamesList.slice(0, currentWorkdayListIndex),
      ];

      for (const name of followingWorkdayNames) {
        if (this.dayNameToNumberMap[name] !== undefined) {
          orderedNumbers.push(this.dayNameToNumberMap[name]);
        } else {
          console.warn(`WorkdaysService: Nome de dia '${name}' não encontrado no dayNameToNumberMap.`);
        }
      }
    } else { 
      for (const name of this.workdayNamesList) {
        if (this.dayNameToNumberMap[name] !== undefined) {
          orderedNumbers.push(this.dayNameToNumberMap[name]);
        } else {
            console.warn(`WorkdaysService: Nome de dia '${name}' não encontrado no dayNameToNumberMap durante o fim de semana.`);
        }
      }
    }
    return orderedNumbers;
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
