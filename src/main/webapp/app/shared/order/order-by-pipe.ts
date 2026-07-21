import { inject, Pipe, PipeTransform } from '@angular/core';
import { OrderService } from '../../core/util/order-service';

@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  protected orderService = inject(OrderService);

  transform(array: any, sortBy: string, order?: string, type?: string): any[] {
    return this.orderService.sort(array, sortBy, order, type);
  }
}
