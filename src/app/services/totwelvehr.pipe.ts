import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totwelvehr'
})
export class TotwelvehrPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
