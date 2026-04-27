import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OrganizationHolderService} from '../organizations/organization-holder.service';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TaskPriorityModel} from '../../../models/tasks/priorities/task-priority-model';
import {TaskPriorityRequest} from '../../../models/tasks/priorities/task-priority-request';


@Injectable({
  providedIn: 'root'
})
export class TaskPrioritiesService {

  private readonly BASE_URI = '/api/organizations';

  constructor(
    private http: HttpClient,
    private holderService: OrganizationHolderService,
  ) {
  }

  public getOrganizationTaskPriorities(): Observable<TaskPriorityModel[]> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.get<TaskPriorityModel[]>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/priorities`)
  }

  public getTaskPriority(priorityId: number): Observable<TaskPriorityModel> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.get<TaskPriorityModel>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/priorities/${priorityId}`)
  }

  public createTaskPriority(request: TaskPriorityRequest): Observable<TaskPriorityModel> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.post<TaskPriorityModel>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/priorities`, request)
  }

  public updateTaskPriority(priorityId: number, request: TaskPriorityRequest): Observable<TaskPriorityModel> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.put<TaskPriorityModel>(
      `${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/priorities/${priorityId}`, request
    )
  }

  public deleteTaskPriority(priorityId: number): Observable<void> {
    const organizationId = this.holderService.getOrganizationId();

    return this.http.delete<void>(`${environment.apiUrl}${this.BASE_URI}/${organizationId}/tasks/priorities/${priorityId}`)
  }


}
