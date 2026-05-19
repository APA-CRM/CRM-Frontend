import {FilterRequestToHttpParamsAdapter} from './filter-request-to-http-params-adapter.service';
import {SortDirection} from '../enums/sort-direction';
import {BaseFilterRequest} from '../../models/filter/base-filter-request';
import {UsersFilterRequest} from '../../models/users/users-filter-request';

describe('FilterRequestToHttpParamsAdapterTest', () => {
  let service: FilterRequestToHttpParamsAdapter;

  beforeEach(() => {
    service = new FilterRequestToHttpParamsAdapter();
  });

  it('should map to http params when simple object', () => {
    expect(service).toBeTruthy();

    const baseFilterRequest: BaseFilterRequest = {
      page: 0,
      size: 10,
      sortBy: "id",
      sortDirection: SortDirection.DESC
    }

    const httpParams = service.toHttpParams(baseFilterRequest);

    expect(httpParams.get("page")).toEqual(String(baseFilterRequest.page));
    expect(httpParams.get("size")).toEqual(String(baseFilterRequest.size));
    expect(httpParams.get("sortBy")).toEqual(baseFilterRequest.sortBy);
    expect(httpParams.get("sortDirection")).toEqual(baseFilterRequest.sortDirection.toString());

  });

  it('should map to http params when complex object', () => {
    expect(service).toBeTruthy();

    const currentDate = new Date();

    const userFilterRequest: UsersFilterRequest = {
      email: "email",
      firstName: "firstName",
      lastName: "lastName",
      login: "login",
      rolesId: [1, 2],
      createdDate: {from: currentDate, to: currentDate},
      updatedDate: {from: currentDate, to: currentDate},
      page: 0,
      size: 10,
      sortBy: "id",
      sortDirection: SortDirection.DESC
    }

    const httpParams = service.toHttpParams(userFilterRequest);

    expect(httpParams.get("email")).toEqual(userFilterRequest.email!);
    expect(httpParams.get("firstName")).toEqual(userFilterRequest.firstName!);
    expect(httpParams.get("lastName")).toEqual(userFilterRequest.lastName!);
    expect(httpParams.get("login")).toEqual(userFilterRequest.login!);
    expect(httpParams.getAll("rolesId")).toEqual(userFilterRequest.rolesId?.map(value => String(value))!);
    expect(httpParams.get("createdDate.from")).toEqual(currentDate.toISOString());
    expect(httpParams.get("createdDate.to")).toEqual(currentDate.toISOString());
    expect(httpParams.get("updatedDate.from")).toEqual(currentDate.toISOString());
    expect(httpParams.get("updatedDate.to")).toEqual(currentDate.toISOString());
    expect(httpParams.get("page")).toEqual(String(userFilterRequest.page));
    expect(httpParams.get("size")).toEqual(String(userFilterRequest.size));
    expect(httpParams.get("sortBy")).toEqual(userFilterRequest.sortBy);
    expect(httpParams.get("sortDirection")).toEqual(userFilterRequest.sortDirection.toString());

  });
});
