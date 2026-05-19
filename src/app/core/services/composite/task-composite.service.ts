import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OrganizationHolderService} from '../organizations/organization-holder.service';
import {FilterRequestToHttpParamsAdapter} from '../../adapter/filter-request-to-http-params-adapter.service';
import {TaskFilterRequest} from '../../../models/tasks/task-filter-request';
import {Observable} from 'rxjs';
import {PageModel} from '../../../models/page/page-model';
import {environment} from '../../../../environments/environment';
import {DetailedTaskModel} from '../../../models/tasks/detailed-task-model';
import {TaskRequest} from '../../../models/tasks/task-request';

@Injectable({
  providedIn: 'root'
})
export class TaskCompositeService {

  private readonly BASE_URI = '/api/composite/organizations';

  constructor(
    private http: HttpClient,
    private holderService: OrganizationHolderService,
    private requestToHttpParamsAdapter: FilterRequestToHttpParamsAdapter
  ) {
  }

  public filterTasks(filterRequest: TaskFilterRequest): Observable<PageModel<DetailedTaskModel>> {
    const params = this.requestToHttpParamsAdapter.toHttpParams(filterRequest);

    const organizationId = this.holderService.getOrganizationId();

    return this.http.get<PageModel<DetailedTaskModel>>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/filter`, {params: params});
  }

  public getTask(taskId: string): Observable<DetailedTaskModel> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.get<DetailedTaskModel>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/${taskId}`);
  }

  public createTask(request: TaskRequest): Observable<DetailedTaskModel> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.post<DetailedTaskModel>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks`, request);
  }

  public updateTask(taskId: string, request: TaskRequest): Observable<DetailedTaskModel> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.put<DetailedTaskModel>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/${taskId}`, request);
  }

  public deleteTask(taskId: string): Observable<void> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.delete<void>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/${taskId}`);
  }

}
