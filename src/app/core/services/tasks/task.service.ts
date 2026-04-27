import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TaskRequest} from '../../../models/tasks/task-request';
import {Observable} from 'rxjs';
import {TaskModel} from '../../../models/tasks/task-model';
import {environment} from '../../../../environments/environment';
import {OrganizationHolderService} from '../organizations/organization-holder.service';
import {TaskFilterRequest} from '../../../models/tasks/task-filter-request';
import {FilterRequestToHttpParamsAdapter} from '../../adapter/filter-request-to-http-params-adapter.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly BASE_URI = '/api/organizations';

  constructor(
    private http: HttpClient,
    private holderService: OrganizationHolderService,
    private requestToHttpParamsAdapter: FilterRequestToHttpParamsAdapter
  ) {
  }

  public filterTasks(filterRequest: TaskFilterRequest) {
    const params = this.requestToHttpParamsAdapter.toHttpParams(filterRequest);

    const organizationId = this.holderService.getOrganizationId();

    return this.http.get(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/filter`, {params: params});
  }

  public getTask(taskId: string): Observable<TaskModel> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.get<TaskModel>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/${taskId}`);
  }

  public createTask(request: TaskRequest): Observable<TaskModel> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.post<TaskModel>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks`, request);
  }

  public updateTask(taskId: string, request: TaskRequest): Observable<TaskModel> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.put<TaskModel>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/${taskId}`, request);
  }

  public deleteTask(taskId: string): Observable<void> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.delete<void>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/${taskId}`);
  }

}
