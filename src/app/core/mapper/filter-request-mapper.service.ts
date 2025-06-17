import {Injectable} from '@angular/core';
import {UsersFilterRequest} from '../../models/users/users-filter-request';
import {HttpParams} from '@angular/common/http';
import {BaseFilterRequest} from '../../models/filter/base-filter-request';
import {RoleFilterRequest} from '../../models/roles/role-filter-request';

@Injectable({
  providedIn: 'root'
})
export class FilterRequestMapperService {

  public filterRequestToHttpParams(request: BaseFilterRequest): HttpParams {
    let params = new HttpParams()
      .set('page', request.page)
      .set('size', request.size)
      .set('sortDirection', request.sortDirection);

    this.setIfDefined(params, 'sortBy', request.sortBy);

    return params;
  }

  public mapUserFilterRequestToHttpParams(request: UsersFilterRequest): HttpParams {
    let params = this.filterRequestToHttpParams(request);

    params = this.setIfDefined(params, 'login', request.login);
    params = this.setIfDefined(params, 'email', request.email);
    params = this.setIfDefined(params, 'firstName', request.firstName);
    params = this.setIfDefined(params, 'lastName', request.lastName);

    if (request.createdDate) {
      params = this.setIfDefined(params, 'createdDate.from', request.createdDate.from);
      params = this.setIfDefined(params, 'createdDate.to', request.createdDate.to);
    }
    if (request.updatedDate) {
      params = this.setIfDefined(params, 'updatedDate.from', request.updatedDate.from);
      params = this.setIfDefined(params, 'updatedDate.to', request.updatedDate.to);
    }
    if (Array.isArray(request.rolesId) && request.rolesId.length) {
      params = params.set('rolesId', request.rolesId.join(','));
    }
    return params;
  }

  public mapRoleFilterRequestToHttpParams(request: RoleFilterRequest): HttpParams {
    let params = this.filterRequestToHttpParams(request);
    params = this.setIfDefined(params, 'name', request.name);
    return params;
  }

  private setIfDefined(params: HttpParams, key: string, value: any): HttpParams {
    if (value !== undefined && value !== null && value !== '') {
      return params.set(key, value.toString());
    }
    return params;
  }

}
