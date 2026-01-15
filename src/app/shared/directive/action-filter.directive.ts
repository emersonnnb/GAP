import { Pipe, PipeTransform } from '@angular/core';
import { Actions } from '../interfaces';

@Pipe({
  name: 'actionFilter',
  standalone: true
})
export class ActionFilterPipe implements PipeTransform {
  transform(actions: Actions[], parameter?: any): any[] {
    return actions.filter((action) => {
      if (!action.conditional) return action;
      return typeof action.conditional === 'function'
        ? action.conditional(parameter)
        : action.conditional;
    });
  }
}
