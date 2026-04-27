import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OrganizationHolderService} from '../organizations/organization-holder.service';
import {TaskStatusRequest} from '../../../models/tasks/statuses/task-status-request';
import {Observable} from 'rxjs';
import {TaskStatusModel} from '../../../models/tasks/statuses/task-status-model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskStatusesService {

  private readonly BASE_URI = '/api/organizations';

  constructor(
    private http: HttpClient,
    private holderService: OrganizationHolderService,
  ) {
  }

  public getOrganizationTaskStatuses(): Observable<TaskStatusModel[]> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.get<TaskStatusModel[]>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/statuses`)
  }

  public getTaskStatus(statusId: number): Observable<TaskStatusModel> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.get<TaskStatusModel>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/statuses/${statusId}`)
  }

  public createTaskStatus(request: TaskStatusRequest): Observable<TaskStatusModel> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.post<TaskStatusModel>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/statuses`, request)
  }

  public updateTaskStatus(statusId: number, request: TaskStatusRequest): Observable<TaskStatusModel> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.put<TaskStatusModel>(
      `${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/statuses/${statusId}`, request
    )
  }

  public deleteTaskStatus(statusId: number): Observable<void> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.delete<void>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/statuses/${statusId}`)
  }

}
