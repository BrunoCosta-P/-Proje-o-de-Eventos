import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconColor'
})
export class IconColorPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'HIGH':
        return '#ff5852';
      case 'MEDIUM':
        return '#ffb025';
      case 'LOW':
        return '#66c88e';
      default:
        return '#000000'; 
    }
  }
}
