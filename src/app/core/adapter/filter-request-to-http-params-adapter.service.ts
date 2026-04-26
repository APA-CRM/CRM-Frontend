import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {BaseFilterRequest} from '../../models/filter/base-filter-request';

@Injectable({
  providedIn: 'root'
})
export class FilterRequestToHttpParamsAdapter {

  public toHttpParams(request: BaseFilterRequest): HttpParams {
    return this.addToHttpParams(request);
  }

  private addToHttpParams(
    obj: Record<string, any>,
    prefix = '',
    params = new HttpParams()
  ): HttpParams {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (value === null || value === undefined) {
        return acc;
      }

      if (Array.isArray(value)) {
        value.forEach(v => {
          acc = acc.append(fullKey, String(v));
        });
      } else if (typeof value === 'object' && !(value instanceof Date)) {
        acc = this.addToHttpParams(value, fullKey, acc);
      } else {
        const formattedValue = value instanceof Date ? value.toISOString() : String(value);
        acc = acc.set(fullKey, formattedValue);
      }

      return acc;
    }, params);
  }

}
