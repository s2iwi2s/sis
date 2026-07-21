/* eslint-disable no-console */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  sort(array: any, sortBy: string, order?: string, type?: string): any[] {
    const sortOrder = order ?? 'asc'; // setting default ascending order
    const sortType = type ?? 'string';
    console.log(`OrderService.sort() called with sortBy:${sortBy}, sortOrder: ${sortOrder}, sortType: ${sortType} => array:`, array);
    let optionsCopy = [];
    if (sortType === 'number') {
      optionsCopy = this.sortn(array, sortBy, sortOrder);
    } else if (sortType === 'string') {
      optionsCopy = this.sortStr(array, sortBy, order);
    }

    console.log('OrderService.sort() called return optionsCopy', optionsCopy);
    return optionsCopy;
  }

  sortStr(array: any, sortBy: string, order?: string): any[] {
    console.log('OrderService.sortStr() called with array:', array);
    const sortOrder = order ?? 'asc'; // setting default ascending order
    const optionsCopy = [...array];

    if (order === 'asc') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return optionsCopy.sort((a, b) => (b[sortBy] ?? '').localeCompare(a[sortBy] ?? ''));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return optionsCopy.sort((a, b) => (a[sortBy] ?? '').localeCompare(b[sortBy] ?? ''));
    }
  }

  sortn(array: any, sortBy: string, order?: string): any[] {
    console.log('OrderService.sortn() called with array:', array);
    const sortOrder = order ?? 'asc'; // setting default ascending order
    const optionsCopy = [...array];

    if (order === 'asc') {
      return optionsCopy.sort((a, b) => ((a[sortBy] ?? 0) < (b[sortBy] ?? 0) ? -1 : 1));
    } else {
      return optionsCopy.sort((a, b) => ((b[sortBy] ?? 0) > (a[sortBy] ?? 0) ? -1 : 1));
    }
  }
}
