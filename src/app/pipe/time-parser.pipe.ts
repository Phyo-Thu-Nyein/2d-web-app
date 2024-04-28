import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeParser',
})
export class TimeParserPipe implements PipeTransform {
  transform(timeString: string): Date {
    // Assuming the timeString format is "HH:mm:ss"
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date;
  }
}
